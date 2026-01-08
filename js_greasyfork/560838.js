// ==UserScript==
// @name         NIGGA CLIENT
// @description  Cheat client for Deadshot.io
// @author       levifrsn63
// @match        *://*deadshot.io/*
// @license      Nigga University
// @run-at       document-start
// @version      1.67
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
        dotColor: "#ff0000",
        dotSize: 6,
        rgbDot: false,
        firstUse: true,
    };
    try {
        return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
    } catch (e) {
        return defaults;
    }
};

const settings = loadSettings();

const showWelcomePopup = () => {
    const popup = document.createElement("div");
    popup.style.cssText = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        width: 350px; background: rgba(15, 15, 15, 0.95); color: #fff;
        padding: 25px; border-radius: 12px; z-index: 2000000;
        font-family: 'Segoe UI', sans-serif; border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 20px 50px rgba(0,0,0,0.8); backdrop-filter: blur(15px);
        text-align: center;
    `;
    popup.innerHTML = `
        <h2 style="margin-top: 0; color: #6366f1; font-size: 20px;">NIGGA CLIENT</h2>
        <div style="text-align: left; font-size: 13px; line-height: 1.4; color: #ccc;">
            <p style="margin-bottom: 10px;">A powerful cheat client for Deadshot.io featuring rendering modifications and device spoofing.</p>

            <div style="background: rgba(255,255,255,0.05); padding: 12px; border-radius: 8px; margin-bottom: 15px;">
                <h3 style="margin: 0 0 8px 0; font-size: 14px; color: #6366f1; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 4px;">Controls</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
                    <div style="opacity: 0.8;"><b>[Q]</b> Wireframe</div>
                    <div style="opacity: 0.8;"><b>[E]</b> ESP (Walls)</div>
                    <div style="opacity: 0.8;"><b>[M]</b> Mobile Mode</div>
                    <div style="opacity: 0.8;"><b>[O]</b> Crosshair Dot</div>
                </div>
                <div style="margin-top: 10px; padding: 8px; background: rgba(99, 102, 241, 0.2); border: 1px solid rgba(99, 102, 241, 0.4); border-radius: 4px; text-align: center;">
                    <b style="color: #818cf8; font-size: 14px;">[P] Show / Hide Menu</b>
                </div>
            </div>

            <p style="font-size: 11px; line-height: 1.4; color: #888; background: rgba(0,0,0,0.2); padding: 8px; border-radius: 6px; border-left: 3px solid #444;">
                <b>Note:</b> ESP is limited. Since WebGL games are precompiled, we primarily use vertex-based wireframe extraction for visibility through walls.
            </p>
        </div>
        <button id="close-welcome" style="margin-top: 15px; width: 100%; padding: 12px; background: #6366f1; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 14px; transition: all 0.2s;">
            I Understand
        </button>
    `;
    document.body.appendChild(popup);

    document.getElementById("close-welcome").onclick = () => {
        popup.remove();
        settings.firstUse = false;
        saveSettings();
    };

    // Increment counter API
    fetch("https://api.counterapi.dev/v2/levis-team-2416/nigga-client142/up", {
        headers: {
            "Authorization": "Bearer ut_wzmwKqBRV8B5vA241hjxEGnxX9ifiSPoODgJ4Znd"
        }
    }).catch(err => console.error("Counter API failed", err));
};

if (settings.firstUse) {
    const checkReady = setInterval(() => {
        if (document.body) {
            clearInterval(checkReady);
            showWelcomePopup();
        }
    }, 100);
}
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
        position: fixed; left: 50%; top: 50%;
        width: ${settings.dotSize}px; height: ${settings.dotSize}px; border-radius: 50%; z-index: 1000000;
        transform: translate(-50%, -50%); background: ${settings.rgbDot ? "none" : settings.dotColor};
        animation: ${settings.rgbDot ? "rgbRotate 3s linear infinite" : "none"};
        pointer-events: none; border: 1px solid rgba(0,0,0,0.5);
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
        position: fixed; top: 15px; right: 15px; width: 190px;
        background: rgba(10, 10, 10, 0.85); color: #efefef;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; z-index: 1000001;
        border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; overflow: hidden;
        box-shadow: 0 8px 32px rgba(0,0,0,0.5); backdrop-filter: blur(10px);
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
        <div id="ui-header" style="padding: 10px; background: rgba(30, 30, 30, 0.8); border-bottom: 1px solid rgba(255, 255, 255, 0.1); cursor: grab; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: 800; font-size: 11px; letter-spacing: 1px; color: #fff;">NIGGA CLIENT</span>
            <span style="font-size: 9px; opacity: 0.5;">v1.5</span>
        </div>
        <div style="padding: 12px; display: flex; flex-direction: column; gap: 10px;">
            <div id="toggle-wireframe" style="display: flex; justify-content: space-between; font-size: 11px; cursor: pointer;"><span>Wireframe [Q]</span> ${status(settings.wireframe)}</div>
            <div id="toggle-esp" style="display: flex; justify-content: space-between; font-size: 11px; cursor: pointer;"><span>ESP [E]</span> ${status(settings.esp)}</div>
            <div id="toggle-mobile" style="display: flex; justify-content: space-between; font-size: 11px; cursor: pointer;"><span>Mobile [M]</span> ${status(settings.mobile)}</div>
            <div id="toggle-dot" style="display: flex; justify-content: space-between; font-size: 11px; cursor: pointer;"><span>Dot [O]</span> ${status(settings.dot)}</div>
            <div id="toggle-rgb-dot" style="display: flex; justify-content: space-between; font-size: 11px; cursor: pointer;"><span>RGB Dot</span> ${status(settings.rgbDot)}</div>

            <div style="margin-top: 4px; padding-top: 8px; border-top: 1px solid rgba(255, 255, 255, 0.05);">
                <div style="display: flex; justify-content: space-between; font-size: 10px; margin-bottom: 5px; color: #aaa;">
                    <span>VERTICES</span>
                    <span id="vt-val" style="color: #fff;">${settings.vertexThreshold}</span>
                </div>
                <input type="range" id="vt-slider" min="10" max="15000" value="${settings.vertexThreshold}" style="width: 100%; height: 4px; appearance: none; background: #333; outline: none; border-radius: 2px;">
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 10px; color: #aaa;">
                <span>DOT COLOR</span>
                <input type="color" id="dot-color" value="${settings.dotColor}" style="border: none; width: 20px; height: 20px; background: none; cursor: pointer;">
            </div>
            <div style="margin-top: 2px;">
                <div style="display: flex; justify-content: space-between; font-size: 10px; margin-bottom: 5px; color: #aaa;">
                    <span>DOT SIZE</span>
                    <span id="ds-val" style="color: #fff;">${settings.dotSize}px</span>
                </div>
                <input type="range" id="ds-slider" min="1" max="20" value="${settings.dotSize}" style="width: 100%; height: 4px; appearance: none; background: #333; outline: none; border-radius: 2px;">
            </div>
        </div>
        <div style="border-top: 1px solid rgba(255, 255, 255, 0.05); padding: 8px 12px; text-align: center; background: rgba(0,0,0,0.2);">
            <div id="profile-toggle" style="color: #6366f1; cursor: pointer; font-size: 10px; font-weight: bold;">
                <span>levifrsn63</span>
            </div>
            <div id="profile-links" style="display: none; margin-top: 8px; gap: 5px; flex-direction: column;">
                <a href="https://greasyfork.org/en/users/1525503-levifrsn63" target="_blank" style="color: #bbb; text-decoration: none; font-size: 9px; padding: 5px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05); border-radius: 4px;">greasyfork</a>
                <a href="https://github.com/levifrsn63" target="_blank" style="color: #bbb; text-decoration: none; font-size: 9px; padding: 5px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05); border-radius: 4px;">github</a>
            </div>
        </div>
    `;

    const profileToggle = ui.querySelector("#profile-toggle");
    const profileLinks = ui.querySelector("#profile-links");
    profileToggle.onclick = () => {
        profileLinks.style.display =
            profileLinks.style.display === "none" ? "flex" : "none";
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

    const dotColorPicker = ui.querySelector("#dot-color");
    if (dotColorPicker) {
        dotColorPicker.oninput = (e) => {
            settings.dotColor = e.target.value;
            saveSettings();
            const dot = document.getElementById("NIGGA-client-dot");
            if (dot) dot.style.background = settings.dotColor;
        };
    }

    const dotSizeSlider = ui.querySelector("#ds-slider");
    if (dotSizeSlider) {
        dotSizeSlider.oninput = (e) => {
            settings.dotSize = parseInt(e.target.value);
            const valDisplay = ui.querySelector("#ds-val");
            if (valDisplay) valDisplay.innerText = settings.dotSize + "px";
            saveSettings();
            const dot = document.getElementById("NIGGA-client-dot");
            if (dot) {
                dot.style.width = settings.dotSize + "px";
                dot.style.height = settings.dotSize + "px";
            }
        };
    }

    ui.querySelector("#toggle-wireframe").onclick = () => {
        settings.wireframe = !settings.wireframe;
        saveSettings();
        updateUI();
    };
    ui.querySelector("#toggle-esp").onclick = () => {
        settings.esp = !settings.esp;
        saveSettings();
        updateUI();
    };
    ui.querySelector("#toggle-mobile").onclick = () => {
        settings.mobile = !settings.mobile;
        saveSettings();
        location.reload();
    };
    ui.querySelector("#toggle-dot").onclick = () => {
        settings.dot = !settings.dot;
        saveSettings();
        updateUI();
        updateDotVisibility();
    };
    ui.querySelector("#toggle-rgb-dot").onclick = () => {
        settings.rgbDot = !settings.rgbDot;
        saveSettings();
        updateUI();
        const dot = document.getElementById("NIGGA-client-dot");
        if (dot) {
            dot.style.background = settings.rgbDot ? "none" : settings.dotColor;
            dot.style.animation = settings.rgbDot ? "rgbRotate 3s linear infinite" : "none";
        }
    };
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
        saveSettings();
        if (e.code === "KeyM") return location.reload();
        updateUI();
        updateDotVisibility();
    }
});

setInterval(() => {
    if (!document.getElementById(ui.id)) document.body.appendChild(ui);
    updateDotVisibility();
}, 1000);

updateUI();
