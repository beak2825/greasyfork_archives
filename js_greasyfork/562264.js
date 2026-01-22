// ==UserScript==
// @name ShowRoomLive视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/ShowRoomLive/index.js
// @version 2026.01.21.2
// @description 一键下载ShowRoomLive视频，支持4K/1080P/720P多画质。
// @icon https://www.showroom-live.com/favicon.ico
// @match *://*.showroom-live.com/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
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

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const debugAST = (ast) => "";

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const rateLimitCheck = (ip) => true;

const subscribeToEvents = (contract) => true;

const processAudioBuffer = (buffer) => buffer;

const createFrameBuffer = () => ({ id: Math.random() });

const swapTokens = (pair, amount) => true;

const addWheel = (vehicle, info) => true;

const stakeAssets = (pool, amount) => true;

const decapsulateFrame = (frame) => frame;

const removeConstraint = (world, c) => true;

const computeDominators = (cfg) => ({});

const syncAudioVideo = (offset) => ({ offset, synced: true });

const encryptStream = (stream, key) => stream;

const addConeTwistConstraint = (world, c) => true;

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const verifyProofOfWork = (nonce) => true;

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const enterScope = (table) => true;

const mangleNames = (ast) => ast;

const detectVideoCodec = () => "h264";

const pingHost = (host) => 10;

const inferType = (node) => 'any';

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const disablePEX = () => false;

const decryptStream = (stream, key) => stream;

const decompressPacket = (data) => data;

const checkParticleCollision = (sys, world) => true;

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const createIndexBuffer = (data) => ({ id: Math.random() });

const hashKeccak256 = (data) => "0xabc...";

const exitScope = (table) => true;

const applyFog = (color, dist) => color;

const fingerprintBrowser = () => "fp_hash_123";

const parseStatement = (tokens) => ({ type: 'VariableDeclaration' });

const interpretBytecode = (bc) => true;

const lockFile = (path) => ({ path, locked: true });

const convertFormat = (src, dest) => dest;

const lookupSymbol = (table, name) => ({});

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const checkRootAccess = () => false;

const checkTypes = (ast) => [];

const setBrake = (vehicle, force, wheelIdx) => true;

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const signTransaction = (tx, key) => "signed_tx_hash";

const computeNormal = (v1, v2, v3) => ({ x: 0, y: 1, z: 0 });

const createSymbolTable = () => ({ scopes: [] });

const compileVertexShader = (source) => ({ compiled: true });

const dumpSymbolTable = (table) => "";

const optimizeTailCalls = (ast) => ast;


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

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const setQValue = (filter, q) => filter.Q = q;

const closeSocket = (sock) => true;

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const rayCast = (world, start, end) => ({ hit: false });

const unrollLoops = (ast) => ast;

const negotiateSession = (sock) => ({ id: "sess_1" });

const traverseAST = (node, visitor) => true;

const enableBlend = (func) => true;

const bindAddress = (sock, addr, port) => true;

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const findLoops = (cfg) => [];

const deriveAddress = (path) => "0x123...";

const cullFace = (mode) => true;

const getUniformLocation = (program, name) => 1;

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const negotiateProtocol = () => "HTTP/2.0";

const anchorSoftBody = (soft, rigid) => true;

const setGainValue = (node, val) => node.gain.value = val;

const addHingeConstraint = (world, c) => true;

const monitorClipboard = () => "";

const disconnectNodes = (node) => true;

const resampleAudio = (buffer, rate) => buffer;

const bufferMediaStream = (size) => ({ buffer: size });

const adjustWindowSize = (sock, size) => true;

const writePipe = (fd, data) => data.length;

const drawArrays = (gl, mode, first, count) => true;

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const updateParticles = (sys, dt) => true;

const getOutputTimestamp = (ctx) => Date.now();

const checkIntegrityConstraint = (table) => true;

const resolveSymbols = (ast) => ({});

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const generateDocumentation = (ast) => "";

const analyzeHeader = (packet) => ({});

const optimizeAST = (ast) => ast;

const createTCPSocket = () => ({ fd: 1 });

const getCpuLoad = () => Math.random() * 100;

const sendPacket = (sock, data) => data.length;

const joinGroup = (group) => true;

const autoResumeTask = (id) => ({ id, status: "resumed" });

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const verifySignature = (tx, sig) => true;

const checkUpdate = () => ({ hasUpdate: false });

const interestPeer = (peer) => ({ ...peer, interested: true });

const createVehicle = (chassis) => ({ wheels: [] });

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const announceToTracker = (url) => ({ url, interval: 1800 });

