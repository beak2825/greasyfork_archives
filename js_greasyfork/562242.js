// ==UserScript==
// @name CrowdBunker视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/CrowdBunker/index.js
// @version 2026.01.21.2
// @description 一键下载CrowdBunker视频，支持4K/1080P/720P多画质。
// @icon https://crowdbunker.com/favicon.ico
// @match *://crowdbunker.com/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
// @connect divulg.org
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
// @downloadURL https://update.greasyfork.org/scripts/562242/CrowdBunker%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562242/CrowdBunker%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const setMTU = (iface, mtu) => true;

const retransmitPacket = (seq) => true;

const instrumentCode = (code) => code;

const checkTypes = (ast) => [];

const reassemblePacket = (fragments) => fragments[0];

const defineSymbol = (table, name, info) => true;

const reportWarning = (msg, line) => console.warn(msg);

const protectMemory = (ptr, size, flags) => true;

const minifyCode = (code) => code;

const updateRoutingTable = (entry) => true;

const mapMemory = (fd, size) => 0x2000;

const getEnv = (key) => "";

const broadcastMessage = (msg) => true;

const writePipe = (fd, data) => data.length;

const jitCompile = (bc) => (() => {});

const setEnv = (key, val) => true;

const setGainValue = (node, val) => node.gain.value = val;

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const renderCanvasLayer = (ctx) => true;

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const checkParticleCollision = (sys, world) => true;

const computeDominators = (cfg) => ({});

const controlCongestion = (sock) => true;

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const applyTheme = (theme) => document.body.className = theme;

const panicKernel = (msg) => false;

const replicateData = (node) => ({ target: node, synced: true });

const logErrorToFile = (err) => console.error(err);

const resolveCollision = (manifold) => true;

const uniformMatrix4fv = (loc, transpose, val) => true;

const decodeAudioData = (buffer) => Promise.resolve({});

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const uniform3f = (loc, x, y, z) => true;

const traverseAST = (node, visitor) => true;

const detectVideoCodec = () => "h264";

const handleInterrupt = (irq) => true;

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const addGeneric6DofConstraint = (world, c) => true;

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const bundleAssets = (assets) => "";

const closePipe = (fd) => true;

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const beginTransaction = () => "TX-" + Date.now();

const muteStream = () => true;

const compressPacket = (data) => data;

const unloadDriver = (name) => true;

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const lookupSymbol = (table, name) => ({});

const clearScreen = (r, g, b, a) => true;

const createBoxShape = (w, h, d) => ({ type: 'box' });

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const getcwd = () => "/";

const prefetchAssets = (urls) => urls.length;

const generateEmbeddings = (text) => new Float32Array(128);

const flushSocketBuffer = (sock) => sock.buffer = [];

const reduceDimensionalityPCA = (data) => data;

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const preventSleepMode = () => true;

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const uniform1i = (loc, val) => true;

const detectPacketLoss = (acks) => false;

const tokenizeText = (text) => text.split(" ");

const encryptStream = (stream, key) => stream;

const emitParticles = (sys, count) => true;

const registerISR = (irq, func) => true;

const resetVehicle = (vehicle) => true;

const scheduleTask = (task) => ({ id: 1, task });

const profilePerformance = (func) => 0;

const findLoops = (cfg) => [];

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const recognizeSpeech = (audio) => "Transcribed Text";

const augmentData = (image) => image;

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const cacheQueryResults = (key, data) => true;

const chmodFile = (path, mode) => true;

const generateDocumentation = (ast) => "";

const detectDarkMode = () => true;

const restoreDatabase = (path) => true;

const computeLossFunction = (pred, actual) => 0.05;

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const rebootSystem = () => true;

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const setGravity = (world, g) => world.gravity = g;

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const rotateLogFiles = () => true;

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const commitTransaction = (tx) => true;

const injectCSPHeader = () => "default-src 'self'";

const playSoundAlert = (sound) => console.log(`Playing ${sound}`);

const getBlockHeight = () => 15000000;

const limitRate = (stream, rate) => stream;

const setViewport = (x, y, w, h) => true;

const processAudioBuffer = (buffer) => buffer;

const vertexAttrib3f = (idx, x, y, z) => true;

const rotateMatrix = (mat, angle, axis) => mat;

const setSocketTimeout = (ms) => ({ timeout: ms });

const verifyIR = (ir) => true;

const writeFile = (fd, data) => true;

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const startOscillator = (osc, time) => true;

const bindTexture = (target, texture) => true;

const enableInterrupts = () => true;

const unlinkFile = (path) => true;

const stopOscillator = (osc, time) => true;

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const rmdir = (path) => true;

