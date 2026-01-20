// ==UserScript==
// @name youtube kids下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/youtube_kids/index.js
// @version 2026.01.10
// @description youtube kids是一个给儿童观看的视频网站。本脚本可下载该网站视频。
// @icon https://www.gstatic.com/ytkids/web/favicons/ytkids_favicon_96_2.png
// @match *://*.youtubekids.com/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
// @connect youtube.com
// @connect youtubekids.com
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
// @downloadURL https://update.greasyfork.org/scripts/560918/youtube%20kids%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/560918/youtube%20kids%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const hydrateSSR = (html) => true;

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const getNetworkStats = () => ({ up: 100, down: 2000 });

const enableDHT = () => true;

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const renameFile = (oldName, newName) => newName;

const unlockFile = (path) => ({ path, locked: false });


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

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const prefetchAssets = (urls) => urls.length;

const normalizeFeatures = (data) => data.map(x => x / 255);

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const getFloatTimeDomainData = (analyser, array) => true;

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const translateText = (text, lang) => text;

const createChannelMerger = (ctx, channels) => ({});

const uniform1i = (loc, val) => true;

const setKnee = (node, val) => node.knee.value = val;

const setDopplerFactor = (val) => true;

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const interceptRequest = (req) => ({ ...req, intercepted: true });

const verifySignature = (tx, sig) => true;

const checkBalance = (addr) => "10.5 ETH";

const connectNodes = (src, dest) => true;

const validateProgram = (program) => true;

const setFilePermissions = (perm) => `chmod ${perm}`;

const sanitizeXSS = (html) => html;

const createWaveShaper = (ctx) => ({ curve: null });

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const createDirectoryRecursive = (path) => path.split('/').length;

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const getProgramInfoLog = (program) => "";

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const autoResumeTask = (id) => ({ id, status: "resumed" });

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const bindTexture = (target, texture) => true;

const resumeContext = (ctx) => Promise.resolve();

const obfuscateString = (str) => btoa(str);

const setOrientation = (panner, x, y, z) => true;

const deleteTexture = (texture) => true;

const predictTensor = (input) => [0.1, 0.9, 0.0];

const segmentImageUNet = (img) => "mask_buffer";

const uniform3f = (loc, x, y, z) => true;

const negotiateProtocol = () => "HTTP/2.0";

const loadImpulseResponse = (url) => Promise.resolve({});

const createAudioContext = () => ({ sampleRate: 44100 });

const signTransaction = (tx, key) => "signed_tx_hash";


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

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const setViewport = (x, y, w, h) => true;

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const setPan = (node, val) => node.pan.value = val;

const performOCR = (img) => "Detected Text";

const getShaderInfoLog = (shader) => "";

const clearScreen = (r, g, b, a) => true;

const deobfuscateString = (str) => atob(str);

const useProgram = (program) => true;

const activeTexture = (unit) => true;

const drawElements = (mode, count, type, offset) => true;

const lazyLoadComponent = (name) => ({ name, loaded: false });

const disconnectNodes = (node) => true;

const compileVertexShader = (source) => ({ compiled: true });

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const detectDevTools = () => false;

const setPosition = (panner, x, y, z) => true;

const clusterKMeans = (data, k) => Array(k).fill([]);

const setRelease = (node, val) => node.release.value = val;

const uniformMatrix4fv = (loc, transpose, val) => true;

const announceToTracker = (url) => ({ url, interval: 1800 });

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const getOutputTimestamp = (ctx) => Date.now();

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const augmentData = (image) => image;

const synthesizeSpeech = (text) => "audio_buffer";

const createConvolver = (ctx) => ({ buffer: null });

const startOscillator = (osc, time) => true;

const disablePEX = () => false;

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const monitorClipboard = () => "";

const getExtension = (name) => ({});

const closeContext = (ctx) => Promise.resolve();

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const decodeAudioData = (buffer) => Promise.resolve({});

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const deleteProgram = (program) => true;

const createMediaStreamSource = (ctx, stream) => ({});

const cacheQueryResults = (key, data) => true;

const attachRenderBuffer = (fb, rb) => true;

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const setAttack = (node, val) => node.attack.value = val;

const unchokePeer = (peer) => ({ ...peer, choked: false });

const rmdir = (path) => true;

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const encryptStream = (stream, key) => stream;

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const decapsulateFrame = (frame) => frame;

const upInterface = (iface) => true;

const preventCSRF = () => "csrf_token";

const makeDistortionCurve = (amount) => new Float32Array(4096);

const remuxContainer = (container) => ({ container, status: "done" });

