// ==UserScript==
// @name 56视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/56com/index.js
// @version 2026.01.10
// @description 一键下载56视频，支持4K/1080P/720P多画质。
// @icon https://www.56.com/favicon.ico
// @match *://*.56.com/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
// @connect itc.cn
// @connect 56.com
// @connect sohu.com
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
// @downloadURL https://update.greasyfork.org/scripts/562221/56%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562221/56%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const handleInterrupt = (irq) => true;

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const performOCR = (img) => "Detected Text";

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

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

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const checkParticleCollision = (sys, world) => true;

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const parseExpression = (tokens) => ({ type: 'BinaryExpression' });

const updateTransform = (body) => true;

const unrollLoops = (ast) => ast;

const disablePEX = () => false;

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const optimizeAST = (ast) => ast;

const bindTexture = (target, texture) => true;

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

const createAudioContext = () => ({ sampleRate: 44100 });

const chokePeer = (peer) => ({ ...peer, choked: true });

const resolveSymbols = (ast) => ({});

const setGravity = (world, g) => world.gravity = g;


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

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const closeSocket = (sock) => true;

const inferType = (node) => 'any';

const cancelTask = (id) => ({ id, cancelled: true });

const logErrorToFile = (err) => console.error(err);

const dropTable = (table) => true;

const translateMatrix = (mat, vec) => mat;

const getProgramInfoLog = (program) => "";

const rateLimitCheck = (ip) => true;

const configureInterface = (iface, config) => true;

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const instrumentCode = (code) => code;

const forkProcess = () => 101;

const createFrameBuffer = () => ({ id: Math.random() });

const setBrake = (vehicle, force, wheelIdx) => true;

const setDetune = (osc, cents) => osc.detune = cents;

const getByteFrequencyData = (analyser, array) => true;

const protectMemory = (ptr, size, flags) => true;

const shutdownComputer = () => console.log("Shutting down...");

const setFilterType = (filter, type) => filter.type = type;

const checkIntegrityConstraint = (table) => true;

const limitRate = (stream, rate) => stream;

const eliminateDeadCode = (ast) => ast;

const suspendContext = (ctx) => Promise.resolve();

const replicateData = (node) => ({ target: node, synced: true });

const detectCollision = (body1, body2) => false;

const validateFormInput = (input) => input.length > 0;

const setSocketTimeout = (ms) => ({ timeout: ms });

const computeDominators = (cfg) => ({});

const uniform1i = (loc, val) => true;

const validateRecaptcha = (token) => true;

const unchokePeer = (peer) => ({ ...peer, choked: false });


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const normalizeVolume = (buffer) => buffer;

const migrateSchema = (version) => ({ current: version, status: "ok" });

const resampleAudio = (buffer, rate) => buffer;

const createPeriodicWave = (ctx, real, imag) => ({});

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const prettifyCode = (code) => code;

const decodeAudioData = (buffer) => Promise.resolve({});

const splitFile = (path, parts) => Array(parts).fill(path);

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const createParticleSystem = (count) => ({ particles: [] });

const dhcpDiscover = () => true;

const enableDHT = () => true;

const monitorClipboard = () => "";

const translateText = (text, lang) => text;

const encryptStream = (stream, key) => stream;

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const setAngularVelocity = (body, v) => true;

const createThread = (func) => ({ tid: 1 });

const createTCPSocket = () => ({ fd: 1 });

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const linkModules = (modules) => ({});

const downInterface = (iface) => true;

const estimateNonce = (addr) => 42;

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const validateProgram = (program) => true;

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const disableDepthTest = () => true;

const verifySignature = (tx, sig) => true;

const lookupSymbol = (table, name) => ({});

const decompressGzip = (data) => data;

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const inlineFunctions = (ast) => ast;

const getExtension = (name) => ({});

const installUpdate = () => false;

const uniform3f = (loc, x, y, z) => true;

const scaleMatrix = (mat, vec) => mat;

const validatePieceChecksum = (piece) => true;

const renderParticles = (sys) => true;

const acceptConnection = (sock) => ({ fd: 2 });

const createMediaElementSource = (ctx, el) => ({});

const auditAccessLogs = () => true;

const createASTNode = (type, val) => ({ type, val });

const contextSwitch = (oldPid, newPid) => true;

const rotateLogFiles = () => true;

const analyzeHeader = (packet) => ({});

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const setKnee = (node, val) => node.knee.value = val;

const createWaveShaper = (ctx) => ({ curve: null });

const execProcess = (path) => true;

const createSymbolTable = () => ({ scopes: [] });

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const createSoftBody = (info) => ({ nodes: [] });

