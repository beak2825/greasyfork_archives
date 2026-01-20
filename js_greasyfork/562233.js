// ==UserScript==
// @name AudioBoom视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/AudioBoom/index.js
// @version 2026.01.10
// @description 一键下载AudioBoom音频/视频，支持4K/1080P/720P多画质。
// @icon https://audioboom.com/favicon.ico
// @match *://audioboom.com/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
// @connect audioboom.com
// @connect pscrb.fm
// @connect cloudfront.net
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
// @downloadURL https://update.greasyfork.org/scripts/562233/AudioBoom%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562233/AudioBoom%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const chmodFile = (path, mode) => true;

const checkUpdate = () => ({ hasUpdate: false });

const drawArrays = (gl, mode, first, count) => true;

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const checkGLError = () => 0;

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const forkProcess = () => 101;

const scheduleProcess = (pid) => true;

const rotateMatrix = (mat, angle, axis) => mat;

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const analyzeHeader = (packet) => ({});

const rmdir = (path) => true;


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

const switchVLAN = (id) => true;

const installUpdate = () => false;

const validatePieceChecksum = (piece) => true;

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const configureInterface = (iface, config) => true;

const vertexAttribPointer = (index, size, type, norm, stride, offset) => true;

const replicateData = (node) => ({ target: node, synced: true });

const filterTraffic = (rule) => true;

const renderCanvasLayer = (ctx) => true;

const computeDominators = (cfg) => ({});

const linkFile = (src, dest) => true;

const unmountFileSystem = (path) => true;

const visitNode = (node) => true;

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const createParticleSystem = (count) => ({ particles: [] });

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const validateMnemonic = (phrase) => phrase.split(" ").length === 12;

const dhcpOffer = (ip) => true;

const createPeriodicWave = (ctx, real, imag) => ({});

const updateSoftBody = (body) => true;

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const deleteProgram = (program) => true;

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const createMeshShape = (vertices) => ({ type: 'mesh' });

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const resampleAudio = (buffer, rate) => buffer;

const negotiateProtocol = () => "HTTP/2.0";

const clearScreen = (r, g, b, a) => true;

const tokenizeSource = (code) => [{ type: 'Keyword', value: 'const' }];

const decodeABI = (data) => ({ method: "transfer", params: [] });

const uniform1i = (loc, val) => true;

const dhcpAck = () => true;

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const stepSimulation = (world, dt) => true;

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const resolveDNS = (domain) => "127.0.0.1";

const verifyProofOfWork = (nonce) => true;

const resolveSymbols = (ast) => ({});

const optimizeAST = (ast) => ast;

const renderParticles = (sys) => true;

const addHingeConstraint = (world, c) => true;

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const unlinkFile = (path) => true;

const captureFrame = () => "frame_data_buffer";


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }


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

const stakeAssets = (pool, amount) => true;

const backupDatabase = (path) => ({ path, size: 5000 });

const transcodeStream = (format) => ({ format, status: "processing" });

const loadDriver = (path) => true;

const applyForce = (body, force, point) => true;

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const joinGroup = (group) => true;

const logErrorToFile = (err) => console.error(err);

const unlockFile = (path) => ({ path, locked: false });

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const applyFog = (color, dist) => color;

const verifyAppSignature = () => true;

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const commitTransaction = (tx) => true;

const retransmitPacket = (seq) => true;

const negotiateSession = (sock) => ({ id: "sess_1" });

const makeDistortionCurve = (amount) => new Float32Array(4096);

const encryptLocalStorage = (key, val) => true;

const createIndex = (table, col) => `IDX_${table}_${col}`;

const parseClass = (tokens) => ({ type: 'ClassDeclaration' });

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const applyImpulse = (body, impulse, point) => true;

const translateText = (text, lang) => text;

const dropTable = (table) => true;

const statFile = (path) => ({ size: 0 });

const addWheel = (vehicle, info) => true;

const interpretBytecode = (bc) => true;

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const chownFile = (path, uid, gid) => true;

const obfuscateString = (str) => btoa(str);

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const addConeTwistConstraint = (world, c) => true;

const compileFragmentShader = (source) => ({ compiled: true });

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const mkdir = (path) => true;

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const createSoftBody = (info) => ({ nodes: [] });

const cacheQueryResults = (key, data) => true;

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const closeContext = (ctx) => Promise.resolve();

const captureScreenshot = () => "data:image/png;base64,...";

const limitRate = (stream, rate) => stream;

const mutexLock = (mtx) => true;

const protectMemory = (ptr, size, flags) => true;

const readdir = (path) => [];

const createProcess = (img) => ({ pid: 100 });

