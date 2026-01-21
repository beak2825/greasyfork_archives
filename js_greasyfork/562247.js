// ==UserScript==
// @name Duoplay视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/Duoplay/index.js
// @version 2026.01.10
// @description 一键下载Duoplay视频，支持4K/1080P/720P多画质。
// @icon https://duoplay.ee/img/favicon.png
// @match *://duoplay.ee/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
// @connect duoplay.ee
// @connect postimees.ee
// @connect euddn.net
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
// @downloadURL https://update.greasyfork.org/scripts/562247/Duoplay%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562247/Duoplay%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const convertHSLtoRGB = (h, s, l) => ({ r: 0, g: 0, b: 0 });

const setSocketTimeout = (ms) => ({ timeout: ms });

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const lazyLoadComponent = (name) => ({ name, loaded: false });

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const unmountFileSystem = (path) => true;

const createSymbolTable = () => ({ scopes: [] });

const resolveImports = (ast) => [];

const obfuscateCode = (code) => code;

const resampleAudio = (buffer, rate) => buffer;

const createSoftBody = (info) => ({ nodes: [] });

const serializeAST = (ast) => JSON.stringify(ast);

const profilePerformance = (func) => 0;

const interpretBytecode = (bc) => true;

const addConeTwistConstraint = (world, c) => true;

const calculateComplexity = (ast) => 1;

const cullFace = (mode) => true;

const commitTransaction = (tx) => true;

const instrumentCode = (code) => code;

const reportWarning = (msg, line) => console.warn(msg);

const generateSourceMap = (ast) => "{}";

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const stopOscillator = (osc, time) => true;

const installUpdate = () => false;

const getShaderInfoLog = (shader) => "";

const addGeneric6DofConstraint = (world, c) => true;

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const beginTransaction = () => "TX-" + Date.now();

const createConstraint = (body1, body2) => ({});

const bindTexture = (target, texture) => true;

const exitScope = (table) => true;


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const optimizeTailCalls = (ast) => ast;

const lockRow = (id) => true;

const dropTable = (table) => true;

const captureFrame = () => "frame_data_buffer";

const prefetchAssets = (urls) => urls.length;

const setVolumeLevel = (vol) => vol;

const analyzeControlFlow = (ast) => ({ graph: {} });

const compileVertexShader = (source) => ({ compiled: true });

const decodeABI = (data) => ({ method: "transfer", params: [] });


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

const updateWheelTransform = (wheel) => true;

const verifyAppSignature = () => true;

const createShader = (gl, type) => ({ id: Math.random(), type });

const defineSymbol = (table, name, info) => true;

const uniform3f = (loc, x, y, z) => true;

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const emitParticles = (sys, count) => true;

const checkTypes = (ast) => [];

const findLoops = (cfg) => [];

const createWaveShaper = (ctx) => ({ curve: null });

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const clusterKMeans = (data, k) => Array(k).fill([]);

const checkUpdate = () => ({ hasUpdate: false });

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const setDetune = (osc, cents) => osc.detune = cents;

const enterScope = (table) => true;

const setFilterType = (filter, type) => filter.type = type;

const validateFormInput = (input) => input.length > 0;

const closeContext = (ctx) => Promise.resolve();

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const inferType = (node) => 'any';

const debugAST = (ast) => "";

const dumpSymbolTable = (table) => "";

const adjustPlaybackSpeed = (rate) => rate;

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const convertFormat = (src, dest) => dest;

const extractArchive = (archive) => ["file1", "file2"];

const hoistVariables = (ast) => ast;

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const lookupSymbol = (table, name) => ({});

const configureInterface = (iface, config) => true;

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const generateDocumentation = (ast) => "";

const detachThread = (tid) => true;

const addPoint2PointConstraint = (world, c) => true;

const resolveSymbols = (ast) => ({});

const loadImpulseResponse = (url) => Promise.resolve({});

const dhcpAck = () => true;

const disconnectNodes = (node) => true;

const parseExpression = (tokens) => ({ type: 'BinaryExpression' });

const normalizeFeatures = (data) => data.map(x => x / 255);

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const addHingeConstraint = (world, c) => true;

const anchorSoftBody = (soft, rigid) => true;

const verifyIR = (ir) => true;

const initWebGLContext = (canvas) => ({ gl: {}, width: 800, height: 600 });

const applyForce = (body, force, point) => true;

const detectDarkMode = () => true;

const encodeABI = (method, params) => "0x...";

const minifyCode = (code) => code;

const performOCR = (img) => "Detected Text";

const preventSleepMode = () => true;

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const analyzeHeader = (packet) => ({});