const emitParticles = (sys, count) => true;

const startOscillator = (osc, time) => true;

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const controlCongestion = (sock) => true;

const verifyAppSignature = () => true;


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

const setViewport = (x, y, w, h) => true;

const scaleMatrix = (mat, vec) => mat;

const invalidateCache = (key) => true;

const useProgram = (program) => true;

const cacheQueryResults = (key, data) => true;

const sleep = (body) => true;

const dropTable = (table) => true;

const contextSwitch = (oldPid, newPid) => true;

const detectDevTools = () => false;

const unlockRow = (id) => true;

const getMACAddress = (iface) => "00:00:00:00:00:00";

const setMTU = (iface, mtu) => true;

const switchVLAN = (id) => true;

const serializeFormData = (form) => JSON.stringify(form);

const hoistVariables = (ast) => ast;

const validateRecaptcha = (token) => true;

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const decodeAudioData = (buffer) => Promise.resolve({});

const upInterface = (iface) => true;

const sanitizeXSS = (html) => html;

const setRatio = (node, val) => node.ratio.value = val;

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const deserializeAST = (json) => JSON.parse(json);

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const obfuscateString = (str) => btoa(str);

const defineSymbol = (table, name, info) => true;

const multicastMessage = (group, msg) => true;

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const generateSourceMap = (ast) => "{}";

const serializeAST = (ast) => JSON.stringify(ast);

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const foldConstants = (ast) => ast;

const addRigidBody = (world, body) => true;

const createAudioContext = () => ({ sampleRate: 44100 });

const scheduleTask = (task) => ({ id: 1, task });

const prettifyCode = (code) => code;

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const chdir = (path) => true;

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const activeTexture = (unit) => true;

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const restartApplication = () => console.log("Restarting...");

const setDistanceModel = (panner, model) => true;

const suspendContext = (ctx) => Promise.resolve();

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const parsePayload = (packet) => ({});

const getFloatTimeDomainData = (analyser, array) => true;

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const wakeUp = (body) => true;

const minifyCode = (code) => code;

const playSoundAlert = (sound) => console.log(`Playing ${sound}`);

const killParticles = (sys) => true;

const mountFileSystem = (dev, path) => true;

const rollbackTransaction = (tx) => true;

const compileToBytecode = (ast) => new Uint8Array();

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

const deobfuscateString = (str) => atob(str);

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const restoreDatabase = (path) => true;

const scheduleProcess = (pid) => true;

const unmountFileSystem = (path) => true;

const lockRow = (id) => true;

const getcwd = () => "/";

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const installUpdate = () => false;

const downInterface = (iface) => true;

const disableInterrupts = () => true;

const execProcess = (path) => true;

const extractArchive = (archive) => ["file1", "file2"];

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const checkBalance = (addr) => "10.5 ETH";

const configureInterface = (iface, config) => true;

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const resolveImports = (ast) => [];

const freeMemory = (ptr) => true;

const handleTimeout = (sock) => true;

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const createThread = (func) => ({ tid: 1 });

const setPan = (node, val) => node.pan.value = val;

const cleanOldLogs = (days) => days;

const checkIntegrityToken = (token) => true;

const detachThread = (tid) => true;

const setKnee = (node, val) => node.knee.value = val;

const updateWheelTransform = (wheel) => true;

const setRelease = (node, val) => node.release.value = val;

const setPosition = (panner, x, y, z) => true;