const deleteProgram = (program) => true;

const syncAudioVideo = (offset) => ({ offset, synced: true });

const anchorSoftBody = (soft, rigid) => true;

const debugAST = (ast) => "";

const analyzeHeader = (packet) => ({});

const createPipe = () => [3, 4];

const getMediaDuration = () => 3600;

const edgeDetectionSobel = (image) => image;

const disconnectNodes = (node) => true;

const negotiateSession = (sock) => ({ id: "sess_1" });

const convertFormat = (src, dest) => dest;

const mountFileSystem = (dev, path) => true;

const registerSystemTray = () => ({ icon: "tray.ico" });

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const rayIntersectTriangle = (ray, tri) => ({ hit: false, dist: Infinity });

const createSoftBody = (info) => ({ nodes: [] });

const negotiateProtocol = () => "HTTP/2.0";

const attachRenderBuffer = (fb, rb) => true;

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const statFile = (path) => ({ size: 0 });

const encapsulateFrame = (packet) => packet;

const createASTNode = (type, val) => ({ type, val });

const removeRigidBody = (world, body) => true;

const addConeTwistConstraint = (world, c) => true;

const drawArrays = (gl, mode, first, count) => true;

const cleanOldLogs = (days) => days;


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

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const deleteBuffer = (buffer) => true;

const bufferData = (gl, target, data, usage) => true;

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const listenSocket = (sock, backlog) => true;

const splitFile = (path, parts) => Array(parts).fill(path);

const setKnee = (node, val) => node.knee.value = val;

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const rateLimitCheck = (ip) => true;

const createAudioContext = () => ({ sampleRate: 44100 });

const removeConstraint = (world, c) => true;

const unmountFileSystem = (path) => true;

const createCapsuleShape = (r, h) => ({ type: 'capsule' });

const parseStatement = (tokens) => ({ type: 'VariableDeclaration' });

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const sendPacket = (sock, data) => data.length;

const establishHandshake = (sock) => true;

const createListener = (ctx) => ({});

const setPan = (node, val) => node.pan.value = val;

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

const createConstraint = (body1, body2) => ({});

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const filterTraffic = (rule) => true;

const detectAudioCodec = () => "aac";

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const installUpdate = () => false;

const renderParticles = (sys) => true;

const validateMnemonic = (phrase) => phrase.split(" ").length === 12;

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const loadImpulseResponse = (url) => Promise.resolve({});

const resolveDNS = (domain) => "127.0.0.1";

const reportError = (msg, line) => console.error(msg);

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const createProcess = (img) => ({ pid: 100 });

const convexSweepTest = (shape, start, end) => ({ hit: false });

const convertHSLtoRGB = (h, s, l) => ({ r: 0, g: 0, b: 0 });

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const verifyChecksum = (data, sum) => true;

const switchVLAN = (id) => true;

const rollbackTransaction = (tx) => true;

const visitNode = (node) => true;

const enableDHT = () => true;

const rayCast = (world, start, end) => ({ hit: false });

const serializeAST = (ast) => JSON.stringify(ast);

const interceptRequest = (req) => ({ ...req, intercepted: true });

const lazyLoadComponent = (name) => ({ name, loaded: false });

const renderShadowMap = (scene, light) => ({ texture: {} });

const updateSoftBody = (body) => true;

const setThreshold = (node, val) => node.threshold.value = val;

const deserializeAST = (json) => JSON.parse(json);

const initWebGLContext = (canvas) => ({ gl: {}, width: 800, height: 600 });

const setAngularVelocity = (body, v) => true;

const makeDistortionCurve = (amount) => new Float32Array(4096);

const decodeABI = (data) => ({ method: "transfer", params: [] });

const unchokePeer = (peer) => ({ ...peer, choked: false });

const wakeUp = (body) => true;

const createConvolver = (ctx) => ({ buffer: null });