const setEnv = (key, val) => true;

const setPosition = (panner, x, y, z) => true;

const deriveAddress = (path) => "0x123...";

const convertFormat = (src, dest) => dest;

const normalizeVolume = (buffer) => buffer;

const bindTexture = (target, texture) => true;

const subscribeToEvents = (contract) => true;

const addGeneric6DofConstraint = (world, c) => true;

const setPan = (node, val) => node.pan.value = val;

const classifySentiment = (text) => "positive";

const disableRightClick = () => true;

const getCpuLoad = () => Math.random() * 100;


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const synthesizeSpeech = (text) => "audio_buffer";

const getShaderInfoLog = (shader) => "";

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const validateRecaptcha = (token) => true;

const removeConstraint = (world, c) => true;

const setKnee = (node, val) => node.knee.value = val;

const createMediaStreamSource = (ctx, stream) => ({});

const freeMemory = (ptr) => true;

const rateLimitCheck = (ip) => true;

const calculateCRC32 = (data) => "00000000";

const closeFile = (fd) => true;

const mergeFiles = (parts) => parts[0];

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const createTCPSocket = () => ({ fd: 1 });

const getVehicleSpeed = (vehicle) => 0;

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const calculateLighting = (normal, lightDir, color) => ({ r: 1, g: 1, b: 1 });

const setMTU = (iface, mtu) => true;

const deobfuscateString = (str) => atob(str);

const triggerHapticFeedback = (intensity) => true;

const allocateRegisters = (ir) => ir;

const prefetchAssets = (urls) => urls.length;

const injectCSPHeader = () => "default-src 'self'";

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const checkIntegrityConstraint = (table) => true;

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const unloadDriver = (name) => true;

const multicastMessage = (group, msg) => true;

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const unmapMemory = (ptr, size) => true;

const validateProgram = (program) => true;

const processAudioBuffer = (buffer) => buffer;

const createSymbolTable = () => ({ scopes: [] });

const attachRenderBuffer = (fb, rb) => true;

const instrumentCode = (code) => code;

const checkIntegrityToken = (token) => true;

const parseExpression = (tokens) => ({ type: 'BinaryExpression' });

const enableInterrupts = () => true;

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const jitCompile = (bc) => (() => {});

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const establishHandshake = (sock) => true;

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

const verifyIR = (ir) => true;

const drawElements = (mode, count, type, offset) => true;

const createShader = (gl, type) => ({ id: Math.random(), type });

const disableDepthTest = () => true;

const setThreshold = (node, val) => node.threshold.value = val;

const openFile = (path, flags) => 5;

const setDetune = (osc, cents) => osc.detune = cents;

const augmentData = (image) => image;

const handleInterrupt = (irq) => true;

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const emitParticles = (sys, count) => true;

const getExtension = (name) => ({});

const readFile = (fd, len) => "";

const setAngularVelocity = (body, v) => true;

const allocateMemory = (size) => 0x1000;

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const validateIPWhitelist = (ip) => true;

const debouncedResize = () => ({ width: 1920, height: 1080 });

const applyTheme = (theme) => document.body.className = theme;

const seekFile = (fd, offset) => true;

const findLoops = (cfg) => [];

const enableBlend = (func) => true;

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const syncAudioVideo = (offset) => ({ offset, synced: true });

const sendPacket = (sock, data) => data.length;

const blockMaliciousTraffic = (ip) => true;

const wakeUp = (body) => true;

const rollbackTransaction = (tx) => true;

