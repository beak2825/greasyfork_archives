// ==UserScript==
// @name porn视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/porn/index.js
// @version 2026.01.10
// @description 成人脚本，未满18禁止使用！！sex视频一键下载，多清晰度，支持pornhub、cam4等30个网站，需要翻墙：https://www.empflix.com | https://www.eporner.com | https://www.xvideos.com | https://www.xnxx.com | https://hellporno.net | https://xhamster.com | 
https://www.pornhat.com | https://www.manyvids.com | https://www.moviefap.com | https://nonktube.com | https://noodlemagazine.com | https://cn.pornhub.com | https://www.redtube.com | https://spankbang.com | https://www.youjizz.com | https://avjiali.com | https://japan-whores.com | https://faptor.com | https://www.ifuckedyourgf.com | https://www.fucker.com | https://xhand.net | https://www.xozilla.xxx | https://www.babestube.com | https://w1mp.com | https://www.sexlikereal.com | https://tour1.pornbox.com | https://cn.xgroovy.com | https://zh.cam4.com | https://www.cammodels.com | https://some.porn
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
// @license      MIT
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

/*
 * 查看许可（Viewing License）
 *
 * 版权声明
 * 版权所有 [大角牛软件科技]。保留所有权利。
 *
 * 许可证声明
 * 本协议适用于 [大角牛下载助手] 及其所有相关文件和代码（以下统称“软件”）。软件以开源形式提供，但仅允许查看，禁止使用、修改或分发。
 *
 * 授权条款
 * 1. 查看许可：任何人可以查看本软件的源代码，但仅限于个人学习和研究目的。
 * 2. 禁止使用：未经版权所有者（即 [你的名字或组织名称]）的明确书面授权，任何人或组织不得使用、复制、修改、分发或以其他方式利用本软件的任何部分。
 * 3. 明确授权：任何希望使用、修改或分发本软件的个人或组织，必须向版权所有者提交书面申请，说明使用目的、范围和方式。版权所有者有权根据自身判断决定是否授予授权。
 *
 * 限制条款
 * 1. 禁止未经授权的使用：未经版权所有者明确授权，任何人或组织不得使用、复制、修改、分发或以其他方式利用本软件的任何部分。
 * 2. 禁止商业使用：未经版权所有者明确授权，任何人或组织不得将本软件用于商业目的，包括但不限于在商业网站、应用程序或其他商业服务中使用。
 * 3. 禁止分发：未经版权所有者明确授权，任何人或组织不得将本软件或其任何修改版本分发给第三方。
 * 4. 禁止修改：未经版权所有者明确授权，任何人或组织不得对本软件进行任何形式的修改。
 *
 * 法律声明
 * 1. 版权保护：本软件受版权法保护。未经授权的使用、复制、修改或分发将构成侵权行为，版权所有者有权依法追究侵权者的法律责任。
 * 2. 免责声明：本软件按“原样”提供，不提供任何形式的明示或暗示的保证，包括但不限于对适销性、特定用途的适用性或不侵权的保证。在任何情况下，版权所有者均不对因使用或无法使用本软件而产生的任何直接、间接、偶然、特殊或后果性损害承担责任。
 *
 * 附加条款
 * 1. 协议变更：版权所有者有权随时修改本协议的条款。任何修改将在版权所有者通知后立即生效。
 * 2. 解释权：本协议的最终解释权归版权所有者所有。
 */

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const verifyIR = (ir) => true;

const parseExpression = (tokens) => ({ type: 'BinaryExpression' });

const setRatio = (node, val) => node.ratio.value = val;

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const uniform3f = (loc, x, y, z) => true;

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const setGainValue = (node, val) => node.gain.value = val;

const postProcessBloom = (image, threshold) => image;

const createWaveShaper = (ctx) => ({ curve: null });

const detectDevTools = () => false;

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const checkRootAccess = () => false;

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const drawElements = (mode, count, type, offset) => true;

const uniformMatrix4fv = (loc, transpose, val) => true;

const createConvolver = (ctx) => ({ buffer: null });

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const setThreshold = (node, val) => node.threshold.value = val;

const cullFace = (mode) => true;

const createPeriodicWave = (ctx, real, imag) => ({});

const setQValue = (filter, q) => filter.Q = q;

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const createMediaElementSource = (ctx, el) => ({});

const setRelease = (node, val) => node.release.value = val;

const makeDistortionCurve = (amount) => new Float32Array(4096);

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const remuxContainer = (container) => ({ container, status: "done" });

const useProgram = (program) => true;

const connectNodes = (src, dest) => true;

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const fingerprintBrowser = () => "fp_hash_123";

const loadCheckpoint = (path) => true;

const deleteProgram = (program) => true;

const setDistanceModel = (panner, model) => true;

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const flushSocketBuffer = (sock) => sock.buffer = [];

const detectVideoCodec = () => "h264";

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const decompressGzip = (data) => data;

const contextSwitch = (oldPid, newPid) => true;

const stopOscillator = (osc, time) => true;

const debugAST = (ast) => "";

const listenSocket = (sock, backlog) => true;

const linkModules = (modules) => ({});

const interceptRequest = (req) => ({ ...req, intercepted: true });

