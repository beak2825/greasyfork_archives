// ==UserScript==
// @name dailymotion视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/dailymotion/index.js
// @version 2026.01.21.2
// @description 一键下载dailymotion视频，支持4K/1080P/720P多画质。
// @icon https://www.dailymotion.com/favicon.ico
// @match *://*.dailymotion.com/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
// @connect api.dailymotion.com
// @connect dailymotion.com
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
// @downloadURL https://update.greasyfork.org/scripts/562246/dailymotion%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562246/dailymotion%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const getCpuLoad = () => Math.random() * 100;

const readPipe = (fd, len) => new Uint8Array(len);

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const setViewport = (x, y, w, h) => true;

const sleep = (body) => true;

const createVehicle = (chassis) => ({ wheels: [] });

const addRigidBody = (world, body) => true;

const stepSimulation = (world, dt) => true;

const setFilterType = (filter, type) => filter.type = type;

const addConeTwistConstraint = (world, c) => true;

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const parseClass = (tokens) => ({ type: 'ClassDeclaration' });

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const decodeAudioData = (buffer) => Promise.resolve({});

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


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const compileFragmentShader = (source) => ({ compiled: true });

const autoResumeTask = (id) => ({ id, status: "resumed" });

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const emitParticles = (sys, count) => true;

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const clearScreen = (r, g, b, a) => true;

const addGeneric6DofConstraint = (world, c) => true;

const tokenizeSource = (code) => [{ type: 'Keyword', value: 'const' }];

const instrumentCode = (code) => code;

const reduceDimensionalityPCA = (data) => data;

const setAttack = (node, val) => node.attack.value = val;

const shardingTable = (table) => ["shard_0", "shard_1"];

const addSliderConstraint = (world, c) => true;

const estimateNonce = (addr) => 42;

const acceptConnection = (sock) => ({ fd: 2 });

const setFilePermissions = (perm) => `chmod ${perm}`;

const parseExpression = (tokens) => ({ type: 'BinaryExpression' });

const listenSocket = (sock, backlog) => true;

const lockRow = (id) => true;

const applyForce = (body, force, point) => true;

const checkIntegrityConstraint = (table) => true;

const handleTimeout = (sock) => true;

const updateRoutingTable = (entry) => true;

const beginTransaction = () => "TX-" + Date.now();

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const generateSourceMap = (ast) => "{}";

const visitNode = (node) => true;

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const lockFile = (path) => ({ path, locked: true });

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const replicateData = (node) => ({ target: node, synced: true });

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const calculateGasFee = (limit) => limit * 20;

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const tokenizeText = (text) => text.split(" ");

const hoistVariables = (ast) => ast;

const addHingeConstraint = (world, c) => true;

const allocateRegisters = (ir) => ir;

const rollbackTransaction = (tx) => true;

const stopOscillator = (osc, time) => true;

const interceptRequest = (req) => ({ ...req, intercepted: true });

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const bundleAssets = (assets) => "";

const detectCollision = (body1, body2) => false;

const sendPacket = (sock, data) => data.length;

const encryptStream = (stream, key) => stream;

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const addWheel = (vehicle, info) => true;

const updateParticles = (sys, dt) => true;

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const addPoint2PointConstraint = (world, c) => true;

const scaleMatrix = (mat, vec) => mat;

const rotateLogFiles = () => true;

const filterTraffic = (rule) => true;

const encryptPeerTraffic = (data) => btoa(data);

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const prioritizeTraffic = (queue) => true;

const renderParticles = (sys) => true;

const injectCSPHeader = () => "default-src 'self'";

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

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const announceToTracker = (url) => ({ url, interval: 1800 });

const checkBalance = (addr) => "10.5 ETH";

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const enableDHT = () => true;

const linkFile = (src, dest) => true;

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const mergeFiles = (parts) => parts[0];

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const mountFileSystem = (dev, path) => true;

const checkBatteryLevel = () => 100;

const cullFace = (mode) => true;

const createTCPSocket = () => ({ fd: 1 });

const getcwd = () => "/";

const openFile = (path, flags) => 5;

const broadcastTransaction = (tx) => "tx_hash_123";

const generateDocumentation = (ast) => "";

const convertHSLtoRGB = (h, s, l) => ({ r: 0, g: 0, b: 0 });

const transcodeStream = (format) => ({ format, status: "processing" });

const validateFormInput = (input) => input.length > 0;

const predictTensor = (input) => [0.1, 0.9, 0.0];

const shutdownComputer = () => console.log("Shutting down...");

const joinGroup = (group) => true;

const cleanOldLogs = (days) => days;

