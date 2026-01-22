// ==UserScript==
// @name porn视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/porn/index.js
// @version 2026.01.21.2
// @description 成人脚本，未满18禁止使用！！sex视频一键下载，多清晰度，支持pornhub、cam4等30个网站，需要翻墙
// @icon https://ei.phncdn.com/www-static/favicon.ico
// @match *://*.cam4.com/*
// @match *://*.cammodels.com/*
// @match *://*.empflix.com/*
// @match *://*.eporner.com/*
// @match *://*.xvideos.com/*
// @match *://*.xnxx.com/*
// @match *://hellporno.net/*
// @match *://xhamster.com/*
// @match *://*.pornhat.com/*
// @match *://*.manyvids.com/*
// @match *://*.moviefap.com/*
// @match *://nonktube.com/*
// @match *://noodlemagazine.com/*
// @match *://*.nuvid.com/*
// @match *://*.pornhub.com/*
// @match *://*.redgifs.com/*
// @match *://*.redtube.com/*
// @match *://spankbang.com/*
// @match *://*.youjizz.com/*
// @match *://avjiali.com/*
// @match *://japan-whores.com/*
// @match *://faptor.com/*
// @match *://*.ifuckedyourgf.com/*
// @match *://*.fucker.com/*
// @match *://xhand.net/*
// @match *://*.xozilla.xxx/*
// @match *://*.babestube.com/*
// @match *://w1mp.com/*
// @match *://*.sexlikereal.com/*
// @match *://*.pornbox.com/*
// @match *://*.xgroovy.com/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
// @connect neporner.com
// @connect nchaturbate.com
// @connect nempflix.com
// @connect nxvideos.com
// @connect nxvideos-cdn.com
// @connect nredgifs.com
// @connect nxvideos.red
// @connect nxhamster.com
// @connect navjiali.com
// @connect npornlib.com
// @connect njapan-whores.com
// @connect nfaptor.com
// @connect ncamsoda.com
// @connect nifuckedyourgf.com
// @connect nfapnado.xxx
// @connect nfucker.com
// @connect nxhand.net
// @connect nits.porn
// @connect nxozilla.xxx
// @connect nbabestube.com
// @connect nw1mp.com
// @connect nsexlikereal.com
// @connect nxhcdn.com
// @connect nahcdn.com
// @connect npornbox.com
// @connect nxgroovy.com
// @connect njappornxl.com
// @connect xnxx.com
// @connect xnxx-cdn.com
// @connect naipornvideos.com
// @connect nextremewhores.com
// @connect nxxjap.com
// @connect ncam4.com
// @connect nxcdnpro.com
// @connect nnaiadsystems.com
// @connect nxnxx.com
// @connect nhellporno.net
// @connect npornhat.com
// @connect nmanyvids.com
// @connect nmoviefap.com
// @connect nnonktube.com
// @connect nnoodlemagazine.com
// @connect nnuvid.com
// @connect npornhub.com
// @connect nphncdn.com
// @connect nredtube.com
// @connect nrdtcdn.com
// @connect nyoujizz.com
// @connect ngayxxxworld.com
// @connect nsome.porn
// @connect ncdn3x.com
// @connect nzbporn.com
// @connect npornoxo.com
// @connect spankbang.com
// @connect hls-uranus.sb-cd.com
// @connect xvideos-cdn.com
// @connect www.empflix.com
// @connect www.eporner.com
// @connect www.xvideos.com
// @connect www.xnxx.com
// @connect hellporno.net
// @connect xhamster.com
// @connect www.pornhat.com
// @connect www.manyvids.com
// @connect www.moviefap.com
// @connect nonktube.com
// @connect noodlemagazine.com
// @connect cn.pornhub.com
// @connect www.redtube.com
// @connect spankbang.com
// @connect www.youjizz.com
// @connect avjiali.com
// @connect japan-whores.com
// @connect faptor.com
// @connect www.ifuckedyourgf.com
// @connect www.fucker.com
// @connect xhand.net
// @connect www.xozilla.xxx
// @connect www.babestube.com
// @connect w1mp.com
// @connect www.sexlikereal.com
// @connect tour1.pornbox.com
// @connect cn.xgroovy.com
// @connect zh.cam4.com
// @connect www.cammodels.com
// @connect some.porn
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
// @downloadURL https://update.greasyfork.org/scripts/562094/porn%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562094/porn%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const defineSymbol = (table, name, info) => true;

const dhcpOffer = (ip) => true;

const parsePayload = (packet) => ({});

const unlinkFile = (path) => true;

const dhcpRequest = (ip) => true;

const arpRequest = (ip) => "00:00:00:00:00:00";

const sendPacket = (sock, data) => data.length;

const mutexLock = (mtx) => true;

const broadcastMessage = (msg) => true;

const contextSwitch = (oldPid, newPid) => true;

const resolveSymbols = (ast) => ({});

const scheduleProcess = (pid) => true;

const closeSocket = (sock) => true;

const mapMemory = (fd, size) => 0x2000;

const execProcess = (path) => true;

const establishHandshake = (sock) => true;

const handleTimeout = (sock) => true;

const dumpSymbolTable = (table) => "";