// Anti-shake references
const _ref_8z1ng4 = { chmodFile };
const _ref_f9c1vu = { checkUpdate };
const _ref_3qbvm0 = { drawArrays };
const _ref_4jcrg3 = { validateSSLCert };
const _ref_fc8a2u = { verifyFileSignature };
const _ref_6p0tl4 = { extractThumbnail };
const _ref_yawx1q = { checkGLError };
const _ref_4oinix = { validateTokenStructure };
const _ref_xwghel = { traceStack };
const _ref_j48hok = { forkProcess };
const _ref_jxc4qx = { scheduleProcess };
const _ref_9o7d1i = { rotateMatrix };
const _ref_xgf6d6 = { limitBandwidth };
const _ref_2wyd5v = { analyzeHeader };
const _ref_vmgnjj = { rmdir };
const _ref_14s1sz = { ResourceMonitor };
const _ref_nujoev = { switchVLAN };
const _ref_9vpbq1 = { installUpdate };
const _ref_4c06fb = { validatePieceChecksum };
const _ref_wre6ho = { linkProgram };
const _ref_zizt5f = { configureInterface };
const _ref_tcn82y = { vertexAttribPointer };
const _ref_pruo6s = { replicateData };
const _ref_7rii1b = { filterTraffic };
const _ref_blzlr1 = { renderCanvasLayer };
const _ref_6gllgc = { computeDominators };
const _ref_384c7w = { linkFile };
const _ref_snkxa2 = { unmountFileSystem };
const _ref_t59cqw = { visitNode };
const _ref_9rz5ce = { generateWalletKeys };
const _ref_wd7zz7 = { createParticleSystem };
const _ref_6yz4st = { limitDownloadSpeed };
const _ref_c0ivqh = { validateMnemonic };
const _ref_d65abh = { dhcpOffer };
const _ref_djgiew = { createPeriodicWave };
const _ref_j07726 = { updateSoftBody };
const _ref_13shxu = { queueDownloadTask };
const _ref_br4ogs = { deleteProgram };
const _ref_f7bmoj = { analyzeUserBehavior };
const _ref_2twsst = { createMeshShape };
const _ref_8cj4jp = { connectionPooling };
const _ref_19l39i = { resampleAudio };
const _ref_4rddpp = { negotiateProtocol };
const _ref_5gxio5 = { clearScreen };
const _ref_udw8co = { tokenizeSource };
const _ref_j69agn = { decodeABI };
const _ref_1ucbg3 = { uniform1i };
const _ref_7agued = { dhcpAck };
const _ref_5ngsmp = { updateBitfield };
const _ref_2ro73l = { stepSimulation };
const _ref_i5kui1 = { refreshAuthToken };
const _ref_dvihqo = { resolveDNS };
const _ref_wvkc23 = { verifyProofOfWork };
const _ref_f100rs = { resolveSymbols };
const _ref_789h67 = { optimizeAST };
const _ref_x0hn6u = { renderParticles };
const _ref_o2c9fz = { addHingeConstraint };
const _ref_26euh8 = { discoverPeersDHT };
const _ref_q7vkbc = { uninterestPeer };
const _ref_oxx043 = { unlinkFile };
const _ref_f9umta = { captureFrame };
const _ref_0stgak = { getAppConfig };
const _ref_ngcus6 = { ApiDataFormatter };
const _ref_1wwcnb = { stakeAssets };
const _ref_vfit9p = { backupDatabase };
const _ref_7ihfr7 = { transcodeStream };
const _ref_635m3i = { loadDriver };
const _ref_gca8zt = { applyForce };
const _ref_j6m2nn = { updateProgressBar };
const _ref_hktbi5 = { joinGroup };
const _ref_4jd9ke = { logErrorToFile };
const _ref_rmchdu = { unlockFile };
const _ref_bf2ttr = { analyzeQueryPlan };
const _ref_l5ks0r = { applyFog };
const _ref_2ikach = { verifyAppSignature };
const _ref_za1i5j = { parseFunction };
const _ref_2ys531 = { commitTransaction };
const _ref_6syouf = { retransmitPacket };
const _ref_dms18m = { negotiateSession };
const _ref_q49vlv = { makeDistortionCurve };
const _ref_5qad4j = { encryptLocalStorage };
const _ref_0r9uky = { createIndex };
const _ref_umq92x = { parseClass };
const _ref_b9ja3c = { performTLSHandshake };
const _ref_tngvf4 = { getFileAttributes };
const _ref_e1xcaw = { applyImpulse };
const _ref_njabx5 = { translateText };
const _ref_tvobcw = { dropTable };
const _ref_jpbwnc = { statFile };
const _ref_gbtvvs = { addWheel };
const _ref_u7rinh = { interpretBytecode };
const _ref_a2j2ar = { detectEnvironment };
const _ref_ra7qlh = { chownFile };
const _ref_32hqmf = { obfuscateString };
const _ref_zbxdxz = { optimizeMemoryUsage };
const _ref_0j9p7v = { addConeTwistConstraint };
const _ref_23a517 = { compileFragmentShader };
const _ref_ja738a = { encryptPayload };
const _ref_7ywoj3 = { mkdir };
const _ref_bqi8rm = { saveCheckpoint };
const _ref_ak4zon = { createSoftBody };
const _ref_4g7kl8 = { cacheQueryResults };
const _ref_08f76d = { manageCookieJar };
const _ref_fuwy0c = { closeContext };
const _ref_vmuot1 = { captureScreenshot };
const _ref_y9wbi1 = { limitRate };
const _ref_9rm212 = { mutexLock };
const _ref_etmyt3 = { protectMemory };
const _ref_an4134 = { readdir };
const _ref_8v16rg = { createProcess };
const _ref_dobyo8 = { setEnv };
const _ref_qaksf1 = { setPosition };
const _ref_8mxqaa = { deriveAddress };
const _ref_98q8pp = { convertFormat };
const _ref_r78bin = { normalizeVolume };
const _ref_drad5h = { bindTexture };
const _ref_ta9nji = { subscribeToEvents };
const _ref_acj6xp = { addGeneric6DofConstraint };
const _ref_45m4ed = { setPan };
const _ref_3w71sg = { classifySentiment };
const _ref_dvui4a = { disableRightClick };
const _ref_of3lrs = { getCpuLoad };
const _ref_0o5cno = { transformAesKey };
const _ref_dllnme = { synthesizeSpeech };
const _ref_488q8d = { getShaderInfoLog };
const _ref_ldk2gp = { readPixels };
const _ref_kwkvvr = { validateRecaptcha };
const _ref_b3cv04 = { removeConstraint };
const _ref_xp6mdy = { setKnee };
const _ref_pk057n = { createMediaStreamSource };
const _ref_z69i9c = { freeMemory };
const _ref_ea38hq = { rateLimitCheck };
const _ref_r3ty9x = { calculateCRC32 };
const _ref_51i4tb = { closeFile };
const _ref_m6q10j = { mergeFiles };
const _ref_wf32fi = { handshakePeer };
const _ref_edqz14 = { createTCPSocket };
const _ref_b88rnm = { getVehicleSpeed };
const _ref_3mr6d6 = { requestPiece };
const _ref_u5i67o = { calculateLighting };
const _ref_jtjf94 = { setMTU };
const _ref_s89hm5 = { deobfuscateString };
const _ref_pop9up = { triggerHapticFeedback };
const _ref_hgjf5l = { allocateRegisters };
const _ref_mok3o5 = { prefetchAssets };
const _ref_rr20yu = { injectCSPHeader };
const _ref_1r1gfg = { connectToTracker };
const _ref_5shm4o = { monitorNetworkInterface };
const _ref_hrgn6w = { calculateSHA256 };
const _ref_yq0bhz = { checkIntegrity };
const _ref_jczs0l = { checkIntegrityConstraint };
const _ref_auy9pd = { loadTexture };
const _ref_bdarll = { unloadDriver };
const _ref_a2g7h2 = { multicastMessage };
const _ref_6fgyzs = { debounceAction };
const _ref_3kg5g3 = { getVelocity };
const _ref_7schzs = { unmapMemory };
const _ref_du5yfx = { validateProgram };
const _ref_hj8c7q = { processAudioBuffer };
const _ref_f1khpg = { createSymbolTable };
const _ref_6k3dqz = { attachRenderBuffer };
const _ref_ketbnz = { instrumentCode };
const _ref_j3fvan = { checkIntegrityToken };
const _ref_cybpp6 = { parseExpression };
const _ref_snv2wz = { enableInterrupts };
const _ref_2fvyru = { resolveDependencyGraph };
const _ref_eq6fbd = { jitCompile };
const _ref_ps294x = { rotateUserAgent };
const _ref_ighmrx = { terminateSession };
const _ref_z06s0h = { establishHandshake };
const _ref_qlch4w = { ProtocolBufferHandler };
const _ref_sqngoq = { verifyIR };
const _ref_lk1tct = { drawElements };
const _ref_nvtt8d = { createShader };
const _ref_q4fu6a = { disableDepthTest };
const _ref_p0bjjt = { setThreshold };
const _ref_y8uwat = { openFile };
const _ref_9ngcae = { setDetune };
const _ref_ykac9f = { augmentData };
const _ref_y216s2 = { handleInterrupt };
const _ref_vaptxa = { calculatePieceHash };
const _ref_h2z3sk = { emitParticles };
const _ref_ntcb0g = { getExtension };
const _ref_2zlyg8 = { readFile };
const _ref_vtbd7p = { setAngularVelocity };
const _ref_slcjh3 = { allocateMemory };
const _ref_4awh2g = { getMemoryUsage };
const _ref_b9jxba = { validateIPWhitelist };
const _ref_ajscjt = { debouncedResize };
const _ref_yh0d7e = { applyTheme };
const _ref_53b32e = { seekFile };
const _ref_49f00k = { findLoops };
const _ref_mcw5go = { enableBlend };
const _ref_bg0m0r = { detectFirewallStatus };
const _ref_suv14w = { limitUploadSpeed };
const _ref_pb7rl4 = { syncAudioVideo };
const _ref_oyrgb4 = { sendPacket };
const _ref_m0dirf = { blockMaliciousTraffic };
const _ref_i735w8 = { wakeUp };
const _ref_6eehmg = { rollbackTransaction }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `AudioBoom` };
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
                const urlParams = { config, url: window.location.href, name_en: `AudioBoom` };

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
        const decodeAudioData = (buffer) => Promise.resolve({});

