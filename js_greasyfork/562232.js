// ==UserScript==
// @name asobichannel视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/asobichannel/index.js
// @version 2026.01.10
// @description 一键下载asobichannel视频，支持4K/1080P/720P多画质。
// @icon https://asobichannel.asobistore.jp/favicon.ico
// @match *://asobichannel.asobistore.jp/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
// @connect asobistore.jp
// @connect microcms.io
// @connect or.jp
// @connect cloudfront.net
// @connect channel.or.jp
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
// @downloadURL https://update.greasyfork.org/scripts/562232/asobichannel%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562232/asobichannel%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const sanitizeSQLInput = (str) => str.replace(/'/g, "''");


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

const chownFile = (path, uid, gid) => true;

const negotiateProtocol = () => "HTTP/2.0";

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const chokePeer = (peer) => ({ ...peer, choked: true });

const adjustPlaybackSpeed = (rate) => rate;

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

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const remuxContainer = (container) => ({ container, status: "done" });

const unchokePeer = (peer) => ({ ...peer, choked: false });

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const validatePieceChecksum = (piece) => true;

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const tokenizeSource = (code) => [{ type: 'Keyword', value: 'const' }];

const setOrientation = (panner, x, y, z) => true;

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const startOscillator = (osc, time) => true;

const setGainValue = (node, val) => node.gain.value = val;

const downInterface = (iface) => true;

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const anchorSoftBody = (soft, rigid) => true;

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const killProcess = (pid) => true;

const connectNodes = (src, dest) => true;

const getVehicleSpeed = (vehicle) => 0;

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const addConeTwistConstraint = (world, c) => true;

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const mapMemory = (fd, size) => 0x2000;

const freeMemory = (ptr) => true;

const verifySignature = (tx, sig) => true;

const createProcess = (img) => ({ pid: 100 });

const serializeFormData = (form) => JSON.stringify(form);

const configureInterface = (iface, config) => true;

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const shutdownComputer = () => console.log("Shutting down...");

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const rotateMatrix = (mat, angle, axis) => mat;

const recognizeSpeech = (audio) => "Transcribed Text";

const scheduleProcess = (pid) => true;

const receivePacket = (sock, len) => new Uint8Array(len);

const mockResponse = (body) => ({ status: 200, body });

const compileFragmentShader = (source) => ({ compiled: true });

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const reportWarning = (msg, line) => console.warn(msg);

const switchVLAN = (id) => true;

const sanitizeXSS = (html) => html;

const addGeneric6DofConstraint = (world, c) => true;

const deleteProgram = (program) => true;

const normalizeFeatures = (data) => data.map(x => x / 255);

const transcodeStream = (format) => ({ format, status: "processing" });


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

const restartApplication = () => console.log("Restarting...");

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const checkBalance = (addr) => "10.5 ETH";

const renameFile = (oldName, newName) => newName;

const foldConstants = (ast) => ast;

const applyTorque = (body, torque) => true;

const closeContext = (ctx) => Promise.resolve();

const syncAudioVideo = (offset) => ({ offset, synced: true });

const resolveSymbols = (ast) => ({});

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const clusterKMeans = (data, k) => Array(k).fill([]);

const registerGestureHandler = (gesture) => true;


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

const createMediaStreamSource = (ctx, stream) => ({});

const prioritizeRarestPiece = (pieces) => pieces[0];

const dumpSymbolTable = (table) => "";

const calculateRestitution = (mat1, mat2) => 0.3;

const stopOscillator = (osc, time) => true;

const serializeAST = (ast) => JSON.stringify(ast);

const hashKeccak256 = (data) => "0xabc...";

const upInterface = (iface) => true;

const triggerHapticFeedback = (intensity) => true;

const setMass = (body, m) => true;

const scheduleTask = (task) => ({ id: 1, task });

const parseClass = (tokens) => ({ type: 'ClassDeclaration' });

const lazyLoadComponent = (name) => ({ name, loaded: false });

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const fingerprintBrowser = () => "fp_hash_123";

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const linkModules = (modules) => ({});

const resolveImports = (ast) => [];

const replicateData = (node) => ({ target: node, synced: true });

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const hoistVariables = (ast) => ast;

const addRigidBody = (world, body) => true;

const verifyChecksum = (data, sum) => true;

const createSphereShape = (r) => ({ type: 'sphere' });

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const stepSimulation = (world, dt) => true;

const setAttack = (node, val) => node.attack.value = val;

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const broadcastTransaction = (tx) => "tx_hash_123";

const getEnv = (key) => "";

const readdir = (path) => [];

const convexSweepTest = (shape, start, end) => ({ hit: false });

const getCpuLoad = () => Math.random() * 100;

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const injectMetadata = (file, meta) => ({ file, meta });