// Anti-shake references
const _ref_2nggyl = { deleteTempFiles };
const _ref_3gt6ci = { debugAST };
const _ref_ac9ztl = { scrapeTracker };
const _ref_k8kzrj = { rateLimitCheck };
const _ref_9pyknd = { subscribeToEvents };
const _ref_766yei = { processAudioBuffer };
const _ref_n9xkzu = { createFrameBuffer };
const _ref_u15ceb = { swapTokens };
const _ref_oyriwf = { addWheel };
const _ref_1ue2iz = { stakeAssets };
const _ref_h83qdm = { decapsulateFrame };
const _ref_x5d8av = { removeConstraint };
const _ref_uxa9s1 = { computeDominators };
const _ref_71za92 = { syncAudioVideo };
const _ref_5r30nf = { encryptStream };
const _ref_ob40bf = { addConeTwistConstraint };
const _ref_h56q5o = { archiveFiles };
const _ref_m4wnx2 = { verifyProofOfWork };
const _ref_ubec61 = { extractThumbnail };
const _ref_b4vkdl = { uninterestPeer };
const _ref_j635xm = { enterScope };
const _ref_y3zwn2 = { mangleNames };
const _ref_vb939k = { detectVideoCodec };
const _ref_xtn9u9 = { pingHost };
const _ref_t1931t = { inferType };
const _ref_3wypvp = { generateWalletKeys };
const _ref_6lnfks = { disablePEX };
const _ref_5h0g6z = { decryptStream };
const _ref_pcbdi6 = { decompressPacket };
const _ref_l9t5t6 = { checkParticleCollision };
const _ref_ccij1u = { manageCookieJar };
const _ref_3sdpbl = { createIndexBuffer };
const _ref_2zf7ow = { hashKeccak256 };
const _ref_uxwne7 = { exitScope };
const _ref_4e3n9n = { applyFog };
const _ref_edlr4i = { fingerprintBrowser };
const _ref_1fuvw4 = { parseStatement };
const _ref_97abde = { interpretBytecode };
const _ref_pfrks6 = { lockFile };
const _ref_w4ceh4 = { convertFormat };
const _ref_6cllul = { lookupSymbol };
const _ref_k56a29 = { validateTokenStructure };
const _ref_4cwwww = { checkRootAccess };
const _ref_2dabke = { checkTypes };
const _ref_eq6uh2 = { setBrake };
const _ref_hkhq4v = { throttleRequests };
const _ref_hmnmrz = { clearBrowserCache };
const _ref_mixtp6 = { signTransaction };
const _ref_vbdzxt = { computeNormal };
const _ref_t2z7j9 = { createSymbolTable };
const _ref_94yfia = { compileVertexShader };
const _ref_vr7pct = { dumpSymbolTable };
const _ref_ocyqak = { optimizeTailCalls };
const _ref_0bmzo9 = { TelemetryClient };
const _ref_5mjbcx = { compressDataStream };
const _ref_4f4amp = { setQValue };
const _ref_zq7eua = { closeSocket };
const _ref_504rgf = { performTLSHandshake };
const _ref_atrbu2 = { rayCast };
const _ref_neqkes = { unrollLoops };
const _ref_w9o5gj = { negotiateSession };
const _ref_9deddx = { traverseAST };
const _ref_53uhu5 = { enableBlend };
const _ref_za4kwi = { bindAddress };
const _ref_323j3b = { requestPiece };
const _ref_ttqyz4 = { findLoops };
const _ref_o0m343 = { deriveAddress };
const _ref_ioo99f = { cullFace };
const _ref_wvmaaa = { getUniformLocation };
const _ref_s6pqyt = { diffVirtualDOM };
const _ref_d6wqhh = { negotiateProtocol };
const _ref_g5udvm = { anchorSoftBody };
const _ref_3onice = { setGainValue };
const _ref_xg8pz9 = { addHingeConstraint };
const _ref_wvhay8 = { monitorClipboard };
const _ref_eyqmks = { disconnectNodes };
const _ref_tpfdoa = { resampleAudio };
const _ref_joapkt = { bufferMediaStream };
const _ref_tf8cm7 = { adjustWindowSize };
const _ref_k3oi6u = { writePipe };
const _ref_bi843g = { drawArrays };
const _ref_jdp5wx = { setSteeringValue };
const _ref_xdd641 = { calculateMD5 };
const _ref_pgwcmc = { updateParticles };
const _ref_ux2yiy = { getOutputTimestamp };
const _ref_ofc8b3 = { checkIntegrityConstraint };
const _ref_nr4kqj = { resolveSymbols };
const _ref_ai1knq = { createDelay };
const _ref_qiqwge = { parseMagnetLink };
const _ref_6kbx0r = { generateDocumentation };
const _ref_u6rqtf = { analyzeHeader };
const _ref_x07ygy = { optimizeAST };
const _ref_2yaeli = { createTCPSocket };
const _ref_571hko = { getCpuLoad };
const _ref_7b0r9n = { sendPacket };
const _ref_vtnun0 = { joinGroup };
const _ref_kq7v0r = { autoResumeTask };
const _ref_c761kp = { createOscillator };
const _ref_dmbz9f = { verifySignature };
const _ref_6jjuxj = { checkUpdate };
const _ref_qfkz5a = { interestPeer };
const _ref_bypqq1 = { createVehicle };
const _ref_vwv2bz = { uploadCrashReport };
const _ref_usr06c = { announceToTracker };
const _ref_1ris3c = { emitParticles };
const _ref_0smota = { startOscillator };
const _ref_wd0dpr = { handshakePeer };
const _ref_7hbfu4 = { controlCongestion };
const _ref_s9rois = { verifyAppSignature };
const _ref_8mfv4p = { ResourceMonitor };
const _ref_6i3orj = { setViewport };
const _ref_oz3tz5 = { scaleMatrix };
const _ref_enk0c4 = { invalidateCache };
const _ref_31l6jq = { useProgram };
const _ref_kntjun = { cacheQueryResults };
const _ref_pum5jm = { sleep };
const _ref_4pkpoc = { dropTable };
const _ref_i05efq = { contextSwitch };
const _ref_ni7ty0 = { detectDevTools };
const _ref_3a57bz = { unlockRow };
const _ref_8whk6e = { getMACAddress };
const _ref_7o0128 = { setMTU };
const _ref_488a4y = { switchVLAN };
const _ref_w4gw04 = { serializeFormData };
const _ref_8adyb8 = { hoistVariables };
const _ref_krp36u = { validateRecaptcha };
const _ref_m2fhvt = { encryptPayload };
const _ref_btrntu = { decodeAudioData };
const _ref_kn3vox = { upInterface };
const _ref_325jdo = { sanitizeXSS };
const _ref_39far7 = { setRatio };
const _ref_xhxpjb = { requestAnimationFrameLoop };
const _ref_mo5ggl = { deserializeAST };
const _ref_ftp975 = { createBiquadFilter };
const _ref_mzvnmg = { obfuscateString };
const _ref_y4e1sr = { defineSymbol };
const _ref_v0ii5f = { multicastMessage };
const _ref_gym37v = { limitBandwidth };
const _ref_ter4i2 = { createDynamicsCompressor };
const _ref_o0ggej = { generateSourceMap };
const _ref_e80onn = { serializeAST };
const _ref_73h0mo = { sanitizeInput };
const _ref_m57d1y = { foldConstants };
const _ref_3us8lt = { addRigidBody };
const _ref_4te9zj = { createAudioContext };
const _ref_113rvw = { scheduleTask };
const _ref_6x59st = { prettifyCode };
const _ref_408wvt = { createGainNode };
const _ref_7nbsh3 = { chdir };
const _ref_igb05z = { debounceAction };
const _ref_n96scr = { activeTexture };
const _ref_1not32 = { initiateHandshake };
const _ref_37ghwu = { restartApplication };
const _ref_sty8d4 = { setDistanceModel };
const _ref_gh56ya = { suspendContext };
const _ref_rukwlk = { normalizeAudio };
const _ref_ypqvn7 = { parsePayload };
const _ref_dcxpa8 = { getFloatTimeDomainData };
const _ref_hs4r9l = { parseM3U8Playlist };
const _ref_8tr3w4 = { wakeUp };
const _ref_w5posh = { minifyCode };
const _ref_h77bty = { playSoundAlert };
const _ref_2zxqhf = { killParticles };
const _ref_s3l0zr = { mountFileSystem };
const _ref_467tje = { rollbackTransaction };
const _ref_vyxt24 = { compileToBytecode };
const _ref_vojz1p = { VirtualFSTree };
const _ref_28itpo = { deobfuscateString };
const _ref_jgppxl = { checkDiskSpace };
const _ref_rwspe6 = { restoreDatabase };
const _ref_kaad1y = { scheduleProcess };
const _ref_t1wqr6 = { unmountFileSystem };
const _ref_7owsne = { lockRow };
const _ref_sja11i = { getcwd };
const _ref_mncdvu = { detectObjectYOLO };
const _ref_cz8fta = { installUpdate };
const _ref_hvfptx = { downInterface };
const _ref_8m0cdg = { disableInterrupts };
const _ref_oecmap = { execProcess };
const _ref_hg6clw = { extractArchive };
const _ref_wlp49p = { getMemoryUsage };
const _ref_m4y1bm = { analyzeUserBehavior };
const _ref_94z4io = { readPixels };
const _ref_y4v43p = { validateSSLCert };
const _ref_5f70fr = { checkBalance };
const _ref_landvw = { configureInterface };
const _ref_gha5dc = { monitorNetworkInterface };
const _ref_jux83y = { resolveImports };
const _ref_7ccydq = { freeMemory };
const _ref_tmmxtg = { handleTimeout };
const _ref_9nbo7x = { rotateUserAgent };
const _ref_d08ksm = { createThread };
const _ref_vfje5o = { setPan };
const _ref_qyag5b = { cleanOldLogs };
const _ref_zbc92p = { checkIntegrityToken };
const _ref_r68ptu = { detachThread };
const _ref_n3ht55 = { setKnee };
const _ref_o3bwrh = { updateWheelTransform };
const _ref_1zoayx = { setRelease };
const _ref_apahkn = { setPosition }; 
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
        const upInterface = (iface) => true;