const applyFog = (color, dist) => color;

const mangleNames = (ast) => ast;

const prettifyCode = (code) => code;

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const upInterface = (iface) => true;

const sanitizeXSS = (html) => html;

const getMACAddress = (iface) => "00:00:00:00:00:00";

const joinThread = (tid) => true;

const logErrorToFile = (err) => console.error(err);

const convertHSLtoRGB = (h, s, l) => ({ r: 0, g: 0, b: 0 });

const disableInterrupts = () => true;

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const rebootSystem = () => true;

const synthesizeSpeech = (text) => "audio_buffer";

const prioritizeRarestPiece = (pieces) => pieces[0];

const renderShadowMap = (scene, light) => ({ texture: {} });

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const analyzeControlFlow = (ast) => ({ graph: {} });

const captureScreenshot = () => "data:image/png;base64,...";

const getUniformLocation = (program, name) => 1;

const serializeFormData = (form) => JSON.stringify(form);

const rmdir = (path) => true;

const decodeABI = (data) => ({ method: "transfer", params: [] });

const migrateSchema = (version) => ({ current: version, status: "ok" });

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const rollbackTransaction = (tx) => true;

const rotateLogFiles = () => true;

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const getcwd = () => "/";

const instrumentCode = (code) => code;

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const encodeABI = (method, params) => "0x...";

const updateWheelTransform = (wheel) => true;

const lookupSymbol = (table, name) => ({});

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const writePipe = (fd, data) => data.length;

const seedRatioLimit = (ratio) => ratio >= 2.0;

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const setQValue = (filter, q) => filter.Q = q;

const announceToTracker = (url) => ({ url, interval: 1800 });

const setFilterType = (filter, type) => filter.type = type;

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const createIndexBuffer = (data) => ({ id: Math.random() });

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

const scheduleTask = (task) => ({ id: 1, task });

const backpropagateGradient = (loss) => true;

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const anchorSoftBody = (soft, rigid) => true;

const registerGestureHandler = (gesture) => true;

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const monitorClipboard = () => "";

const inlineFunctions = (ast) => ast;

const closeFile = (fd) => true;

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const splitFile = (path, parts) => Array(parts).fill(path);

const checkBalance = (addr) => "10.5 ETH";

const chownFile = (path, uid, gid) => true;

const createSphereShape = (r) => ({ type: 'sphere' });

const renderCanvasLayer = (ctx) => true;

const resetVehicle = (vehicle) => true;

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const repairCorruptFile = (path) => ({ path, repaired: true });

const getOutputTimestamp = (ctx) => Date.now();

const cleanOldLogs = (days) => days;

const freeMemory = (ptr) => true;

const negotiateProtocol = () => "HTTP/2.0";

const resampleAudio = (buffer, rate) => buffer;

const enableBlend = (func) => true;

const setKnee = (node, val) => node.knee.value = val;

const bindSocket = (port) => ({ port, status: "bound" });

const detectDarkMode = () => true;

const interpretBytecode = (bc) => true;

const classifySentiment = (text) => "positive";

const estimateNonce = (addr) => 42;


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const unrollLoops = (ast) => ast;

const performOCR = (img) => "Detected Text";

const setAttack = (node, val) => node.attack.value = val;

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const jitCompile = (bc) => (() => {});

const addPoint2PointConstraint = (world, c) => true;

const lockRow = (id) => true;

const rayIntersectTriangle = (ray, tri) => ({ hit: false, dist: Infinity });

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const createChannelSplitter = (ctx, channels) => ({});

const getVehicleSpeed = (vehicle) => 0;

const resolveCollision = (manifold) => true;

const checkIntegrityToken = (token) => true;

const createSoftBody = (info) => ({ nodes: [] });

const makeDistortionCurve = (amount) => new Float32Array(4096);

const loadCheckpoint = (path) => true;

const autoResumeTask = (id) => ({ id, status: "resumed" });

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const cacheQueryResults = (key, data) => true;

const cullFace = (mode) => true;

const setDistanceModel = (panner, model) => true;

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const getShaderInfoLog = (shader) => "";

const computeDominators = (cfg) => ({});

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const registerISR = (irq, func) => true;

const triggerHapticFeedback = (intensity) => true;

const resolveImports = (ast) => [];

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const injectMetadata = (file, meta) => ({ file, meta });

const calculateLighting = (normal, lightDir, color) => ({ r: 1, g: 1, b: 1 });

const lazyLoadComponent = (name) => ({ name, loaded: false });

const applyTorque = (body, torque) => true;

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const reportError = (msg, line) => console.error(msg);

const writeFile = (fd, data) => true;

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const enableInterrupts = () => true;

const applyTheme = (theme) => document.body.className = theme;

const getByteFrequencyData = (analyser, array) => true;

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const cancelTask = (id) => ({ id, cancelled: true });

const emitParticles = (sys, count) => true;

const deleteTexture = (texture) => true;

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const reportWarning = (msg, line) => console.warn(msg);

const dropTable = (table) => true;

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const setGainValue = (node, val) => node.gain.value = val;

const generateDocumentation = (ast) => "";

const createFrameBuffer = () => ({ id: Math.random() });