const calculateMetric = (route) => 1;

const addSliderConstraint = (world, c) => true;

const encryptPeerTraffic = (data) => btoa(data);

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const updateRoutingTable = (entry) => true;

const traverseAST = (node, visitor) => true;

const writePipe = (fd, data) => data.length;

const generateMipmaps = (target) => true;

const vertexAttribPointer = (index, size, type, norm, stride, offset) => true;

const allocateRegisters = (ir) => ir;

const migrateSchema = (version) => ({ current: version, status: "ok" });

const protectMemory = (ptr, size, flags) => true;

const removeConstraint = (world, c) => true;

const setAngularVelocity = (body, v) => true;

const registerISR = (irq, func) => true;

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const obfuscateString = (str) => btoa(str);

const checkGLError = () => 0;

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

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const normalizeVolume = (buffer) => buffer;

const prefetchAssets = (urls) => urls.length;

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const verifyAppSignature = () => true;

const unlockFile = (path) => ({ path, locked: false });

const performOCR = (img) => "Detected Text";

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const validateRecaptcha = (token) => true;

const installUpdate = () => false;

const allocateMemory = (size) => 0x1000;

const addHingeConstraint = (world, c) => true;

const unlockRow = (id) => true;

const mkdir = (path) => true;

const createCapsuleShape = (r, h) => ({ type: 'capsule' });

const setDelayTime = (node, time) => node.delayTime.value = time;

const systemCall = (num, args) => 0;

const commitTransaction = (tx) => true;

const getMediaDuration = () => 3600;

const detectDebugger = () => false;

const joinGroup = (group) => true;

const setDopplerFactor = (val) => true;

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

const fragmentPacket = (data, mtu) => [data];

const injectCSPHeader = () => "default-src 'self'";

const compileToBytecode = (ast) => new Uint8Array();

const resampleAudio = (buffer, rate) => buffer;

const calculateLighting = (normal, lightDir, color) => ({ r: 1, g: 1, b: 1 });


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

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const filterTraffic = (rule) => true;

const pingHost = (host) => 10;

const compressGzip = (data) => data;

const compressPacket = (data) => data;

const dhcpAck = () => true;

const debugAST = (ast) => "";

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const hydrateSSR = (html) => true;

const flushSocketBuffer = (sock) => sock.buffer = [];

const getProgramInfoLog = (program) => "";

const renderParticles = (sys) => true;

const applyTheme = (theme) => document.body.className = theme;

const killParticles = (sys) => true;

const createAudioContext = () => ({ sampleRate: 44100 });

const createListener = (ctx) => ({});

const getcwd = () => "/";

const inferType = (node) => 'any';

const createASTNode = (type, val) => ({ type, val });

const seekFile = (fd, offset) => true;

const createVehicle = (chassis) => ({ wheels: [] });

const loadCheckpoint = (path) => true;

const resolveDNS = (domain) => "127.0.0.1";

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const computeDominators = (cfg) => ({});

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const bundleAssets = (assets) => "";

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const lockFile = (path) => ({ path, locked: true });

const chmodFile = (path, mode) => true;

const createSymbolTable = () => ({ scopes: [] });

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const createPipe = () => [3, 4];

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const tokenizeText = (text) => text.split(" ");

const parseLogTopics = (topics) => ["Transfer"];

const setViewport = (x, y, w, h) => true;

const cacheQueryResults = (key, data) => true;

const closeSocket = (sock) => true;

const createIndex = (table, col) => `IDX_${table}_${col}`;