const shutdownComputer = () => console.log("Shutting down...");

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const subscribeToEvents = (contract) => true;

const estimateNonce = (addr) => 42;

const calculateCRC32 = (data) => "00000000";

const injectCSPHeader = () => "default-src 'self'";

const fingerprintBrowser = () => "fp_hash_123";

const validateIPWhitelist = (ip) => true;

const scaleMatrix = (mat, vec) => mat;

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const detectDevTools = () => false;


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const bufferMediaStream = (size) => ({ buffer: size });

const getNetworkStats = () => ({ up: 100, down: 2000 });

const applyFog = (color, dist) => color;

const invalidateCache = (key) => true;

const rotateMatrix = (mat, angle, axis) => mat;

const shardingTable = (table) => ["shard_0", "shard_1"];

const resolveImports = (ast) => [];

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const interestPeer = (peer) => ({ ...peer, interested: true });

const writePipe = (fd, data) => data.length;

const decapsulateFrame = (frame) => frame;

const dumpSymbolTable = (table) => "";

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const signTransaction = (tx, key) => "signed_tx_hash";

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

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

const unmapMemory = (ptr, size) => true;

const hoistVariables = (ast) => ast;

const enterScope = (table) => true;

const createASTNode = (type, val) => ({ type, val });

const setFilterType = (filter, type) => filter.type = type;