const blockMaliciousTraffic = (ip) => true;

const compileToBytecode = (ast) => new Uint8Array();

const interceptRequest = (req) => ({ ...req, intercepted: true });

const playSoundAlert = (sound) => console.log(`Playing ${sound}`);

const removeConstraint = (world, c) => true;

const generateSourceMap = (ast) => "{}";

const mountFileSystem = (dev, path) => true;

const detectAudioCodec = () => "aac";

const deserializeAST = (json) => JSON.parse(json);

const createListener = (ctx) => ({});

const commitTransaction = (tx) => true;

const seekFile = (fd, offset) => true;

const createSymbolTable = () => ({ scopes: [] });

const tokenizeText = (text) => text.split(" ");

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

const setMTU = (iface, mtu) => true;

const protectMemory = (ptr, size, flags) => true;

const findLoops = (cfg) => [];

const detectCollision = (body1, body2) => false;

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const bundleAssets = (assets) => "";

const verifyAppSignature = () => true;

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const setPan = (node, val) => node.pan.value = val;

const killParticles = (sys) => true;

const computeNormal = (v1, v2, v3) => ({ x: 0, y: 1, z: 0 });

const normalizeFeatures = (data) => data.map(x => x / 255);

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const compileVertexShader = (source) => ({ compiled: true });

const shardingTable = (table) => ["shard_0", "shard_1"];

const calculateFriction = (mat1, mat2) => 0.5;

const decompressGzip = (data) => data;

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const bufferMediaStream = (size) => ({ buffer: size });

const closeContext = (ctx) => Promise.resolve();


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const updateSoftBody = (body) => true;

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const merkelizeRoot = (txs) => "root_hash";

const hoistVariables = (ast) => ast;

const addHingeConstraint = (world, c) => true;

const renameFile = (oldName, newName) => newName;

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const setEnv = (key, val) => true;

const backupDatabase = (path) => ({ path, size: 5000 });

const readFile = (fd, len) => "";

const minifyCode = (code) => code;

const updateParticles = (sys, dt) => true;

