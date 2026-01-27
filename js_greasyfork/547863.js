// ==UserScript==
// @name         Multiplayer Piano Optimizations [Input/Output]
// @namespace    https://tampermonkey.net/
// @version      1.0.6
// @description  Saves and persists MIDI input/output options for you
// @author       zackiboiz
// @match        *://*.multiplayerpiano.com/*
// @match        *://*.multiplayerpiano.net/*
// @match        *://*.multiplayerpiano.org/*
// @match        *://*.multiplayerpiano.dev/*
// @match        *://piano.mpp.community/*
// @match        *://mpp.7458.space/*
// @match        *://qmppv2.qwerty0301.repl.co/*
// @match        *://mpp.8448.space/*
// @match        *://mpp.hri7566.info/*
// @match        *://mpp.autoplayer.xyz/*
// @match        *://mpp.hyye.xyz/*
// @match        *://lmpp.hyye.xyz/*
// @match        *://mpp.hyye.tk/*
// @match        *://mpp.smp-meow.net/*
// @match        *://piano.ourworldofpixels.com/*
// @match        *://mpp.lapishusky.dev/*
// @match        *://staging-mpp.sad.ovh/*
// @match        *://mpp.terrium.net/*
// @match        *://mpp.yourfriend.lv/*
// @match        *://mpp.l3m0ncao.wtf/*
// @match        *://beta-mpp.csys64.com/*
// @match        *://fleetway-mpp.glitch.me/*
// @match        *://mpp.totalh.net/*
// @match        *://mpp.meowbin.com/*
// @match        *://mppfork.netlify.app/*
// @match        *://better.mppclone.me/*
// @match        *://*.openmpp.tk/*
// @match        *://*.mppkinda.com/*
// @match        *://*.augustberchelmann.com/piano/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=multiplayerpiano.net
// @grant        GM_info
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/547863/Multiplayer%20Piano%20Optimizations%20%5BInputOutput%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/547863/Multiplayer%20Piano%20Optimizations%20%5BInputOutput%5D.meta.js
// ==/UserScript==