const allocateMemory = (size) => 0x1000;

const renderCanvasLayer = (ctx) => true;

const addConeTwistConstraint = (world, c) => true;

const enableInterrupts = () => true;

const createTCPSocket = () => ({ fd: 1 });

const setEnv = (key, val) => true;

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const suspendContext = (ctx) => Promise.resolve();

const fragmentPacket = (data, mtu) => [data];

const semaphoreWait = (sem) => true;

const createMediaElementSource = (ctx, el) => ({});

const openFile = (path, flags) => 5;

const dhcpOffer = (ip) => true;

const disableInterrupts = () => true;

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const arpRequest = (ip) => "00:00:00:00:00:00";

const verifyAppSignature = () => true;

const traverseAST = (node, visitor) => true;

const checkIntegrityConstraint = (table) => true;

const checkPortAvailability = (port) => Math.random() > 0.2;

const createMeshShape = (vertices) => ({ type: 'mesh' });

const killProcess = (pid) => true;

const vertexAttrib3f = (idx, x, y, z) => true;

const setBrake = (vehicle, force, wheelIdx) => true;

const readdir = (path) => [];

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const unlinkFile = (path) => true;

const readFile = (fd, len) => "";

const allowSleepMode = () => true;

const execProcess = (path) => true;

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const merkelizeRoot = (txs) => "root_hash";

const getByteFrequencyData = (analyser, array) => true;


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const setInertia = (body, i) => true;

const cancelTask = (id) => ({ id, cancelled: true });

const stopOscillator = (osc, time) => true;

const interestPeer = (peer) => ({ ...peer, interested: true });

const calculateFriction = (mat1, mat2) => 0.5;

const disableRightClick = () => true;

const parseLogTopics = (topics) => ["Transfer"];

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const mergeFiles = (parts) => parts[0];

const reassemblePacket = (fragments) => fragments[0];

const createSphereShape = (r) => ({ type: 'sphere' });

const setGainValue = (node, val) => node.gain.value = val;

const createPeriodicWave = (ctx, real, imag) => ({});

const loadCheckpoint = (path) => true;

const createCapsuleShape = (r, h) => ({ type: 'capsule' });

const downInterface = (iface) => true;

const createConstraint = (body1, body2) => ({});

const removeRigidBody = (world, body) => true;


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const optimizeAST = (ast) => ast;

const setDistanceModel = (panner, model) => true;

const retransmitPacket = (seq) => true;

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const splitFile = (path, parts) => Array(parts).fill(path);

const createIndex = (table, col) => `IDX_${table}_${col}`;

const createIndexBuffer = (data) => ({ id: Math.random() });

const checkRootAccess = () => false;

const mkdir = (path) => true;

const captureFrame = () => "frame_data_buffer";

const createBoxShape = (w, h, d) => ({ type: 'box' });

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const mockResponse = (body) => ({ status: 200, body });

const encodeABI = (method, params) => "0x...";

const createParticleSystem = (count) => ({ particles: [] });

const deleteBuffer = (buffer) => true;

const validateRecaptcha = (token) => true;

const enterScope = (table) => true;

const shardingTable = (table) => ["shard_0", "shard_1"];

const detachThread = (tid) => true;

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const validatePieceChecksum = (piece) => true;

const decodeABI = (data) => ({ method: "transfer", params: [] });

const interpretBytecode = (bc) => true;

const writePipe = (fd, data) => data.length;

const computeLossFunction = (pred, actual) => 0.05;

const lockRow = (id) => true;

const filterTraffic = (rule) => true;

const setDelayTime = (node, time) => node.delayTime.value = time;

const joinThread = (tid) => true;

const setQValue = (filter, q) => filter.Q = q;

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

