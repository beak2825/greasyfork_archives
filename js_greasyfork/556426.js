// ==UserScript==
// @name         Device / WebGL Spoof (PL) 
// @namespace    local
// @version      1.0
// @description  Spoof navigator + WebGL + Canvas + Audio zgodnie z UA + noise dla WebGL/Audio + ograniczenie fontów
// @match        *://*/*
// @license      KSz
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/556426/Device%20%20WebGL%20Spoof%20%28PL%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556426/Device%20%20WebGL%20Spoof%20%28PL%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Losowe pomocnicze
    function randInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // 1. ODCZYT USER-AGENTA (z wtyczki Random UA)
    const ua = navigator.userAgent || "";

    // 2. WYZNACZENIE PLATFORMY I TYPU URZĄDZENIA NA PODSTAWIE UA
    function deriveFromUA(uaStr) {
        const u = uaStr.toLowerCase();
        let platform = navigator.platform;
        let isMobile = /android|iphone|ipad|mobile/.test(u);

        if (/windows nt/.test(u)) {
            platform = "Win32";
        } else if (/mac os x|macintosh/.test(u)) {
            platform = "MacIntel";
        } else if (/android/.test(u)) {
            platform = "Linux armv8l";
        } else if (/iphone|ipad|ipod/.test(u)) {
            platform = "iPhone";
        }

        return { platform, isMobile };
    }

    const derived = deriveFromUA(ua);

    // 3. DOBÓR PARAMETRÓW HARDWARE / MEMORY POD DESKTOP vs MOBILE
    let hardwareConcurrency, deviceMemory, maxTouchPoints;

    if (derived.isMobile) {
        // telefony / tablety
        hardwareConcurrency = [4, 6, 8][randInt(0, 2)];
        deviceMemory = [3, 4, 6, 8][randInt(0, 3)];
        maxTouchPoints = [5, 10][randInt(0, 1)];
    } else {
        // desktopy / laptopy
        hardwareConcurrency = [4, 8, 12, 16][randInt(0, 3)];
        deviceMemory = [4, 8, 16, 32][randInt(0, 3)];
        maxTouchPoints = 0;
    }

    // 4. JĘZYKI I STREFA CZASOWA – POLSKA
    const languages = [["pl-PL","pl"],["pl-PL","pl","en-US"]][randInt(0,1)];
    const timeZone = "Europe/Warsaw";

    // 5. TWOJA LISTA RENDERERÓW WEBGL
    const WEBGL_RENDERERS = [
        "Intel Iris OpenGL Engine", "Intel HD Graphics 4000 OpenGL Engine", "Intel HD Graphics 5000 OpenGL Engine",
        "Intel HD Graphics 620 OpenGL Engine", "Intel UHD Graphics 630 OpenGL Engine", "Intel Iris Plus Graphics 640 OpenGL Engine",
        "Intel Iris Xe Graphics OpenGL Engine", "Intel HD Graphics 3000 OpenGL Engine", "Intel UHD Graphics 620 OpenGL Engine",
        "Intel Iris Pro OpenGL Engine", "Intel Arc A370M OpenGL Engine", "Intel Arc A770 OpenGL Engine",
        "Intel UHD Graphics 750 OpenGL Engine", "Intel Iris Xe Max Graphics OpenGL Engine", "Intel UHD Graphics 770 OpenGL Engine",
        "Intel Arc A350M OpenGL Engine", "Intel Iris Xe Graphics G7 OpenGL Engine", "Intel UHD Graphics 730 OpenGL Engine",
        "Intel Arc Pro A40 OpenGL Engine", "Intel UHD Graphics 12th Gen OpenGL Engine", "Intel Arc A380 OpenGL Engine",
        "Intel Arc A310 OpenGL Engine",

        "NVIDIA GeForce GTX 970 OpenGL Engine", "NVIDIA GeForce RTX 2080 Ti OpenGL Engine", "NVIDIA GeForce RTX 3060 OpenGL Engine",
        "NVIDIA GeForce GTX 1660 Super OpenGL Engine", "NVIDIA GeForce RTX 3070 OpenGL Engine", "NVIDIA GeForce GTX 1050 Ti OpenGL Engine",
        "NVIDIA GeForce RTX 3080 OpenGL Engine", "NVIDIA GeForce GT 1030 OpenGL Engine", "NVIDIA Quadro P2000 OpenGL Engine",
        "NVIDIA GeForce RTX 4090 OpenGL Engine", "NVIDIA GeForce RTX 4080 OpenGL Engine", "NVIDIA GeForce RTX 4090 Ti OpenGL Engine",
        "NVIDIA GeForce RTX 5060 OpenGL Engine", "NVIDIA GeForce RTX 4070 Super OpenGL Engine", "NVIDIA GeForce RTX 5080 OpenGL Engine",
        "NVIDIA GeForce RTX 4060 Ti OpenGL Engine", "NVIDIA Quadro RTX 6000 OpenGL Engine", "NVIDIA GeForce RTX 4050 OpenGL Engine",
        "NVIDIA RTX A4000 OpenGL Engine", "NVIDIA GeForce RTX 5070 OpenGL Engine", "NVIDIA GeForce RTX 3090 OpenGL Engine",
        "NVIDIA GeForce RTX 3060 Ti OpenGL Engine", "NVIDIA GeForce RTX 4070 OpenGL Engine", "NVIDIA GeForce RTX 4060 OpenGL Engine",
        "NVIDIA GeForce RTX 3050 OpenGL Engine",

        "AMD Radeon R9 M395X OpenGL Engine", "AMD Radeon RX 580 OpenGL Engine", "AMD Radeon RX 6700 XT OpenGL Engine",
        "AMD Radeon RX 5700 XT OpenGL Engine", "AMD Radeon Vega 56 OpenGL Engine", "AMD Radeon RX 6900 XT OpenGL Engine",
        "AMD Radeon R7 Graphics OpenGL Engine", "AMD Radeon RX 6600 OpenGL Engine", "AMD Radeon Pro 560 OpenGL Engine",
        "AMD Radeon RX 5500 XT OpenGL Engine", "AMD Radeon RX 7800 XT OpenGL Engine", "AMD Radeon RX 7900 XTX OpenGL Engine",
        "AMD Radeon RX 7600 OpenGL Engine", "AMD Radeon RX 8800 XT OpenGL Engine", "AMD Radeon RDNA 3 Integrated Graphics OpenGL Engine",
        "AMD Radeon RX 7700 XT OpenGL Engine", "AMD Radeon Pro W7800 OpenGL Engine", "AMD Radeon RX 8600 OpenGL Engine",
        "AMD Radeon RX 7900 GRE OpenGL Engine", "AMD Radeon RDNA 4 Graphics OpenGL Engine", "AMD Radeon RX 6800 XT OpenGL Engine",
        "AMD Radeon RX 6600 XT OpenGL Engine", "AMD Radeon Pro W6800 OpenGL Engine", "AMD Radeon RDNA 2 Integrated OpenGL Engine",

        "Apple M1 OpenGL Engine", "Apple M1 Pro OpenGL Engine", "Apple M1 Max OpenGL Engine", "Apple M2 OpenGL Engine",
        "Apple M2 Pro OpenGL Engine", "Apple M2 Max OpenGL Engine", "Apple M2 Ultra OpenGL Engine", "Apple M3 OpenGL Engine",
        "Apple M3 Pro OpenGL Engine", "Apple M3 Max OpenGL Engine", "Apple M4 OpenGL Engine", "Apple M4 Pro OpenGL Engine",
        "Apple M3 Ultra OpenGL Engine", "Apple M4 Ultra OpenGL Engine"
    ];

    function pickGpu() {
        const renderer = WEBGL_RENDERERS[randInt(0, WEBGL_RENDERERS.length - 1)];
        let vendor = "Google Inc.";
        if (renderer.startsWith("Intel")) vendor = "Intel Inc.";
        else if (renderer.startsWith("NVIDIA")) vendor = "NVIDIA Corporation";
        else if (renderer.startsWith("AMD")) vendor = "ATI Technologies Inc.";
        else if (renderer.startsWith("Apple")) vendor = "Apple Inc.";

        return { vendor, renderer };
    }

    const gpu = pickGpu();

    // 6. INIEKCJA W KONTEKST STRONY (żeby można było nadpisać navigator/WebGL)
    function inject(fn, arg) {
        const script = document.createElement('script');
        script.textContent = '(' + fn.toString() + ')(' + JSON.stringify(arg) + ');';
        document.documentElement.appendChild(script);
        script.remove();
    }

    // Funkcja wykonywana w kontekście strony
    function spoofAll(params) {
        const device = params.device;
        const gpu = params.gpu;

        function safeDefine(obj, prop, value) {
            try {
                Object.defineProperty(obj, prop, {
                    get: () => value,
                    configurable: false
                });
            } catch(e) {}
        }

        // navigator.*
        safeDefine(navigator, "platform", device.platform);
        safeDefine(navigator, "hardwareConcurrency", device.hardwareConcurrency);
        safeDefine(navigator, "deviceMemory", device.deviceMemory);
        safeDefine(navigator, "maxTouchPoints", device.maxTouchPoints);
        safeDefine(navigator, "languages", device.languages);
        safeDefine(navigator, "language", device.languages[0]);
        safeDefine(navigator, "webdriver", false);

        // connection
        try {
            const fakeConn = {
                effectiveType: device.connection.effectiveType,
                downlink: device.connection.downlink,
                rtt: 50,
                saveData: false
            };
            safeDefine(navigator, "connection", fakeConn);
        } catch(e) {}

        // timeZone – patch Intl.DateTimeFormat.prototype.resolvedOptions
        try {
            const orig = Intl.DateTimeFormat.prototype.resolvedOptions;
            Intl.DateTimeFormat.prototype.resolvedOptions = function() {
                const o = orig.apply(this, arguments);
                o.timeZone = device.timezone;
                return o;
            };
        } catch(e) {}

                // === FONTS SPOOFING (bez FontFaceSet, tylko document.fonts) ===
        try {
            // dobór "naturalnej" listy fontów w zależności od platformy
            const plat = (device.platform || "").toLowerCase();
            let FONT_WHITELIST;

            if (plat.indexOf("win") !== -1) {
                // typowy, bogatszy zestaw Windows
                FONT_WHITELIST = [
                    "Arial", "Arial Black", "Times New Roman", "Georgia",
                    "Verdana", "Tahoma", "Trebuchet MS", "Segoe UI",
                    "Calibri", "Cambria", "Corbel",
                    "Courier New", "Consolas", "Lucida Console",
                    "Impact", "Comic Sans MS"
                ];
            } else if (plat.indexOf("mac") !== -1) {
                FONT_WHITELIST = [
                    "SF Pro Text", "SF Pro Display", "Helvetica Neue", "Helvetica",
                    "Times", "Times New Roman", "Georgia",
                    "Menlo", "Monaco", "Courier", "Courier New"
                ];
            } else if (plat.indexOf("iphone") !== -1 || plat.indexOf("ipad") !== -1) {
                FONT_WHITELIST = [
                    "SF Pro Text", "SF Pro Display", "Helvetica Neue",
                    "Times New Roman", "Courier", "Courier New"
                ];
            } else {
                // Linux / Android – prosty, realistyczny zestaw
                FONT_WHITELIST = [
                    "Roboto", "Noto Sans", "DejaVu Sans",
                    "Liberation Sans", "Ubuntu",
                    "DejaVu Serif", "DejaVu Sans Mono"
                ];
            }

            function isWhitelistedFont(font) {
                const f = (font || "").toLowerCase();
                if (!f) return false;

                // generiki typu serif/sans-serif/monospace zostawiamy
                const generics = ["serif", "sans-serif", "monospace", "cursive", "fantasy", "system-ui"];
                for (let i = 0; i < generics.length; i++) {
                    if (f === generics[i]) {
                        return true;
                    }
                }

                for (let i = 0; i < FONT_WHITELIST.length; i++) {
                    if (f.indexOf(FONT_WHITELIST[i].toLowerCase()) !== -1) {
                        return true;
                    }
                }
                return false;
            }

            // Patch document.fonts.check(...)
            if (document.fonts && typeof document.fonts.check === "function") {
                const origCheck = document.fonts.check.bind(document.fonts);
                document.fonts.check = function() {
                    // API: check(font) lub check(cssFont, text)
                    let fontArg = "";
                    if (arguments.length === 1) {
                        fontArg = arguments[0];
                    } else if (arguments.length >= 2) {
                        fontArg = arguments[1];
                    }

                    if (!isWhitelistedFont(fontArg)) {
                        // udajemy, że fontu nie ma
                        return false;
                    }
                    return origCheck.apply(this, arguments);
                };
            }

            // delikatny szum w measureText – utrudnia precyzyjny fingerprint fontów
            if (window.CanvasRenderingContext2D && CanvasRenderingContext2D.prototype.measureText) {
                const origMeasure = CanvasRenderingContext2D.prototype.measureText;
                CanvasRenderingContext2D.prototype.measureText = function(text) {
                    const metrics = origMeasure.call(this, text);
                    try {
                        if (metrics && typeof metrics.width === "number") {
                            const noise = (Math.random() * 0.4 - 0.2); // -0.2 .. 0.2 px
                            Object.defineProperty(metrics, "width", {
                                value: metrics.width + noise,
                                configurable: false
                            });
                        }
                    } catch (e) {}
                    return metrics;
                };
            }
        } catch (e) {}

        // WebGL vendor/renderer + noise na readPixels
        try {
            if (window.WebGLRenderingContext) {
                const origGetParameter = WebGLRenderingContext.prototype.getParameter;
                WebGLRenderingContext.prototype.getParameter = function(param) {
                    if (param === 37445) return gpu.vendor;
                    if (param === 37446) return gpu.renderer;
                    return origGetParameter.apply(this, arguments);
                };

                const origReadPixels = WebGLRenderingContext.prototype.readPixels;
                WebGLRenderingContext.prototype.readPixels = function(x, y, width, height, format, type, pixels) {
                    const res = origReadPixels.apply(this, arguments);
                    try {
                        if (pixels && pixels.length && pixels.length > 16) {
                            const noise = Math.floor(Math.random() * 3) - 1; // -1..1
                            for (let i = 0; i < 16; i++) {
                                pixels[i] = (pixels[i] + noise) & 255;
                            }
                        }
                    } catch(e) {}
                    return res;
                };
            }

            if (window.WebGL2RenderingContext) {
                const origGetParameter2 = WebGL2RenderingContext.prototype.getParameter;
                WebGL2RenderingContext.prototype.getParameter = function(param) {
                    if (param === 37445) return gpu.vendor;
                    if (param === 37446) return gpu.renderer;
                    return origGetParameter2.apply(this, arguments);
                };

                const origReadPixels2 = WebGL2RenderingContext.prototype.readPixels;
                WebGL2RenderingContext.prototype.readPixels = function(x, y, width, height, format, type, pixels) {
                    const res2 = origReadPixels2.apply(this, arguments);
                    try {
                        if (pixels && pixels.length && pixels.length > 16) {
                            const noise2 = Math.floor(Math.random() * 3) - 1;
                            for (let j = 0; j < 16; j++) {
                                pixels[j] = (pixels[j] + noise2) & 255;
                            }
                        }
                    } catch(e) {}
                    return res2;
                };
            }
        } catch(e) {}

        // Canvas noise
        try {
            const origToDataURL = HTMLCanvasElement.prototype.toDataURL;
            HTMLCanvasElement.prototype.toDataURL = function() {
                const ctx = this.getContext("2d");
                if (ctx) {
                    ctx.save();
                    ctx.fillStyle = "rgba(255,0,0,0.01)";
                    ctx.fillRect(Math.random()*10, Math.random()*10, 20, 20);
                    ctx.restore();
                }
                return origToDataURL.apply(this, arguments);
            };
        } catch(e) {}

        // AudioContext noise – agresywniejszy (Analyser + AudioBuffer + OfflineAudioContext.startRendering)
        try {
            function randAudio() {
                // dość wyraźny, ale nadal mały szum
                return (Math.random() * 0.02 - 0.01); // -0.01 .. 0.01
            }

            // 1) AnalyserNode.getFloatFrequencyData
            if (window.AnalyserNode && AnalyserNode.prototype.getFloatFrequencyData) {
                const origGetFloatFreq = AnalyserNode.prototype.getFloatFrequencyData;
                AnalyserNode.prototype.getFloatFrequencyData = function(data) {
                    origGetFloatFreq.call(this, data);
                    for (let i = 0; i < data.length; i++) {
                        data[i] = data[i] + randAudio();
                    }
                };
            }

            // 2) AudioBuffer.getChannelData
            if (window.AudioBuffer && AudioBuffer.prototype.getChannelData) {
                const origGetChannelData = AudioBuffer.prototype.getChannelData;
                AudioBuffer.prototype.getChannelData = function() {
                    const data = origGetChannelData.apply(this, arguments);
                    try {
                        const len = Math.min(2048, data.length);
                        for (let i = 0; i < len; i++) {
                            data[i] = data[i] + randAudio();
                        }
                    } catch(e) {}
                    return data;
                };
            }

            // 3) AudioBuffer.copyFromChannel (często używane w fingerprintach)
            if (window.AudioBuffer && AudioBuffer.prototype.copyFromChannel) {
                const origCopy = AudioBuffer.prototype.copyFromChannel;
                AudioBuffer.prototype.copyFromChannel = function(destination, channelNumber, startInChannel) {
                    origCopy.call(this, destination, channelNumber, startInChannel);
                    try {
                        const len = Math.min(2048, destination.length);
                        for (let i = 0; i < len; i++) {
                            destination[i] = destination[i] + randAudio();
                        }
                    } catch(e) {}
                };
            }

            // 4) OfflineAudioContext.startRendering – modyfikujemy wyrenderowany bufor
            const OrigOAC = window.OfflineAudioContext || window.webkitOfflineAudioContext;

            function addNoiseToBuffer(buf) {
                try {
                    const chCount = buf.numberOfChannels || 1;
                    for (let ch = 0; ch < chCount; ch++) {
                        const data = buf.getChannelData(ch);
                        const len = Math.min(4096, data.length);
                        for (let i = 0; i < len; i++) {
                            data[i] = data[i] + randAudio();
                        }
                    }
                } catch(e) {}
            }

            if (OrigOAC) {
                const OACProxy = function() {
                    const ctx = new OrigOAC(...arguments);

                    if (ctx && ctx.startRendering) {
                        const origStart = ctx.startRendering.bind(ctx);

                        ctx.startRendering = function() {
                            const result = origStart.apply(this, arguments);

                            if (result && typeof result.then === "function") {
                                // Promise-based
                                return result.then(function(buf) {
                                    if (buf) addNoiseToBuffer(buf);
                                    return buf;
                                });
                            } else {
                                // stary styl z oncomplete
                                const origOncomplete = this.oncomplete;
                                this.oncomplete = function(ev) {
                                    try {
                                        if (ev && ev.renderedBuffer) {
                                            addNoiseToBuffer(ev.renderedBuffer);
                                        }
                                    } catch(e) {}
                                    if (typeof origOncomplete === "function") {
                                        origOncomplete.call(this, ev);
                                    }
                                };
                                return result;
                            }
                        };
                    }

                    return ctx;
                };

                OACProxy.prototype = OrigOAC.prototype;
                window.OfflineAudioContext = OACProxy;
                if (window.webkitOfflineAudioContext) {
                    window.webkitOfflineAudioContext = OACProxy;
                }
            }

        } catch(e) {}
    }

    // Budujemy obiekt device do spoofingu
    const deviceParams = {
        platform: derived.platform,
        hardwareConcurrency: hardwareConcurrency,
        deviceMemory: deviceMemory,
        maxTouchPoints: maxTouchPoints,
        languages: languages,
        timezone: timeZone,
        connection: {
            effectiveType: derived.isMobile ? "4g" : "wifi",
            downlink: derived.isMobile ? randInt(5, 30) : randInt(20, 100)
        }
    };

    inject(spoofAll, { device: deviceParams, gpu: gpu });

})();