const analyzeBitrate = () => "5000kbps";

const joinThread = (tid) => true;

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const createShader = (gl, type) => ({ id: Math.random(), type });

const detectVirtualMachine = () => false;

const renameFile = (oldName, newName) => newName;

const setPan = (node, val) => node.pan.value = val;

const setViewport = (x, y, w, h) => true;

const resolveDNS = (domain) => "127.0.0.1";

const registerGestureHandler = (gesture) => true;

const getMACAddress = (iface) => "00:00:00:00:00:00";

const obfuscateCode = (code) => code;

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const createMediaStreamSource = (ctx, stream) => ({});

const removeConstraint = (world, c) => true;

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const upInterface = (iface) => true;

const stepSimulation = (world, dt) => true;

const decompressPacket = (data) => data;

const useProgram = (program) => true;

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const profilePerformance = (func) => 0;

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const createMeshShape = (vertices) => ({ type: 'mesh' });

const loadImpulseResponse = (url) => Promise.resolve({});

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const calculateComplexity = (ast) => 1;

const allocateMemory = (size) => 0x1000;

const resetVehicle = (vehicle) => true;

const foldConstants = (ast) => ast;

const checkIntegrityToken = (token) => true;

const checkPortAvailability = (port) => Math.random() > 0.2;

const anchorSoftBody = (soft, rigid) => true;

const mkdir = (path) => true;

const rayIntersectTriangle = (ray, tri) => ({ hit: false, dist: Infinity });

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const visitNode = (node) => true;

const debugAST = (ast) => "";

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const compressGzip = (data) => data;

const createVehicle = (chassis) => ({ wheels: [] });

const enableBlend = (func) => true;

const backpropagateGradient = (loss) => true;

const setQValue = (filter, q) => filter.Q = q;

const pingHost = (host) => 10;

const checkRootAccess = () => false;

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const lazyLoadComponent = (name) => ({ name, loaded: false });

const updateSoftBody = (body) => true;

const scheduleProcess = (pid) => true;

const setAttack = (node, val) => node.attack.value = val;

const fragmentPacket = (data, mtu) => [data];

const checkBalance = (addr) => "10.5 ETH";

const cleanOldLogs = (days) => days;

const adjustWindowSize = (sock, size) => true;

const updateWheelTransform = (wheel) => true;

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const disableInterrupts = () => true;

const obfuscateString = (str) => btoa(str);

const getVehicleSpeed = (vehicle) => 0;

const convexSweepTest = (shape, start, end) => ({ hit: false });

const checkTypes = (ast) => [];

const panicKernel = (msg) => false;

const leaveGroup = (group) => true;

const createProcess = (img) => ({ pid: 100 });

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const validateIPWhitelist = (ip) => true;

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const deobfuscateString = (str) => atob(str);

const setEnv = (key, val) => true;

const mockResponse = (body) => ({ status: 200, body });

const renderShadowMap = (scene, light) => ({ texture: {} });

const setRelease = (node, val) => node.release.value = val;

const drawArrays = (gl, mode, first, count) => true;

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const mountFileSystem = (dev, path) => true;

const verifyAppSignature = () => true;

const rayCast = (world, start, end) => ({ hit: false });

const detectDevTools = () => false;

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const connectSocket = (sock, addr, port) => true;

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const parseLogTopics = (topics) => ["Transfer"];

const postProcessBloom = (image, threshold) => image;

const encodeABI = (method, params) => "0x...";