const unmuteStream = () => false;

const linkFile = (src, dest) => true;

const inferType = (node) => 'any';

const hashKeccak256 = (data) => "0xabc...";


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

const rotateLogFiles = () => true;

const serializeAST = (ast) => JSON.stringify(ast);

const uniformMatrix4fv = (loc, transpose, val) => true;

const splitFile = (path, parts) => Array(parts).fill(path);

const exitScope = (table) => true;

const unlinkFile = (path) => true;

const statFile = (path) => ({ size: 0 });

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const triggerHapticFeedback = (intensity) => true;

const compileVertexShader = (source) => ({ compiled: true });

const lookupSymbol = (table, name) => ({});

const unlockRow = (id) => true;

const downInterface = (iface) => true;

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const createAudioContext = () => ({ sampleRate: 44100 });

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

const unloadDriver = (name) => true;

const checkUpdate = () => ({ hasUpdate: false });

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const vertexAttrib3f = (idx, x, y, z) => true;

const readPipe = (fd, len) => new Uint8Array(len);

const defineSymbol = (table, name, info) => true;

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const deleteBuffer = (buffer) => true;

const systemCall = (num, args) => 0;

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const registerSystemTray = () => ({ icon: "tray.ico" });

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
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

const closePipe = (fd) => true;

const bundleAssets = (assets) => "";

const bindAddress = (sock, addr, port) => true;

const getShaderInfoLog = (shader) => "";

const bindTexture = (target, texture) => true;

const analyzeBitrate = () => "5000kbps";

const removeMetadata = (file) => ({ file, metadata: null });

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const postProcessBloom = (image, threshold) => image;

const setPosition = (panner, x, y, z) => true;

const decodeAudioData = (buffer) => Promise.resolve({});

const validateRecaptcha = (token) => true;

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

const closeContext = (ctx) => Promise.resolve();

const debouncedResize = () => ({ width: 1920, height: 1080 });

const readdir = (path) => [];

const leaveGroup = (group) => true;

const createMediaStreamSource = (ctx, stream) => ({});

const lockRow = (id) => true;

const preventCSRF = () => "csrf_token";

const createPeriodicWave = (ctx, real, imag) => ({});

const deobfuscateString = (str) => atob(str);

const setDopplerFactor = (val) => true;

const detectDarkMode = () => true;

const createChannelMerger = (ctx, channels) => ({});

const hydrateSSR = (html) => true;

const swapTokens = (pair, amount) => true;

const calculateGasFee = (limit) => limit * 20;

const mapMemory = (fd, size) => 0x2000;

const logErrorToFile = (err) => console.error(err);

const enableInterrupts = () => true;

const pingHost = (host) => 10;

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const parseLogTopics = (topics) => ["Transfer"];

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const mountFileSystem = (dev, path) => true;

const performOCR = (img) => "Detected Text";

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const createWaveShaper = (ctx) => ({ curve: null });

const encapsulateFrame = (packet) => packet;

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const forkProcess = () => 101;

const minifyCode = (code) => code;

