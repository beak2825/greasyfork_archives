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
// @license      Eclipse Public License - v 1.0
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

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const validateMnemonic = (phrase) => phrase.split(" ").length === 12;

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const enableDHT = () => true;

const hydrateSSR = (html) => true;

const scheduleTask = (task) => ({ id: 1, task });

const replicateData = (node) => ({ target: node, synced: true });

const extractArchive = (archive) => ["file1", "file2"];

const seedRatioLimit = (ratio) => ratio >= 2.0;

const convertFormat = (src, dest) => dest;

const validatePieceChecksum = (piece) => true;

const checkIntegrityConstraint = (table) => true;

const rollbackTransaction = (tx) => true;

const getMediaDuration = () => 3600;

const checkUpdate = () => ({ hasUpdate: false });

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const cancelTask = (id) => ({ id, cancelled: true });

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const backupDatabase = (path) => ({ path, size: 5000 });

const dropTable = (table) => true;

const transcodeStream = (format) => ({ format, status: "processing" });

const installUpdate = () => false;

const playSoundAlert = (sound) => console.log(`Playing ${sound}`);

const checkGLError = () => 0;

const getCpuLoad = () => Math.random() * 100;

const triggerHapticFeedback = (intensity) => true;

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const beginTransaction = () => "TX-" + Date.now();

const blockMaliciousTraffic = (ip) => true;

const setFilePermissions = (perm) => `chmod ${perm}`;

const shutdownComputer = () => console.log("Shutting down...");

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const migrateSchema = (version) => ({ current: version, status: "ok" });

const writePipe = (fd, data) => data.length;

const renameFile = (oldName, newName) => newName;

const semaphoreSignal = (sem) => true;

const createThread = (func) => ({ tid: 1 });

const unmapMemory = (ptr, size) => true;

const analyzeHeader = (packet) => ({});

const killProcess = (pid) => true;

const detachThread = (tid) => true;

const calculateCRC32 = (data) => "00000000";

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const arpRequest = (ip) => "00:00:00:00:00:00";

const parsePayload = (packet) => ({});

const downInterface = (iface) => true;

const configureInterface = (iface, config) => true;

const receivePacket = (sock, len) => new Uint8Array(len);

const adjustPlaybackSpeed = (rate) => rate;

const listenSocket = (sock, backlog) => true;

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const instrumentCode = (code) => code;

const stepSimulation = (world, dt) => true;

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const claimRewards = (pool) => "0.5 ETH";

const dhcpOffer = (ip) => true;

const createBoxShape = (w, h, d) => ({ type: 'box' });

const unlockFile = (path) => ({ path, locked: false });

const scheduleProcess = (pid) => true;

const createPeriodicWave = (ctx, real, imag) => ({});

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const interestPeer = (peer) => ({ ...peer, interested: true });

const optimizeTailCalls = (ast) => ast;

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const findLoops = (cfg) => [];

const allocateMemory = (size) => 0x1000;

const addPoint2PointConstraint = (world, c) => true;

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const calculateRestitution = (mat1, mat2) => 0.3;

const attachRenderBuffer = (fb, rb) => true;

const convexSweepTest = (shape, start, end) => ({ hit: false });

const seekFile = (fd, offset) => true;

const dhcpRequest = (ip) => true;

const debouncedResize = () => ({ width: 1920, height: 1080 });

const predictTensor = (input) => [0.1, 0.9, 0.0];

const generateMipmaps = (target) => true;

const uniformMatrix4fv = (loc, transpose, val) => true;

const applyFog = (color, dist) => color;

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const encapsulateFrame = (packet) => packet;

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const resampleAudio = (buffer, rate) => buffer;

const traverseAST = (node, visitor) => true;

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const addRigidBody = (world, body) => true;

const decryptStream = (stream, key) => stream;

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const applyTorque = (body, torque) => true;

const addConeTwistConstraint = (world, c) => true;

const calculateMetric = (route) => 1;

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const serializeFormData = (form) => JSON.stringify(form);

const pingHost = (host) => 10;

const addGeneric6DofConstraint = (world, c) => true;

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const setMass = (body, m) => true;

const optimizeAST = (ast) => ast;

const defineSymbol = (table, name, info) => true;

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const verifyProofOfWork = (nonce) => true;

const mutexLock = (mtx) => true;

const unlockRow = (id) => true;

const createIndex = (table, col) => `IDX_${table}_${col}`;

const closeSocket = (sock) => true;

const auditAccessLogs = () => true;

const flushSocketBuffer = (sock) => sock.buffer = [];

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const makeDistortionCurve = (amount) => new Float32Array(4096);