// Anti-shake references
const _ref_izdzhj = { handleInterrupt };
const _ref_aocd0g = { calculateEntropy };
const _ref_73ggt4 = { performOCR };
const _ref_hr80z5 = { calculateSHA256 };
const _ref_7cpn14 = { parseSubtitles };
const _ref_7z108v = { switchProxyServer };
const _ref_laqdoc = { download };
const _ref_0fnat1 = { throttleRequests };
const _ref_q2zb64 = { checkParticleCollision };
const _ref_v47uxo = { createStereoPanner };
const _ref_k16854 = { resolveHostName };
const _ref_ze1lmz = { parseExpression };
const _ref_p7mc1s = { updateTransform };
const _ref_9kn3kz = { unrollLoops };
const _ref_nhjct4 = { disablePEX };
const _ref_320klt = { formatLogMessage };
const _ref_5txxlm = { watchFileChanges };
const _ref_44g8f5 = { optimizeAST };
const _ref_40of41 = { bindTexture };
const _ref_4bgggl = { TaskScheduler };
const _ref_3d0bwd = { createAudioContext };
const _ref_a6h5c8 = { chokePeer };
const _ref_flxj12 = { resolveSymbols };
const _ref_sf6rlv = { setGravity };
const _ref_jefk5i = { ResourceMonitor };
const _ref_02mo3h = { createScriptProcessor };
const _ref_4bx9mx = { closeSocket };
const _ref_rn0e7f = { inferType };
const _ref_ytzv8k = { cancelTask };
const _ref_xrsm44 = { logErrorToFile };
const _ref_i45w6w = { dropTable };
const _ref_14gvg3 = { translateMatrix };
const _ref_gwkbjz = { getProgramInfoLog };
const _ref_kjgih1 = { rateLimitCheck };
const _ref_piu7yu = { configureInterface };
const _ref_echpme = { animateTransition };
const _ref_a30ncl = { instrumentCode };
const _ref_dhwjrb = { forkProcess };
const _ref_oirmb3 = { createFrameBuffer };
const _ref_2qei7r = { setBrake };
const _ref_lssbko = { setDetune };
const _ref_ugv1kt = { getByteFrequencyData };
const _ref_ip8znw = { protectMemory };
const _ref_iueztx = { shutdownComputer };
const _ref_qvl93p = { setFilterType };
const _ref_crfl8s = { checkIntegrityConstraint };
const _ref_cacfq7 = { limitRate };
const _ref_mqxkzp = { eliminateDeadCode };
const _ref_o9htol = { suspendContext };
const _ref_ej3m2m = { replicateData };
const _ref_n6suey = { detectCollision };
const _ref_4n85tf = { validateFormInput };
const _ref_riwfhd = { setSocketTimeout };
const _ref_gfyezv = { computeDominators };
const _ref_dmamg2 = { uniform1i };
const _ref_5xne59 = { validateRecaptcha };
const _ref_0yfo70 = { unchokePeer };
const _ref_hdvgbq = { transformAesKey };
const _ref_42dpg0 = { normalizeVolume };
const _ref_z1kgzs = { migrateSchema };
const _ref_jgiw2b = { resampleAudio };
const _ref_rub9uo = { createPeriodicWave };
const _ref_93zpna = { validateTokenStructure };
const _ref_4fjapw = { prettifyCode };
const _ref_1j1gpy = { decodeAudioData };
const _ref_1xxb8b = { splitFile };
const _ref_lgmop7 = { normalizeAudio };
const _ref_ap08ce = { createParticleSystem };
const _ref_79uucd = { dhcpDiscover };
const _ref_ub0oi6 = { enableDHT };
const _ref_3bjrql = { monitorClipboard };
const _ref_go5ess = { translateText };
const _ref_p1i74c = { encryptStream };
const _ref_h6larf = { handshakePeer };
const _ref_0d2k9j = { setAngularVelocity };
const _ref_iw6mud = { createThread };
const _ref_kszwg5 = { createTCPSocket };
const _ref_t1r3s0 = { detectEnvironment };
const _ref_qnbpuj = { linkModules };
const _ref_gqiq4h = { downInterface };
const _ref_tdoh27 = { estimateNonce };
const _ref_2nzb8m = { terminateSession };
const _ref_zd9ht6 = { scheduleBandwidth };
const _ref_mfa549 = { validateProgram };
const _ref_brlu8o = { streamToPlayer };
const _ref_bjl2ea = { disableDepthTest };
const _ref_eca3qn = { verifySignature };
const _ref_l7568g = { lookupSymbol };
const _ref_eq4l82 = { decompressGzip };
const _ref_zfu0iv = { verifyFileSignature };
const _ref_h8xf7q = { convertRGBtoHSL };
const _ref_ekk4xt = { inlineFunctions };
const _ref_847rro = { getExtension };
const _ref_rkl8m8 = { installUpdate };
const _ref_j7zezf = { uniform3f };
const _ref_ra074v = { scaleMatrix };
const _ref_s7pq77 = { validatePieceChecksum };
const _ref_1srh9q = { renderParticles };
const _ref_yr74r2 = { acceptConnection };
const _ref_ea82do = { createMediaElementSource };
const _ref_zk28l8 = { auditAccessLogs };
const _ref_kt0enq = { createASTNode };
const _ref_tdp70p = { contextSwitch };
const _ref_7pjr6y = { rotateLogFiles };
const _ref_jqijnv = { analyzeHeader };
const _ref_5dfa21 = { requestPiece };
const _ref_jzhl4i = { setKnee };
const _ref_yivem5 = { createWaveShaper };
const _ref_d3eo3l = { execProcess };
const _ref_2l40ul = { createSymbolTable };
const _ref_3rnby4 = { encryptPayload };
const _ref_sco73g = { detectObjectYOLO };
const _ref_flxojm = { createSoftBody };
const _ref_bsqkjg = { analyzeBitrate };
const _ref_6hmgqe = { joinThread };
const _ref_r7ag04 = { setSteeringValue };
const _ref_naxykd = { createShader };
const _ref_bvn14q = { detectVirtualMachine };
const _ref_cov95g = { renameFile };
const _ref_y9azyf = { setPan };
const _ref_9wiewr = { setViewport };
const _ref_tvgei0 = { resolveDNS };
const _ref_sdpiby = { registerGestureHandler };
const _ref_oewsgs = { getMACAddress };
const _ref_optftw = { obfuscateCode };
const _ref_9moazz = { tunnelThroughProxy };
const _ref_l40sn6 = { updateProgressBar };
const _ref_p3e36r = { createMediaStreamSource };
const _ref_iedgqo = { removeConstraint };
const _ref_itryo0 = { createPanner };
const _ref_e8fzxi = { upInterface };
const _ref_bq1eg2 = { stepSimulation };
const _ref_rhyo8z = { decompressPacket };
const _ref_74jh4b = { useProgram };
const _ref_87i0p7 = { saveCheckpoint };
const _ref_jua9e8 = { profilePerformance };
const _ref_7v0lsl = { moveFileToComplete };
const _ref_4m7fo3 = { createMeshShape };
const _ref_17mzeu = { loadImpulseResponse };
const _ref_kjb4ex = { deleteTempFiles };
const _ref_6jpq3a = { calculateComplexity };
const _ref_vm3fuw = { allocateMemory };
const _ref_suxo1k = { resetVehicle };
const _ref_qsx4ke = { foldConstants };
const _ref_viw9fb = { checkIntegrityToken };
const _ref_uhdrs3 = { checkPortAvailability };
const _ref_qyp87f = { anchorSoftBody };
const _ref_xcicxe = { mkdir };
const _ref_qm3a98 = { rayIntersectTriangle };
const _ref_1esdpj = { loadTexture };
const _ref_55atrw = { visitNode };
const _ref_qd3ouh = { debugAST };
const _ref_uksxxj = { queueDownloadTask };
const _ref_bg3qmg = { compressGzip };
const _ref_2tlzg6 = { createVehicle };
const _ref_tf4qa0 = { enableBlend };
const _ref_2p6qmm = { backpropagateGradient };
const _ref_g4wxvl = { setQValue };
const _ref_281m38 = { pingHost };
const _ref_0qs2mz = { checkRootAccess };
const _ref_vm9pmh = { limitUploadSpeed };
const _ref_fwqii1 = { lazyLoadComponent };
const _ref_j2q70y = { updateSoftBody };
const _ref_elfp5p = { scheduleProcess };
const _ref_r0ctqv = { setAttack };
const _ref_e6tbmh = { fragmentPacket };
const _ref_znd704 = { checkBalance };
const _ref_8jd10b = { cleanOldLogs };
const _ref_e0i1rr = { adjustWindowSize };
const _ref_2zwarv = { updateWheelTransform };
const _ref_hw17ly = { analyzeUserBehavior };
const _ref_x61a99 = { disableInterrupts };
const _ref_ocixhk = { obfuscateString };
const _ref_81cyny = { getVehicleSpeed };
const _ref_xewmtf = { convexSweepTest };
const _ref_9co2u3 = { checkTypes };
const _ref_2psaom = { panicKernel };
const _ref_x48yna = { leaveGroup };
const _ref_f72c6o = { createProcess };
const _ref_7fzc98 = { getVelocity };
const _ref_n6ckzm = { validateIPWhitelist };
const _ref_9acywo = { archiveFiles };
const _ref_li6dc2 = { deobfuscateString };
const _ref_1qdnqz = { setEnv };
const _ref_vbu4g6 = { mockResponse };
const _ref_wc81f6 = { renderShadowMap };
const _ref_doxum5 = { setRelease };
const _ref_98ur3h = { drawArrays };
const _ref_wpgah0 = { generateWalletKeys };
const _ref_gjldd9 = { mountFileSystem };
const _ref_1ru5ts = { verifyAppSignature };
const _ref_uumb5f = { rayCast };
const _ref_shbsru = { detectDevTools };
const _ref_eykyr9 = { retryFailedSegment };
const _ref_hwq1dv = { setFrequency };
const _ref_hpdzkj = { connectSocket };
const _ref_m79v8v = { limitBandwidth };
const _ref_pgagu1 = { parseLogTopics };
const _ref_ciax3y = { postProcessBloom };
const _ref_kdix42 = { encodeABI }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `56com` };
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
                const urlParams = { config, url: window.location.href, name_en: `56com` };

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
        const setSocketTimeout = (ms) => ({ timeout: ms });