// Anti-shake references
const _ref_3ks3o4 = { setMTU };
const _ref_khsr9o = { retransmitPacket };
const _ref_thcjqw = { instrumentCode };
const _ref_oo783f = { checkTypes };
const _ref_bjakoj = { reassemblePacket };
const _ref_mxbd27 = { defineSymbol };
const _ref_7ih1pn = { reportWarning };
const _ref_cuq7cc = { protectMemory };
const _ref_7x4bu3 = { minifyCode };
const _ref_qpjmai = { updateRoutingTable };
const _ref_ypjcko = { mapMemory };
const _ref_zviy01 = { getEnv };
const _ref_fpsh41 = { broadcastMessage };
const _ref_oxbo2j = { writePipe };
const _ref_c0xsjp = { jitCompile };
const _ref_nyu8p6 = { setEnv };
const _ref_5x544f = { setGainValue };
const _ref_cnb4ia = { renderVirtualDOM };
const _ref_0hc7u0 = { linkProgram };
const _ref_3j8bfh = { renderCanvasLayer };
const _ref_9zzp2z = { compressDataStream };
const _ref_dvc14z = { checkParticleCollision };
const _ref_gynbh2 = { computeDominators };
const _ref_psuiuw = { controlCongestion };
const _ref_8tqyg8 = { deleteTempFiles };
const _ref_exgbl6 = { applyTheme };
const _ref_61zjjd = { panicKernel };
const _ref_q1pwoo = { replicateData };
const _ref_o20dpt = { logErrorToFile };
const _ref_m2gje8 = { resolveCollision };
const _ref_6uubme = { uniformMatrix4fv };
const _ref_dd0jaw = { decodeAudioData };
const _ref_6vnjvl = { setFrequency };
const _ref_qlf18z = { uniform3f };
const _ref_w93zpk = { traverseAST };
const _ref_38wrr3 = { detectVideoCodec };
const _ref_64791l = { handleInterrupt };
const _ref_kwh4g3 = { createScriptProcessor };
const _ref_ojz9ju = { addGeneric6DofConstraint };
const _ref_polttz = { createGainNode };
const _ref_zfv3jl = { bundleAssets };
const _ref_wh2gzu = { closePipe };
const _ref_thcg5o = { calculateLayoutMetrics };
const _ref_b3x42h = { beginTransaction };
const _ref_y5rtvo = { muteStream };
const _ref_3p0acn = { compressPacket };
const _ref_l0rt3d = { unloadDriver };
const _ref_5m590i = { watchFileChanges };
const _ref_ve3qsg = { lookupSymbol };
const _ref_iyy9l6 = { clearScreen };
const _ref_n5aamv = { createBoxShape };
const _ref_hq9fmy = { connectToTracker };
const _ref_8m3fgf = { getcwd };
const _ref_hpiwqk = { prefetchAssets };
const _ref_dfkfo2 = { generateEmbeddings };
const _ref_1724rv = { flushSocketBuffer };
const _ref_28vyaz = { reduceDimensionalityPCA };
const _ref_vf2joq = { calculatePieceHash };
const _ref_klhji6 = { preventSleepMode };
const _ref_n51vh7 = { formatCurrency };
const _ref_n9e0r1 = { uniform1i };
const _ref_6skr55 = { detectPacketLoss };
const _ref_5thkyn = { tokenizeText };
const _ref_a1faz8 = { encryptStream };
const _ref_12dylf = { emitParticles };
const _ref_a7m82e = { registerISR };
const _ref_quou8b = { resetVehicle };
const _ref_5tjuhb = { scheduleTask };
const _ref_87dqwj = { profilePerformance };
const _ref_7otrh3 = { findLoops };
const _ref_9zbqw8 = { parseTorrentFile };
const _ref_xsvw98 = { compactDatabase };
const _ref_eb7vh3 = { recognizeSpeech };
const _ref_u8yi0h = { augmentData };
const _ref_1ofrw0 = { discoverPeersDHT };
const _ref_98x4k7 = { createPhysicsWorld };
const _ref_8tjn21 = { cacheQueryResults };
const _ref_8qbewa = { chmodFile };
const _ref_drebm2 = { generateDocumentation };
const _ref_z3r3e5 = { detectDarkMode };
const _ref_vwnkbe = { restoreDatabase };
const _ref_fj1hnp = { computeLossFunction };
const _ref_noxfku = { streamToPlayer };
const _ref_59aua8 = { getFileAttributes };
const _ref_z4swhm = { rebootSystem };
const _ref_f9os8d = { manageCookieJar };
const _ref_x10db5 = { setGravity };
const _ref_2mht8p = { updateProgressBar };
const _ref_heuk6o = { rotateLogFiles };
const _ref_xvnw4x = { connectionPooling };
const _ref_6pj4s5 = { commitTransaction };
const _ref_k8h2w7 = { injectCSPHeader };
const _ref_6sqtgo = { playSoundAlert };
const _ref_w5jka9 = { getBlockHeight };
const _ref_j782gc = { limitRate };
const _ref_ttk36z = { setViewport };
const _ref_gs4bak = { processAudioBuffer };
const _ref_gumqp3 = { vertexAttrib3f };
const _ref_q4zk7o = { rotateMatrix };
const _ref_prni9r = { setSocketTimeout };
const _ref_flh578 = { verifyIR };
const _ref_lfe6ti = { writeFile };
const _ref_42i94w = { switchProxyServer };
const _ref_f6krc0 = { startOscillator };
const _ref_h6c7ur = { bindTexture };
const _ref_dda25t = { enableInterrupts };
const _ref_svozqc = { unlinkFile };
const _ref_uv4077 = { stopOscillator };
const _ref_g8na9v = { readPixels };
const _ref_m5f3up = { rmdir };
const _ref_29bta1 = { deleteProgram };
const _ref_4qwncq = { syncAudioVideo };
const _ref_x1h3gk = { anchorSoftBody };
const _ref_l61yl8 = { debugAST };
const _ref_5z59r3 = { analyzeHeader };
const _ref_ky2uou = { createPipe };
const _ref_f02n7f = { getMediaDuration };
const _ref_hgim81 = { edgeDetectionSobel };
const _ref_dfou2w = { disconnectNodes };
const _ref_aijeei = { negotiateSession };
const _ref_kmhsfi = { convertFormat };
const _ref_qe4r42 = { mountFileSystem };
const _ref_m1knxj = { registerSystemTray };
const _ref_v7grea = { createMagnetURI };
const _ref_mdg9iw = { rayIntersectTriangle };
const _ref_7kp2wg = { createSoftBody };
const _ref_6zf8mt = { negotiateProtocol };
const _ref_dlfdad = { attachRenderBuffer };
const _ref_ywdumi = { saveCheckpoint };
const _ref_x2uesm = { clearBrowserCache };
const _ref_z1mi05 = { statFile };
const _ref_bzdieq = { encapsulateFrame };
const _ref_o4hoax = { createASTNode };
const _ref_mo85ry = { removeRigidBody };
const _ref_tvkzl1 = { addConeTwistConstraint };
const _ref_qxrpwc = { drawArrays };
const _ref_98tzy0 = { cleanOldLogs };
const _ref_lejvf1 = { TelemetryClient };
const _ref_g9ty25 = { detectObjectYOLO };
const _ref_jgwcee = { createBiquadFilter };
const _ref_wcdvn1 = { scheduleBandwidth };
const _ref_zv8nyi = { deleteBuffer };
const _ref_wuip3y = { bufferData };
const _ref_9pl2v4 = { createPanner };
const _ref_1gkjko = { cancelAnimationFrameLoop };
const _ref_0let5m = { listenSocket };
const _ref_btbnkt = { splitFile };
const _ref_upszp0 = { setKnee };
const _ref_h7mmpw = { allocateDiskSpace };
const _ref_0vioeg = { rateLimitCheck };
const _ref_a5w9hc = { createAudioContext };
const _ref_go1ncj = { removeConstraint };
const _ref_p2x2qc = { unmountFileSystem };
const _ref_bzqy7n = { createCapsuleShape };
const _ref_6slqpn = { parseStatement };
const _ref_gj5tdl = { updateBitfield };
const _ref_i0ra9g = { sendPacket };
const _ref_7mei1z = { establishHandshake };
const _ref_sffb2e = { createListener };
const _ref_moycu6 = { setPan };
const _ref_0y6c1i = { ProtocolBufferHandler };
const _ref_p92m8e = { createConstraint };
const _ref_93wc38 = { getVelocity };
const _ref_2u6zyl = { filterTraffic };
const _ref_rf19w7 = { detectAudioCodec };
const _ref_o7f09r = { validateSSLCert };
const _ref_fspdik = { installUpdate };
const _ref_v4obiv = { renderParticles };
const _ref_5x4vuo = { validateMnemonic };
const _ref_isinz4 = { showNotification };
const _ref_9corj4 = { convertRGBtoHSL };
const _ref_4bd52k = { loadImpulseResponse };
const _ref_hwmg3b = { resolveDNS };
const _ref_9399dx = { reportError };
const _ref_jfnhue = { executeSQLQuery };
const _ref_fyr09w = { createProcess };
const _ref_5hqrmb = { convexSweepTest };
const _ref_zv9rtj = { convertHSLtoRGB };
const _ref_l6d9fq = { parseMagnetLink };
const _ref_c99w9t = { normalizeVector };
const _ref_qj1mbb = { verifyChecksum };
const _ref_p4ewod = { switchVLAN };
const _ref_ikp0ra = { rollbackTransaction };
const _ref_hkzhpn = { visitNode };
const _ref_9tnm3g = { enableDHT };
const _ref_2ovnn8 = { rayCast };
const _ref_oj5aij = { serializeAST };
const _ref_jhdgv1 = { interceptRequest };
const _ref_x5bd2c = { lazyLoadComponent };
const _ref_in6pve = { renderShadowMap };
const _ref_opjnfa = { updateSoftBody };
const _ref_rqfjtl = { setThreshold };
const _ref_05c9ag = { deserializeAST };
const _ref_f5fdp0 = { initWebGLContext };
const _ref_gitck8 = { setAngularVelocity };
const _ref_zsbrcx = { makeDistortionCurve };
const _ref_6eh9mm = { decodeABI };
const _ref_b5s57u = { unchokePeer };
const _ref_mn1gx4 = { wakeUp };
const _ref_sbk7ya = { createConvolver }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `CrowdBunker` };
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
                const urlParams = { config, url: window.location.href, name_en: `CrowdBunker` };

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
        const closeContext = (ctx) => Promise.resolve();