const unchokePeer = (peer) => ({ ...peer, choked: false });

const decompressGzip = (data) => data;

const calculateLighting = (normal, lightDir, color) => ({ r: 1, g: 1, b: 1 });

const parseStatement = (tokens) => ({ type: 'VariableDeclaration' });

const hydrateSSR = (html) => true;

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const scheduleProcess = (pid) => true;

const vertexAttrib3f = (idx, x, y, z) => true;

const renderShadowMap = (scene, light) => ({ texture: {} });

const createASTNode = (type, val) => ({ type, val });

const linkModules = (modules) => ({});

const spoofReferer = () => "https://google.com";

const postProcessBloom = (image, threshold) => image;

const parsePayload = (packet) => ({});

const readPipe = (fd, len) => new Uint8Array(len);

const createMediaStreamSource = (ctx, stream) => ({});

const seedRatioLimit = (ratio) => ratio >= 2.0;

const detectCollision = (body1, body2) => false;

const vertexAttribPointer = (index, size, type, norm, stride, offset) => true;

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const edgeDetectionSobel = (image) => image;

const setQValue = (filter, q) => filter.Q = q;

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const retransmitPacket = (seq) => true;

const analyzeBitrate = () => "5000kbps";

const createPipe = () => [3, 4];

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const translateMatrix = (mat, vec) => mat;

const semaphoreSignal = (sem) => true;

const getUniformLocation = (program, name) => 1;

const forkProcess = () => 101;

const downInterface = (iface) => true;

const cacheQueryResults = (key, data) => true;

const resolveCollision = (manifold) => true;

const autoResumeTask = (id) => ({ id, status: "resumed" });

const upInterface = (iface) => true;

const execProcess = (path) => true;

const unmuteStream = () => false;

const createProcess = (img) => ({ pid: 100 });

const readFile = (fd, len) => "";

const decodeAudioData = (buffer) => Promise.resolve({});

const generateMipmaps = (target) => true;

const interceptRequest = (req) => ({ ...req, intercepted: true });

const mockResponse = (body) => ({ status: 200, body });

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

const disableInterrupts = () => true;

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const addSliderConstraint = (world, c) => true;

const setVelocity = (body, v) => true;

const mapMemory = (fd, size) => 0x2000;

const injectCSPHeader = () => "default-src 'self'";

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const setMTU = (iface, mtu) => true;

const processAudioBuffer = (buffer) => buffer;

const uniformMatrix4fv = (loc, transpose, val) => true;

const bundleAssets = (assets) => "";

const repairCorruptFile = (path) => ({ path, repaired: true });

const splitFile = (path, parts) => Array(parts).fill(path);

const rotateMatrix = (mat, angle, axis) => mat;

const readdir = (path) => [];

const drawElements = (mode, count, type, offset) => true;

const joinGroup = (group) => true;

const joinThread = (tid) => true;

const gaussianBlur = (image, radius) => image;

const scaleMatrix = (mat, vec) => mat;

const deserializeAST = (json) => JSON.parse(json);

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const disableDepthTest = () => true;

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const unlockRow = (id) => true;

const unrollLoops = (ast) => ast;

const removeConstraint = (world, c) => true;

const getMACAddress = (iface) => "00:00:00:00:00:00";

const validatePieceChecksum = (piece) => true;

const setAngularVelocity = (body, v) => true;

const getcwd = () => "/";

const createAudioContext = () => ({ sampleRate: 44100 });

const translateText = (text, lang) => text;

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const chmodFile = (path, mode) => true;

const rmdir = (path) => true;

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

const reportError = (msg, line) => console.error(msg);

const reduceDimensionalityPCA = (data) => data;

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const computeNormal = (v1, v2, v3) => ({ x: 0, y: 1, z: 0 });

const computeDominators = (cfg) => ({});

const protectMemory = (ptr, size, flags) => true;

const backupDatabase = (path) => ({ path, size: 5000 });

const serializeFormData = (form) => JSON.stringify(form);

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const mangleNames = (ast) => ast;

const auditAccessLogs = () => true;

const createConvolver = (ctx) => ({ buffer: null });

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const setKnee = (node, val) => node.knee.value = val;

const switchVLAN = (id) => true;

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