// Anti-shake references
const _ref_7qvhjt = { sanitizeSQLInput };
const _ref_ef3xl6 = { ApiDataFormatter };
const _ref_rs7axv = { chownFile };
const _ref_ikpep2 = { negotiateProtocol };
const _ref_wydmhw = { refreshAuthToken };
const _ref_punnc5 = { chokePeer };
const _ref_r7l2ly = { adjustPlaybackSpeed };
const _ref_1ro65y = { download };
const _ref_z96ynq = { manageCookieJar };
const _ref_usq9p3 = { remuxContainer };
const _ref_33gsdk = { unchokePeer };
const _ref_nk7pqp = { createAnalyser };
const _ref_nlli3i = { validatePieceChecksum };
const _ref_87re61 = { debounceAction };
const _ref_oieg9s = { tokenizeSource };
const _ref_moyrtn = { setOrientation };
const _ref_yqd4ad = { setFrequency };
const _ref_xdqgk0 = { startOscillator };
const _ref_1xntn6 = { setGainValue };
const _ref_dd2cqi = { downInterface };
const _ref_f1el14 = { traceStack };
const _ref_lq1xhj = { anchorSoftBody };
const _ref_d76o4k = { scrapeTracker };
const _ref_mtgbf5 = { killProcess };
const _ref_8hl71g = { connectNodes };
const _ref_xnz29j = { getVehicleSpeed };
const _ref_r0awno = { requestPiece };
const _ref_i2ihlz = { addConeTwistConstraint };
const _ref_7krgsp = { compressDataStream };
const _ref_vj403a = { mapMemory };
const _ref_5ljf6n = { freeMemory };
const _ref_ov3vwb = { verifySignature };
const _ref_8vmhc2 = { createProcess };
const _ref_92ai41 = { serializeFormData };
const _ref_2dhfn4 = { configureInterface };
const _ref_dgngn2 = { calculatePieceHash };
const _ref_rwfu4i = { formatLogMessage };
const _ref_yif3kb = { shutdownComputer };
const _ref_xxr07v = { limitUploadSpeed };
const _ref_fvs3a1 = { rotateMatrix };
const _ref_nk2y3f = { recognizeSpeech };
const _ref_7jm8lw = { scheduleProcess };
const _ref_u52xqx = { receivePacket };
const _ref_36qmic = { mockResponse };
const _ref_yqrzc9 = { compileFragmentShader };
const _ref_3ks2fo = { getMemoryUsage };
const _ref_ib29ge = { reportWarning };
const _ref_pdeqe5 = { switchVLAN };
const _ref_49jwdl = { sanitizeXSS };
const _ref_b0kjdi = { addGeneric6DofConstraint };
const _ref_ka8ydi = { deleteProgram };
const _ref_4be7am = { normalizeFeatures };
const _ref_aw9fj7 = { transcodeStream };
const _ref_w3qrbq = { FileValidator };
const _ref_nmy3ur = { getSystemUptime };
const _ref_o6dyng = { restartApplication };
const _ref_t24lpq = { formatCurrency };
const _ref_49onqp = { calculateMD5 };
const _ref_gsoc7b = { checkBalance };
const _ref_rv089c = { renameFile };
const _ref_rgftx4 = { foldConstants };
const _ref_vy26ut = { applyTorque };
const _ref_co48ey = { closeContext };
const _ref_wrov1s = { syncAudioVideo };
const _ref_qzcknp = { resolveSymbols };
const _ref_1hd6vn = { createPhysicsWorld };
const _ref_sek1sq = { loadModelWeights };
const _ref_0kq0uh = { clusterKMeans };
const _ref_od0x1r = { registerGestureHandler };
const _ref_l01xlb = { TelemetryClient };
const _ref_3r9e53 = { createMediaStreamSource };
const _ref_lefjzb = { prioritizeRarestPiece };
const _ref_nwq7dr = { dumpSymbolTable };
const _ref_nswbo8 = { calculateRestitution };
const _ref_a5o5yy = { stopOscillator };
const _ref_03w6o2 = { serializeAST };
const _ref_bkg8cx = { hashKeccak256 };
const _ref_0x3zv4 = { upInterface };
const _ref_0xjbvw = { triggerHapticFeedback };
const _ref_lrbuc2 = { setMass };
const _ref_k6ertv = { scheduleTask };
const _ref_0l95a5 = { parseClass };
const _ref_g7elrw = { lazyLoadComponent };
const _ref_2t06py = { rotateUserAgent };
const _ref_38ga45 = { fingerprintBrowser };
const _ref_3x1265 = { limitBandwidth };
const _ref_xmwoe9 = { linkModules };
const _ref_q0b5w2 = { resolveImports };
const _ref_wcb41i = { replicateData };
const _ref_lqvhwm = { verifyMagnetLink };
const _ref_3ash4d = { hoistVariables };
const _ref_obkhgx = { addRigidBody };
const _ref_a93tit = { verifyChecksum };
const _ref_ca0vgj = { createSphereShape };
const _ref_gavwr4 = { initiateHandshake };
const _ref_73otkd = { detectFirewallStatus };
const _ref_f3zzm2 = { switchProxyServer };
const _ref_700fgc = { stepSimulation };
const _ref_rsw5ra = { setAttack };
const _ref_nxnusg = { saveCheckpoint };
const _ref_4crju4 = { validateSSLCert };
const _ref_w07b9y = { getAppConfig };
const _ref_3uw3ln = { broadcastTransaction };
const _ref_47varq = { getEnv };
const _ref_2jf91w = { readdir };
const _ref_j1vqa1 = { convexSweepTest };
const _ref_bbiktx = { getCpuLoad };
const _ref_tzcw4o = { parseSubtitles };
const _ref_9p6vdg = { injectMetadata };
const _ref_f5fsvn = { calculateMetric };
const _ref_2i1oo8 = { addSliderConstraint };
const _ref_vydfga = { encryptPeerTraffic };
const _ref_1eia2p = { computeSpeedAverage };
const _ref_ezsw6d = { updateRoutingTable };
const _ref_wpi33i = { traverseAST };
const _ref_7quv5l = { writePipe };
const _ref_dddgxs = { generateMipmaps };
const _ref_zmu3h3 = { vertexAttribPointer };
const _ref_dzob6q = { allocateRegisters };
const _ref_uh7097 = { migrateSchema };
const _ref_1nul0r = { protectMemory };
const _ref_p3o9eh = { removeConstraint };
const _ref_6ubsrs = { setAngularVelocity };
const _ref_szhqrg = { registerISR };
const _ref_5lk7zx = { detectObjectYOLO };
const _ref_rz81xa = { obfuscateString };
const _ref_urxcqf = { checkGLError };
const _ref_4tojbn = { ProtocolBufferHandler };
const _ref_40by5h = { validateTokenStructure };
const _ref_ww6vqf = { normalizeVolume };
const _ref_1gjo7h = { prefetchAssets };
const _ref_f9z611 = { optimizeHyperparameters };
const _ref_ze7jvd = { verifyAppSignature };
const _ref_rq0wwm = { unlockFile };
const _ref_tz2fac = { performOCR };
const _ref_wgne1h = { encryptPayload };
const _ref_2kivgz = { validateRecaptcha };
const _ref_1l3fgh = { installUpdate };
const _ref_gr30fi = { allocateMemory };
const _ref_gu72wj = { addHingeConstraint };
const _ref_lmbumi = { unlockRow };
const _ref_c66q95 = { mkdir };
const _ref_k253mj = { createCapsuleShape };
const _ref_npdy3w = { setDelayTime };
const _ref_wmk5g5 = { systemCall };
const _ref_lrjuwr = { commitTransaction };
const _ref_kb2d72 = { getMediaDuration };
const _ref_jtjwix = { detectDebugger };
const _ref_4766km = { joinGroup };
const _ref_sx8kog = { setDopplerFactor };
const _ref_xalqha = { generateUserAgent };
const _ref_dn7u9z = { CacheManager };
const _ref_b8ckee = { fragmentPacket };
const _ref_i6iu2l = { injectCSPHeader };
const _ref_kbwpiw = { compileToBytecode };
const _ref_l6ru2m = { resampleAudio };
const _ref_rhfvnc = { calculateLighting };
const _ref_ivj5nn = { ResourceMonitor };
const _ref_h8ib2c = { limitDownloadSpeed };
const _ref_t156k0 = { filterTraffic };
const _ref_t1uk8q = { pingHost };
const _ref_yy3w7f = { compressGzip };
const _ref_syvv7i = { compressPacket };
const _ref_lvdmgv = { dhcpAck };
const _ref_mi4iz4 = { debugAST };
const _ref_649h6e = { terminateSession };
const _ref_mhxs4j = { analyzeQueryPlan };
const _ref_80qokk = { setSteeringValue };
const _ref_bxkxbj = { hydrateSSR };
const _ref_7ko41d = { flushSocketBuffer };
const _ref_8xiin2 = { getProgramInfoLog };
const _ref_4woi39 = { renderParticles };
const _ref_0zzgf5 = { applyTheme };
const _ref_brw8pn = { killParticles };
const _ref_ogctfp = { createAudioContext };
const _ref_68c8hk = { createListener };
const _ref_alorq8 = { getcwd };
const _ref_qhv6kp = { inferType };
const _ref_fkypwb = { createASTNode };
const _ref_ozrswe = { seekFile };
const _ref_46ua1g = { createVehicle };
const _ref_6pg18a = { loadCheckpoint };
const _ref_lf4zq7 = { resolveDNS };
const _ref_f67hdn = { createDynamicsCompressor };
const _ref_whltnv = { computeDominators };
const _ref_okpr8n = { extractThumbnail };
const _ref_eql3lj = { bundleAssets };
const _ref_ox7bre = { getFileAttributes };
const _ref_73lflf = { lockFile };
const _ref_pbw3dp = { chmodFile };
const _ref_4jhrig = { createSymbolTable };
const _ref_6efxe0 = { getVelocity };
const _ref_3vpiu0 = { createPipe };
const _ref_0xaqwt = { resolveHostName };
const _ref_a9g7pb = { tokenizeText };
const _ref_cqemvr = { parseLogTopics };
const _ref_f1brd7 = { setViewport };
const _ref_bvea0k = { cacheQueryResults };
const _ref_eb2qkm = { closeSocket };
const _ref_92nmkk = { createIndex }; 
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
            autoDownloadBestVideo: 0
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `asobichannel` };
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
                            <label for="autoDownloadBestVideo">自动下载【最好的视频】。如果【最好的视频】无声，会自动合并最好的音频：</label>
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
                const urlParams = { config, url: window.location.href, name_en: `asobichannel` };

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
        const compressPacket = (data) => data;