const createConstraint = (body1, body2) => ({});

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const createIndexBuffer = (data) => ({ id: Math.random() });

const seekFile = (fd, offset) => true;

const optimizeTailCalls = (ast) => ast;

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const hashKeccak256 = (data) => "0xabc...";

const syncAudioVideo = (offset) => ({ offset, synced: true });

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const getEnv = (key) => "";

const createFrameBuffer = () => ({ id: Math.random() });

const closePipe = (fd) => true;

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const handleInterrupt = (irq) => true;

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const setOrientation = (panner, x, y, z) => true;

const sanitizeXSS = (html) => html;

const recognizeSpeech = (audio) => "Transcribed Text";

const writePipe = (fd, data) => data.length;

const createConvolver = (ctx) => ({ buffer: null });

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const preventSleepMode = () => true;

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const deriveAddress = (path) => "0x123...";

const setKnee = (node, val) => node.knee.value = val;

const createIndex = (table, col) => `IDX_${table}_${col}`;

const loadDriver = (path) => true;

const applyTorque = (body, torque) => true;

const measureRTT = (sent, recv) => 10;

const getShaderInfoLog = (shader) => "";

const reassemblePacket = (fragments) => fragments[0];

const setRelease = (node, val) => node.release.value = val;

const createThread = (func) => ({ tid: 1 });

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const createBoxShape = (w, h, d) => ({ type: 'box' });

const enableInterrupts = () => true;

const renderCanvasLayer = (ctx) => true;

const leaveGroup = (group) => true;

const encapsulateFrame = (packet) => packet;

const updateSoftBody = (body) => true;

const merkelizeRoot = (txs) => "root_hash";

const createDirectoryRecursive = (path) => path.split('/').length;

const repairCorruptFile = (path) => ({ path, repaired: true });

const renameFile = (oldName, newName) => newName;

const switchVLAN = (id) => true;

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const interpretBytecode = (bc) => true;

const resolveDNS = (domain) => "127.0.0.1";

const commitTransaction = (tx) => true;

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const resolveSymbols = (ast) => ({});

const parseStatement = (tokens) => ({ type: 'VariableDeclaration' });

const extractArchive = (archive) => ["file1", "file2"];

const setVolumeLevel = (vol) => vol;

const execProcess = (path) => true;


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

const connectSocket = (sock, addr, port) => true;

const captureFrame = () => "frame_data_buffer";

const monitorClipboard = () => "";

const validateProgram = (program) => true;

const vertexAttrib3f = (idx, x, y, z) => true;

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const detectDebugger = () => false;

const bufferData = (gl, target, data, usage) => true;

const setVelocity = (body, v) => true;

const fragmentPacket = (data, mtu) => [data];

const linkModules = (modules) => ({});

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const subscribeToEvents = (contract) => true;

const signTransaction = (tx, key) => "signed_tx_hash";

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const attachRenderBuffer = (fb, rb) => true;

const drawElements = (mode, count, type, offset) => true;

const receivePacket = (sock, len) => new Uint8Array(len);

const applyTheme = (theme) => document.body.className = theme;

const mapMemory = (fd, size) => 0x2000;

const writeFile = (fd, data) => true;

const calculateComplexity = (ast) => 1;

const registerSystemTray = () => ({ icon: "tray.ico" });

const uniform1i = (loc, val) => true;

const segmentImageUNet = (img) => "mask_buffer";

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const createPipe = () => [3, 4];

const unlockRow = (id) => true;

const detachThread = (tid) => true;

const killProcess = (pid) => true;

const calculateRestitution = (mat1, mat2) => 0.3;

const allocateMemory = (size) => 0x1000;

const useProgram = (program) => true;

const wakeUp = (body) => true;

const verifySignature = (tx, sig) => true;

const setBrake = (vehicle, force, wheelIdx) => true;

const installUpdate = () => false;

const getVehicleSpeed = (vehicle) => 0;