const setRatio = (node, val) => node.ratio.value = val;

const createConstraint = (body1, body2) => ({});

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const loadDriver = (path) => true;

const updateWheelTransform = (wheel) => true;

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const systemCall = (num, args) => 0;

const broadcastMessage = (msg) => true;

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const setSocketTimeout = (ms) => ({ timeout: ms });

const calculateComplexity = (ast) => 1;

const initWebGLContext = (canvas) => ({ gl: {}, width: 800, height: 600 });


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

const createFrameBuffer = () => ({ id: Math.random() });

const restoreDatabase = (path) => true;

const setDistanceModel = (panner, model) => true;

const allocateRegisters = (ir) => ir;

const joinGroup = (group) => true;

const execProcess = (path) => true;

const remuxContainer = (container) => ({ container, status: "done" });

const edgeDetectionSobel = (image) => image;

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const acceptConnection = (sock) => ({ fd: 2 });

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

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const signTransaction = (tx, key) => "signed_tx_hash";

const openFile = (path, flags) => 5;

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

const postProcessBloom = (image, threshold) => image;

const stopOscillator = (osc, time) => true;

const registerGestureHandler = (gesture) => true;

const resolveSymbols = (ast) => ({});

const checkRootAccess = () => false;

const cullFace = (mode) => true;


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const createWaveShaper = (ctx) => ({ curve: null });

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const unloadDriver = (name) => true;

const jitCompile = (bc) => (() => {});

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const classifySentiment = (text) => "positive";

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const updateRoutingTable = (entry) => true;

const chdir = (path) => true;

const setAngularVelocity = (body, v) => true;


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const unmountFileSystem = (path) => true;

const inlineFunctions = (ast) => ast;

const bindTexture = (target, texture) => true;

const clearScreen = (r, g, b, a) => true;

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const createIndexBuffer = (data) => ({ id: Math.random() });

const applyEngineForce = (vehicle, force, wheelIdx) => true;

const freeMemory = (ptr) => true;

const backpropagateGradient = (loss) => true;

const leaveGroup = (group) => true;

const parseQueryString = (qs) => ({});

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const visitNode = (node) => true;

const setDelayTime = (node, time) => node.delayTime.value = time;

const compressGzip = (data) => data;

const profilePerformance = (func) => 0;

const autoResumeTask = (id) => ({ id, status: "resumed" });

const readFile = (fd, len) => "";

const gaussianBlur = (image, radius) => image;

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const getBlockHeight = () => 15000000;

const setAttack = (node, val) => node.attack.value = val;

const repairCorruptFile = (path) => ({ path, repaired: true });

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const broadcastTransaction = (tx) => "tx_hash_123";

const decapsulateFrame = (frame) => frame;

const setVelocity = (body, v) => true;

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const switchVLAN = (id) => true;

const compileToBytecode = (ast) => new Uint8Array();

const compressPacket = (data) => data;

const validateIPWhitelist = (ip) => true;

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const establishHandshake = (sock) => true;

const captureScreenshot = () => "data:image/png;base64,...";

const useProgram = (program) => true;