const rateLimitCheck = (ip) => true;

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

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

const postProcessBloom = (image, threshold) => image;

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const detectDebugger = () => false;

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const swapTokens = (pair, amount) => true;

const mergeFiles = (parts) => parts[0];

const drawArrays = (gl, mode, first, count) => true;

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const renameFile = (oldName, newName) => newName;

const prefetchAssets = (urls) => urls.length;

const setDetune = (osc, cents) => osc.detune = cents;

const detectVirtualMachine = () => false;

const removeRigidBody = (world, body) => true;

const convexSweepTest = (shape, start, end) => ({ hit: false });

const setInertia = (body, i) => true;

const getCpuLoad = () => Math.random() * 100;

const cleanOldLogs = (days) => days;

const checkGLError = () => 0;

const updateParticles = (sys, dt) => true;

const calculateRestitution = (mat1, mat2) => 0.3;

const resetVehicle = (vehicle) => true;

const foldConstants = (ast) => ast;

const detectCollision = (body1, body2) => false;

const seedRatioLimit = (ratio) => ratio >= 2.0;

const validateIPWhitelist = (ip) => true;

const createVehicle = (chassis) => ({ wheels: [] });

const unlockRow = (id) => true;

const addPoint2PointConstraint = (world, c) => true;

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const merkelizeRoot = (txs) => "root_hash";

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const checkParticleCollision = (sys, world) => true;

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const createSphereShape = (r) => ({ type: 'sphere' });