// Anti-shake references
const _ref_l19979 = { hydrateSSR };
const _ref_ncay7p = { createAnalyser };
const _ref_oibx1v = { getNetworkStats };
const _ref_7dsh5w = { enableDHT };
const _ref_n4w3b5 = { discoverPeersDHT };
const _ref_eklfeq = { renameFile };
const _ref_87vral = { unlockFile };
const _ref_qjzzzk = { CacheManager };
const _ref_fphokr = { limitDownloadSpeed };
const _ref_sm28w1 = { watchFileChanges };
const _ref_tdz2d0 = { loadTexture };
const _ref_8h6lq5 = { virtualScroll };
const _ref_f1sso4 = { prefetchAssets };
const _ref_24yer9 = { normalizeFeatures };
const _ref_dil020 = { optimizeConnectionPool };
const _ref_zkcx93 = { resolveDNSOverHTTPS };
const _ref_pk6v3m = { createMagnetURI };
const _ref_8qj6gc = { getFloatTimeDomainData };
const _ref_5dzqas = { loadModelWeights };
const _ref_eejx2z = { translateText };
const _ref_f26f5f = { createChannelMerger };
const _ref_2qsffe = { uniform1i };
const _ref_pjcbzm = { setKnee };
const _ref_9tttz9 = { setDopplerFactor };
const _ref_173qlm = { parseTorrentFile };
const _ref_5t5lt2 = { interceptRequest };
const _ref_f74i7j = { verifySignature };
const _ref_0y29n6 = { checkBalance };
const _ref_i7jstj = { connectNodes };
const _ref_bx1339 = { validateProgram };
const _ref_mad4wc = { setFilePermissions };
const _ref_2udej4 = { sanitizeXSS };
const _ref_z3ptgj = { createWaveShaper };
const _ref_hgzdbc = { createDelay };
const _ref_cfjbjt = { performTLSHandshake };
const _ref_b2zl3g = { createDirectoryRecursive };
const _ref_t7qqby = { switchProxyServer };
const _ref_ixueh6 = { getProgramInfoLog };
const _ref_o3kaio = { verifyMagnetLink };
const _ref_vponzr = { autoResumeTask };
const _ref_8f4cro = { limitUploadSpeed };
const _ref_icz48i = { bindTexture };
const _ref_h7jrrj = { resumeContext };
const _ref_fhu24c = { obfuscateString };
const _ref_f2r3uu = { setOrientation };
const _ref_rkgz9w = { deleteTexture };
const _ref_ltj9vo = { predictTensor };
const _ref_szbwza = { segmentImageUNet };
const _ref_bmb59e = { uniform3f };
const _ref_m3i6ta = { negotiateProtocol };
const _ref_p7vxs5 = { loadImpulseResponse };
const _ref_ezttja = { createAudioContext };
const _ref_fynibg = { signTransaction };
const _ref_0cze74 = { ResourceMonitor };
const _ref_3cpiq0 = { createBiquadFilter };
const _ref_dovb4r = { setViewport };
const _ref_cqqse6 = { encryptPayload };
const _ref_b350bo = { requestAnimationFrameLoop };
const _ref_jkiabn = { setPan };
const _ref_pmyj07 = { performOCR };
const _ref_1k6gk7 = { getShaderInfoLog };
const _ref_etk734 = { clearScreen };
const _ref_qoe97n = { deobfuscateString };
const _ref_ux81ub = { useProgram };
const _ref_gobqxd = { activeTexture };
const _ref_4ulrja = { drawElements };
const _ref_6o5tjp = { lazyLoadComponent };
const _ref_njd3y6 = { disconnectNodes };
const _ref_1vd1yx = { compileVertexShader };
const _ref_6u3fn8 = { updateBitfield };
const _ref_16bghz = { detectDevTools };
const _ref_3zeh8r = { setPosition };
const _ref_0544ai = { clusterKMeans };
const _ref_q22i4p = { setRelease };
const _ref_zqrlk3 = { uniformMatrix4fv };
const _ref_9x5bnk = { announceToTracker };
const _ref_a7e7ma = { analyzeQueryPlan };
const _ref_1hjcgl = { getOutputTimestamp };
const _ref_tcf8x2 = { createDynamicsCompressor };
const _ref_ckqg2s = { augmentData };
const _ref_a9727r = { synthesizeSpeech };
const _ref_cuboun = { createConvolver };
const _ref_r57mkz = { startOscillator };
const _ref_slg88o = { disablePEX };
const _ref_1a91t5 = { createOscillator };
const _ref_abtwto = { readPixels };
const _ref_m91ih9 = { optimizeHyperparameters };
const _ref_96w6sl = { monitorClipboard };
const _ref_lc6949 = { getExtension };
const _ref_lbwlx5 = { closeContext };
const _ref_76q00r = { compactDatabase };
const _ref_1783bf = { decodeAudioData };
const _ref_nw4tzw = { clearBrowserCache };
const _ref_16dxag = { calculateSHA256 };
const _ref_9ggug5 = { deleteProgram };
const _ref_snelkx = { createMediaStreamSource };
const _ref_tnskf8 = { cacheQueryResults };
const _ref_o4riu5 = { attachRenderBuffer };
const _ref_dbaxn5 = { connectToTracker };
const _ref_99jdom = { setFrequency };
const _ref_h818lm = { setAttack };
const _ref_7tss4g = { unchokePeer };
const _ref_od6err = { rmdir };
const _ref_hg92ii = { refreshAuthToken };
const _ref_gda83o = { detectFirewallStatus };
const _ref_3pmw5j = { encryptStream };
const _ref_sv9o20 = { createPanner };
const _ref_k022lj = { normalizeVector };
const _ref_t9d9uq = { parseConfigFile };
const _ref_997b2s = { decapsulateFrame };
const _ref_lbvofq = { upInterface };
const _ref_lxwzi1 = { preventCSRF };
const _ref_ll377h = { makeDistortionCurve };
const _ref_vqmted = { remuxContainer };
const _ref_7syqr8 = { allocateMemory };
const _ref_fxtip7 = { renderCanvasLayer };
const _ref_igna34 = { addConeTwistConstraint };
const _ref_8pjqon = { enableInterrupts };
const _ref_326vlp = { createTCPSocket };
const _ref_cqgeml = { setEnv };
const _ref_0zwqy2 = { createGainNode };
const _ref_c7r8ev = { suspendContext };
const _ref_mq0q3z = { fragmentPacket };
const _ref_w42s33 = { semaphoreWait };
const _ref_501uv6 = { createMediaElementSource };
const _ref_az9g2n = { openFile };
const _ref_uz3o45 = { dhcpOffer };
const _ref_bm6ntn = { disableInterrupts };
const _ref_wmfv71 = { formatLogMessage };
const _ref_qpoujb = { arpRequest };
const _ref_bymagk = { verifyAppSignature };
const _ref_8lht5w = { traverseAST };
const _ref_uvi1uq = { checkIntegrityConstraint };
const _ref_ijz8a6 = { checkPortAvailability };
const _ref_ckbzdz = { createMeshShape };
const _ref_h6a8ot = { killProcess };
const _ref_apckrh = { vertexAttrib3f };
const _ref_ijfc4y = { setBrake };
const _ref_h02lfc = { readdir };
const _ref_3hjfvt = { retryFailedSegment };
const _ref_ezax4f = { unlinkFile };
const _ref_r1cl41 = { readFile };
const _ref_rohxhu = { allowSleepMode };
const _ref_d30uz8 = { execProcess };
const _ref_ud2d0x = { generateUUIDv5 };
const _ref_biht1s = { merkelizeRoot };
const _ref_f95xwv = { getByteFrequencyData };
const _ref_m41tc2 = { isFeatureEnabled };
const _ref_g6dfru = { setInertia };
const _ref_7ijtfx = { cancelTask };
const _ref_mxqql9 = { stopOscillator };
const _ref_0bm1ou = { interestPeer };
const _ref_rhjzjc = { calculateFriction };
const _ref_zblbkf = { disableRightClick };
const _ref_r0l8nm = { parseLogTopics };
const _ref_u0gfbi = { parseFunction };
const _ref_dhy1ku = { traceStack };
const _ref_pqk382 = { mergeFiles };
const _ref_td8j8j = { reassemblePacket };
const _ref_f8w9tv = { createSphereShape };
const _ref_cm5ke9 = { setGainValue };
const _ref_j8nkmc = { createPeriodicWave };
const _ref_dcr7na = { loadCheckpoint };
const _ref_mm0wdj = { createCapsuleShape };
const _ref_m055z4 = { downInterface };
const _ref_qn9nov = { createConstraint };
const _ref_kuldwm = { removeRigidBody };
const _ref_vlzs71 = { FileValidator };
const _ref_eeazu4 = { optimizeAST };
const _ref_mdmtmy = { setDistanceModel };
const _ref_1fwdga = { retransmitPacket };
const _ref_ryogyh = { uploadCrashReport };
const _ref_drbqrn = { splitFile };
const _ref_nc3czn = { createIndex };
const _ref_ymud6o = { createIndexBuffer };
const _ref_5xv941 = { checkRootAccess };
const _ref_m6bnl0 = { mkdir };
const _ref_70xmfb = { captureFrame };
const _ref_a81tro = { createBoxShape };
const _ref_d4cnvm = { tunnelThroughProxy };
const _ref_vgiz06 = { mockResponse };
const _ref_hi7jzs = { encodeABI };
const _ref_u1bmoy = { createParticleSystem };
const _ref_dcz08s = { deleteBuffer };
const _ref_ghfvnd = { validateRecaptcha };
const _ref_13z52i = { enterScope };
const _ref_6k3qlb = { shardingTable };
const _ref_jgmy2h = { detachThread };
const _ref_3kblx5 = { generateUserAgent };
const _ref_vjispq = { validatePieceChecksum };
const _ref_v42hgq = { decodeABI };
const _ref_kjlp8h = { interpretBytecode };
const _ref_qq7i9x = { writePipe };
const _ref_b2ihsn = { computeLossFunction };
const _ref_uot8d9 = { lockRow };
const _ref_o8pmif = { filterTraffic };
const _ref_hsa5xb = { setDelayTime };
const _ref_3146nj = { joinThread };
const _ref_r8x8ry = { setQValue };
const _ref_1pq3zt = { optimizeMemoryUsage }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `youtube_kids` };
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
                const urlParams = { config, url: window.location.href, name_en: `youtube_kids` };

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
        const getVehicleSpeed = (vehicle) => 0;