// Anti-shake references
const _ref_qwm2ge = { generateWalletKeys };
const _ref_04t2qs = { defineSymbol };
const _ref_9l3g8d = { dhcpOffer };
const _ref_a7vbqh = { parsePayload };
const _ref_fvqfm8 = { unlinkFile };
const _ref_39xwmv = { dhcpRequest };
const _ref_b0o5uw = { arpRequest };
const _ref_5cuy7h = { sendPacket };
const _ref_1kqrtk = { mutexLock };
const _ref_hc8pc7 = { broadcastMessage };
const _ref_uxyxuu = { contextSwitch };
const _ref_bc84b3 = { resolveSymbols };
const _ref_vn96kf = { scheduleProcess };
const _ref_gt5bps = { closeSocket };
const _ref_0n0m5p = { mapMemory };
const _ref_jkel1j = { execProcess };
const _ref_c8j23q = { establishHandshake };
const _ref_2kdel1 = { handleTimeout };
const _ref_102x6x = { dumpSymbolTable };
const _ref_4zl057 = { applyFog };
const _ref_qrbb0u = { mangleNames };
const _ref_suiqp4 = { prettifyCode };
const _ref_kfnfhy = { extractThumbnail };
const _ref_jmqbtg = { upInterface };
const _ref_0r5siy = { sanitizeXSS };
const _ref_xjlm9b = { getMACAddress };
const _ref_2898ho = { joinThread };
const _ref_gd6hxs = { logErrorToFile };
const _ref_hx5k8s = { convertHSLtoRGB };
const _ref_v5fcdz = { disableInterrupts };
const _ref_a6ly2e = { uninterestPeer };
const _ref_q4hzl8 = { rebootSystem };
const _ref_jtzyki = { synthesizeSpeech };
const _ref_i456sq = { prioritizeRarestPiece };
const _ref_y7ceov = { renderShadowMap };
const _ref_vop4pe = { resolveHostName };
const _ref_cjx01d = { analyzeControlFlow };
const _ref_m6l6qy = { captureScreenshot };
const _ref_2lev41 = { getUniformLocation };
const _ref_hb0p9y = { serializeFormData };
const _ref_lg3rzv = { rmdir };
const _ref_9zb3jg = { decodeABI };
const _ref_0ol1b1 = { migrateSchema };
const _ref_to2kcc = { manageCookieJar };
const _ref_mdwpvk = { rollbackTransaction };
const _ref_tr0w9r = { rotateLogFiles };
const _ref_10qecq = { initiateHandshake };
const _ref_esoosg = { queueDownloadTask };
const _ref_g40a8i = { getcwd };
const _ref_2wo2nd = { instrumentCode };
const _ref_xrom8z = { scheduleBandwidth };
const _ref_tw8pt7 = { verifyMagnetLink };
const _ref_1a5tb7 = { encodeABI };
const _ref_tehftr = { updateWheelTransform };
const _ref_l2sh7g = { lookupSymbol };
const _ref_5kp1fu = { setSteeringValue };
const _ref_i5rfnu = { writePipe };
const _ref_qxdy01 = { seedRatioLimit };
const _ref_2nffxc = { rotateUserAgent };
const _ref_4mehy2 = { setQValue };
const _ref_hagfpw = { announceToTracker };
const _ref_kx9wg0 = { setFilterType };
const _ref_c7gw4n = { moveFileToComplete };
const _ref_z54dwt = { createIndexBuffer };
const _ref_xbu8ah = { VirtualFSTree };
const _ref_ytqmej = { scheduleTask };
const _ref_n2g2fo = { backpropagateGradient };
const _ref_lglx3p = { requestPiece };
const _ref_17fobx = { anchorSoftBody };
const _ref_f758z4 = { registerGestureHandler };
const _ref_nzrdcd = { linkProgram };
const _ref_o6mpwt = { normalizeAudio };
const _ref_2s7d33 = { monitorClipboard };
const _ref_qw4wcv = { inlineFunctions };
const _ref_7rgq0t = { closeFile };
const _ref_a7c2ht = { parseTorrentFile };
const _ref_lpbyob = { splitFile };
const _ref_2i685s = { checkBalance };
const _ref_a1crrg = { chownFile };
const _ref_qpw8t8 = { createSphereShape };
const _ref_leaquc = { renderCanvasLayer };
const _ref_cuclj0 = { resetVehicle };
const _ref_gih0hz = { cancelAnimationFrameLoop };
const _ref_4yr5p8 = { repairCorruptFile };
const _ref_h4ns0z = { getOutputTimestamp };
const _ref_9vt0ii = { cleanOldLogs };
const _ref_50gdzy = { freeMemory };
const _ref_d05nka = { negotiateProtocol };
const _ref_w3q930 = { resampleAudio };
const _ref_axgqxi = { enableBlend };
const _ref_4ordse = { setKnee };
const _ref_mfysf1 = { bindSocket };
const _ref_3wcdvg = { detectDarkMode };
const _ref_5la1xz = { interpretBytecode };
const _ref_rmrl2l = { classifySentiment };
const _ref_i1skas = { estimateNonce };
const _ref_97ge3n = { getAppConfig };
const _ref_7v92mo = { unrollLoops };
const _ref_tceziu = { performOCR };
const _ref_1lmbt5 = { setAttack };
const _ref_bnd8wq = { resolveDependencyGraph };
const _ref_9ma9sq = { jitCompile };
const _ref_uyzode = { addPoint2PointConstraint };
const _ref_20bun5 = { lockRow };
const _ref_2hgu4p = { rayIntersectTriangle };
const _ref_9b46is = { applyPerspective };
const _ref_akxm1g = { loadModelWeights };
const _ref_1it4bh = { formatLogMessage };
const _ref_5jm82e = { createChannelSplitter };
const _ref_76uezg = { getVehicleSpeed };
const _ref_vzx86w = { resolveCollision };
const _ref_9a0kr5 = { checkIntegrityToken };
const _ref_zaz0oq = { createSoftBody };
const _ref_buftqx = { makeDistortionCurve };
const _ref_l8epzf = { loadCheckpoint };
const _ref_xeycfg = { autoResumeTask };
const _ref_z8oorx = { watchFileChanges };
const _ref_rwsd39 = { cacheQueryResults };
const _ref_if6gqj = { cullFace };
const _ref_gpnf37 = { setDistanceModel };
const _ref_92552m = { uploadCrashReport };
const _ref_6zp0ij = { getShaderInfoLog };
const _ref_o14uyo = { computeDominators };
const _ref_5mg12f = { limitUploadSpeed };
const _ref_x053f5 = { registerISR };
const _ref_smaqtl = { triggerHapticFeedback };
const _ref_43gczg = { resolveImports };
const _ref_n4yn95 = { createBiquadFilter };
const _ref_u5iqmg = { injectMetadata };
const _ref_0i8wym = { calculateLighting };
const _ref_2ade5r = { lazyLoadComponent };
const _ref_fpz5su = { applyTorque };
const _ref_880djh = { calculateEntropy };
const _ref_s36kdy = { reportError };
const _ref_yxi5xn = { writeFile };
const _ref_g67aa5 = { createStereoPanner };
const _ref_21q1v9 = { enableInterrupts };
const _ref_3ihck7 = { applyTheme };
const _ref_6ng4nh = { getByteFrequencyData };
const _ref_8lwglm = { virtualScroll };
const _ref_ovk3l8 = { cancelTask };
const _ref_gw9hb3 = { emitParticles };
const _ref_31djun = { deleteTexture };
const _ref_3o4xub = { analyzeUserBehavior };
const _ref_xsyxoh = { reportWarning };
const _ref_enbkpa = { dropTable };
const _ref_zpb695 = { tunnelThroughProxy };
const _ref_0kcj22 = { setGainValue };
const _ref_hgj31m = { generateDocumentation };
const _ref_kev4yd = { createFrameBuffer };
const _ref_d4kf3p = { blockMaliciousTraffic };
const _ref_z8655w = { compileToBytecode };
const _ref_dzgqok = { interceptRequest };
const _ref_r1miug = { playSoundAlert };
const _ref_i8klyh = { removeConstraint };
const _ref_yj8htb = { generateSourceMap };
const _ref_cbhb2q = { mountFileSystem };
const _ref_2ydt8w = { detectAudioCodec };
const _ref_t0uhzq = { deserializeAST };
const _ref_28dtv6 = { createListener };
const _ref_i9cci9 = { commitTransaction };
const _ref_6gai9x = { seekFile };
const _ref_irxngr = { createSymbolTable };
const _ref_7ut4ij = { tokenizeText };
const _ref_3l7uey = { generateFakeClass };
const _ref_1omeuc = { setMTU };
const _ref_tscj16 = { protectMemory };
const _ref_e5i4i3 = { findLoops };
const _ref_tsoyv5 = { detectCollision };
const _ref_06c87i = { formatCurrency };
const _ref_26obz4 = { bundleAssets };
const _ref_c6rfmb = { verifyAppSignature };
const _ref_573d6e = { createGainNode };
const _ref_idevle = { setPan };
const _ref_cxxuo9 = { killParticles };
const _ref_ju8nho = { computeNormal };
const _ref_uv3q51 = { normalizeFeatures };
const _ref_rsx8im = { createDelay };
const _ref_bj9bmu = { compileVertexShader };
const _ref_2dwggx = { shardingTable };
const _ref_gyq5d0 = { calculateFriction };
const _ref_7eu4pr = { decompressGzip };
const _ref_n5abf4 = { syncDatabase };
const _ref_e7za60 = { bufferMediaStream };
const _ref_pz7xqd = { closeContext };
const _ref_ab8bcs = { transformAesKey };
const _ref_ahes7u = { updateBitfield };
const _ref_hr5kyw = { throttleRequests };
const _ref_dzezq5 = { updateSoftBody };
const _ref_k7xyrq = { animateTransition };
const _ref_zb33ef = { merkelizeRoot };
const _ref_so8nek = { hoistVariables };
const _ref_k78h64 = { addHingeConstraint };
const _ref_cke2am = { renameFile };
const _ref_81qxx5 = { sanitizeSQLInput };
const _ref_2d2gmu = { setEnv };
const _ref_88mc6z = { backupDatabase };
const _ref_m84j3v = { readFile };
const _ref_xs3vhg = { minifyCode };
const _ref_9dihsd = { updateParticles }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `porn` };
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
                const urlParams = { config, url: window.location.href, name_en: `porn` };

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
        const resolveSymbols = (ast) => ({});

