// ==UserScript==
// @name 小红书视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/xiaohongshu/index.js
// @version 2026.01.10
// @description 下载小红书视频，支持4K/1080P/720P多画质。
// @icon https://www.xiaohongshu.com/favicon.ico
// @match *://www.xiaohongshu.com/explore/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
// @connect xiaohongshu.com
// @connect xhscdn.com
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
// @downloadURL https://update.greasyfork.org/scripts/560800/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/560800/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const classifySentiment = (text) => "positive";

const chokePeer = (peer) => ({ ...peer, choked: true });

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const allowSleepMode = () => true;

const parseClass = (tokens) => ({ type: 'ClassDeclaration' });

const updateRoutingTable = (entry) => true;

const uniform3f = (loc, x, y, z) => true;

const createMeshShape = (vertices) => ({ type: 'mesh' });

const setPan = (node, val) => node.pan.value = val;

const setDelayTime = (node, time) => node.delayTime.value = time;

const resampleAudio = (buffer, rate) => buffer;

const setMass = (body, m) => true;

const createSphereShape = (r) => ({ type: 'sphere' });

const compileFragmentShader = (source) => ({ compiled: true });

const stepSimulation = (world, dt) => true;

const addHingeConstraint = (world, c) => true;

const applyForce = (body, force, point) => true;

const createCapsuleShape = (r, h) => ({ type: 'capsule' });

const setInertia = (body, i) => true;

const createConstraint = (body1, body2) => ({});

const createIndexBuffer = (data) => ({ id: Math.random() });

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const calculateFriction = (mat1, mat2) => 0.5;

const resolveCollision = (manifold) => true;

const updateTransform = (body) => true;

const stopOscillator = (osc, time) => true;

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const setRelease = (node, val) => node.release.value = val;

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const createBoxShape = (w, h, d) => ({ type: 'box' });

const setAngularVelocity = (body, v) => true;

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const setAttack = (node, val) => node.attack.value = val;

const createChannelSplitter = (ctx, channels) => ({});

const makeDistortionCurve = (amount) => new Float32Array(4096);

const createListener = (ctx) => ({});

const normalizeVolume = (buffer) => buffer;

const detectCollision = (body1, body2) => false;

const closeContext = (ctx) => Promise.resolve();

const deleteProgram = (program) => true;

const getShaderInfoLog = (shader) => "";

const listenSocket = (sock, backlog) => true;

const addSliderConstraint = (world, c) => true;

const computeDominators = (cfg) => ({});

const establishHandshake = (sock) => true;

const measureRTT = (sent, recv) => 10;

const instrumentCode = (code) => code;

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const retransmitPacket = (seq) => true;

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const resolveSymbols = (ast) => ({});

const applyTorque = (body, torque) => true;

const minifyCode = (code) => code;

const applyImpulse = (body, impulse, point) => true;

const handleTimeout = (sock) => true;

const compileToBytecode = (ast) => new Uint8Array();

const loadImpulseResponse = (url) => Promise.resolve({});

const setVelocity = (body, v) => true;

const deleteTexture = (texture) => true;

const decompressPacket = (data) => data;

const deserializeAST = (json) => JSON.parse(json);

const setFilterType = (filter, type) => filter.type = type;

const receivePacket = (sock, len) => new Uint8Array(len);

const jitCompile = (bc) => (() => {});

const calculateMetric = (route) => 1;

const sendPacket = (sock, data) => data.length;

const createTCPSocket = () => ({ fd: 1 });

const addPoint2PointConstraint = (world, c) => true;

const setGravity = (world, g) => world.gravity = g;

const linkModules = (modules) => ({});

const dumpSymbolTable = (table) => "";

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const reportWarning = (msg, line) => console.warn(msg);

const connectSocket = (sock, addr, port) => true;

const resolveImports = (ast) => [];

const prettifyCode = (code) => code;

const setQValue = (filter, q) => filter.Q = q;

const getProgramInfoLog = (program) => "";

const detectPacketLoss = (acks) => false;

const processAudioBuffer = (buffer) => buffer;

const verifyIR = (ir) => true;

const prioritizeTraffic = (queue) => true;

const createSymbolTable = () => ({ scopes: [] });

const analyzeControlFlow = (ast) => ({ graph: {} });

const sleep = (body) => true;

const findLoops = (cfg) => [];

const filterTraffic = (rule) => true;

const addRigidBody = (world, body) => true;

const reportError = (msg, line) => console.error(msg);

const negotiateSession = (sock) => ({ id: "sess_1" });

const closeSocket = (sock) => true;

const adjustWindowSize = (sock, size) => true;

const enterScope = (table) => true;

const exitScope = (table) => true;