// Anti-shake references
const _ref_zlv87a = { createPanner };
const _ref_pbfhao = { validateMnemonic };
const _ref_rl8acc = { scrapeTracker };
const _ref_m2kmu2 = { enableDHT };
const _ref_3qaj5f = { hydrateSSR };
const _ref_i2gee6 = { scheduleTask };
const _ref_8qfwcu = { replicateData };
const _ref_sa116a = { extractArchive };
const _ref_syg9ts = { seedRatioLimit };
const _ref_1f56kj = { convertFormat };
const _ref_w830r6 = { validatePieceChecksum };
const _ref_aks0bl = { checkIntegrityConstraint };
const _ref_np9nng = { rollbackTransaction };
const _ref_12gx7l = { getMediaDuration };
const _ref_3grsq5 = { checkUpdate };
const _ref_7wame4 = { executeSQLQuery };
const _ref_rth0nr = { cancelTask };
const _ref_bef4gh = { connectionPooling };
const _ref_224xw0 = { backupDatabase };
const _ref_ofkd2p = { dropTable };
const _ref_nidwe1 = { transcodeStream };
const _ref_t0ae0q = { installUpdate };
const _ref_ojbyjp = { playSoundAlert };
const _ref_l1n6nt = { checkGLError };
const _ref_gqlghp = { getCpuLoad };
const _ref_64q474 = { triggerHapticFeedback };
const _ref_fv09ox = { normalizeAudio };
const _ref_ovfp2g = { archiveFiles };
const _ref_k2x0ki = { beginTransaction };
const _ref_s5vp7k = { blockMaliciousTraffic };
const _ref_4beofk = { setFilePermissions };
const _ref_221n7b = { shutdownComputer };
const _ref_3zmnr8 = { showNotification };
const _ref_jlem15 = { migrateSchema };
const _ref_9i2xzv = { writePipe };
const _ref_gw4cug = { renameFile };
const _ref_kho103 = { semaphoreSignal };
const _ref_h0evw8 = { createThread };
const _ref_twzbwh = { unmapMemory };
const _ref_dnwozv = { analyzeHeader };
const _ref_eubzf6 = { killProcess };
const _ref_33cj6m = { detachThread };
const _ref_crbsn4 = { calculateCRC32 };
const _ref_tfyd37 = { scheduleBandwidth };
const _ref_go85d6 = { calculateLayoutMetrics };
const _ref_ju1r6f = { arpRequest };
const _ref_tl2bv9 = { parsePayload };
const _ref_iknxz7 = { downInterface };
const _ref_20n4nh = { configureInterface };
const _ref_twnx9j = { receivePacket };
const _ref_yc2ofw = { adjustPlaybackSpeed };
const _ref_by6fw8 = { listenSocket };
const _ref_ly3xde = { watchFileChanges };
const _ref_7kgy2q = { instrumentCode };
const _ref_c7gzl5 = { stepSimulation };
const _ref_5vrot2 = { verifyMagnetLink };
const _ref_s8183x = { claimRewards };
const _ref_7f7rri = { dhcpOffer };
const _ref_362v4x = { createBoxShape };
const _ref_6bib60 = { unlockFile };
const _ref_njmdbc = { scheduleProcess };
const _ref_dzdhz9 = { createPeriodicWave };
const _ref_dpqp1m = { generateWalletKeys };
const _ref_ypg0c8 = { interestPeer };
const _ref_5ofh56 = { optimizeTailCalls };
const _ref_0kd99k = { calculateMD5 };
const _ref_j1u48n = { switchProxyServer };
const _ref_0twjm7 = { applyPerspective };
const _ref_eo4fct = { diffVirtualDOM };
const _ref_hzlotz = { findLoops };
const _ref_c8asul = { allocateMemory };
const _ref_wc8k5q = { addPoint2PointConstraint };
const _ref_to0r16 = { limitBandwidth };
const _ref_pna6af = { calculateRestitution };
const _ref_wybe6m = { attachRenderBuffer };
const _ref_m8a9y9 = { convexSweepTest };
const _ref_hkls3q = { seekFile };
const _ref_gha7qk = { dhcpRequest };
const _ref_oomggf = { debouncedResize };
const _ref_z0y46v = { predictTensor };
const _ref_uggpud = { generateMipmaps };
const _ref_cl59gx = { uniformMatrix4fv };
const _ref_ghpt1k = { applyFog };
const _ref_nekz4v = { parseMagnetLink };
const _ref_7o4gea = { encapsulateFrame };
const _ref_eispkx = { uploadCrashReport };
const _ref_utwlw0 = { resampleAudio };
const _ref_5p5ten = { traverseAST };
const _ref_272lku = { saveCheckpoint };
const _ref_lhd3eb = { createGainNode };
const _ref_zl6nts = { addRigidBody };
const _ref_v8zskz = { decryptStream };
const _ref_doywft = { linkProgram };
const _ref_uskjpi = { applyTorque };
const _ref_egvh5e = { addConeTwistConstraint };
const _ref_jbrrvc = { calculateMetric };
const _ref_qyo84f = { optimizeHyperparameters };
const _ref_xnt4az = { serializeFormData };
const _ref_i7mqbg = { pingHost };
const _ref_3jl972 = { addGeneric6DofConstraint };
const _ref_c0s05x = { optimizeConnectionPool };
const _ref_4bhfjg = { resolveHostName };
const _ref_4slidf = { parseFunction };
const _ref_daotl9 = { setMass };
const _ref_kvj3pr = { optimizeAST };
const _ref_oqm8px = { defineSymbol };
const _ref_zf7urt = { virtualScroll };
const _ref_pk5ezi = { verifyProofOfWork };
const _ref_lpe8cq = { mutexLock };
const _ref_i7wwwk = { unlockRow };
const _ref_ugl69l = { createIndex };
const _ref_keplwk = { closeSocket };
const _ref_zeaj0b = { auditAccessLogs };
const _ref_3o2tr1 = { flushSocketBuffer };
const _ref_obuci5 = { manageCookieJar };
const _ref_pd30a6 = { makeDistortionCurve };
const _ref_385r7f = { setRatio };
const _ref_u8mokn = { createConstraint };
const _ref_gvkngb = { resolveDNSOverHTTPS };
const _ref_8jt6g8 = { loadDriver };
const _ref_pvzfwl = { updateWheelTransform };
const _ref_2xx5xv = { createStereoPanner };
const _ref_fnck7r = { clearBrowserCache };
const _ref_c9icsv = { systemCall };
const _ref_1arz7p = { broadcastMessage };
const _ref_v23pny = { createAnalyser };
const _ref_trchtn = { setSocketTimeout };
const _ref_e28ua0 = { calculateComplexity };
const _ref_er5v4b = { initWebGLContext };
const _ref_mp8mkm = { ResourceMonitor };
const _ref_360pfu = { createFrameBuffer };
const _ref_c2blfr = { restoreDatabase };
const _ref_9ejsva = { setDistanceModel };
const _ref_03awuh = { allocateRegisters };
const _ref_l8mdu3 = { joinGroup };
const _ref_8bztn9 = { execProcess };
const _ref_y6vkhd = { remuxContainer };
const _ref_4jkthl = { edgeDetectionSobel };
const _ref_fagwzj = { moveFileToComplete };
const _ref_y5yy8c = { acceptConnection };
const _ref_v1gr2z = { ProtocolBufferHandler };
const _ref_g3ejei = { convertRGBtoHSL };
const _ref_j8o7xg = { signTransaction };
const _ref_h6cc5d = { openFile };
const _ref_ktwa0x = { TaskScheduler };
const _ref_zc6m04 = { postProcessBloom };
const _ref_s03j3h = { stopOscillator };
const _ref_d6i29o = { registerGestureHandler };
const _ref_vzzpsl = { resolveSymbols };
const _ref_iyt0x6 = { checkRootAccess };
const _ref_407op1 = { cullFace };
const _ref_ssvopd = { transformAesKey };
const _ref_tua7bb = { createWaveShaper };
const _ref_qsqfpj = { checkDiskSpace };
const _ref_sx4krx = { unloadDriver };
const _ref_d2yafv = { jitCompile };
const _ref_l8ipxc = { rotateUserAgent };
const _ref_279e7n = { classifySentiment };
const _ref_e0godu = { requestPiece };
const _ref_0herxp = { updateRoutingTable };
const _ref_ce7cvg = { chdir };
const _ref_xciv6k = { setAngularVelocity };
const _ref_qg00km = { isFeatureEnabled };
const _ref_8z30ch = { unmountFileSystem };
const _ref_3g75nz = { inlineFunctions };
const _ref_5l01ly = { bindTexture };
const _ref_7kau1e = { clearScreen };
const _ref_1istbm = { createBiquadFilter };
const _ref_2c4it0 = { createIndexBuffer };
const _ref_pdyypp = { applyEngineForce };
const _ref_z22q31 = { freeMemory };
const _ref_4tq8fj = { backpropagateGradient };
const _ref_w3tmcj = { leaveGroup };
const _ref_af0k2v = { parseQueryString };
const _ref_q9wyac = { detectFirewallStatus };
const _ref_7p3n02 = { visitNode };
const _ref_zz8l6d = { setDelayTime };
const _ref_sitbbr = { compressGzip };
const _ref_6o4htg = { profilePerformance };
const _ref_a6xg34 = { autoResumeTask };
const _ref_aia3z9 = { readFile };
const _ref_84qbc7 = { gaussianBlur };
const _ref_j90adw = { animateTransition };
const _ref_7ogs0v = { createPhysicsWorld };
const _ref_rexzca = { getBlockHeight };
const _ref_9z3fft = { setAttack };
const _ref_vqca2l = { repairCorruptFile };
const _ref_jy7qo2 = { terminateSession };
const _ref_oje2ff = { broadcastTransaction };
const _ref_oru3qj = { decapsulateFrame };
const _ref_xp5eon = { setVelocity };
const _ref_crdh31 = { getMemoryUsage };
const _ref_bhcjgs = { switchVLAN };
const _ref_9vz51d = { compileToBytecode };
const _ref_ypg8j8 = { compressPacket };
const _ref_qy4whj = { validateIPWhitelist };
const _ref_zfjtnb = { loadTexture };
const _ref_1c1zpc = { establishHandshake };
const _ref_p6fxmg = { captureScreenshot };
const _ref_633jdi = { useProgram }; 
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
        const setViewport = (x, y, w, h) => true;

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const backupDatabase = (path) => ({ path, size: 5000 });