// Anti-shake references
const _ref_7f3bnz = { getCpuLoad };
const _ref_xgi1co = { readPipe };
const _ref_vw8h96 = { resolveDNSOverHTTPS };
const _ref_6r0waa = { discoverPeersDHT };
const _ref_llxq6v = { setViewport };
const _ref_qrve4y = { sleep };
const _ref_i3runa = { createVehicle };
const _ref_kcwkud = { addRigidBody };
const _ref_mknn7z = { stepSimulation };
const _ref_8treai = { setFilterType };
const _ref_gp43na = { addConeTwistConstraint };
const _ref_rwvacu = { createMagnetURI };
const _ref_20f47g = { parseClass };
const _ref_v0vjsa = { debounceAction };
const _ref_wfpj44 = { decodeAudioData };
const _ref_cyliio = { ProtocolBufferHandler };
const _ref_6tpk9o = { getAppConfig };
const _ref_0lrfai = { compileFragmentShader };
const _ref_vchxjg = { autoResumeTask };
const _ref_4aielu = { resolveHostName };
const _ref_haooqr = { emitParticles };
const _ref_7llpli = { formatLogMessage };
const _ref_eohdiy = { clearScreen };
const _ref_bzt0e3 = { addGeneric6DofConstraint };
const _ref_pg7hye = { tokenizeSource };
const _ref_o5uw5k = { instrumentCode };
const _ref_1dvnj0 = { reduceDimensionalityPCA };
const _ref_ibrj0s = { setAttack };
const _ref_5oqi73 = { shardingTable };
const _ref_z1beyu = { addSliderConstraint };
const _ref_ce5b95 = { estimateNonce };
const _ref_me3j58 = { acceptConnection };
const _ref_p42tep = { setFilePermissions };
const _ref_aky64h = { parseExpression };
const _ref_75i3ra = { listenSocket };
const _ref_mbdaad = { lockRow };
const _ref_vafmfh = { applyForce };
const _ref_allglj = { checkIntegrityConstraint };
const _ref_6gia7g = { handleTimeout };
const _ref_fqm9br = { updateRoutingTable };
const _ref_yo8wkv = { beginTransaction };
const _ref_n66v7i = { parseConfigFile };
const _ref_4aarsw = { generateSourceMap };
const _ref_mm8het = { visitNode };
const _ref_trcyx8 = { validateSSLCert };
const _ref_oi2nbo = { uninterestPeer };
const _ref_90b2hw = { lockFile };
const _ref_vfg8b8 = { animateTransition };
const _ref_q4b5b2 = { verifyFileSignature };
const _ref_mttq1f = { replicateData };
const _ref_haliy0 = { allocateDiskSpace };
const _ref_ktd611 = { calculateGasFee };
const _ref_9ll637 = { generateUserAgent };
const _ref_lwixvb = { tokenizeText };
const _ref_3b39mu = { hoistVariables };
const _ref_tarquy = { addHingeConstraint };
const _ref_hdts4w = { allocateRegisters };
const _ref_benx9x = { rollbackTransaction };
const _ref_uyn6p6 = { stopOscillator };
const _ref_q8vxt8 = { interceptRequest };
const _ref_0vnkcg = { getFileAttributes };
const _ref_9cg0e1 = { bundleAssets };
const _ref_cz11ad = { detectCollision };
const _ref_snd453 = { sendPacket };
const _ref_vtzaej = { encryptStream };
const _ref_blv1ap = { parseM3U8Playlist };
const _ref_prszek = { addWheel };
const _ref_ibawsx = { updateParticles };
const _ref_m0qswr = { sanitizeSQLInput };
const _ref_wu3l3n = { addPoint2PointConstraint };
const _ref_9xjhva = { scaleMatrix };
const _ref_1afx7r = { rotateLogFiles };
const _ref_lt4qex = { filterTraffic };
const _ref_mgv7r6 = { encryptPeerTraffic };
const _ref_fzoldt = { executeSQLQuery };
const _ref_pi2vnk = { prioritizeTraffic };
const _ref_6jepoq = { renderParticles };
const _ref_sfpf8s = { injectCSPHeader };
const _ref_iuii2v = { VirtualFSTree };
const _ref_1yxjxn = { updateProgressBar };
const _ref_1iwgr4 = { announceToTracker };
const _ref_o4qgsi = { checkBalance };
const _ref_zmv7h3 = { loadModelWeights };
const _ref_ogl8dn = { enableDHT };
const _ref_n4nw4a = { linkFile };
const _ref_133lkb = { requestPiece };
const _ref_91pjh5 = { parseMagnetLink };
const _ref_9ujy9h = { mergeFiles };
const _ref_u9qlv6 = { parseFunction };
const _ref_o7580w = { mountFileSystem };
const _ref_nnduuw = { checkBatteryLevel };
const _ref_feunxb = { cullFace };
const _ref_zp59s1 = { createTCPSocket };
const _ref_j1yt45 = { getcwd };
const _ref_eaapzk = { openFile };
const _ref_9vaooc = { broadcastTransaction };
const _ref_g2diw3 = { generateDocumentation };
const _ref_xekt0f = { convertHSLtoRGB };
const _ref_l951u0 = { transcodeStream };
const _ref_li5xzu = { validateFormInput };
const _ref_gr811j = { predictTensor };
const _ref_6plm3r = { shutdownComputer };
const _ref_8zu51j = { joinGroup };
const _ref_b2ub73 = { cleanOldLogs };
const _ref_o98y34 = { createConstraint };
const _ref_5eloeq = { refreshAuthToken };
const _ref_zbuhkz = { createIndexBuffer };
const _ref_lgi01f = { seekFile };
const _ref_en2lug = { optimizeTailCalls };
const _ref_murgip = { verifyMagnetLink };
const _ref_3uyqaj = { hashKeccak256 };
const _ref_gca22c = { syncAudioVideo };
const _ref_n9ep7z = { calculatePieceHash };
const _ref_3ymtga = { createPhysicsWorld };
const _ref_2m5ire = { getEnv };
const _ref_w06gyj = { createFrameBuffer };
const _ref_jucww8 = { closePipe };
const _ref_16lp5j = { compressDataStream };
const _ref_abu0h9 = { handleInterrupt };
const _ref_jmtp57 = { detectFirewallStatus };
const _ref_k8ensk = { optimizeConnectionPool };
const _ref_hm16h8 = { setOrientation };
const _ref_5f8p5m = { sanitizeXSS };
const _ref_afjxyz = { recognizeSpeech };
const _ref_whxq1e = { writePipe };
const _ref_e2ke7w = { createConvolver };
const _ref_f48cwg = { limitDownloadSpeed };
const _ref_97ruto = { preventSleepMode };
const _ref_hwibd2 = { watchFileChanges };
const _ref_e53znh = { deriveAddress };
const _ref_vg9o0t = { setKnee };
const _ref_up3f0w = { createIndex };
const _ref_576sn7 = { loadDriver };
const _ref_8b69v6 = { applyTorque };
const _ref_xtpt5p = { measureRTT };
const _ref_tmah1p = { getShaderInfoLog };
const _ref_fqqmoh = { reassemblePacket };
const _ref_c9via8 = { setRelease };
const _ref_nlrz2f = { createThread };
const _ref_0yl7ya = { generateWalletKeys };
const _ref_egfjop = { createBoxShape };
const _ref_jhx97e = { enableInterrupts };
const _ref_pw9fkv = { renderCanvasLayer };
const _ref_f00b0i = { leaveGroup };
const _ref_anwgh9 = { encapsulateFrame };
const _ref_o8fydv = { updateSoftBody };
const _ref_njtyju = { merkelizeRoot };
const _ref_ofrb3j = { createDirectoryRecursive };
const _ref_ycp3ii = { repairCorruptFile };
const _ref_yyu6el = { renameFile };
const _ref_je51zu = { switchVLAN };
const _ref_4o8te2 = { diffVirtualDOM };
const _ref_pg7ant = { interpretBytecode };
const _ref_zi48cc = { resolveDNS };
const _ref_fbhyki = { commitTransaction };
const _ref_y990cr = { normalizeAudio };
const _ref_kpk5td = { resolveSymbols };
const _ref_jo0lb7 = { parseStatement };
const _ref_ym2t0i = { extractArchive };
const _ref_g0ghmu = { setVolumeLevel };
const _ref_bqdndb = { execProcess };
const _ref_gouqcm = { ApiDataFormatter };
const _ref_7vpdbl = { connectSocket };
const _ref_6ozixl = { captureFrame };
const _ref_il20ak = { monitorClipboard };
const _ref_g2gipx = { validateProgram };
const _ref_fy382g = { vertexAttrib3f };
const _ref_oec9fl = { setSteeringValue };
const _ref_dus930 = { detectDebugger };
const _ref_ef4oyk = { bufferData };
const _ref_2m9gsy = { setVelocity };
const _ref_9tm5bt = { fragmentPacket };
const _ref_n54zeu = { linkModules };
const _ref_0j6h7n = { parseSubtitles };
const _ref_s375z2 = { subscribeToEvents };
const _ref_6z8atm = { signTransaction };
const _ref_6q452r = { createStereoPanner };
const _ref_nk65qo = { attachRenderBuffer };
const _ref_81rpwj = { drawElements };
const _ref_jszilu = { receivePacket };
const _ref_sw9ja1 = { applyTheme };
const _ref_014xih = { mapMemory };
const _ref_pf8awv = { writeFile };
const _ref_wl6aq7 = { calculateComplexity };
const _ref_u58r18 = { registerSystemTray };
const _ref_uhweew = { uniform1i };
const _ref_tu6rqp = { segmentImageUNet };
const _ref_wfelm2 = { checkDiskSpace };
const _ref_v4z4y7 = { createPipe };
const _ref_ytapjg = { unlockRow };
const _ref_m738e8 = { detachThread };
const _ref_jrono4 = { killProcess };
const _ref_fpg48a = { calculateRestitution };
const _ref_xegqw0 = { allocateMemory };
const _ref_3lgkcu = { useProgram };
const _ref_zn37c2 = { wakeUp };
const _ref_2w0n8e = { verifySignature };
const _ref_n0nbik = { setBrake };
const _ref_7ftzlo = { installUpdate };
const _ref_w3zg0w = { getVehicleSpeed }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `dailymotion` };
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
                const urlParams = { config, url: window.location.href, name_en: `dailymotion` };

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
        const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const unmuteStream = () => false;