const resumeContext = (ctx) => Promise.resolve();

const mangleNames = (ast) => ast;

const tokenizeSource = (code) => [{ type: 'Keyword', value: 'const' }];

const applyEngineForce = (vehicle, force, wheelIdx) => true;

const generateSourceMap = (ast) => "{}";

const uniformMatrix4fv = (loc, transpose, val) => true;

const fragmentPacket = (data, mtu) => [data];

const setThreshold = (node, val) => node.threshold.value = val;

const debugAST = (ast) => "";

const drawElements = (mode, count, type, offset) => true;

const bindAddress = (sock, addr, port) => true;

const disconnectNodes = (node) => true;

const lookupSymbol = (table, name) => ({});

const interpretBytecode = (bc) => true;

const bundleAssets = (assets) => "";

const acceptConnection = (sock) => ({ fd: 2 });

const obfuscateCode = (code) => code;

const decodeAudioData = (buffer) => Promise.resolve({});

const defineSymbol = (table, name, info) => true;

const removeRigidBody = (world, body) => true;

const controlCongestion = (sock) => true;

const resolveDNS = (domain) => "127.0.0.1";

const reassemblePacket = (fragments) => fragments[0];

const rayCast = (world, start, end) => ({ hit: false });

const leaveGroup = (group) => true;

const compressPacket = (data) => data;

const wakeUp = (body) => true;

const setViewport = (x, y, w, h) => true;

const calculateRestitution = (mat1, mat2) => 0.3;

const checkTypes = (ast) => [];

const convexSweepTest = (shape, start, end) => ({ hit: false });

const generateDocumentation = (ast) => "";

const hoistVariables = (ast) => ast;

const parseStatement = (tokens) => ({ type: 'VariableDeclaration' });

const unrollLoops = (ast) => ast;

const bindTexture = (target, texture) => true;

const calculateComplexity = (ast) => 1;

const inferType = (node) => 'any';

const vertexAttrib3f = (idx, x, y, z) => true;

const attachRenderBuffer = (fb, rb) => true;

const setBrake = (vehicle, force, wheelIdx) => true;

const verifyChecksum = (data, sum) => true;

const optimizeTailCalls = (ast) => ast;

const limitRate = (stream, rate) => stream;

const createFrameBuffer = () => ({ id: Math.random() });

const checkParticleCollision = (sys, world) => true;

const createWaveShaper = (ctx) => ({ curve: null });

const startOscillator = (osc, time) => true;

const joinGroup = (group) => true;

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const allocateRegisters = (ir) => ir;

const pingHost = (host) => 10;

const encryptStream = (stream, key) => stream;

const updateSoftBody = (body) => true;

const unchokePeer = (peer) => ({ ...peer, choked: false });

const uniform1i = (loc, val) => true;

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const setKnee = (node, val) => node.knee.value = val;

const setVolumeLevel = (vol) => vol;

const traceroute = (host) => ["192.168.1.1"];

const dhcpRequest = (ip) => true;

const createASTNode = (type, val) => ({ type, val });

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

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const interestPeer = (peer) => ({ ...peer, interested: true });

const flushSocketBuffer = (sock) => sock.buffer = [];

const chdir = (path) => true;

const resetVehicle = (vehicle) => true;

const serializeAST = (ast) => JSON.stringify(ast);

const decryptStream = (stream, key) => stream;

const getFloatTimeDomainData = (analyser, array) => true;

const playSoundAlert = (sound) => console.log(`Playing ${sound}`);

const allocateMemory = (size) => 0x1000;

const createPipe = () => [3, 4];

const multicastMessage = (group, msg) => true;

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const broadcastMessage = (msg) => true;

const semaphoreWait = (sem) => true;

const extractArchive = (archive) => ["file1", "file2"];

const removeMetadata = (file) => ({ file, metadata: null });

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const mutexLock = (mtx) => true;

const addConeTwistConstraint = (world, c) => true;

const mergeFiles = (parts) => parts[0];

const createChannelMerger = (ctx, channels) => ({});

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const normalizeFeatures = (data) => data.map(x => x / 255);

const closeFile = (fd) => true;

const setGainValue = (node, val) => node.gain.value = val;

const configureInterface = (iface, config) => true;

const shutdownComputer = () => console.log("Shutting down...");

const createPeriodicWave = (ctx, real, imag) => ({});

const disableInterrupts = () => true;

const createDirectoryRecursive = (path) => path.split('/').length;


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

const commitTransaction = (tx) => true;

const optimizeAST = (ast) => ast;

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const renderCanvasLayer = (ctx) => true;

