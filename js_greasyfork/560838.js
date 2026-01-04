// ==UserScript==
// @name         NIGGA CLIENT
// @description  Cheat client for Deadshot.io
// @author       levifrsn
// @match        *://*deadshot.io/*
// @license      MIT
// @run-at       document-start
// @version      1.41.1
// @namespace https://greasyfork.org/users/
// @downloadURL https://update.greasyfork.org/scripts/560838/NIGGA%20CLIENT.user.js
// @updateURL https://update.greasyfork.org/scripts/560838/NIGGA%20CLIENT.meta.js
// ==/UserScript==

const loadSettings = () => {
    const saved = localStorage.getItem("NIGGA_client_settings");
    const defaults = {
        wireframe: false,
        esp: true,
        mobile: false,
        vertexThreshold: 300,
        visible: true,
        dot: true,
    };
    try {
        return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
    } catch (e) {
        return defaults;
    }
};

const settings = loadSettings();
const saveSettings = () =>
    localStorage.setItem("NIGGA_client_settings", JSON.stringify(settings));

if (settings.mobile) {
    const userAgent =
        "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1";
    Object.defineProperties(navigator, {
        userAgent: { get: () => userAgent },
        platform: { get: () => "iPhone" },
        maxTouchPoints: { get: () => 5 },
        vendor: { get: () => "Apple Computer, Inc." },
    });
    window.ontouchstart = () => {};
}

const WebGL = WebGL2RenderingContext.prototype;

const createDot = () => {
    const dot = document.createElement("div");
    dot.id = "NIGGA-client-dot";
    dot.style.cssText = `
        position: fixed; left: calc(50% + 1px); top: calc(50% + 1px);
        width: 6px; height: 6px; border-radius: 50%; z-index: 1000000;
        transform: translate(-50%, -50%); animation: rgbRotate 3s linear infinite;
        pointer-events: none;
    `;
    const style = document.createElement("style");
    style.textContent = `
        @keyframes rgbRotate {
            0% { background: #ff0000; } 17% { background: #ffff00; }
            33% { background: #00ff00; } 50% { background: #00ffff; }
            66% { background: #0000ff; } 83% { background: #ff00ff; }
            100% { background: #ff0000; }
        }
    `;
    if (!document.querySelector("#rgb-dot-style")) {
        style.id = "rgb-dot-style";
        document.head.appendChild(style);
    }
    return dot;
};

const dotElement = createDot();
const updateDotVisibility = () => {
    const exists = document.getElementById("NIGGA-client-dot");
    if (settings.dot && !exists) document.body.appendChild(dotElement);
    else if (!settings.dot && exists) dotElement.remove();
};

const ui = document.createElement("div");
ui.id = "NIGGA-client-ui";
ui.style.cssText = `
    position: fixed; top: 15px; right: 15px; width: 170px;
    background: rgba(8, 8, 8, 0.65); color: #ccc;
    font-family: 'Courier New', Courier, monospace; z-index: 1000001;
    border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 0px; overflow: hidden;
    box-shadow: 0 5px 15px rgba(0,0,0,0.4); backdrop-filter: blur(5px);
    transition: opacity 0.2s; user-select: none;
`;

let isDragging = false,
    dragOffset = { x: 0, y: 0 };
ui.onmousedown = (e) => {
    if (e.target.closest("#ui-header")) {
        isDragging = true;
        dragOffset.x = e.clientX - ui.offsetLeft;
        dragOffset.y = e.clientY - ui.offsetTop;
    }
};
document.onmousemove = (e) => {
    if (isDragging) {
        ui.style.left = e.clientX - dragOffset.x + "px";
        ui.style.top = e.clientY - dragOffset.y + "px";
        ui.style.right = "auto";
    }
};
document.onmouseup = () => (isDragging = false);