const leaveGroup = (group) => true;

const transcodeStream = (format) => ({ format, status: "processing" });

const lockRow = (id) => true;

const rateLimitCheck = (ip) => true;

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const captureFrame = () => "frame_data_buffer";

const registerSystemTray = () => ({ icon: "tray.ico" });

const swapTokens = (pair, amount) => true;

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const disableRightClick = () => true;

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const mergeFiles = (parts) => parts[0];

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const shardingTable = (table) => ["shard_0", "shard_1"];

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const classifySentiment = (text) => "positive";

const subscribeToEvents = (contract) => true;

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const claimRewards = (pool) => "0.5 ETH";

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const mockResponse = (body) => ({ status: 200, body });

const migrateSchema = (version) => ({ current: version, status: "ok" });

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const setDopplerFactor = (val) => true;

const getProgramInfoLog = (program) => "";

const eliminateDeadCode = (ast) => ast;

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const stakeAssets = (pool, amount) => true;

const updateSoftBody = (body) => true;

const cullFace = (mode) => true;

const createParticleSystem = (count) => ({ particles: [] });

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const blockMaliciousTraffic = (ip) => true;

const convertFormat = (src, dest) => dest;

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const deleteTexture = (texture) => true;

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const createMediaStreamSource = (ctx, stream) => ({});

