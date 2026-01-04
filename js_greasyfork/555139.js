// ==UserScript==
// @name         EveryCircuit Patch
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  everycircuit patched - infinite circuits
// @author       malidev
// @match        https://everycircuit.com/*
// @match        http://localhost/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=everycircuit.com
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/555139/EveryCircuit%20Patch.user.js
// @updateURL https://update.greasyfork.org/scripts/555139/EveryCircuit%20Patch.meta.js
// ==/UserScript==
(function() {
    'use strict';

    const a = 2;
    const b = 999999;
    const c = "Patched by malidev";
    const d = "admin@admin.com";
    const e = "patched_by_malidev";
    
    let f = null;
    let g = null;

    function h() {
        Object.defineProperty(window, 'thePrivileges', {
            get: () => a,
            set: () => {},
            configurable: true
        });

        Object.defineProperty(window, 'theTrialTimeRemaining', {
            get: () => "",
            set: () => {},
            configurable: true
        });
        
        Object.defineProperty(window, 'theSignedInUsername', {
            get: () => c,
            set: () => {},
            configurable: true
        });
        
        Object.defineProperty(window, 'theSignedInEmail', {
            get: () => d,
            set: () => {},
            configurable: true
        });
        
        Object.defineProperty(window, 'theSignedInUserId', {
            get: () => e,
            set: () => {},
            configurable: true
        });

        ['LICENSE_TYPE_PERPETUAL'].forEach(k => {
            Object.defineProperty(window, k, {
                get: () => a,
                configurable: true
            });
        });
        
        ['showLimitedVersionDialog', 'showRegister', 'showSignIn', 'onClickShowRegister', 'onClickShowSignIn'].forEach(n => {
            if (window[n]) window[n] = () => {};
        });
    }

    function i() {
        const j = () => {
            if (typeof window.handleMessageFromCpp === 'function' && !f) {
                f = window.handleMessageFromCpp;
                
                window.handleMessageFromCpp = function(m) {
                    try {
                        const n = atob(m.data);
                        const o = JSON.parse(decodeURIComponent(escape(n)));

                        if (o.requestClass === 'gui' && ['showLimitedVersionDialog', 'showRegister', 'showSignIn', 'showRegisterSignInDialog'].includes(o.requestMethod)) {
                            return;
                        }

                        if (o.requestClass === 'gui' && o.requestMethod === 'setPrivileges') {
                            o.requestArguments.privileges = a;
                            o.requestArguments.trialTimeRemaining = "";
                        }
                        
                        if (o.requestClass === 'gui' && o.requestMethod === 'onSignIn') {
                            if (!o.requestArguments) o.requestArguments = {};
                            o.requestArguments.username = c;
                            o.requestArguments.email = d;
                            o.requestArguments.userId = e;
                        }

                        if (o.requestArguments) {
                            if ('maxCircuits' in o.requestArguments) o.requestArguments.maxCircuits = b;
                            if ('maxComponents' in o.requestArguments) o.requestArguments.maxComponents = b;
                            if ('privileges' in o.requestArguments) o.requestArguments.privileges = a;
                        }

                        m.data = btoa(unescape(encodeURIComponent(JSON.stringify(o))));
                    } catch(p) {}
                    
                    return f.call(this, m);
                };
            }

            if (typeof window.postMessageToCpp === 'function' && !g) {
                g = window.postMessageToCpp;
                
                window.postMessageToCpp = function(q) {
                    try {
                        let r = JSON.parse(q);
                        
                        if (r.requestClass === 'cloud') {
                            if (['getUserData', 'getUserCircuits', 'getUserInfo'].includes(r.requestMethod)) {
                                setTimeout(() => {
                                    if (window.handleMessageFromCpp) {
                                        const s = {
                                            requestId: r.requestId || 0,
                                            requestClass: 'cloud',
                                            requestMethod: r.requestMethod,
                                            requestArguments: {
                                                username: c,
                                                email: d,
                                                userId: e,
                                                privileges: a,
                                                maxCircuits: b,
                                                success: 1
                                            }
                                        };
                                        window.handleMessageFromCpp({ data: btoa(unescape(encodeURIComponent(JSON.stringify(s)))) });
                                    }
                                }, 10);
                                return;
                            }
                            
                            if (['registerUser', 'signInUserGeneral', 'getSessionGeneral'].includes(r.requestMethod)) {
                                const t = window.handleGAEResponse || function(){};
                                window.handleGAEResponse = function(u, v, w, x) {
                                    if (x && typeof x === 'object') {
                                        x.privileges = a;
                                        x.trialTimeRemaining = "";
                                        x.maxCircuits = b;
                                        x.username = c;
                                        x.email = d;
                                        x.userId = e;
                                    }
                                    return t(u, v, w, x);
                                };
                            }
                        }
                        
                        if (r.requestArguments && 'privileges' in r.requestArguments && r.requestArguments.privileges < 0) {
                            r.requestArguments.privileges = a;
                        }
                        
                        q = JSON.stringify(r);
                    } catch(y) {}
                    
                    return g.call(this, q);
                };
            }

            if (window.Module && window.Module.ccall && !window.Module._p) {
                const z = window.Module.ccall;
                window.Module.ccall = function(A, B, C, D) {
                    if (A === 'fromJSHandleMessage' && D && D[0]) {
                        try {
                            let E = JSON.parse(D[0]);
                            if (E.requestClass === 'gui') {
                                if (!E.requestArguments) E.requestArguments = {};
                                E.requestArguments.privileges = a;
                                E.requestArguments.maxCircuits = b;
                            }
                            D[0] = JSON.stringify(E);
                        } catch(F) {}
                    }
                    return z.apply(this, arguments);
                };
                window.Module._p = true;
            }
        };

        new MutationObserver(j).observe(document.documentElement, { childList: true, subtree: true });
        const k = setInterval(j, 100);
        setTimeout(() => clearInterval(k), 10000);
        j();
    }

    function l() {
        const m = document.createElement('script');
        m.textContent = `
            (function() {
                const a = 2, b = 999999, c = "${c}", d = "${d}", e = "${e}";
                
                const f = XMLHttpRequest.prototype.open;
                const g = XMLHttpRequest.prototype.send;
                
                XMLHttpRequest.prototype.open = function(h, i) {
                    this._u = i;
                    return f.apply(this, arguments);
                };
                
                XMLHttpRequest.prototype.send = function() {
                    if (this._u && (this._u.includes('pathDirect') || this._u.includes('cloud') || this._u.includes('everycircuit'))) {
                        if (this._u.includes('getUserData') || this._u.includes('getUserInfo') || this._u.includes('getUserCircuits')) {
                            const j = JSON.stringify({
                                username: c, email: d, userId: e, privileges: a,
                                maxCircuits: b, maxDevices: b, trialTimeRemaining: "", success: 1
                            });
                            Object.defineProperty(this, 'responseText', { value: j, writable: false });
                            Object.defineProperty(this, 'response', { value: j, writable: false });
                            Object.defineProperty(this, 'status', { value: 200, writable: false });
                            Object.defineProperty(this, 'readyState', { value: 4, writable: false });
                            setTimeout(() => {
                                if (this.onload) this.onload();
                                if (this.onreadystatechange) this.onreadystatechange();
                            }, 1);
                            return;
                        }
                        
                        const k = this.onload, l = this.onreadystatechange;
                        const m = () => {
                            try {
                                if (this.responseText) {
                                    let n = JSON.parse(this.responseText);
                                    let o = false;
                                    if (n.privileges !== undefined && n.privileges !== a) { n.privileges = a; o = true; }
                                    if (n.trialTimeRemaining !== undefined && n.trialTimeRemaining !== "") { n.trialTimeRemaining = ""; o = true; }
                                    if (n.maxCircuits !== undefined && n.maxCircuits < b) { n.maxCircuits = b; o = true; }
                                    if (n.maxDevices !== undefined && n.maxDevices < b) { n.maxDevices = b; o = true; }
                                    if (n.maxComponents !== undefined && n.maxComponents < b) { n.maxComponents = b; o = true; }
                                    
                                    if (this._u.includes('getSession') || this._u.includes('signIn') || this._u.includes('register')) {
                                        if (!n.username || n.username === "") { n.username = c; o = true; }
                                        if (!n.email || n.email === "") { n.email = d; o = true; }
                                        if (!n.userId || n.userId === "") { n.userId = e; o = true; }
                                    }
                                    
                                    if (o) {
                                        const p = JSON.stringify(n);
                                        Object.defineProperty(this, 'responseText', { value: p, writable: false, configurable: true });
                                        Object.defineProperty(this, 'response', { value: p, writable: false, configurable: true });
                                    }
                                }
                            } catch(q) {}
                        };
                        
                        this.onload = function() { m(); if (k) k.apply(this, arguments); };
                        this.onreadystatechange = function() { if (this.readyState === 4) m(); if (l) l.apply(this, arguments); };
                    }
                    return g.apply(this, arguments);
                };
                
                const r = Object.defineProperty;
                Object.defineProperty = function(s, t, u) {
                    const v = {
                        'thePrivileges': { get: () => a, set: () => {} },
                        'theTrialTimeRemaining': { get: () => "", set: () => {} },
                        'theSignedInUsername': { get: () => c, set: () => {} },
                        'theSignedInEmail': { get: () => d, set: () => {} },
                        'theSignedInUserId': { get: () => e, set: () => {} }
                    };
                    if (v[t]) {
                        if (u.get || u.set) { delete u.value; delete u.writable; }
                        return r.call(this, s, t, { ...v[t], configurable: true });
                    }
                    return r.call(this, s, t, u);
                };
                
                const w = window.setTimeout;
                window.setTimeout = function(x, y, ...z) {
                    if (typeof x === 'function') {
                        const A = x;
                        x = function(...B) {
                            if (window.thePrivileges !== a) {
                                try { window.thePrivileges = a; } catch(C) {}
                            }
                            return A.apply(this, B);
                        };
                    }
                    return w.call(this, x, y, ...z);
                };
                
                ['showLimitedVersionDialog', 'showRegister', 'showSignIn', 'onClickShowRegister', 'onClickShowSignIn'].forEach(D => {
                    window[D] = () => {};
                });
            })();
        `;
        (document.head || document.documentElement).appendChild(m);
        m.remove();
    }

    function n() {
        setInterval(() => {
            if (window.thePrivileges !== a) {
                try {
                    window.thePrivileges = a;
                } catch(o) {
                    try {
                        Object.defineProperty(window, 'thePrivileges', {
                            value: a,
                            writable: false,
                            configurable: true
                        });
                    } catch(p) {}
                }
            }
            if (window.theTrialTimeRemaining !== "") {
                try { window.theTrialTimeRemaining = ""; } catch(q) {}
            }
        }, 100);
    }

    const r = window.fetch;
    window.fetch = function(...s) {
        const t = s[0];
        if (typeof t === 'string' && t.includes('sim_mt.wasm')) {
            return r.apply(this, s).then(u => {
                return u.arrayBuffer().then(v => {
                    const w = new Uint8Array(v);
                    const x = [
                        { f: 'privileges', t: 'xxxxxxxxxxx' },
                        { f: 'need basic license', t: 'xxxx xxxxx xxxxxxx' },
                        { f: 'basic license required', t: 'xxxxx xxxxxxx xxxxxxxx' }
                    ];
                    
                    for (const y of x) {
                        for (let z = 0; z < w.length - y.f.length; z++) {
                            let A = true;
                            for (let B = 0; B < y.f.length; B++) {
                                if (w[z + B] !== y.f.charCodeAt(B)) {
                                    A = false;
                                    break;
                                }
                            }
                            if (A) {
                                for (let C = 0; C < y.t.length; C++) {
                                    w[z + C] = y.t.charCodeAt(C);
                                }
                            }
                        }
                    }
                    
                    return new Response(w.buffer, {
                        status: u.status,
                        statusText: u.statusText,
                        headers: u.headers
                    });
                });
            });
        }
        return r.apply(this, s);
    };

    l();
    h();
    i();
    n();

    window.addEventListener('load', () => {
        setTimeout(() => {
            h();
            i();
        }, 1000);
    });

})();
