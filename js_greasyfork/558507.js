// ==UserScript==
// @name         DELUGE RPG SCRIPT!!! BypassCF v2.0 Pro+ Enhanced
// @namespace    captcha.grind.turnstile
// @match        https://*.delugerpg.com/*
// @license MIT
// @grant        none
// @version      2025.6
// @description  Download Tamper Monkey to use this SCRIPT!!....Automatically solve Captcha and Return Game Btn. Pair it with my Auto-Battle script for best results!. Maximum of 5 hrs. farming to avoid risk of banning.
// @author 0x11 & Anyms
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/558507/DELUGE%20RPG%20SCRIPT%21%21%21%20BypassCF%20v20%20Pro%2B%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/558507/DELUGE%20RPG%20SCRIPT%21%21%21%20BypassCF%20v20%20Pro%2B%20Enhanced.meta.js
// ==/UserScript==

/**
 * Browser fingerprinting & automation script that spoofs WebGL, canvas, audio, and navigator properties
 * while simulating human-like behavior with fake cursor movement and random interactions.
 * Automatically detects and completes Turnstile CAPTCHA tokens, then clicks the return button.
 */

(function() {
    "use strict";



    const rand = (len = 8) => Array(len).fill(0).map(() =>
        Math.floor(Math.random() * 36).toString(36)
    ).join("");

    const delay = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const easeInOutQuad = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

    setInterval(() => { 
        try { 
            const key = "ls_" + rand(6);
            const value = JSON.stringify({ ts: Date.now(), data: rand(20) });
            if (localStorage.length < 50) localStorage.setItem(key, value);
        } catch {} 
    }, delay(3000, 7000));

    setInterval(() => { 
        try { 
            const key = "ss_" + rand(6);
            const value = JSON.stringify({ ts: Date.now(), data: rand(20) });
            if (sessionStorage.length < 50) sessionStorage.setItem(key, value);
        } catch {} 
    }, delay(3000, 7000));

   
    setInterval(() => {
        try {
            const cookieName = "c_" + rand(5);
            const cookieValue = rand(15);
            const exp = new Date(Date.now() + delay(60000, 3600000)).toUTCString();
            document.cookie = `${cookieName}=${cookieValue}; path=/; expires=${exp}`;
        } catch {}
    }, delay(3000, 6000));

    
    const initIndexedDB = () => {
        try {
            const dbName = "idb_" + rand(6);
            const req = indexedDB.open(dbName, 1);
            req.onupgradeneeded = (e) => { e.target.result.createObjectStore("store", { autoIncrement: true }); };
            req.onsuccess = (e) => {
                const db = e.target.result;
                setInterval(() => {
                    const tx = db.transaction("store", "readwrite");
                    tx.objectStore("store").add({ time: Date.now(), key: rand(6), value: rand(20) });
                }, delay(2500, 5000));
            };
        } catch {}
    };
    initIndexedDB();

    const injectWebGLNoise = () => {
        const hook = (proto, fnName) => {
            const original = proto[fnName];
            proto[fnName] = function(...args) {
                const res = original.apply(this, args);
                if (fnName === "getParameter" && typeof res === "number") return res + Math.floor(Math.random() * 3);
                return res;
            };
        };
        try {
            const proto = WebGLRenderingContext.prototype;
            const proto2 = window.WebGL2RenderingContext ? WebGL2RenderingContext.prototype : null;
            hook(proto, "getParameter");
            if (proto2) hook(proto2, "getParameter");
        } catch {}
    };
    injectWebGLNoise();

    const injectCanvasNoise = () => {
        const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
        HTMLCanvasElement.prototype.toDataURL = function(...args) {
            const ctx = this.getContext('2d');
            if (ctx) {
                const w = this.width, h = this.height;
                const imgData = ctx.getImageData(0, 0, w, h);
                for (let i = 0; i < imgData.data.length; i += 4) {
                    imgData.data[i] += Math.floor(Math.random() * 3);     // R
                    imgData.data[i+1] += Math.floor(Math.random() * 3);   // G
                    imgData.data[i+2] += Math.floor(Math.random() * 3);   // B
                }
                ctx.putImageData(imgData, 0, 0);
            }
            return originalToDataURL.apply(this, args);
        };
    };
    injectCanvasNoise();

    const injectAudioNoise = () => {
        try {
            const AudioCtx = window.OfflineAudioContext || window.webkitOfflineAudioContext;
            if (!AudioCtx) return;
            const originalGetChannelData = AudioBuffer.prototype.getChannelData;
            AudioBuffer.prototype.getChannelData = function() {
                const arr = originalGetChannelData.apply(this, arguments);
                for (let i = 0; i < arr.length; i += Math.floor(Math.random() * 10 + 1)) {
                    arr[i] += Math.random() * 1e-6; 
                }
                return arr;
            };
        } catch {}
    };
    injectAudioNoise();

    const injectWebRTCNoise = () => {
        try {
            const originalGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
            navigator.mediaDevices.getUserMedia = function(constraints) {
                if (constraints && constraints.audio) {
                    return originalGetUserMedia(constraints).then(stream => {
                        const tracks = stream.getAudioTracks();
                        tracks.forEach(track => {}); 
                        return stream;
                    });
                }
                return originalGetUserMedia(constraints);
            };

            const originalRTCPeerConnection = window.RTCPeerConnection;
            window.RTCPeerConnection = function(...args) {
                const pc = new originalRTCPeerConnection(...args);
                const originalAddTrack = pc.addTrack.bind(pc);
                pc.addTrack = function(track, ...streams) {
                    return originalAddTrack(track, ...streams); 
                };
                return pc;
            };
        } catch {}
    };
    injectWebRTCNoise();


   
    (() => {
        try {
            const minW = 1200, maxW = 1920;
            const minH = 700, maxH = 1080;
            const randWidth = delay(minW, maxW);
            const randHeight = delay(minH, maxH);
            const pixelRatio = (1.0 + Math.random() * 0.5).toFixed(2); // 1.0 to 1.5

            Object.defineProperty(window, 'devicePixelRatio', { get: () => parseFloat(pixelRatio) });
            Object.defineProperty(window.screen, 'width', { get: () => randWidth });
            Object.defineProperty(window.screen, 'height', { get: () => randHeight });
            Object.defineProperty(window.screen, 'availWidth', { get: () => randWidth - delay(10, 50) });
            Object.defineProperty(window.screen, 'availHeight', { get: () => randHeight - delay(50, 100) });
        } catch {}
    })();
    [attachment_0](attachment)

    (() => {
        try {
            const timeZoneOptions = ['America/New_York', 'Europe/London', 'Asia/Manila', 'Australia/Sydney'];
            const randomTimeZone = timeZoneOptions[Math.floor(Math.random() * timeZoneOptions.length)];
            const originalResolvedOptions = Intl.DateTimeFormat.prototype.resolvedOptions;
            Intl.DateTimeFormat.prototype.resolvedOptions = function() {
                const options = originalResolvedOptions.apply(this, arguments);
                return { ...options, timeZone: randomTimeZone };
            };

            
            const originalDate = window.Date;
            window.Date = function() {
                if (arguments.length === 0) return new originalDate();
                return new originalDate(...arguments);
            };
        } catch {}

        
        try {
            const hookRequest = (originalFn, isFetch) => function(...args) {
                return new Promise(resolve => {
                    setTimeout(() => {
                        const res = originalFn.apply(this, args);
                        if (isFetch) { res.then(resolve).catch(resolve); }
                        else { resolve(res); }
                    }, delay(20, 150)); 
                });
            };
            window.fetch = hookRequest(window.fetch.bind(window), true);

            const originalOpen = XMLHttpRequest.prototype.open;
            XMLHttpRequest.prototype.open = function() {
                const self = this;
                const originalSend = self.send;
                self.send = function(...args) {
                    setTimeout(() => {
                        originalSend.apply(self, args);
                    }, delay(20, 150));
                };
                originalOpen.apply(this, arguments);
            };
        } catch {}
    })();

    
    const DEBUG = false; // Toggle this to enable/disable logging
    const log = (msg) => { if (DEBUG) console.log(`[BypassCF] ${msg}`); };

   
    (() => {
        try {
           
            const cachedProps = {
                hardwareConcurrency: 2 + Math.floor(Math.random() * 6),
                deviceMemory: 2 + Math.floor(Math.random() * 14),
                languages: ['en-US', 'en', 'fil'].sort(() => Math.random() - 0.5),
                platform: ['Win32','MacIntel','Linux x86_64','iPhone','Android'][Math.floor(Math.random() * 5)],
                webdriver: false
            };
            
            Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => cachedProps.hardwareConcurrency });
            Object.defineProperty(navigator, 'deviceMemory', { get: () => cachedProps.deviceMemory });
            Object.defineProperty(navigator, 'languages', { get: () => cachedProps.languages });
            Object.defineProperty(navigator, 'platform', { get: () => cachedProps.platform });
            Object.defineProperty(navigator, 'webdriver', { get: () => cachedProps.webdriver });
            
            const originalUA = navigator.userAgent;
            Object.defineProperty(navigator, 'userAgent', { get: () => originalUA.replace(/\d+(\.\d+)+/g, match => `${parseInt(match)+Math.floor(Math.random()*3)}`) });
            log('Navigator properties cached and spoofed');
        } catch {}
    })();

    if (!location.pathname.includes("unlock")) return;

    const randomDelay = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    
    const createFakeCursor = () => {
        const cursor = document.createElement('div');
        cursor.id = 'fake-cursor-helper';
        cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            border: 2px solid #333;
            border-radius: 50%;
            background: rgba(0, 0, 0, 0.1);
            pointer-events: none;
            z-index: 999999;
            transition: transform 0.05s linear;
            display: none;
            mix-blend-mode: difference;
        `;
        const cursorPointer = document.createElement('div');
        cursorPointer.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 4px;
            height: 4px;
            background: #333;
            border-radius: 50%;
            transform: translate(-50%, -50%);
        `;
        cursor.appendChild(cursorPointer);
        document.body.appendChild(cursor);

        let currentX = window.innerWidth / 2;
        let currentY = window.innerHeight / 2;
        let targetX = currentX;
        let targetY = currentY;
        let isMoving = false;
        let animationFrame = null;
        let startTime = 0;
        let duration = 0;
        let startX = 0;
        let startY = 0;

        const moveCursor = (timestamp) => {
            if (!isMoving) {
                startX = currentX;
                startY = currentY;
                const angle = Math.random() * Math.PI * 2;
                const distance = randomDelay(80, 300);
                targetX = Math.min(window.innerWidth - 50, Math.max(50, currentX + Math.cos(angle) * distance));
                targetY = Math.min(window.innerHeight - 50, Math.max(50, currentY + Math.sin(angle) * distance));

                const dist = Math.sqrt(Math.pow(targetX - startX, 2) + Math.pow(targetY - startY, 2));
            
                const speedFactor = Math.min(1.5, 500 / dist);
                duration = (dist / randomDelay(150, 250)) * speedFactor;

                startTime = timestamp;
                isMoving = true;
                cursor.style.display = 'block';
                log(`Moving cursor from (${Math.round(startX)},${Math.round(startY)}) to (${Math.round(targetX)},${Math.round(targetY)})`);
            }

            const elapsed = timestamp - startTime;
            const t = Math.min(1, elapsed / duration);
            const easingChoice = Math.floor((timestamp / 1000) % 3);
            let easedT = easeInOutQuad(t);
            if (easingChoice === 1) easedT = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; 
            if (easingChoice === 2) easedT = Math.sin(t * Math.PI) / 2; 

            currentX = startX + (targetX - startX) * easedT;
            currentY = startY + (targetY - startY) * easedT;

            const jitterX = Math.sin(timestamp / 150) * 0.8; 
            const jitterY = Math.cos(timestamp / 150) * 0.8;

            cursor.style.left = (currentX + jitterX) + 'px';
            cursor.style.top = (currentY + jitterY) + 'px';

            const mouseMoveEvent = new MouseEvent('mousemove', {
                bubbles: true, cancelable: true, view: window,
                clientX: currentX, clientY: currentY
            });
            document.dispatchEvent(mouseMoveEvent);

            if (t >= 1) {
                isMoving = false;
                const pauseTime = randomDelay(500, 2000);
                setTimeout(() => { animationFrame = requestAnimationFrame(moveCursor); }, pauseTime);
            } else {
                animationFrame = requestAnimationFrame(moveCursor);
            }
        };

        let realMouseTimeout = null;
        const handleRealMouseMove = () => {
            cursor.style.display = 'none';
            clearTimeout(realMouseTimeout);
            realMouseTimeout = setTimeout(() => { if (isMoving) cursor.style.display = 'block'; }, randomDelay(2000, 4000));
        };
        document.addEventListener('mousemove', handleRealMouseMove, { passive: true });

        setTimeout(() => { animationFrame = requestAnimationFrame(moveCursor); }, randomDelay(1000, 2500));
        return () => { if (animationFrame) cancelAnimationFrame(animationFrame); clearTimeout(realMouseTimeout); document.removeEventListener('mousemove', handleRealMouseMove); cursor.remove(); };
    };

    let cleanupCursor = null;

    const simulateMouseMovement = () => {
        const event = new MouseEvent('mousemove', {
            bubbles: true, cancelable: true, view: window,
            clientX: randomDelay(100, window.innerWidth - 100),
            clientY: randomDelay(100, window.innerHeight - 100)
        });
        document.dispatchEvent(event);
    };

    cleanupCursor = createFakeCursor();

    const humanActivityInterval = setInterval(() => {
        if (Math.random() > 0.7) simulateMouseMovement();
        if (Math.random() > 0.8) window.scrollBy(0, randomDelay(-50, 50));
    }, randomDelay(2000, 5000));

    
    const setupDynamicReload = () => {
        const maxReloadTimeout = 12 * 60 * 1000; 
        const checkLoadInterval = setInterval(() => {
            const hasGameContent = document.querySelectorAll('[class*="game"], [id*="game"], canvas, .container, main').length > 0;
            const hasNavigation = document.querySelectorAll('nav, header, [role="navigation"]').length > 0;
            
            if (pageSuccessfullyLoaded && hasGameContent) {
                log("Page successfully loaded, will reload in 8-10 minutes");
                clearInterval(checkLoadInterval);
                setTimeout(() => {
                    log("Performing page reload");
                    clearInterval(humanActivityInterval);
                    if (cleanupCursor) cleanupCursor();
                    location.reload();
                }, randomDelay(8 * 60 * 1000, 10 * 60 * 1000));
            }
        }, 5000);
        
        
        setTimeout(() => {
            clearInterval(checkLoadInterval);
            log("Hard reload timeout reached");
            clearInterval(humanActivityInterval);
            if (cleanupCursor) cleanupCursor();
            location.reload();
        }, maxReloadTimeout);
    };
    setupDynamicReload();

    let lastCheckTime = 0;
    let consecutiveNoTokenCount = 0;
    let pageSuccessfullyLoaded = false;

    
    const waitForButton = (maxWaitMs = 30000) => {
        return new Promise((resolve) => {
            const startTime = Date.now();
            const checkButton = () => {
                let btn = document.querySelector("input.btn.btn-primary[value='Return to Game']");
                if (!btn) btn = document.querySelector("input[value='Return to Game']");
                if (!btn) btn = document.querySelector("input[type='submit'][value*='Return']");
                if (!btn) btn = Array.from(document.querySelectorAll("input[type='button'], input[type='submit']")).find(el => el.value.includes("Return"));
                
                if (btn) {
                    const rect = btn.getBoundingClientRect();
                    const isVisible = rect.width > 0 && rect.height > 0 && rect.top >= 0 && rect.left >= 0;
                    if (isVisible) {
                        log(`Button found and visible at (${Math.round(rect.left)}, ${Math.round(rect.top)})`);
                        resolve(btn);
                        return;
                    }
                }
                
                if (Date.now() - startTime > maxWaitMs) {
                    log(`Button not found within ${maxWaitMs}ms`);
                    resolve(null);
                    return;
                }
                
                setTimeout(checkButton, 500);
            };
            checkButton();
        });
    };

    
    const setupFormInterception = () => {
        const originalSubmit = HTMLFormElement.prototype.submit;
        HTMLFormElement.prototype.submit = function() {
            log(`Form submitted: ${this.id || this.name || 'unnamed'}`);
            pageSuccessfullyLoaded = true;
            return originalSubmit.call(this);
        };
    };
    setupFormInterception();

    const checkCaptcha = async () => {
        const now = Date.now();
        const baseDelay = randomDelay(1200, 2500);
        const actualDelay = now - lastCheckTime < baseDelay ? baseDelay - (now - lastCheckTime) : randomDelay(100, 500);

        setTimeout(async () => {
            lastCheckTime = Date.now();
            const tokenInput = document.querySelector("input[id$='_response']");
            if (!tokenInput) {
                consecutiveNoTokenCount++;
                if (consecutiveNoTokenCount % 5 === 0) log("Waiting for Turnstile widget...");
                setTimeout(() => checkCaptcha(), randomDelay(500, 1000));
                return;
            }
            consecutiveNoTokenCount = 0;
            const value = tokenInput.value.trim();

            
            if (value.length < 100 && Math.random() > 0.8) {
                 tokenInput.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
                 setTimeout(() => { tokenInput.dispatchEvent(new FocusEvent('blur', { bubbles: true })); }, randomDelay(50, 200));
            }

            if (value.length > 100) {
                log(`CAPTCHA token received (${value.length} chars)`);
                clearInterval(humanActivityInterval);
                if (cleanupCursor) cleanupCursor();
                const readingDelay = randomDelay(1000, 3000);
                
                setTimeout(async () => {
                    
                    const btn = await waitForButton(15000);
                    
                    if (btn) {
                        const rect = btn.getBoundingClientRect();

                       
                        const mouseMoveEvent = new MouseEvent('mousemove', {
                            bubbles: true, cancelable: true, view: window,
                            clientX: rect.left + rect.width / 2 + randomDelay(-5, 5),
                            clientY: rect.top + rect.height / 2 + randomDelay(-5, 5)
                        });
                        document.dispatchEvent(mouseMoveEvent);

                        
                        setTimeout(() => {
                            const mouseDownEvent = new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window, button: 0 });
                            const mouseUpEvent = new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window, button: 0 });
                            const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true, view: window, button: 0 });
                            btn.dispatchEvent(mouseDownEvent);
                            setTimeout(() => { 
                                btn.dispatchEvent(mouseUpEvent); 
                                btn.dispatchEvent(clickEvent);
                                btn.click();
                                log('Button clicked');
                               
                                if (btn.form) {
                                    log('Submitting parent form');
                                    btn.form.submit();
                                }
                            }, randomDelay(50, 150));
                        }, randomDelay(100, 300));
                    } else {
                        log("Button not found after waiting, retrying CAPTCHA check...");
                        setTimeout(() => checkCaptcha(), randomDelay(1000, 2000));
                    }
                }, readingDelay);
            } else { 
                setTimeout(() => checkCaptcha(), randomDelay(500, 1000));
            }
        }, actualDelay);
    };

    setTimeout(() => { checkCaptcha(); }, randomDelay(500, 1500));

})();
 