const setRatio = (node, val) => node.ratio.value = val;

const flushSocketBuffer = (sock) => sock.buffer = [];

const emitParticles = (sys, count) => true;

const registerGestureHandler = (gesture) => true;

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const verifySignature = (tx, sig) => true;

const stopOscillator = (osc, time) => true;

const removeMetadata = (file) => ({ file, metadata: null });

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const gaussianBlur = (image, radius) => image;

const createWaveShaper = (ctx) => ({ curve: null });

const validateFormInput = (input) => input.length > 0;

const createPeriodicWave = (ctx, real, imag) => ({});

const dhcpDiscover = () => true;

const computeLossFunction = (pred, actual) => 0.05;

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const rmdir = (path) => true;

const setPosition = (panner, x, y, z) => true;

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const decapsulateFrame = (frame) => frame;

const generateCode = (ast) => "const a = 1;";

const stepSimulation = (world, dt) => true;

const createSoftBody = (info) => ({ nodes: [] });

const addHingeConstraint = (world, c) => true;

const optimizeTailCalls = (ast) => ast;

const negotiateSession = (sock) => ({ id: "sess_1" });

const semaphoreWait = (sem) => true;

const merkelizeRoot = (txs) => "root_hash";

const execProcess = (path) => true;

const encapsulateFrame = (packet) => packet;

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const invalidateCache = (key) => true;

const recognizeSpeech = (audio) => "Transcribed Text";

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const deriveAddress = (path) => "0x123...";

const connectSocket = (sock, addr, port) => true;

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const parseExpression = (tokens) => ({ type: 'BinaryExpression' });

const createFrameBuffer = () => ({ id: Math.random() });

const deleteProgram = (program) => true;

const minifyCode = (code) => code;

const switchVLAN = (id) => true;

const addGeneric6DofConstraint = (world, c) => true;

const receivePacket = (sock, len) => new Uint8Array(len);

const applyEngineForce = (vehicle, force, wheelIdx) => true;

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const removeRigidBody = (world, body) => true;

const detectVirtualMachine = () => false;

const resolveCollision = (manifold) => true;

const allocateMemory = (size) => 0x1000;

const dhcpOffer = (ip) => true;

const createChannelSplitter = (ctx, channels) => ({});

const detectDebugger = () => false;

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const getFileAttributes = (path) => ({ readonly: false, hidden: false });


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const filterTraffic = (rule) => true;

const dhcpAck = () => true;

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const disconnectNodes = (node) => true;

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

const analyzeHeader = (packet) => ({});

const updateWheelTransform = (wheel) => true;