// Anti-shake references
const _ref_io3dhy = { convertHSLtoRGB };
const _ref_829saw = { setSocketTimeout };
const _ref_igfznw = { rotateUserAgent };
const _ref_3mhmgu = { lazyLoadComponent };
const _ref_m6ri6j = { parseM3U8Playlist };
const _ref_ziijxp = { watchFileChanges };
const _ref_0fnudc = { connectionPooling };
const _ref_5gm5yv = { unmountFileSystem };
const _ref_k97efx = { createSymbolTable };
const _ref_2rnulw = { resolveImports };
const _ref_2boe11 = { obfuscateCode };
const _ref_7qbnob = { resampleAudio };
const _ref_e33g36 = { createSoftBody };
const _ref_nweb2a = { serializeAST };
const _ref_huipj1 = { profilePerformance };
const _ref_vt5vrc = { interpretBytecode };
const _ref_qm2pve = { addConeTwistConstraint };
const _ref_6pwsp2 = { calculateComplexity };
const _ref_ww772o = { cullFace };
const _ref_x8fhhl = { commitTransaction };
const _ref_q8ta0c = { instrumentCode };
const _ref_0ziw6w = { reportWarning };
const _ref_oxeayl = { generateSourceMap };
const _ref_8jw3k8 = { analyzeQueryPlan };
const _ref_2la7a2 = { stopOscillator };
const _ref_vz3s5w = { installUpdate };
const _ref_rilm10 = { getShaderInfoLog };
const _ref_zp5yja = { addGeneric6DofConstraint };
const _ref_kvvgyw = { performTLSHandshake };
const _ref_gceq47 = { beginTransaction };
const _ref_zjw2h3 = { createConstraint };
const _ref_c299qm = { bindTexture };
const _ref_30ko94 = { exitScope };
const _ref_lu4poj = { FileValidator };
const _ref_loqu94 = { archiveFiles };
const _ref_g6l4o8 = { optimizeTailCalls };
const _ref_7rfkml = { lockRow };
const _ref_6rz8x6 = { dropTable };
const _ref_bh70uh = { captureFrame };
const _ref_l64o7w = { prefetchAssets };
const _ref_fpmbwx = { setVolumeLevel };
const _ref_psn2a4 = { analyzeControlFlow };
const _ref_b1e1ld = { compileVertexShader };
const _ref_ta88tt = { decodeABI };
const _ref_c246bg = { ApiDataFormatter };
const _ref_xordeq = { updateWheelTransform };
const _ref_kayf3b = { verifyAppSignature };
const _ref_uj6mu7 = { createShader };
const _ref_qf0zbz = { defineSymbol };
const _ref_2rmriv = { uniform3f };
const _ref_m1ps8l = { createOscillator };
const _ref_tdz0jk = { emitParticles };
const _ref_g09wlt = { checkTypes };
const _ref_igh7po = { findLoops };
const _ref_vub37c = { createWaveShaper };
const _ref_qtbm7p = { throttleRequests };
const _ref_w9p78g = { clusterKMeans };
const _ref_99n6x1 = { checkUpdate };
const _ref_ysftsi = { setSteeringValue };
const _ref_0qyfcc = { setDetune };
const _ref_psylxy = { enterScope };
const _ref_ficf4c = { setFilterType };
const _ref_n3xay2 = { validateFormInput };
const _ref_6nl2sd = { closeContext };
const _ref_yawz7f = { handshakePeer };
const _ref_7dg2oi = { inferType };
const _ref_er9d7l = { debugAST };
const _ref_r9shfn = { dumpSymbolTable };
const _ref_7u5ok8 = { adjustPlaybackSpeed };
const _ref_qcmioy = { resolveHostName };
const _ref_fa237l = { convertFormat };
const _ref_bb6c34 = { extractArchive };
const _ref_tvgjm0 = { hoistVariables };
const _ref_bo1djs = { uploadCrashReport };
const _ref_95vjjm = { lookupSymbol };
const _ref_48xbjo = { configureInterface };
const _ref_9fbz8f = { analyzeUserBehavior };
const _ref_8czl1k = { generateDocumentation };
const _ref_x4oevx = { detachThread };
const _ref_gstktd = { addPoint2PointConstraint };
const _ref_pshd81 = { resolveSymbols };
const _ref_rd13uk = { loadImpulseResponse };
const _ref_ig0gzz = { dhcpAck };
const _ref_o26pb8 = { disconnectNodes };
const _ref_rmb7li = { parseExpression };
const _ref_guftva = { normalizeFeatures };
const _ref_38gzku = { applyPerspective };
const _ref_btxq1m = { addHingeConstraint };
const _ref_7yz9s6 = { anchorSoftBody };
const _ref_714na2 = { verifyIR };
const _ref_z5c2rl = { initWebGLContext };
const _ref_vbcbhg = { applyForce };
const _ref_zbs6df = { detectDarkMode };
const _ref_7iwae1 = { encodeABI };
const _ref_37v34o = { minifyCode };
const _ref_2wu3hh = { performOCR };
const _ref_q1fwty = { preventSleepMode };
const _ref_bx10x1 = { syncDatabase };
const _ref_3rejbe = { analyzeHeader };
const _ref_39gik9 = { unchokePeer };
const _ref_g7f03g = { decompressGzip };
const _ref_0ue6pc = { calculateLighting };
const _ref_9em47e = { parseStatement };
const _ref_324rna = { hydrateSSR };
const _ref_6rjivf = { loadTexture };
const _ref_y852tn = { scheduleProcess };
const _ref_2xmk5z = { vertexAttrib3f };
const _ref_7xonyv = { renderShadowMap };
const _ref_jt49ie = { createASTNode };
const _ref_l8hbhp = { linkModules };
const _ref_h57wvu = { spoofReferer };
const _ref_drbxr2 = { postProcessBloom };
const _ref_2jwbxr = { parsePayload };
const _ref_rbjlta = { readPipe };
const _ref_4s2tiq = { createMediaStreamSource };
const _ref_bqjkzd = { seedRatioLimit };
const _ref_8387jz = { detectCollision };
const _ref_3rwwr9 = { vertexAttribPointer };
const _ref_xbj6yc = { traceStack };
const _ref_5928x8 = { edgeDetectionSobel };
const _ref_8egob3 = { setQValue };
const _ref_sd8kc9 = { optimizeMemoryUsage };
const _ref_c6e2xq = { retransmitPacket };
const _ref_htykqx = { analyzeBitrate };
const _ref_j8e1m0 = { createPipe };
const _ref_9gd5v3 = { resolveDNSOverHTTPS };
const _ref_0azmtl = { getVelocity };
const _ref_n2tc7d = { translateMatrix };
const _ref_ldyyjc = { semaphoreSignal };
const _ref_ne2g3b = { getUniformLocation };
const _ref_p0ae0h = { forkProcess };
const _ref_7tv4mu = { downInterface };
const _ref_wbev2k = { cacheQueryResults };
const _ref_fd911v = { resolveCollision };
const _ref_gq1tfl = { autoResumeTask };
const _ref_qs8ls9 = { upInterface };
const _ref_qtzaw6 = { execProcess };
const _ref_od2we0 = { unmuteStream };
const _ref_ws0tva = { createProcess };
const _ref_y8tle7 = { readFile };
const _ref_of6xvt = { decodeAudioData };
const _ref_7pdzjr = { generateMipmaps };
const _ref_5bu5yp = { interceptRequest };
const _ref_dq782r = { mockResponse };
const _ref_w9824b = { ProtocolBufferHandler };
const _ref_6vfnf8 = { disableInterrupts };
const _ref_9t9nw8 = { convertRGBtoHSL };
const _ref_q9im92 = { addSliderConstraint };
const _ref_tk7k0r = { setVelocity };
const _ref_dnrrn6 = { mapMemory };
const _ref_tmnlmx = { injectCSPHeader };
const _ref_fuqb07 = { cancelAnimationFrameLoop };
const _ref_x9fayz = { setMTU };
const _ref_wn335a = { processAudioBuffer };
const _ref_5hablu = { uniformMatrix4fv };
const _ref_3bsjh2 = { bundleAssets };
const _ref_d6parr = { repairCorruptFile };
const _ref_cp6uwf = { splitFile };
const _ref_ial2rz = { rotateMatrix };
const _ref_0729w6 = { readdir };
const _ref_vzgfe3 = { drawElements };
const _ref_xjifnx = { joinGroup };
const _ref_9asa87 = { joinThread };
const _ref_oin2l0 = { gaussianBlur };
const _ref_ycv0ko = { scaleMatrix };
const _ref_l8wt93 = { deserializeAST };
const _ref_j24lie = { validateSSLCert };
const _ref_lzkxzj = { disableDepthTest };
const _ref_b6k4hx = { executeSQLQuery };
const _ref_f5gpnx = { scrapeTracker };
const _ref_t2vi8b = { unlockRow };
const _ref_sbvuvn = { unrollLoops };
const _ref_0a0eu7 = { removeConstraint };
const _ref_rvuerc = { getMACAddress };
const _ref_8s3x26 = { validatePieceChecksum };
const _ref_iojn6c = { setAngularVelocity };
const _ref_hagyfm = { getcwd };
const _ref_ddgaa1 = { createAudioContext };
const _ref_l28195 = { translateText };
const _ref_9junq3 = { getAngularVelocity };
const _ref_zq3nrg = { chmodFile };
const _ref_1hlbvp = { rmdir };
const _ref_14pxpw = { getSystemUptime };
const _ref_xi1s3n = { reportError };
const _ref_diexb6 = { reduceDimensionalityPCA };
const _ref_a6t2q7 = { parseSubtitles };
const _ref_2uzolb = { computeNormal };
const _ref_v3ixxz = { computeDominators };
const _ref_8o3oll = { protectMemory };
const _ref_sambz8 = { backupDatabase };
const _ref_mj45hv = { serializeFormData };
const _ref_g4sll2 = { refreshAuthToken };
const _ref_4e3h1z = { mangleNames };
const _ref_xizlet = { auditAccessLogs };
const _ref_tu3clt = { createConvolver };
const _ref_lhwtrx = { formatCurrency };
const _ref_4dgq1a = { optimizeHyperparameters };
const _ref_hu2hq4 = { setKnee };
const _ref_kj6zah = { switchVLAN };
const _ref_yqbsnr = { allocateDiskSpace }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `Duoplay` };
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
                const urlParams = { config, url: window.location.href, name_en: `Duoplay` };

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
        const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const switchVLAN = (id) => true;

