// ==UserScript==
// @name         LSTSim Custom Sound
// @namespace    http://tampermonkey.net/
// @version      2.2|26_12_2025
// @description  Sostituisce i suoni di LSTSim con più metodi (constructor, setter, play, fetch, XHR, MutationObserver). Logs dettagliati.
// @match https://*.lstsim.de/
// @match https://lstsim.de/
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550047/LSTSim%20Custom%20Sound.user.js
// @updateURL https://update.greasyfork.org/scripts/550047/LSTSim%20Custom%20Sound.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const TAG = '[LSTSimPatch]';

    // --- CONFIG: URL custom
    const customSounds = {
    "gong.ogg": "https://audio.jukehost.co.uk/QIOrEVnlL6tycRmpNEyoHE0gwnbg500I",
    "funkspruch.ogg": "https://audio.jukehost.co.uk/f4TjCGswvMpGYn8xeQo80eW874APtSMB",
    "sprechwunsch.ogg": "https://audio.jukehost.co.uk/le8uV6TlDJx44TsBeRv6LJFUsqX7TKXO",
    "telefon.ogg": "https://audio.jukehost.co.uk/lOBVFIvKHaaWjfzwZ2WmZ2v3wgzphaY8"
    };

    const escapeRegex = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    function matchAndReplace(src) {
        try {
            if (!src || typeof src !== 'string') return null;
            const s = src.trim();
            // ignore blob/data: questi vanno gestiti altrove
            if (s.startsWith('blob:') || s.startsWith('data:')) return null;
            for (const [key, customUrl] of Object.entries(customSounds)) {
                const reEnd = new RegExp(escapeRegex(key) + '(?:\\?.*)?$', 'i'); // termina con key (opz. query)
                if (reEnd.test(s)) {
                    console.log(TAG, 'match (end):', key, '->', customUrl, '(src:', s, ')');
                    return customUrl;
                }
                // fallback: contiene il nome del file in qualsiasi parte
                if (s.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
                    console.log(TAG, 'match (contains):', key, '->', customUrl, '(src:', s, ')');
                    return customUrl;
                }
            }
        } catch (e) {
            console.error(TAG, 'matchAndReplace error', e);
        }
        return null;
    }

    // small helper log
    function safeLog(...args) {
        try { console.log(TAG, ...args); } catch(e) {}
    }

    // --- 1) Patch Audio constructor (subclass quando possibile)
    const NativeAudio = window.Audio;
    if (NativeAudio) {
        try {
            class PatchedAudio extends NativeAudio {
                constructor(src) {
                    const replacement = matchAndReplace(src);
                    super(replacement || src);
                    if (replacement) this._lstsim_replaced = true;
                }
            }
            // preserve static chain
            Object.setPrototypeOf(PatchedAudio, NativeAudio);
            window.Audio = PatchedAudio;
            safeLog('Audio constructor patched (subclass).');
        } catch (e) {
            // fallback wrapper
            window.Audio = function(src) {
                const replacement = matchAndReplace(src);
                return new NativeAudio(replacement || src);
            };
            window.Audio.prototype = NativeAudio.prototype;
            safeLog('Audio constructor patched (wrapper).');
        }
    } else {
        safeLog('window.Audio non disponibile.');
    }

    // --- 2) Intercetta play()
    try {
        const origPlay = HTMLMediaElement.prototype.play;
        HTMLMediaElement.prototype.play = function() {
            try {
                const replacement = matchAndReplace(this.src);
                if (replacement && this.src !== replacement) {
                    safeLog('Replacing src on play:', this.src, '->', replacement, this);
                    this.src = replacement;
                    // patch <source> children
                    try {
                        const sources = this.querySelectorAll && this.querySelectorAll('source');
                        if (sources && sources.length) {
                            sources.forEach(s => {
                                const r = matchAndReplace(s.src);
                                if (r && s.src !== r) {
                                    safeLog('Replacing <source> src:', s.src, '->', r);
                                    s.src = r;
                                }
                            });
                        }
                    } catch(e) {}
                }
            } catch (e) {}
            return origPlay.apply(this, arguments);
        };
        safeLog('HTMLMediaElement.play patched.');
            // --- PATCH: muta esclusivamente il suono status.ogg
    try {
        const origPlay2 = HTMLMediaElement.prototype.play;
        HTMLMediaElement.prototype.play = function() {
            try {
                const src = this.src || "";
                if (src.toLowerCase().includes("status.ogg")) {
                    // Muta il volume
                    this.volume = 0;
                    safeLog("status.ogg mutato (volume=0) su play().");
                }
            } catch(e){}
            return origPlay2.apply(this, arguments);
        };
        safeLog("Mute patch per status.ogg attiva.");
    } catch(e) {
        safeLog("Errore mute status.ogg:", e);
    }

    } catch (e) {
        safeLog('Could not patch play():', e);
    }

    // --- 3) Patch src setter (se configurabile)
    try {
        const desc = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'src');
        if (desc && desc.configurable && typeof desc.set === 'function') {
            Object.defineProperty(HTMLMediaElement.prototype, 'src', {
                get: function() { return desc.get.call(this); },
                set: function(v) {
                    try {
                        const replacement = matchAndReplace(v);
                        if (replacement && v !== replacement) {
                            safeLog('Replacing src in setter:', v, '->', replacement, this);
                            v = replacement;
                        }
                    } catch (e) {}
                    return desc.set.call(this, v);
                },
                configurable: true,
                enumerable: desc.enumerable
            });
            safeLog('HTMLMediaElement.src setter patched.');
        } else {
            safeLog('HTMLMediaElement.src descriptor non configurable — skipping setter patch.');
        }
    } catch (e) {
        safeLog('Error patching src setter:', e);
    }

    // --- 4) patch setAttribute('src', ...)
    try {
        const origSetAttr = Element.prototype.setAttribute;
        Element.prototype.setAttribute = function(name, value) {
            try {
                if (name && name.toLowerCase() === 'src') {
                    const tag = (this.tagName || '').toUpperCase();
                    if (tag === 'AUDIO' || tag === 'SOURCE' || this instanceof HTMLAudioElement) {
                        const replacement = matchAndReplace(value);
                        if (replacement && value !== replacement) {
                            safeLog('Replacing src via setAttribute:', value, '->', replacement, this);
                            value = replacement;
                        }
                    }
                }
            } catch (e) {}
            return origSetAttr.call(this, name, value);
        };
        safeLog('Element.setAttribute patched.');
    } catch (e) {
        safeLog('Could not patch setAttribute:', e);
    }

    // --- 5) MutationObserver su audio/source e attributes src
    try {
        const mo = new MutationObserver(muts => {
            for (const m of muts) {
                if (m.type === 'childList' && m.addedNodes && m.addedNodes.length) {
                    m.addedNodes.forEach(node => tryPatchNodeAndChildren(node));
                } else if (m.type === 'attributes' && m.attributeName === 'src') {
                    tryPatchElement(m.target);
                }
            }
        });
        mo.observe(document, { childList: true, subtree: true, attributes: true, attributeFilter: ['src'] });

        function tryPatchNodeAndChildren(node) {
            if (!node || node.nodeType !== 1) return;
            if (node.tagName === 'AUDIO' || node.tagName === 'SOURCE') tryPatchElement(node);
            const audios = node.querySelectorAll && node.querySelectorAll('audio, source');
            if (audios && audios.length) audios.forEach(e => tryPatchElement(e));
        }
        function tryPatchElement(el) {
            try {
                if (!el) return;
                const src = el.src || el.getAttribute && el.getAttribute('src');
                if (!src) return;
                const replacement = matchAndReplace(src);
                if (replacement && src !== replacement) {
                    safeLog('Patching element src (mutation):', src, '->', replacement, el);
                    try { el.src = replacement; } catch(e) { try { el.setAttribute && el.setAttribute('src', replacement); } catch(e2){} }
                }
            } catch(e){}
        }
        safeLog('MutationObserver attivo.');
    } catch (e) {
        safeLog('MutationObserver error:', e);
    }

    // --- 6) patch fetch()
    try {
        const origFetch = window.fetch;
        if (origFetch) {
            window.fetch = function(input, init) {
                try {
                    if (typeof input === 'string') {
                        const r = matchAndReplace(input);
                        if (r) {
                            safeLog('Replacing fetch url:', input, '->', r);
                            input = r;
                        }
                    } else if (input && input.url) {
                        const r = matchAndReplace(input.url);
                        if (r) {
                            safeLog('Replacing fetch Request url:', input.url, '->', r);
                            // tentativo di creare una Request con la stessa init (non sempre perfetto)
                            const newInit = {
                                method: input.method,
                                headers: input.headers,
                                mode: input.mode,
                                credentials: input.credentials,
                                cache: input.cache,
                                redirect: input.redirect,
                                referrer: input.referrer,
                                integrity: input.integrity
                            };
                            input = new Request(r, newInit);
                        }
                    }
                } catch (e) {}
                return origFetch.call(this, input, init);
            };
            safeLog('fetch patched.');
        }
    } catch (e) {
        safeLog('Could not patch fetch():', e);
    }

    // --- 7) patch XHR.open
    try {
        const origOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
            try {
                const r = matchAndReplace(url);
                if (r) {
                    safeLog('Replacing XHR url:', url, '->', r);
                    return origOpen.call(this, method, r, async, user, password);
                }
            } catch (e) {}
            return origOpen.call(this, method, url, async, user, password);
        };
        safeLog('XMLHttpRequest.open patched.');
    } catch (e) {
        safeLog('Could not patch XHR.open:', e);
    }

    // --- 8) patch elementi già presenti e riprova per i primi istanti
    function patchExisting() {
        try {
            document.querySelectorAll && document.querySelectorAll('audio, source').forEach(el => {
                try {
                    const src = el.src || el.getAttribute && el.getAttribute('src');
                    if (!src) return;
                    const r = matchAndReplace(src);
                    if (r && src !== r) {
                        safeLog('Patching existing element src:', src, '->', r, el);
                        el.src = r;
                    }
                } catch(e){}
            });
        } catch(e){}
    }
    patchExisting();
    const startInterval = setInterval(() => {
        patchExisting();
        if (document.readyState === 'complete') clearInterval(startInterval);
    }, 250);

    // --- 9) utile: log errori di loading audio per capire se il custom fallisce (CORS / blocked)
    window.addEventListener('error', function(ev) {
        try {
            const tgt = ev && ev.target;
            if (tgt && (tgt.tagName === 'AUDIO' || tgt.tagName === 'SOURCE')) {
                safeLog('audio load error event:', tgt.src, ev);
            }
        } catch(e){}
    }, true);

    safeLog('inizializzato.');
})();