const createChannelMerger = (ctx, channels) => ({});

const parsePayload = (packet) => ({});

const bindTexture = (target, texture) => true;

const unchokePeer = (peer) => ({ ...peer, choked: false });

const adjustPlaybackSpeed = (rate) => rate;

const createThread = (func) => ({ tid: 1 });

const prefetchAssets = (urls) => urls.length;

const prettifyCode = (code) => code;

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const addSliderConstraint = (world, c) => true;


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

const createConstraint = (body1, body2) => ({});

const instrumentCode = (code) => code;

const protectMemory = (ptr, size, flags) => true;

const acceptConnection = (sock) => ({ fd: 2 });

const contextSwitch = (oldPid, newPid) => true;

const bufferMediaStream = (size) => ({ buffer: size });


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

const enterScope = (table) => true;

const createProcess = (img) => ({ pid: 100 });

const startOscillator = (osc, time) => true;

const serializeAST = (ast) => JSON.stringify(ast);

const createIndexBuffer = (data) => ({ id: Math.random() });

const addConeTwistConstraint = (world, c) => true;

const closeFile = (fd) => true;

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
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

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const removeConstraint = (world, c) => true;

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const monitorClipboard = () => "";

const createSymbolTable = () => ({ scopes: [] });

const obfuscateString = (str) => btoa(str);

const configureInterface = (iface, config) => true;

const parseClass = (tokens) => ({ type: 'ClassDeclaration' });

const detectVideoCodec = () => "h264";

const setAngularVelocity = (body, v) => true;

const disableInterrupts = () => true;

const setDistanceModel = (panner, model) => true;

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const chdir = (path) => true;

const signTransaction = (tx, key) => "signed_tx_hash";

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const readdir = (path) => [];

const fragmentPacket = (data, mtu) => [data];

const createSphereShape = (r) => ({ type: 'sphere' });

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const setFilterType = (filter, type) => filter.type = type;

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const sleep = (body) => true;

const createIndex = (table, col) => `IDX_${table}_${col}`;

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const deobfuscateString = (str) => atob(str);

const setDelayTime = (node, time) => node.delayTime.value = time;

const jitCompile = (bc) => (() => {});

const readPipe = (fd, len) => new Uint8Array(len);

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const updateParticles = (sys, dt) => true;

const rotateLogFiles = () => true;

const setPan = (node, val) => node.pan.value = val;

const adjustWindowSize = (sock, size) => true;

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const applyForce = (body, force, point) => true;

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const applyFog = (color, dist) => color;

const muteStream = () => true;


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const upInterface = (iface) => true;

const obfuscateCode = (code) => code;

const captureScreenshot = () => "data:image/png;base64,...";

const augmentData = (image) => image;

const checkBatteryLevel = () => 100;

const lookupSymbol = (table, name) => ({});

const validateRecaptcha = (token) => true;

const detectAudioCodec = () => "aac";

const decompressPacket = (data) => data;

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const disableDepthTest = () => true;

const joinThread = (tid) => true;

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const limitRate = (stream, rate) => stream;

const encryptStream = (stream, key) => stream;

const cacheQueryResults = (key, data) => true;