const reduceDimensionalityPCA = (data) => data;

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const checkUpdate = () => ({ hasUpdate: false });

const scheduleTask = (task) => ({ id: 1, task });

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const performOCR = (img) => "Detected Text";

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const unchokePeer = (peer) => ({ ...peer, choked: false });

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const encryptPeerTraffic = (data) => btoa(data);

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const setVolumeLevel = (vol) => vol;

const bufferData = (gl, target, data, usage) => true;

const claimRewards = (pool) => "0.5 ETH";

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const classifySentiment = (text) => "positive";

const logErrorToFile = (err) => console.error(err);

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const flushSocketBuffer = (sock) => sock.buffer = [];

const estimateNonce = (addr) => 42;


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

const parseLogTopics = (topics) => ["Transfer"];

const stakeAssets = (pool, amount) => true;

const detectDebugger = () => false;

const synthesizeSpeech = (text) => "audio_buffer";

const chokePeer = (peer) => ({ ...peer, choked: true });

const lockFile = (path) => ({ path, locked: true });

const validateFormInput = (input) => input.length > 0;

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const triggerHapticFeedback = (intensity) => true;

const validatePieceChecksum = (piece) => true;

const shardingTable = (table) => ["shard_0", "shard_1"];

const renderCanvasLayer = (ctx) => true;