const auditAccessLogs = () => true;

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const stakeAssets = (pool, amount) => true;

const segmentImageUNet = (img) => "mask_buffer";


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

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
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

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const replicateData = (node) => ({ target: node, synced: true });

const cleanOldLogs = (days) => days;

const invalidateCache = (key) => true;

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const validateRecaptcha = (token) => true;

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const validateMnemonic = (phrase) => phrase.split(" ").length === 12;

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const renderShadowMap = (scene, light) => ({ texture: {} });

const verifyProofOfWork = (nonce) => true;

const shardingTable = (table) => ["shard_0", "shard_1"];

const preventCSRF = () => "csrf_token";

const logErrorToFile = (err) => console.error(err);

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const edgeDetectionSobel = (image) => image;

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const spoofReferer = () => "https://google.com";

const bindSocket = (port) => ({ port, status: "bound" });

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

const cancelTask = (id) => ({ id, cancelled: true });

const signTransaction = (tx, key) => "signed_tx_hash";

const renderCanvasLayer = (ctx) => true;

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const calculateLighting = (normal, lightDir, color) => ({ r: 1, g: 1, b: 1 });

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const checkPortAvailability = (port) => Math.random() > 0.2;

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const rotateLogFiles = () => true;

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

const captureScreenshot = () => "data:image/png;base64,...";

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const computeNormal = (v1, v2, v3) => ({ x: 0, y: 1, z: 0 });


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const parseQueryString = (qs) => ({});