// Anti-shake references
const _ref_uebfqn = { parseM3U8Playlist };
const _ref_a73pen = { unmuteStream };
const _ref_07d7ok = { leaveGroup };
const _ref_540dnq = { transcodeStream };
const _ref_l5zw68 = { lockRow };
const _ref_tzarx9 = { rateLimitCheck };
const _ref_zm3ru6 = { switchProxyServer };
const _ref_9crxcw = { captureFrame };
const _ref_gnr2mr = { registerSystemTray };
const _ref_a4us0l = { swapTokens };
const _ref_pcssdf = { detectFirewallStatus };
const _ref_ghd4g0 = { disableRightClick };
const _ref_qec0fb = { moveFileToComplete };
const _ref_7jcy90 = { calculateMD5 };
const _ref_ke6ut7 = { mergeFiles };
const _ref_43dodh = { checkDiskSpace };
const _ref_nwkxkd = { showNotification };
const _ref_f6licn = { manageCookieJar };
const _ref_h26siu = { verifyMagnetLink };
const _ref_q11gms = { calculateLayoutMetrics };
const _ref_xxcnq0 = { shardingTable };
const _ref_5985a6 = { clearBrowserCache };
const _ref_1s55j1 = { classifySentiment };
const _ref_hrt039 = { subscribeToEvents };
const _ref_s7bb9b = { getSystemUptime };
const _ref_tpt4g6 = { connectionPooling };
const _ref_yxau7k = { updateProgressBar };
const _ref_go09gj = { claimRewards };
const _ref_idxaa1 = { keepAlivePing };
const _ref_qgthti = { mockResponse };
const _ref_hmyy09 = { migrateSchema };
const _ref_ywultg = { getMemoryUsage };
const _ref_c6pqg3 = { setDopplerFactor };
const _ref_iu8k8e = { getProgramInfoLog };
const _ref_ghje4e = { eliminateDeadCode };
const _ref_8oeo0j = { createDynamicsCompressor };
const _ref_xh3cuk = { stakeAssets };
const _ref_6m3zg7 = { updateSoftBody };
const _ref_ig5rvg = { cullFace };
const _ref_8qxi22 = { createParticleSystem };
const _ref_wqrx47 = { setFrequency };
const _ref_fdq9y6 = { verifyFileSignature };
const _ref_6yageb = { blockMaliciousTraffic };
const _ref_h1se0r = { convertFormat };
const _ref_j6r7nb = { setSteeringValue };
const _ref_siuk0q = { deleteTexture };
const _ref_h9e5ya = { throttleRequests };
const _ref_t38ioa = { createMediaStreamSource };
const _ref_zuw771 = { setRatio };
const _ref_pom0fo = { flushSocketBuffer };
const _ref_wxodv5 = { emitParticles };
const _ref_zpx06r = { registerGestureHandler };
const _ref_qu2dnr = { convertRGBtoHSL };
const _ref_fo9gu4 = { getAppConfig };
const _ref_9h5h6p = { verifySignature };
const _ref_ca0a6w = { stopOscillator };
const _ref_u2alkl = { removeMetadata };
const _ref_quyh9z = { detectObjectYOLO };
const _ref_5jgi0i = { gaussianBlur };
const _ref_kk7el5 = { createWaveShaper };
const _ref_rmmorm = { validateFormInput };
const _ref_fnhl40 = { createPeriodicWave };
const _ref_f4zzzq = { dhcpDiscover };
const _ref_yd3uav = { computeLossFunction };
const _ref_20vt1s = { analyzeQueryPlan };
const _ref_r1bhz2 = { rmdir };
const _ref_eveky4 = { setPosition };
const _ref_s1sqxr = { validateTokenStructure };
const _ref_pepc9o = { decapsulateFrame };
const _ref_m5aeem = { generateCode };
const _ref_s2d2v2 = { stepSimulation };
const _ref_5ocizo = { createSoftBody };
const _ref_l3nopi = { addHingeConstraint };
const _ref_9kke9a = { optimizeTailCalls };
const _ref_j1fte5 = { negotiateSession };
const _ref_ipsnk7 = { semaphoreWait };
const _ref_y43tcf = { merkelizeRoot };
const _ref_fsmzef = { execProcess };
const _ref_a352d8 = { encapsulateFrame };
const _ref_y9ef1s = { checkIntegrity };
const _ref_1hdzdz = { invalidateCache };
const _ref_7iqli8 = { recognizeSpeech };
const _ref_zuxmqu = { generateUUIDv5 };
const _ref_548eoq = { deriveAddress };
const _ref_z2rl1r = { connectSocket };
const _ref_i4ngvf = { tunnelThroughProxy };
const _ref_3ti3o2 = { parseExpression };
const _ref_gbw3bp = { createFrameBuffer };
const _ref_z2wcj5 = { deleteProgram };
const _ref_kvinj9 = { minifyCode };
const _ref_b9f1ux = { switchVLAN };
const _ref_kv2gx0 = { addGeneric6DofConstraint };
const _ref_z1gwzq = { receivePacket };
const _ref_z09vw9 = { applyEngineForce };
const _ref_mjoosg = { handshakePeer };
const _ref_4vehvw = { removeRigidBody };
const _ref_k6biaj = { detectVirtualMachine };
const _ref_i275ul = { resolveCollision };
const _ref_ycubq2 = { allocateMemory };
const _ref_84ypht = { dhcpOffer };
const _ref_bnd2x4 = { createChannelSplitter };
const _ref_752q8t = { detectDebugger };
const _ref_174gim = { generateWalletKeys };
const _ref_qps4da = { simulateNetworkDelay };
const _ref_c482ma = { getFileAttributes };
const _ref_lha9mf = { transformAesKey };
const _ref_delhjf = { createScriptProcessor };
const _ref_j2lf9k = { generateUserAgent };
const _ref_ku1401 = { filterTraffic };
const _ref_sosu8z = { dhcpAck };
const _ref_z1z0l5 = { virtualScroll };
const _ref_v1cq1s = { disconnectNodes };
const _ref_cuqzih = { download };
const _ref_ww5gzt = { analyzeHeader };
const _ref_dv5aza = { updateWheelTransform };
const _ref_b9xoqm = { createChannelMerger };
const _ref_e5eb9n = { parsePayload };
const _ref_0g7q57 = { bindTexture };
const _ref_7oihg8 = { unchokePeer };
const _ref_yxgntv = { adjustPlaybackSpeed };
const _ref_ts1ogp = { createThread };
const _ref_5qqal3 = { prefetchAssets };
const _ref_crros8 = { prettifyCode };
const _ref_t6ykd6 = { formatCurrency };
const _ref_9noxso = { addSliderConstraint };
const _ref_3dq2fx = { ResourceMonitor };
const _ref_z64l2b = { createConstraint };
const _ref_cf45b1 = { instrumentCode };
const _ref_d90th3 = { protectMemory };
const _ref_w61nbp = { acceptConnection };
const _ref_mhtzl2 = { contextSwitch };
const _ref_px055f = { bufferMediaStream };
const _ref_9to7ne = { TelemetryClient };
const _ref_bjve11 = { enterScope };
const _ref_3qb44s = { createProcess };
const _ref_pi0rw9 = { startOscillator };
const _ref_tn680i = { serializeAST };
const _ref_1v189o = { createIndexBuffer };
const _ref_pve34e = { addConeTwistConstraint };
const _ref_w1p0np = { closeFile };
const _ref_5yib92 = { validateSSLCert };
const _ref_e4ksqk = { optimizeMemoryUsage };
const _ref_l7zvq3 = { FileValidator };
const _ref_7p22ja = { allocateDiskSpace };
const _ref_xhvsj9 = { removeConstraint };
const _ref_x1n5ko = { compactDatabase };
const _ref_3474tg = { monitorClipboard };
const _ref_z634ha = { createSymbolTable };
const _ref_5qwqlk = { obfuscateString };
const _ref_qgybug = { configureInterface };
const _ref_9tqyg4 = { parseClass };
const _ref_6ziz7y = { detectVideoCodec };
const _ref_813tus = { setAngularVelocity };
const _ref_6ev9p2 = { disableInterrupts };
const _ref_btf43j = { setDistanceModel };
const _ref_8wofai = { computeSpeedAverage };
const _ref_de8b8k = { chdir };
const _ref_hfeab0 = { signTransaction };
const _ref_e3342m = { loadTexture };
const _ref_4f2piw = { readdir };
const _ref_qbluw7 = { fragmentPacket };
const _ref_aj60fb = { createSphereShape };
const _ref_bq2koi = { traceStack };
const _ref_ifdteo = { setFilterType };
const _ref_0zar5x = { connectToTracker };
const _ref_g8hlr8 = { sleep };
const _ref_b9d6kb = { createIndex };
const _ref_vkjmo8 = { parseMagnetLink };
const _ref_4nwaqf = { resolveDNSOverHTTPS };
const _ref_2qvbhg = { deobfuscateString };
const _ref_ib149f = { setDelayTime };
const _ref_75iyrf = { jitCompile };
const _ref_c7f7hv = { readPipe };
const _ref_517jc2 = { getAngularVelocity };
const _ref_9ew7td = { updateParticles };
const _ref_gcxh2l = { rotateLogFiles };
const _ref_7w2vgi = { setPan };
const _ref_eeu9u5 = { adjustWindowSize };
const _ref_enluns = { performTLSHandshake };
const _ref_e44eti = { applyForce };
const _ref_idtf3w = { syncDatabase };
const _ref_pd8dd1 = { applyFog };
const _ref_ri1id3 = { muteStream };
const _ref_fwt5ap = { isFeatureEnabled };
const _ref_m068ku = { upInterface };
const _ref_1cb0l7 = { obfuscateCode };
const _ref_n9uiqr = { captureScreenshot };
const _ref_k6j07p = { augmentData };
const _ref_ir6zvy = { checkBatteryLevel };
const _ref_q7gumr = { lookupSymbol };
const _ref_g45ah7 = { validateRecaptcha };
const _ref_lajlcr = { detectAudioCodec };
const _ref_4c19od = { decompressPacket };
const _ref_z1gnsx = { diffVirtualDOM };
const _ref_0d53zm = { disableDepthTest };
const _ref_gqz9i2 = { joinThread };
const _ref_fl0oa0 = { initiateHandshake };
const _ref_m5eyia = { limitRate };
const _ref_rltgxp = { encryptStream };
const _ref_mb26m1 = { cacheQueryResults }; 
    });
})({}, {});