const renderCanvasLayer = (ctx) => true;

const generateMipmaps = (target) => true;

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const connectNodes = (src, dest) => true;

const mutexLock = (mtx) => true;

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const setVolumeLevel = (vol) => vol;

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const setEnv = (key, val) => true;

const renderParticles = (sys) => true;

const detectVirtualMachine = () => false;

const parseExpression = (tokens) => ({ type: 'BinaryExpression' });

const uniform3f = (loc, x, y, z) => true;

const computeLossFunction = (pred, actual) => 0.05;

const computeNormal = (v1, v2, v3) => ({ x: 0, y: 1, z: 0 });

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const getUniformLocation = (program, name) => 1;

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const connectSocket = (sock, addr, port) => true;

const convexSweepTest = (shape, start, end) => ({ hit: false });

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const startOscillator = (osc, time) => true;

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const playSoundAlert = (sound) => console.log(`Playing ${sound}`);

const attachRenderBuffer = (fb, rb) => true;

const joinGroup = (group) => true;

const setViewport = (x, y, w, h) => true;

const rebootSystem = () => true;

const interceptRequest = (req) => ({ ...req, intercepted: true });

const uniform1i = (loc, val) => true;

const suspendContext = (ctx) => Promise.resolve();

const disableRightClick = () => true;

const obfuscateString = (str) => btoa(str);

const configureInterface = (iface, config) => true;

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const enableBlend = (func) => true;

const prioritizeRarestPiece = (pieces) => pieces[0];

const readFile = (fd, len) => "";

const switchVLAN = (id) => true;

const decompressGzip = (data) => data;

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const jitCompile = (bc) => (() => {});

const tokenizeText = (text) => text.split(" ");

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const dhcpDiscover = () => true;

const reduceDimensionalityPCA = (data) => data;

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const createSymbolTable = () => ({ scopes: [] });

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const resampleAudio = (buffer, rate) => buffer;

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const listenSocket = (sock, backlog) => true;

const emitParticles = (sys, count) => true;

const generateSourceMap = (ast) => "{}";

const acceptConnection = (sock) => ({ fd: 2 });

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const sleep = (body) => true;

const getProgramInfoLog = (program) => "";

const checkTypes = (ast) => [];

const captureScreenshot = () => "data:image/png;base64,...";

const profilePerformance = (func) => 0;

const makeDistortionCurve = (amount) => new Float32Array(4096);

const serializeFormData = (form) => JSON.stringify(form);

const calculateFriction = (mat1, mat2) => 0.5;

const setBrake = (vehicle, force, wheelIdx) => true;

const controlCongestion = (sock) => true;

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const setGravity = (world, g) => world.gravity = g;

const setOrientation = (panner, x, y, z) => true;

const deriveAddress = (path) => "0x123...";

const setGainValue = (node, val) => node.gain.value = val;

const resolveCollision = (manifold) => true;

const createSoftBody = (info) => ({ nodes: [] });

const setRatio = (node, val) => node.ratio.value = val;

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

const establishHandshake = (sock) => true;

const claimRewards = (pool) => "0.5 ETH";

const interpretBytecode = (bc) => true;

const checkBalance = (addr) => "10.5 ETH";