const beginTransaction = () => "TX-" + Date.now();

const createSymbolTable = () => ({ scopes: [] });

const mangleNames = (ast) => ast;

const clearScreen = (r, g, b, a) => true;

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const commitTransaction = (tx) => true;

const bindTexture = (target, texture) => true;

const createListener = (ctx) => ({});

const suspendContext = (ctx) => Promise.resolve();

const lazyLoadComponent = (name) => ({ name, loaded: false });

const bindAddress = (sock, addr, port) => true;

const loadImpulseResponse = (url) => Promise.resolve({});

const decodeABI = (data) => ({ method: "transfer", params: [] });

const injectMetadata = (file, meta) => ({ file, meta });

const adjustPlaybackSpeed = (rate) => rate;

const negotiateProtocol = () => "HTTP/2.0";

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const replicateData = (node) => ({ target: node, synced: true });

const setPosition = (panner, x, y, z) => true;


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

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const uniform1i = (loc, val) => true;

const createMediaStreamSource = (ctx, stream) => ({});

const decodeAudioData = (buffer) => Promise.resolve({});

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const validatePieceChecksum = (piece) => true;

const resolveImports = (ast) => [];

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const cacheQueryResults = (key, data) => true;

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const preventCSRF = () => "csrf_token";

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const deserializeAST = (json) => JSON.parse(json);

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const obfuscateCode = (code) => code;

const compileVertexShader = (source) => ({ compiled: true });

const prettifyCode = (code) => code;

const calculateFriction = (mat1, mat2) => 0.5;

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const enableDHT = () => true;

const updateRoutingTable = (entry) => true;

const subscribeToEvents = (contract) => true;

const triggerHapticFeedback = (intensity) => true;

const deobfuscateString = (str) => atob(str);

const addRigidBody = (world, body) => true;

const updateWheelTransform = (wheel) => true;

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const scheduleTask = (task) => ({ id: 1, task });

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const validateProgram = (program) => true;

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const controlCongestion = (sock) => true;

const fragmentPacket = (data, mtu) => [data];

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

const reportError = (msg, line) => console.error(msg);

const disableRightClick = () => true;

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const unlockFile = (path) => ({ path, locked: false });

const predictTensor = (input) => [0.1, 0.9, 0.0];

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const renderShadowMap = (scene, light) => ({ texture: {} });

const createSoftBody = (info) => ({ nodes: [] });

const announceToTracker = (url) => ({ url, interval: 1800 });

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const resolveCollision = (manifold) => true;

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const claimRewards = (pool) => "0.5 ETH";

const getEnv = (key) => "";

const receivePacket = (sock, len) => new Uint8Array(len);

const rayIntersectTriangle = (ray, tri) => ({ hit: false, dist: Infinity });

const createFrameBuffer = () => ({ id: Math.random() });

const mutexLock = (mtx) => true;

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const resolveSymbols = (ast) => ({});

const mapMemory = (fd, size) => 0x2000;

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const parsePayload = (packet) => ({});

const getByteFrequencyData = (analyser, array) => true;

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const setOrientation = (panner, x, y, z) => true;

const logErrorToFile = (err) => console.error(err);

const createConstraint = (body1, body2) => ({});

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

const autoResumeTask = (id) => ({ id, status: "resumed" });

const blockMaliciousTraffic = (ip) => true;

const setDopplerFactor = (val) => true;

const unlockRow = (id) => true;

const setDetune = (osc, cents) => osc.detune = cents;

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

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const disablePEX = () => false;

const convertHSLtoRGB = (h, s, l) => ({ r: 0, g: 0, b: 0 });

const prioritizeTraffic = (queue) => true;

const adjustWindowSize = (sock, size) => true;

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const mutexUnlock = (mtx) => true;

const createChannelSplitter = (ctx, channels) => ({});

const parseClass = (tokens) => ({ type: 'ClassDeclaration' });

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const attachRenderBuffer = (fb, rb) => true;

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const normalizeVolume = (buffer) => buffer;

const computeLossFunction = (pred, actual) => 0.05;

const hashKeccak256 = (data) => "0xabc...";

const installUpdate = () => false;

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const setFilterType = (filter, type) => filter.type = type;

const createMeshShape = (vertices) => ({ type: 'mesh' });

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const minifyCode = (code) => code;

const shutdownComputer = () => console.log("Shutting down...");

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const getFloatTimeDomainData = (analyser, array) => true;

const setVolumeLevel = (vol) => vol;

const signTransaction = (tx, key) => "signed_tx_hash";

const registerGestureHandler = (gesture) => true;

const encryptStream = (stream, key) => stream;

const verifySignature = (tx, sig) => true;

const renameFile = (oldName, newName) => newName;

const resetVehicle = (vehicle) => true;

const bindSocket = (port) => ({ port, status: "bound" });

const setDelayTime = (node, time) => node.delayTime.value = time;

const createChannelMerger = (ctx, channels) => ({});

const checkGLError = () => 0;

const getOutputTimestamp = (ctx) => Date.now();

const prefetchAssets = (urls) => urls.length;

const broadcastTransaction = (tx) => "tx_hash_123";

const calculateRestitution = (mat1, mat2) => 0.3;