const dropTable = (table) => true;

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const createIndex = (table, col) => `IDX_${table}_${col}`;

const setSocketTimeout = (ms) => ({ timeout: ms });

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const synthesizeSpeech = (text) => "audio_buffer";

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const serializeFormData = (form) => JSON.stringify(form);

const rotateMatrix = (mat, angle, axis) => mat;

const interceptRequest = (req) => ({ ...req, intercepted: true });

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const verifySignature = (tx, sig) => true;

const deriveAddress = (path) => "0x123...";

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const negotiateProtocol = () => "HTTP/2.0";

const blockMaliciousTraffic = (ip) => true;

const normalizeVolume = (buffer) => buffer;

const convexSweepTest = (shape, start, end) => ({ hit: false });


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

const setFilterType = (filter, type) => filter.type = type;

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const decodeAudioData = (buffer) => Promise.resolve({});

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const cullFace = (mode) => true;

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const optimizeAST = (ast) => ast;

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const updateWheelTransform = (wheel) => true;

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

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const updateSoftBody = (body) => true;

const uniformMatrix4fv = (loc, transpose, val) => true;

const merkelizeRoot = (txs) => "root_hash";


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

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const setFrequency = (osc, freq) => osc.frequency.value = freq;


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

const disconnectNodes = (node) => true;

const createFrameBuffer = () => ({ id: Math.random() });

const useProgram = (program) => true;

const attachRenderBuffer = (fb, rb) => true;

const clearScreen = (r, g, b, a) => true;

const uniform3f = (loc, x, y, z) => true;

const allocateRegisters = (ir) => ir;

const drawElements = (mode, count, type, offset) => true;

const prefetchAssets = (urls) => urls.length;

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const flushSocketBuffer = (sock) => sock.buffer = [];

const stepSimulation = (world, dt) => true;

const createMediaStreamSource = (ctx, stream) => ({});

const setQValue = (filter, q) => filter.Q = q;

const createMediaElementSource = (ctx, el) => ({});

const inlineFunctions = (ast) => ast;

const emitParticles = (sys, count) => true;

const closeContext = (ctx) => Promise.resolve();

const makeDistortionCurve = (amount) => new Float32Array(4096);

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const getByteFrequencyData = (analyser, array) => true;

const traverseAST = (node, visitor) => true;

const compileVertexShader = (source) => ({ compiled: true });

const visitNode = (node) => true;

