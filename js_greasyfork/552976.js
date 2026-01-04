// ==UserScript==
// @name         UnsafeYT-1.81
// @namespace    unsafe-yt-userscript
// @license MIT
// @version      1.81
// @description  Full port of UnsafeYT content script to Tampermonkey. Automatically toggles ON when a valid token is detected in the video description (first line starts with "token:"). Made By ChatGPT
// @match        https://www.youtube.com/*
// @match        https://m.youtube.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/552976/UnsafeYT-181.user.js
// @updateURL https://update.greasyfork.org/scripts/552976/UnsafeYT-181.meta.js
// ==/UserScript==

/*  =====================================================================================
    SUMMARY
    - Full WebGL (video) + AudioGraph pipeline restored from the extension's content script.
    - Auto-detects tokens in the video's description when the first line begins with "token:".
    - Adds two buttons by the Like/Dislike bar:
        1) Toggle Effects  (transparent bg, white text, outline red=off / green=on)
        2) Enter Token     (transparent bg, white text) — manual prompt
    - Default: OFF. If token auto-detected, the script will automatically enable effects.
    - Large number of comments and clear structure for easy review.
    - Added a custom gain slider (credits goes to ChatGPT for suggesting and contributing to this userscript)
    ===================================================================================== */

(function () {
    "use strict";

    /************************************************************************
     * SECTION A — CONFIG & SHADERS (embedded)
     ************************************************************************/

    // Vertex shader (screen quad) - WebGL2 (#version 300 es)
    const VERT_SHADER_SRC = `#version 300 es
    in vec2 a_position;
    in vec2 a_texCoord;
    out vec2 v_texCoord;
    void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_texCoord = a_texCoord;
    }`;

    // Fragment shader (the decoding/visual effect). This is the original .frag you gave.
    const FRAG_SHADER_SRC = `#version 300 es
    precision highp float;

    in vec2 v_texCoord;
    out vec4 fragColor;

    uniform sampler2D u_sampler;
    uniform sampler2D u_shuffle;

    vec2 getNormal( vec2 uv ){
        vec2 offset = vec2(0.0065,0.0065);
        vec2 center = round((uv+offset)*80.0)/80.0;
        return (center - (uv+offset))*80.0;
    }

    float getAxis( vec2 uv ){
        vec2 normal = getNormal( uv );
        float axis = abs(normal.x) > 0.435 ? 1.0 : 0.0;
        return abs(normal.y) > 0.4 ? 2.0 : axis;
    }

    float getGrid( vec2 uv ){
        float axis = getAxis( uv );
        return axis > 0.0 ? 1.0 : 0.0;
    }

    vec4 getColor( vec2 uv ){
        vec2 shuffle_sample = texture(u_shuffle, uv).rg;
        vec2 base_new_uv = uv + shuffle_sample;

        vec4 c = texture(u_sampler, base_new_uv);
        return vec4(1.0 - c.rgb, c.a);
    }

    vec4 getGridFix( vec2 uv ){
        vec2 normal = getNormal( uv );
        vec4 base = getColor( uv );
        vec4 outline = getColor( uv + normal*0.002 );

        float grid = getGrid( uv );
        return mix(base,outline,grid);
    }

    vec4 getSmoothed( vec2 uv, float power, float slice ){
        vec4 result = vec4(0.0,0.0,0.0,0.0);

        float PI = 3.14159265;
        float TAU = PI*2.0;

        for( float i=0.0; i < 8.0; i++ ){
            float angle = ((i/8.0)*TAU) + (PI/2.0) + slice;
            vec2 normal = vec2(sin(angle),cos(angle)*1.002);

            result += getGridFix( uv + normal*power );
        }

        return result/8.0;
    }

    void main() {
        vec2 uv = vec2(v_texCoord.x, -v_texCoord.y + 1.0);

        float axis = getAxis( uv );
        float grid = axis > 0.0 ? 1.0 : 0.0;

        float slices[3] = float[3](0.0,0.0,3.14159265);

        vec4 main = getGridFix( uv );
        vec4 outline = getSmoothed( uv, 0.001, slices[int(axis)] );

        main = mix(main,outline,grid);

        fragColor = main;
    }`;

    /************************************************************************
     * SECTION B — GLOBAL STATE (clear names)
     ************************************************************************/

    // Token / state
    let currentToken = "";        // the decode token (from description or manual)
    let savedDescription = "";    // last observed description (avoid repeated parsing)
    let isRendering = false;      // whether effects currently active

    // Video / WebGL / Audio objects (reset in cleanup)
    let activeCanvas = null;
    let activeGl = null;
    let activeAudioCtx = null;
    let activeSrcNode = null;
    let activeGainNode = null;
    let activeOutputGainNode = null;
    let activeNotchFilters = [];
    let resizeIntervalId = null;
    let renderFrameId = null;
    let originalVideoContainerStyle = null;
    let resizeCanvasListener = null;
    let currentNode = null;

    // URL tracking (YouTube SPA)
    let currentUrl = location.href.split("&")[0].split("#")[0];

    /************************************************************************
     * SECTION C — SMALL UTILITIES (readable, documented)
     ************************************************************************/

    /**
     * deterministicHash(s, prime, modulus)
     * - Deterministic numeric hash scaled to [0,1)
     * - Used by the shuffle map generator
     */
    function deterministicHash(s, prime = 31, modulus = Math.pow(2, 32)) {
        let h = 0;
        modulus = Math.floor(modulus);
        for (let i = 0; i < s.length; i++) {
            const charCode = s.charCodeAt(i);
            h = (h * prime + charCode) % modulus;
            if (h < 0) h += modulus;
        }
        return h / modulus;
    }

    /**
     * _generateUnshuffleOffsetMapFloat32Array(seedToken, width, height)
     * - Produces a Float32Array of length width*height*2 containing
     *   normalized offsets used by the shader to unshuffle pixels.
     */
    function _generateUnshuffleOffsetMapFloat32Array(seedToken, width, height) {
        if (width <= 0 || height <= 0) {
            throw new Error("Width and height must be positive integers.");
        }
        if (typeof seedToken !== 'string' || seedToken.length === 0) {
            throw new Error("Seed string is required for deterministic generation.");
        }

        const totalPixels = width * height;

        // Two independent deterministic hashes
        const startHash = deterministicHash(seedToken, 31, Math.pow(2, 32) - 1);
        const stepSeed = seedToken + "_step";
        const stepHash = deterministicHash(stepSeed, 37, Math.pow(2, 32) - 2);

        // Angle and increment used to produce per-index pseudo-random numbers
        const startAngle = startHash * Math.PI * 2.0;
        const angleIncrement = stepHash * Math.PI / Math.max(width, height);

        // Generate values and their original index
        const indexedValues = [];
        for (let i = 0; i < totalPixels; i++) {
            const value = Math.sin(startAngle + i * angleIncrement);
            indexedValues.push({ value: value, index: i });
        }

        // Sort by value to create a deterministic 'shuffle' permutation
        indexedValues.sort((a, b) => a.value - b.value);

        // pLinearized maps originalIndex -> shuffledIndex
        const pLinearized = new Array(totalPixels);
        for (let k = 0; k < totalPixels; k++) {
            const originalIndex = indexedValues[k].index;
            const shuffledIndex = k;
            pLinearized[originalIndex] = shuffledIndex;
        }

        // Create the offset map: for each original pixel compute where it should sample from
        const offsetMapFloats = new Float32Array(totalPixels * 2);
        for (let oy = 0; oy < height; oy++) {
            for (let ox = 0; ox < width; ox++) {
                const originalLinearIndex = oy * width + ox;
                const shuffledLinearIndex = pLinearized[originalLinearIndex];

                const sy_shuffled = Math.floor(shuffledLinearIndex / width);
                const sx_shuffled = shuffledLinearIndex % width;

                // offsets normalized relative to texture size (so shader can add to UV)
                const offsetX = (sx_shuffled - ox) / width;
                const offsetY = (sy_shuffled - oy) / height;

                const pixelDataIndex = (oy * width + ox) * 2;
                offsetMapFloats[pixelDataIndex] = offsetX;
                offsetMapFloats[pixelDataIndex + 1] = offsetY;
            }
        }
        return offsetMapFloats;
    }

    /**
     * sleep(ms) — small helper to await timeouts
     */
    function sleep(ms) {
        return new Promise((r) => setTimeout(r, ms));
    }

    /************************************************************************
     * SECTION D — TOKEN DETECTION (strict: first line must start with "token:")
     ************************************************************************/

    /**
     * extractTokenFromText(text)
     * - If text's first line starts with "token:" (case-insensitive), returns token after colon.
     * - Otherwise returns empty string.
     */
    function extractTokenFromText(text) {
        if (!text) return "";
        const trimmed = text.trim();
        const firstLine = trimmed.split(/\r?\n/)[0] || "";
        if (firstLine.toLowerCase().startsWith("token:")) {
            return firstLine.substring(6).trim();
        }
        return "";
    }

/**
 * Robust token finder:
 * - Looks in many known selectors (regular watch + Shorts)
 * - Probes likely shadow-root hosts used by Shorts/reels
 * - Checks JSON-LD <script> tags and meta description
 * - Tries YouTube's initial data objects (if present)
 * - Last-resort: searches page text for a line starting with "token:"
 *
 * Returns the token string (without the "token:" prefix) or "".
 */
function findDescriptionToken() {
    // small helper: if text's first line starts with 'token:' return the part after it
    function extractFromText(text) {
        if (!text) return "";
        // get first non-empty line
        const firstLine = (text + "").trim().split(/\r?\n/)[0] || "";
        if (firstLine.toLowerCase().startsWith("token:")) {
            return firstLine.substring(6).trim();
        }
        return "";
    }

    // 1) Common selectors (watch page + various Shorts/reel selectors)
    const selectors = [
        "#description yt-formatted-string",            // normal watch
        "ytd-video-secondary-info-renderer #description",
        "#meta-contents yt-formatted-string",
        "#meta-contents #description",
        "#description",                                // catch-all
        "ytd-expander #content",
        // Shorts / reels selectors (common variants)
        "#description-inline-expander",
        "ytd-reel-player-overlay-renderer #description",
        "ytd-reel-player-overlay-renderer yt-formatted-string",
        "#shorts-description",
        "ytd-short-video-renderer #description",
        "yt-reel-player-renderer #description"
    ];

    for (const sel of selectors) {
        try {
            const el = document.querySelector(sel);
            if (el) {
                const tok = extractFromText(el.innerText || el.textContent || "");
                if (tok) return tok;
            }
        } catch (e) {
            // ignore selector errors
        }
    }

    // 2) Search inside shadow DOM hosts commonly used by Shorts/reels.
    //    We only probe a short list of likely tag names for performance.
    const shadowHosts = [
        "ytd-reel-player-overlay-renderer",
        "yt-reel-player-renderer",
        "yt-reel-video-renderer",
        "ytd-reel-player-skeleton",
        "ytd-short-video-renderer"
    ];

    for (const tag of shadowHosts) {
        const nodes = document.getElementsByTagName(tag);
        for (const node of nodes) {
            try {
                // some elements expose shadowRoot; others do not — handle both cases
                const root = node.shadowRoot || node;
                if (!root) continue;
                // prefer description-like nodes inside the shadow root
                const cand = root.querySelector('yt-formatted-string, #description, .content, #shorts-description, ytd-expander');
                if (cand) {
                    const tok = extractFromText(cand.innerText || cand.textContent || "");
                    if (tok) return tok;
                }
            } catch (e) {
                // ignore node access errors
            }
        }
    }

    // 3) JSON-LD script blocks (some pages embed description here)
    try {
        const ldScripts = document.querySelectorAll('script[type="application/ld+json"]');
        for (const s of ldScripts) {
            try {
                const obj = JSON.parse(s.textContent || s.innerText || "{}");
                // object may have description at root or inside @graph
                let desc = "";
                if (obj && typeof obj === "object") {
                    if (obj.description) desc = obj.description;
                    else if (Array.isArray(obj["@graph"])) {
                        for (const g of obj["@graph"]) {
                            if (g && g.description) { desc = g.description; break; }
                        }
                    }
                }
                const tok = extractFromText(String(desc || ""));
                if (tok) return tok;
            } catch (e) { /* ignore parse errors */ }
        }
    } catch (e) { /* ignore */ }

    // 4) meta description tag
    try {
        const meta = document.querySelector('meta[name="description"]');
        if (meta && meta.content) {
            const tok = extractFromText(meta.content);
            if (tok) return tok;
        }
    } catch (e) {}

    // 5) Try YouTube-initial-data objects (best-effort)
    try {
        const tryObjects = [
            window.ytInitialPlayerResponse,
            window.ytInitialData,
            (window.ytplayer && window.ytplayer.config && window.ytplayer.config.args) || null,
            (window.ytcfg && window.ytcfg.data) || null
        ];
        for (const obj of tryObjects) {
            if (!obj) continue;
            // common places where description might appear
            const candidates = [
                obj.videoDetails && obj.videoDetails.shortDescription,
                obj.videoDetails && obj.videoDetails.description,
                obj.microformat && obj.microformat.playerMicroformatRenderer && obj.microformat.playerMicroformatRenderer.description,
                obj.metadata && obj.metadata.description
            ];
            for (const c of candidates) {
                if (!c) continue;
                const tok = extractFromText(String(c));
                if (tok) return tok;
            }
        }
    } catch (e) { /* ignore */ }

    // 6) Last resort: quick search through page text for a line that starts with token:
    //    Use a regex to find "token: <non-space>" at start of line. This is broader but used only as fallback.
    try {
        const bodyText = document.body && (document.body.innerText || document.body.textContent || "");
        if (bodyText) {
            const m = bodyText.match(/(?:^|\n)\s*token:\s*(\S+)/i);
            if (m && m[1]) return m[1].trim();
        }
    } catch (e) { /* ignore */ }

    // nothing found
    return "";
}

    /************************************************************************
     * SECTION E — UI (buttons & indicators)
     ************************************************************************/

    /**
     * createControlButtons()
     * - Inserts the Toggle & Enter Token buttons beside the like/dislike controls.
     * - Idempotent: will not duplicate the UI.
     */
    function createControlButtons() {
        // Avoid duplicates
        if (document.querySelector("#unsafeyt-controls")) return;

        // Find the top-level button bar
        const bar = document.querySelector("#top-level-buttons-computed");
        if (!bar) return; // if not found, bail (YouTube layout may differ)

        // Container
        const container = document.createElement("div");
        container.id = "unsafeyt-controls";
        container.style.display = "flex";
        container.style.gap = "8px";
        container.style.alignItems = "center";
        container.style.marginLeft = "12px";

        // Toggle button (transparent, white text, outline shows state)
        const toggle = document.createElement("button");
        toggle.id = "unsafeyt-toggle";
        toggle.type = "button";
        toggle.innerText = "Toggle Effects";
        _styleControlButton(toggle);
        _setToggleOutline(toggle, false); // default OFF

        toggle.addEventListener("click", async () => {
            if (isRendering) {
                // If running, turn off
                removeEffects();
            } else {
                // If not running, and token exists, apply
                if (!currentToken || currentToken.length < 1) {
                    // Ask for manual token entry if none found
                    const manual = prompt("No token auto-detected. Enter token manually:");
                    if (!manual) return;
                    currentToken = manual.trim();
                }
                await applyEffects(currentToken);
            }
        });

        // Manual entry button
        const manual = document.createElement("button");
        manual.id = "unsafeyt-manual";
        manual.type = "button";
        manual.innerText = "Enter Token";
        _styleControlButton(manual);
        manual.style.border = "1px solid rgba(255,255,255,0.2)";

        manual.addEventListener("click", () => {
            const v = prompt("Enter token (first line of description can also be 'token:...'):");
            if (v && v.trim().length > 0) {
                currentToken = v.trim();
                // Auto-enable when manual token entered
                applyEffects(currentToken);
            }
        });

        // Token indicator (small circle shows green if token present)
        const indicator = document.createElement("div");
        indicator.id = "unsafeyt-token-indicator";
        indicator.style.width = "10px";
        indicator.style.height = "10px";
        indicator.style.borderRadius = "50%";
        indicator.style.marginLeft = "6px";
        indicator.style.background = "transparent";
        indicator.title = "Token presence";

        // Gain slider (adjustable output loudness)
        const gainSlider = document.createElement("input");
        gainSlider.id = "unsafeyt-gain";
        gainSlider.type = "range";
        gainSlider.min = "0"; // mute
        gainSlider.max = "1000"; // maximum gain multiplier
        gainSlider.step = "1";
        gainSlider.value = "100"; // roughly +30 dB
        gainSlider.style.width = "100px";
        gainSlider.style.cursor = "pointer";
        gainSlider.title = "Output Gain (Linear ×)";

        const gainLabel = document.createElement("span");
        gainLabel.id = "unsafeyt-gain-label";
        gainLabel.innerText = "Gain: 100× (+40 dB)";
        gainLabel.style.color = "white";
        gainLabel.style.fontSize = "12px";
        gainLabel.style.marginLeft = "6px";

        gainSlider.addEventListener("input", () => {
            const val = parseFloat(gainSlider.value);
            gainLabel.innerText = `Gain: ${val}×`;
            if (window.activeOutputGainNode) {
                window.activeOutputGainNode.gain.value = val;
            }
        });

        container.appendChild(gainSlider);
        container.appendChild(gainLabel);

        // Append and insert
        container.appendChild(toggle);
        container.appendChild(manual);
        container.appendChild(indicator);
        bar.appendChild(container);
    }

    /**
     * _styleControlButton(btn)
     * - Common visual styling for both buttons (transparent bg + white text).
     */
    function _styleControlButton(btn) {
        btn.style.background = "transparent";
        btn.style.color = "white";
        btn.style.padding = "6px 8px";
        btn.style.borderRadius = "6px";
        btn.style.cursor = "pointer";
        btn.style.fontSize = "12px";
        btn.style.fontWeight = "600";
        btn.style.outline = "none";
    }

    /**
     * _setToggleOutline(btn, on)
     * - Visual cue: green outline if ON, red if OFF
     */
    function _setToggleOutline(btn, on) {
        if (!btn) return;
        if (on) {
            btn.style.border = "2px solid rgba(0,200,0,0.95)";
            btn.style.boxShadow = "0 0 8px rgba(0,200,0,0.25)";
        } else {
            btn.style.border = "2px solid rgba(200,0,0,0.95)";
            btn.style.boxShadow = "none";
        }
    }

    /**
     * _updateTokenIndicator(present)
     * - Green dot if a token is detected, transparent otherwise.
     */
    function _updateTokenIndicator(present) {
        const el = document.querySelector("#unsafeyt-token-indicator");
        if (!el) return;
        el.style.background = present ? "limegreen" : "transparent";
    }

    /************************************************************************
     * SECTION F — CLEANUP: removeEffects()
     * - Thorough cleanup of WebGL and Audio states
     ************************************************************************/

    function removeEffects() {
        // If not running, still try to close audio context if open
        if (!isRendering && activeAudioCtx) {
            try {
                activeAudioCtx.close().catch(() => {});
            } catch (e) {}
            activeAudioCtx = null;
        }

        // mark not rendering
        isRendering = false;

        // clear token (original extension cleared token on remove)
        // we keep currentToken so user can re-apply; do not clear currentToken here
        // currentToken = ""; // <-- original extension cleared token; we keep it to allow re-applying

        // remove canvas
        if (activeCanvas) {
            try { activeCanvas.remove(); } catch (e) {}
            activeCanvas = null;
        }

        // clear timers / raf
        if (resizeIntervalId !== null) {
            clearInterval(resizeIntervalId);
            resizeIntervalId = null;
        }
        if (renderFrameId !== null) {
            cancelAnimationFrame(renderFrameId);
            renderFrameId = null;
        }

        // remove resize listener
        if (resizeCanvasListener) {
            window.removeEventListener("resize", resizeCanvasListener);
            resizeCanvasListener = null;
        }

        // lose gl context
        if (activeGl) {
            try {
                const lose = activeGl.getExtension('WEBGL_lose_context');
                if (lose) lose.loseContext();
            } catch (e) {}
            activeGl = null;
        }

        // restore html5 container style
        const html5_video_container = document.getElementsByClassName("html5-video-container")[0];
        if (html5_video_container && originalVideoContainerStyle) {
            try { Object.assign(html5_video_container.style, originalVideoContainerStyle); } catch (e) {}
            originalVideoContainerStyle = null;
        }

        // audio nodes cleanup
        if (activeAudioCtx) {
            const video = document.querySelector(".video-stream");
            if (video && activeSrcNode) {
                try { activeSrcNode.disconnect(); } catch (e) {}
                activeSrcNode = null;
            }
            if (activeGainNode) {
                try { activeGainNode.disconnect(); } catch (e) {}
                activeGainNode = null;
            }
            activeNotchFilters.forEach(filter => {
                try { filter.disconnect(); } catch (e) {}
            });
            activeNotchFilters = [];
            if (activeOutputGainNode) {
                try { activeOutputGainNode.disconnect(); } catch (e) {}
                activeOutputGainNode = null;
            }

            // try closing audio context and reload video to restore default audio routing
            activeAudioCtx.close().then(() => {
                activeAudioCtx = null;
                if (video) {
                    try {
                        const currentSrc = video.src;
                        video.src = '';
                        video.load();
                        video.src = currentSrc;
                        video.load();
                    } catch (e) {}
                }
            }).catch(() => {
                activeAudioCtx = null;
            });
            currentNode = null;
        }

        // update UI to OFF
        _setToggleOutline(document.querySelector("#unsafeyt-toggle"), false);
        _updateTokenIndicator(Boolean(currentToken && currentToken.length > 0));
        console.log("[UnsafeYT] Removed applied effects.");
    }

    /************************************************************************
     * SECTION G — CORE: applyEffects(token)
     * - Sets up WebGL pipeline, creates and uploads shuffle map, starts render loop
     * - Creates AudioContext graph with notch filters and connects to destination
     ************************************************************************/

    async function applyEffects(seedToken) {
        // Prevent double-apply
        if (isRendering) {
            console.log("[UnsafeYT] Effects already running.");
            return;
        }

        // remove any partial state (defensive)
        removeEffects();

        // Validate token
        if (typeof seedToken !== 'string' || seedToken.length < 3) {
            console.warn("[UnsafeYT] Invalid or empty token. Effects will not be applied.");
            return;
        }
        currentToken = seedToken;
        console.log(`[UnsafeYT] Applying effects with token: "${currentToken}"`);

        // Find video & container
        const video = document.getElementsByClassName("video-stream")[0];
        const html5_video_container = document.getElementsByClassName("html5-video-container")[0];

        if (!video || !html5_video_container) {
            console.error("[UnsafeYT] Cannot find video or container elements.");
            return;
        }

        // ensure crossOrigin for texImage2D from video element
        video.crossOrigin = "anonymous";

        /* ---------------------------
           Create overlay canvas and style
           --------------------------- */
        activeCanvas = document.createElement("canvas");
        activeCanvas.id = "unsafeyt-glcanvas";

        // Positioning differs for mobile and desktop
        if (location.href.includes("m.youtube")) {
            Object.assign(activeCanvas.style, {
                position: "absolute",
                top: "0%",
                left: "50%",
                transform: "translateY(0%) translateX(-50%)",
                pointerEvents: "none",
                zIndex: 9999,
                touchAction: "none"
            });
        } else {
            Object.assign(activeCanvas.style, {
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translateY(-50%) translateX(-50%)",
                pointerEvents: "none",
                zIndex: 9999,
                touchAction: "none"
            });
        }

        // Save and change container style so canvas overlays correctly
        if (html5_video_container && !originalVideoContainerStyle) {
            originalVideoContainerStyle = {
                position: html5_video_container.style.position,
                height: html5_video_container.style.height,
            };
        }
        Object.assign(html5_video_container.style, {
            position: "relative",
            height: "100%",
        });
        html5_video_container.appendChild(activeCanvas);

        // Create WebGL2 or fallback WebGL1 context
        activeGl = activeCanvas.getContext("webgl2", { alpha: false }) || activeCanvas.getContext("webgl", { alpha: false });
        if (!activeGl) {
            console.error("[UnsafeYT] WebGL not supported in this browser.");
            removeEffects();
            return;
        }

        // For WebGL1 we may need OES_texture_float to upload floats
        let oesTextureFloatExt = null;
        if (activeGl instanceof WebGLRenderingContext) {
            oesTextureFloatExt = activeGl.getExtension('OES_texture_float');
            if (!oesTextureFloatExt) {
                console.warn("[UnsafeYT] OES_texture_float not available: float textures may not work.");
            }
        }

        /* ---------------------------
           Resize handling
           --------------------------- */
        resizeCanvasListener = () => {
            if (!activeCanvas || !video) return;
            activeCanvas.width = video.offsetWidth || video.videoWidth || 640;
            activeCanvas.height = video.offsetHeight || video.videoHeight || 360;
            if (activeGl) {
                try { activeGl.viewport(0, 0, activeGl.drawingBufferWidth, activeGl.drawingBufferHeight); } catch (e) {}
            }
        };
        window.addEventListener("resize", resizeCanvasListener);
        resizeCanvasListener();
        resizeIntervalId = setInterval(resizeCanvasListener, 2500);

        /* ---------------------------
           Shader compile / program helpers
           --------------------------- */
        function compileShader(type, src) {
            if (!activeGl) return null;
            const shader = activeGl.createShader(type);
            if (!shader) {
                console.error("[UnsafeYT] Failed to create shader.");
                return null;
            }
            activeGl.shaderSource(shader, src);
            activeGl.compileShader(shader);
            if (!activeGl.getShaderParameter(shader, activeGl.COMPILE_STATUS)) {
                console.error("[UnsafeYT] Shader compile error:", activeGl.getShaderInfoLog(shader));
                activeGl.deleteShader(shader);
                return null;
            }
            return shader;
        }

        function createProgram(vsSrc, fsSrc) {
            if (!activeGl) return null;
            const vs = compileShader(activeGl.VERTEX_SHADER, vsSrc);
            const fs = compileShader(activeGl.FRAGMENT_SHADER, fsSrc);
            if (!vs || !fs) {
                console.error("[UnsafeYT] Shader creation failed.");
                return null;
            }
            const program = activeGl.createProgram();
            activeGl.attachShader(program, vs);
            activeGl.attachShader(program, fs);
            activeGl.linkProgram(program);
            if (!activeGl.getProgramParameter(program, activeGl.LINK_STATUS)) {
                console.error("[UnsafeYT] Program link error:", activeGl.getProgramInfoLog(program));
                try { activeGl.deleteProgram(program); } catch (e) {}
                try { activeGl.deleteShader(vs); activeGl.deleteShader(fs); } catch (e) {}
                return null;
            }
            activeGl.useProgram(program);
            try { activeGl.deleteShader(vs); activeGl.deleteShader(fs); } catch (e) {}
            return program;
        }

        /* ---------------------------
           Create/compile program using embedded shaders
           --------------------------- */
        try {
            const program = createProgram(VERT_SHADER_SRC, FRAG_SHADER_SRC);
            if (!program) {
                removeEffects();
                return;
            }

            // Attribute/uniform locations
            const posLoc = activeGl.getAttribLocation(program, "a_position");
            const texLoc = activeGl.getAttribLocation(program, "a_texCoord");
            const videoSamplerLoc = activeGl.getUniformLocation(program, "u_sampler");
            const shuffleSamplerLoc = activeGl.getUniformLocation(program, "u_shuffle");

            // Fullscreen quad (positions + texcoords)
            const quadVerts = new Float32Array([
                -1, -1, 0, 0,
                 1, -1, 1, 0,
                -1,  1, 0, 1,
                -1,  1, 0, 1,
                 1, -1, 1, 0,
                 1,  1, 1, 1,
            ]);

            const buf = activeGl.createBuffer();
            activeGl.bindBuffer(activeGl.ARRAY_BUFFER, buf);
            activeGl.bufferData(activeGl.ARRAY_BUFFER, quadVerts, activeGl.STATIC_DRAW);
            activeGl.enableVertexAttribArray(posLoc);
            activeGl.vertexAttribPointer(posLoc, 2, activeGl.FLOAT, false, 4 * Float32Array.BYTES_PER_ELEMENT, 0);
            activeGl.enableVertexAttribArray(texLoc);
            activeGl.vertexAttribPointer(texLoc, 2, activeGl.FLOAT, false, 4 * Float32Array.BYTES_PER_ELEMENT, 2 * Float32Array.BYTES_PER_ELEMENT);

            // Video texture: we'll update it every frame from the <video> element
            const videoTex = activeGl.createTexture();
            activeGl.bindTexture(activeGl.TEXTURE_2D, videoTex);
            activeGl.texParameteri(activeGl.TEXTURE_2D, activeGl.TEXTURE_WRAP_S, activeGl.CLAMP_TO_EDGE);
            activeGl.texParameteri(activeGl.TEXTURE_2D, activeGl.TEXTURE_WRAP_T, activeGl.CLAMP_TO_EDGE);
            activeGl.texParameteri(activeGl.TEXTURE_2D, activeGl.TEXTURE_MIN_FILTER, activeGl.NEAREST);
            activeGl.texParameteri(activeGl.TEXTURE_2D, activeGl.TEXTURE_MAG_FILTER, activeGl.NEAREST);

            // Generate unshuffle map from token
            let actualSeedToken = currentToken;
            const actualWidthFromPython = 80;  // matches extension
            const actualHeightFromPython = 80;
            let unshuffleMapFloats = null;

            try {
                unshuffleMapFloats = _generateUnshuffleOffsetMapFloat32Array(actualSeedToken, actualWidthFromPython, actualHeightFromPython);
            } catch (err) {
                console.error("[UnsafeYT] Error generating unshuffle map:", err);
                removeEffects();
                return;
            }

            // Create shuffle texture and upload float data (with WebGL2/1 fallbacks)
            const shuffleTex = activeGl.createTexture();
            activeGl.activeTexture(activeGl.TEXTURE1);
            activeGl.bindTexture(activeGl.TEXTURE_2D, shuffleTex);
            activeGl.texParameteri(activeGl.TEXTURE_2D, activeGl.TEXTURE_WRAP_S, activeGl.CLAMP_TO_EDGE);
            activeGl.texParameteri(activeGl.TEXTURE_2D, activeGl.TEXTURE_WRAP_T, activeGl.CLAMP_TO_EDGE);
            activeGl.texParameteri(activeGl.TEXTURE_2D, activeGl.TEXTURE_MIN_FILTER, activeGl.NEAREST);
            activeGl.texParameteri(activeGl.TEXTURE_2D, activeGl.TEXTURE_MAG_FILTER, activeGl.NEAREST);

            // Handle float texture upload: WebGL2 preferred (RG32F), otherwise pack into RGBA float if available
            if (activeGl instanceof WebGL2RenderingContext) {
                // Try RG32F first — some browsers may disallow certain internal formats; fallback handled
                try {
                    activeGl.texImage2D(
                        activeGl.TEXTURE_2D,
                        0,
                        activeGl.RG32F,              // internal format
                        actualWidthFromPython,
                        actualHeightFromPython,
                        0,
                        activeGl.RG,                 // format
                        activeGl.FLOAT,              // type
                        unshuffleMapFloats
                    );
                } catch (e) {
                    // Fall back to packed RGBA32F if RG32F unsupported
                    try {
                        const paddedData = new Float32Array(actualWidthFromPython * actualHeightFromPython * 4);
                        for (let i = 0; i < unshuffleMapFloats.length / 2; i++) {
                            paddedData[i * 4 + 0] = unshuffleMapFloats[i * 2 + 0];
                            paddedData[i * 4 + 1] = unshuffleMapFloats[i * 2 + 1];
                            paddedData[i * 4 + 2] = 0.0;
                            paddedData[i * 4 + 3] = 1.0;
                        }
                        activeGl.texImage2D(
                            activeGl.TEXTURE_2D,
                            0,
                            activeGl.RGBA32F,
                            actualWidthFromPython,
                            actualHeightFromPython,
                            0,
                            activeGl.RGBA,
                            activeGl.FLOAT,
                            paddedData
                        );
                    } catch (e2) {
                        console.error("[UnsafeYT] RG32F and RGBA32F both failed:", e2);
                        removeEffects();
                        return;
                    }
                }
            } else if (oesTextureFloatExt) {
                // WebGL1 with OES_texture_float: upload RGBA float packing
                try {
                    const paddedData = new Float32Array(actualWidthFromPython * actualHeightFromPython * 4);
                    for (let i = 0; i < unshuffleMapFloats.length / 2; i++) {
                        paddedData[i * 4 + 0] = unshuffleMapFloats[i * 2 + 0];
                        paddedData[i * 4 + 1] = unshuffleMapFloats[i * 2 + 1];
                        paddedData[i * 4 + 2] = 0.0;
                        paddedData[i * 4 + 3] = 1.0;
                    }

                    activeGl.texImage2D(
                        activeGl.TEXTURE_2D,
                        0,
                        activeGl.RGBA,
                        actualWidthFromPython,
                        actualHeightFromPython,
                        0,
                        activeGl.RGBA,
                        activeGl.FLOAT,
                        paddedData
                    );
                } catch (e) {
                    console.error("[UnsafeYT] Float RGBA upload failed on WebGL1:", e);
                    removeEffects();
                    return;
                }
            } else {
                console.error("[UnsafeYT] Float textures not supported by this browser's WebGL context.");
                removeEffects();
                return;
            }

            activeGl.clearColor(0.0, 0.0, 0.0, 1.0);

            // Start rendering
            isRendering = true;
            const render = () => {
                if (!isRendering || !activeGl || !video || !activeCanvas) return;

                // Only update texture when video has data
                if (video.readyState >= video.HAVE_CURRENT_DATA) {
                    activeGl.activeTexture(activeGl.TEXTURE0);
                    activeGl.bindTexture(activeGl.TEXTURE_2D, videoTex);
                    try {
                        // Typical texImage2D signature for HTMLVideoElement
                        activeGl.texImage2D(
                            activeGl.TEXTURE_2D,
                            0,
                            activeGl.RGBA,
                            activeGl.RGBA,
                            activeGl.UNSIGNED_BYTE,
                            video
                        );
                    } catch (e) {
                        // Some browsers behave differently; swallow and try to continue (best-effort)
                        try {
                            activeGl.texImage2D(activeGl.TEXTURE_2D, 0, activeGl.RGBA, video.videoWidth, video.videoHeight, 0, activeGl.RGBA, activeGl.UNSIGNED_BYTE, null);
                        } catch (e2) {}
                    }
                    activeGl.uniform1i(videoSamplerLoc, 0);

                    activeGl.activeTexture(activeGl.TEXTURE1);
                    activeGl.bindTexture(activeGl.TEXTURE_2D, shuffleTex);
                    activeGl.uniform1i(shuffleSamplerLoc, 1);

                    activeGl.clear(activeGl.COLOR_BUFFER_BIT);
                    activeGl.drawArrays(activeGl.TRIANGLES, 0, 6);
                }

                renderFrameId = requestAnimationFrame(render);
            };
            render();

        } catch (error) {
            console.error("[UnsafeYT] Error during video effects setup:", error);
            removeEffects();
            return;
        }

        /* ---------------------------
           Audio pipeline (Biquad notch filters & gain)
           --------------------------- */
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) {
                console.error("[UnsafeYT] AudioContext not supported");
            } else {
                if (!activeAudioCtx) activeAudioCtx = new AudioCtx();

                const videoEl = document.querySelector(".video-stream");
                if (videoEl) {
                    // try to create MediaElementSource (can throw if audio is already routed elsewhere)
                    try {
                        if (!activeSrcNode) activeSrcNode = activeAudioCtx.createMediaElementSource(videoEl);
                    } catch (e) {
                        // If this fails we continue without the audio graph (visuals still work)
                        console.warn("[UnsafeYT] createMediaElementSource failed:", e);
                        activeSrcNode = null;
                    }

                    const splitter = activeAudioCtx.createChannelSplitter(2);

                    // Left/right gains -> merge to mono
                    const leftGain = activeAudioCtx.createGain();
                    const rightGain = activeAudioCtx.createGain();
                    leftGain.gain.value = 0.5;
                    rightGain.gain.value = 0.5;

                    const merger = activeAudioCtx.createChannelMerger(1);

                    // Output node that can be manipulated
                    activeOutputGainNode = activeAudioCtx.createGain();
                    activeOutputGainNode.gain.value = 100.0; // original extension value
                    window.activeOutputGainNode = activeOutputGainNode;

                    // Notch filters configuration
                    const filterFrequencies = [200, 440, 6600, 15600, 5000, 6000, 6300, 8000, 10000, 12500, 14000, 15000, 15500, 15900, 16000];
                    const filterEq = [3, 2, 1, 1, 20, 20, 5, 40, 40, 40, 40, 40, 1, 1, 40];
                    const filterCut = [1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1];

                    const numFilters = filterFrequencies.length;
                    activeNotchFilters = [];
                    for (let i = 0; i < numFilters; i++) {
                        const filter = activeAudioCtx.createBiquadFilter();
                        filter.type = "notch";
                        filter.frequency.value = filterFrequencies[i];
                        filter.Q.value = filterEq[i] * 3.5;
                        filter.gain.value = filterCut[i];
                        activeNotchFilters.push(filter);
                    }

                    // Connect audio graph (defensive: catch exceptions)
                    try {
                        if (activeSrcNode) activeSrcNode.connect(splitter);

                        splitter.connect(leftGain, 0);
                        splitter.connect(rightGain, 1);
                        leftGain.connect(merger, 0, 0);
                        rightGain.connect(merger, 0, 0);
                        currentNode = merger;

                        activeGainNode = activeAudioCtx.createGain();
                        activeGainNode.gain.value = 1.0;
                        currentNode = currentNode.connect(activeGainNode);

                        if (activeNotchFilters.length > 0) {
                            currentNode = currentNode.connect(activeNotchFilters[0]);
                            for (let i = 0; i < numFilters - 1; i++) {
                                currentNode = currentNode.connect(activeNotchFilters[i + 1]);
                            }
                            currentNode.connect(activeOutputGainNode);
                        } else {
                            currentNode.connect(activeOutputGainNode);
                        }
                        activeOutputGainNode.connect(activeAudioCtx.destination);
                    } catch (e) {
                        console.warn("[UnsafeYT] Audio graph connection issue:", e);
                    }

                    // Resume/suspend audio context on play/pause
                    const handleAudioState = async () => {
                        if (!activeAudioCtx || activeAudioCtx.state === 'closed') return;
                        if (videoEl.paused) {
                            if (activeAudioCtx.state === 'running') activeAudioCtx.suspend().catch(() => {});
                        } else {
                            if (activeAudioCtx.state === 'suspended') activeAudioCtx.resume().catch(() => {});
                        }
                    };

                    videoEl.addEventListener("play", handleAudioState);
                    videoEl.addEventListener("pause", handleAudioState);
                    if (!videoEl.paused) handleAudioState();
                } else {
                    console.error("[UnsafeYT] Video element not found for audio effects.");
                }
            }
        } catch (e) {
            console.warn("[UnsafeYT] Audio initialization error:", e);
        }

        // Update UI and indicators to ON
        _setToggleOutline(document.querySelector("#unsafeyt-toggle"), true);
        _updateTokenIndicator(true);
        console.log("[UnsafeYT] Effects applied.");
    } // end applyEffects

    /************************************************************************
     * SECTION H — Initialization / Observers / Auto-apply logic
     ************************************************************************/

    /**
     * mainMutationObserver
     * - Keeps watching the DOM for description changes and ensures buttons exist.
     * - Auto-detects token and auto-enables effects only when token is found (and only if effects are not already running).
     */
    const mainMutationObserver = new MutationObserver(async (mutations) => {
        // Ensure UI present
        createControlButtons();

        // Attempt token detection
        try {
            const token = findDescriptionToken();
            if (token && token !== currentToken) {
                // New token discovered
                currentToken = token;
                _updateTokenIndicator(true);
                console.log("[UnsafeYT] Auto-detected token:", currentToken);

                // Auto-enable if not already running
                if (!isRendering) {
                    await applyEffects(currentToken);
                }
            } else if (!token) {
                _updateTokenIndicator(false);
            }
        } catch (e) {
            console.warn("[UnsafeYT] Token detection error:", e);
        }
    });

    // Start observing
    mainMutationObserver.observe(document.body, { childList: true, subtree: true });

    /**
     * URL change detection (YouTube SPA navigation)
     * - When URL changes, cleanup and reset UI state (do NOT persist 'on' state unless the new video also has token)
     */
    setInterval(() => {
        const toCheck = location.href.split("&")[0].split("#")[0];
        if (toCheck !== currentUrl) {
            currentUrl = toCheck;
            // Remove any active effects and recreate the UI after navigation
            removeEffects();
            setTimeout(createControlButtons, 600);
        }
    }, 600);

    /**
     * Video-play watchdog:
     * - If video starts playing and toggle is visually ON but effects aren't running (rare race), try to reapply automatically.
     */
    setInterval(async () => {
        const video = document.querySelector(".video-stream");
        const toggle = document.querySelector("#unsafeyt-toggle");
        const toggleShowsOn = toggle && toggle.style.border && toggle.style.border.includes("rgba(0,200,0");
        if (video && !video.paused && !isRendering && toggleShowsOn) {
            if (currentToken && currentToken.length > 0) {
                await applyEffects(currentToken);
            }
        }
    }, 500);

    // Create initial UI (if available) and attempt initial token detection
    setTimeout(() => {
        createControlButtons();
        // initial detection attempt
        const tok = findDescriptionToken();
        if (tok) {
            currentToken = tok;
            _updateTokenIndicator(true);
            // Auto-apply (per request): if token found we enable automatically
            applyEffects(currentToken);
        }
    }, 1200);

    /************************************************************************
     * END — helpful console message
     ************************************************************************/
    console.log("[UnsafeYT] Userscript loaded. Buttons will appear near Like/Dislike when a video page is ready. Token detection will auto-apply if 'token:' is found as the first line of the description.");

})();