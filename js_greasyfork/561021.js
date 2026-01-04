// ==UserScript==
// @name         Multiplayer Piano Optimizations [Drawing]
// @namespace    https://tampermonkey.net/
// @version      2.5.2
// @description  Draw on the screen!
// @author       zackiboiz
// @match        *://*.multiplayerpiano.com/*
// @match        *://*.multiplayerpiano.net/*
// @match        *://dev.multiplayerpiano.net/*
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
// @downloadURL https://update.greasyfork.org/scripts/561021/Multiplayer%20Piano%20Optimizations%20%5BDrawing%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/561021/Multiplayer%20Piano%20Optimizations%20%5BDrawing%5D.meta.js
// ==/UserScript==

/*
    ### OP 0: Clear user
    - <uint8 op>
    1. Tells clients to clear this user's
    shapes

    ### OP 1: Clear shapes
    - <uint8 op> <uleb128 length*> <uint32 uuid>*
    1. Tells clients to clear shapes with
    uuids provided

    ### OP 2: Quick line
    - <uint8 op> <uint24 color> <uint8 transparency> <uleb128 lineWidth> <uleb128 lifeMs> <uleb128 fadeMs> <uint16 x1> <uint16 y1> <uint16 x2> <uint16 y2> <uint32 uuid>
    1. Tells clients to draw a line from
    (x1, y1) to (x2, y2) with options and
    provides a shape uuid

    ### OP 3: Start chain
    - <uint8 op> <uint24 color> <uint8 transparency> <uleb128 lineWidth> <uleb128 lifeMs> <uleb128 fadeMs> <uint16 x> <uint16 y>
    1. Tells clients to set a point at
    (x, y) to start a chain of lines with
    options

    ### OP 4: Continue chain
    - <uint8 op> <uleb128 length*> <<uint16 x> <uint16 y> <uint32 uuid>>*
    1. Tells clients to continue off of
    the user's chain to point (x, y) and
    provides a shape uuid

    ### OP 5: Filled triangle
    - <uint8 op> <uint24 color> <uint8 transparency> <uleb128 lifeMs> <uleb128 fadeMs> <uint16 x1> <uint16 y1> <uint16 x2> <uint16 y2> <uint16 x3> <uint16 y3> <uint32 uuid>
    1. Tells clients to draw a filled triangle
    with the provided vertices and options,
    and provides a shape uuid.

    ### OP 6: Stroked ellipse
    - <uint8 op> <uint24 color> <uint8 transparency> <uleb128 lineWidth> <uleb128 lifeMs> <uleb128 fadeMs> <uint16 cx> <uint16 cy> <uint16 rx> <uint16 ry> <uint32 uuid>
    1. Tells clients to draw a stroked ellipse
    at center (cx, cy) with radii (rx, ry)

    ### OP 7: Filled ellipse
    - <uint8 op> <uint24 color> <uint8 transparency> <uleb128 lifeMs> <uleb128 fadeMs> <uint16 cx> <uint16 cy> <uint16 rx> <uint16 ry> <uint32 uuid>
    1. Tells clients to draw a filled ellipse
    at center (cx, cy) with radii (rx, ry)

    ### OP 8: Text
    - <uint8 op> <uint24 color> <uint8 transparency> <uleb128 fontSize> <uleb128 lifeMs> <uleb128 fadeMs> <uint16 x> <uint16 y> <string text> <bitfield8 options> <uint32 uuid>
      <bitfield8 options>:
        <uint2 align>:
          0 - left
          1 - right
          2 - center
          3 - [none]
        <boolean styleBold>
        <boolean styleItalic>
        <boolean styleUnderline>
        <boolean styleLineThrough> (strikethrough)
        <uint2 font>:
          0 - Verdana, DejaVu Sans, sans-serif (MPP)
          1 - "Times New Roman", Times, Georgia, Garamond, serif
          2 - "Lucida Console", "Courier New", Monaco, monospace
          3 - "Brush Script MT", "Lucida Handwriting", cursive
    1. Tells clients to draw a stroked text
    area at (x, y) with options

    strings are prefixed with <uleb128 length>
    * Denotes multiple allowed
*/

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
                        `<p style='margin-top: 10px;'>Script: ${GM_info.script.name}</p>` +
                        `<p>Local: v${localVersion}</p>` +
                        `<p>Latest: v${remoteVersion}</p>` +
                        `<a href='https://greasyfork.org/scripts/${scriptId}' target='_blank' style='position: absolute; right: 0;bottom: 0; margin: 10px; font-size: 0.5rem;'>Open Greasy Fork to update?</a>`
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

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    await sleep(1000);


    Math.clamp = (min, x, max) => Math.min(max, Math.max(min, x));

    class Drawboard {
        static TextAlign = {
            LEFT: "left",
            RIGHT: "right",
            CENTER: "center"
        };
        static FontStyle = ["bold", "italic", "underline", "line-through"];
        static FontFamily = {
            SANS_SERIF: "Verdana, \"DejaVu Sans\", sans-serif",
            SERIF: "\"Times New Roman\", Times, Georgia, Garamond, serif",
            MONOSPACE: "\"Lucida Console\", \"Courier New\", Monaco, monospace",
            CURSIVE: "\"Brush Script MT\", \"Lucida Handwriting\", cursive"
        };

        #canvas;
        #ctx;
        #offscreenCanvas;
        #offscreenCtx;

        #enabled = true;
        #isShiftDown = false;
        #isCtrlDown = false;
        #clicking = false;
        #lastPosition;
        #position;

        #color = "#000000";
        #transparency = 1;
        #lineWidth = 3;
        #eraseFactor = 8;
        #lifeMs = 5000;
        #fadeMs = 3000;
        #textAlign = Drawboard.TextAlign.LEFT;
        #fontStyle = [];
        #fontFamily = Drawboard.FontFamily.SANS_SERIF;
        #fontSize = 12;

        #shapeBuffer = [];
        #opBuffer = [];
        #drawingMutes = [];
        #payloadFlushMs = 200;
        #flushInterval;
        #mouseMoveThrottleMs = 50;
        #lastMouseMoveAt = 0;
        #chains = new Map();
        #localChainStarted = false;

        constructor() {
            this.#canvas = document.createElement("canvas");
            this.#canvas.id = "drawboard";
            this.#canvas.style.position = "absolute";
            this.#canvas.style.top = "0px";
            this.#canvas.style.left = "0px";
            this.#canvas.style.zIndex = "800";
            this.#canvas.style.pointerEvents = "none";
            document.documentElement.appendChild(this.#canvas);
            this.#ctx = this.#canvas.getContext("2d");

            this.#offscreenCanvas = document.createElement("canvas");
            this.#offscreenCanvas.width = 1;
            this.#offscreenCanvas.height = 1;
            this.#offscreenCtx = this.#offscreenCanvas.getContext("2d");

            this.#resize();
            this.#init();
        }

        get participant() {
            return MPP.client.getOwnParticipant();
        }
        get participants() {
            return MPP.client.ppl;
        }

        get canvas() {
            return this.#canvas;
        }
        get ctx() {
            return this.#ctx;
        }
        static get connected() {
            return MPP && MPP.client && MPP.client.isConnected() && MPP.client.channel && MPP.client.user && MPP.client.ppl
        }
        get enabled() {
            return this.#enabled;
        }
        get lastPosition() {
            return this.#lastPosition;
        }
        get position() {
            return this.#position;
        }
        get color() {
            return this.#color;
        }
        get transparency() {
            return this.#transparency;
        }
        get lineWidth() {
            return this.#lineWidth;
        }
        get eraseFactor() {
            return this.#eraseFactor;
        }
        get lifeMs() {
            return this.#lifeMs;
        }
        get fadeMs() {
            return this.#fadeMs;
        }
        get textAlign() {
            return this.#textAlign;
        }
        get fontStyle() {
            return this.#fontStyle;
        }
        get fontFamily() {
            return this.#fontFamily;
        }
        get fontSize() {
            return this.#fontSize;
        }
        get mouseMoveThrottleMs() {
            return this.#mouseMoveThrottleMs;
        }
        get payloadFlushMs() {
            return this.#payloadFlushMs;
        }
        get drawingMutes() {
            return this.#drawingMutes;
        }

        set enabled(enabled) {
            this.#enabled = enabled;
        }
        set color(color) {
            this.#color = color;
        }
        set transparency(transparency) {
            this.#transparency = Math.max(0, Math.min(1, transparency));
        }
        set lineWidth(lineWidth) {
            this.#lineWidth = lineWidth;
        }
        set eraseFactor(eraseFactor) {
            this.#eraseFactor = eraseFactor;
        }
        set lifeMs(lifeMs) {
            this.#lifeMs = lifeMs;
        }
        set fadeMs(fadeMs) {
            this.#fadeMs = fadeMs;
        }
        set textAlign(textAlign) {
            if (!Object.values(Drawboard.TextAlign).includes(textAlign)) throw new Error("Invalid text align.");
            this.#textAlign = textAlign;
        }
        set fontStyle(fontStyle) {
            this.#fontStyle = fontStyle.filter(style => Drawboard.FontStyle.includes(style));
        }
        set fontFamily(fontFamily) {
            if (!Object.values(Drawboard.FontFamily).includes(fontFamily)) throw new Error("Invalid font family.");
            this.#fontFamily = fontFamily;
        }
        set fontSize(fontSize) {
            this.#fontSize = fontSize;
        }
        set mouseMoveThrottleMs(mouseMoveThrottleMs) {
            this.#mouseMoveThrottleMs = mouseMoveThrottleMs;
        }
        set payloadFlushMs(payloadFlushMs) {
            clearInterval(this.#flushInterval);
            this.#payloadFlushMs = payloadFlushMs;
            this.#flushInterval = setInterval(this.#flushOpBuffer, this.#payloadFlushMs);
        }
        set drawingMutes(drawingMutes) {
            this.#drawingMutes = drawingMutes;
            this.#saveDrawingMutes();
        }


        #resize = () => {
            this.#canvas.width = window.innerWidth;
            this.#canvas.height = window.innerHeight;
        }

        #init = () => {
            window.addEventListener("resize", this.#resize);
            document.addEventListener("keydown", (e) => {
                this.#isShiftDown = e.shiftKey;
                this.#isCtrlDown = e.ctrlKey || e.metaKey;
            });
            document.addEventListener("keyup", (e) => {
                this.#isShiftDown = e.shiftKey;
                this.#isCtrlDown = e.ctrlKey || e.metaKey;
            });
            document.addEventListener("mousedown", (e) => {
                this.#updatePosition();
                this.#clicking = true;
                this.#localChainStarted = false;

                if ((this.#isShiftDown || this.#isCtrlDown) && this.#clicking) {
                    e.preventDefault();
                }
            });
            document.addEventListener("mouseup", (e) => {
                this.#updatePosition();
                this.#clicking = false;
                this.#flushOpBuffer();
            });
            document.addEventListener("mousemove", (e) => {
                const now = Date.now();
                if (now - this.#lastMouseMoveAt < this.#mouseMoveThrottleMs) return;
                this.#lastMouseMoveAt = now;

                this.#updatePosition();
                if (!this.#lastPosition) this.#lastPosition = this.#position;
                if (this.#isShiftDown && this.#clicking) {
                    const start = this.#lastPosition;
                    const end = this.#position;

                    this.drawLine({
                        x1: start.x,
                        y1: start.y,
                        x2: end.x,
                        y2: end.y,
                        color: this.#color,
                        transparency: this.#transparency,
                        lineWidth: this.#lineWidth,
                        lifeMs: this.#lifeMs,
                        fadeMs: this.#fadeMs
                    });

                    this.#lastPosition = this.#position;
                } else if (this.#isCtrlDown && this.#clicking) {
                    const maxDim = Math.max(this.#canvas.width, this.#canvas.height) || 1;
                    const radius = this.#lineWidth * this.#eraseFactor / maxDim;

                    const removedUUIDs = this.erase({
                        x: this.#position.x,
                        y: this.#position.y,
                        radius: radius
                    });

                    if (removedUUIDs && removedUUIDs.length) {
                        this.#pushOp({
                            op: 1,
                            uuids: removedUUIDs.map(n => Number(n) >>> 0)
                        });
                    }
                }
            });

            const menuClassName = "participant-menu";
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE && node.className === menuClassName) {
                            const menu = document.querySelector(`.${menuClassName}`);

                            const info = menu.querySelector("div.info");
                            const targetId = info.textContent.trim();
                            const muted = this.#drawingMutes.includes(targetId);

                            const muteLinesButton = document.createElement("div");
                            muteLinesButton.className = "menu-item";
                            muteLinesButton.textContent = `${muted ? "Unhide" : "Hide"} Drawings`;
                            menu.insertAdjacentElement("beforeend", muteLinesButton);

                            muteLinesButton.addEventListener("click", (e) => {
                                if (muted) {
                                    this.#drawingMutes = this.#drawingMutes.filter(id => id !== targetId);
                                } else {
                                    this.#drawingMutes.push(targetId);
                                }
                                this.#saveDrawingMutes();
                            });
                        }
                    });
                });
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            requestAnimationFrame(this.#draw);
            this.#flushInterval = setInterval(this.#flushOpBuffer, this.#payloadFlushMs);

            window.addEventListener("beforeunload", () => {
                if (this.#flushInterval) clearInterval(this.#flushInterval);
            });

            const participant = this.participant;
            if (participant?.color) this.#color = participant.color;
            this.#drawingMutes = localStorage.drawingMutes?.split(",") ?? [];
            this.#saveDrawingMutes();
        }

        #saveDrawingMutes = () => {
            localStorage.drawingMutes = this.#drawingMutes.filter(id => id).join(",");
        }

        #readUint8 = (bytes, state) => {
            if (state.i >= bytes.length) throw new Error("Unexpected end of payload (uint8).");
            return bytes[state.i++];
        }
        #writeUint8 = (bytes, val) => {
            bytes.push(val & 0xFF);
        }

        #readUint16 = (bytes, state) => {
            if (state.i + 2 > bytes.length) throw new Error("Unexpected end of payload (uint16).");
            const v = bytes[state.i] | (bytes[state.i + 1] << 8);
            state.i += 2;
            return v >>> 0;
        }
        #writeUint16 = (bytes, val) => {
            const v = val >>> 0;
            bytes.push(v & 0xFF, (v >>> 8) & 0xFF);
        }

        #readUint32 = (bytes, state) => {
            if (state.i + 4 > bytes.length) throw new Error("Unexpected end of payload (uint32).");
            const v = (bytes[state.i] | (bytes[state.i + 1] << 8) | (bytes[state.i + 2] << 16) | (bytes[state.i + 3] << 24)) >>> 0;
            state.i += 4;
            return v;
        }
        #writeUint32 = (bytes, val) => {
            const v = val >>> 0;
            bytes.push(v & 0xFF, (v >>> 8) & 0xFF, (v >>> 16) & 0xFF, (v >>> 24) & 0xFF);
        }

        #readULEB128 = (bytes, state) => {
            let result = 0;
            let shift = 0;
            while (true) {
                if (state.i >= bytes.length) throw new Error("Unexpected end of payload (uleb128).");
                const b = bytes[state.i++];
                result |= (b & 0x7F) << shift;
                if (!(b & 0x80)) break;
                shift += 7;
            }
            return result >>> 0;
        }
        #writeULEB128 = (bytes, val) => {
            val = Math.max(0, Math.floor(val));
            while (val > 0x7F) {
                bytes.push((val & 0x7F) | 0x80);
                val >>>= 7;
            }

            bytes.push(val & 0x7F);
        }

        #readColor = (bytes, state) => {
            if (state.i + 3 > bytes.length) throw new Error("Unexpected end of payload (color).");
            const r = bytes[state.i++];
            const g = bytes[state.i++];
            const b = bytes[state.i++];
            return "#" + [r, g, b].map(x => x.toString(16).padStart(2, "0")).join("");
        }
        #writeColor = (bytes, hex) => {
            let part = [0, 0, 0];
            if (hex) {
                if (hex.startsWith("#")) hex = hex.slice(1);
                if (hex.length === 3) hex = hex.split("").map(c => c + c).join("");
                const num = parseInt(hex, 16) || 0;
                part = [(num >> 16) & 0xFF, (num >> 8) & 0xFF, num & 0xFF];
            }

            bytes.push(...part);
        }

        #readString = (bytes, state) => {
            const len = this.#readULEB128(bytes, state);
            if (state.i + len > bytes.length) throw new Error("Unexpected end of payload (string).");
            const slice = bytes.slice(state.i, state.i + len);
            state.i += len;
            const textBytes = new Uint8Array(slice);
            const text = new TextDecoder().decode(textBytes);

            return text;
        }
        #writeString = (bytes, strOrBytes) => {
            if (strOrBytes instanceof Uint8Array) {
                this.#writeULEB128(bytes, strOrBytes.length);
                for (const b of strOrBytes) bytes.push(b);
                return;
            }

            const textEncoder = new TextEncoder();
            const buf = textEncoder.encode(String(strOrBytes));
            this.#writeULEB128(bytes, buf.length);
            for (const b of buf) bytes.push(b);
        }

        generateUUID = () => {
            let id = 0;
            if (typeof crypto !== "undefined" && crypto.getRandomValues) {
                const arr = new Uint32Array(1);
                crypto.getRandomValues(arr);
                id = arr[0] >>> 0;
            } else {
                id = Math.floor(Math.random() * 0xFFFFFFFF) >>> 0;
            }
            if (id === 0) id = 1;
            return id >>> 0;
        }

        #removeShapesByUUIDs = (uuids) => {
            const removed = [];
            const set = new Set(uuids.map(n => Number(n)));
            for (let i = this.#shapeBuffer.length - 1; i >= 0; i--) {
                const shape = this.#shapeBuffer[i];
                if (set.has(Number(shape.uuid))) {
                    removed.push(shape.uuid);
                    this.#shapeBuffer.splice(i, 1);
                }
            }
            return Array.from(new Set(removed));
        }

        #removeLinesByOwner = (ownerId) => {
            const removed = [];
            for (let i = this.#shapeBuffer.length - 1; i >= 0; i--) {
                const shape = this.#shapeBuffer[i];
                if (shape.owner === ownerId) {
                    if (shape.uuid) removed.push(shape.uuid);
                    this.#shapeBuffer.splice(i, 1);
                }
            }
            this.#chains.delete(ownerId);
            return Array.from(new Set(removed));
        }

        #pushOp = (opObj) => { // could do some stuff here but dont need to atm
            this.#opBuffer.push(opObj);
        }

        #buildClearUserPacket = () => {
            const bytes = [];
            this.#writeUint8(bytes, 0);
            return bytes;
        }

        #buildClearLinesPacket = (uuids) => {
            const bytes = [];
            this.#writeUint8(bytes, 1);
            this.#writeULEB128(bytes, uuids.length);
            for (const u of uuids) this.#writeUint32(bytes, Number(u) >>> 0);
            return bytes;
        }

        #buildQuickLinePacket = (color, transparency, lineWidth, lifeMs, fadeMs, x1, y1, x2, y2, uuid) => {
            const bytes = [];
            this.#writeUint8(bytes, 2);
            this.#writeColor(bytes, color);
            this.#writeUint8(bytes, Math.floor(Math.clamp(0, transparency, 1) * 255) & 0xFF);
            this.#writeULEB128(bytes, Math.max(0, Math.floor(lineWidth)));
            this.#writeULEB128(bytes, Math.max(0, Math.floor(lifeMs)));
            this.#writeULEB128(bytes, Math.max(0, Math.floor(fadeMs)));
            this.#writeUint16(bytes, x1 & 0xFFFF);
            this.#writeUint16(bytes, y1 & 0xFFFF);
            this.#writeUint16(bytes, x2 & 0xFFFF);
            this.#writeUint16(bytes, y2 & 0xFFFF);
            this.#writeUint32(bytes, uuid >>> 0);
            return bytes;
        }

        #buildStartChainPacket = (color, transparency, lineWidth, lifeMs, fadeMs, x, y) => {
            const bytes = [];
            this.#writeUint8(bytes, 3);
            this.#writeColor(bytes, color);
            this.#writeUint8(bytes, Math.floor(Math.clamp(0, transparency, 1) * 255) & 0xFF);
            this.#writeULEB128(bytes, Math.max(0, Math.floor(lineWidth)));
            this.#writeULEB128(bytes, Math.max(0, Math.floor(lifeMs)));
            this.#writeULEB128(bytes, Math.max(0, Math.floor(fadeMs)));
            this.#writeUint16(bytes, x & 0xFFFF);
            this.#writeUint16(bytes, y & 0xFFFF);
            return bytes;
        }

        #buildContinueChainPacket = (entries) => {
            const bytes = [];
            this.#writeUint8(bytes, 4);
            this.#writeULEB128(bytes, entries.length);
            for (const e of entries) {
                this.#writeUint16(bytes, e.x & 0xFFFF);
                this.#writeUint16(bytes, e.y & 0xFFFF);
                this.#writeUint32(bytes, e.uuid >>> 0);
            }
            return bytes;
        }

        #buildTrianglePacket = (color, transparency, lifeMs, fadeMs, x1, y1, x2, y2, x3, y3, uuid) => {
            const bytes = [];
            this.#writeUint8(bytes, 5);
            this.#writeColor(bytes, color);
            this.#writeUint8(bytes, Math.floor(Math.clamp(0, transparency, 1) * 255) & 0xFF);
            this.#writeULEB128(bytes, Math.max(0, Math.floor(lifeMs)));
            this.#writeULEB128(bytes, Math.max(0, Math.floor(fadeMs)));
            this.#writeUint16(bytes, x1 & 0xFFFF);
            this.#writeUint16(bytes, y1 & 0xFFFF);
            this.#writeUint16(bytes, x2 & 0xFFFF);
            this.#writeUint16(bytes, y2 & 0xFFFF);
            this.#writeUint16(bytes, x3 & 0xFFFF);
            this.#writeUint16(bytes, y3 & 0xFFFF);
            this.#writeUint32(bytes, uuid >>> 0);
            return bytes;
        }

        #buildEllipseStrokePacket = (color, transparency, lineWidth, lifeMs, fadeMs, cx, cy, rx, ry, uuid) => {
            const bytes = [];
            this.#writeUint8(bytes, 6);
            this.#writeColor(bytes, color);
            this.#writeUint8(bytes, Math.floor(Math.clamp(0, transparency, 1) * 255) & 0xFF);
            this.#writeULEB128(bytes, Math.max(0, Math.floor(lineWidth)));
            this.#writeULEB128(bytes, Math.max(0, Math.floor(lifeMs)));
            this.#writeULEB128(bytes, Math.max(0, Math.floor(fadeMs)));
            this.#writeUint16(bytes, cx & 0xFFFF);
            this.#writeUint16(bytes, cy & 0xFFFF);
            this.#writeUint16(bytes, rx & 0xFFFF);
            this.#writeUint16(bytes, ry & 0xFFFF);
            this.#writeUint32(bytes, uuid >>> 0);
            return bytes;
        }

        #buildEllipseFillPacket = (color, transparency, lifeMs, fadeMs, cx, cy, rx, ry, uuid) => {
            const bytes = [];
            this.#writeUint8(bytes, 7);
            this.#writeColor(bytes, color);
            this.#writeUint8(bytes, Math.floor(Math.clamp(0, transparency, 1) * 255) & 0xFF);
            this.#writeULEB128(bytes, Math.max(0, Math.floor(lifeMs)));
            this.#writeULEB128(bytes, Math.max(0, Math.floor(fadeMs)));
            this.#writeUint16(bytes, cx & 0xFFFF);
            this.#writeUint16(bytes, cy & 0xFFFF);
            this.#writeUint16(bytes, rx & 0xFFFF);
            this.#writeUint16(bytes, ry & 0xFFFF);
            this.#writeUint32(bytes, uuid >>> 0);
            return bytes;
        }

        #buildTextPacket = (color, transparency, fontSize, lifeMs, fadeMs, x, y, text, options, uuid) => {
            const bytes = [];
            this.#writeUint8(bytes, 8);
            this.#writeColor(bytes, color);
            this.#writeUint8(bytes, Math.floor(Math.clamp(0, transparency, 1) * 255) & 0xFF);
            this.#writeULEB128(bytes, Math.max(0, Math.floor(fontSize)));
            this.#writeULEB128(bytes, Math.max(0, Math.floor(lifeMs)));
            this.#writeULEB128(bytes, Math.max(0, Math.floor(fadeMs)));
            this.#writeUint16(bytes, x & 0xFFFF);
            this.#writeUint16(bytes, y & 0xFFFF);
            this.#writeString(bytes, text);
            this.#writeUint8(bytes, options & 0xFF);
            this.#writeUint32(bytes, uuid >>> 0);
            return bytes;
        }

        #sendCustomData = (payload) => {
            if (!MPP?.client?.sendArray || !Drawboard.connected) return;

            MPP.client.sendArray([{
                m: "custom",
                data: {
                    drawboard: btoa(payload)
                },
                target: {
                    mode: "subscribed"
                }
            }]);
        }

        #updatePosition = () => {
            this.#lastPosition = this.#position;
            const participant = this.participant;
            this.#position = {
                x: Math.clamp(0, (participant?.x ?? 0), 100) / 100,
                y: Math.clamp(0, (participant?.y ?? 0), 100) / 100
            };
        }

        #flushOpBuffer = () => {
            if (!this.#opBuffer.length) return;

            const builtOps = [];
            const buf = this.#opBuffer;
            let i = 0;
            while (i < buf.length) {
                const item = buf[i];
                if (!item || typeof item.op !== "number") {
                    i++;
                    continue;
                }

                switch (item.op) {
                    case 0: {
                        builtOps.push(this.#buildClearUserPacket());
                        i++;
                        break;
                    }
                    case 1: {
                        const allU = [];
                        let j = i;
                        while (j < buf.length && buf[j] && buf[j].op === 1) {
                            if (Array.isArray(buf[j].uuids)) allU.push(...buf[j].uuids.map(n => Number(n) >>> 0));
                            j++;
                        }
                        const seen = new Set();
                        const uniq = [];
                        for (const u of allU) {
                            if (!seen.has(u)) {
                                seen.add(u);
                                uniq.push(u);
                            }
                        }
                        builtOps.push(this.#buildClearLinesPacket(uniq));
                        i = j;
                        break;
                    }
                    case 2: {
                        builtOps.push(this.#buildQuickLinePacket(
                            item.color,
                            item.transparency,
                            item.lineWidth,
                            item.lifeMs,
                            item.fadeMs,
                            item.x1u,
                            item.y1u,
                            item.x2u,
                            item.y2u,
                            item.uuid >>> 0
                        ));
                        i++;
                        break;
                    }
                    case 3: {
                        builtOps.push(this.#buildStartChainPacket(
                            item.color,
                            item.transparency,
                            item.lineWidth,
                            item.lifeMs,
                            item.fadeMs,
                            item.xu,
                            item.yu
                        ));
                        i++;
                        break;
                    }
                    case 4: {
                        const allEntries = [];
                        let j = i;
                        while (j < buf.length && buf[j] && buf[j].op === 4) {
                            if (Array.isArray(buf[j].entries)) allEntries.push(...buf[j].entries.map(e => ({
                                x: e.x & 0xFFFF,
                                y: e.y & 0xFFFF,
                                uuid: e.uuid >>> 0
                            })));
                            j++;
                        }
                        builtOps.push(this.#buildContinueChainPacket(allEntries));
                        i = j;
                        break;
                    }
                    case 5: {
                        builtOps.push(this.#buildTrianglePacket(
                            item.color,
                            item.transparency,
                            item.lifeMs,
                            item.fadeMs,
                            item.x1u,
                            item.y1u,
                            item.x2u,
                            item.y2u,
                            item.x3u,
                            item.y3u,
                            item.uuid >>> 0
                        ));
                        i++;
                        break;
                    }
                    case 6: {
                        builtOps.push(this.#buildEllipseStrokePacket(
                            item.color,
                            item.transparency,
                            item.lineWidth,
                            item.lifeMs,
                            item.fadeMs,
                            item.cxu,
                            item.cyu,
                            item.rxu,
                            item.ryu,
                            item.uuid >>> 0
                        ));
                        i++;
                        break;
                    }
                    case 7: {
                        builtOps.push(this.#buildEllipseFillPacket(
                            item.color,
                            item.transparency,
                            item.lifeMs,
                            item.fadeMs,
                            item.cxu,
                            item.cyu,
                            item.rxu,
                            item.ryu,
                            item.uuid >>> 0
                        ));
                        i++;
                        break;
                    }
                    case 8: {
                        builtOps.push(this.#buildTextPacket(
                            item.color,
                            item.transparency,
                            item.fontSize,
                            item.lifeMs,
                            item.fadeMs,
                            item.xu,
                            item.yu,
                            item.text,
                            item.options,
                            item.uuid >>> 0
                        ));
                        i++;
                        break;
                    }
                    default: {
                        i++;
                        break;
                    }
                }
            }

            // final payload
            const bytes = [];
            this.#writeULEB128(bytes, builtOps.length);
            for (const opBytes of builtOps) {
                for (const b of opBytes) bytes.push(b);
            }
            const finalPayload = String.fromCharCode(...bytes);
            this.#sendCustomData(finalPayload);
            this.#opBuffer.length = 0;
        }

        #pointToSegmentDistance = (px, py, x1, y1, x2, y2) => {
            const vx = x2 - x1;
            const vy = y2 - y1;
            const wx = px - x1;
            const wy = py - y1;
            const c = (wx * vx + wy * vy);
            const d = (vx * vx + vy * vy);
            let t = 0;
            if (d !== 0) t = Math.max(0, Math.min(1, c / d));
            const projx = x1 + t * vx;
            const projy = y1 + t * vy;
            const dx = px - projx;
            const dy = py - projy;
            return Math.sqrt(dx * dx + dy * dy);
        }

        // https://www.geeksforgeeks.org/dsa/check-whether-a-given-point-lies-inside-a-triangle-or-not/
        #pointInTriangle = (px, py, ax, ay, bx, by, cx, cy) => {
            const v0x = cx - ax;
            const v0y = cy - ay;
            const v1x = bx - ax;
            const v1y = by - ay;
            const v2x = px - ax;
            const v2y = py - ay;

            const dot00 = v0x * v0x + v0y * v0y;
            const dot01 = v0x * v1x + v0y * v1y;
            const dot02 = v0x * v2x + v0y * v2y;
            const dot11 = v1x * v1x + v1y * v1y;
            const dot12 = v1x * v2x + v1y * v2y;

            const denom = dot00 * dot11 - dot01 * dot01;
            if (denom === 0) return false;
            const invDenom = 1 / denom;
            const u = (dot11 * dot02 - dot01 * dot12) * invDenom;
            const v = (dot00 * dot12 - dot01 * dot02) * invDenom;
            return (u >= 0) && (v >= 0) && (u + v < 1);
        }

        #clear = () => {
            this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
        }

        #draw = () => {
            if (!this.enabled || !Drawboard.connected) {
                requestAnimationFrame(this.#draw);
                return;
            }

            this.#clear();
            const now = Date.now();

            const kept = [];
            for (let i = 0; i < this.#shapeBuffer.length; i++) {
                const shape = this.#shapeBuffer[i];
                const timestamp = shape.timestamp || 0;
                const age = now - timestamp;
                if (age < (shape.lifeMs + shape.fadeMs)) {
                    kept.push(shape);
                }
            }
            this.#shapeBuffer = kept;
            this.#shapeBuffer.sort((a, b) => a.timestamp - b.timestamp);

            for (let i = 0; i < this.#shapeBuffer.length; i++) {
                const shape = this.#shapeBuffer[i];
                if (this.#drawingMutes.includes(shape.owner)) continue; // user could unhide if they want to see it back

                const timestamp = shape.timestamp;
                const lifeMs = shape.lifeMs;
                const fadeMs = shape.fadeMs;
                const age = now - timestamp;

                let alpha = 1;
                if (age > lifeMs) {
                    const fadeAge = age - lifeMs;
                    alpha = Math.clamp(0, 1 - (fadeAge / fadeMs), 1);
                }

                this.#ctx.globalAlpha = alpha * shape.transparency;
                switch (shape.type) {
                    case "line": {
                        this.#ctx.globalCompositeOperation = "source-over";
                        this.#ctx.strokeStyle = shape.color;
                        this.#ctx.lineWidth = shape.lineWidth;
                        this.#ctx.beginPath();
                        this.#ctx.moveTo(shape.x1 * this.#canvas.width, shape.y1 * this.#canvas.height);
                        this.#ctx.lineTo(shape.x2 * this.#canvas.width, shape.y2 * this.#canvas.height);
                        this.#ctx.stroke();
                        break;
                    }
                    case "triangle": {
                        this.#ctx.globalCompositeOperation = "source-over";
                        this.#ctx.fillStyle = shape.color;
                        this.#ctx.beginPath();
                        this.#ctx.moveTo(shape.x1 * this.#canvas.width, shape.y1 * this.#canvas.height);
                        this.#ctx.lineTo(shape.x2 * this.#canvas.width, shape.y2 * this.#canvas.height);
                        this.#ctx.lineTo(shape.x3 * this.#canvas.width, shape.y3 * this.#canvas.height);
                        this.#ctx.closePath();
                        this.#ctx.fill();
                        break;
                    }
                    case "ellipse": {
                        this.#ctx.globalCompositeOperation = "source-over";

                        const cx = shape.cx * this.#canvas.width;
                        const cy = shape.cy * this.#canvas.height;
                        const rx = shape.rx * this.#canvas.width;
                        const ry = shape.ry * this.#canvas.height;
                        this.#ctx.beginPath();

                        this.#ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
                        switch (shape.subType) {
                            case "fill": {
                                this.#ctx.fillStyle = shape.color;
                                this.#ctx.fill();
                                break;
                            }
                            case "stroke": {
                                this.#ctx.strokeStyle = shape.color;
                                this.#ctx.lineWidth = shape.lineWidth;
                                this.#ctx.stroke();
                                break;
                            }
                            default: {
                                console.warn("Unknown drawboard shape subtype:", shape.subType);
                                break;
                            }
                        }
                        break;
                    }
                    case "text": {
                        this.#ctx.globalCompositeOperation = "source-over";

                        const options = shape.options || 0;
                        const align = options & 0x03;
                        const bold = !!(options & 0x04);
                        const italic = !!(options & 0x08);
                        const underline = !!(options & 0x10);
                        const lineThrough = !!(options & 0x20);
                        const fontIndex = (options >> 6) & 0x03;

                        const families = [
                            Drawboard.FontFamily.SANS_SERIF,
                            Drawboard.FontFamily.SERIF,
                            Drawboard.FontFamily.MONOSPACE,
                            Drawboard.FontFamily.CURSIVE
                        ];
                        const family = families[fontIndex] || Drawboard.FontFamily.SANS_SERIF;

                        const style = (italic ? "italic " : "") + (bold ? "bold " : "");
                        const fontSize = Math.max(1, Number(shape.fontSize) || 12);
                        this.#ctx.font = `${style}${fontSize}px ${family}`;

                        let textAlign = this.#textAlign;
                        if (align === 0) textAlign = Drawboard.TextAlign.LEFT;
                        else if (align === 1) textAlign = Drawboard.TextAlign.RIGHT;
                        else if (align === 2) textAlign = Drawboard.TextAlign.CENTER;
                        this.#ctx.textAlign = textAlign;
                        this.#ctx.textBaseline = "top";

                        const x = shape.x * this.#canvas.width;
                        const y = shape.y * this.#canvas.height;
                        this.#ctx.fillStyle = shape.color;
                        this.#ctx.fillText(shape.text, x, y);

                        const metrics = this.#ctx.measureText(shape.text || "");
                        const textWidth = metrics.width || 0;

                        if (underline) {
                            const uy = y + fontSize;
                            this.#ctx.beginPath();
                            this.#ctx.lineWidth = Math.max(1, Math.floor(fontSize / 12) || 1);
                            this.#ctx.strokeStyle = shape.color;
                            let startX = x;

                            if (textAlign === Drawboard.TextAlign.CENTER) startX = x - textWidth / 2;
                            else if (textAlign === Drawboard.TextAlign.RIGHT) startX = x - textWidth;

                            this.#ctx.moveTo(startX, uy);
                            this.#ctx.lineTo(startX + textWidth, uy);
                            this.#ctx.stroke();
                        }
                        if (lineThrough) {
                            const ly = y + fontSize * 0.5;
                            this.#ctx.beginPath();
                            this.#ctx.lineWidth = Math.max(1, Math.floor(fontSize / 12) || 1);
                            this.#ctx.strokeStyle = shape.color;
                            let startX = x;

                            if (textAlign === Drawboard.TextAlign.CENTER) startX = x - textWidth / 2;
                            else if (textAlign === Drawboard.TextAlign.RIGHT) startX = x - textWidth;

                            this.#ctx.moveTo(startX, ly);
                            this.#ctx.lineTo(startX + textWidth, ly);
                            this.#ctx.stroke();
                        }
                        break;
                    }
                    default: {
                        console.warn("Unknown drawboard shape type:", shape.type);
                        break;
                    }
                }
            }

            this.#ctx.globalAlpha = 1;
            requestAnimationFrame(this.#draw);
        }

        setShapeSettings = ({ color = null, transparency = null, lineWidth = null, lifeMs = null, fadeMs = null, textAlign = null, fontStyle = null, fontFamily = null, fontSize = null } = {}) => {
            this.#color = color ?? this.#color;
            this.#transparency = transparency ?? this.#transparency;
            this.#lineWidth = (Number.isFinite(lineWidth) ? lineWidth : this.#lineWidth) >>> 0;
            this.#lifeMs = (Number.isFinite(lifeMs) ? lifeMs : this.#lifeMs) >>> 0;
            this.#fadeMs = (Number.isFinite(fadeMs) ? fadeMs : this.#fadeMs) >>> 0;
            this.#textAlign = textAlign ? (Object.values(Drawboard.TextAlign).includes(textAlign) ? textAlign : this.#textAlign) : this.#textAlign;
            this.#fontStyle = fontStyle ? fontStyle.filter(style => Drawboard.FontStyle.includes(style)) : this.#fontStyle;
            this.#fontFamily = fontFamily ? (Object.values(Drawboard.FontFamily).includes(fontFamily) ? fontFamily : this.#fontFamily) : this.#fontFamily;
            this.#fontSize = (Number.isFinite(fontSize) ? fontSize : this.#fontSize) >>> 0;
        }

        renderLine = ({ x1, y1, x2, y2, color, transparency, lineWidth, lifeMs, fadeMs, uuid = this.generateUUID(), owner = null } = {}) => {
            const shape = {
                type: "line",
                x1, y1,
                x2, y2,
                color,
                transparency: Math.clamp(0, transparency, 1),
                lineWidth,
                lifeMs,
                fadeMs,
                timestamp: Date.now(),
                uuid: uuid >>> 0,
                owner: owner || null
            };
            this.#shapeBuffer.push(shape);
            return uuid >>> 0;
        }


        drawLine = ({ x1, y1, x2, y2, color = null, transparency = null, lineWidth = null, lifeMs = null, fadeMs = null, chain = true } = {}) => {
            color = color ?? this.#color;
            transparency = transparency ?? this.#transparency;
            lineWidth = (Number.isFinite(lineWidth) ? lineWidth : this.#lineWidth) >>> 0;
            lifeMs = (Number.isFinite(lifeMs) ? lifeMs : this.#lifeMs) >>> 0;
            fadeMs = (Number.isFinite(fadeMs) ? fadeMs : this.#fadeMs) >>> 0;

            const nx1 = Math.clamp(0, Number(x1) || 0, 1);
            const ny1 = Math.clamp(0, Number(y1) || 0, 1);
            const nx2 = Math.clamp(0, Number(x2) || 0, 1);
            const ny2 = Math.clamp(0, Number(y2) || 0, 1);

            const uuid = this.generateUUID();

            this.renderLine({
                x1: nx1,
                y1: ny1,
                x2: nx2,
                y2: ny2,
                color: color,
                transparency: transparency,
                lineWidth: lineWidth,
                lifeMs: lifeMs,
                fadeMs: fadeMs,
                uuid: uuid,
                owner: MPP?.client?.participantId || null
            });

            const x1u = Math.round(nx1 * 65535) >>> 0;
            const y1u = Math.round(ny1 * 65535) >>> 0;
            const x2u = Math.round(nx2 * 65535) >>> 0;
            const y2u = Math.round(ny2 * 65535) >>> 0;

            if (chain) {
                if (!this.#localChainStarted) {
                    this.#pushOp({
                        op: 3,
                        color: color,
                        transparency: transparency,
                        lineWidth: lineWidth,
                        lifeMs: lifeMs,
                        fadeMs: fadeMs,
                        xu: x1u,
                        yu: y1u
                    });
                    this.#localChainStarted = true;
                }

                this.#pushOp({
                    op: 4,
                    entries: [{
                        x: x2u & 0xFFFF,
                        y: y2u & 0xFFFF,
                        uuid: uuid >>> 0
                    }]
                });
            } else {
                this.#pushOp({
                    op: 2,
                    color: color,
                    transparency: transparency,
                    lineWidth: lineWidth,
                    lifeMs: lifeMs,
                    fadeMs: fadeMs,
                    x1u: x1u & 0xFFFF,
                    y1u: y1u & 0xFFFF,
                    x2u: x2u & 0xFFFF,
                    y2u: y2u & 0xFFFF,
                    uuid: uuid >>> 0
                });
            }

            return uuid >>> 0;
        }

        drawLines = (segments = [], { color = null, transparency = null, lineWidth = null, lifeMs = null, fadeMs = null } = {}) => {
            if (!Array.isArray(segments) || !segments.length) return [];

            const segs = segments.map(s => ({
                x1: Math.clamp(0, Number(s.x1) || 0, 1),
                y1: Math.clamp(0, Number(s.y1) || 0, 1),
                x2: Math.clamp(0, Number(s.x2) || 0, 1),
                y2: Math.clamp(0, Number(s.y2) || 0, 1),
                color: s.color ?? color,
                transparency: s.transparency ?? transparency,
                lineWidth: Number.isFinite(s.lineWidth) ? s.lineWidth : lineWidth,
                lifeMs: Number.isFinite(s.lifeMs) ? s.lifeMs : lifeMs,
                fadeMs: Number.isFinite(s.fadeMs) ? s.fadeMs : fadeMs,
            }));

            const eps = 1e-6;
            const chainable = segs.length > 1 && (() => {
                for (let i = 0; i < segs.length - 1; i++) {
                    const a = segs[i], b = segs[i + 1];
                    if (Math.abs(a.x2 - b.x1) > eps || Math.abs(a.y2 - b.y1) > eps) return false;
                }
                return true;
            })();

            if (chainable) {
                const first = segs[0];
                const xu = Math.round(first.x1 * 65535);
                const yu = Math.round(first.y1 * 65535);

                this.#pushOp({
                    op: 3,
                    color: first.color ?? this.#color,
                    transparency: first.transparency ?? this.#transparency,
                    lineWidth: first.lineWidth ?? this.#lineWidth,
                    lifeMs: first.lifeMs ?? this.#lifeMs,
                    fadeMs: first.fadeMs ?? this.#fadeMs,
                    xu: xu,
                    yu: yu
                });

                const entries = [];
                const uuids = [];

                for (const s of segs) {
                    const uuid = this.generateUUID() >>> 0;
                    uuids.push(uuid);

                    this.renderLine({
                        x1: s.x1,
                        y1: s.y1,
                        x2: s.x2,
                        y2: s.y2,
                        color: s.color ?? this.#color,
                        transparency: s.transparency ?? this.#transparency,
                        lineWidth: s.lineWidth ?? this.#lineWidth,
                        lifeMs: s.lifeMs ?? this.#lifeMs,
                        fadeMs: s.fadeMs ?? this.#fadeMs,
                        uuid: uuid,
                        owner: MPP?.client?.participantId || null
                    });

                    entries.push({
                        x: Math.round(s.x2 * 65535) & 0xFFFF,
                        y: Math.round(s.y2 * 65535) & 0xFFFF,
                        uuid: uuid >>> 0
                    });
                }

                this.#pushOp({
                    op: 4,
                    entries: entries
                });

                return uuids;
            }

            const results = [];
            for (const s of segs) {
                const id = this.drawLine({
                    x1: s.x1,
                    y1: s.y1,
                    x2: s.x2,
                    y2: s.y2,
                    color: s.color ?? color,
                    transparency: s.transparency ?? transparency,
                    lineWidth: s.lineWidth ?? lineWidth,
                    lifeMs: s.lifeMs ?? lifeMs,
                    fadeMs: s.fadeMs ?? fadeMs,
                    chain: false
                });
                results.push(id);
            }
            return results;
        }

        renderTriangle = ({ x1, y1, x2, y2, x3, y3, color, transparency, lifeMs, fadeMs, uuid = this.generateUUID(), owner = null } = {}) => {
            const shape = {
                type: "triangle",
                x1, y1,
                x2, y2,
                x3, y3,
                color,
                transparency: Math.clamp(0, transparency, 1),
                lifeMs,
                fadeMs,
                timestamp: Date.now(),
                uuid: uuid >>> 0,
                owner: owner || null
            };
            this.#shapeBuffer.push(shape);
            return uuid >>> 0;
        }

        drawTriangle = ({ x1, y1, x2, y2, x3, y3, color = null, transparency = null, lifeMs = null, fadeMs = null } = {}) => {
            color = color ?? this.#color;
            transparency = transparency ?? this.#transparency;
            lifeMs = (Number.isFinite(lifeMs) ? lifeMs : this.#lifeMs) >>> 0;
            fadeMs = (Number.isFinite(fadeMs) ? fadeMs : this.#fadeMs) >>> 0;

            const nx1 = Math.clamp(0, Number(x1) || 0, 1);
            const ny1 = Math.clamp(0, Number(y1) || 0, 1);
            const nx2 = Math.clamp(0, Number(x2) || 0, 1);
            const ny2 = Math.clamp(0, Number(y2) || 0, 1);
            const nx3 = Math.clamp(0, Number(x3) || 0, 1);
            const ny3 = Math.clamp(0, Number(y3) || 0, 1);

            const uuid = this.generateUUID();

            this.renderTriangle({
                x1: nx1,
                y1: ny1,
                x2: nx2,
                y2: ny2,
                x3: nx3,
                y3: ny3,
                color: color,
                transparency: transparency,
                lifeMs: lifeMs,
                fadeMs: fadeMs,
                uuid: uuid,
                owner: MPP?.client?.participantId || null
            });

            const x1u = Math.round(nx1 * 65535) >>> 0;
            const y1u = Math.round(ny1 * 65535) >>> 0;
            const x2u = Math.round(nx2 * 65535) >>> 0;
            const y2u = Math.round(ny2 * 65535) >>> 0;
            const x3u = Math.round(nx3 * 65535) >>> 0;
            const y3u = Math.round(ny3 * 65535) >>> 0;

            this.#pushOp({
                op: 5,
                color: color,
                transparency: transparency,
                lifeMs: lifeMs,
                fadeMs: fadeMs,
                x1u: x1u & 0xFFFF,
                y1u: y1u & 0xFFFF,
                x2u: x2u & 0xFFFF,
                y2u: y2u & 0xFFFF,
                x3u: x3u & 0xFFFF,
                y3u: y3u & 0xFFFF,
                uuid: uuid >>> 0
            });

            return uuid >>> 0;
        }

        drawTriangles = (triangles = [], { color = null, transparency = null, lifeMs = null, fadeMs = null } = {}) => {
            if (!Array.isArray(triangles) || !triangles.length) return [];

            const results = [];
            for (const t of triangles) {
                const id = this.drawTriangle({
                    x1: Math.clamp(0, Number(t.x1) || 0, 1),
                    y1: Math.clamp(0, Number(t.y1) || 0, 1),
                    x2: Math.clamp(0, Number(t.x2) || 0, 1),
                    y2: Math.clamp(0, Number(t.y2) || 0, 1),
                    x3: Math.clamp(0, Number(t.x3) || 0, 1),
                    y3: Math.clamp(0, Number(t.y3) || 0, 1),
                    color: t.color ?? color,
                    transparency: t.transparency ?? transparency,
                    lifeMs: Number.isFinite(t.lifeMs) ? t.lifeMs : lifeMs,
                    fadeMs: Number.isFinite(t.fadeMs) ? t.fadeMs : fadeMs
                });
                results.push(id);
            }
            return results;
        }

        renderEllipse = ({ cx, cy, rx, ry, color, transparency, lineWidth, lifeMs, fadeMs, subType = "fill", uuid = this.generateUUID(), owner = null } = {}) => {
            const shape = {
                type: "ellipse",
                subType,
                cx, cy,
                rx, ry,
                color,
                transparency: Math.clamp(0, transparency, 1),
                lineWidth,
                lifeMs,
                fadeMs,
                timestamp: Date.now(),
                uuid: uuid >>> 0,
                owner: owner || null
            };
            this.#shapeBuffer.push(shape);
            return uuid >>> 0;
        }

        drawEllipse = ({ cx, cy, rx, ry, color = null, transparency = null, lineWidth = null, lifeMs = null, fadeMs = null, fill = true } = {}) => {
            color = color ?? this.#color;
            transparency = transparency ?? this.#transparency;
            lineWidth = (Number.isFinite(lineWidth) ? lineWidth : this.#lineWidth) >>> 0;
            lifeMs = (Number.isFinite(lifeMs) ? lifeMs : this.#lifeMs) >>> 0;
            fadeMs = (Number.isFinite(fadeMs) ? fadeMs : this.#fadeMs) >>> 0;

            const ncx = Math.clamp(0, Number(cx) || 0, 1);
            const ncy = Math.clamp(0, Number(cy) || 0, 1);
            const nrx = Math.clamp(0, Number(rx) || 0, 1);
            const nry = Math.clamp(0, Number(ry) || 0, 1);

            const uuid = this.generateUUID();

            this.renderEllipse({
                cx: ncx,
                cy: ncy,
                rx: nrx,
                ry: nry,
                color: color,
                transparency: transparency,
                lineWidth: lineWidth,
                lifeMs: lifeMs,
                fadeMs: fadeMs,
                subType: fill ? "fill" : "stroke",
                uuid: uuid,
                owner: MPP?.client?.participantId || null
            });

            const cxu = Math.round(ncx * 65535) >>> 0;
            const cyu = Math.round(ncy * 65535) >>> 0;
            const rxu = Math.round(nrx * 65535) >>> 0;
            const ryu = Math.round(nry * 65535) >>> 0;

            if (fill) {
                this.#pushOp({
                    op: 7,
                    color: color,
                    transparency: transparency,
                    lifeMs: lifeMs,
                    fadeMs: fadeMs,
                    cxu: cxu & 0xFFFF,
                    cyu: cyu & 0xFFFF,
                    rxu: rxu & 0xFFFF,
                    ryu: ryu & 0xFFFF,
                    uuid: uuid >>> 0
                });
            } else {
                this.#pushOp({
                    op: 6,
                    color: color,
                    transparency: transparency,
                    lineWidth: lineWidth,
                    lifeMs: lifeMs,
                    fadeMs: fadeMs,
                    cxu: cxu & 0xFFFF,
                    cyu: cyu & 0xFFFF,
                    rxu: rxu & 0xFFFF,
                    ryu: ryu & 0xFFFF,
                    uuid: uuid >>> 0
                });
            }

            return uuid >>> 0;
        }

        drawEllipses = (ellipses = [], { color = null, transparency = null, lineWidth = null, lifeMs = null, fadeMs = null } = {}) => {
            if (!Array.isArray(ellipses) || !ellipses.length) return [];
            const results = [];
            for (const e of ellipses) {
                const id = this.drawEllipse({
                    cx: Math.clamp(0, Number(e.cx) || 0, 1),
                    cy: Math.clamp(0, Number(e.cy) || 0, 1),
                    rx: Math.clamp(0, Number(e.rx) || 0, 1),
                    ry: Math.clamp(0, Number(e.ry) || 0, 1),
                    color: e.color ?? color,
                    transparency: e.transparency ?? transparency,
                    lineWidth: Number.isFinite(e.lineWidth) ? e.lineWidth : lineWidth,
                    lifeMs: Number.isFinite(e.lifeMs) ? e.lifeMs : lifeMs,
                    fadeMs: Number.isFinite(e.fadeMs) ? e.fadeMs : fadeMs,
                    fill: e.fill
                });
                results.push(id);
            }
            return results;
        }

        renderText = ({ x, y, text, color, transparency, fontSize, lifeMs, fadeMs, options, uuid = this.generateUUID(), owner = null } = {}) => {
            const shape = {
                type: "text",
                x, y,
                text: String(text),
                color,
                transparency: Math.clamp(0, transparency, 1),
                fontSize,
                lifeMs,
                fadeMs,
                options: options & 0xFF,
                timestamp: Date.now(),
                uuid: uuid >>> 0,
                owner: owner || null
            };
            this.#shapeBuffer.push(shape);
            return uuid >>> 0;
        }

        drawText = ({ x, y, text, color = null, transparency = null, fontSize = null, lineWidth = null, lifeMs = null, fadeMs = null, textAlign = null, fontStyle = [], fontFamily = null } = {}) => {
            color = color ?? this.#color;
            transparency = transparency ?? this.#transparency;
            fontSize = (Number.isFinite(fontSize) ? fontSize : this.#fontSize) >>> 0;
            lineWidth = (Number.isFinite(lineWidth) ? lineWidth : this.#lineWidth) >>> 0;
            lifeMs = (Number.isFinite(lifeMs) ? lifeMs : this.#lifeMs) >>> 0;
            fadeMs = (Number.isFinite(fadeMs) ? fadeMs : this.#fadeMs) >>> 0;

            let options = 0;
            options |= Object.values(Drawboard.TextAlign).indexOf(textAlign ?? Drawboard.TextAlign.LEFT) & 0x03;
            options |= (fontStyle.includes("bold") ? 1 : 0) << 2;
            options |= (fontStyle.includes("italic") ? 1 : 0) << 3;
            options |= (fontStyle.includes("underline") ? 1 : 0) << 4;
            options |= (fontStyle.includes("line-through") ? 1 : 0) << 5;
            options |= (Object.values(Drawboard.FontFamily).indexOf(fontFamily ?? Drawboard.FontFamily.SANS_SERIF) & 0x03) << 6;

            const nx = Math.clamp(0, Number(x) || 0, 1);
            const ny = Math.clamp(0, Number(y) || 0, 1);

            const uuid = this.generateUUID();

            this.renderText({
                x: nx,
                y: ny,
                text,
                color,
                transparency,
                fontSize,
                lineWidth,
                lifeMs,
                fadeMs,
                options,
                uuid,
                owner: MPP?.client?.participantId || null
            });

            const xu = Math.round(nx * 65535) >>> 0;
            const yu = Math.round(ny * 65535) >>> 0;

            this.#pushOp({
                op: 8,
                color: color,
                transparency: transparency,
                fontSize: fontSize,
                lifeMs: lifeMs,
                fadeMs: fadeMs,
                xu: xu & 0xFFFF,
                yu: yu & 0xFFFF,
                text: text,
                options: options & 0xFF,
                uuid: uuid >>> 0
            });

            return uuid >>> 0;
        }

        renderErase = ({ x, y, radius } = {}) => {
            if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(radius)) return [];
            const removed = [];
            for (let i = this.#shapeBuffer.length - 1; i >= 0; i--) {
                const shape = this.#shapeBuffer[i];

                switch (shape.type) {
                    case "line": {
                        const d = this.#pointToSegmentDistance(x, y, shape.x1, shape.y1, shape.x2, shape.y2);
                        if (d <= radius) {
                            if (shape.uuid) removed.push(shape.uuid);
                            this.#shapeBuffer.splice(i, 1);
                        }
                        break;
                    }
                    case "triangle": {
                        const inside = this.#pointInTriangle(x, y, shape.x1, shape.y1, shape.x2, shape.y2, shape.x3, shape.y3);
                        if (inside) {
                            if (shape.uuid) removed.push(shape.uuid);
                            this.#shapeBuffer.splice(i, 1);
                        } else {
                            const d1 = this.#pointToSegmentDistance(x, y, shape.x1, shape.y1, shape.x2, shape.y2);
                            const d2 = this.#pointToSegmentDistance(x, y, shape.x2, shape.y2, shape.x3, shape.y3);
                            const d3 = this.#pointToSegmentDistance(x, y, shape.x3, shape.y3, shape.x1, shape.y1);
                            const d = Math.min(d1, d2, d3);
                            if (d <= radius) {
                                if (shape.uuid) removed.push(shape.uuid);
                                this.#shapeBuffer.splice(i, 1);
                            }
                        }
                        break;
                    }
                    case "ellipse": {
                        const cx = shape.cx;
                        const cy = shape.cy;
                        const rx = shape.rx;
                        const ry = shape.ry;

                        switch (shape.subType) {
                            case "fill": {
                                const vx = (x - cx) / rx;
                                const vy = (y - cy) / ry;
                                if ((vx * vx + vy * vy) <= 1) {
                                    if (shape.uuid) removed.push(shape.uuid);
                                    this.#shapeBuffer.splice(i, 1);
                                } else {
                                    const distToBoundary = Math.abs(Math.sqrt(vx * vx + vy * vy) - 1) * Math.max(rx, ry);
                                    if (distToBoundary <= radius) {
                                        if (shape.uuid) removed.push(shape.uuid);
                                        this.#shapeBuffer.splice(i, 1);
                                    }
                                }
                                break;
                            }
                            case "stroke": {
                                const vx = (x - cx) / rx;
                                const vy = (y - cy) / ry;
                                const norm = Math.sqrt(vx * vx + vy * vy);
                                const distToBoundary = Math.abs(norm - 1) * Math.max(rx, ry);
                                if (distToBoundary <= radius) {
                                    if (shape.uuid) removed.push(shape.uuid);
                                    this.#shapeBuffer.splice(i, 1);
                                }
                                break;
                            }
                            default: {
                                console.warn("Unknown drawboard shape subtype:", shape.subType);
                                break;
                            }
                        }
                        break;
                    }
                    case "text": {
                        const cx = x * this.#canvas.width;
                        const cy = y * this.#canvas.height;
                        const radiusPx = radius * Math.max(this.#canvas.width, this.#canvas.height);

                        const opts = shape.options || 0;
                        const align = opts & 0x03;
                        const bold = !!(opts & 0x04);
                        const italic = !!(opts & 0x08);
                        // const underline = !!(opts & 0x10); // not needed for measurement
                        // const lineThrough = !!(opts & 0x20);
                        const fontIndex = (opts >> 6) & 0x03;

                        const families = [
                            Drawboard.FontFamily.SANS_SERIF,
                            Drawboard.FontFamily.SERIF,
                            Drawboard.FontFamily.MONOSPACE,
                            Drawboard.FontFamily.CURSIVE
                        ];
                        const family = families[fontIndex] || Drawboard.FontFamily.SANS_SERIF;
                        const style = (italic ? "italic " : "") + (bold ? "bold " : "");
                        const fontSize = Math.max(1, Number(shape.fontSize) || this.#fontSize || 12);

                        this.#ctx.save();
                        this.#ctx.font = `${style}${fontSize}px ${family}`;
                        this.#ctx.textBaseline = "top";

                        const metrics = this.#ctx.measureText(shape.text || "");
                        const textWidth = metrics.width || 0;

                        let textHeight = fontSize;
                        if (typeof metrics.actualBoundingBoxAscent === "number" && typeof metrics.actualBoundingBoxDescent === "number") {
                            textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
                            if (!(Number.isFinite(textHeight)) || textHeight <= 0) textHeight = fontSize;
                        }

                        const px = shape.x * this.#canvas.width;
                        const py = shape.y * this.#canvas.height;
                        let startX = px;
                        if (align === 1) startX = px - textWidth;
                        else if (align === 2) startX = px - textWidth / 2;

                        const rect = {
                            x: startX,
                            y: py,
                            w: textWidth,
                            h: textHeight
                        };

                        const nearestX = Math.max(rect.x, Math.min(cx, rect.x + rect.w));
                        const nearestY = Math.max(rect.y, Math.min(cy, rect.y + rect.h));
                        const dx = nearestX - cx;
                        const dy = nearestY - cy;
                        const distSq = dx * dx + dy * dy;

                        this.#ctx.restore();

                        if (distSq <= radiusPx * radiusPx) {
                            if (shape.uuid) removed.push(shape.uuid);
                            this.#shapeBuffer.splice(i, 1);
                        }
                        break;
                    }
                    default: {
                        console.warn("Unknown drawboard shape type:", shape.type);
                        break;
                    }
                }
            }

            const removedUUIDs = Array.from(new Set(removed));
            return removedUUIDs;
        }

        erase = ({ x, y, radius } = {}) => {
            const removedUUIDs = this.renderErase({ x, y, radius });
            return removedUUIDs;
        }

        eraseShape = ({ uuid } = {}) => {
            if (uuid == null) return [];
            const u = Number(uuid) >>> 0;

            const removed = this.#removeShapesByUUIDs([u]);
            if (removed && removed.length) {
                this.#pushOp({ op: 1, uuids: removed.map(n => Number(n) >>> 0) });
            } else {
                this.#pushOp({ op: 1, uuids: [u] });
            }
            return removed;
        }

        eraseShapes = (uuids = []) => {
            if (!Array.isArray(uuids) || !uuids.length) return [];
            const clean = Array.from(new Set(uuids.map(n => Number(n) >>> 0)));
            const removed = this.#removeShapesByUUIDs(clean);
            if (removed && removed.length) {
                this.#pushOp({ op: 1, uuids: removed.map(n => Number(n) >>> 0) });
            } else {
                this.#pushOp({ op: 1, uuids: clean });
            }
            return removed;
        }

        eraseAll = () => {
            const ownerId = MPP?.client?.participantId || null;
            const ownerStr = ownerId !== null ? String(ownerId) : null;
            if (ownerStr !== null) {
                this.#removeLinesByOwner(ownerStr);
            } else {
                this.#shapeBuffer.length = 0;
            }
            this.#pushOp({ op: 0 });
        }

        handleIncomingData = (packet) => {
            if (!packet?.data?.drawboard) return;
            const payload = atob(packet.data.drawboard);

            try {
                const bytes = new Array(payload.length);
                for (let i = 0; i < payload.length; i++) bytes[i] = payload.charCodeAt(i);

                const state = { i: 0 };
                const opCount = this.#readULEB128(bytes, state);

                const senderId = (packet && packet.p) ? String(packet.p) : null;

                for (let opIndex = 0; opIndex < opCount; opIndex++) {
                    const type = this.#readUint8(bytes, state);

                    switch (type) {
                        case 0: {
                            if (!senderId) {
                                console.warn("Clear user received but no sender provided.");
                            } else {
                                this.#removeLinesByOwner(senderId);
                            }
                            break;
                        }
                        case 1: {
                            const len = this.#readULEB128(bytes, state);
                            const uuids = [];
                            for (let k = 0; k < len; k++) {
                                const u = this.#readUint32(bytes, state);
                                uuids.push(u >>> 0);
                            }
                            this.#removeShapesByUUIDs(uuids);
                            break;
                        }
                        case 2: {
                            const color = this.#readColor(bytes, state);
                            const transparency = Math.clamp(0, this.#readUint8(bytes, state) / 255, 1);
                            const lineWidth = this.#readULEB128(bytes, state);
                            const lifeMs = this.#readULEB128(bytes, state);
                            const fadeMs = this.#readULEB128(bytes, state);
                            const x1u = this.#readUint16(bytes, state);
                            const y1u = this.#readUint16(bytes, state);
                            const x2u = this.#readUint16(bytes, state);
                            const y2u = this.#readUint16(bytes, state);
                            const uuid = this.#readUint32(bytes, state);

                            const x1 = Math.clamp(0, x1u / 65535, 1);
                            const y1 = Math.clamp(0, y1u / 65535, 1);
                            const x2 = Math.clamp(0, x2u / 65535, 1);
                            const y2 = Math.clamp(0, y2u / 65535, 1);

                            this.renderLine({
                                x1, y1, x2, y2,
                                color,
                                transparency,
                                lineWidth,
                                lifeMs: lifeMs,
                                fadeMs: fadeMs,
                                uuid: uuid >>> 0,
                                owner: senderId
                            });
                            break;
                        }
                        case 3: {
                            const color = this.#readColor(bytes, state);
                            const transparency = Math.clamp(0, this.#readUint8(bytes, state) / 255, 1);
                            const lineWidth = this.#readULEB128(bytes, state);
                            const lifeMs = this.#readULEB128(bytes, state);
                            const fadeMs = this.#readULEB128(bytes, state);
                            const xu = this.#readUint16(bytes, state);
                            const yu = this.#readUint16(bytes, state);
                            const entry = {
                                x: xu >>> 0,
                                y: yu >>> 0,
                                color,
                                transparency,
                                lineWidth,
                                lifeMs,
                                fadeMs
                            };
                            if (senderId) this.#chains.set(senderId, entry);
                            break;
                        }
                        case 4: {
                            const len = this.#readULEB128(bytes, state);
                            if (!senderId) {
                                for (let k = 0; k < len; k++) {
                                    const xu = this.#readUint16(bytes, state);
                                    const yu = this.#readUint16(bytes, state);
                                    const uuid = this.#readUint32(bytes, state);
                                    // no sender ... ignore for now
                                }
                            } else {
                                let chain = this.#chains.get(senderId);
                                for (let k = 0; k < len; k++) {
                                    const xu = this.#readUint16(bytes, state);
                                    const yu = this.#readUint16(bytes, state);
                                    const uuid = this.#readUint32(bytes, state);

                                    const x = xu >>> 0;
                                    const y = yu >>> 0;
                                    if (!chain) {
                                        chain = {
                                            x,
                                            y,
                                            color: "#000000",
                                            transparency: 1,
                                            lineWidth: 3,
                                            lifeMs: 5000,
                                            fadeMs: 3000
                                        };
                                        this.#chains.set(senderId, chain);
                                        continue;
                                    }

                                    const x1n = Math.clamp(0, chain.x / 65535, 1);
                                    const y1n = Math.clamp(0, chain.y / 65535, 1);
                                    const x2n = Math.clamp(0, x / 65535, 1);
                                    const y2n = Math.clamp(0, y / 65535, 1);

                                    this.renderLine({
                                        x1: x1n,
                                        y1: y1n,
                                        x2: x2n,
                                        y2: y2n,
                                        color: chain.color,
                                        transparency: chain.transparency,
                                        lineWidth: chain.lineWidth,
                                        lifeMs: chain.lifeMs,
                                        fadeMs: chain.fadeMs,
                                        uuid: uuid >>> 0,
                                        owner: senderId
                                    });

                                    chain.x = x;
                                    chain.y = y;
                                }
                                this.#chains.set(senderId, chain);
                            }
                            break;
                        }
                        case 5: {
                            const color = this.#readColor(bytes, state);
                            const transparency = Math.clamp(0, this.#readUint8(bytes, state) / 255, 1);
                            const lifeMs = this.#readULEB128(bytes, state);
                            const fadeMs = this.#readULEB128(bytes, state);
                            const x1u = this.#readUint16(bytes, state);
                            const y1u = this.#readUint16(bytes, state);
                            const x2u = this.#readUint16(bytes, state);
                            const y2u = this.#readUint16(bytes, state);
                            const x3u = this.#readUint16(bytes, state);
                            const y3u = this.#readUint16(bytes, state);
                            const uuid = this.#readUint32(bytes, state);

                            const x1 = Math.clamp(0, x1u / 65535, 1);
                            const y1 = Math.clamp(0, y1u / 65535, 1);
                            const x2 = Math.clamp(0, x2u / 65535, 1);
                            const y2 = Math.clamp(0, y2u / 65535, 1);
                            const x3 = Math.clamp(0, x3u / 65535, 1);
                            const y3 = Math.clamp(0, y3u / 65535, 1);

                            this.renderTriangle({
                                x1, y1, x2, y2, x3, y3,
                                color,
                                transparency,
                                lifeMs: lifeMs,
                                fadeMs: fadeMs,
                                uuid: uuid >>> 0,
                                owner: senderId
                            });
                            break;
                        }
                        case 6: {
                            const color = this.#readColor(bytes, state);
                            const transparency = Math.clamp(0, this.#readUint8(bytes, state) / 255, 1);
                            const lineWidth = this.#readULEB128(bytes, state);
                            const lifeMs = this.#readULEB128(bytes, state);
                            const fadeMs = this.#readULEB128(bytes, state);
                            const cxu = this.#readUint16(bytes, state);
                            const cyu = this.#readUint16(bytes, state);
                            const rxu = this.#readUint16(bytes, state);
                            const ryu = this.#readUint16(bytes, state);
                            const uuid = this.#readUint32(bytes, state);

                            const cx = Math.clamp(0, cxu / 65535, 1);
                            const cy = Math.clamp(0, cyu / 65535, 1);
                            const rx = Math.clamp(0, rxu / 65535, 1);
                            const ry = Math.clamp(0, ryu / 65535, 1);

                            this.renderEllipse({
                                cx, cy,
                                rx, ry,
                                color,
                                transparency,
                                lineWidth,
                                lifeMs: lifeMs,
                                fadeMs: fadeMs,
                                subType: "stroke",
                                uuid: uuid >>> 0,
                                owner: senderId
                            });
                            break;
                        }
                        case 7: {
                            const color = this.#readColor(bytes, state);
                            const transparency = Math.clamp(0, this.#readUint8(bytes, state) / 255, 1);
                            const lifeMs = this.#readULEB128(bytes, state);
                            const fadeMs = this.#readULEB128(bytes, state);
                            const cxu = this.#readUint16(bytes, state);
                            const cyu = this.#readUint16(bytes, state);
                            const rxu = this.#readUint16(bytes, state);
                            const ryu = this.#readUint16(bytes, state);
                            const uuid = this.#readUint32(bytes, state);

                            const cx = Math.clamp(0, cxu / 65535, 1);
                            const cy = Math.clamp(0, cyu / 65535, 1);
                            const rx = Math.clamp(0, rxu / 65535, 1);
                            const ry = Math.clamp(0, ryu / 65535, 1);

                            this.renderEllipse({
                                cx, cy,
                                rx, ry,
                                color,
                                transparency,
                                lineWidth: 1,
                                lifeMs: lifeMs,
                                fadeMs: fadeMs,
                                subType: "fill",
                                uuid: uuid >>> 0,
                                owner: senderId
                            });
                            break;
                        }
                        case 8: {
                            const color = this.#readColor(bytes, state);
                            const transparency = Math.clamp(0, this.#readUint8(bytes, state) / 255, 1);
                            const fontSize = this.#readULEB128(bytes, state);
                            const lifeMs = this.#readULEB128(bytes, state);
                            const fadeMs = this.#readULEB128(bytes, state);
                            const xu = this.#readUint16(bytes, state);
                            const yu = this.#readUint16(bytes, state);
                            const text = this.#readString(bytes, state);
                            const options = this.#readUint8(bytes, state);
                            const uuid = this.#readUint32(bytes, state);

                            const x = Math.clamp(0, xu / 65535, 1);
                            const y = Math.clamp(0, yu / 65535, 1);

                            this.renderText({
                                x, y,
                                text,
                                color,
                                transparency,
                                fontSize,
                                lineWidth: 1,
                                lifeMs: lifeMs,
                                fadeMs: fadeMs,
                                options,
                                uuid: uuid >>> 0,
                                owner: senderId
                            });
                            break;
                        }
                        default: {
                            console.warn("Unknown drawboard op code:", type);
                            break;
                        }
                    }
                }
            } catch (err) {
                console.warn("Failed to parse incoming drawboard payload:", err);
            }
        }
    }

    async function run() {
        MPP.Drawboard = Drawboard;
        MPP.drawboard = new Drawboard();

        MPP.client.sendArray([{
            m: "+custom"
        }]);

        if (MPP?.client?.on) {
            MPP.client.on("custom", (packet) => {
                if (!packet || !packet.data) return;
                if (packet.data.drawboard) {
                    MPP.drawboard.handleIncomingData(packet);
                }
            });
        }
    }

    function check() {
        if (!Drawboard.connected) {
            return setTimeout(() => {
                check();
            }, 200);
        }

        run();
    }

    check();
})();