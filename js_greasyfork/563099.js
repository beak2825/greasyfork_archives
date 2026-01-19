// ==UserScript==
// @name         Deadshot Galaxy AWP - COMPLETE
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Swap BOTH UI and 3D weapon textures
// @author       You
// @match        https://deadshot.io/*
// @match        https://*.deadshot.io/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563099/Deadshot%20Galaxy%20AWP%20-%20COMPLETE.user.js
// @updateURL https://update.greasyfork.org/scripts/563099/Deadshot%20Galaxy%20AWP%20-%20COMPLETE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const GALAXY_SKIN = 'https://files.catbox.moe/bvuqqf.webp';
    
    // ==========================================
    // BOTH FILES TO SWAP
    // ==========================================
    const TARGET_FILES = [
        'defaultawp.webp',     // UI spritesheet (locker, death screen)
        'newawpcomp.webp'      // 3D in-game weapon model
    ];

    // ==========================================
    // CLEAR CACHE
    // ==========================================
    if ('caches' in window) {
        caches.keys().then(names => {
            names.forEach(name => caches.delete(name));
        });
    }

    function shouldSwap(url) {
        if (!url || typeof url !== 'string') return false;
        return TARGET_FILES.some(file => url.includes(file));
    }

    function logSwap(method, url) {
        console.log(`%c🌌 [${method}] GALAXY SWAP!`, 'background: #ff00ff; color: #fff; padding: 3px 8px; font-weight: bold');
        console.log(`  ❌ ${url}`);
        console.log(`  ✅ ${GALAXY_SKIN}`);
    }

    // ==========================================
    // FETCH
    // ==========================================
    const _fetch = window.fetch;
    window.fetch = function(url, options = {}) {
        if (typeof url === 'object' && url.url) url = url.url;
        
        if (shouldSwap(url)) {
            logSwap('FETCH', url);
            return _fetch(GALAXY_SKIN, {
                ...options,
                cache: 'no-store',
                headers: {
                    ...options.headers,
                    'Cache-Control': 'no-cache'
                }
            });
        }
        return _fetch(url, options);
    };

    // ==========================================
    // XMLHttpRequest
    // ==========================================
    const _xhrOpen = XMLHttpRequest.prototype.open;
    const _xhrSend = XMLHttpRequest.prototype.send;
    
    XMLHttpRequest.prototype.open = function(method, url, ...rest) {
        this._url = url;
        if (shouldSwap(url)) {
            logSwap('XHR', url);
            return _xhrOpen.call(this, method, GALAXY_SKIN, ...rest);
        }
        return _xhrOpen.call(this, method, url, ...rest);
    };
    
    XMLHttpRequest.prototype.send = function(data) {
        if (shouldSwap(this._url)) {
            this.setRequestHeader('Cache-Control', 'no-cache');
        }
        return _xhrSend.call(this, data);
    };

    // ==========================================
    // IMAGE CONSTRUCTOR
    // ==========================================
    const _Image = window.Image;
    window.Image = function() {
        const img = new _Image();
        img.crossOrigin = 'anonymous';
        
        const _srcDesc = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
        Object.defineProperty(img, 'src', {
            get() { return _srcDesc.get.call(this); },
            set(value) {
                if (shouldSwap(value)) {
                    logSwap('Image Constructor', value);
                    return _srcDesc.set.call(this, GALAXY_SKIN + '?t=' + Date.now());
                }
                return _srcDesc.set.call(this, value);
            }
        });
        
        return img;
    };

    // ==========================================
    // HTMLImageElement.src
    // ==========================================
    const _imgSrc = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
    Object.defineProperty(HTMLImageElement.prototype, 'src', {
        get() { return _imgSrc.get.call(this); },
        set(value) {
            if (shouldSwap(value)) {
                logSwap('Image.src', value);
                this.crossOrigin = 'anonymous';
                return _imgSrc.set.call(this, GALAXY_SKIN + '?t=' + Date.now());
            }
            return _imgSrc.set.call(this, value);
        }
    });

    // ==========================================
    // createElement
    // ==========================================
    const _createElement = document.createElement;
    document.createElement = function(tag, options) {
        const el = _createElement.call(document, tag, options);
        
        if (tag.toLowerCase() === 'img') {
            el.crossOrigin = 'anonymous';
            const _desc = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
            Object.defineProperty(el, 'src', {
                get() { return _desc.get.call(this); },
                set(value) {
                    if (shouldSwap(value)) {
                        logSwap('createElement', value);
                        return _desc.set.call(this, GALAXY_SKIN + '?t=' + Date.now());
                    }
                    return _desc.set.call(this, value);
                }
            });
        }
        
        return el;
    };

    // ==========================================
    // setAttribute
    // ==========================================
    const _setAttribute = Element.prototype.setAttribute;
    Element.prototype.setAttribute = function(name, value) {
        if (name === 'src' && shouldSwap(value)) {
            logSwap('setAttribute', value);
            if (this.tagName === 'IMG') this.crossOrigin = 'anonymous';
            return _setAttribute.call(this, name, GALAXY_SKIN + '?t=' + Date.now());
        }
        return _setAttribute.call(this, name, value);
    };

    // ==========================================
    // CSS backgrounds
    // ==========================================
    const _setProperty = CSSStyleDeclaration.prototype.setProperty;
    CSSStyleDeclaration.prototype.setProperty = function(prop, value, priority) {
        if ((prop === 'background-image' || prop === 'background') && typeof value === 'string') {
            const match = value.match(/url\(['"]?([^'"]+)['"]?\)/);
            if (match && shouldSwap(match[1])) {
                logSwap('CSS', match[1]);
                value = value.replace(match[1], GALAXY_SKIN + '?t=' + Date.now());
            }
        }
        return _setProperty.call(this, prop, value, priority);
    };

    // ==========================================
    // WEBGL TEXTURES
    // ==========================================
    const _getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function(type, attrs) {
        const ctx = _getContext.call(this, type, attrs);
        
        if ((type === 'webgl' || type === 'webgl2' || type === 'experimental-webgl') && ctx && !ctx.__hooked) {
            ctx.__hooked = true;
            
            const _texImage2D = ctx.texImage2D;
            ctx.texImage2D = function(...args) {
                const source = args[args.length - 1];
                
                if (source && source.src && shouldSwap(source.src)) {
                    logSwap('WebGL', source.src);
                    
                    const img = new Image();
                    img.crossOrigin = 'anonymous';
                    img.src = GALAXY_SKIN + '?t=' + Date.now();
                    
                    args[args.length - 1] = img;
                    
                    if (!img.complete) {
                        return new Promise((resolve) => {
                            img.onload = () => {
                                resolve(_texImage2D.apply(this, args));
                            };
                        });
                    }
                }
                
                return _texImage2D.apply(this, args);
            };
        }
        
        return ctx;
    };

    // ==========================================
    // PRELOAD
    // ==========================================
    const preload = new Image();
    preload.crossOrigin = 'anonymous';
    preload.onload = () => {
        console.log('%c✅ Galaxy texture preloaded!', 'color: #0f0; font-weight: bold; font-size: 14px');
    };
    preload.onerror = () => {
        console.error('%c❌ Failed to load galaxy texture!', 'color: #f00; font-weight: bold');
    };
    preload.src = GALAXY_SKIN;

    // ==========================================
    // STARTUP
    // ==========================================
    console.clear();
    console.log('%c╔════════════════════════════════════════╗', 'color: #ff00ff; font-weight: bold');
    console.log('%c║  🌌 GALAXY AWP COMPLETE SWAPPER 🌌   ║', 'color: #ff00ff; font-weight: bold; font-size: 16px');
    console.log('%c╚════════════════════════════════════════╝', 'color: #ff00ff; font-weight: bold');
    console.log('');
    console.log('%c📋 Swapping 2 files:', 'color: #fff; font-weight: bold');
    console.log('%c  ✓ defaultawp.webp (UI)', 'color: #0f0');
    console.log('%c  ✓ newawpcomp.webp (3D Model)', 'color: #0f0');
    console.log('');
    console.log('%c🌌 Galaxy Skin:', 'color: #fff', GALAXY_SKIN);
    console.log('');
    console.log('%c⚠️ IF NOT WORKING:', 'color: #ff0; font-weight: bold');
    console.log('%c  1. Clear browser cache (Ctrl+Shift+Delete)', 'color: #fff');
    console.log('%c  2. Close ALL deadshot.io tabs', 'color: #fff');
    console.log('%c  3. Reopen and try again', 'color: #fff');
    console.log('');

})();