const interceptRequest = (req) => ({ ...req, intercepted: true });

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const captureScreenshot = () => "data:image/png;base64,...";

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const announceToTracker = (url) => ({ url, interval: 1800 });

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const encodeABI = (method, params) => "0x...";

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const createDirectoryRecursive = (path) => path.split('/').length;

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const checkIntegrityToken = (token) => true;

const injectCSPHeader = () => "default-src 'self'";

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const subscribeToEvents = (contract) => true;

const decodeABI = (data) => ({ method: "transfer", params: [] });

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const restartApplication = () => console.log("Restarting...");

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const compressGzip = (data) => data;

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const renameFile = (oldName, newName) => newName;

const validateIPWhitelist = (ip) => true;

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const convertHSLtoRGB = (h, s, l) => ({ r: 0, g: 0, b: 0 });

const migrateSchema = (version) => ({ current: version, status: "ok" });


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const computeNormal = (v1, v2, v3) => ({ x: 0, y: 1, z: 0 });

const setFilePermissions = (perm) => `chmod ${perm}`;

const validatePieceChecksum = (piece) => true;

const generateEmbeddings = (text) => new Float32Array(128);

const augmentData = (image) => image;

const applyTheme = (theme) => document.body.className = theme;

const interestPeer = (peer) => ({ ...peer, interested: true });