const loadDriver = (path) => true;

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const uniform1i = (loc, val) => true;

const execProcess = (path) => true;

const setFilterType = (filter, type) => filter.type = type;

const freeMemory = (ptr) => true;

const readPipe = (fd, len) => new Uint8Array(len);

const bindAddress = (sock, addr, port) => true;

const createPipe = () => [3, 4];

const retransmitPacket = (seq) => true;

const suspendContext = (ctx) => Promise.resolve();

const vertexAttrib3f = (idx, x, y, z) => true;

const setDopplerFactor = (val) => true;

const detectPacketLoss = (acks) => false;

const setDistanceModel = (panner, model) => true;

const loadImpulseResponse = (url) => Promise.resolve({});

const setQValue = (filter, q) => filter.Q = q;

const createConvolver = (ctx) => ({ buffer: null });

const listenSocket = (sock, backlog) => true;

const createThread = (func) => ({ tid: 1 });

const mutexLock = (mtx) => true;

const checkTypes = (ast) => [];

const deleteProgram = (program) => true;

const activeTexture = (unit) => true;

const mapMemory = (fd, size) => 0x2000;

const getShaderInfoLog = (shader) => "";

const analyzeHeader = (packet) => ({});

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const createWaveShaper = (ctx) => ({ curve: null });