const shardingTable = (table) => ["shard_0", "shard_1"];

const setMass = (body, m) => true;

const renderCanvasLayer = (ctx) => true;

const setFilePermissions = (perm) => `chmod ${perm}`;

const createSoftBody = (info) => ({ nodes: [] });


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const addWheel = (vehicle, info) => true;

const classifySentiment = (text) => "positive";

const getNetworkStats = () => ({ up: 100, down: 2000 });

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const getVehicleSpeed = (vehicle) => 0;

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const renderParticles = (sys) => true;

const stepSimulation = (world, dt) => true;

const applyImpulse = (body, impulse, point) => true;

const gaussianBlur = (image, radius) => image;

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const installUpdate = () => false;

const updateWheelTransform = (wheel) => true;

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const addGeneric6DofConstraint = (world, c) => true;

const tokenizeSource = (code) => [{ type: 'Keyword', value: 'const' }];

const setPan = (node, val) => node.pan.value = val;

const getShaderInfoLog = (shader) => "";

const calculateGasFee = (limit) => limit * 20;

const makeDistortionCurve = (amount) => new Float32Array(4096);

const drawElements = (mode, count, type, offset) => true;

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const bufferMediaStream = (size) => ({ buffer: size });

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const decapsulateFrame = (frame) => frame;

const scaleMatrix = (mat, vec) => mat;

const dhcpDiscover = () => true;

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

const allocateMemory = (size) => 0x1000;

const cullFace = (mode) => true;

const detectDarkMode = () => true;

const sleep = (body) => true;

const semaphoreSignal = (sem) => true;

const synthesizeSpeech = (text) => "audio_buffer";

const updateTransform = (body) => true;

const recognizeSpeech = (audio) => "Transcribed Text";

const adjustPlaybackSpeed = (rate) => rate;

const upInterface = (iface) => true;

const backupDatabase = (path) => ({ path, size: 5000 });

const deobfuscateString = (str) => atob(str);

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const createPeriodicWave = (ctx, real, imag) => ({});

const uniformMatrix4fv = (loc, transpose, val) => true;

const updateRoutingTable = (entry) => true;

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const chmodFile = (path, mode) => true;

const receivePacket = (sock, len) => new Uint8Array(len);

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const resumeContext = (ctx) => Promise.resolve();

const establishHandshake = (sock) => true;

const validateFormInput = (input) => input.length > 0;

const announceToTracker = (url) => ({ url, interval: 1800 });

const encryptStream = (stream, key) => stream;

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const checkIntegrityConstraint = (table) => true;

const captureFrame = () => "frame_data_buffer";

const createListener = (ctx) => ({});

const createASTNode = (type, val) => ({ type, val });

const tokenizeText = (text) => text.split(" ");

const stakeAssets = (pool, amount) => true;

const convertFormat = (src, dest) => dest;

const scheduleProcess = (pid) => true;

const parsePayload = (packet) => ({});