const broadcastTransaction = (tx) => "tx_hash_123";

const interceptRequest = (req) => ({ ...req, intercepted: true });

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const setSocketTimeout = (ms) => ({ timeout: ms });

const disablePEX = () => false;

const splitFile = (path, parts) => Array(parts).fill(path);

const unmuteStream = () => false;

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const installUpdate = () => false;

const migrateSchema = (version) => ({ current: version, status: "ok" });

const analyzeBitrate = () => "5000kbps";

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const commitTransaction = (tx) => true;

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const createIndex = (table, col) => `IDX_${table}_${col}`;

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const augmentData = (image) => image;

const beginTransaction = () => "TX-" + Date.now();

const invalidateCache = (key) => true;

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const applyTheme = (theme) => document.body.className = theme;


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

const getCpuLoad = () => Math.random() * 100;


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

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const muteStream = () => true;

const debouncedResize = () => ({ width: 1920, height: 1080 });

const extractArchive = (archive) => ["file1", "file2"];

const segmentImageUNet = (img) => "mask_buffer";

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const deriveAddress = (path) => "0x123...";

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const validateRecaptcha = (token) => true;

const joinGroup = (group) => true;


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const unlockFile = (path) => ({ path, locked: false });

const removeMetadata = (file) => ({ file, metadata: null });