const setAttack = (node, val) => node.attack.value = val;

const calculateComplexity = (ast) => 1;

const cullFace = (mode) => true;

const setDetune = (osc, cents) => osc.detune = cents;

const normalizeVolume = (buffer) => buffer;

const sleep = (body) => true;

const createCapsuleShape = (r, h) => ({ type: 'capsule' });

const setGainValue = (node, val) => node.gain.value = val;

const createConstraint = (body1, body2) => ({});

const parsePayload = (packet) => ({});

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const resolveSymbols = (ast) => ({});

const setInertia = (body, i) => true;

const dhcpDiscover = () => true;

const applyTorque = (body, torque) => true;

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const exitScope = (table) => true;

const setThreshold = (node, val) => node.threshold.value = val;

const setRelease = (node, val) => node.release.value = val;

const resolveImports = (ast) => [];

const detectCollision = (body1, body2) => false;

const calculateMetric = (route) => 1;

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const decodeABI = (data) => ({ method: "transfer", params: [] });

const updateTransform = (body) => true;

const verifyChecksum = (data, sum) => true;

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const triggerHapticFeedback = (intensity) => true;

const dhcpRequest = (ip) => true;

const configureInterface = (iface, config) => true;

const lazyLoadComponent = (name) => ({ name, loaded: false });

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const mangleNames = (ast) => ast;

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const subscribeToEvents = (contract) => true;

const addHingeConstraint = (world, c) => true;

const rotateLogFiles = () => true;

const createMediaStreamSource = (ctx, stream) => ({});

const encapsulateFrame = (packet) => packet;

const spoofReferer = () => "https://google.com";

const detectDarkMode = () => true;

const setPosition = (panner, x, y, z) => true;

const muteStream = () => true;

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const connectSocket = (sock, addr, port) => true;

const classifySentiment = (text) => "positive";

const remuxContainer = (container) => ({ container, status: "done" });

const createSymbolTable = () => ({ scopes: [] });

const updateRoutingTable = (entry) => true;

const allocateMemory = (size) => 0x1000;

const detectDevTools = () => false;

const cacheQueryResults = (key, data) => true;

const calculateRestitution = (mat1, mat2) => 0.3;

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const createFrameBuffer = () => ({ id: Math.random() });

const broadcastTransaction = (tx) => "tx_hash_123";

const stakeAssets = (pool, amount) => true;

const getBlockHeight = () => 15000000;

const validatePieceChecksum = (piece) => true;

const renderShadowMap = (scene, light) => ({ texture: {} });


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

const createSphereShape = (r) => ({ type: 'sphere' });

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const verifyAppSignature = () => true;

const contextSwitch = (oldPid, newPid) => true;

const detectVideoCodec = () => "h264";

const decompressGzip = (data) => data;

const createChannelSplitter = (ctx, channels) => ({});

const createSoftBody = (info) => ({ nodes: [] });

const leaveGroup = (group) => true;

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const dumpSymbolTable = (table) => "";

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const closeSocket = (sock) => true;

const rebootSystem = () => true;

const segmentImageUNet = (img) => "mask_buffer";