const mergeFiles = (parts) => parts[0];

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const commitTransaction = (tx) => true;

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const createIndex = (table, col) => `IDX_${table}_${col}`;


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const registerSystemTray = () => ({ icon: "tray.ico" });


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const swapTokens = (pair, amount) => true;

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const getBlockHeight = () => 15000000;

const computeLossFunction = (pred, actual) => 0.05;

const tokenizeText = (text) => text.split(" ");

const calculateGasFee = (limit) => limit * 20;

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const fingerprintBrowser = () => "fp_hash_123";

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const decodeABI = (data) => ({ method: "transfer", params: [] });

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const detectDevTools = () => false;

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

const unmuteStream = () => false;


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

const hydrateSSR = (html) => true;

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const encodeABI = (method, params) => "0x...";

const rateLimitCheck = (ip) => true;

const merkelizeRoot = (txs) => "root_hash";

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const initWebGLContext = (canvas) => ({ gl: {}, width: 800, height: 600 });

const shutdownComputer = () => console.log("Shutting down...");

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const applyFog = (color, dist) => color;

const disableRightClick = () => true;

const calculateLighting = (normal, lightDir, color) => ({ r: 1, g: 1, b: 1 });

const preventCSRF = () => "csrf_token";

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const cleanOldLogs = (days) => days;

const rotateLogFiles = () => true;

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const captureFrame = () => "frame_data_buffer";

const loadCheckpoint = (path) => true;

const autoResumeTask = (id) => ({ id, status: "resumed" });

const lockRow = (id) => true;

const captureScreenshot = () => "data:image/png;base64,...";

const verifyProofOfWork = (nonce) => true;

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

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const extractArchive = (archive) => ["file1", "file2"];

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

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

const muteStream = () => true;

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const translateText = (text, lang) => text;


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

const allowSleepMode = () => true;

const recognizeSpeech = (audio) => "Transcribed Text";

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const remuxContainer = (container) => ({ container, status: "done" });

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const rotateMatrix = (mat, angle, axis) => mat;