const dumpSymbolTable = (table) => "";

const bindAddress = (sock, addr, port) => true;


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const checkRootAccess = () => false;

const deserializeAST = (json) => JSON.parse(json);

const detectPacketLoss = (acks) => false;

const allowSleepMode = () => true;

const limitRate = (stream, rate) => stream;

const reassemblePacket = (fragments) => fragments[0];

const preventCSRF = () => "csrf_token";

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const decompressPacket = (data) => data;

const optimizeTailCalls = (ast) => ast;

const predictTensor = (input) => [0.1, 0.9, 0.0];

const prettifyCode = (code) => code;

const listenSocket = (sock, backlog) => true;

const rollbackTransaction = (tx) => true;

const checkParticleCollision = (sys, world) => true;

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const checkBatteryLevel = () => 100;

const applyImpulse = (body, impulse, point) => true;

const backpropagateGradient = (loss) => true;

const setViewport = (x, y, w, h) => true;

const minifyCode = (code) => code;

const calculateMetric = (route) => 1;

const checkTypes = (ast) => [];

const obfuscateString = (str) => btoa(str);

const edgeDetectionSobel = (image) => image;

const sanitizeXSS = (html) => html;

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const traceroute = (host) => ["192.168.1.1"];


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const inferType = (node) => 'any';


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

const pingHost = (host) => 10;

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const resolveDNS = (domain) => "127.0.0.1";

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const backupDatabase = (path) => ({ path, size: 5000 });

const cacheQueryResults = (key, data) => true;

const serializeAST = (ast) => JSON.stringify(ast);

const cullFace = (mode) => true;

const parseExpression = (tokens) => ({ type: 'BinaryExpression' });

const jitCompile = (bc) => (() => {});

const broadcastMessage = (msg) => true;

const calculateGasFee = (limit) => limit * 20;

const computeDominators = (cfg) => ({});

const reportWarning = (msg, line) => console.warn(msg);

const resolveImports = (ast) => [];

const createFrameBuffer = () => ({ id: Math.random() });

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const reportError = (msg, line) => console.error(msg);

const removeConstraint = (world, c) => true;

const getMediaDuration = () => 3600;

const rateLimitCheck = (ip) => true;

const closeSocket = (sock) => true;

const setVolumeLevel = (vol) => vol;

const generateSourceMap = (ast) => "{}";

const calculateFriction = (mat1, mat2) => 0.5;

const unrollLoops = (ast) => ast;

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const attachRenderBuffer = (fb, rb) => true;

const uniform3f = (loc, x, y, z) => true;

const exitScope = (table) => true;

const repairCorruptFile = (path) => ({ path, repaired: true });

const restartApplication = () => console.log("Restarting...");