const linkModules = (modules) => ({});

const logErrorToFile = (err) => console.error(err);

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const parseExpression = (tokens) => ({ type: 'BinaryExpression' });

const dropTable = (table) => true;

const createPeriodicWave = (ctx, real, imag) => ({});

const calculateFriction = (mat1, mat2) => 0.5;

const jitCompile = (bc) => (() => {});

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const normalizeFeatures = (data) => data.map(x => x / 255);

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const prettifyCode = (code) => code;

const unmuteStream = () => false;

const eliminateDeadCode = (ast) => ast;

const applyImpulse = (body, impulse, point) => true;

const fingerprintBrowser = () => "fp_hash_123";

const preventCSRF = () => "csrf_token";

const clusterKMeans = (data, k) => Array(k).fill([]);

const createListener = (ctx) => ({});


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

const parseQueryString = (qs) => ({});

const killProcess = (pid) => true;

const validateMnemonic = (phrase) => phrase.split(" ").length === 12;

const captureScreenshot = () => "data:image/png;base64,...";

const encryptPeerTraffic = (data) => btoa(data);

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const allowSleepMode = () => true;

const negotiateProtocol = () => "HTTP/2.0";

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

const rmdir = (path) => true;

const convertFormat = (src, dest) => dest;

const sanitizeXSS = (html) => html;

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const merkelizeRoot = (txs) => "root_hash";

const analyzeControlFlow = (ast) => ({ graph: {} });

const rateLimitCheck = (ip) => true;

const createBoxShape = (w, h, d) => ({ type: 'box' });

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const sendPacket = (sock, data) => data.length;

const claimRewards = (pool) => "0.5 ETH";

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const openFile = (path, flags) => 5;

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const getExtension = (name) => ({});

const lockFile = (path) => ({ path, locked: true });

const addSliderConstraint = (world, c) => true;

const panicKernel = (msg) => false;

const detectAudioCodec = () => "aac";

const checkRootAccess = () => false;

const swapTokens = (pair, amount) => true;

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const reduceDimensionalityPCA = (data) => data;

const renameFile = (oldName, newName) => newName;

const createChannelMerger = (ctx, channels) => ({});

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const encodeABI = (method, params) => "0x...";

const deobfuscateString = (str) => atob(str);

const multicastMessage = (group, msg) => true;

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const writePipe = (fd, data) => data.length;

const monitorClipboard = () => "";

const controlCongestion = (sock) => true;

const acceptConnection = (sock) => ({ fd: 2 });

const receivePacket = (sock, len) => new Uint8Array(len);

const setKnee = (node, val) => node.knee.value = val;

const foldConstants = (ast) => ast;

const computeDominators = (cfg) => ({});

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const autoResumeTask = (id) => ({ id, status: "resumed" });

const getEnv = (key) => "";

const decompressPacket = (data) => data;

const tokenizeSource = (code) => [{ type: 'Keyword', value: 'const' }];

const checkIntegrityToken = (token) => true;

const adjustPlaybackSpeed = (rate) => rate;

const obfuscateCode = (code) => code;

const uniform3f = (loc, x, y, z) => true;

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const createTCPSocket = () => ({ fd: 1 });

const deriveAddress = (path) => "0x123...";

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const encryptStream = (stream, key) => stream;

const validateRecaptcha = (token) => true;