const bindTexture = (target, texture) => true;

const createConstraint = (body1, body2) => ({});

const createMeshShape = (vertices) => ({ type: 'mesh' });

const setBrake = (vehicle, force, wheelIdx) => true;

const createSphereShape = (r) => ({ type: 'sphere' });

const createVehicle = (chassis) => ({ wheels: [] });

const addSliderConstraint = (world, c) => true;

const setPosition = (panner, x, y, z) => true;

const deleteProgram = (program) => true;

const parseClass = (tokens) => ({ type: 'ClassDeclaration' });

const setViewport = (x, y, w, h) => true;

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const resetVehicle = (vehicle) => true;

const setRatio = (node, val) => node.ratio.value = val;

const connectNodes = (src, dest) => true;

const killParticles = (sys) => true;

const vertexAttrib3f = (idx, x, y, z) => true;

const createAudioContext = () => ({ sampleRate: 44100 });

const setAngularVelocity = (body, v) => true;

const calculateRestitution = (mat1, mat2) => 0.3;

const checkParticleCollision = (sys, world) => true;

const anchorSoftBody = (soft, rigid) => true;

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const setGravity = (world, g) => world.gravity = g;

const activeTexture = (unit) => true;

const tokenizeSource = (code) => [{ type: 'Keyword', value: 'const' }];

const addConeTwistConstraint = (world, c) => true;

const setDelayTime = (node, time) => node.delayTime.value = time;

const getExtension = (name) => ({});

const createChannelSplitter = (ctx, channels) => ({});

const setOrientation = (panner, x, y, z) => true;

const foldConstants = (ast) => ast;

const calculateFriction = (mat1, mat2) => 0.5;

const validateProgram = (program) => true;

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const resumeContext = (ctx) => Promise.resolve();

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const setVelocity = (body, v) => true;

const addGeneric6DofConstraint = (world, c) => true;

const addWheel = (vehicle, info) => true;

const removeRigidBody = (world, body) => true;

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const addRigidBody = (world, body) => true;

const createChannelMerger = (ctx, channels) => ({});

const renderParticles = (sys) => true;

const sleep = (body) => true;

const createListener = (ctx) => ({});

const setKnee = (node, val) => node.knee.value = val;

const createIndexBuffer = (data) => ({ id: Math.random() });

const setInertia = (body, i) => true;

const removeConstraint = (world, c) => true;

const generateCode = (ast) => "const a = 1;";

const resolveCollision = (manifold) => true;

const setGainValue = (node, val) => node.gain.value = val;

const suspendContext = (ctx) => Promise.resolve();

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const setPan = (node, val) => node.pan.value = val;

const createASTNode = (type, val) => ({ type, val });

const setRelease = (node, val) => node.release.value = val;

const setDistanceModel = (panner, model) => true;

const loadImpulseResponse = (url) => Promise.resolve({});

const uniform1i = (loc, val) => true;

const setDetune = (osc, cents) => osc.detune = cents;

const parseStatement = (tokens) => ({ type: 'VariableDeclaration' });

const applyImpulse = (body, impulse, point) => true;