const updateUI = () => {
    ui.style.display = settings.visible ? "block" : "none";
    const status = (val) =>
        `<span style="color: ${val ? "#3bb366" : "#cc3d3d"}">${val ? "ON" : "OFF"}</span>`;

    ui.innerHTML = `
        <div id="ui-header" style="padding: 8px; background: rgba(15, 15, 15, 0.7); border-bottom: 1px solid rgba(255, 255, 255, 0.05); cursor: grab; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: 800; font-size: 10px; letter-spacing: 0.8px; opacity: 0.7;">NIGGA CLIENT :3</span>
            <span style="font-size: 8px; opacity: 0.3;">v1.0</span>
        </div>
        <div style="padding: 10px; display: flex; flex-direction: column; gap: 8px;">
            <div style="display: flex; justify-content: space-between; font-size: 9px; opacity: 0.8;"><span>Wireframe [Q]</span> ${status(settings.wireframe)}</div>
            <div style="display: flex; justify-content: space-between; font-size: 9px; opacity: 0.8;"><span>ESP [E]</span> ${status(settings.esp)}</div>
            <div style="display: flex; justify-content: space-between; font-size: 9px; opacity: 0.8;"><span>Mobile [M]</span> ${status(settings.mobile)}</div>
            <div style="display: flex; justify-content: space-between; font-size: 9px; opacity: 0.8;"><span>Dot [O]</span> ${status(settings.dot)}</div>
            
            <div style="margin-top: 1px; padding-top: 6px; border-top: 1px solid rgba(255, 255, 255, 0.03);">
                <div style="display: flex; justify-content: space-between; font-size: 8px; margin-bottom: 3px; color: #777;">
                    <span>VERTICES</span>
                    <span id="vt-val">${settings.vertexThreshold}</span>
                </div>
                <input type="range" id="vt-slider" min="10" max="15000" value="${settings.vertexThreshold}" style="width: 100%; height: 2px; appearance: none; background: #222; outline: none; border-radius: 0px;">
            </div>
        </div>
        <div style="border-top: 1px solid rgba(255, 255, 255, 0.03); padding: 6px 10px; text-align: center; background: rgba(0,0,0,0.1);">
            <div id="profile-toggle" style="color: #2a2a2a; cursor: pointer; font-size: 8px; transition: color 0.2s;">
                <span>levifrsn63</span>
            </div>
            <div id="profile-links" style="display: none; margin-top: 6px; gap: 3px; flex-direction: column;">
                <a href="https://greasyfork.org/en/users/1525503-levifrsn63" target="_blank" style="color: #666; text-decoration: none; font-size: 8px; padding: 3px; border: 1px solid rgba(255,255,255,0.03); background: rgba(255,255,255,0.01);">greasyfork</a>
                <a href="https://github.com/levifrsn63" target="_blank" style="color: #666; text-decoration: none; font-size: 8px; padding: 3px; border: 1px solid rgba(255,255,255,0.03); background: rgba(255,255,255,0.01);">github</a>
            </div>
        </div>
    `;

    const profileToggle = ui.querySelector("#profile-toggle");
    const profileLinks = ui.querySelector("#profile-links");
    profileToggle.onclick = () => {
        profileLinks.style.display =
            profileLinks.style.display === "none" ? "flex" : "none";
        profileToggle.style.color =
            profileLinks.style.display === "none" ? "#2a2a2a" : "#6366f1";
    };

    const slider = ui.querySelector("#vt-slider");
    if (slider) {
        slider.oninput = (e) => {
            settings.vertexThreshold = parseInt(e.target.value);
            const valDisplay = ui.querySelector("#vt-val");
            if (valDisplay) valDisplay.innerText = settings.vertexThreshold;
            saveSettings();
        };
    }
};

let glContext = null;
const checkAutoshoot = () => {
    if (!glContext || !settings.mobile) return;
    const pixels = new Uint8Array(4);
    glContext.readPixels(
        glContext.canvas.width / 2,
        glContext.canvas.height / 2,
        1,
        1,
        glContext.RGBA,
        glContext.UNSIGNED_BYTE,
        pixels,
    );
    if (pixels[0] > 150 && pixels[1] < 100 && pixels[2] < 100) {
        const canvas = glContext.canvas;
        canvas.dispatchEvent(
            new MouseEvent("mousedown", {
                bubbles: true,
                clientX: canvas.width / 2,
                clientY: canvas.height / 2,
            }),
        );
        setTimeout(
            () =>
                canvas.dispatchEvent(
                    new MouseEvent("mouseup", {
                        bubbles: true,
                        clientX: canvas.width / 2,
                        clientY: canvas.height / 2,
                    }),
                ),
            10,
        );
    }
};
setInterval(checkAutoshoot, 30);

HTMLCanvasElement.prototype.getContext = new Proxy(
    HTMLCanvasElement.prototype.getContext,
    {
        apply(target, ctx, args) {
            const res = Reflect.apply(...arguments);
            if ((args[0] === "webgl" || args[0] === "webgl2") && res) {
                glContext = res;
                if (args[1]) args[1].preserveDrawingBuffer = true;
            }
            return res;
        },
    },
);

const drawHandler = {
    apply(target, ctx, args) {
        const program = ctx.getParameter(ctx.CURRENT_PROGRAM);
        if (!program || program.isUIProgram) return Reflect.apply(...arguments);

        const isComplex = args[1] > settings.vertexThreshold;
        if (settings.esp && args[1] > 8000) {
            ctx.disable(ctx.DEPTH_TEST);
            const mode = args[0];
            args[0] = ctx.LINES;
            Reflect.apply(...arguments);
            ctx.enable(ctx.DEPTH_TEST);
            args[0] = mode;
        }
        if (settings.wireframe && isComplex) args[0] = ctx.LINES;
        return Reflect.apply(...arguments);
    },
};

WebGL.drawElements = new Proxy(WebGL.drawElements, drawHandler);
WebGL.drawElementsInstanced = new Proxy(
    WebGL.drawElementsInstanced,
    drawHandler,
);

window.addEventListener("keyup", (e) => {
    if (document.activeElement?.tagName === "INPUT") return;
    const map = {
        KeyQ: "wireframe",
        KeyE: "esp",
        KeyM: "mobile",
        KeyP: "visible",
        KeyO: "dot",
    };
    if (map[e.code]) {
        settings[map[e.code]] = !settings[map[e.code]];
        if (e.code === "KeyM") return location.reload();
        saveSettings();
        updateUI();
        updateDotVisibility();
    }
});

setInterval(() => {
    if (!document.getElementById(ui.id)) document.body.appendChild(ui);
    updateDotVisibility();
}, 1000);

updateUI();