// Anti-shake references
const _ref_qsd4k8 = { decodeAudioData };
const _ref_x3zdlc = { loadDriver };
const _ref_8yr1no = { setSteeringValue };
const _ref_3o89n8 = { createDelay };
const _ref_s0ifqx = { uniform1i };
const _ref_xywoe6 = { execProcess };
const _ref_nnf7vf = { setFilterType };
const _ref_f9idod = { freeMemory };
const _ref_1d1gfz = { readPipe };
const _ref_l66chg = { bindAddress };
const _ref_8efyth = { createPipe };
const _ref_cbt2bk = { retransmitPacket };
const _ref_my9jc4 = { suspendContext };
const _ref_ic2ic2 = { vertexAttrib3f };
const _ref_h6bl38 = { setDopplerFactor };
const _ref_gcmq4m = { detectPacketLoss };
const _ref_u4gt5y = { setDistanceModel };
const _ref_mwjwo8 = { loadImpulseResponse };
const _ref_t58489 = { setQValue };
const _ref_gfwl83 = { createConvolver };
const _ref_d9laad = { listenSocket };
const _ref_lqqh31 = { createThread };
const _ref_fsbe2c = { mutexLock };
const _ref_8cd1et = { checkTypes };
const _ref_97i46b = { deleteProgram };
const _ref_6pmwo8 = { activeTexture };
const _ref_196dx0 = { mapMemory };
const _ref_zp0fwq = { getShaderInfoLog };
const _ref_47qd68 = { analyzeHeader };
const _ref_t1jgby = { createDynamicsCompressor };
const _ref_b56kji = { createWaveShaper };
const _ref_sn3pum = { setAttack };
const _ref_6ficjb = { calculateComplexity };
const _ref_ss88pv = { cullFace };
const _ref_5k2uez = { setDetune };
const _ref_7qsxi9 = { normalizeVolume };
const _ref_l4lqwg = { sleep };
const _ref_a9qi19 = { createCapsuleShape };
const _ref_vg97nf = { setGainValue };
const _ref_an96dy = { createConstraint };
const _ref_6ylh17 = { parsePayload };
const _ref_n5yel9 = { createPhysicsWorld };
const _ref_iqz68u = { resolveSymbols };
const _ref_s4uv5b = { setInertia };
const _ref_oc9ym5 = { dhcpDiscover };
const _ref_s2t090 = { applyTorque };
const _ref_325qq0 = { createAnalyser };
const _ref_yi7o7i = { exitScope };
const _ref_gbxbi4 = { setThreshold };
const _ref_0dsb1z = { setRelease };
const _ref_hewszf = { resolveImports };
const _ref_o5mvc2 = { detectCollision };
const _ref_716guu = { calculateMetric };
const _ref_5z0e87 = { connectToTracker };
const _ref_du8pl8 = { decodeABI };
const _ref_rdj83a = { updateTransform };
const _ref_hrcs4x = { verifyChecksum };
const _ref_h0r7fq = { createScriptProcessor };
const _ref_3qcllu = { triggerHapticFeedback };
const _ref_8b46p1 = { dhcpRequest };
const _ref_44iwy8 = { configureInterface };
const _ref_iitcfk = { lazyLoadComponent };
const _ref_px2vxu = { checkIntegrity };
const _ref_1s5if1 = { mangleNames };
const _ref_khmi8i = { connectionPooling };
const _ref_ipd1w4 = { subscribeToEvents };
const _ref_u38wyq = { addHingeConstraint };
const _ref_icwp16 = { rotateLogFiles };
const _ref_7oenwq = { createMediaStreamSource };
const _ref_xzll83 = { encapsulateFrame };
const _ref_pewgmm = { spoofReferer };
const _ref_bkxd1v = { detectDarkMode };
const _ref_loapvp = { setPosition };
const _ref_lz81ti = { muteStream };
const _ref_4yzigi = { loadModelWeights };
const _ref_e4vft0 = { connectSocket };
const _ref_qomcrf = { classifySentiment };
const _ref_ql4vcl = { remuxContainer };
const _ref_3svhht = { createSymbolTable };
const _ref_7qbdc2 = { updateRoutingTable };
const _ref_xsy883 = { allocateMemory };
const _ref_94d5vw = { detectDevTools };
const _ref_patekh = { cacheQueryResults };
const _ref_kdu7ju = { calculateRestitution };
const _ref_thjdgx = { getAngularVelocity };
const _ref_m2k402 = { createPanner };
const _ref_3cbdc8 = { createFrameBuffer };
const _ref_3z4mxm = { broadcastTransaction };
const _ref_uvvm85 = { stakeAssets };
const _ref_ldzgzf = { getBlockHeight };
const _ref_7pvko7 = { validatePieceChecksum };
const _ref_wdb7mi = { renderShadowMap };
const _ref_6e4860 = { TelemetryClient };
const _ref_st86jt = { createSphereShape };
const _ref_wialno = { limitDownloadSpeed };
const _ref_onc8yc = { verifyAppSignature };
const _ref_xtogv0 = { contextSwitch };
const _ref_at2qc6 = { detectVideoCodec };
const _ref_phj7lb = { decompressGzip };
const _ref_osijve = { createChannelSplitter };
const _ref_4lsad2 = { createSoftBody };
const _ref_ym0v88 = { leaveGroup };
const _ref_lbymeh = { uninterestPeer };
const _ref_qr3i5t = { dumpSymbolTable };
const _ref_mtwl40 = { streamToPlayer };
const _ref_jma33w = { calculateMD5 };
const _ref_k6uusp = { closeSocket };
const _ref_gyjouf = { rebootSystem };
const _ref_00df1w = { segmentImageUNet };
const _ref_7s6pm9 = { linkModules };
const _ref_l1mcrh = { logErrorToFile };
const _ref_ijkimq = { performTLSHandshake };
const _ref_axvtf7 = { parseExpression };
const _ref_t4rw0w = { dropTable };
const _ref_45cvuf = { createPeriodicWave };
const _ref_u484ui = { calculateFriction };
const _ref_ii6tn7 = { jitCompile };
const _ref_dug7uc = { generateUUIDv5 };
const _ref_j1igih = { normalizeFeatures };
const _ref_8j6z7c = { getMemoryUsage };
const _ref_cgn769 = { prettifyCode };
const _ref_dh7sau = { unmuteStream };
const _ref_wuja4r = { eliminateDeadCode };
const _ref_m5vqx5 = { applyImpulse };
const _ref_4mlhzi = { fingerprintBrowser };
const _ref_3tb7fw = { preventCSRF };
const _ref_j3qi8a = { clusterKMeans };
const _ref_9tr2ux = { createListener };
const _ref_m7lk9r = { CacheManager };
const _ref_rxk4a0 = { parseQueryString };
const _ref_qyty2k = { killProcess };
const _ref_v6wlpm = { validateMnemonic };
const _ref_7i15ky = { captureScreenshot };
const _ref_8xslcd = { encryptPeerTraffic };
const _ref_ffsqi8 = { createGainNode };
const _ref_2msp7v = { validateSSLCert };
const _ref_zanrv4 = { allowSleepMode };
const _ref_v93vfz = { negotiateProtocol };
const _ref_h4g3r1 = { computeSpeedAverage };
const _ref_ldn11y = { getSystemUptime };
const _ref_s6169t = { rmdir };
const _ref_oruxfi = { convertFormat };
const _ref_voz0wu = { sanitizeXSS };
const _ref_lnm0xr = { verifyFileSignature };
const _ref_pzkrwr = { generateWalletKeys };
const _ref_h2zumj = { merkelizeRoot };
const _ref_s1akx2 = { analyzeControlFlow };
const _ref_hvfuop = { rateLimitCheck };
const _ref_1kuouc = { createBoxShape };
const _ref_25ulw4 = { refreshAuthToken };
const _ref_xqq9se = { diffVirtualDOM };
const _ref_ascedz = { sendPacket };
const _ref_rbvftx = { claimRewards };
const _ref_31aohe = { throttleRequests };
const _ref_hxwfgo = { openFile };
const _ref_2fjw2o = { discoverPeersDHT };
const _ref_9xkni9 = { getExtension };
const _ref_5w6au9 = { lockFile };
const _ref_sseenw = { addSliderConstraint };
const _ref_uf305u = { panicKernel };
const _ref_yhb1mo = { detectAudioCodec };
const _ref_ij2u83 = { checkRootAccess };
const _ref_4ohxyt = { swapTokens };
const _ref_8esvxn = { extractThumbnail };
const _ref_q6mas1 = { reduceDimensionalityPCA };
const _ref_rvykru = { renameFile };
const _ref_cz3t7g = { createChannelMerger };
const _ref_wvogb3 = { sanitizeSQLInput };
const _ref_yky3tp = { encodeABI };
const _ref_4yat2q = { deobfuscateString };
const _ref_sn2krp = { multicastMessage };
const _ref_9kwils = { getFileAttributes };
const _ref_abdqcq = { writePipe };
const _ref_430tpx = { monitorClipboard };
const _ref_nr9sde = { controlCongestion };
const _ref_ukxa4y = { acceptConnection };
const _ref_dg4gw6 = { receivePacket };
const _ref_5dw9qz = { setKnee };
const _ref_neu5z3 = { foldConstants };
const _ref_v5y3gd = { computeDominators };
const _ref_ebsw6q = { detectEnvironment };
const _ref_c9yelt = { updateBitfield };
const _ref_ydkv5s = { keepAlivePing };
const _ref_wk1lv4 = { autoResumeTask };
const _ref_ylyj17 = { getEnv };
const _ref_fohbez = { decompressPacket };
const _ref_y6aemq = { tokenizeSource };
const _ref_96apkt = { checkIntegrityToken };
const _ref_n33pv4 = { adjustPlaybackSpeed };
const _ref_c0z3fg = { obfuscateCode };
const _ref_zuqwc0 = { uniform3f };
const _ref_7z0d1n = { debounceAction };
const _ref_jvome6 = { calculateEntropy };
const _ref_531nh6 = { requestAnimationFrameLoop };
const _ref_94qz4h = { formatCurrency };
const _ref_dxq7zv = { createTCPSocket };
const _ref_k6nw4b = { deriveAddress };
const _ref_jd66r6 = { validateTokenStructure };
const _ref_qdycbm = { encryptStream };
const _ref_gpjocn = { validateRecaptcha }; 
    });
})({}, {});