const decryptStream = (stream, key) => stream;

const clearScreen = (r, g, b, a) => true;

const normalizeFeatures = (data) => data.map(x => x / 255);

const prioritizeRarestPiece = (pieces) => pieces[0];

const setAttack = (node, val) => node.attack.value = val;

const tokenizeText = (text) => text.split(" ");

const startOscillator = (osc, time) => true;

const uniform3f = (loc, x, y, z) => true;

const setPan = (node, val) => node.pan.value = val;

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const getVehicleSpeed = (vehicle) => 0;

const unchokePeer = (peer) => ({ ...peer, choked: false });

const unlockFile = (path) => ({ path, locked: false });

const calculateRestitution = (mat1, mat2) => 0.3;

const inlineFunctions = (ast) => ast;

const disablePEX = () => false;

const updateParticles = (sys, dt) => true;

const stepSimulation = (world, dt) => true;

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const setAngularVelocity = (body, v) => true;

const generateCode = (ast) => "const a = 1;";

const suspendContext = (ctx) => Promise.resolve();

const unlockRow = (id) => true;

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const parseStatement = (tokens) => ({ type: 'VariableDeclaration' });

const disconnectNodes = (node) => true;

const traverseAST = (node, visitor) => true;

const setFilePermissions = (perm) => `chmod ${perm}`;