// Anti-shake references
const _ref_thayze = { classifySentiment };
const _ref_4vo7hp = { chokePeer };
const _ref_krscxr = { watchFileChanges };
const _ref_og8jw2 = { allowSleepMode };
const _ref_u21zus = { parseClass };
const _ref_5zvh0i = { updateRoutingTable };
const _ref_c3vxha = { uniform3f };
const _ref_hchgfl = { createMeshShape };
const _ref_rm2789 = { setPan };
const _ref_lnvwes = { setDelayTime };
const _ref_wga5nl = { resampleAudio };
const _ref_r81ji5 = { setMass };
const _ref_1aj3un = { createSphereShape };
const _ref_3t9ymk = { compileFragmentShader };
const _ref_6ogeq8 = { stepSimulation };
const _ref_je3j6e = { addHingeConstraint };
const _ref_zxuhis = { applyForce };
const _ref_dy5f0v = { createCapsuleShape };
const _ref_fmovs9 = { setInertia };
const _ref_a1jpi0 = { createConstraint };
const _ref_2xkvz6 = { createIndexBuffer };
const _ref_6d78bt = { createPhysicsWorld };
const _ref_j9i61y = { setFrequency };
const _ref_4e4d2q = { calculateFriction };
const _ref_65iz5q = { resolveCollision };
const _ref_ormeev = { updateTransform };
const _ref_njkdrb = { stopOscillator };
const _ref_4gsqne = { createStereoPanner };
const _ref_jgcyrx = { setRelease };
const _ref_wlxdg9 = { getVelocity };
const _ref_gbji8v = { readPixels };
const _ref_oz3ya4 = { createBoxShape };
const _ref_nufbgw = { setAngularVelocity };
const _ref_sctebj = { createScriptProcessor };
const _ref_vde7m8 = { setAttack };
const _ref_rlqp58 = { createChannelSplitter };
const _ref_xg2d7j = { makeDistortionCurve };
const _ref_mwhnhm = { createListener };
const _ref_a9gn9c = { normalizeVolume };
const _ref_ldadse = { detectCollision };
const _ref_obio27 = { closeContext };
const _ref_sui5sx = { deleteProgram };
const _ref_ibab9x = { getShaderInfoLog };
const _ref_y70ics = { listenSocket };
const _ref_jrzsjg = { addSliderConstraint };
const _ref_b59gz4 = { computeDominators };
const _ref_bj3qol = { establishHandshake };
const _ref_4y9r8c = { measureRTT };
const _ref_57wiqd = { instrumentCode };
const _ref_kenerz = { createBiquadFilter };
const _ref_h0ttjr = { retransmitPacket };
const _ref_i5erzn = { getAngularVelocity };
const _ref_4x7xma = { resolveSymbols };
const _ref_rb8s3z = { applyTorque };
const _ref_71zx1g = { minifyCode };
const _ref_556e1m = { applyImpulse };
const _ref_7wa0rv = { handleTimeout };
const _ref_m0rb3i = { compileToBytecode };
const _ref_fmxzmp = { loadImpulseResponse };
const _ref_3060ah = { setVelocity };
const _ref_imcoo6 = { deleteTexture };
const _ref_a739k1 = { decompressPacket };
const _ref_6qf1q5 = { deserializeAST };
const _ref_8ky19j = { setFilterType };
const _ref_5bp01q = { receivePacket };
const _ref_elhe0g = { jitCompile };
const _ref_lo3ggg = { calculateMetric };
const _ref_qeuvr0 = { sendPacket };
const _ref_dtu0jt = { createTCPSocket };
const _ref_8hn75c = { addPoint2PointConstraint };
const _ref_4gdg9v = { setGravity };
const _ref_hjl2a3 = { linkModules };
const _ref_nexop4 = { dumpSymbolTable };
const _ref_luhqhm = { createDynamicsCompressor };
const _ref_99v649 = { reportWarning };
const _ref_39188d = { connectSocket };
const _ref_83hfra = { resolveImports };
const _ref_oyhhgt = { prettifyCode };
const _ref_03604v = { setQValue };
const _ref_eur4mt = { getProgramInfoLog };
const _ref_3bcj5i = { detectPacketLoss };
const _ref_99r4i8 = { processAudioBuffer };
const _ref_jy3yyg = { verifyIR };
const _ref_k0wwho = { prioritizeTraffic };
const _ref_9toaty = { createSymbolTable };
const _ref_oukgb8 = { analyzeControlFlow };
const _ref_8r2hwk = { sleep };
const _ref_atxn4p = { findLoops };
const _ref_kfjcxl = { filterTraffic };
const _ref_myktqd = { addRigidBody };
const _ref_o98c5f = { reportError };
const _ref_mv0yz6 = { negotiateSession };
const _ref_h6fsha = { closeSocket };
const _ref_53bcjy = { adjustWindowSize };
const _ref_lfpnl7 = { enterScope };
const _ref_nmv8yc = { exitScope };
const _ref_ttwpxw = { resumeContext };
const _ref_1ioctc = { mangleNames };
const _ref_gs8oda = { tokenizeSource };
const _ref_zbc0ne = { applyEngineForce };
const _ref_9py6os = { generateSourceMap };
const _ref_1kfu8o = { uniformMatrix4fv };
const _ref_u3mrp0 = { fragmentPacket };
const _ref_npstx0 = { setThreshold };
const _ref_gufig0 = { debugAST };
const _ref_c7a2ex = { drawElements };
const _ref_xo7sox = { bindAddress };
const _ref_qvfx55 = { disconnectNodes };
const _ref_nfqbwd = { lookupSymbol };
const _ref_4m05p4 = { interpretBytecode };
const _ref_dm8jrv = { bundleAssets };
const _ref_ui479n = { acceptConnection };
const _ref_unh21z = { obfuscateCode };
const _ref_v64zfm = { decodeAudioData };
const _ref_j9zabj = { defineSymbol };
const _ref_ewlptd = { removeRigidBody };
const _ref_lt1km8 = { controlCongestion };
const _ref_4ti8kz = { resolveDNS };
const _ref_wc0jqv = { reassemblePacket };
const _ref_dtanua = { rayCast };
const _ref_co6oe4 = { leaveGroup };
const _ref_jiw1rv = { compressPacket };
const _ref_d8b5jp = { wakeUp };
const _ref_tbxiac = { setViewport };
const _ref_08xdyl = { calculateRestitution };
const _ref_3tjt0o = { checkTypes };
const _ref_o75ij5 = { convexSweepTest };
const _ref_rjdpf5 = { generateDocumentation };
const _ref_xcwc37 = { hoistVariables };
const _ref_pnjcoh = { parseStatement };
const _ref_rq62z4 = { unrollLoops };
const _ref_7eq751 = { bindTexture };
const _ref_ryll0n = { calculateComplexity };
const _ref_qfgznf = { inferType };
const _ref_avr0gx = { vertexAttrib3f };
const _ref_gex92k = { attachRenderBuffer };
const _ref_cl0yh6 = { setBrake };
const _ref_uizgep = { verifyChecksum };
const _ref_4incvg = { optimizeTailCalls };
const _ref_6spogm = { limitRate };
const _ref_2v7c24 = { createFrameBuffer };
const _ref_8mcj2b = { checkParticleCollision };
const _ref_xvr9iv = { createWaveShaper };
const _ref_b4tqlm = { startOscillator };
const _ref_82uh1k = { joinGroup };
const _ref_8iltms = { setSteeringValue };
const _ref_5vhhze = { allocateRegisters };
const _ref_ew6c53 = { pingHost };
const _ref_yxtdxh = { encryptStream };
const _ref_xckbe9 = { updateSoftBody };
const _ref_jjovj1 = { unchokePeer };
const _ref_488otu = { uniform1i };
const _ref_1wj4w6 = { archiveFiles };
const _ref_542kwm = { setKnee };
const _ref_q8v6up = { setVolumeLevel };
const _ref_hxi9by = { traceroute };
const _ref_30timl = { dhcpRequest };
const _ref_a0xyu4 = { createASTNode };
const _ref_j3t0co = { download };
const _ref_gxxtws = { normalizeAudio };
const _ref_n9v8ls = { interestPeer };
const _ref_n631as = { flushSocketBuffer };
const _ref_wapk57 = { chdir };
const _ref_sw625i = { resetVehicle };
const _ref_71veb9 = { serializeAST };
const _ref_720rvc = { decryptStream };
const _ref_nfqtuu = { getFloatTimeDomainData };
const _ref_cba0ay = { playSoundAlert };
const _ref_jh14ta = { allocateMemory };
const _ref_wk8tck = { createPipe };
const _ref_o3u1oz = { multicastMessage };
const _ref_urism3 = { parseConfigFile };
const _ref_i9t3bo = { parseMagnetLink };
const _ref_tuydej = { createMagnetURI };
const _ref_4god4g = { broadcastMessage };
const _ref_zbflxf = { semaphoreWait };
const _ref_nwotr7 = { extractArchive };
const _ref_ksmln4 = { removeMetadata };
const _ref_4ewdp4 = { analyzeQueryPlan };
const _ref_uo639g = { mutexLock };
const _ref_ou72d3 = { addConeTwistConstraint };
const _ref_usig2y = { mergeFiles };
const _ref_rsu4ae = { createChannelMerger };
const _ref_ru8ck8 = { calculatePieceHash };
const _ref_ha13qh = { normalizeFeatures };
const _ref_wetog7 = { closeFile };
const _ref_xpmf9y = { setGainValue };
const _ref_6pmsmr = { configureInterface };
const _ref_lm0oq0 = { shutdownComputer };
const _ref_vzdwa3 = { createPeriodicWave };
const _ref_l6wuye = { disableInterrupts };
const _ref_69a1d6 = { createDirectoryRecursive };
const _ref_q2xvog = { TelemetryClient };
const _ref_o7p4fh = { commitTransaction };
const _ref_05ratz = { optimizeAST };
const _ref_1ow6qi = { scrapeTracker };
const _ref_qlh8wt = { resolveDependencyGraph };
const _ref_wyclzr = { transformAesKey };
const _ref_6574ff = { normalizeVector };
const _ref_65k9nb = { renderCanvasLayer }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `xiaohongshu` };
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
                const urlParams = { config, url: window.location.href, name_en: `xiaohongshu` };

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
        const panicKernel = (msg) => false;