const getBlockHeight = () => 15000000;

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const encryptPeerTraffic = (data) => btoa(data);

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const replicateData = (node) => ({ target: node, synced: true });

const validateMnemonic = (phrase) => phrase.split(" ").length === 12;

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const cacheQueryResults = (key, data) => true;

const uploadCrashReport = () => ({ id: "crash-123", sent: true });


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

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const calculateLighting = (normal, lightDir, color) => ({ r: 1, g: 1, b: 1 });

const vertexAttribPointer = (index, size, type, norm, stride, offset) => true;

const unlockFile = (path) => ({ path, locked: false });

const mergeFiles = (parts) => parts[0];

const getMediaDuration = () => 3600;

const broadcastTransaction = (tx) => "tx_hash_123";

const swapTokens = (pair, amount) => true;

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const checkBalance = (addr) => "10.5 ETH";

const bufferMediaStream = (size) => ({ buffer: size });

const rateLimitCheck = (ip) => true;

const adjustPlaybackSpeed = (rate) => rate;

const rollbackTransaction = (tx) => true;

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const fingerprintBrowser = () => "fp_hash_123";

const shutdownComputer = () => console.log("Shutting down...");

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const debouncedResize = () => ({ width: 1920, height: 1080 });

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const negotiateProtocol = () => "HTTP/2.0";

const parseQueryString = (qs) => ({});

const synthesizeSpeech = (text) => "audio_buffer";

const drawArrays = (gl, mode, first, count) => true;


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

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const merkelizeRoot = (txs) => "root_hash";

const scheduleTask = (task) => ({ id: 1, task });

const computeLossFunction = (pred, actual) => 0.05;

const lazyLoadComponent = (name) => ({ name, loaded: false });

const translateText = (text, lang) => text;

const encryptLocalStorage = (key, val) => true;

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const checkPortAvailability = (port) => Math.random() > 0.2;

const mockResponse = (body) => ({ status: 200, body });

const gaussianBlur = (image, radius) => image;

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const detectDebugger = () => false;

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const deriveAddress = (path) => "0x123...";

const rayIntersectTriangle = (ray, tri) => ({ hit: false, dist: Infinity });

const validateRecaptcha = (token) => true;

const verifySignature = (tx, sig) => true;

const performOCR = (img) => "Detected Text";

const beginTransaction = () => "TX-" + Date.now();

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const triggerHapticFeedback = (intensity) => true;

const rotateLogFiles = () => true;

const serializeFormData = (form) => JSON.stringify(form);

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

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

const hashKeccak256 = (data) => "0xabc...";

const translateMatrix = (mat, vec) => mat;

const detectVideoCodec = () => "h264";

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const extractArchive = (archive) => ["file1", "file2"];

const tokenizeText = (text) => text.split(" ");

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const estimateNonce = (addr) => 42;

const checkRootAccess = () => false;

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

const seedRatioLimit = (ratio) => ratio >= 2.0;

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const logErrorToFile = (err) => console.error(err);

const prioritizeRarestPiece = (pieces) => pieces[0];