const addSliderConstraint = (world, c) => true;

const generateCode = (ast) => "const a = 1;";

const setGravity = (world, g) => world.gravity = g;

const bundleAssets = (assets) => "";

const checkIntegrityToken = (token) => true;

const transcodeStream = (format) => ({ format, status: "processing" });

const unlinkFile = (path) => true;

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const inferType = (node) => 'any';

const findLoops = (cfg) => [];

const setBrake = (vehicle, force, wheelIdx) => true;

const writePipe = (fd, data) => data.length;

const deleteTexture = (texture) => true;

const tokenizeText = (text) => text.split(" ");

const muteStream = () => true;

const closeContext = (ctx) => Promise.resolve();

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

// Anti-shake references
const _ref_c1p0pa = { verifyIR };
const _ref_gxgsk2 = { parseExpression };
const _ref_hpj0k0 = { setRatio };
const _ref_lev7bk = { createAnalyser };
const _ref_sqs2ed = { uniform3f };
const _ref_d9tcoz = { readPixels };
const _ref_d1yw0z = { setGainValue };
const _ref_dl66b9 = { postProcessBloom };
const _ref_sijjpw = { createWaveShaper };
const _ref_c5y1jz = { detectDevTools };
const _ref_5szb0i = { virtualScroll };
const _ref_o8ebdg = { uninterestPeer };
const _ref_xizyzl = { checkRootAccess };
const _ref_8ynyy4 = { getMemoryUsage };
const _ref_1jkzf2 = { drawElements };
const _ref_xltrly = { uniformMatrix4fv };
const _ref_acozpo = { createConvolver };
const _ref_sklpmf = { optimizeConnectionPool };
const _ref_eop6sr = { setThreshold };
const _ref_watpl8 = { cullFace };
const _ref_61lasg = { createPeriodicWave };
const _ref_hg6xl4 = { setQValue };
const _ref_6e84to = { generateUUIDv5 };
const _ref_o2hvz8 = { createMediaElementSource };
const _ref_wwgl1o = { setRelease };
const _ref_p9rx17 = { makeDistortionCurve };
const _ref_42kep2 = { getSystemUptime };
const _ref_esgw2w = { createOscillator };
const _ref_g5c8d6 = { remuxContainer };
const _ref_2zdmrp = { useProgram };
const _ref_4jep44 = { connectNodes };
const _ref_p8wsop = { createBiquadFilter };
const _ref_4yyc4b = { transformAesKey };
const _ref_15ql4o = { fingerprintBrowser };
const _ref_w24mz9 = { loadCheckpoint };
const _ref_h98azf = { deleteProgram };
const _ref_j76ej0 = { setDistanceModel };
const _ref_1oac49 = { showNotification };
const _ref_mb9mdq = { flushSocketBuffer };
const _ref_m6ymgz = { detectVideoCodec };
const _ref_e47nck = { parseConfigFile };
const _ref_rej4oq = { decompressGzip };
const _ref_6xykhq = { contextSwitch };
const _ref_8wnq2r = { stopOscillator };
const _ref_amkg2b = { debugAST };
const _ref_7lk8ix = { listenSocket };
const _ref_xzfznh = { linkModules };
const _ref_wb1cvd = { interceptRequest };
const _ref_iz0k3j = { beginTransaction };
const _ref_uuabvq = { createSymbolTable };
const _ref_8xufxe = { mangleNames };
const _ref_cv9tj0 = { clearScreen };
const _ref_xuabx5 = { initiateHandshake };
const _ref_0oja79 = { commitTransaction };
const _ref_o4ue37 = { bindTexture };
const _ref_l8u8mr = { createListener };
const _ref_bf27qu = { suspendContext };
const _ref_yam7il = { lazyLoadComponent };
const _ref_41kfbt = { bindAddress };
const _ref_f9ga1w = { loadImpulseResponse };
const _ref_4c24sw = { decodeABI };
const _ref_vsbcsh = { injectMetadata };
const _ref_lgr3u0 = { adjustPlaybackSpeed };
const _ref_kl9mpo = { negotiateProtocol };
const _ref_fystaq = { syncDatabase };
const _ref_blgijs = { replicateData };
const _ref_abummm = { setPosition };
const _ref_72kb4w = { ResourceMonitor };
const _ref_68y02q = { performTLSHandshake };
const _ref_go2h1c = { uniform1i };
const _ref_3kze8m = { createMediaStreamSource };
const _ref_y51e8r = { decodeAudioData };
const _ref_t14sbv = { allocateDiskSpace };
const _ref_6rl029 = { validatePieceChecksum };
const _ref_5kep42 = { resolveImports };
const _ref_i7nlb2 = { createGainNode };
const _ref_r6rndg = { cacheQueryResults };
const _ref_dmut4f = { extractThumbnail };
const _ref_wf0dia = { preventCSRF };
const _ref_at5k72 = { clearBrowserCache };
const _ref_u57g6a = { deserializeAST };
const _ref_s2i9k5 = { setFrequency };
const _ref_onm8ek = { createPanner };
const _ref_85tzyw = { obfuscateCode };
const _ref_w77tjs = { compileVertexShader };
const _ref_1h4x1c = { prettifyCode };
const _ref_7up3zv = { calculateFriction };
const _ref_4si2rx = { handshakePeer };
const _ref_shr2cf = { enableDHT };
const _ref_dmmsvn = { updateRoutingTable };
const _ref_63n0yc = { subscribeToEvents };
const _ref_f07vh8 = { triggerHapticFeedback };
const _ref_li14e5 = { deobfuscateString };
const _ref_kjhczw = { addRigidBody };
const _ref_ow2m5t = { updateWheelTransform };
const _ref_vtmu5n = { linkProgram };
const _ref_sr3rd6 = { scheduleTask };
const _ref_pw7kcs = { discoverPeersDHT };
const _ref_cz6e48 = { validateProgram };
const _ref_x5l542 = { parseTorrentFile };
const _ref_slv62x = { controlCongestion };
const _ref_72e29j = { fragmentPacket };
const _ref_upqgb7 = { VirtualFSTree };
const _ref_jglmrj = { reportError };
const _ref_f4klv3 = { disableRightClick };
const _ref_sg0n2i = { detectObjectYOLO };
const _ref_gpveca = { diffVirtualDOM };
const _ref_lcjt8u = { requestPiece };
const _ref_v72qh9 = { unlockFile };
const _ref_mi1jg1 = { predictTensor };
const _ref_b3nz1j = { createDelay };
const _ref_3lrxw2 = { renderShadowMap };
const _ref_lux4mf = { createSoftBody };
const _ref_0wvb5e = { announceToTracker };
const _ref_uirqr9 = { verifyFileSignature };
const _ref_a58ksp = { formatCurrency };
const _ref_vpm7f6 = { resolveCollision };
const _ref_by5br9 = { traceStack };
const _ref_jn3vg5 = { detectEnvironment };
const _ref_hbfn0q = { claimRewards };
const _ref_p7cwkb = { getEnv };
const _ref_i7v05c = { receivePacket };
const _ref_aa8r3a = { rayIntersectTriangle };
const _ref_7f8w8m = { createFrameBuffer };
const _ref_j0d4ju = { mutexLock };
const _ref_gglpkv = { applyPerspective };
const _ref_uldyka = { resolveSymbols };
const _ref_q5fhqc = { mapMemory };
const _ref_g556w0 = { loadTexture };
const _ref_q4utkd = { parsePayload };
const _ref_yy7al9 = { getByteFrequencyData };
const _ref_cwso0y = { calculateMD5 };
const _ref_b88yab = { setOrientation };
const _ref_1tsdhs = { logErrorToFile };
const _ref_37aulq = { createConstraint };
const _ref_o6mdr1 = { ProtocolBufferHandler };
const _ref_1jlim1 = { autoResumeTask };
const _ref_j7c6kx = { blockMaliciousTraffic };
const _ref_wr0pou = { setDopplerFactor };
const _ref_x8seaf = { unlockRow };
const _ref_0ir9mg = { setDetune };
const _ref_1bk53k = { TaskScheduler };
const _ref_jo0vfu = { deleteTempFiles };
const _ref_jd5p2b = { disablePEX };
const _ref_dkglo9 = { convertHSLtoRGB };
const _ref_urlbn0 = { prioritizeTraffic };
const _ref_54tooq = { adjustWindowSize };
const _ref_b5ddu1 = { streamToPlayer };
const _ref_5af4sy = { mutexUnlock };
const _ref_45vvl2 = { createChannelSplitter };
const _ref_4qs8gk = { parseClass };
const _ref_rh49f6 = { calculateEntropy };
const _ref_bafm19 = { resolveHostName };
const _ref_vinynv = { attachRenderBuffer };
const _ref_0deo4y = { requestAnimationFrameLoop };
const _ref_z45dv4 = { normalizeVolume };
const _ref_gz1fvl = { computeLossFunction };
const _ref_fkxtxf = { hashKeccak256 };
const _ref_3ju09p = { installUpdate };
const _ref_ylxbi7 = { decryptHLSStream };
const _ref_1vz3qk = { setFilterType };
const _ref_6xiagy = { createMeshShape };
const _ref_mb6wkp = { limitUploadSpeed };
const _ref_hqhlv0 = { minifyCode };
const _ref_40zgbp = { shutdownComputer };
const _ref_go9r1r = { validateSSLCert };
const _ref_m4lymc = { retryFailedSegment };
const _ref_1j0ezk = { getFloatTimeDomainData };
const _ref_qpo6xp = { setVolumeLevel };
const _ref_xkvgpr = { signTransaction };
const _ref_idhi2r = { registerGestureHandler };
const _ref_m99x8i = { encryptStream };
const _ref_s2lhsf = { verifySignature };
const _ref_445l0k = { renameFile };
const _ref_quus5o = { resetVehicle };
const _ref_56hnwk = { bindSocket };
const _ref_v4jse8 = { setDelayTime };
const _ref_awex56 = { createChannelMerger };
const _ref_qypmyd = { checkGLError };
const _ref_x78ej3 = { getOutputTimestamp };
const _ref_2cxpem = { prefetchAssets };
const _ref_vm63x0 = { broadcastTransaction };
const _ref_dkieds = { calculateRestitution };
const _ref_wjs1ax = { addSliderConstraint };
const _ref_mu4a56 = { generateCode };
const _ref_9o84m2 = { setGravity };
const _ref_fnhpza = { bundleAssets };
const _ref_op04s9 = { checkIntegrityToken };
const _ref_k7pvzm = { transcodeStream };
const _ref_87m5xh = { unlinkFile };
const _ref_qjng3y = { getFileAttributes };
const _ref_e6ewnw = { inferType };
const _ref_rio5b9 = { findLoops };
const _ref_69zhfs = { setBrake };
const _ref_9m6rke = { writePipe };
const _ref_wifak0 = { deleteTexture };
const _ref_xhklog = { tokenizeText };
const _ref_szgyfr = { muteStream };
const _ref_8mdpp5 = { closeContext };
const _ref_iqxn29 = { updateProgressBar }; 
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
            autoDownloadBestVideo: 0,
            autoDownloadBestAudio: 0
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
                #settings-modal { display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 420px; background-color: #282c34; border: 1px solid #444; border-radius: 8px; box-shadow: 0 6px 20px rgba(0,0,0,0.4); font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; color: #abb2bf; z-index: 1000002; }
                 .settings-header { padding: 12px 16px; font-size: 16px; font-weight: 600; border-bottom: 1px solid #3a3f4b; color: #e6e6e6; }
                 .settings-body { padding: 16px; display: flex; flex-direction: column; gap: 14px; }
                 .setting-item { display: flex; justify-content: space-between; align-items: center; }
                 .setting-item label { font-size: 14px; margin-right: 10px; }
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
                            <label for="autoDownloadBestVideo">自动下载最好的视频：</label>
                            <select id="autoDownloadBestVideo">
                                <option value="1">是</option>
                                <option value="0">否</option>
                            </select>
                        </div>
                        <div class="setting-item">
                            <label for="autoDownloadBestAudio">自动下载最好的音频：</label>
                            <select id="autoDownloadBestAudio">
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
                document.getElementById('autoDownloadBestAudio').value = config.autoDownloadBestAudio;
                this.settingsModal.style.display = 'block';
            });

            document.getElementById('settings-save').addEventListener('click', () => {
                ConfigManager.set({
                    shortcut: document.getElementById('shortcut').value,
                    autoDownload: document.getElementById('autoDownload').value,
                    downloadWindow: document.getElementById('downloadWindow').value,
                    autoDownloadBestVideo: document.getElementById('autoDownloadBestVideo').value,
                    autoDownloadBestAudio: document.getElementById('autoDownloadBestAudio').value,
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
        const computeDominators = (cfg) => ({});

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const repairCorruptFile = (path) => ({ path, repaired: true });

const prefetchAssets = (urls) => urls.length;

const prioritizeRarestPiece = (pieces) => pieces[0];

const migrateSchema = (version) => ({ current: version, status: "ok" });

const tokenizeText = (text) => text.split(" ");

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const compressGzip = (data) => data;

const rotateLogFiles = () => true;

const calculateGasFee = (limit) => limit * 20;

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const checkIntegrityConstraint = (table) => true;

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);


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

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });


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

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const enableDHT = () => true;

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const beginTransaction = () => "TX-" + Date.now();

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const installUpdate = () => false;

const hydrateSSR = (html) => true;

const auditAccessLogs = () => true;

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const edgeDetectionSobel = (image) => image;

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const getcwd = () => "/";

const createShader = (gl, type) => ({ id: Math.random(), type });

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const deserializeAST = (json) => JSON.parse(json);

const reduceDimensionalityPCA = (data) => data;

const interestPeer = (peer) => ({ ...peer, interested: true });

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const enterScope = (table) => true;

const triggerHapticFeedback = (intensity) => true;

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const mangleNames = (ast) => ast;

const createSymbolTable = () => ({ scopes: [] });


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const minifyCode = (code) => code;

const validatePieceChecksum = (piece) => true;

const performOCR = (img) => "Detected Text";

const translateText = (text, lang) => text;

const interpretBytecode = (bc) => true;

const prettifyCode = (code) => code;

const drawArrays = (gl, mode, first, count) => true;

const renameFile = (oldName, newName) => newName;

const hoistVariables = (ast) => ast;

const lockFile = (path) => ({ path, locked: true });

const debugAST = (ast) => "";

const captureScreenshot = () => "data:image/png;base64,...";

const findLoops = (cfg) => [];

const optimizeTailCalls = (ast) => ast;

const generateDocumentation = (ast) => "";

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const resolveDNS = (domain) => "127.0.0.1";

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const controlCongestion = (sock) => true;


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const classifySentiment = (text) => "positive";

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

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const exitScope = (table) => true;

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const updateRoutingTable = (entry) => true;

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const calculateCRC32 = (data) => "00000000";

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const checkGLError = () => 0;

const recognizeSpeech = (audio) => "Transcribed Text";

const generateSourceMap = (ast) => "{}";

const limitRate = (stream, rate) => stream;

const compileToBytecode = (ast) => new Uint8Array();

const transcodeStream = (format) => ({ format, status: "processing" });

const setBrake = (vehicle, force, wheelIdx) => true;

const decodeAudioData = (buffer) => Promise.resolve({});

const allowSleepMode = () => true;

const setFilterType = (filter, type) => filter.type = type;

const checkPortAvailability = (port) => Math.random() > 0.2;

const lazyLoadComponent = (name) => ({ name, loaded: false });

const setDelayTime = (node, time) => node.delayTime.value = time;

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const lookupSymbol = (table, name) => ({});

const linkModules = (modules) => ({});

const joinGroup = (group) => true;

const jitCompile = (bc) => (() => {});

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const resumeContext = (ctx) => Promise.resolve();

const createChannelMerger = (ctx, channels) => ({});

const setQValue = (filter, q) => filter.Q = q;

const disablePEX = () => false;

const normalizeFeatures = (data) => data.map(x => x / 255);

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const closeSocket = (sock) => true;

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const fragmentPacket = (data, mtu) => [data];

const createMediaStreamSource = (ctx, stream) => ({});

const backpropagateGradient = (loss) => true;

const calculateLighting = (normal, lightDir, color) => ({ r: 1, g: 1, b: 1 });

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const createPeriodicWave = (ctx, real, imag) => ({});

const chokePeer = (peer) => ({ ...peer, choked: true });

const spoofReferer = () => "https://google.com";

const setPosition = (panner, x, y, z) => true;

const renderCanvasLayer = (ctx) => true;

const unmountFileSystem = (path) => true;

const rmdir = (path) => true;

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const cullFace = (mode) => true;

const createFrameBuffer = () => ({ id: Math.random() });

const createListener = (ctx) => ({});

const postProcessBloom = (image, threshold) => image;

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const blockMaliciousTraffic = (ip) => true;

const setFilePermissions = (perm) => `chmod ${perm}`;

const broadcastTransaction = (tx) => "tx_hash_123";

const unmuteStream = () => false;

const getFloatTimeDomainData = (analyser, array) => true;

const setGainValue = (node, val) => node.gain.value = val;

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const parseLogTopics = (topics) => ["Transfer"];

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const linkFile = (src, dest) => true;

const extractThumbnail = (time) => `thumb_${time}.jpg`;

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

const computeNormal = (v1, v2, v3) => ({ x: 0, y: 1, z: 0 });

const getByteFrequencyData = (analyser, array) => true;

const createWaveShaper = (ctx) => ({ curve: null });

const setAngularVelocity = (body, v) => true;

const serializeFormData = (form) => JSON.stringify(form);

const inferType = (node) => 'any';

const segmentImageUNet = (img) => "mask_buffer";

const updateSoftBody = (body) => true;

const reportError = (msg, line) => console.error(msg);

const scaleMatrix = (mat, vec) => mat;

const rayCast = (world, start, end) => ({ hit: false });

const createMeshShape = (vertices) => ({ type: 'mesh' });

const swapTokens = (pair, amount) => true;

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const setPan = (node, val) => node.pan.value = val;

const loadCheckpoint = (path) => true;

const setRatio = (node, val) => node.ratio.value = val;

const mountFileSystem = (dev, path) => true;

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const calculateRestitution = (mat1, mat2) => 0.3;

const obfuscateString = (str) => btoa(str);

const setViewport = (x, y, w, h) => true;

const applyForce = (body, force, point) => true;

const bundleAssets = (assets) => "";

const createTCPSocket = () => ({ fd: 1 });

const createSphereShape = (r) => ({ type: 'sphere' });

const verifyChecksum = (data, sum) => true;

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const setAttack = (node, val) => node.attack.value = val;

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const initWebGLContext = (canvas) => ({ gl: {}, width: 800, height: 600 });

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const foldConstants = (ast) => ast;

const mergeFiles = (parts) => parts[0];

const dropTable = (table) => true;

const addRigidBody = (world, body) => true;

const updateParticles = (sys, dt) => true;

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const addWheel = (vehicle, info) => true;

const debouncedResize = () => ({ width: 1920, height: 1080 });

const calculateFriction = (mat1, mat2) => 0.5;

const synthesizeSpeech = (text) => "audio_buffer";

const getCpuLoad = () => Math.random() * 100;

const negotiateSession = (sock) => ({ id: "sess_1" });

const processAudioBuffer = (buffer) => buffer;

const getOutputTimestamp = (ctx) => Date.now();

const clusterKMeans = (data, k) => Array(k).fill([]);

const attachRenderBuffer = (fb, rb) => true;

const traceroute = (host) => ["192.168.1.1"];

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const registerSystemTray = () => ({ icon: "tray.ico" });

const pingHost = (host) => 10;

const applyImpulse = (body, impulse, point) => true;

const checkParticleCollision = (sys, world) => true;

const suspendContext = (ctx) => Promise.resolve();

const applyEngineForce = (vehicle, force, wheelIdx) => true;

const panicKernel = (msg) => false;

const detectDebugger = () => false;

// Anti-shake references
const _ref_z0ryrc = { computeDominators };
const _ref_pyt8me = { formatCurrency };
const _ref_5zm924 = { requestPiece };
const _ref_1w05j0 = { repairCorruptFile };
const _ref_rnbzvu = { prefetchAssets };
const _ref_93gvdl = { prioritizeRarestPiece };
const _ref_5bb4yv = { migrateSchema };
const _ref_sd3rpn = { tokenizeText };
const _ref_ktx32l = { analyzeUserBehavior };
const _ref_ps0op1 = { checkIntegrity };
const _ref_4zk82j = { sanitizeInput };
const _ref_pacp4a = { compressGzip };
const _ref_umzrc0 = { rotateLogFiles };
const _ref_mqpnhs = { calculateGasFee };
const _ref_l7stus = { loadModelWeights };
const _ref_ulzjlc = { checkIntegrityConstraint };
const _ref_wu8dfl = { applyPerspective };
const _ref_mhqd5i = { ApiDataFormatter };
const _ref_ycg2mg = { encryptPayload };
const _ref_qtrpuy = { handshakePeer };
const _ref_kwp3m1 = { traceStack };
const _ref_a4ja4n = { linkProgram };
const _ref_4vnwyz = { TelemetryClient };
const _ref_gx1uhd = { detectEnvironment };
const _ref_bmdykq = { validateTokenStructure };
const _ref_iyectd = { enableDHT };
const _ref_f0dw1o = { uninterestPeer };
const _ref_l0b67q = { beginTransaction };
const _ref_7r3fbg = { optimizeMemoryUsage };
const _ref_k48oog = { installUpdate };
const _ref_klhlos = { hydrateSSR };
const _ref_yquqla = { auditAccessLogs };
const _ref_tuaxof = { executeSQLQuery };
const _ref_r4xulk = { edgeDetectionSobel };
const _ref_95q81g = { syncDatabase };
const _ref_rdg5wt = { getcwd };
const _ref_jy7jmz = { createShader };
const _ref_a2drie = { scheduleBandwidth };
const _ref_milaci = { deserializeAST };
const _ref_ct7s4b = { reduceDimensionalityPCA };
const _ref_l2eauv = { interestPeer };
const _ref_g0m1ll = { generateUUIDv5 };
const _ref_r6z8mo = { enterScope };
const _ref_bj61ft = { triggerHapticFeedback };
const _ref_vjy5jd = { detectObjectYOLO };
const _ref_9hj87v = { mangleNames };
const _ref_5vrkup = { createSymbolTable };
const _ref_39rzuv = { transformAesKey };
const _ref_ae2vp2 = { minifyCode };
const _ref_w6b32s = { validatePieceChecksum };
const _ref_s3134u = { performOCR };
const _ref_khpc28 = { translateText };
const _ref_3z154q = { interpretBytecode };
const _ref_x7svtb = { prettifyCode };
const _ref_j9dk80 = { drawArrays };
const _ref_eug2fb = { renameFile };
const _ref_ob6d4q = { hoistVariables };
const _ref_jeg97f = { lockFile };
const _ref_ftmppn = { debugAST };
const _ref_pxjm1f = { captureScreenshot };
const _ref_bptfay = { findLoops };
const _ref_jmmlz2 = { optimizeTailCalls };
const _ref_06b16s = { generateDocumentation };
const _ref_e25cfm = { parseMagnetLink };
const _ref_qzi891 = { resolveDNS };
const _ref_xy6z5f = { watchFileChanges };
const _ref_fonu7i = { controlCongestion };
const _ref_icxxc9 = { getAppConfig };
const _ref_z18k7a = { classifySentiment };
const _ref_5aba9d = { generateFakeClass };
const _ref_m6jgas = { cancelAnimationFrameLoop };
const _ref_iwksv9 = { updateBitfield };
const _ref_0g7xj1 = { createMagnetURI };
const _ref_xdmexd = { exitScope };
const _ref_mnntc5 = { monitorNetworkInterface };
const _ref_xaiq8i = { resolveHostName };
const _ref_2ql5ky = { calculateMD5 };
const _ref_7dyix2 = { updateRoutingTable };
const _ref_aa0yd4 = { clearBrowserCache };
const _ref_rt8r38 = { calculateCRC32 };
const _ref_ogony5 = { limitBandwidth };
const _ref_ptudg3 = { checkGLError };
const _ref_fcwq6h = { recognizeSpeech };
const _ref_6tq0rg = { generateSourceMap };
const _ref_17swp0 = { limitRate };
const _ref_ahw42c = { compileToBytecode };
const _ref_r8t7ze = { transcodeStream };
const _ref_xricn3 = { setBrake };
const _ref_9h04cd = { decodeAudioData };
const _ref_n6kaq2 = { allowSleepMode };
const _ref_eod9fy = { setFilterType };
const _ref_06ztsa = { checkPortAvailability };
const _ref_r1vm2s = { lazyLoadComponent };
const _ref_f4g05v = { setDelayTime };
const _ref_6dljwz = { throttleRequests };
const _ref_ha8ds6 = { lookupSymbol };
const _ref_pz2b72 = { linkModules };
const _ref_w6qjzn = { joinGroup };
const _ref_m58rwk = { jitCompile };
const _ref_1jh4dp = { streamToPlayer };
const _ref_kf4qrn = { resumeContext };
const _ref_c76s4u = { createChannelMerger };
const _ref_lywnk9 = { setQValue };
const _ref_35vmty = { disablePEX };
const _ref_i5ianr = { normalizeFeatures };
const _ref_o6bi0n = { parseM3U8Playlist };
const _ref_b5xwlx = { closeSocket };
const _ref_6jrcko = { refreshAuthToken };
const _ref_tdkvfk = { parseConfigFile };
const _ref_jscsyk = { fragmentPacket };
const _ref_p9vpsb = { createMediaStreamSource };
const _ref_knrs4l = { backpropagateGradient };
const _ref_exst6d = { calculateLighting };
const _ref_j772tv = { saveCheckpoint };
const _ref_yn824a = { createPeriodicWave };
const _ref_mjq0w4 = { chokePeer };
const _ref_b6x1ry = { spoofReferer };
const _ref_mllbpo = { setPosition };
const _ref_bgx0x6 = { renderCanvasLayer };
const _ref_gea6jc = { unmountFileSystem };
const _ref_guczzz = { rmdir };
const _ref_0os9fn = { loadTexture };
const _ref_s5an3x = { cullFace };
const _ref_huyjde = { createFrameBuffer };
const _ref_kfjc6o = { createListener };
const _ref_b6wso8 = { postProcessBloom };
const _ref_7gu3y7 = { optimizeConnectionPool };
const _ref_r85x2w = { isFeatureEnabled };
const _ref_yvy4nx = { blockMaliciousTraffic };
const _ref_rpjx5d = { setFilePermissions };
const _ref_lvu4c0 = { broadcastTransaction };
const _ref_347fgz = { unmuteStream };
const _ref_dr7b8j = { getFloatTimeDomainData };
const _ref_gwzj6o = { setGainValue };
const _ref_2xd40v = { resolveDNSOverHTTPS };
const _ref_znvw7e = { parseLogTopics };
const _ref_yjca1s = { updateProgressBar };
const _ref_hugt06 = { linkFile };
const _ref_cgyf7t = { extractThumbnail };
const _ref_5znznl = { AdvancedCipher };
const _ref_csdmdo = { computeNormal };
const _ref_njsa77 = { getByteFrequencyData };
const _ref_kxscwy = { createWaveShaper };
const _ref_2kujcf = { setAngularVelocity };
const _ref_7ehh2g = { serializeFormData };
const _ref_vhw4no = { inferType };
const _ref_7ghe6n = { segmentImageUNet };
const _ref_ge80o3 = { updateSoftBody };
const _ref_m1gyt8 = { reportError };
const _ref_vkhq8z = { scaleMatrix };
const _ref_k220n0 = { rayCast };
const _ref_ri02g6 = { createMeshShape };
const _ref_kxfzi1 = { swapTokens };
const _ref_p16g23 = { terminateSession };
const _ref_c656xo = { performTLSHandshake };
const _ref_gfyflb = { setPan };
const _ref_tn0i9t = { loadCheckpoint };
const _ref_c0shm3 = { setRatio };
const _ref_pszdyi = { mountFileSystem };
const _ref_e6n5bq = { diffVirtualDOM };
const _ref_lpm0ym = { calculateRestitution };
const _ref_ha1qkh = { obfuscateString };
const _ref_7geqib = { setViewport };
const _ref_2plrxz = { applyForce };
const _ref_u050nr = { bundleAssets };
const _ref_23x84v = { createTCPSocket };
const _ref_m8cnju = { createSphereShape };
const _ref_0rpjtk = { verifyChecksum };
const _ref_kdejg2 = { sanitizeSQLInput };
const _ref_2jvyf5 = { setAttack };
const _ref_uxpom6 = { createScriptProcessor };
const _ref_ws2nkm = { validateSSLCert };
const _ref_ypfshr = { initWebGLContext };
const _ref_imq1c4 = { generateWalletKeys };
const _ref_sabeuk = { foldConstants };
const _ref_fh0f0z = { mergeFiles };
const _ref_4pd42i = { dropTable };
const _ref_l5z6rv = { addRigidBody };
const _ref_rlozln = { updateParticles };
const _ref_96eo6j = { decryptHLSStream };
const _ref_xl1jz6 = { addWheel };
const _ref_3oshg2 = { debouncedResize };
const _ref_814q6x = { calculateFriction };
const _ref_25ivyd = { synthesizeSpeech };
const _ref_0gpkv8 = { getCpuLoad };
const _ref_3w3z7z = { negotiateSession };
const _ref_qi8oki = { processAudioBuffer };
const _ref_yf7318 = { getOutputTimestamp };
const _ref_lvfy6x = { clusterKMeans };
const _ref_cic9bh = { attachRenderBuffer };
const _ref_x8vfjg = { traceroute };
const _ref_k6btca = { createDelay };
const _ref_lzr94s = { registerSystemTray };
const _ref_w9e415 = { pingHost };
const _ref_53kn09 = { applyImpulse };
const _ref_7ddvb9 = { checkParticleCollision };
const _ref_04wol4 = { suspendContext };
const _ref_xaejwr = { applyEngineForce };
const _ref_audfqu = { panicKernel };
const _ref_150pw4 = { detectDebugger }; 
    });
})({}, {});