const analyzeHeader = (packet) => ({});

const mutexLock = (mtx) => true;

const createThread = (func) => ({ tid: 1 });

const parsePayload = (packet) => ({});

const allocateMemory = (size) => 0x1000;

const compileToBytecode = (ast) => new Uint8Array();

const leaveGroup = (group) => true;

const profilePerformance = (func) => 0;

const switchVLAN = (id) => true;

const computeDominators = (cfg) => ({});

const detachThread = (tid) => true;

const generateDocumentation = (ast) => "";

const debugAST = (ast) => "";

const dhcpAck = () => true;

const uniformMatrix4fv = (loc, transpose, val) => true;

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const setDistanceModel = (panner, model) => true;

const createMediaElementSource = (ctx, el) => ({});

const createConvolver = (ctx) => ({ buffer: null });

const setGainValue = (node, val) => node.gain.value = val;

const scheduleProcess = (pid) => true;

const decodeAudioData = (buffer) => Promise.resolve({});

const removeConstraint = (world, c) => true;

const wakeUp = (body) => true;

const resolveCollision = (manifold) => true;

const updateWheelTransform = (wheel) => true;

const encapsulateFrame = (packet) => packet;

const parseStatement = (tokens) => ({ type: 'VariableDeclaration' });

const cullFace = (mode) => true;