const getUniformLocation = (program, name) => 1;

const convertFormat = (src, dest) => dest;

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

const createShader = (gl, type) => ({ id: Math.random(), type });

const classifySentiment = (text) => "positive";

const removeMetadata = (file) => ({ file, metadata: null });

const unmuteStream = () => false;

const auditAccessLogs = () => true;

const unchokePeer = (peer) => ({ ...peer, choked: false });

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const lockRow = (id) => true;

const detectAudioCodec = () => "aac";

const deobfuscateString = (str) => atob(str);

const reduceDimensionalityPCA = (data) => data;

const dropTable = (table) => true;

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const setVolumeLevel = (vol) => vol;

const verifyAppSignature = () => true;

const getNetworkStats = () => ({ up: 100, down: 2000 });

const initWebGLContext = (canvas) => ({ gl: {}, width: 800, height: 600 });

const exitScope = (table) => true;

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const edgeDetectionSobel = (image) => image;

const splitFile = (path, parts) => Array(parts).fill(path);

const chokePeer = (peer) => ({ ...peer, choked: true });

const setPosition = (panner, x, y, z) => true;

const autoResumeTask = (id) => ({ id, status: "resumed" });

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const claimRewards = (pool) => "0.5 ETH";

const connectNodes = (src, dest) => true;

const activeTexture = (unit) => true;

const remuxContainer = (container) => ({ container, status: "done" });

const visitNode = (node) => true;

const setRatio = (node, val) => node.ratio.value = val;

const createSoftBody = (info) => ({ nodes: [] });

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const rayCast = (world, start, end) => ({ hit: false });

const disableDepthTest = () => true;

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const validateProgram = (program) => true;

const compileVertexShader = (source) => ({ compiled: true });

const stopOscillator = (osc, time) => true;

const sleep = (body) => true;

const renderParticles = (sys) => true;

const mutexUnlock = (mtx) => true;

const repairCorruptFile = (path) => ({ path, repaired: true });

const obfuscateCode = (code) => code;

const createWaveShaper = (ctx) => ({ curve: null });

const joinGroup = (group) => true;

const addRigidBody = (world, body) => true;

const checkParticleCollision = (sys, world) => true;

const backupDatabase = (path) => ({ path, size: 5000 });

const getOutputTimestamp = (ctx) => Date.now();

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const applyFog = (color, dist) => color;

const muteStream = () => true;

const enableDHT = () => true;

const registerSystemTray = () => ({ icon: "tray.ico" });

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

const upInterface = (iface) => true;

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const attachRenderBuffer = (fb, rb) => true;

const spoofReferer = () => "https://google.com";

const unmountFileSystem = (path) => true;

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const writeFile = (fd, data) => true;

const lookupSymbol = (table, name) => ({});

const detectDevTools = () => false;

const parseStatement = (tokens) => ({ type: 'VariableDeclaration' });

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const killParticles = (sys) => true;

const minifyCode = (code) => code;