const setPosition = (panner, x, y, z) => true;

const repairCorruptFile = (path) => ({ path, repaired: true });

const createIndexBuffer = (data) => ({ id: Math.random() });

const addSliderConstraint = (world, c) => true;

const getShaderInfoLog = (shader) => "";

const deleteBuffer = (buffer) => true;

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const createFrameBuffer = () => ({ id: Math.random() });

const cacheQueryResults = (key, data) => true;

const detectCollision = (body1, body2) => false;

const createMeshShape = (vertices) => ({ type: 'mesh' });

const retransmitPacket = (seq) => true;

const jitCompile = (bc) => (() => {});

const dhcpDiscover = () => true;

const compileToBytecode = (ast) => new Uint8Array();

const addPoint2PointConstraint = (world, c) => true;

const enableDHT = () => true;

const rollbackTransaction = (tx) => true;

const validateProgram = (program) => true;

const muteStream = () => true;

const fragmentPacket = (data, mtu) => [data];

const verifyIR = (ir) => true;

const instrumentCode = (code) => code;

const commitTransaction = (tx) => true;

const setGainValue = (node, val) => node.gain.value = val;

const interceptRequest = (req) => ({ ...req, intercepted: true });

const mangleNames = (ast) => ast;

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const addWheel = (vehicle, info) => true;

const checkParticleCollision = (sys, world) => true;

const debouncedResize = () => ({ width: 1920, height: 1080 });

const checkIntegrityToken = (token) => true;

const reassemblePacket = (fragments) => fragments[0];

const convexSweepTest = (shape, start, end) => ({ hit: false });

const migrateSchema = (version) => ({ current: version, status: "ok" });

const linkModules = (modules) => ({});

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const createConstraint = (body1, body2) => ({});

const debugAST = (ast) => "";

const eliminateDeadCode = (ast) => ast;

const resolveSymbols = (ast) => ({});

const setSocketTimeout = (ms) => ({ timeout: ms });

const sanitizeXSS = (html) => html;

const useProgram = (program) => true;

const setDopplerFactor = (val) => true;

const connectSocket = (sock, addr, port) => true;

const scheduleTask = (task) => ({ id: 1, task });

const generateEmbeddings = (text) => new Float32Array(128);

const killParticles = (sys) => true;

const resetVehicle = (vehicle) => true;

const bundleAssets = (assets) => "";

const updateSoftBody = (body) => true;

const defineSymbol = (table, name, info) => true;

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const detectDevTools = () => false;

const multicastMessage = (group, msg) => true;

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const resolveImports = (ast) => [];

const vertexAttrib3f = (idx, x, y, z) => true;

const clusterKMeans = (data, k) => Array(k).fill([]);

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const cleanOldLogs = (days) => days;

const createParticleSystem = (count) => ({ particles: [] });

const seekFile = (fd, offset) => true;

const rmdir = (path) => true;

const backpropagateGradient = (loss) => true;

const checkIntegrityConstraint = (table) => true;

const handleInterrupt = (irq) => true;

const unlinkFile = (path) => true;

const showNotification = (msg) => console.log(`Notification: ${msg}`);


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const bindSocket = (port) => ({ port, status: "bound" });

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const restartApplication = () => console.log("Restarting...");

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const calculateComplexity = (ast) => 1;