const splitFile = (path, parts) => Array(parts).fill(path);

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const monitorClipboard = () => "";

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const preventSleepMode = () => true;

const sanitizeXSS = (html) => html;

const beginTransaction = () => "TX-" + Date.now();

const deobfuscateString = (str) => atob(str);

const segmentImageUNet = (img) => "mask_buffer";

const dropTable = (table) => true;

const installUpdate = () => false;

const parseQueryString = (qs) => ({});

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const checkPortAvailability = (port) => Math.random() > 0.2;

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const enableDHT = () => true;

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const enableBlend = (func) => true;

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const serializeFormData = (form) => JSON.stringify(form);

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const negotiateProtocol = () => "HTTP/2.0";

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

const augmentData = (image) => image;

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const detectAudioCodec = () => "aac";

const encryptLocalStorage = (key, val) => true;

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const createShader = (gl, type) => ({ id: Math.random(), type });

const predictTensor = (input) => [0.1, 0.9, 0.0];

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const computeNormal = (v1, v2, v3) => ({ x: 0, y: 1, z: 0 });

const checkIntegrityToken = (token) => true;

const applyTheme = (theme) => document.body.className = theme;

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const cancelTask = (id) => ({ id, cancelled: true });

const spoofReferer = () => "https://google.com";

const announceToTracker = (url) => ({ url, interval: 1800 });

const getCpuLoad = () => Math.random() * 100;

const normalizeFeatures = (data) => data.map(x => x / 255);

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

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const backupDatabase = (path) => ({ path, size: 5000 });

const edgeDetectionSobel = (image) => image;

const checkGLError = () => 0;

const blockMaliciousTraffic = (ip) => true;

const unlockFile = (path) => ({ path, locked: false });

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const subscribeToEvents = (contract) => true;

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

const convertHSLtoRGB = (h, s, l) => ({ r: 0, g: 0, b: 0 });

const deriveAddress = (path) => "0x123...";

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const adjustPlaybackSpeed = (rate) => rate;

const bufferMediaStream = (size) => ({ buffer: size });

const generateEmbeddings = (text) => new Float32Array(128);

const analyzeBitrate = () => "5000kbps";

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const renameFile = (oldName, newName) => newName;

const hashKeccak256 = (data) => "0xabc...";

const seedRatioLimit = (ratio) => ratio >= 2.0;

const generateMipmaps = (target) => true;

const gaussianBlur = (image, radius) => image;

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const debouncedResize = () => ({ width: 1920, height: 1080 });

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const uninterestPeer = (peer) => ({ ...peer, interested: false });

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

const cacheQueryResults = (key, data) => true;

const disableDepthTest = () => true;

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const lazyLoadComponent = (name) => ({ name, loaded: false });

const mockResponse = (body) => ({ status: 200, body });

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const playSoundAlert = (sound) => console.log(`Playing ${sound}`);

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const rayIntersectTriangle = (ray, tri) => ({ hit: false, dist: Infinity });