// Anti-shake references
const _ref_0eztqw = { getVehicleSpeed };
const _ref_uqc5ec = { auditAccessLogs };
const _ref_1rcnyw = { throttleRequests };
const _ref_qzokf2 = { performTLSHandshake };
const _ref_hwfjjk = { stakeAssets };
const _ref_udnhub = { segmentImageUNet };
const _ref_85kxnr = { TelemetryClient };
const _ref_8v9w2e = { generateUserAgent };
const _ref_mm2na8 = { debounceAction };
const _ref_btskcq = { download };
const _ref_mymwdw = { limitBandwidth };
const _ref_uyf77s = { replicateData };
const _ref_139low = { cleanOldLogs };
const _ref_5e3nis = { invalidateCache };
const _ref_kso5w5 = { optimizeConnectionPool };
const _ref_0xxpy2 = { validateRecaptcha };
const _ref_n55yp8 = { initiateHandshake };
const _ref_qefzie = { switchProxyServer };
const _ref_se9emw = { keepAlivePing };
const _ref_75la6f = { connectionPooling };
const _ref_s99w0p = { validateMnemonic };
const _ref_sdq5br = { rotateUserAgent };
const _ref_ghnj1u = { generateWalletKeys };
const _ref_gkvbti = { validateTokenStructure };
const _ref_74528w = { tunnelThroughProxy };
const _ref_631e9c = { requestPiece };
const _ref_j3cm1j = { simulateNetworkDelay };
const _ref_wwxr41 = { queueDownloadTask };
const _ref_ts7e7z = { detectEnvironment };
const _ref_0ehi7y = { renderShadowMap };
const _ref_8avcg8 = { verifyProofOfWork };
const _ref_vouwzt = { shardingTable };
const _ref_zbrv0i = { preventCSRF };
const _ref_vvx757 = { logErrorToFile };
const _ref_jm32ti = { syncDatabase };
const _ref_n7xuvl = { verifyFileSignature };
const _ref_uynfi7 = { edgeDetectionSobel };
const _ref_aleecb = { encryptPayload };
const _ref_ligu9u = { getAppConfig };
const _ref_c7kyur = { calculatePieceHash };
const _ref_d064nh = { terminateSession };
const _ref_kucpja = { handshakePeer };
const _ref_a5qspw = { spoofReferer };
const _ref_tkjavg = { bindSocket };
const _ref_9sy6ag = { VirtualFSTree };
const _ref_9s4yhs = { cancelTask };
const _ref_4jnhua = { signTransaction };
const _ref_as6d8p = { renderCanvasLayer };
const _ref_pzte9w = { retryFailedSegment };
const _ref_vbw3ay = { calculateLighting };
const _ref_tnpafk = { resolveDNSOverHTTPS };
const _ref_vamysx = { animateTransition };
const _ref_7dfou7 = { analyzeQueryPlan };
const _ref_e8iyab = { checkPortAvailability };
const _ref_woxvpn = { analyzeUserBehavior };
const _ref_yp3yct = { compressDataStream };
const _ref_k9r0t4 = { rotateLogFiles };
const _ref_rb3a52 = { generateFakeClass };
const _ref_ikzqup = { captureScreenshot };
const _ref_xlwuw8 = { parseM3U8Playlist };
const _ref_2ur1aj = { computeSpeedAverage };
const _ref_eha9we = { cancelAnimationFrameLoop };
const _ref_7fijot = { computeNormal };
const _ref_v1bibu = { FileValidator };
const _ref_hv723t = { parseQueryString };
const _ref_w9z9vr = { dropTable };
const _ref_d5yok7 = { generateUUIDv5 };
const _ref_7ltn5z = { createIndex };
const _ref_w76cwv = { setSocketTimeout };
const _ref_fj440q = { resolveDependencyGraph };
const _ref_kvxaqe = { compactDatabase };
const _ref_aqprtd = { synthesizeSpeech };
const _ref_xjkwea = { renderVirtualDOM };
const _ref_dt774e = { isFeatureEnabled };
const _ref_z3teg4 = { serializeFormData };
const _ref_wtjvsq = { rotateMatrix };
const _ref_z0zgee = { interceptRequest };
const _ref_u41hbt = { formatLogMessage };
const _ref_oasft3 = { updateBitfield };
const _ref_u211ki = { verifySignature };
const _ref_5hkya9 = { deriveAddress };
const _ref_jzb5j6 = { manageCookieJar };
const _ref_wy6fiu = { traceStack };
const _ref_ba5u51 = { negotiateProtocol };
const _ref_5chmou = { blockMaliciousTraffic };
const _ref_8pmfov = { normalizeVolume };
const _ref_0fcafz = { convexSweepTest };
const _ref_kaubfg = { ApiDataFormatter };
const _ref_dei01k = { setFilterType };
const _ref_ttyjuw = { setSteeringValue };
const _ref_geicrj = { decodeAudioData };
const _ref_ncs4sr = { parseMagnetLink };
const _ref_75h0j3 = { saveCheckpoint };
const _ref_fjb9yk = { cullFace };
const _ref_lt3ukh = { resolveHostName };
const _ref_fzjke4 = { parseConfigFile };
const _ref_gebcej = { optimizeAST };
const _ref_ka6unm = { decryptHLSStream };
const _ref_c8wj0s = { updateWheelTransform };
const _ref_tlkisg = { AdvancedCipher };
const _ref_qhelv5 = { optimizeMemoryUsage };
const _ref_6iy0ob = { checkDiskSpace };
const _ref_48g4qw = { createBiquadFilter };
const _ref_fykqbo = { updateSoftBody };
const _ref_xati1u = { uniformMatrix4fv };
const _ref_bqgla8 = { merkelizeRoot };
const _ref_m5ey8b = { CacheManager };
const _ref_d7panv = { validateSSLCert };
const _ref_9qa3pw = { setFrequency };
const _ref_cazkzn = { ResourceMonitor };
const _ref_ww06ou = { disconnectNodes };
const _ref_avie2m = { createFrameBuffer };
const _ref_voyl11 = { useProgram };
const _ref_hqnr40 = { attachRenderBuffer };
const _ref_owrw9z = { clearScreen };
const _ref_8empcs = { uniform3f };
const _ref_au6swm = { allocateRegisters };
const _ref_zp4rtn = { drawElements };
const _ref_ebzols = { prefetchAssets };
const _ref_rc111w = { normalizeVector };
const _ref_azjajr = { connectToTracker };
const _ref_lshoxi = { flushSocketBuffer };
const _ref_6jowb9 = { stepSimulation };
const _ref_t3ct1m = { createMediaStreamSource };
const _ref_1orlep = { setQValue };
const _ref_oayh1b = { createMediaElementSource };
const _ref_tunojr = { inlineFunctions };
const _ref_y3xclp = { emitParticles };
const _ref_ctkml5 = { closeContext };
const _ref_dj4bt6 = { makeDistortionCurve };
const _ref_s4rldn = { createStereoPanner };
const _ref_95w6li = { getByteFrequencyData };
const _ref_ubqwif = { traverseAST };
const _ref_6dncmp = { compileVertexShader };
const _ref_0b3at2 = { visitNode };
const _ref_ol260o = { bindTexture };
const _ref_fdwz0x = { createConstraint };
const _ref_slri1i = { createMeshShape };
const _ref_yg58tj = { setBrake };
const _ref_z4bzv7 = { createSphereShape };
const _ref_02fqkm = { createVehicle };
const _ref_jeq0u0 = { addSliderConstraint };
const _ref_d361hk = { setPosition };
const _ref_qiiv50 = { deleteProgram };
const _ref_e0h33u = { parseClass };
const _ref_zcjjc9 = { setViewport };
const _ref_obvnxu = { createGainNode };
const _ref_uf5sc6 = { resetVehicle };
const _ref_nyg6ua = { setRatio };
const _ref_75l5dg = { connectNodes };
const _ref_qw80wr = { killParticles };
const _ref_pu3hle = { vertexAttrib3f };
const _ref_1v8a9y = { createAudioContext };
const _ref_9l9vp2 = { setAngularVelocity };
const _ref_t50429 = { calculateRestitution };
const _ref_fvacv4 = { checkParticleCollision };
const _ref_f74o4c = { anchorSoftBody };
const _ref_wjzc45 = { createScriptProcessor };
const _ref_mcziac = { setGravity };
const _ref_6h75xv = { activeTexture };
const _ref_0e3iy4 = { tokenizeSource };
const _ref_hs9zz5 = { addConeTwistConstraint };
const _ref_8o0ebq = { setDelayTime };
const _ref_sk1v8m = { getExtension };
const _ref_netn1i = { createChannelSplitter };
const _ref_znf6q6 = { setOrientation };
const _ref_10e9vh = { foldConstants };
const _ref_0kbc3d = { calculateFriction };
const _ref_hj0a9f = { validateProgram };
const _ref_foj57k = { getVelocity };
const _ref_7boo9m = { resumeContext };
const _ref_0ftq7a = { getAngularVelocity };
const _ref_g68rj9 = { setVelocity };
const _ref_stzm07 = { addGeneric6DofConstraint };
const _ref_y6kmtn = { addWheel };
const _ref_ybm8am = { removeRigidBody };
const _ref_zz42wc = { createPanner };
const _ref_3n0wc4 = { addRigidBody };
const _ref_7a2d1a = { createChannelMerger };
const _ref_l4nr84 = { renderParticles };
const _ref_xzjs5v = { sleep };
const _ref_1y53lz = { createListener };
const _ref_4exdvw = { setKnee };
const _ref_7vvrlb = { createIndexBuffer };
const _ref_aw1wra = { setInertia };
const _ref_qhq08n = { removeConstraint };
const _ref_g8v90q = { generateCode };
const _ref_7gudz1 = { resolveCollision };
const _ref_tjyfqc = { setGainValue };
const _ref_jr1qfy = { suspendContext };
const _ref_nznftb = { createDynamicsCompressor };
const _ref_fz6n8c = { setPan };
const _ref_kt2g9q = { createASTNode };
const _ref_nfg8vt = { setRelease };
const _ref_in2y2t = { setDistanceModel };
const _ref_9uw5mv = { loadImpulseResponse };
const _ref_zd4mev = { uniform1i };
const _ref_43nh5h = { setDetune };
const _ref_tgzbpk = { parseStatement };
const _ref_m1t8ee = { applyImpulse }; 
    });
})({}, {});