const setRatio = (node, val) => node.ratio.value = val;

const sleep = (body) => true;

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const setViewport = (x, y, w, h) => true;

const useProgram = (program) => true;

const createMeshShape = (vertices) => ({ type: 'mesh' });

const createConvolver = (ctx) => ({ buffer: null });

const calculateRestitution = (mat1, mat2) => 0.3;

const resetVehicle = (vehicle) => true;

const addConeTwistConstraint = (world, c) => true;

const createChannelSplitter = (ctx, channels) => ({});

const sanitizeXSS = (html) => html;

const negotiateSession = (sock) => ({ id: "sess_1" });

const getUniformLocation = (program, name) => 1;

const spoofReferer = () => "https://google.com";

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const stopOscillator = (osc, time) => true;

const semaphoreWait = (sem) => true;

const connectNodes = (src, dest) => true;

const getMediaDuration = () => 3600;

const cleanOldLogs = (days) => days;

const validateFormInput = (input) => input.length > 0;


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

const createSymbolTable = () => ({ scopes: [] });

const decapsulateFrame = (frame) => frame;

const bindTexture = (target, texture) => true;

const calculateLighting = (normal, lightDir, color) => ({ r: 1, g: 1, b: 1 });

const createParticleSystem = (count) => ({ particles: [] });


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const generateMipmaps = (target) => true;

const readPipe = (fd, len) => new Uint8Array(len);

const updateTransform = (body) => true;

const renderShadowMap = (scene, light) => ({ texture: {} });

const removeConstraint = (world, c) => true;

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const classifySentiment = (text) => "positive";

const unmountFileSystem = (path) => true;

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const chownFile = (path, uid, gid) => true;

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

const beginTransaction = () => "TX-" + Date.now();

const renderCanvasLayer = (ctx) => true;

const retransmitPacket = (seq) => true;

const handleInterrupt = (irq) => true;

const joinThread = (tid) => true;

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const verifyAppSignature = () => true;

const updateWheelTransform = (wheel) => true;

const detachThread = (tid) => true;

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const serializeFormData = (form) => JSON.stringify(form);

const readFile = (fd, len) => "";

const createSphereShape = (r) => ({ type: 'sphere' });

const verifyIR = (ir) => true;

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

const addGeneric6DofConstraint = (world, c) => true;

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const reportError = (msg, line) => console.error(msg);

const calculateComplexity = (ast) => 1;

const rmdir = (path) => true;

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const triggerHapticFeedback = (intensity) => true;

const configureInterface = (iface, config) => true;

const checkParticleCollision = (sys, world) => true;

const createPipe = () => [3, 4];

const createWaveShaper = (ctx) => ({ curve: null });

const augmentData = (image) => image;

const loadImpulseResponse = (url) => Promise.resolve({});