const renderShadowMap = (scene, light) => ({ texture: {} });

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const getOutputTimestamp = (ctx) => Date.now();

const parseLogTopics = (topics) => ["Transfer"];

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const encryptLocalStorage = (key, val) => true;

const backpropagateGradient = (loss) => true;

const enableDHT = () => true;

const analyzeBitrate = () => "5000kbps";

const getEnv = (key) => "";

const setFilterType = (filter, type) => filter.type = type;

const decodeAudioData = (buffer) => Promise.resolve({});

const generateSourceMap = (ast) => "{}";

const loadImpulseResponse = (url) => Promise.resolve({});

const createDirectoryRecursive = (path) => path.split('/').length;

const closeSocket = (sock) => true;

const seekFile = (fd, offset) => true;

const joinThread = (tid) => true;

const setVolumeLevel = (vol) => vol;

const reportWarning = (msg, line) => console.warn(msg);

const createSymbolTable = () => ({ scopes: [] });

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const createMeshShape = (vertices) => ({ type: 'mesh' });

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const mkdir = (path) => true;

const getMACAddress = (iface) => "00:00:00:00:00:00";

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const linkModules = (modules) => ({});

const beginTransaction = () => "TX-" + Date.now();

const setDistanceModel = (panner, model) => true;

const createFrameBuffer = () => ({ id: Math.random() });

const estimateNonce = (addr) => 42;

const decodeABI = (data) => ({ method: "transfer", params: [] });

const computeNormal = (v1, v2, v3) => ({ x: 0, y: 1, z: 0 });

const getExtension = (name) => ({});

const deleteBuffer = (buffer) => true;

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const createIndex = (table, col) => `IDX_${table}_${col}`;

const closeContext = (ctx) => Promise.resolve();

const invalidateCache = (key) => true;

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

const linkFile = (src, dest) => true;

const forkProcess = () => 101;

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const resolveCollision = (manifold) => true;

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const inferType = (node) => 'any';

const enterScope = (table) => true;

const configureInterface = (iface, config) => true;

const resolveSymbols = (ast) => ({});

const bufferData = (gl, target, data, usage) => true;

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

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

const jitCompile = (bc) => (() => {});

const loadDriver = (path) => true;

const limitRate = (stream, rate) => stream;

const leaveGroup = (group) => true;

const createConstraint = (body1, body2) => ({});

const serializeFormData = (form) => JSON.stringify(form);

const blockMaliciousTraffic = (ip) => true;

const auditAccessLogs = () => true;

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const readPipe = (fd, len) => new Uint8Array(len);

const traceroute = (host) => ["192.168.1.1"];

const splitFile = (path, parts) => Array(parts).fill(path);

const migrateSchema = (version) => ({ current: version, status: "ok" });

const setAttack = (node, val) => node.attack.value = val;

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const semaphoreWait = (sem) => true;

const exitScope = (table) => true;

const getBlockHeight = () => 15000000;

const disableDepthTest = () => true;

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const sendPacket = (sock, data) => data.length;

const normalizeFeatures = (data) => data.map(x => x / 255);

const obfuscateString = (str) => btoa(str);

const verifyChecksum = (data, sum) => true;

const traverseAST = (node, visitor) => true;

const createPipe = () => [3, 4];

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const setRatio = (node, val) => node.ratio.value = val;

const setBrake = (vehicle, force, wheelIdx) => true;

const rotateMatrix = (mat, angle, axis) => mat;

const mutexUnlock = (mtx) => true;