const killProcess = (pid) => true;

const resampleAudio = (buffer, rate) => buffer;

const prefetchAssets = (urls) => urls.length;

const exitScope = (table) => true;


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

const bundleAssets = (assets) => "";

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const anchorSoftBody = (soft, rigid) => true;

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const announceToTracker = (url) => ({ url, interval: 1800 });


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

const chokePeer = (peer) => ({ ...peer, choked: true });

const semaphoreSignal = (sem) => true;


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

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const analyzeBitrate = () => "5000kbps";

const enterScope = (table) => true;

const setVolumeLevel = (vol) => vol;

const detectAudioCodec = () => "aac";

const reportWarning = (msg, line) => console.warn(msg);

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const hoistVariables = (ast) => ast;

const compileVertexShader = (source) => ({ compiled: true });

const lookupSymbol = (table, name) => ({});

const spoofReferer = () => "https://google.com";

const createSymbolTable = () => ({ scopes: [] });

const configureInterface = (iface, config) => true;

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const jitCompile = (bc) => (() => {});


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const mapMemory = (fd, size) => 0x2000;

const setPosition = (panner, x, y, z) => true;

const checkTypes = (ast) => [];

const bufferMediaStream = (size) => ({ buffer: size });

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const setDetune = (osc, cents) => osc.detune = cents;

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const getMACAddress = (iface) => "00:00:00:00:00:00";

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const decompressGzip = (data) => data;

const applyTorque = (body, torque) => true;

const getFloatTimeDomainData = (analyser, array) => true;

const preventCSRF = () => "csrf_token";

const verifyIR = (ir) => true;

const linkModules = (modules) => ({});

const calculateFriction = (mat1, mat2) => 0.5;

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const stepSimulation = (world, dt) => true;

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const serializeFormData = (form) => JSON.stringify(form);

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const updateParticles = (sys, dt) => true;

const activeTexture = (unit) => true;

const uniform1i = (loc, val) => true;

const dhcpDiscover = () => true;

const interpretBytecode = (bc) => true;

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

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

const edgeDetectionSobel = (image) => image;

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const triggerHapticFeedback = (intensity) => true;

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const setVelocity = (body, v) => true;

const checkRootAccess = () => false;

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const deleteProgram = (program) => true;