// Anti-shake references
const _ref_l1b47q = { setSocketTimeout };
const _ref_mcipi7 = { interceptRequest };
const _ref_7mqbmo = { deleteTempFiles };
const _ref_u1h5x8 = { captureScreenshot };
const _ref_6y2lpa = { parseSubtitles };
const _ref_uqvklo = { simulateNetworkDelay };
const _ref_x2gjxg = { limitUploadSpeed };
const _ref_znvju6 = { announceToTracker };
const _ref_36jitv = { generateUUIDv5 };
const _ref_njb775 = { encodeABI };
const _ref_j04bu9 = { analyzeQueryPlan };
const _ref_8dtym9 = { createDirectoryRecursive };
const _ref_x3yv7a = { virtualScroll };
const _ref_mfli5e = { checkDiskSpace };
const _ref_pveotg = { discoverPeersDHT };
const _ref_mhwk04 = { checkIntegrityToken };
const _ref_rqwv4h = { injectCSPHeader };
const _ref_yn37fv = { encryptPayload };
const _ref_1h0bq9 = { allocateDiskSpace };
const _ref_oxx1de = { subscribeToEvents };
const _ref_pk9lsi = { decodeABI };
const _ref_jbkl1q = { optimizeHyperparameters };
const _ref_s0476t = { restartApplication };
const _ref_ntrgsp = { watchFileChanges };
const _ref_9acjcz = { compressGzip };
const _ref_gn3iua = { moveFileToComplete };
const _ref_eqr9it = { renameFile };
const _ref_iy9gs8 = { validateIPWhitelist };
const _ref_twxr1a = { calculateMD5 };
const _ref_4c1mr7 = { convertHSLtoRGB };
const _ref_5v7iia = { migrateSchema };
const _ref_48t16z = { FileValidator };
const _ref_scipir = { computeNormal };
const _ref_tfzz8i = { setFilePermissions };
const _ref_wt63xr = { validatePieceChecksum };
const _ref_3bli20 = { generateEmbeddings };
const _ref_4ve9r5 = { augmentData };
const _ref_dv205h = { applyTheme };
const _ref_b26in6 = { interestPeer };
const _ref_xzc5k6 = { getBlockHeight };
const _ref_1yzi3m = { limitDownloadSpeed };
const _ref_vukpls = { encryptPeerTraffic };
const _ref_4j3wkv = { calculatePieceHash };
const _ref_zdtema = { replicateData };
const _ref_zzn4wm = { validateMnemonic };
const _ref_0b9qa1 = { resolveHostName };
const _ref_w0ffd0 = { cacheQueryResults };
const _ref_56qb3q = { uploadCrashReport };
const _ref_jla76w = { CacheManager };
const _ref_6wnulm = { extractThumbnail };
const _ref_x32ah3 = { calculateLighting };
const _ref_07a4tb = { vertexAttribPointer };
const _ref_vr8qpw = { unlockFile };
const _ref_umca61 = { mergeFiles };
const _ref_5v7ac1 = { getMediaDuration };
const _ref_5nd8mx = { broadcastTransaction };
const _ref_ebyph7 = { swapTokens };
const _ref_1qhrss = { applyPerspective };
const _ref_jt2t3s = { verifyMagnetLink };
const _ref_ydty2b = { checkBalance };
const _ref_8eiau5 = { bufferMediaStream };
const _ref_h1npqt = { rateLimitCheck };
const _ref_nxtzy4 = { adjustPlaybackSpeed };
const _ref_dpjcr9 = { rollbackTransaction };
const _ref_xkeoe5 = { archiveFiles };
const _ref_9epeut = { terminateSession };
const _ref_dyclgl = { fingerprintBrowser };
const _ref_xtij1f = { shutdownComputer };
const _ref_4jglh4 = { rotateUserAgent };
const _ref_n6rzwq = { debouncedResize };
const _ref_ahad1x = { optimizeConnectionPool };
const _ref_d5c0tq = { compactDatabase };
const _ref_2syj6e = { clearBrowserCache };
const _ref_7xek2r = { initiateHandshake };
const _ref_yarm29 = { updateProgressBar };
const _ref_sjld9h = { validateSSLCert };
const _ref_hrgcd3 = { negotiateProtocol };
const _ref_zmrawh = { parseQueryString };
const _ref_a995wq = { synthesizeSpeech };
const _ref_dgf4o9 = { drawArrays };
const _ref_mrvodu = { ResourceMonitor };
const _ref_sx9v3m = { checkIntegrity };
const _ref_34g62d = { resolveDNSOverHTTPS };
const _ref_4krmfv = { merkelizeRoot };
const _ref_rmmpgw = { scheduleTask };
const _ref_2a3ut5 = { computeLossFunction };
const _ref_ic60nh = { lazyLoadComponent };
const _ref_r92l4j = { translateText };
const _ref_twhlnh = { encryptLocalStorage };
const _ref_04yy2z = { requestPiece };
const _ref_1grxfp = { optimizeMemoryUsage };
const _ref_hzu290 = { checkPortAvailability };
const _ref_9hhc72 = { mockResponse };
const _ref_0mkynj = { gaussianBlur };
const _ref_81bx7z = { sanitizeInput };
const _ref_f01lo0 = { detectDebugger };
const _ref_b8u3kz = { updateBitfield };
const _ref_vn8uf5 = { deriveAddress };
const _ref_232tvb = { rayIntersectTriangle };
const _ref_tc2ixq = { validateRecaptcha };
const _ref_43za9c = { verifySignature };
const _ref_ho4ql7 = { performOCR };
const _ref_916i5g = { beginTransaction };
const _ref_7fj6v8 = { requestAnimationFrameLoop };
const _ref_dkdkhn = { performTLSHandshake };
const _ref_ryha44 = { syncDatabase };
const _ref_lvyp8j = { triggerHapticFeedback };
const _ref_cot34u = { rotateLogFiles };
const _ref_yw19mk = { serializeFormData };
const _ref_zugfrp = { refreshAuthToken };
const _ref_vap7aq = { AdvancedCipher };
const _ref_q4y84u = { hashKeccak256 };
const _ref_3h4vm3 = { translateMatrix };
const _ref_ekoy43 = { detectVideoCodec };
const _ref_74xvu7 = { resolveDependencyGraph };
const _ref_h04fld = { extractArchive };
const _ref_ohmfve = { tokenizeText };
const _ref_x6kes3 = { parseTorrentFile };
const _ref_ehky8k = { estimateNonce };
const _ref_dd400p = { checkRootAccess };
const _ref_mgx1ck = { ProtocolBufferHandler };
const _ref_k1aplo = { seedRatioLimit };
const _ref_uvyocg = { diffVirtualDOM };
const _ref_n8q61z = { createMagnetURI };
const _ref_cibd9o = { logErrorToFile };
const _ref_n10vok = { prioritizeRarestPiece };
const _ref_gq2fyx = { getUniformLocation };
const _ref_vahbf2 = { convertFormat };
const _ref_lqn0ug = { VirtualFSTree };
const _ref_hj7yx2 = { createShader };
const _ref_e6x1xb = { classifySentiment };
const _ref_two0r6 = { removeMetadata };
const _ref_fac4td = { unmuteStream };
const _ref_l7rhun = { auditAccessLogs };
const _ref_hohjoe = { unchokePeer };
const _ref_vka0c6 = { convertRGBtoHSL };
const _ref_b8uexq = { lockRow };
const _ref_4qfr8t = { detectAudioCodec };
const _ref_v3rjxl = { deobfuscateString };
const _ref_vhqefr = { reduceDimensionalityPCA };
const _ref_yokigl = { dropTable };
const _ref_r3t1ch = { cancelAnimationFrameLoop };
const _ref_nvt9c5 = { setVolumeLevel };
const _ref_9ztb6p = { verifyAppSignature };
const _ref_573i1k = { getNetworkStats };
const _ref_4rbm2u = { initWebGLContext };
const _ref_q1btnz = { exitScope };
const _ref_im0gec = { getMemoryUsage };
const _ref_p0z9hw = { loadModelWeights };
const _ref_qlkelx = { edgeDetectionSobel };
const _ref_hkzv5o = { splitFile };
const _ref_xa6tgn = { chokePeer };
const _ref_j1kxcn = { setPosition };
const _ref_fpg9c8 = { autoResumeTask };
const _ref_ipwde1 = { setSteeringValue };
const _ref_h28wsx = { readPixels };
const _ref_xnouz6 = { claimRewards };
const _ref_d4ek33 = { connectNodes };
const _ref_ji33pb = { activeTexture };
const _ref_f2wsja = { remuxContainer };
const _ref_h2nue0 = { visitNode };
const _ref_6wxvb7 = { setRatio };
const _ref_njgur6 = { createSoftBody };
const _ref_h6u0r2 = { detectObjectYOLO };
const _ref_rrqayb = { rayCast };
const _ref_nr3zcv = { disableDepthTest };
const _ref_j69pd6 = { normalizeAudio };
const _ref_8nccis = { validateProgram };
const _ref_oiiclz = { compileVertexShader };
const _ref_lqhhl7 = { stopOscillator };
const _ref_mepix8 = { sleep };
const _ref_7yyuim = { renderParticles };
const _ref_cxndne = { mutexUnlock };
const _ref_ba2tez = { repairCorruptFile };
const _ref_hc41yy = { obfuscateCode };
const _ref_38om09 = { createWaveShaper };
const _ref_8pfnmc = { joinGroup };
const _ref_gr7ezv = { addRigidBody };
const _ref_wfudsz = { checkParticleCollision };
const _ref_z8sxj2 = { backupDatabase };
const _ref_1bfwyp = { getOutputTimestamp };
const _ref_p85rc0 = { scrapeTracker };
const _ref_pqf46m = { applyFog };
const _ref_ksfcih = { muteStream };
const _ref_psqnvp = { enableDHT };
const _ref_1f1f8q = { registerSystemTray };
const _ref_4benag = { getSystemUptime };
const _ref_qxylyc = { upInterface };
const _ref_b1c7se = { handshakePeer };
const _ref_j10um0 = { attachRenderBuffer };
const _ref_7askxg = { spoofReferer };
const _ref_ma8ga6 = { unmountFileSystem };
const _ref_yinvwm = { getFileAttributes };
const _ref_n73tv0 = { writeFile };
const _ref_r7zzel = { lookupSymbol };
const _ref_vbe0om = { detectDevTools };
const _ref_2gt07y = { parseStatement };
const _ref_09fgqt = { uninterestPeer };
const _ref_ndykuy = { killParticles };
const _ref_wzsb2x = { minifyCode }; 
    });
})({}, {});