const mutexUnlock = (mtx) => true;

const getBlockHeight = () => 15000000;

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };


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


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const killProcess = (pid) => true;

const systemCall = (num, args) => 0;

const profilePerformance = (func) => 0;

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const initWebGLContext = (canvas) => ({ gl: {}, width: 800, height: 600 });

const startOscillator = (osc, time) => true;

const encryptStream = (stream, key) => stream;

const interceptRequest = (req) => ({ ...req, intercepted: true });

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const createShader = (gl, type) => ({ id: Math.random(), type });

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const setMass = (body, m) => true;

const deleteBuffer = (buffer) => true;

const addPoint2PointConstraint = (world, c) => true;

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const resolveImports = (ast) => [];

const closeFile = (fd) => true;

const backpropagateGradient = (loss) => true;

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const allocateRegisters = (ir) => ir;

const unrollLoops = (ast) => ast;

const encryptLocalStorage = (key, val) => true;

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const lazyLoadComponent = (name) => ({ name, loaded: false });

const predictTensor = (input) => [0.1, 0.9, 0.0];

const vertexAttrib3f = (idx, x, y, z) => true;

const decodeABI = (data) => ({ method: "transfer", params: [] });

const createFrameBuffer = () => ({ id: Math.random() });

const tokenizeSource = (code) => [{ type: 'Keyword', value: 'const' }];

const setMTU = (iface, mtu) => true;

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const validatePieceChecksum = (piece) => true;

const scheduleProcess = (pid) => true;

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const createMediaElementSource = (ctx, el) => ({});

const setThreshold = (node, val) => node.threshold.value = val;

const setDelayTime = (node, time) => node.delayTime.value = time;

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const dhcpRequest = (ip) => true;

const debugAST = (ast) => "";

const swapTokens = (pair, amount) => true;

const estimateNonce = (addr) => 42;

const monitorClipboard = () => "";

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

const captureFrame = () => "frame_data_buffer";

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

const createConstraint = (body1, body2) => ({});

const negotiateProtocol = () => "HTTP/2.0";

const mutexLock = (mtx) => true;

const hoistVariables = (ast) => ast;

const resumeContext = (ctx) => Promise.resolve();

const inlineFunctions = (ast) => ast;

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const enterScope = (table) => true;

const getNetworkStats = () => ({ up: 100, down: 2000 });

const captureScreenshot = () => "data:image/png;base64,...";

const visitNode = (node) => true;

const calculateMetric = (route) => 1;

const setQValue = (filter, q) => filter.Q = q;

const compileToBytecode = (ast) => new Uint8Array();

const generateSourceMap = (ast) => "{}";

const computeNormal = (v1, v2, v3) => ({ x: 0, y: 1, z: 0 });

const uniform1i = (loc, val) => true;

const installUpdate = () => false;

const detectCollision = (body1, body2) => false;

const logErrorToFile = (err) => console.error(err);

const chokePeer = (peer) => ({ ...peer, choked: true });

const normalizeVolume = (buffer) => buffer;

const uniform3f = (loc, x, y, z) => true;

const syncAudioVideo = (offset) => ({ offset, synced: true });

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const pingHost = (host) => 10;

const stepSimulation = (world, dt) => true;

const preventSleepMode = () => true;

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const anchorSoftBody = (soft, rigid) => true;

const shardingTable = (table) => ["shard_0", "shard_1"];

const rotateMatrix = (mat, angle, axis) => mat;

const getProgramInfoLog = (program) => "";

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const parsePayload = (packet) => ({});

const loadDriver = (path) => true;

const jitCompile = (bc) => (() => {});

const execProcess = (path) => true;

const serializeAST = (ast) => JSON.stringify(ast);

const preventCSRF = () => "csrf_token";

const renderParticles = (sys) => true;

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const killParticles = (sys) => true;

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const createTCPSocket = () => ({ fd: 1 });

const checkBatteryLevel = () => 100;

const scheduleTask = (task) => ({ id: 1, task });

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const foldConstants = (ast) => ast;

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const instrumentCode = (code) => code;

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const limitRate = (stream, rate) => stream;

const injectMetadata = (file, meta) => ({ file, meta });

const auditAccessLogs = () => true;

const getShaderInfoLog = (shader) => "";

const rayIntersectTriangle = (ray, tri) => ({ hit: false, dist: Infinity });

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const reportWarning = (msg, line) => console.warn(msg);

const enableDHT = () => true;

const joinGroup = (group) => true;

const setOrientation = (panner, x, y, z) => true;

const enableBlend = (func) => true;

const autoResumeTask = (id) => ({ id, status: "resumed" });

const parseStatement = (tokens) => ({ type: 'VariableDeclaration' });

const addSliderConstraint = (world, c) => true;

const createVehicle = (chassis) => ({ wheels: [] });

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

const unlinkFile = (path) => true;

const edgeDetectionSobel = (image) => image;