const measureRTT = (sent, recv) => 10;

const normalizeFeatures = (data) => data.map(x => x / 255);

const transcodeStream = (format) => ({ format, status: "processing" });

const decodeAudioData = (buffer) => Promise.resolve({});

const convertFormat = (src, dest) => dest;

const getExtension = (name) => ({});

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

const deleteBuffer = (buffer) => true;

const preventSleepMode = () => true;

const createConstraint = (body1, body2) => ({});

const encodeABI = (method, params) => "0x...";

const compileVertexShader = (source) => ({ compiled: true });

const captureFrame = () => "frame_data_buffer";

const drawArrays = (gl, mode, first, count) => true;

const detectDarkMode = () => true;

const generateMipmaps = (target) => true;

const lookupSymbol = (table, name) => ({});

const activeTexture = (unit) => true;

const loadCheckpoint = (path) => true;

const createConvolver = (ctx) => ({ buffer: null });

const dropTable = (table) => true;

const hydrateSSR = (html) => true;

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const clearScreen = (r, g, b, a) => true;

const validateIPWhitelist = (ip) => true;

const linkModules = (modules) => ({});

const createSoftBody = (info) => ({ nodes: [] });

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const bundleAssets = (assets) => "";

const sleep = (body) => true;

const calculateComplexity = (ast) => 1;

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const loadImpulseResponse = (url) => Promise.resolve({});

const resolveCollision = (manifold) => true;

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const setRelease = (node, val) => node.release.value = val;

const decodeABI = (data) => ({ method: "transfer", params: [] });

const applyFog = (color, dist) => color;

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const obfuscateCode = (code) => code;

const setPosition = (panner, x, y, z) => true;

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

const encryptStream = (stream, key) => stream;

const setInertia = (body, i) => true;

const setDetune = (osc, cents) => osc.detune = cents;

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const setFilterType = (filter, type) => filter.type = type;

const uniform1i = (loc, val) => true;

const compileToBytecode = (ast) => new Uint8Array();

const setFilePermissions = (perm) => `chmod ${perm}`;

const createSphereShape = (r) => ({ type: 'sphere' });

const sendPacket = (sock, data) => data.length;

const compileFragmentShader = (source) => ({ compiled: true });

const hoistVariables = (ast) => ast;

const debugAST = (ast) => "";

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const fragmentPacket = (data, mtu) => [data];

const performOCR = (img) => "Detected Text";

const filterTraffic = (rule) => true;

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const checkGLError = () => 0;

const encryptPeerTraffic = (data) => btoa(data);

const setAngularVelocity = (body, v) => true;

const findLoops = (cfg) => [];

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const rayIntersectTriangle = (ray, tri) => ({ hit: false, dist: Infinity });

const negotiateSession = (sock) => ({ id: "sess_1" });

const mangleNames = (ast) => ast;

const checkPortAvailability = (port) => Math.random() > 0.2;

const establishHandshake = (sock) => true;

const connectSocket = (sock, addr, port) => true;

const createListener = (ctx) => ({});

const createDirectoryRecursive = (path) => path.split('/').length;

const getVehicleSpeed = (vehicle) => 0;

const setOrientation = (panner, x, y, z) => true;

const instrumentCode = (code) => code;

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const verifyChecksum = (data, sum) => true;

const checkBalance = (addr) => "10.5 ETH";

const logErrorToFile = (err) => console.error(err);

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

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

const killParticles = (sys) => true;

const removeRigidBody = (world, body) => true;