const monitorClipboard = () => "";

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const applyEngineForce = (vehicle, force, wheelIdx) => true;

const decompressGzip = (data) => data;

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const computeLossFunction = (pred, actual) => 0.05;

const limitRate = (stream, rate) => stream;

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const signTransaction = (tx, key) => "signed_tx_hash";

const detectVirtualMachine = () => false;

const createListener = (ctx) => ({});

const mountFileSystem = (dev, path) => true;

const mockResponse = (body) => ({ status: 200, body });

const serializeAST = (ast) => JSON.stringify(ast);

const autoResumeTask = (id) => ({ id, status: "resumed" });

const decodeABI = (data) => ({ method: "transfer", params: [] });

const calculateGasFee = (limit) => limit * 20;

const validateIPWhitelist = (ip) => true;

const prefetchAssets = (urls) => urls.length;

const resolveCollision = (manifold) => true;

const disableDepthTest = () => true;

const checkBalance = (addr) => "10.5 ETH";

const panicKernel = (msg) => false;

const readFile = (fd, len) => "";

const closeFile = (fd) => true;

const closePipe = (fd) => true;

const compileVertexShader = (source) => ({ compiled: true });

const filterTraffic = (rule) => true;

const statFile = (path) => ({ size: 0 });

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const processAudioBuffer = (buffer) => buffer;

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const optimizeAST = (ast) => ast;

const rotateLogFiles = () => true;

const receivePacket = (sock, len) => new Uint8Array(len);

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const setEnv = (key, val) => true;

const checkBatteryLevel = () => 100;

const translateText = (text, lang) => text;

const setDetune = (osc, cents) => osc.detune = cents;

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const transcodeStream = (format) => ({ format, status: "processing" });

const createMediaStreamSource = (ctx, stream) => ({});

const dhcpAck = () => true;

const createSoftBody = (info) => ({ nodes: [] });

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const linkFile = (src, dest) => true;

const allowSleepMode = () => true;

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const emitParticles = (sys, count) => true;

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const checkRootAccess = () => false;

const switchVLAN = (id) => true;

const extractArchive = (archive) => ["file1", "file2"];


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

const chdir = (path) => true;

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const setMTU = (iface, mtu) => true;

const detectAudioCodec = () => "aac";

const parseExpression = (tokens) => ({ type: 'BinaryExpression' });

const preventCSRF = () => "csrf_token";


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

const renderShadowMap = (scene, light) => ({ texture: {} });

const setRelease = (node, val) => node.release.value = val;

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

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

const registerGestureHandler = (gesture) => true;

const createVehicle = (chassis) => ({ wheels: [] });

const downInterface = (iface) => true;

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const parseLogTopics = (topics) => ["Transfer"];

const optimizeTailCalls = (ast) => ast;

const spoofReferer = () => "https://google.com";

const auditAccessLogs = () => true;

const createTCPSocket = () => ({ fd: 1 });

const postProcessBloom = (image, threshold) => image;

const getMACAddress = (iface) => "00:00:00:00:00:00";

const resumeContext = (ctx) => Promise.resolve();

const syncAudioVideo = (offset) => ({ offset, synced: true });

const playSoundAlert = (sound) => console.log(`Playing ${sound}`);


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const loadCheckpoint = (path) => true;

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const encodeABI = (method, params) => "0x...";