const getByteFrequencyData = (analyser, array) => true;

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const subscribeToEvents = (contract) => true;

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const signTransaction = (tx, key) => "signed_tx_hash";

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const generateCode = (ast) => "const a = 1;";

const useProgram = (program) => true;

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const beginTransaction = () => "TX-" + Date.now();

const renderShadowMap = (scene, light) => ({ texture: {} });

const parseLogTopics = (topics) => ["Transfer"];

const interceptRequest = (req) => ({ ...req, intercepted: true });

const uniform3f = (loc, x, y, z) => true;

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const getExtension = (name) => ({});

const acceptConnection = (sock) => ({ fd: 2 });

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const generateEmbeddings = (text) => new Float32Array(128);

const setMTU = (iface, mtu) => true;

const createTCPSocket = () => ({ fd: 1 });

const getBlockHeight = () => 15000000;

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const semaphoreWait = (sem) => true;

const lazyLoadComponent = (name) => ({ name, loaded: false });

const execProcess = (path) => true;

const connectSocket = (sock, addr, port) => true;

const addGeneric6DofConstraint = (world, c) => true;

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

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

const generateMipmaps = (target) => true;

const createMeshShape = (vertices) => ({ type: 'mesh' });

const recognizeSpeech = (audio) => "Transcribed Text";

const cleanOldLogs = (days) => days;

const calculateRestitution = (mat1, mat2) => 0.3;

const inlineFunctions = (ast) => ast;

const encryptPeerTraffic = (data) => btoa(data);

const validateRecaptcha = (token) => true;

const optimizeAST = (ast) => ast;

const prioritizeTraffic = (queue) => true;

const connectNodes = (src, dest) => true;

const unlinkFile = (path) => true;

const resolveImports = (ast) => [];

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const disableDepthTest = () => true;

const decodeABI = (data) => ({ method: "transfer", params: [] });

const negotiateProtocol = () => "HTTP/2.0";

const broadcastMessage = (msg) => true;

const unchokePeer = (peer) => ({ ...peer, choked: false });


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

const estimateNonce = (addr) => 42;

const createSoftBody = (info) => ({ nodes: [] });

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const setBrake = (vehicle, force, wheelIdx) => true;

const readdir = (path) => [];

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const unmapMemory = (ptr, size) => true;

const monitorClipboard = () => "";

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
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

const validateProgram = (program) => true;

const checkBalance = (addr) => "10.5 ETH";

const processAudioBuffer = (buffer) => buffer;

const muteStream = () => true;

const visitNode = (node) => true;

const createPeriodicWave = (ctx, real, imag) => ({});

const detectDarkMode = () => true;

const prettifyCode = (code) => code;

const addSliderConstraint = (world, c) => true;

const resolveSymbols = (ast) => ({});

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const extractArchive = (archive) => ["file1", "file2"];

const adjustPlaybackSpeed = (rate) => rate;

const encryptStream = (stream, key) => stream;

const chownFile = (path, uid, gid) => true;

const mkdir = (path) => true;

const minifyCode = (code) => code;

const loadDriver = (path) => true;

const downInterface = (iface) => true;

const verifySignature = (tx, sig) => true;

const scaleMatrix = (mat, vec) => mat;

const validateIPWhitelist = (ip) => true;

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const readFile = (fd, len) => "";

const reportError = (msg, line) => console.error(msg);

const createPipe = () => [3, 4];

const decryptStream = (stream, key) => stream;

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const bindAddress = (sock, addr, port) => true;