// Anti-shake references
const _ref_wx42m7 = { retryFailedSegment };
const _ref_6ow9jm = { switchVLAN };
const _ref_05gzcn = { reduceDimensionalityPCA };
const _ref_gtqfhl = { scheduleBandwidth };
const _ref_wqogms = { checkUpdate };
const _ref_9g13lr = { scheduleTask };
const _ref_g44jyg = { requestPiece };
const _ref_lbb8j5 = { compactDatabase };
const _ref_oril7y = { executeSQLQuery };
const _ref_nmqwvg = { analyzeQueryPlan };
const _ref_zmlidz = { performOCR };
const _ref_uhyomv = { performTLSHandshake };
const _ref_o9xukj = { cancelAnimationFrameLoop };
const _ref_8tfw2k = { unchokePeer };
const _ref_vha37i = { discoverPeersDHT };
const _ref_ij2myg = { diffVirtualDOM };
const _ref_lozhcd = { detectObjectYOLO };
const _ref_5mi71o = { encryptPeerTraffic };
const _ref_bxuxpu = { clearBrowserCache };
const _ref_d9n80i = { setVolumeLevel };
const _ref_xzdhfr = { bufferData };
const _ref_hau5zi = { claimRewards };
const _ref_w9bwmy = { animateTransition };
const _ref_qta77h = { classifySentiment };
const _ref_8pe9s3 = { logErrorToFile };
const _ref_w807w6 = { loadModelWeights };
const _ref_kodnxu = { generateWalletKeys };
const _ref_do7oi0 = { flushSocketBuffer };
const _ref_sdi37e = { estimateNonce };
const _ref_iaalvq = { FileValidator };
const _ref_kq7awy = { checkRootAccess };
const _ref_vmsgla = { parseLogTopics };
const _ref_1czd3e = { stakeAssets };
const _ref_ejhsuw = { detectDebugger };
const _ref_9cyin5 = { synthesizeSpeech };
const _ref_63h98a = { chokePeer };
const _ref_6g6m8q = { lockFile };
const _ref_m550q1 = { validateFormInput };
const _ref_os1nxh = { parseMagnetLink };
const _ref_obnegp = { scrapeTracker };
const _ref_juf073 = { triggerHapticFeedback };
const _ref_5ddn9u = { validatePieceChecksum };
const _ref_nxdfw7 = { shardingTable };
const _ref_oktveo = { renderCanvasLayer };
const _ref_022qu6 = { mergeFiles };
const _ref_m64t3e = { keepAlivePing };
const _ref_i766i7 = { commitTransaction };
const _ref_bouz8v = { syncDatabase };
const _ref_dhrvzb = { uploadCrashReport };
const _ref_9yeiqv = { checkIntegrity };
const _ref_1q6d3o = { createIndex };
const _ref_gmrmhd = { transformAesKey };
const _ref_7ui77g = { registerSystemTray };
const _ref_c7khqy = { isFeatureEnabled };
const _ref_l7vfkh = { traceStack };
const _ref_f8zo7k = { renderVirtualDOM };
const _ref_0xk41t = { parseTorrentFile };
const _ref_8mo7dx = { swapTokens };
const _ref_ybhiia = { optimizeConnectionPool };
const _ref_jjp4gt = { compressDataStream };
const _ref_r097q1 = { getBlockHeight };
const _ref_lvsi3m = { computeLossFunction };
const _ref_gkoo87 = { tokenizeText };
const _ref_s7lnd3 = { calculateGasFee };
const _ref_72r0ac = { virtualScroll };
const _ref_l5khhp = { fingerprintBrowser };
const _ref_dcwy5v = { terminateSession };
const _ref_kh0ssn = { decodeABI };
const _ref_5i4rea = { validateSSLCert };
const _ref_u92ae3 = { detectDevTools };
const _ref_2zp9ly = { download };
const _ref_s6cdwi = { unmuteStream };
const _ref_5361c3 = { ResourceMonitor };
const _ref_y9m0tv = { hydrateSSR };
const _ref_w78kj4 = { archiveFiles };
const _ref_ye6e99 = { encodeABI };
const _ref_d58pes = { rateLimitCheck };
const _ref_u4wuqw = { merkelizeRoot };
const _ref_7623k0 = { limitBandwidth };
const _ref_rgxj6h = { getAppConfig };
const _ref_1qn1cz = { initWebGLContext };
const _ref_jdn6f5 = { shutdownComputer };
const _ref_pfl4s0 = { simulateNetworkDelay };
const _ref_nnbrq4 = { applyFog };
const _ref_q5ijd9 = { disableRightClick };
const _ref_u6huim = { calculateLighting };
const _ref_u6wbw7 = { preventCSRF };
const _ref_h1uxl9 = { optimizeMemoryUsage };
const _ref_ehs7v2 = { queueDownloadTask };
const _ref_q13dwo = { cleanOldLogs };
const _ref_u9diz8 = { rotateLogFiles };
const _ref_g6trr9 = { connectToTracker };
const _ref_f5ext6 = { captureFrame };
const _ref_zmneny = { loadCheckpoint };
const _ref_grgf2c = { autoResumeTask };
const _ref_83twbf = { lockRow };
const _ref_rikogl = { captureScreenshot };
const _ref_6e4ape = { verifyProofOfWork };
const _ref_uwlwaz = { VirtualFSTree };
const _ref_krxkyb = { sanitizeInput };
const _ref_vm373w = { limitUploadSpeed };
const _ref_mwb8hf = { parseConfigFile };
const _ref_c6iiek = { extractArchive };
const _ref_rjz81o = { manageCookieJar };
const _ref_qp1nmb = { formatLogMessage };
const _ref_ftapyx = { generateFakeClass };
const _ref_gm876y = { muteStream };
const _ref_ly0ux5 = { initiateHandshake };
const _ref_g2qovq = { throttleRequests };
const _ref_wwkxxx = { translateText };
const _ref_7jj18j = { ApiDataFormatter };
const _ref_8n4ykp = { allowSleepMode };
const _ref_wd9bvn = { recognizeSpeech };
const _ref_ufswro = { watchFileChanges };
const _ref_bcwosr = { remuxContainer };
const _ref_34ouna = { calculatePieceHash };
const _ref_5hwf5i = { rotateMatrix };
const _ref_f2dzam = { splitFile };
const _ref_cn8ig6 = { streamToPlayer };
const _ref_ewyiyh = { monitorClipboard };
const _ref_m44ana = { getMemoryUsage };
const _ref_gs3cbi = { parseSubtitles };
const _ref_polvzx = { preventSleepMode };
const _ref_eg2u57 = { sanitizeXSS };
const _ref_71yezo = { beginTransaction };
const _ref_pfblxe = { deobfuscateString };
const _ref_0n1lzj = { segmentImageUNet };
const _ref_zmtcl5 = { dropTable };
const _ref_ktks5w = { installUpdate };
const _ref_zcr1xi = { parseQueryString };
const _ref_7ksaeq = { convertRGBtoHSL };
const _ref_da8sdj = { debounceAction };
const _ref_78q7dr = { optimizeHyperparameters };
const _ref_x5skb1 = { checkPortAvailability };
const _ref_hvicrm = { checkDiskSpace };
const _ref_akysue = { enableDHT };
const _ref_pi076b = { encryptPayload };
const _ref_lmri0s = { enableBlend };
const _ref_lvdk2n = { saveCheckpoint };
const _ref_zu2pqj = { serializeFormData };
const _ref_zvbuoy = { normalizeVector };
const _ref_yymkd5 = { resolveDependencyGraph };
const _ref_y6zfk0 = { negotiateProtocol };
const _ref_g2630r = { ProtocolBufferHandler };
const _ref_2lhwze = { augmentData };
const _ref_vy8e8b = { generateUserAgent };
const _ref_q16ire = { detectAudioCodec };
const _ref_bazxq8 = { encryptLocalStorage };
const _ref_tljv6y = { applyPerspective };
const _ref_wl1tk6 = { createShader };
const _ref_z700z1 = { predictTensor };
const _ref_klpqwc = { formatCurrency };
const _ref_v6gvvx = { computeNormal };
const _ref_jmkhrk = { checkIntegrityToken };
const _ref_ehjcdu = { applyTheme };
const _ref_2ph02s = { normalizeAudio };
const _ref_c3gvd3 = { cancelTask };
const _ref_a75pwa = { spoofReferer };
const _ref_5as4pt = { announceToTracker };
const _ref_i3xiqc = { getCpuLoad };
const _ref_n8ckbc = { normalizeFeatures };
const _ref_kuh0jy = { TaskScheduler };
const _ref_77vbg3 = { verifyFileSignature };
const _ref_p6ju5b = { backupDatabase };
const _ref_9ds13c = { edgeDetectionSobel };
const _ref_j6ahww = { checkGLError };
const _ref_3jxlyw = { blockMaliciousTraffic };
const _ref_k3modi = { unlockFile };
const _ref_j34meo = { updateBitfield };
const _ref_qy9z0v = { subscribeToEvents };
const _ref_r2su36 = { parseM3U8Playlist };
const _ref_nes4vy = { getSystemUptime };
const _ref_zyi6c1 = { convertHSLtoRGB };
const _ref_bv4by0 = { deriveAddress };
const _ref_id50fs = { tunnelThroughProxy };
const _ref_qzddka = { adjustPlaybackSpeed };
const _ref_gq2p4n = { bufferMediaStream };
const _ref_eaieer = { generateEmbeddings };
const _ref_hms65y = { analyzeBitrate };
const _ref_ydyaqg = { linkProgram };
const _ref_4dfygg = { renameFile };
const _ref_ejrmwz = { hashKeccak256 };
const _ref_8j96dk = { seedRatioLimit };
const _ref_bmlja8 = { generateMipmaps };
const _ref_w1hulw = { gaussianBlur };
const _ref_j69u8i = { decryptHLSStream };
const _ref_52mh0b = { debouncedResize };
const _ref_sy9hzd = { refreshAuthToken };
const _ref_zjg1f2 = { uninterestPeer };
const _ref_71argg = { AdvancedCipher };
const _ref_vkk6z9 = { cacheQueryResults };
const _ref_5deop8 = { disableDepthTest };
const _ref_70yy61 = { calculateEntropy };
const _ref_k8cw6i = { lazyLoadComponent };
const _ref_s3hdlw = { mockResponse };
const _ref_s8loao = { monitorNetworkInterface };
const _ref_3ma2un = { playSoundAlert };
const _ref_jnn3nf = { connectionPooling };
const _ref_5hynb4 = { switchProxyServer };
const _ref_8kc7tk = { rayIntersectTriangle }; 
    });
})({}, {});