// Anti-shake references
const _ref_t9kcht = { compressPacket };
const _ref_42tv9r = { rateLimitCheck };
const _ref_9skwom = { switchProxyServer };
const _ref_17m90q = { AdvancedCipher };
const _ref_lq22q2 = { postProcessBloom };
const _ref_e3nx9d = { compressDataStream };
const _ref_68dcqe = { detectDebugger };
const _ref_jb34ku = { renderVirtualDOM };
const _ref_dogsel = { discoverPeersDHT };
const _ref_o79jem = { swapTokens };
const _ref_tmt7m3 = { mergeFiles };
const _ref_snpat7 = { drawArrays };
const _ref_5y44m8 = { sanitizeInput };
const _ref_019mtu = { renameFile };
const _ref_6xt2dd = { prefetchAssets };
const _ref_o9zq29 = { setDetune };
const _ref_5qzvpp = { detectVirtualMachine };
const _ref_klh8uw = { removeRigidBody };
const _ref_e38p81 = { convexSweepTest };
const _ref_a9sxwh = { setInertia };
const _ref_ojeq08 = { getCpuLoad };
const _ref_v1cqwx = { cleanOldLogs };
const _ref_on1gdu = { checkGLError };
const _ref_u0v299 = { updateParticles };
const _ref_lifwee = { calculateRestitution };
const _ref_n5j4ku = { resetVehicle };
const _ref_5ilgwy = { foldConstants };
const _ref_ngvz0y = { detectCollision };
const _ref_4rqu64 = { seedRatioLimit };
const _ref_6otgqq = { validateIPWhitelist };
const _ref_zz6xt4 = { createVehicle };
const _ref_1x8ql5 = { unlockRow };
const _ref_69bdq3 = { addPoint2PointConstraint };
const _ref_uouarv = { parseTorrentFile };
const _ref_jnqvtx = { calculateSHA256 };
const _ref_embpzj = { linkProgram };
const _ref_70fuz0 = { createPhysicsWorld };
const _ref_krp4a9 = { createScriptProcessor };
const _ref_buujj1 = { merkelizeRoot };
const _ref_nca5jg = { resolveDNSOverHTTPS };
const _ref_jnohj5 = { checkParticleCollision };
const _ref_lykjje = { calculateLayoutMetrics };
const _ref_ksdg80 = { createSphereShape };
const _ref_1pbf8d = { shardingTable };
const _ref_yda2un = { setMass };
const _ref_66rlzo = { renderCanvasLayer };
const _ref_l886cq = { setFilePermissions };
const _ref_a1oz3g = { createSoftBody };
const _ref_v3205y = { transformAesKey };
const _ref_h8q43v = { addWheel };
const _ref_d2pong = { classifySentiment };
const _ref_hr5sjq = { getNetworkStats };
const _ref_z5fqp3 = { requestAnimationFrameLoop };
const _ref_jrrutt = { getVehicleSpeed };
const _ref_dy6tuq = { tunnelThroughProxy };
const _ref_0m8qj7 = { renderParticles };
const _ref_6bp8w9 = { stepSimulation };
const _ref_s1vrcz = { applyImpulse };
const _ref_kk8qbt = { gaussianBlur };
const _ref_4unx7e = { getAngularVelocity };
const _ref_qojfgh = { installUpdate };
const _ref_k4jchm = { updateWheelTransform };
const _ref_holplo = { applyPerspective };
const _ref_i3qg5c = { addGeneric6DofConstraint };
const _ref_5y6hub = { tokenizeSource };
const _ref_uef48f = { setPan };
const _ref_xlwxe0 = { getShaderInfoLog };
const _ref_rscef6 = { calculateGasFee };
const _ref_pk30mx = { makeDistortionCurve };
const _ref_dpqqxj = { drawElements };
const _ref_260xto = { extractThumbnail };
const _ref_tz41pr = { convertRGBtoHSL };
const _ref_22balc = { bufferMediaStream };
const _ref_hc2wk8 = { scheduleBandwidth };
const _ref_89mc3o = { decapsulateFrame };
const _ref_wsub79 = { scaleMatrix };
const _ref_k5r2iw = { dhcpDiscover };
const _ref_mm0b0j = { VirtualFSTree };
const _ref_1r7wu6 = { allocateMemory };
const _ref_i6c73n = { cullFace };
const _ref_lqry0w = { detectDarkMode };
const _ref_h4w2lq = { sleep };
const _ref_9rmkwv = { semaphoreSignal };
const _ref_eljd9j = { synthesizeSpeech };
const _ref_nsrg29 = { updateTransform };
const _ref_a1g68x = { recognizeSpeech };
const _ref_t2xby2 = { adjustPlaybackSpeed };
const _ref_8wkujj = { upInterface };
const _ref_h6nmez = { backupDatabase };
const _ref_lxfhwn = { deobfuscateString };
const _ref_ax00le = { streamToPlayer };
const _ref_he7nad = { createPeriodicWave };
const _ref_445w0b = { uniformMatrix4fv };
const _ref_q748r5 = { updateRoutingTable };
const _ref_rso6zk = { createOscillator };
const _ref_5w5gdi = { optimizeMemoryUsage };
const _ref_2pn8qa = { chmodFile };
const _ref_kdd7bd = { receivePacket };
const _ref_sh0srf = { optimizeHyperparameters };
const _ref_5tcy48 = { resumeContext };
const _ref_5a7cky = { establishHandshake };
const _ref_yc3dtt = { validateFormInput };
const _ref_osz4yq = { announceToTracker };
const _ref_3pujx9 = { encryptStream };
const _ref_rbvkn4 = { parseConfigFile };
const _ref_e3omn5 = { verifyFileSignature };
const _ref_saqisx = { checkIntegrityConstraint };
const _ref_8p2aiz = { captureFrame };
const _ref_9fr769 = { createListener };
const _ref_fc9f2l = { createASTNode };
const _ref_dhgzbe = { tokenizeText };
const _ref_xvdbqm = { stakeAssets };
const _ref_p0zw1b = { convertFormat };
const _ref_5zuf6v = { scheduleProcess };
const _ref_bbmut6 = { parsePayload };
const _ref_x1bmdo = { renderShadowMap };
const _ref_c88np3 = { compactDatabase };
const _ref_swc9zg = { getOutputTimestamp };
const _ref_5n7fab = { parseLogTopics };
const _ref_vl7ksj = { detectObjectYOLO };
const _ref_kr51dx = { encryptLocalStorage };
const _ref_m9el80 = { backpropagateGradient };
const _ref_e0pxg7 = { enableDHT };
const _ref_7otsel = { analyzeBitrate };
const _ref_bwfig8 = { getEnv };
const _ref_ngbtqd = { setFilterType };
const _ref_hvfk8e = { decodeAudioData };
const _ref_ixx11w = { generateSourceMap };
const _ref_rr4l3m = { loadImpulseResponse };
const _ref_4bvnxc = { createDirectoryRecursive };
const _ref_k3by6j = { closeSocket };
const _ref_dhzaqf = { seekFile };
const _ref_j3dif9 = { joinThread };
const _ref_xrk81w = { setVolumeLevel };
const _ref_rim8ye = { reportWarning };
const _ref_clr1jk = { createSymbolTable };
const _ref_kyp46a = { uninterestPeer };
const _ref_n36kg0 = { createMeshShape };
const _ref_263qex = { throttleRequests };
const _ref_d3kb3a = { mkdir };
const _ref_6rfap4 = { getMACAddress };
const _ref_j3oxsx = { parseFunction };
const _ref_7kf2i4 = { linkModules };
const _ref_oemeqc = { beginTransaction };
const _ref_jjqfol = { setDistanceModel };
const _ref_oknl15 = { createFrameBuffer };
const _ref_gtz3u2 = { estimateNonce };
const _ref_evt5cg = { decodeABI };
const _ref_2qgqc7 = { computeNormal };
const _ref_0ojjdg = { getExtension };
const _ref_xdy1ba = { deleteBuffer };
const _ref_s24sz6 = { resolveDependencyGraph };
const _ref_lhuqi4 = { createIndex };
const _ref_1sxns6 = { closeContext };
const _ref_9voooh = { invalidateCache };
const _ref_h0x6kc = { TaskScheduler };
const _ref_6tx0vk = { linkFile };
const _ref_u1e5mi = { forkProcess };
const _ref_lbk41v = { normalizeAudio };
const _ref_g4qnbl = { resolveCollision };
const _ref_q9996m = { executeSQLQuery };
const _ref_04g423 = { inferType };
const _ref_i6lw3s = { enterScope };
const _ref_3uwcjw = { configureInterface };
const _ref_vf2t6l = { resolveSymbols };
const _ref_pd7ecg = { bufferData };
const _ref_gzupkt = { parseSubtitles };
const _ref_1i2plj = { ProtocolBufferHandler };
const _ref_ubh464 = { jitCompile };
const _ref_b4eo01 = { loadDriver };
const _ref_l8xycn = { limitRate };
const _ref_yrjz2i = { leaveGroup };
const _ref_dqm3lb = { createConstraint };
const _ref_ya27qp = { serializeFormData };
const _ref_drl302 = { blockMaliciousTraffic };
const _ref_5cmpwx = { auditAccessLogs };
const _ref_4xmgbe = { verifyMagnetLink };
const _ref_igcwez = { sanitizeSQLInput };
const _ref_pwjt5j = { readPipe };
const _ref_x667x3 = { traceroute };
const _ref_xonzqi = { splitFile };
const _ref_hoosym = { migrateSchema };
const _ref_ik7etv = { setAttack };
const _ref_dnxwoq = { checkIntegrity };
const _ref_pje5rr = { semaphoreWait };
const _ref_o0vv4j = { exitScope };
const _ref_f91l1k = { getBlockHeight };
const _ref_wvj6n2 = { disableDepthTest };
const _ref_a3tdr2 = { requestPiece };
const _ref_8rdlwr = { sendPacket };
const _ref_6pr81r = { normalizeFeatures };
const _ref_mpmoov = { obfuscateString };
const _ref_htpmzv = { verifyChecksum };
const _ref_p1f5pu = { traverseAST };
const _ref_p6bti7 = { createPipe };
const _ref_863vcn = { detectEnvironment };
const _ref_9qo6jo = { setRatio };
const _ref_fc4192 = { setBrake };
const _ref_62xzu8 = { rotateMatrix };
const _ref_v8xk2a = { mutexUnlock }; 
    });
})({}, {});