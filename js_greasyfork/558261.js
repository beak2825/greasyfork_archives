// ==UserScript==
// @name         EmirClientLite
// @description  Simple UI with ESP lines and basic autofarm for diep.io[FULL VERSION IN MY DISCORD]
// @version      0.1.0
// @author       EmirtheBoss
// @match        https://diep.io/*
// @run-at       document-start
// @grant        none
// @license      Copyright EmirtheBoss
// @namespace https://greasyfork.org/users/1544163
// @downloadURL https://update.greasyfork.org/scripts/558261/EmirClientLite.user.js
// @updateURL https://update.greasyfork.org/scripts/558261/EmirClientLite.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const CONFIG = {
        visuals: {
            esp: true,
            espLines: true,
            lineWidth: 2,
            lineColor: "#af52de",
        },
        autofarm: {
            enabled: false,
            priority: "pentagon",
            fire: true,
        },
        keys: {
            toggleMenu: "KeyM",
            toggleEsp: "KeyL",
            toggleAutofarm: "KeyJ",
        },
    };

    let gameCanvas = null;
    let overlayCanvas = null;
    let overlayCtx = null;

    function createOverlay() {
        if (overlayCanvas) return;
        overlayCanvas = document.createElement("canvas");
        overlayCanvas.style.position = "fixed";
        overlayCanvas.style.top = "0";
        overlayCanvas.style.left = "0";
        overlayCanvas.style.width = "100%";
        overlayCanvas.style.height = "100%";
        overlayCanvas.style.pointerEvents = "none";
        overlayCanvas.style.zIndex = "999998";
        overlayCanvas.id = "emirclientlite-overlay";
        document.body.appendChild(overlayCanvas);
        overlayCtx = overlayCanvas.getContext("2d");
        resizeOverlay();
        window.addEventListener("resize", resizeOverlay);
    }

    function resizeOverlay() {
        if (!overlayCanvas) return;
        overlayCanvas.width = window.innerWidth * window.devicePixelRatio;
        overlayCanvas.height = window.innerHeight * window.devicePixelRatio;
        overlayCtx.setTransform(1, 0, 0, 1, 0, 0);
    }

    let menuContainer = null;

    function createMenu() {
        if (menuContainer) return;

        menuContainer = document.createElement("div");
        menuContainer.id = "emirclientlite-menu";
        Object.assign(menuContainer.style, {
            position: "fixed",
            top: "60px",
            left: "60px",
            width: "230px",
            background: "rgba(15,15,20,0.95)",
            border: "1px solid #2f2f2f",
            borderRadius: "6px",
            boxShadow: "0 0 12px rgba(0,0,0,0.7)",
            color: "#e0e0e0",
            fontFamily: "Segoe UI, Arial, sans-serif",
            fontSize: "13px",
            zIndex: "999999",
            userSelect: "none",
            padding: "8px 10px",
            display: "none",
        });

        const header = document.createElement("div");
        header.textContent = "EmirClientLite Controls";
        Object.assign(header.style, {
            textAlign: "center",
            fontWeight: "600",
            marginBottom: "6px",
            cursor: "move",
            borderBottom: "1px solid #2f2f2f",
            paddingBottom: "4px",
        });
        menuContainer.appendChild(header);

        function addToggle(label, id, hint) {
            const wrap = document.createElement("label");
            Object.assign(wrap.style, {
                display: "flex",
                alignItems: "center",
                margin: "4px 0",
                cursor: "pointer",
            });

            const cb = document.createElement("input");
            cb.type = "checkbox";
            cb.id = id;
            Object.assign(cb.style, {
                marginRight: "8px",
                accentColor: "#00b4ff",
            });

            const text = document.createElement("span");
            text.textContent = label + (hint ? " (" + hint + ")" : "");

            wrap.appendChild(cb);
            wrap.appendChild(text);
            menuContainer.appendChild(wrap);
            return cb;
        }

        const espCheckbox = addToggle("ESP Lines", "emirclientlite-esp", "L");
        const autofarmCheckbox = addToggle("Autofarm", "emirclientlite-autofarm", "J");

        const priorityHeader = document.createElement("div");
        priorityHeader.textContent = "Farming Priority";
        Object.assign(priorityHeader.style, {
            marginTop: "6px",
            marginBottom: "2px",
            fontWeight: "500",
        });
        menuContainer.appendChild(priorityHeader);

        function addRadio(label, value) {
            const wrap = document.createElement("label");
            Object.assign(wrap.style, {
                display: "flex",
                alignItems: "center",
                margin: "2px 0",
                cursor: "pointer",
            });

            const rb = document.createElement("input");
            rb.type = "radio";
            rb.name = "emirclientlite-priority";
            rb.value = value;
            rb.style.marginRight = "6px";
            rb.style.accentColor = "#00b4ff";

            const text = document.createElement("span");
            text.textContent = label;

            wrap.appendChild(rb);
            wrap.appendChild(text);
            menuContainer.appendChild(wrap);
            return rb;
        }

        const rbPenta = addRadio("Pentagons", "pentagon");
        const rbSquare = addRadio("Squares", "square");
        const rbTri = addRadio("Triangles", "triangle");

        document.body.appendChild(menuContainer);

        (function makeDraggable() {
            let dragging = false;
            let offsetX = 0;
            let offsetY = 0;

            header.addEventListener("mousedown", (e) => {
                dragging = true;
                const rect = menuContainer.getBoundingClientRect();
                offsetX = e.clientX - rect.left;
                offsetY = e.clientY - rect.top;
                e.preventDefault();
            });

            window.addEventListener("mousemove", (e) => {
                if (!dragging) return;
                menuContainer.style.left = e.clientX - offsetX + "px";
                menuContainer.style.top = e.clientY - offsetY + "px";
            });

            window.addEventListener("mouseup", () => {
                dragging = false;
            });
        })();

        espCheckbox.checked = CONFIG.visuals.esp && CONFIG.visuals.espLines;
        autofarmCheckbox.checked = CONFIG.autofarm.enabled;
        if (CONFIG.autofarm.priority === "pentagon") rbPenta.checked = true;
        else if (CONFIG.autofarm.priority === "square") rbSquare.checked = true;
        else rbTri.checked = true;

        espCheckbox.addEventListener("change", () => {
            const val = espCheckbox.checked;
            CONFIG.visuals.esp = val;
            CONFIG.visuals.espLines = val;
            console.log("[EmirClientLite] ESP Lines " + (val ? "ON" : "OFF"));
        });

        autofarmCheckbox.addEventListener("change", () => {
            CONFIG.autofarm.enabled = autofarmCheckbox.checked;
            console.log("[EmirClientLite] Autofarm " + (CONFIG.autofarm.enabled ? "ON" : "OFF"));
        });

        [rbPenta, rbSquare, rbTri].forEach((rb) => {
            rb.addEventListener("change", () => {
                if (!rb.checked) return;
                CONFIG.autofarm.priority = rb.value;
                console.log("[EmirClientLite] Priority: " + rb.value);
            });
        });
    }

    function setupKeybinds() {
        window.addEventListener("keydown", (e) => {
            if (e.repeat) return;

            if (e.code === CONFIG.keys.toggleMenu) {
                if (!menuContainer) return;
                const hidden = menuContainer.style.display === "none";
                menuContainer.style.display = hidden ? "block" : "none";
                e.preventDefault();
            }

            if (e.code === CONFIG.keys.toggleEsp) {
                const newVal = !(CONFIG.visuals.esp && CONFIG.visuals.espLines);
                CONFIG.visuals.esp = newVal;
                CONFIG.visuals.espLines = newVal;
                const cb = document.getElementById("emirclientlite-esp");
                if (cb) cb.checked = newVal;
                console.log("[EmirClientLite] ESP Lines " + (newVal ? "ON" : "OFF"));
                e.preventDefault();
            }

            if (e.code === CONFIG.keys.toggleAutofarm) {
                CONFIG.autofarm.enabled = !CONFIG.autofarm.enabled;
                const cb = document.getElementById("emirclientlite-autofarm");
                if (cb) cb.checked = CONFIG.autofarm.enabled;
                console.log("[EmirClientLite] Autofarm " + (CONFIG.autofarm.enabled ? "ON" : "OFF"));
                e.preventDefault();
            }
        });
    }

    const origGetById = Document.prototype.getElementById;
    Document.prototype.getElementById = function (id) {
        const el = origGetById.call(this, id);
        if (id === "canvas" && el && el.tagName === "CANVAS") {
            gameCanvas = el;
            if (document.readyState === "complete" || document.readyState === "interactive") {
                createOverlay();
            } else {
                window.addEventListener("DOMContentLoaded", createOverlay);
            }
        }
        return el;
    };

    const origCreateEl = Document.prototype.createElement;
    Document.prototype.createElement = function (tag) {
        const el = origCreateEl.call(this, tag);
        if (tag === "canvas" && el.id === "canvas") {
            gameCanvas = el;
            if (document.readyState === "complete" || document.readyState === "interactive") {
                createOverlay();
            } else {
                window.addEventListener("DOMContentLoaded", createOverlay);
            }
        }
        return el;
    };

    if (document.readyState === "complete" || document.readyState === "interactive") {
        createMenu();
    } else {
        window.addEventListener("DOMContentLoaded", createMenu);
    }
    setupKeybinds();

    const EntityType = {
        Square: "square",
        Triangle: "triangle",
        Pentagon: "pentagon",
        Player: "player",
        Unknown: "unknown",
    };

    const entities = [];
    let lastFrameTime = performance.now();

    function clearEntities() {
        entities.length = 0;
    }

    function centroid(verts) {
        let sx = 0, sy = 0;
        if (!verts.length) return { x: 0, y: 0 };
        for (const v of verts) {
            sx += v.x;
            sy += v.y;
        }
        return { x: sx / verts.length, y: sy / verts.length };
    }

    const origGetContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
        const ctx = origGetContext.call(this, type, ...args);
        if (this.id !== "canvas" || type !== "2d" || !ctx) return ctx;

        let currentVerts = [];
        let collecting = false;

        const origBeginPath = ctx.beginPath;
        const origMoveTo = ctx.moveTo;
        const origLineTo = ctx.lineTo;
        const origFill = ctx.fill;
        const origArc = ctx.arc;

        ctx.beginPath = function (...a) {
            collecting = true;
            currentVerts = [];
            return origBeginPath.apply(this, a);
        };

        ctx.moveTo = function (x, y) {
            if (collecting) currentVerts.push({ x, y });
            return origMoveTo.call(this, x, y);
        };

        ctx.lineTo = function (x, y) {
            if (collecting) currentVerts.push({ x, y });
            return origLineTo.call(this, x, y);
        };

                ctx.fill = function (...a) {
            if (collecting && currentVerts.length >= 3) {
                const c = centroid(currentVerts);
                const t = this.getTransform();
                const worldX = t.a * c.x + t.c * c.y + t.e;
                const worldY = t.b * c.x + t.d * c.y + t.f;

                let type = EntityType.Unknown;
                const n = currentVerts.length;
                if (n === 3) type = EntityType.Triangle;
                else if (n === 4) type = EntityType.Square;
                else if (n === 5) type = EntityType.Pentagon;

                entities.push({
                    type,
                    x: worldX,
                    y: worldY,
                });
            }
            collecting = false;
            currentVerts = [];
            return origFill.apply(this, a);
        };


        ctx.arc = function (x, y, r, ...rest) {
            return origArc.call(this, x, y, r, ...rest);
        };

        return ctx;
    };

    function redrawESP() {
        if (!overlayCtx || !gameCanvas) return;
        const now = performance.now();
        const dt = now - lastFrameTime;
        lastFrameTime = now;

        overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

        if (!CONFIG.visuals.esp || !CONFIG.visuals.espLines) return;

        const centerX = overlayCanvas.width / 2;
        const centerY = overlayCanvas.height / 2;

        overlayCtx.save();
        overlayCtx.lineWidth = CONFIG.visuals.lineWidth * window.devicePixelRatio;

        for (const ent of entities) {
            if (
                ent.type !== EntityType.Square &&
                ent.type !== EntityType.Triangle &&
                ent.type !== EntityType.Pentagon
            ) continue;

            // Pick color per shape type
            if (ent.type === EntityType.Square) {
                overlayCtx.strokeStyle = "#ffe869"; // yellow square
            } else if (ent.type === EntityType.Triangle) {
                overlayCtx.strokeStyle = "#fc7677"; // red triangle
            } else if (ent.type === EntityType.Pentagon) {
                overlayCtx.strokeStyle = "#768dfc"; // blue pentagon
            }

            overlayCtx.beginPath();
            overlayCtx.moveTo(centerX, centerY);
            overlayCtx.lineTo(ent.x, ent.y);
            overlayCtx.stroke();
        }

        overlayCtx.restore();

    }

    function sendMouse(x, y) {
        if (!gameCanvas) return;
        const rect = gameCanvas.getBoundingClientRect();
        const clientX = rect.left + x;
        const clientY = rect.top + y;
        const moveEvt = new MouseEvent("mousemove", {
            clientX,
            clientY,
            bubbles: true,
            cancelable: true,
        });
        gameCanvas.dispatchEvent(moveEvt);
    }

    function mouseDown() {
        const down = new MouseEvent("mousedown", {
            button: 0,
            bubbles: true,
            cancelable: true,
        });
        window.dispatchEvent(down);
    }

    function mouseUp() {
        const up = new MouseEvent("mouseup", {
            button: 0,
            bubbles: true,
            cancelable: true,
        });
        window.dispatchEvent(up);
    }

    let autofireTimer = 0;

    function runAutofarm(dt) {
        if (!CONFIG.autofarm.enabled || !gameCanvas) return;
        if (!entities.length) return;

        const canvasCenterX = gameCanvas.clientWidth / 2;
        const canvasCenterY = gameCanvas.clientHeight / 2;

        const targetType = CONFIG.autofarm.priority;
        let candidates = entities.filter((e) => {
            if (targetType === "pentagon") return e.type === EntityType.Pentagon;
            if (targetType === "square") return e.type === EntityType.Square;
            if (targetType === "triangle") return e.type === EntityType.Triangle;
            return false;
        });

        if (!candidates.length) {
            candidates = entities.filter(
                (e) =>
                    e.type === EntityType.Pentagon ||
                    e.type === EntityType.Square ||
                    e.type === EntityType.Triangle
            );
        }
        if (!candidates.length) return;

        let best = null;
        let bestDist = Infinity;
        for (const e of candidates) {
            const dx = e.x - canvasCenterX * window.devicePixelRatio;
            const dy = e.y - canvasCenterY * window.devicePixelRatio;
            const d = Math.hypot(dx, dy);
            if (d < bestDist) {
                bestDist = d;
                best = e;
            }
        }
        if (!best) return;

        const rect = gameCanvas.getBoundingClientRect();
        const targetScreenX = best.x / window.devicePixelRatio;
        const targetScreenY = best.y / window.devicePixelRatio;

        sendMouse(targetScreenX, targetScreenY);

        autofireTimer += dt;
        if (CONFIG.autofarm.fire && autofireTimer >= 120) {
            autofireTimer = 0;
            mouseDown();
            setTimeout(mouseUp, 40);
        }
    }

    function mainLoop() {
        const now = performance.now();
        const dt = now - lastFrameTime;

        redrawESP();
        runAutofarm(dt);
        clearEntities();

        requestAnimationFrame(mainLoop);
    }

    function startLoopWhenReady() {
        if (!overlayCanvas) {
            requestAnimationFrame(startLoopWhenReady);
            return;
        }
        lastFrameTime = performance.now();
        requestAnimationFrame(mainLoop);
    }
    startLoopWhenReady();

})();