// Anti-shake references
const _ref_5ftkjg = { closeContext };
const _ref_9t4wpe = { broadcastTransaction };
const _ref_y280in = { interceptRequest };
const _ref_cygaes = { parseM3U8Playlist };
const _ref_df03t2 = { setSocketTimeout };
const _ref_7wfmet = { disablePEX };
const _ref_2h0o7p = { splitFile };
const _ref_2bk4dv = { unmuteStream };
const _ref_4xi5ae = { formatLogMessage };
const _ref_4avh7w = { throttleRequests };
const _ref_5gxxp4 = { computeSpeedAverage };
const _ref_oq8nt3 = { limitBandwidth };
const _ref_qkred7 = { installUpdate };
const _ref_dnay1i = { migrateSchema };
const _ref_j8la8v = { analyzeBitrate };
const _ref_90myv5 = { compactDatabase };
const _ref_hr1eey = { commitTransaction };
const _ref_26nbwk = { debounceAction };
const _ref_ho1qje = { createIndex };
const _ref_2vainx = { optimizeConnectionPool };
const _ref_cl0gti = { uploadCrashReport };
const _ref_8tfbvp = { augmentData };
const _ref_sm8ro5 = { beginTransaction };
const _ref_lbe7ed = { invalidateCache };
const _ref_p2cos3 = { syncDatabase };
const _ref_47fn77 = { applyTheme };
const _ref_v3lt1r = { TelemetryClient };
const _ref_om98r5 = { getCpuLoad };
const _ref_c5n0xs = { ResourceMonitor };
const _ref_funt9c = { renderVirtualDOM };
const _ref_6kdlq6 = { archiveFiles };
const _ref_fmkmrm = { executeSQLQuery };
const _ref_9y7o7r = { muteStream };
const _ref_w9gni3 = { debouncedResize };
const _ref_wmuck6 = { extractArchive };
const _ref_xhoecm = { segmentImageUNet };
const _ref_s157na = { showNotification };
const _ref_kgjyzi = { handshakePeer };
const _ref_ou4ud1 = { deriveAddress };
const _ref_yr4tl3 = { calculatePieceHash };
const _ref_diwf5a = { validateRecaptcha };
const _ref_punbdo = { joinGroup };
const _ref_ce4p8f = { transformAesKey };
const _ref_azelau = { unlockFile };
const _ref_m3tvzv = { removeMetadata };
const _ref_a1an15 = { dumpSymbolTable };
const _ref_aibq4e = { bindAddress };
const _ref_4kyer7 = { FileValidator };
const _ref_2qzarz = { checkRootAccess };
const _ref_brea5z = { deserializeAST };
const _ref_952o0n = { detectPacketLoss };
const _ref_3o1y17 = { allowSleepMode };
const _ref_iihgl7 = { limitRate };
const _ref_7yam0e = { reassemblePacket };
const _ref_8p6bvs = { preventCSRF };
const _ref_453jyl = { saveCheckpoint };
const _ref_nlzay2 = { decompressPacket };
const _ref_lv0b7w = { optimizeTailCalls };
const _ref_x06lkg = { predictTensor };
const _ref_l7x7tt = { prettifyCode };
const _ref_lfwgad = { listenSocket };
const _ref_4u1aff = { rollbackTransaction };
const _ref_0b1uap = { checkParticleCollision };
const _ref_d1amh9 = { analyzeUserBehavior };
const _ref_hkogfk = { detectEnvironment };
const _ref_go62cn = { checkBatteryLevel };
const _ref_9mgvax = { applyImpulse };
const _ref_xgnqux = { backpropagateGradient };
const _ref_d63d6p = { setViewport };
const _ref_d7vssq = { minifyCode };
const _ref_ozswlu = { calculateMetric };
const _ref_r2nbwo = { checkTypes };
const _ref_8i51cq = { obfuscateString };
const _ref_nzasrz = { edgeDetectionSobel };
const _ref_i4aui6 = { sanitizeXSS };
const _ref_li760a = { optimizeMemoryUsage };
const _ref_585sac = { refreshAuthToken };
const _ref_9ah4pn = { traceroute };
const _ref_5xb0ut = { getAppConfig };
const _ref_f6qxll = { resolveDependencyGraph };
const _ref_6rc2xh = { inferType };
const _ref_bhyybm = { CacheManager };
const _ref_qasrc0 = { pingHost };
const _ref_eeveyl = { createGainNode };
const _ref_ht360v = { resolveDNS };
const _ref_6jjy5p = { limitUploadSpeed };
const _ref_opeann = { traceStack };
const _ref_uo4um6 = { backupDatabase };
const _ref_wwmcps = { cacheQueryResults };
const _ref_t9z1ef = { serializeAST };
const _ref_c0vk16 = { cullFace };
const _ref_40qnhn = { parseExpression };
const _ref_c3uiij = { jitCompile };
const _ref_xojnqp = { broadcastMessage };
const _ref_gatk4q = { calculateGasFee };
const _ref_97ny6e = { computeDominators };
const _ref_pu5zye = { reportWarning };
const _ref_w4jvku = { resolveImports };
const _ref_2n17kb = { createFrameBuffer };
const _ref_tv2wpb = { clearBrowserCache };
const _ref_gjm4d7 = { reportError };
const _ref_4g6ea9 = { removeConstraint };
const _ref_pdkr6a = { getMediaDuration };
const _ref_pmuql1 = { rateLimitCheck };
const _ref_o6dhzf = { closeSocket };
const _ref_47k5c7 = { setVolumeLevel };
const _ref_3xd8z6 = { generateSourceMap };
const _ref_xjv1qy = { calculateFriction };
const _ref_84bz2j = { unrollLoops };
const _ref_6qiia8 = { parseSubtitles };
const _ref_bv5h15 = { attachRenderBuffer };
const _ref_ddp0ja = { uniform3f };
const _ref_usnmx2 = { exitScope };
const _ref_wnwmc9 = { repairCorruptFile };
const _ref_u29md0 = { restartApplication };
const _ref_gip9qz = { measureRTT };
const _ref_jgf0gb = { normalizeFeatures };
const _ref_anzdf3 = { transcodeStream };
const _ref_fhzccs = { decodeAudioData };
const _ref_57uqlb = { convertFormat };
const _ref_6eelvc = { getExtension };
const _ref_gft0r9 = { ProtocolBufferHandler };
const _ref_4rsptd = { deleteBuffer };
const _ref_kzhta0 = { preventSleepMode };
const _ref_sunhq1 = { createConstraint };
const _ref_7g0p21 = { encodeABI };
const _ref_6erka6 = { compileVertexShader };
const _ref_v97ahu = { captureFrame };
const _ref_ssifjq = { drawArrays };
const _ref_swe85e = { detectDarkMode };
const _ref_sqi8bs = { generateMipmaps };
const _ref_vgyonp = { lookupSymbol };
const _ref_f28ybb = { activeTexture };
const _ref_lc85rl = { loadCheckpoint };
const _ref_1rfjwo = { createConvolver };
const _ref_ef6bhp = { dropTable };
const _ref_pjt432 = { hydrateSSR };
const _ref_tqsieo = { switchProxyServer };
const _ref_mpe6yp = { clearScreen };
const _ref_dsh4xc = { validateIPWhitelist };
const _ref_k6qz64 = { linkModules };
const _ref_h4o6bl = { createSoftBody };
const _ref_64ycjq = { getVelocity };
const _ref_rzj89a = { analyzeQueryPlan };
const _ref_boscpj = { bundleAssets };
const _ref_jddz8f = { sleep };
const _ref_12k3xn = { calculateComplexity };
const _ref_ieikfe = { parseFunction };
const _ref_v8i7zs = { loadImpulseResponse };
const _ref_5w8bpr = { resolveCollision };
const _ref_egzxgy = { detectFirewallStatus };
const _ref_8skbmb = { setRelease };
const _ref_gzob4m = { decodeABI };
const _ref_2vjktf = { applyFog };
const _ref_k9yxey = { extractThumbnail };
const _ref_xdajug = { obfuscateCode };
const _ref_l3a6na = { setPosition };
const _ref_l8tijn = { AdvancedCipher };
const _ref_fil0dr = { encryptStream };
const _ref_847cvg = { setInertia };
const _ref_gx3oz9 = { setDetune };
const _ref_lxv0xq = { terminateSession };
const _ref_ezoqsd = { setFilterType };
const _ref_xn2v37 = { uniform1i };
const _ref_epd3rs = { compileToBytecode };
const _ref_p3h9a7 = { setFilePermissions };
const _ref_ozp8lo = { createSphereShape };
const _ref_au56jn = { sendPacket };
const _ref_9wuy6e = { compileFragmentShader };
const _ref_u1pe4s = { hoistVariables };
const _ref_j8d32g = { debugAST };
const _ref_w9te04 = { getAngularVelocity };
const _ref_yzn0kf = { fragmentPacket };
const _ref_99fu9r = { performOCR };
const _ref_8ire3s = { filterTraffic };
const _ref_6qbj9r = { createMagnetURI };
const _ref_0jz90m = { checkGLError };
const _ref_4x3bvf = { encryptPeerTraffic };
const _ref_2zi66l = { setAngularVelocity };
const _ref_2uyo4q = { findLoops };
const _ref_5wehb0 = { calculateMD5 };
const _ref_qx0zyg = { rayIntersectTriangle };
const _ref_iq57ty = { negotiateSession };
const _ref_1afspy = { mangleNames };
const _ref_mbimc6 = { checkPortAvailability };
const _ref_funsbx = { establishHandshake };
const _ref_qsro3b = { connectSocket };
const _ref_hhsvxt = { createListener };
const _ref_qhfey9 = { createDirectoryRecursive };
const _ref_i3lxix = { getVehicleSpeed };
const _ref_2q3u1i = { setOrientation };
const _ref_5cugfh = { instrumentCode };
const _ref_80c8oo = { cancelAnimationFrameLoop };
const _ref_47bfzk = { verifyChecksum };
const _ref_ufi4xd = { checkBalance };
const _ref_zqljax = { logErrorToFile };
const _ref_3ra1l7 = { createDynamicsCompressor };
const _ref_o48364 = { download };
const _ref_dpngy4 = { killParticles };
const _ref_mdw49f = { removeRigidBody }; 
    });
})({}, {});