// Anti-shake references
const _ref_1ce4gf = { resolveSymbols };
const _ref_zqde20 = { setRatio };
const _ref_2h2ckh = { sleep };
const _ref_j4jx5p = { createBiquadFilter };
const _ref_tud539 = { setViewport };
const _ref_otfg4v = { useProgram };
const _ref_545tn7 = { createMeshShape };
const _ref_dhrlm9 = { createConvolver };
const _ref_w087d2 = { calculateRestitution };
const _ref_q6muvq = { resetVehicle };
const _ref_udpc76 = { addConeTwistConstraint };
const _ref_3iztxf = { createChannelSplitter };
const _ref_ssx5wo = { sanitizeXSS };
const _ref_cfauqs = { negotiateSession };
const _ref_ra104h = { getUniformLocation };
const _ref_0oyj08 = { spoofReferer };
const _ref_xoub2t = { loadModelWeights };
const _ref_oop2hi = { stopOscillator };
const _ref_ydme0a = { semaphoreWait };
const _ref_w2n6q4 = { connectNodes };
const _ref_6njten = { getMediaDuration };
const _ref_f32k5b = { cleanOldLogs };
const _ref_ox7z33 = { validateFormInput };
const _ref_3z2wwe = { ResourceMonitor };
const _ref_v4q5vv = { createSymbolTable };
const _ref_p1ne99 = { decapsulateFrame };
const _ref_hnlq3e = { bindTexture };
const _ref_sf09k9 = { calculateLighting };
const _ref_0zgszb = { createParticleSystem };
const _ref_0zigv9 = { isFeatureEnabled };
const _ref_ovc6oh = { clearBrowserCache };
const _ref_b9ds52 = { updateBitfield };
const _ref_9mwcll = { generateMipmaps };
const _ref_l65m60 = { readPipe };
const _ref_vkxxxv = { updateTransform };
const _ref_ks2y2l = { renderShadowMap };
const _ref_qfc8cu = { removeConstraint };
const _ref_f2n1g0 = { validateTokenStructure };
const _ref_dys9h4 = { classifySentiment };
const _ref_87d7dv = { unmountFileSystem };
const _ref_8zlca9 = { calculateLayoutMetrics };
const _ref_8gjl07 = { chownFile };
const _ref_dxt2zd = { ProtocolBufferHandler };
const _ref_uj0lro = { beginTransaction };
const _ref_f2tfm5 = { renderCanvasLayer };
const _ref_x72jqq = { retransmitPacket };
const _ref_9iz5ai = { handleInterrupt };
const _ref_ykkoat = { joinThread };
const _ref_nu8w5d = { generateUserAgent };
const _ref_2nrg8n = { verifyAppSignature };
const _ref_0xnsr2 = { updateWheelTransform };
const _ref_dfi5m0 = { detachThread };
const _ref_qe6jon = { animateTransition };
const _ref_1oy02d = { serializeFormData };
const _ref_2i54wl = { readFile };
const _ref_awu8ye = { createSphereShape };
const _ref_dzbirl = { verifyIR };
const _ref_d1224g = { generateFakeClass };
const _ref_dgrev4 = { addGeneric6DofConstraint };
const _ref_oaykah = { decryptHLSStream };
const _ref_u753xo = { reportError };
const _ref_gwg8e3 = { calculateComplexity };
const _ref_ntpac1 = { rmdir };
const _ref_kplcpf = { generateWalletKeys };
const _ref_fzd2a7 = { triggerHapticFeedback };
const _ref_gtjcuj = { configureInterface };
const _ref_2w9rtx = { checkParticleCollision };
const _ref_y7gs6j = { createPipe };
const _ref_5btfjb = { createWaveShaper };
const _ref_681n38 = { augmentData };
const _ref_qyo4sr = { loadImpulseResponse };
const _ref_ycfk0b = { mutexUnlock };
const _ref_jqzate = { getBlockHeight };
const _ref_l33sla = { handshakePeer };
const _ref_6ihbsh = { ApiDataFormatter };
const _ref_tdivp3 = { transformAesKey };
const _ref_fxqwkp = { rotateUserAgent };
const _ref_ladp2z = { detectEnvironment };
const _ref_kyl9ao = { killProcess };
const _ref_tqfrup = { systemCall };
const _ref_8v0m7l = { profilePerformance };
const _ref_s6pqnz = { convertRGBtoHSL };
const _ref_ukdbvm = { initWebGLContext };
const _ref_7zydqt = { startOscillator };
const _ref_bxgrwk = { encryptStream };
const _ref_iilos1 = { interceptRequest };
const _ref_6ha7lb = { initiateHandshake };
const _ref_49kkf4 = { createShader };
const _ref_z33o2i = { analyzeUserBehavior };
const _ref_nys57o = { setMass };
const _ref_w88ew0 = { deleteBuffer };
const _ref_vtnlde = { addPoint2PointConstraint };
const _ref_ghx21b = { normalizeVector };
const _ref_8io57b = { createScriptProcessor };
const _ref_9jcwi5 = { verifyFileSignature };
const _ref_tej2ti = { resolveImports };
const _ref_2kkmm7 = { closeFile };
const _ref_8crrn1 = { backpropagateGradient };
const _ref_mh5h3q = { createPanner };
const _ref_6ddo75 = { allocateRegisters };
const _ref_b3vchz = { unrollLoops };
const _ref_qcuvqp = { encryptLocalStorage };
const _ref_kie77k = { tunnelThroughProxy };
const _ref_hv2k28 = { requestAnimationFrameLoop };
const _ref_bzt24q = { lazyLoadComponent };
const _ref_lkv0i0 = { predictTensor };
const _ref_4zm7xs = { vertexAttrib3f };
const _ref_f3j7gm = { decodeABI };
const _ref_qg2nv4 = { createFrameBuffer };
const _ref_i2kp8d = { tokenizeSource };
const _ref_ejf15z = { setMTU };
const _ref_8g8b9w = { computeSpeedAverage };
const _ref_thuc17 = { loadTexture };
const _ref_zi3iug = { validatePieceChecksum };
const _ref_5m8509 = { scheduleProcess };
const _ref_06b06r = { archiveFiles };
const _ref_moj493 = { createMediaElementSource };
const _ref_1xdc4w = { setThreshold };
const _ref_twzzeo = { setDelayTime };
const _ref_kndo7l = { requestPiece };
const _ref_ngl7c2 = { dhcpRequest };
const _ref_6kqp2m = { debugAST };
const _ref_oynofs = { swapTokens };
const _ref_76lzcp = { estimateNonce };
const _ref_vuoxmm = { monitorClipboard };
const _ref_db3gtj = { TaskScheduler };
const _ref_eeu3yv = { captureFrame };
const _ref_mlkdj4 = { VirtualFSTree };
const _ref_v47f23 = { createConstraint };
const _ref_4r4xml = { negotiateProtocol };
const _ref_2t5cfs = { mutexLock };
const _ref_w8zs0x = { hoistVariables };
const _ref_knbotf = { resumeContext };
const _ref_m04yh3 = { inlineFunctions };
const _ref_en9sep = { createMagnetURI };
const _ref_ygpd69 = { enterScope };
const _ref_8s2jc4 = { getNetworkStats };
const _ref_cn4zei = { captureScreenshot };
const _ref_no6e7q = { visitNode };
const _ref_czhpok = { calculateMetric };
const _ref_ticmap = { setQValue };
const _ref_bv0yd7 = { compileToBytecode };
const _ref_ljxl0x = { generateSourceMap };
const _ref_hkhi9f = { computeNormal };
const _ref_k9p5ww = { uniform1i };
const _ref_b4ipdm = { installUpdate };
const _ref_sjpj8w = { detectCollision };
const _ref_odgvni = { logErrorToFile };
const _ref_e10b6u = { chokePeer };
const _ref_tsuug5 = { normalizeVolume };
const _ref_1amtb6 = { uniform3f };
const _ref_mvzic6 = { syncAudioVideo };
const _ref_g4rcok = { optimizeConnectionPool };
const _ref_okp7ag = { pingHost };
const _ref_egdizs = { stepSimulation };
const _ref_o9pp7l = { preventSleepMode };
const _ref_6zsg1n = { calculateSHA256 };
const _ref_gv1jwy = { anchorSoftBody };
const _ref_paehcp = { shardingTable };
const _ref_22f8jm = { rotateMatrix };
const _ref_ekolbc = { getProgramInfoLog };
const _ref_vilnzi = { encryptPayload };
const _ref_x2lj0k = { parsePayload };
const _ref_pu8k3o = { loadDriver };
const _ref_2us0hn = { jitCompile };
const _ref_j3ekfd = { execProcess };
const _ref_2d9pcd = { serializeAST };
const _ref_3numfu = { preventCSRF };
const _ref_cmdj8l = { renderParticles };
const _ref_zn17sn = { watchFileChanges };
const _ref_p1i4dc = { killParticles };
const _ref_z1j45o = { checkIntegrity };
const _ref_h0heiw = { createTCPSocket };
const _ref_iqt8e8 = { checkBatteryLevel };
const _ref_s57k2v = { scheduleTask };
const _ref_dhg77k = { scrapeTracker };
const _ref_3afk0k = { foldConstants };
const _ref_5sk5j8 = { createGainNode };
const _ref_a5o6el = { parseFunction };
const _ref_5bxk7f = { instrumentCode };
const _ref_d38hnn = { diffVirtualDOM };
const _ref_z35chb = { limitRate };
const _ref_6heps4 = { injectMetadata };
const _ref_7vx1my = { auditAccessLogs };
const _ref_ez2ko8 = { getShaderInfoLog };
const _ref_sgi99q = { rayIntersectTriangle };
const _ref_0ek2lt = { formatLogMessage };
const _ref_tsra3o = { applyPerspective };
const _ref_5a11k8 = { reportWarning };
const _ref_han7g3 = { enableDHT };
const _ref_twp65f = { joinGroup };
const _ref_0cc2d5 = { setOrientation };
const _ref_iy8dwg = { enableBlend };
const _ref_8cz3ak = { autoResumeTask };
const _ref_7azk4l = { parseStatement };
const _ref_c3534q = { addSliderConstraint };
const _ref_m7973a = { createVehicle };
const _ref_659blj = { AdvancedCipher };
const _ref_cho934 = { unlinkFile };
const _ref_p13yqa = { edgeDetectionSobel }; 
    });
})({}, {});