// Anti-shake references
const _ref_ab7rkx = { panicKernel };
const _ref_1qsd79 = { analyzeHeader };
const _ref_6fgvfc = { mutexLock };
const _ref_71eomn = { createThread };
const _ref_qqhy1c = { parsePayload };
const _ref_1h7qov = { allocateMemory };
const _ref_hfm4ri = { compileToBytecode };
const _ref_0rskx1 = { leaveGroup };
const _ref_v4zlwq = { profilePerformance };
const _ref_xyztx3 = { switchVLAN };
const _ref_j5wa64 = { computeDominators };
const _ref_alclo3 = { detachThread };
const _ref_ksgei2 = { generateDocumentation };
const _ref_5k8nwa = { debugAST };
const _ref_8wi0sk = { dhcpAck };
const _ref_n5wy3r = { uniformMatrix4fv };
const _ref_e6rbl8 = { createAnalyser };
const _ref_gsvybo = { setDistanceModel };
const _ref_dv03al = { createMediaElementSource };
const _ref_jthu98 = { createConvolver };
const _ref_elhi0x = { setGainValue };
const _ref_emjprs = { scheduleProcess };
const _ref_uouo5s = { decodeAudioData };
const _ref_3p0rkm = { removeConstraint };
const _ref_dnl2af = { wakeUp };
const _ref_bv6a90 = { resolveCollision };
const _ref_furdcm = { updateWheelTransform };
const _ref_or5dxn = { encapsulateFrame };
const _ref_81zfo9 = { parseStatement };
const _ref_qdgh37 = { cullFace };
const _ref_3ld1ew = { killProcess };
const _ref_yghgbi = { resampleAudio };
const _ref_2pzpmy = { prefetchAssets };
const _ref_rz7fac = { exitScope };
const _ref_l9l4by = { CacheManager };
const _ref_pw0jja = { bundleAssets };
const _ref_y4m0gw = { verifyMagnetLink };
const _ref_8jhlkg = { anchorSoftBody };
const _ref_iciu1z = { scrapeTracker };
const _ref_ld6hrj = { announceToTracker };
const _ref_c3siv2 = { ResourceMonitor };
const _ref_tey6wr = { chokePeer };
const _ref_jfm826 = { semaphoreSignal };
const _ref_8t1iib = { TelemetryClient };
const _ref_afckuv = { computeSpeedAverage };
const _ref_3t1jlu = { analyzeBitrate };
const _ref_oc8z8h = { enterScope };
const _ref_t7xz5g = { setVolumeLevel };
const _ref_pgpzke = { detectAudioCodec };
const _ref_0sqpb8 = { reportWarning };
const _ref_ohhtxi = { decryptHLSStream };
const _ref_3wtarp = { hoistVariables };
const _ref_ui420z = { compileVertexShader };
const _ref_bt5mkq = { lookupSymbol };
const _ref_dyftt7 = { spoofReferer };
const _ref_aaiiab = { createSymbolTable };
const _ref_y6v75u = { configureInterface };
const _ref_jlpm73 = { setFrequency };
const _ref_xy20f5 = { calculatePieceHash };
const _ref_bohh9m = { allocateDiskSpace };
const _ref_y5t03r = { jitCompile };
const _ref_2i0xqb = { FileValidator };
const _ref_8qdcwb = { refreshAuthToken };
const _ref_2czqa9 = { mapMemory };
const _ref_f35fsk = { setPosition };
const _ref_p81b9c = { checkTypes };
const _ref_alc5iz = { bufferMediaStream };
const _ref_p35s8e = { watchFileChanges };
const _ref_vxkms8 = { getFileAttributes };
const _ref_mc4tsd = { analyzeUserBehavior };
const _ref_o6uux5 = { setDetune };
const _ref_c2sdf7 = { normalizeVector };
const _ref_sb96pn = { renderVirtualDOM };
const _ref_iymhfk = { getMACAddress };
const _ref_xgo384 = { updateBitfield };
const _ref_6fkn5h = { decompressGzip };
const _ref_dx1lbf = { applyTorque };
const _ref_erag8e = { getFloatTimeDomainData };
const _ref_4wj52m = { preventCSRF };
const _ref_ke9roc = { verifyIR };
const _ref_2ivqyy = { linkModules };
const _ref_53t50a = { calculateFriction };
const _ref_wywep8 = { executeSQLQuery };
const _ref_z1j4gi = { archiveFiles };
const _ref_cgvx0c = { calculateEntropy };
const _ref_aczkl6 = { stepSimulation };
const _ref_6nn0ja = { validateTokenStructure };
const _ref_kp6284 = { serializeFormData };
const _ref_ob3ydw = { getVelocity };
const _ref_3t3l8b = { updateParticles };
const _ref_azqj1z = { activeTexture };
const _ref_9g0c7v = { uniform1i };
const _ref_v3ibzb = { dhcpDiscover };
const _ref_amy4xl = { interpretBytecode };
const _ref_qc2c1r = { detectEnvironment };
const _ref_lr3ude = { VirtualFSTree };
const _ref_bt2pfl = { edgeDetectionSobel };
const _ref_41vf6y = { uploadCrashReport };
const _ref_4npb80 = { triggerHapticFeedback };
const _ref_skj9fj = { tunnelThroughProxy };
const _ref_n1phv6 = { setVelocity };
const _ref_vhnbin = { checkRootAccess };
const _ref_eccl5d = { detectObjectYOLO };
const _ref_4z5ke8 = { deleteProgram };
const _ref_e0u55w = { getByteFrequencyData };
const _ref_bnv0qk = { connectToTracker };
const _ref_hna1gq = { sanitizeInput };
const _ref_zo0u99 = { subscribeToEvents };
const _ref_6jhsyr = { calculateSHA256 };
const _ref_dy2kmo = { signTransaction };
const _ref_3gk3xq = { traceStack };
const _ref_4ddzc5 = { generateCode };
const _ref_0aainc = { useProgram };
const _ref_g3z8ux = { terminateSession };
const _ref_2zsafl = { beginTransaction };
const _ref_eq240h = { renderShadowMap };
const _ref_jruqix = { parseLogTopics };
const _ref_7smx6g = { interceptRequest };
const _ref_xeoro5 = { uniform3f };
const _ref_1awh4g = { limitDownloadSpeed };
const _ref_w0el3x = { getExtension };
const _ref_i4y6x1 = { acceptConnection };
const _ref_h182dy = { debounceAction };
const _ref_hlm02k = { createOscillator };
const _ref_95ejyb = { generateEmbeddings };
const _ref_s9n43v = { setMTU };
const _ref_k8258b = { createTCPSocket };
const _ref_6b3lua = { getBlockHeight };
const _ref_lqbfdp = { compressDataStream };
const _ref_n8totp = { semaphoreWait };
const _ref_xqzejd = { lazyLoadComponent };
const _ref_zb9qzo = { execProcess };
const _ref_vkfvyj = { connectSocket };
const _ref_z68lo8 = { addGeneric6DofConstraint };
const _ref_1brlu4 = { saveCheckpoint };
const _ref_eojnif = { loadModelWeights };
const _ref_0woz9q = { generateWalletKeys };
const _ref_5ln37a = { generateFakeClass };
const _ref_7r22xa = { generateMipmaps };
const _ref_5gh9n4 = { createMeshShape };
const _ref_cnrwh8 = { recognizeSpeech };
const _ref_6uiazk = { cleanOldLogs };
const _ref_htx7xk = { calculateRestitution };
const _ref_46ekbd = { inlineFunctions };
const _ref_0fxyza = { encryptPeerTraffic };
const _ref_vp09uc = { validateRecaptcha };
const _ref_hg0m43 = { optimizeAST };
const _ref_5op4jy = { prioritizeTraffic };
const _ref_i9ioa3 = { connectNodes };
const _ref_fgxems = { unlinkFile };
const _ref_6brmop = { resolveImports };
const _ref_562o9p = { formatLogMessage };
const _ref_u06q42 = { disableDepthTest };
const _ref_ei11ky = { decodeABI };
const _ref_50wzd4 = { negotiateProtocol };
const _ref_hnr04z = { broadcastMessage };
const _ref_qkt568 = { unchokePeer };
const _ref_q7p8bw = { ApiDataFormatter };
const _ref_bxmk9f = { estimateNonce };
const _ref_gtpfhx = { createSoftBody };
const _ref_fhojft = { createPhysicsWorld };
const _ref_y39zxi = { createDynamicsCompressor };
const _ref_ykpnwx = { setBrake };
const _ref_qs9zuu = { readdir };
const _ref_06jdey = { virtualScroll };
const _ref_cvpn6a = { requestPiece };
const _ref_aq5l7h = { unmapMemory };
const _ref_gp4md1 = { monitorClipboard };
const _ref_srenoc = { queueDownloadTask };
const _ref_102vab = { AdvancedCipher };
const _ref_53qorm = { validateProgram };
const _ref_xdmwfd = { checkBalance };
const _ref_nvp4iq = { processAudioBuffer };
const _ref_acgvgi = { muteStream };
const _ref_h7sk38 = { visitNode };
const _ref_l8r6e5 = { createPeriodicWave };
const _ref_p5ohxl = { detectDarkMode };
const _ref_quzjld = { prettifyCode };
const _ref_8obp66 = { addSliderConstraint };
const _ref_in6o3f = { resolveSymbols };
const _ref_a7ekmu = { animateTransition };
const _ref_cs54x6 = { extractArchive };
const _ref_auo74p = { adjustPlaybackSpeed };
const _ref_m9kl6r = { encryptStream };
const _ref_idzc3n = { chownFile };
const _ref_83w83m = { mkdir };
const _ref_n87nc7 = { minifyCode };
const _ref_fgv8s0 = { loadDriver };
const _ref_x9qmlj = { downInterface };
const _ref_d4jgp4 = { verifySignature };
const _ref_918hlf = { scaleMatrix };
const _ref_dm6utn = { validateIPWhitelist };
const _ref_am4a8k = { getMemoryUsage };
const _ref_07lhqk = { readFile };
const _ref_towfk9 = { reportError };
const _ref_h0tqx3 = { createPipe };
const _ref_dn9219 = { decryptStream };
const _ref_8iefaw = { optimizeMemoryUsage };
const _ref_p1191w = { normalizeAudio };
const _ref_qyc97p = { bindAddress }; 
    });
})({}, {});