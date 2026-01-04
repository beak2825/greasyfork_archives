// ==UserScript==
// @name         Marzipano - ZIP Project Loader
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Load exported ZIP files to restore projects with all hotspots
// @author       6969RandomGuy6969
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=marzipano.net
// @match        https://www.marzipano.net/tool/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/560942/Marzipano%20-%20ZIP%20Project%20Loader.user.js
// @updateURL https://update.greasyfork.org/scripts/560942/Marzipano%20-%20ZIP%20Project%20Loader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STATE = {
        restoredPanos: new WeakSet(),
        pendingLinks: [],
        previousMissing: new Set(),
        previousWrong: new Set(),
        previousLoaded: new Set(),
        loadCheckTimeout: null,
        allScenesLoaded: false
    };

    // ============= UTILITIES =============
    const notify = (msg, color = '#3b82f6', duration = 3000) => {
        const vm = window.app?.viewModel;
        if (vm?.messages) {
            try {
                const levelMap = {
                    '#10b981': 'success',
                    '#ef4444': 'error',
                    '#f59e0b': 'warning',
                    '#3b82f6': 'info'
                };

                const message = {
                    html: `<p>${msg}</p>`,
                    level: levelMap[color] || 'info',
                    timestamp: Date.now()
                };

                if (typeof vm.messages.add === 'function') {
                    vm.messages.add(message);
                } else if (vm.messages.list?.push) {
                    vm.messages.list.push(message);
                }
                return;
            } catch(e) {}
        }

        // Fallback notification
        const div = document.createElement('div');
        div.textContent = msg;
        div.style.cssText = `position:fixed;top:80px;right:20px;z-index:999999;background:${color};color:#fff;padding:12px 20px;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.3);font-weight:600;font-size:14px;transition:opacity .3s`;
        document.body.appendChild(div);
        setTimeout(() => {
            div.style.opacity = '0';
            setTimeout(() => div.remove(), 300);
        }, duration);
    };

    const unwrap = (v) => v == null ? null : typeof v === 'function' ? v() : v;

    const getName = (p) => {
        if (!p) return null;
        if (typeof p === 'string') return p;
        const n = p.name;
        return n ? (typeof n === 'function' ? n() : n) : null;
    };

    const getId = (p) => {
        if (!p) return null;
        if (typeof p === 'string') return p;
        try {
            return typeof p.uniqueId === 'function' ? p.uniqueId() : (p.uniqueId || p.id || p._id);
        } catch(e) {
            return p.id || p._id;
        }
    };

    const loadJSZip = () => {
        if (window.JSZip) return Promise.resolve(window.JSZip);
        return new Promise((resolve, reject) => {
            const s = document.createElement('script');
            s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
            s.onload = () => resolve(window.JSZip);
            s.onerror = () => reject(new Error('JSZip load failed'));
            document.head.appendChild(s);
        });
    };

    // ============= ZIP PARSER =============
    const parseZip = async (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const JSZip = await loadJSZip();
                    const zip = await JSZip.loadAsync(e.target.result);

                    let dataJs = null;
                    for (let fn in zip.files) {
                        if (fn.endsWith('data.js')) {
                            dataJs = await zip.files[fn].async('text');
                            break;
                        }
                    }

                    if (!dataJs) return reject(new Error('data.js not found in ZIP'));

                    dataJs = dataJs.replace(/\/\/.*?\n/g, '\n').replace(/\/\*.*?\*\//gs, '');
                    const match = dataJs.match(/var\s+APP_DATA\s*=\s*({.*?});?\s*$/s);
                    if (!match) return reject(new Error('APP_DATA not found'));

                    const appData = JSON.parse(match[1]);
                    const idMap = {};

                    (appData.scenes || []).forEach(s => {
                        if (s.id && s.name) idMap[s.id] = s.name;
                    });

                    const scenes = (appData.scenes || []).map(s => ({
                        id: s.id || '',
                        name: s.name || '',
                        levels: s.levels || [],
                        faceSize: s.faceSize || 2048,
                        initialViewParameters: s.initialViewParameters || {},
                        linkHotspots: (s.linkHotspots || []).map(h => ({
                            yaw: h.yaw,
                            pitch: h.pitch,
                            rotation: h.rotation || 0,
                            target: idMap[h.target] || h.target,
                            targetId: h.target
                        })),
                        infoHotspots: s.infoHotspots || []
                    }));

                    resolve({
                        name: appData.name || 'Project',
                        settings: appData.settings || {},
                        scenes
                    });
                } catch (err) {
                    reject(err);
                }
            };
            reader.onerror = () => reject(new Error('File read failed'));
            reader.readAsArrayBuffer(file);
        });
    };

    // ============= RESTORE LOGIC =============
    const loadProject = (data) => {
        try {
            const vm = window.app?.viewModel;
            if (!vm) throw new Error('ViewModel not found');

            window.__MARZIPANO_DATA__ = data;

            // Reset state for new project
            STATE.previousMissing.clear();
            STATE.previousWrong.clear();
            STATE.previousLoaded.clear();
            STATE.allScenesLoaded = false;

            if (data.settings) {
                vm.settings.mouseViewMode(data.settings.mouseViewMode || 'drag');
                vm.settings.autorotateEnabled(data.settings.autorotateEnabled || false);
                vm.settings.fullscreenButton(data.settings.fullscreenButton !== false);
                vm.settings.viewControlButtons(data.settings.viewControlButtons !== false);
            }

            if (data.name && vm.projectName) vm.projectName = data.name;

            setupRestore(vm);

            const guide = document.getElementById('zip-guide');
            if (guide) {
                guide.style.background = '#10b981';
                guide.innerHTML = '<strong>✅ ZIP Loaded!</strong> Upload panorama images with exact scene names to restore hotspots and settings.';
            }
        } catch(e) {
            notify('❌ Load failed', '#ef4444');
        }
    };

    const setupRestore = (vm) => {
        const origPush = vm.panoramas.list.push;

        vm.panoramas.list.push = function(...args) {
            const result = origPush.apply(this, args);

            setTimeout(() => {
                const data = window.__MARZIPANO_DATA__;
                if (!data?.scenes) return;

                const panos = unwrap(vm.panoramas.list) || [];

                panos.forEach((pano, i) => {
                    if (STATE.restoredPanos.has(pano)) return;

                    const name = getName(pano);
                    const id = getId(pano);

                    let scene = data.scenes.find(s => s.name === name) ||
                        data.scenes.find(s => s.id === id) ||
                        data.scenes[i];

                    if (scene) {
                        restorePano(vm, pano, scene);
                        STATE.restoredPanos.add(pano);
                    }
                });

                resolveLinks(vm);

                if (STATE.loadCheckTimeout) clearTimeout(STATE.loadCheckTimeout);

                STATE.loadCheckTimeout = setTimeout(() => {
                    reorder(vm, data);
                    logLoadStatus(data);
                    STATE.loadCheckTimeout = null;
                }, 1500);
            }, 1500);

            return result;
        };
    };

    const restorePano = (vm, pano, scene) => {
        try {
            const currentName = getName(pano);
            if (currentName !== scene.name) return;

            if (scene.initialViewParameters && pano.settings?.initialViewParameters) {
                const ivp = scene.initialViewParameters;
                const set = pano.settings.initialViewParameters;

                ['pitch', 'yaw', 'fov'].forEach(k => {
                    if (typeof ivp[k] === 'number') {
                        typeof set[k] === 'function' ? set[k](ivp[k]) : set[k] = ivp[k];
                    }
                });
            }

            const linkHS = pano.settings?.linkHotspots;
            const infoHS = pano.settings?.infoHotspots;

            if (scene.linkHotspots?.length && Array.isArray(linkHS)) {
                scene.linkHotspots.forEach(h => linkHS.push(createLinkHotspot(h, vm)));
            }

            if (scene.infoHotspots?.length && Array.isArray(infoHS)) {
                scene.infoHotspots.forEach(h => infoHS.push(createInfoHotspot(h)));
            }
        } catch(e) {}
    };

    const createLinkHotspot = (data, vm) => {
        const hs = Object.create({ __events: { coordinatesChanged: [] } });
        let _yaw = data.yaw, _pitch = data.pitch, _rot = data.rotation || 0, _target = null;

        const tid = data.targetId || data.target;
        if (tid) {
            const list = unwrap(vm.panoramas.list) || [];
            const t = list.find(p => getName(p) === tid || getId(p) === tid ||
                                (data.target && getName(p) === data.target) ||
                                (data.targetId && getId(p) === data.targetId));

            if (t) {
                _target = t;
            } else {
                STATE.pendingLinks.push({ hs, target: data.target, targetId: data.targetId });
            }
        }

        const triggerCoordinateChange = () => {
            hs.__events?.coordinatesChanged?.forEach(cb => {
                try { cb(); } catch(e) {}
            });
        };

        Object.defineProperties(hs, {
            yaw: {
                get: () => _yaw,
                set: (v) => {
                    if (_yaw !== v) {
                        _yaw = v;
                        triggerCoordinateChange();
                    }
                },
                enumerable: true
            },
            pitch: {
                get: () => _pitch,
                set: (v) => {
                    if (_pitch !== v) {
                        _pitch = v;
                        triggerCoordinateChange();
                    }
                },
                enumerable: true
            },
            rotation: { get: () => _rot, set: (v) => _rot = v, enumerable: true },
            target: { get: () => _target, set: (v) => _target = v, enumerable: true }
        });

        hs.setCoordinates = function(coords) {
            if (coords.yaw !== undefined) _yaw = coords.yaw;
            if (coords.pitch !== undefined) _pitch = coords.pitch;
            triggerCoordinateChange();
        };

        hs.hasValidTarget = () => _target !== null;
        hs.setTarget = (t) => _target = t;
        hs.targetIs = (t) => _target === t;
        hs.selectTarget = (t) => hs.setTarget(t);

        hs.addEventListener = (event, callback) => {
            if (!hs.__events[event]) hs.__events[event] = [];
            hs.__events[event].push(callback);
        };

        hs.removeEventListener = (event, callback) => {
            if (hs.__events[event]) {
                hs.__events[event] = hs.__events[event].filter(cb => cb !== callback);
            }
        };

        hs.toObject = () => ({
            yaw: _yaw,
            pitch: _pitch,
            rotation: _rot,
            target: _target ? (getId(_target) || _target) : null
        });

        return hs;
    };

    const createInfoHotspot = (data) => {
        const hs = Object.create({ __events: { coordinatesChanged: [] } });
        let _yaw = data.yaw, _pitch = data.pitch, _title = data.title || '', _text = data.text || '';

        const triggerCoordinateChange = () => {
            hs.__events?.coordinatesChanged?.forEach(cb => {
                try { cb(); } catch(e) {}
            });
        };

        Object.defineProperties(hs, {
            yaw: {
                get: () => _yaw,
                set: (v) => {
                    if (_yaw !== v) {
                        _yaw = v;
                        triggerCoordinateChange();
                    }
                },
                enumerable: true
            },
            pitch: {
                get: () => _pitch,
                set: (v) => {
                    if (_pitch !== v) {
                        _pitch = v;
                        triggerCoordinateChange();
                    }
                },
                enumerable: true
            },
            title: { get: () => _title, set: (v) => _title = v, enumerable: true },
            text: { get: () => _text, set: (v) => _text = v, enumerable: true }
        });

        hs.setCoordinates = function(coords) {
            if (coords.yaw !== undefined) _yaw = coords.yaw;
            if (coords.pitch !== undefined) _pitch = coords.pitch;
            triggerCoordinateChange();
        };

        hs.addEventListener = (event, callback) => {
            if (!hs.__events[event]) hs.__events[event] = [];
            hs.__events[event].push(callback);
        };

        hs.removeEventListener = (event, callback) => {
            if (hs.__events[event]) {
                hs.__events[event] = hs.__events[event].filter(cb => cb !== callback);
            }
        };

        hs.toObject = () => ({ yaw: _yaw, pitch: _pitch, title: _title, text: _text });
        return hs;
    };

    const resolveLinks = (vm) => {
        if (STATE.pendingLinks.length === 0) return;

        let resolved = 0;
        const list = unwrap(vm.panoramas.list) || [];
        const still = [];

        STATE.pendingLinks.forEach(p => {
            const t = list.find(pano => {
                const n = getName(pano);
                const i = getId(pano);
                return n === p.target || i === p.target || n === p.targetId || i === p.targetId;
            });

            if (t) {
                p.hs.setTarget(t);
                resolved++;
            } else {
                still.push(p);
            }
        });

        if (resolved > 0 && vm.panoramas?.selectedPanorama) {
            const sel = vm.panoramas.selectedPanorama();
            vm.panoramas.selectedPanorama(null);
            setTimeout(() => vm.panoramas.selectedPanorama(sel), 100);
        }

        STATE.pendingLinks.length = 0;
        STATE.pendingLinks.push(...still);
    };

    const reorder = (vm, data) => {
        try {
            const panos = unwrap(vm.panoramas.list) || [];
            if (!panos.length || panos.length < data.scenes.length) return;

            const map = new Map();
            panos.forEach(p => {
                const n = getName(p), i = getId(p);
                if (n) map.set(n, p);
                if (i) map.set(i, p);
            });

            const ordered = [];
            const used = new Set();

            data.scenes.forEach(s => {
                const p = map.get(s.name) || map.get(s.id);
                if (p && !used.has(p)) {
                    ordered.push(p);
                    used.add(p);
                }
            });

            panos.forEach(p => {
                if (!used.has(p)) ordered.push(p);
            });

            if (panos.every((p, i) => p === ordered[i])) return;

            if (typeof vm.panoramas.list.removeAll === 'function') {
                vm.panoramas.list.removeAll();
                ordered.forEach(p => vm.panoramas.list.push(p));
            } else {
                vm.panoramas.list = ordered;
            }

            if (vm.panoramas?.selectedPanorama) {
                const sel = vm.panoramas.selectedPanorama();
                if (sel) {
                    vm.panoramas.selectedPanorama(null);
                    setTimeout(() => vm.panoramas.selectedPanorama(sel), 100);
                }
            }
        } catch(e) {}
    };

    const logLoadStatus = (data) => {
        const vm = window.app?.viewModel;
        const panos = unwrap(vm?.panoramas?.list) || [];
        const loadedNames = new Set(panos.map(p => getName(p)));
        const missingScenes = [];
        const wrongImages = [];
        const correctScenes = [];

        // Find missing scenes
        data.scenes.forEach(scene => {
            if (!loadedNames.has(scene.name)) {
                missingScenes.push(scene.name);
            } else {
                correctScenes.push(scene.name);
            }
        });

        // Find wrong/extra images
        panos.forEach(pano => {
            const name = getName(pano);
            if (!data.scenes.find(s => s.name === name)) {
                wrongImages.push(name);
            }
        });

        // Determine newly added scenes (were missing before, now loaded)
        const newlyAdded = [];
        STATE.previousMissing.forEach(sceneName => {
            if (loadedNames.has(sceneName)) {
                newlyAdded.push(sceneName);
            }
        });

        const hasChanges = newlyAdded.length > 0 ||
                          missingScenes.length !== STATE.previousMissing.size ||
                          wrongImages.length !== STATE.previousWrong.size ||
                          correctScenes.some(s => !STATE.previousLoaded.has(s));

        if (hasChanges && vm?.messages) {
            try {
                // Show restoration for newly added scenes
                if (newlyAdded.length > 0) {
                    newlyAdded.forEach(sceneName => {
                        const message = {
                            html: `<p>✅ Restored: ${sceneName}</p>`,
                            level: 'success',
                            timestamp: Date.now()
                        };

                        if (typeof vm.messages.add === 'function') {
                            vm.messages.add(message);
                        } else if (vm.messages.list?.push) {
                            vm.messages.list.push(message);
                        }
                    });
                }

                // Show restoration for correct scenes (that weren't previously loaded)
                correctScenes.forEach(sceneName => {
                    if (!STATE.previousLoaded.has(sceneName) && !newlyAdded.includes(sceneName)) {
                        const message = {
                            html: `<p>✅ Restored: ${sceneName}</p>`,
                            level: 'success',
                            timestamp: Date.now()
                        };

                        if (typeof vm.messages.add === 'function') {
                            vm.messages.add(message);
                        } else if (vm.messages.list?.push) {
                            vm.messages.list.push(message);
                        }
                    }
                });

                // Show missing scenes warning
                if (missingScenes.length > 0 && newlyAdded.length === 0) {
                    const message = {
                        html: `<p>⚠️ Missing scenes:</p><p style="margin-top:4px; font-weight:normal;">${missingScenes.join(', ')}</p>`,
                        level: 'warning',
                        timestamp: Date.now()
                    };

                    if (typeof vm.messages.add === 'function') {
                        vm.messages.add(message);
                    } else if (vm.messages.list?.push) {
                        vm.messages.list.push(message);
                    }
                }

                // Show extra images info
                if (wrongImages.length > 0 && newlyAdded.length === 0 && missingScenes.length === 0) {
                    const message = {
                        html: `<p>ℹ️ New images:</p><p style="margin-top:4px; font-weight:normal;">${wrongImages.join(', ')}</p>`,
                        level: 'info',
                        timestamp: Date.now()
                    };

                    if (typeof vm.messages.add === 'function') {
                        vm.messages.add(message);
                    } else if (vm.messages.list?.push) {
                        vm.messages.list.push(message);
                    }
                }

                // All scenes loaded - show completion message with switch hint
                if (missingScenes.length === 0 && wrongImages.length === 0 && !STATE.allScenesLoaded) {
                    STATE.allScenesLoaded = true;

                    const message = {
                        html: '<p><strong>🎉 All scenes loaded successfully!</strong></p><p style="margin-top:8px; font-weight:normal;">💡 <strong>Tip:</strong> Switch between scenes to activate restored hotspots and initial views.</p>',
                        level: 'success',
                        timestamp: Date.now()
                    };

                    if (typeof vm.messages.add === 'function') {
                        vm.messages.add(message);
                    } else if (vm.messages.list?.push) {
                        vm.messages.list.push(message);
                    }

                }
            } catch(e) {}
        }

        STATE.previousMissing = new Set(missingScenes);
        STATE.previousWrong = new Set(wrongImages);
        STATE.previousLoaded = new Set(correctScenes);
    };

    // ============= UI =============
    const createUI = () => {
        const check = setInterval(() => {
            const footer = document.querySelector('#startup .footer');
            if (!footer || document.getElementById('zip-loader-btn')) {
                if (footer) clearInterval(check);
                return;
            }
            clearInterval(check);

            const btn = document.createElement('a');
            btn.id = 'zip-loader-btn';
            btn.href = '#';
            btn.className = 'select';
            btn.innerHTML = `
                <svg class="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                <div class="text">Load ZIP</div>
            `;

            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.zip';
            input.style.display = 'none';

            btn.onclick = (e) => {
                e.preventDefault();
                input.click();
            };

            input.onchange = async (e) => {
                const f = e.target.files[0];
                if (f) {
                    notify('📦 Loading ZIP...', '#3b82f6', 2000);
                    try {
                        const data = await parseZip(f);
                        loadProject(data);
                    } catch(err) {
                        notify('❌ ' + err.message, '#ef4444', 4000);
                    }
                }
                e.target.value = '';
            };

            footer.appendChild(btn);
            footer.appendChild(input);

            const body = document.querySelector('#startup .body .area');
            if (body && !document.getElementById('zip-guide')) {
                const guide = document.createElement('div');
                guide.id = 'zip-guide';
                guide.style.cssText = 'margin-top:16px;padding:12px;background:#228ecc;border-radius:8px;color:#fff;font-size:14px;text-align:center;';
                guide.innerHTML = '<strong>📦 Load ZIP:</strong> Restore exported projects with all scenes and hotspots intact';
                body.appendChild(guide);
            }
        }, 100);
    };

    // ============= INIT =============
    const init = () => {
        let attempts = 0;
        const check = setInterval(() => {
            if (window.app?.viewModel) {
                clearInterval(check);
                createUI();
            } else if (++attempts > 60) {
                clearInterval(check);
            }
        }, 500);
    };

    init();

})();