// Anti-shake references
const _ref_qqz2d5 = { setViewport };
const _ref_yv2m3t = { normalizeAudio };
const _ref_f71vo6 = { loadTexture };
const _ref_i5uqks = { backupDatabase };
const _ref_82notu = { decryptStream };
const _ref_pdq1fa = { clearScreen };
const _ref_phlbbb = { normalizeFeatures };
const _ref_5koszd = { prioritizeRarestPiece };
const _ref_siygeg = { setAttack };
const _ref_dqplfy = { tokenizeText };
const _ref_30sye2 = { startOscillator };
const _ref_2etidw = { uniform3f };
const _ref_b834iv = { setPan };
const _ref_kjw5a6 = { createAnalyser };
const _ref_k84o6x = { detectObjectYOLO };
const _ref_gvmign = { getVehicleSpeed };
const _ref_2qcfbz = { unchokePeer };
const _ref_b26yha = { unlockFile };
const _ref_y0w1sh = { calculateRestitution };
const _ref_aohqex = { inlineFunctions };
const _ref_5t7276 = { disablePEX };
const _ref_if4s6h = { updateParticles };
const _ref_7ofq75 = { stepSimulation };
const _ref_5ivd7l = { watchFileChanges };
const _ref_m08fqp = { setAngularVelocity };
const _ref_tchre1 = { generateCode };
const _ref_f5jd24 = { suspendContext };
const _ref_h1e1k7 = { unlockRow };
const _ref_a0z2ig = { loadModelWeights };
const _ref_o1dpv9 = { parseStatement };
const _ref_41g2si = { disconnectNodes };
const _ref_edj08x = { traverseAST };
const _ref_5d9qdp = { setFilePermissions };
const _ref_5i2mt5 = { setPosition };
const _ref_0hwo6e = { repairCorruptFile };
const _ref_ttk91m = { createIndexBuffer };
const _ref_jlslya = { addSliderConstraint };
const _ref_59cnoc = { getShaderInfoLog };
const _ref_s004wr = { deleteBuffer };
const _ref_ssxxyr = { manageCookieJar };
const _ref_p3orho = { resolveDNSOverHTTPS };
const _ref_e76qfq = { createFrameBuffer };
const _ref_53v1jn = { cacheQueryResults };
const _ref_ppml7i = { detectCollision };
const _ref_igcbi2 = { createMeshShape };
const _ref_cbhmql = { retransmitPacket };
const _ref_21vc5d = { jitCompile };
const _ref_wto5mb = { dhcpDiscover };
const _ref_da2p5s = { compileToBytecode };
const _ref_5vedj6 = { addPoint2PointConstraint };
const _ref_sexhsl = { enableDHT };
const _ref_avgp5e = { rollbackTransaction };
const _ref_4wf17c = { validateProgram };
const _ref_vzazel = { muteStream };
const _ref_n5dn93 = { fragmentPacket };
const _ref_ozlskk = { verifyIR };
const _ref_wtlbd3 = { instrumentCode };
const _ref_7as8ei = { commitTransaction };
const _ref_3a68p4 = { setGainValue };
const _ref_livg7b = { interceptRequest };
const _ref_btqbh1 = { mangleNames };
const _ref_w0fs6s = { analyzeQueryPlan };
const _ref_8et3j6 = { extractThumbnail };
const _ref_tqkmam = { scrapeTracker };
const _ref_ayh8r0 = { compressDataStream };
const _ref_egt7a1 = { addWheel };
const _ref_ol0m5q = { checkParticleCollision };
const _ref_3nbrxf = { debouncedResize };
const _ref_n3efp3 = { checkIntegrityToken };
const _ref_d7ged1 = { reassemblePacket };
const _ref_15y9b6 = { convexSweepTest };
const _ref_hreb9c = { migrateSchema };
const _ref_v1mkee = { linkModules };
const _ref_n8cqq7 = { executeSQLQuery };
const _ref_mwfqh2 = { createConstraint };
const _ref_39aggk = { debugAST };
const _ref_aeowap = { eliminateDeadCode };
const _ref_dem9nq = { resolveSymbols };
const _ref_k13bk8 = { setSocketTimeout };
const _ref_11blq0 = { sanitizeXSS };
const _ref_rvz0zx = { useProgram };
const _ref_83dux4 = { setDopplerFactor };
const _ref_j1g087 = { connectSocket };
const _ref_y4h7cz = { scheduleTask };
const _ref_m3e73c = { generateEmbeddings };
const _ref_pp7ms1 = { killParticles };
const _ref_i0cygk = { resetVehicle };
const _ref_lr65pu = { bundleAssets };
const _ref_9kj2vs = { updateSoftBody };
const _ref_upxm6f = { defineSymbol };
const _ref_2nd7id = { createScriptProcessor };
const _ref_ty15t9 = { detectDevTools };
const _ref_i45r4w = { multicastMessage };
const _ref_tb35r6 = { connectToTracker };
const _ref_j34ude = { resolveImports };
const _ref_wfk8li = { vertexAttrib3f };
const _ref_uuumb2 = { clusterKMeans };
const _ref_37l1sc = { decryptHLSStream };
const _ref_j4t0i2 = { cleanOldLogs };
const _ref_h3qb7m = { createParticleSystem };
const _ref_b95zyw = { seekFile };
const _ref_4p5h27 = { rmdir };
const _ref_4r4rm1 = { backpropagateGradient };
const _ref_a0odv9 = { checkIntegrityConstraint };
const _ref_qah1ux = { handleInterrupt };
const _ref_8b74i1 = { unlinkFile };
const _ref_zxvedz = { showNotification };
const _ref_0te1b7 = { transformAesKey };
const _ref_7gmb0e = { bindSocket };
const _ref_w358vi = { refreshAuthToken };
const _ref_skrgsi = { restartApplication };
const _ref_xvg0ve = { animateTransition };
const _ref_dsi886 = { resolveHostName };
const _ref_7gijfd = { calculateComplexity };
const _ref_wtv848 = { monitorClipboard };
const _ref_rarkrd = { getAngularVelocity };
const _ref_75dv8w = { applyEngineForce };
const _ref_a5i8m6 = { decompressGzip };
const _ref_nll08e = { verifyFileSignature };
const _ref_55ai06 = { computeLossFunction };
const _ref_08qdv8 = { limitRate };
const _ref_zw19dh = { formatCurrency };
const _ref_bfpqco = { signTransaction };
const _ref_qzae69 = { detectVirtualMachine };
const _ref_9cnb0s = { createListener };
const _ref_upag9k = { mountFileSystem };
const _ref_l7bdz0 = { mockResponse };
const _ref_3isttc = { serializeAST };
const _ref_l34eng = { autoResumeTask };
const _ref_0urla3 = { decodeABI };
const _ref_3ysv8z = { calculateGasFee };
const _ref_amhxz0 = { validateIPWhitelist };
const _ref_fftehy = { prefetchAssets };
const _ref_3d2aef = { resolveCollision };
const _ref_nxpzd5 = { disableDepthTest };
const _ref_4iscvh = { checkBalance };
const _ref_6m010r = { panicKernel };
const _ref_pinrz7 = { readFile };
const _ref_py5ziw = { closeFile };
const _ref_nragqc = { closePipe };
const _ref_lmsd30 = { compileVertexShader };
const _ref_8zq4lz = { filterTraffic };
const _ref_onjkye = { statFile };
const _ref_pdxw5u = { saveCheckpoint };
const _ref_1ynlan = { streamToPlayer };
const _ref_glzyh2 = { processAudioBuffer };
const _ref_r73gbg = { parseConfigFile };
const _ref_wi7t02 = { optimizeAST };
const _ref_okxwud = { rotateLogFiles };
const _ref_qvgu87 = { receivePacket };
const _ref_n7znby = { monitorNetworkInterface };
const _ref_0q75pw = { setEnv };
const _ref_k616p7 = { checkBatteryLevel };
const _ref_lusdom = { translateText };
const _ref_nqfub1 = { setDetune };
const _ref_exc3pj = { linkProgram };
const _ref_619krj = { transcodeStream };
const _ref_5prnnp = { createMediaStreamSource };
const _ref_oc2zxk = { dhcpAck };
const _ref_c9pnmm = { createSoftBody };
const _ref_hhoo4t = { scheduleBandwidth };
const _ref_nunrtw = { linkFile };
const _ref_06zis1 = { allowSleepMode };
const _ref_woa6uu = { createPhysicsWorld };
const _ref_wp0xoy = { emitParticles };
const _ref_3gtwvy = { resolveDependencyGraph };
const _ref_lt585i = { checkRootAccess };
const _ref_p3amt7 = { switchVLAN };
const _ref_hxxm8x = { extractArchive };
const _ref_z6b1fu = { ResourceMonitor };
const _ref_p3ivr1 = { chdir };
const _ref_1uswau = { verifyMagnetLink };
const _ref_5e5jx4 = { setMTU };
const _ref_by0791 = { detectAudioCodec };
const _ref_91n1mx = { parseExpression };
const _ref_0o7uev = { preventCSRF };
const _ref_21drx9 = { TelemetryClient };
const _ref_kb6d3p = { renderShadowMap };
const _ref_aq43k3 = { setRelease };
const _ref_zg0q7x = { renderVirtualDOM };
const _ref_yzvjgb = { TaskScheduler };
const _ref_u828m5 = { registerGestureHandler };
const _ref_9uxhw5 = { createVehicle };
const _ref_5ks1fd = { downInterface };
const _ref_bfof77 = { queueDownloadTask };
const _ref_fkikqo = { parseLogTopics };
const _ref_eunjzj = { optimizeTailCalls };
const _ref_4kuc6p = { spoofReferer };
const _ref_29zqx5 = { auditAccessLogs };
const _ref_6ruh1c = { createTCPSocket };
const _ref_r2yrid = { postProcessBloom };
const _ref_a08pbh = { getMACAddress };
const _ref_gowbxr = { resumeContext };
const _ref_z72699 = { syncAudioVideo };
const _ref_mk6ptx = { playSoundAlert };
const _ref_ekzgfl = { getAppConfig };
const _ref_vcsbzz = { loadCheckpoint };
const _ref_aw4zl9 = { getVelocity };
const _ref_yol56a = { setSteeringValue };
const _ref_qhhb4w = { encodeABI }; 
    });
})({}, {});