(async () => {
    const dl = GM_info.script.downloadURL || GM_info.script.updateURL || GM_info.script.homepageURL || "";
    const match = dl.match(/greasyfork\.org\/scripts\/(\d+)/);
    if (!match) {
        console.warn("Could not find Greasy Fork script ID in downloadURL/updateURL/homepageURL:", dl);
    } else {
        const scriptId = match[1];
        const localVersion = GM_info.script.version;
        const apiUrl = `https://greasyfork.org/scripts/${scriptId}.json?_=${Date.now()}`;

        fetch(apiUrl, {
            mode: "cors",
            headers: {
                Accept: "application/json"
            }
        }).then(r => {
            if (!r.ok) throw new Error("Failed to fetch Greasy Fork data.");
            return r.json();
        }).then(data => {
            const remoteVersion = data.version;
            if (compareVersions(localVersion, remoteVersion) < 0) {
                new MPP.Notification({
                    "m": "notification",
                    "duration": 15000,
                    "title": "Update Available",
                    "html": "<p>A new version of this script is available!</p>" +
                        `<p style="margin-top: 10px;">Script: ${GM_info.script.name}</p>` +
                        `<p>Local: v${localVersion}</p>` +
                        `<p>Latest: v${remoteVersion}</p>` +
                        `<a href="https://greasyfork.org/scripts/${scriptId}" target="_blank" style="position: absolute; right: 0;bottom: 0; margin: 10px; font-size: 0.5rem;">Open Greasy Fork to update?</a>`
                })
            }
        }).catch(err => console.error("Update check failed:", err));
    }

    function compareVersions(a, b) {
        const pa = a.split(".").map(n => parseInt(n, 10) || 0);
        const pb = b.split(".").map(n => parseInt(n, 10) || 0);
        const len = Math.max(pa.length, pb.length);
        for (let i = 0; i < len; i++) {
            if ((pa[i] || 0) < (pb[i] || 0)) return -1;
            if ((pa[i] || 0) > (pb[i] || 0)) return 1;
        }
        return 0;
    }

    const STORAGE_KEY = "midiConnections";
    const SAVE_DEBOUNCE_MS = 40;

    function loadMap() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : {};
        } catch (e) {
            console.warn("MIDI persist load failed", e);
            return {};
        }
    }

    function saveMap(map) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
        } catch (e) {
            console.warn("MIDI persist save failed", e);
        }
    }

    function idKey(kind, id) {
        return `${kind}:id:${(id || "").trim()}`;
    }
    function nameKey(kind, name) {
        return `${kind}:name:${(name || "").trim()}`;
    }

    function tn(s) {
        return (s || "").trim();
    }

    function getSavedForDevice(map, kind, device) {
        if (!device) return undefined;
        if (device.id) {
            const k = idKey(kind, device.id);
            if (Object.prototype.hasOwnProperty.call(map, k)) return !!map[k];
        }
        const nk = nameKey(kind, device.name || "");
        if (Object.prototype.hasOwnProperty.call(map, nk)) return !!map[nk];
        return undefined;
    }

    function setSavedForDevice(map, kind, device, enabled) {
        if (device && device.id) map[idKey(kind, device.id)] = !!enabled;
        if (device && device.name) map[nameKey(kind, device.name)] = !!enabled;
    }

    function applySavedStates(midi) {
        if (!midi) return;
        const map = loadMap();

        // inputs
        for (let it = midi.inputs.values(), n = it.next(); n && !n.done; n = it.next()) {
            const input = n.value;
            const saved = getSavedForDevice(map, "input", input);
            if (typeof saved !== "undefined") {
                try {
                    input.enabled = !!saved;
                } catch (e) { /* ignore */ }
            }
        }

        // outputs
        for (let it = midi.outputs.values(), n = it.next(); n && !n.done; n = it.next()) {
            const output = n.value;
            const saved = getSavedForDevice(map, "output", output);
            if (typeof saved !== "undefined") {
                try {
                    output.enabled = !!saved;
                } catch (e) { /* ignore */ }
            }
        }
    }

    function findDevice(midi, identifier, preferredKind) {
        if (!midi || !identifier) return null;
        const t = tn(identifier);

        function tryFindById(kind) {
            const list = kind === "input" ? midi.inputs.values() : midi.outputs.values();
            for (let it = list, r = it.next(); r && !r.done; r = it.next()) {
                const dev = r.value;
                if (dev.id && dev.id === identifier) return { dev, kind };
            }
            return null;
        }
        function tryFindByName(kind) {
            const list = kind === "input" ? midi.inputs.values() : midi.outputs.values();
            for (let it = list, r = it.next(); r && !r.done; r = it.next()) {
                const dev = r.value;
                if (tn(dev.name) === t) return { dev, kind };
            }
            return null;
        }

        if (preferredKind === "output") {
            return tryFindById("output") || tryFindByName("output") || tryFindById("input") || tryFindByName("input");
        } else if (preferredKind === "input") {
            return tryFindById("input") || tryFindByName("input") || tryFindById("output") || tryFindByName("output");
        } else {
            return tryFindById("input") || tryFindByName("input") || tryFindById("output") || tryFindByName("output");
        }
    }

    function detectKindFromElement(el) {
        if (!el) return null;

        try {
            let ancestor = el;
            while (ancestor && ancestor !== document.body) {
                if (ancestor.tagName && /^H\d$/i.test(ancestor.tagName) && /inputs?/i.test(ancestor.textContent || "")) return "input";
                if (ancestor.tagName && /^H\d$/i.test(ancestor.tagName) && /outputs?/i.test(ancestor.textContent || "")) return "output";
                ancestor = ancestor.parentElement;
            }

            const ul = el.closest("ul");
            if (ul) {
                let prev = ul.previousElementSibling;
                while (prev) {
                    if (prev.tagName && /^H\d$/i.test(prev.tagName)) {
                        if (/inputs?/i.test(prev.textContent || "")) return "input";
                        if (/outputs?/i.test(prev.textContent || "")) return "output";
                    }
                    prev = prev.previousElementSibling;
                }
            }
        } catch (e) { }
        return null;
    }

    const lastSaved = new Map();
    function shouldSaveKey(key, val) {
        const now = Date.now();
        const prev = lastSaved.get(key);
        if (prev && prev.val === !!val && (now - prev.ts) < 1000) {
            return false;
        }
        lastSaved.set(key, {
            val: !!val,
            ts: now
        });
        return true;
    }

    function persistDeviceKindState(kind, device, enabled) {
        if (!kind || !device) return;
        const map = loadMap();

        if (device.id) {
            const k = idKey(kind, device.id);
            if (shouldSaveKey(k, enabled)) map[k] = !!enabled;
        }
        if (device.name) {
            const kn = nameKey(kind, device.name);
            if (shouldSaveKey(kn, enabled)) map[kn] = !!enabled;
        }
        saveMap(map);
    }

    function persistByName(kind, name, enabled) {
        if (!name || !kind) return;
        const map = loadMap();
        const kn = nameKey(kind, name);
        if (!shouldSaveKey(kn, enabled)) return;
        map[kn] = !!enabled;
        saveMap(map);
    }

    if (navigator.requestMIDIAccess) {
        const orig = navigator.requestMIDIAccess.bind(navigator);
        navigator.requestMIDIAccess = function (options) {
            return orig(options).then((midi) => {
                try {
                    applySavedStates(midi);
                } catch (e) {
                    console.warn("MIDI persist apply error", e);
                }

                midi.addEventListener("statechange", () => {
                    setTimeout(() => {
                        try {
                            applySavedStates(midi);
                        } catch (e) { }
                    }, 60);
                });

                const processedElements = new WeakSet();
                let saveTimer = null;
                let pending = [];

                function flushPending() {
                    if (!pending.length) return;
                    const copy = pending.slice();
                    pending = [];
                    for (const item of copy) {
                        const { el, displayName } = item;
                        const detectedKind = detectKindFromElement(el) || null;
                        const found = findDevice(midi, displayName, detectedKind || undefined);

                        if (found && found.dev) {
                            persistDeviceKindState(found.kind, found.dev, !!found.dev.enabled);
                        } else {
                            const kindToSave = detectedKind || "input";
                            const enabledFromClass = !!(el.classList && el.classList.contains("enabled"));
                            persistByName(kindToSave, displayName, enabledFromClass);
                        }
                    }
                }

                document.addEventListener("click", function (ev) {
                    const target = ev.target;
                    if (!target || typeof target.closest !== "function") return;
                    const li = target.closest(".connection");
                    if (!li) return;

                    if (processedElements.has(li)) {
                        // :hiiiperz:
                    } else {
                        processedElements.add(li);
                        setTimeout(() => processedElements.delete(li), 800);
                    }

                    const nameAttr = (li.getAttribute && (li.getAttribute("data-name") || li.getAttribute("title"))) || null;
                    const displayName = tn(nameAttr || li.textContent || "");

                    pending.push({ el: li, displayName });
                    if (saveTimer) clearTimeout(saveTimer);
                    saveTimer = setTimeout(() => { saveTimer = null; flushPending(); }, SAVE_DEBOUNCE_MS);
                }, false);

                const seen = new WeakSet();
                const observer = new MutationObserver((mutations) => {
                    for (const m of mutations) {
                        if (!m.addedNodes || !m.addedNodes.length) continue;
                        for (const node of m.addedNodes) {
                            if (!node || node.nodeType !== 1) continue;

                            const elList = [];
                            if (node.classList && node.classList.contains("connection")) elList.push(node);

                            node.querySelectorAll && node.querySelectorAll(".connection").forEach(x => elList.push(x));
                            for (const el of elList) {
                                if (seen.has(el)) continue;
                                seen.add(el);

                                const nameAttr = (el.getAttribute && (el.getAttribute("data-name") || el.getAttribute("title"))) || null;
                                const displayName = tn(nameAttr || el.textContent || "");
                                const kind = detectKindFromElement(el);
                                if (!displayName) continue;

                                const found = findDevice(midi, displayName, kind || undefined);
                                const map = loadMap();

                                if (found && found.dev) {
                                    const saved = getSavedForDevice(map, found.kind, found.dev);
                                    if (typeof saved !== "undefined") {
                                        try {
                                            found.dev.enabled = !!saved;
                                        } catch (e) { }
                                    }
                                } else if (kind) {
                                    const kn = nameKey(kind, displayName);
                                    if (Object.prototype.hasOwnProperty.call(map, kn)) {
                                        if (map[kn]) el.classList.add("enabled"); else el.classList.remove("enabled");
                                    }
                                } else {
                                    // :catkiss:
                                }
                            }
                        }
                    }
                });

                try {
                    const root = document.body || document.documentElement;
                    observer.observe(root, { childList: true, subtree: true });
                } catch (e) { /* ignore */ }

                return midi;
            });
        };
    } else {
        console.log("MIDI persist navigator.requestMIDIAccess not found");
    }
})();