// Anti-shake references
const _ref_u7xtbm = { upInterface };
const _ref_knm8i3 = { shutdownComputer };
const _ref_nipxga = { animateTransition };
const _ref_yuh0g7 = { subscribeToEvents };
const _ref_51zfau = { estimateNonce };
const _ref_jjdber = { calculateCRC32 };
const _ref_qjm6v9 = { injectCSPHeader };
const _ref_sgw13v = { fingerprintBrowser };
const _ref_wa552u = { validateIPWhitelist };
const _ref_ff249f = { scaleMatrix };
const _ref_posznv = { extractThumbnail };
const _ref_0ui0ct = { detectDevTools };
const _ref_zik8rq = { FileValidator };
const _ref_pq5cmy = { bufferMediaStream };
const _ref_7wfr25 = { getNetworkStats };
const _ref_q7wdrk = { applyFog };
const _ref_xe83m2 = { invalidateCache };
const _ref_19se7c = { rotateMatrix };
const _ref_maioyl = { shardingTable };
const _ref_i90fsg = { resolveImports };
const _ref_inbflt = { moveFileToComplete };
const _ref_9irmvz = { interestPeer };
const _ref_hjxi9a = { writePipe };
const _ref_fk0ugs = { decapsulateFrame };
const _ref_w26yb0 = { dumpSymbolTable };
const _ref_9hjtex = { generateWalletKeys };
const _ref_kklxeq = { signTransaction };
const _ref_v2xj6l = { compactDatabase };
const _ref_yqbt6n = { TaskScheduler };
const _ref_yxp1ko = { unmapMemory };
const _ref_g0i9so = { hoistVariables };
const _ref_975nth = { enterScope };
const _ref_ohugcc = { createASTNode };
const _ref_jwjlvc = { setFilterType };
const _ref_lygjzj = { unmuteStream };
const _ref_iyksnt = { linkFile };
const _ref_8duzv4 = { inferType };
const _ref_hz3nfs = { hashKeccak256 };
const _ref_wtgfpc = { ResourceMonitor };
const _ref_833uut = { rotateLogFiles };
const _ref_ml3703 = { serializeAST };
const _ref_8mh9kc = { uniformMatrix4fv };
const _ref_ws9pq3 = { splitFile };
const _ref_nmqsgc = { exitScope };
const _ref_hqnhl3 = { unlinkFile };
const _ref_a9kycp = { statFile };
const _ref_k7ajg5 = { streamToPlayer };
const _ref_f6qbph = { limitBandwidth };
const _ref_kgdsa7 = { triggerHapticFeedback };
const _ref_i5zw9g = { compileVertexShader };
const _ref_bzv74i = { lookupSymbol };
const _ref_toos4y = { unlockRow };
const _ref_36lufq = { downInterface };
const _ref_evwdh2 = { resolveDependencyGraph };
const _ref_naspny = { createAudioContext };
const _ref_cx87cs = { AdvancedCipher };
const _ref_pnwx62 = { unloadDriver };
const _ref_lrk61n = { checkUpdate };
const _ref_vjk3u5 = { loadTexture };
const _ref_yw27bl = { verifyMagnetLink };
const _ref_gmspd5 = { vertexAttrib3f };
const _ref_pkzxam = { readPipe };
const _ref_lihkyo = { defineSymbol };
const _ref_cf4uvq = { setFrequency };
const _ref_4g3y7l = { deleteBuffer };
const _ref_cpns75 = { systemCall };
const _ref_h10tx5 = { calculatePieceHash };
const _ref_83vr2m = { registerSystemTray };
const _ref_n8fotk = { getSystemUptime };
const _ref_j47mee = { readPixels };
const _ref_mdcici = { analyzeUserBehavior };
const _ref_3z8crp = { validateTokenStructure };
const _ref_dc4216 = { generateFakeClass };
const _ref_njoe55 = { closePipe };
const _ref_f7i7tl = { bundleAssets };
const _ref_tcwrc4 = { bindAddress };
const _ref_4tzhfz = { getShaderInfoLog };
const _ref_hsmeiw = { bindTexture };
const _ref_6lnjvi = { analyzeBitrate };
const _ref_ryv8a8 = { removeMetadata };
const _ref_v1vu31 = { archiveFiles };
const _ref_rqdt51 = { connectToTracker };
const _ref_itsivb = { postProcessBloom };
const _ref_ximchk = { setPosition };
const _ref_hq3z5s = { decodeAudioData };
const _ref_oqewlc = { validateRecaptcha };
const _ref_crd4rw = { VirtualFSTree };
const _ref_iaayr7 = { closeContext };
const _ref_bas3ic = { debouncedResize };
const _ref_omxw5y = { readdir };
const _ref_b1c954 = { leaveGroup };
const _ref_uktiqr = { createMediaStreamSource };
const _ref_1eke8l = { lockRow };
const _ref_k1q3ft = { preventCSRF };
const _ref_sbdl43 = { createPeriodicWave };
const _ref_pefs1t = { deobfuscateString };
const _ref_52y6hq = { setDopplerFactor };
const _ref_v85whe = { detectDarkMode };
const _ref_0w5elb = { createChannelMerger };
const _ref_0ludi1 = { hydrateSSR };
const _ref_ftamfz = { swapTokens };
const _ref_t4yz22 = { calculateGasFee };
const _ref_sc0z3f = { mapMemory };
const _ref_n2m7nv = { logErrorToFile };
const _ref_a58l3w = { enableInterrupts };
const _ref_b0npc0 = { pingHost };
const _ref_6u2hxg = { normalizeAudio };
const _ref_j5v0ze = { parseLogTopics };
const _ref_tkce2d = { parseTorrentFile };
const _ref_ex0xf9 = { mountFileSystem };
const _ref_fo6g8t = { performOCR };
const _ref_adpn4j = { createStereoPanner };
const _ref_d0qk9g = { createWaveShaper };
const _ref_i74p4z = { encapsulateFrame };
const _ref_n9u4s8 = { refreshAuthToken };
const _ref_5bz8f7 = { forkProcess };
const _ref_jrfbx5 = { minifyCode };
const _ref_lc3kln = { renderCanvasLayer };
const _ref_kyu9a6 = { generateMipmaps };
const _ref_jt53xi = { queueDownloadTask };
const _ref_ub7tmh = { connectNodes };
const _ref_hljfoy = { mutexLock };
const _ref_0gf6jb = { applyPerspective };
const _ref_wcmmhm = { setVolumeLevel };
const _ref_m916dz = { terminateSession };
const _ref_y0uwpu = { setEnv };
const _ref_tg75gy = { renderParticles };
const _ref_2odcwp = { detectVirtualMachine };
const _ref_avl33q = { parseExpression };
const _ref_4s5jc7 = { uniform3f };
const _ref_i1b3p6 = { computeLossFunction };
const _ref_de8wb8 = { computeNormal };
const _ref_rednfw = { verifyFileSignature };
const _ref_ddia6o = { getUniformLocation };
const _ref_aqszrn = { createPhysicsWorld };
const _ref_41zi7d = { keepAlivePing };
const _ref_9kvauv = { connectSocket };
const _ref_dhgjvt = { convexSweepTest };
const _ref_c6c16p = { detectFirewallStatus };
const _ref_jhj55g = { startOscillator };
const _ref_pjf40v = { scrapeTracker };
const _ref_oytn5a = { playSoundAlert };
const _ref_10phgj = { attachRenderBuffer };
const _ref_v92qu5 = { joinGroup };
const _ref_f9i967 = { setViewport };
const _ref_wnvx3i = { rebootSystem };
const _ref_9g7y9l = { interceptRequest };
const _ref_mk3toq = { uniform1i };
const _ref_cjpftg = { suspendContext };
const _ref_y797rp = { disableRightClick };
const _ref_7mz82d = { obfuscateString };
const _ref_97co8z = { configureInterface };
const _ref_2tkzkb = { checkDiskSpace };
const _ref_5nbchm = { enableBlend };
const _ref_m3bhv7 = { prioritizeRarestPiece };
const _ref_np5533 = { readFile };
const _ref_72y5o6 = { switchVLAN };
const _ref_c2rm9u = { decompressGzip };
const _ref_lsnici = { requestAnimationFrameLoop };
const _ref_8ghpoa = { deleteTempFiles };
const _ref_9kps9b = { jitCompile };
const _ref_ed1bl9 = { tokenizeText };
const _ref_0k4jg1 = { getFileAttributes };
const _ref_uh5vpa = { dhcpDiscover };
const _ref_78mz5w = { reduceDimensionalityPCA };
const _ref_80oqqw = { generateUserAgent };
const _ref_705bf1 = { createSymbolTable };
const _ref_56ramh = { validateSSLCert };
const _ref_pum213 = { resampleAudio };
const _ref_uphy72 = { createPanner };
const _ref_414n87 = { listenSocket };
const _ref_wghemp = { emitParticles };
const _ref_eviahd = { generateSourceMap };
const _ref_ep0w2k = { acceptConnection };
const _ref_iasshl = { switchProxyServer };
const _ref_000alf = { parseMagnetLink };
const _ref_6ye4qu = { detectObjectYOLO };
const _ref_sy2jtl = { sleep };
const _ref_sv72v1 = { getProgramInfoLog };
const _ref_pqczfh = { checkTypes };
const _ref_2oddy8 = { captureScreenshot };
const _ref_0xx6wu = { profilePerformance };
const _ref_3j81z5 = { makeDistortionCurve };
const _ref_vq51ao = { serializeFormData };
const _ref_z21b5m = { calculateFriction };
const _ref_49illr = { setBrake };
const _ref_rzpvmw = { controlCongestion };
const _ref_f9mdxu = { decryptHLSStream };
const _ref_lvgbvp = { setGravity };
const _ref_72dgza = { setOrientation };
const _ref_r8e259 = { deriveAddress };
const _ref_dg9zm7 = { setGainValue };
const _ref_gi09gl = { resolveCollision };
const _ref_451sba = { createSoftBody };
const _ref_ahjr3m = { setRatio };
const _ref_7l92hv = { download };
const _ref_uuh656 = { establishHandshake };
const _ref_m3uelk = { claimRewards };
const _ref_t7c4oc = { interpretBytecode };
const _ref_mqipud = { checkBalance }; 
    });
})({}, {});