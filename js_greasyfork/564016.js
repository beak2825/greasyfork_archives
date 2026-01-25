// ==UserScript==
// @name         Dockter Liquid Glass
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Chromium-only: SVG backdrop-filter lens with proper Snell refraction and dynamic sizing. Fixes background misalignment.
// @author       Eitelkeit
// @license      MIT
// @include      *://*:9028/*
// @include      *://*dockter*/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/564016/Dockter%20Liquid%20Glass.user.js
// @updateURL https://update.greasyfork.org/scripts/564016/Dockter%20Liquid%20Glass.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // ===================== 0) 配置开关 =====================
    const INJECT_WALLPAPER = false;
    const WALLPAPER_FALLBACK_URL = "";

    // 需要做玻璃的卡片选择器
    const CARD_SELECTOR = ".dashboard-glass-card, .app-card, .item-card, .search-input, .navigation-sidebar, .navigation-tabs";

    // 特殊处理的选择器（内部有绝对定位子元素，不能使用 overflow:hidden）
    const NAV_SELECTOR = ".navigation-sidebar, .navigation-tabs";

    // 玻璃外观
    const GLASS_STYLE = {
        radius: 26,
        tint: "rgba(18,18,20,0.12)",
        tintHover: "rgba(18,18,20,0.08)",
        border: "rgba(255,255,255,0.20)",
        borderHover: "rgba(255,255,255,0.34)",
        shadow: "0 10px 30px rgba(0,0,0,0.25)",
        innerTop: "rgba(255,255,255,0.18)",
        innerBottom: "rgba(255,255,255,0.08)",
    };

    // 光学参数 - 使用真实的折射物理
    const OPTICS = {
        // 玻璃"厚度"（影响折射位移量）
        glassThickness: 40,
        // 边缘宽度（bezel）
        bezelWidth: 30,
        // 折射率（玻璃约1.5，水约1.33）
        refractiveIndex: 1.5,
        // 采样数
        samples: 128,

        // 动画参数
        lensScale: { default: 1.0, hover: 1.8 },
        blur: { default: 0.15, hover: 0.55 },
        specular: { default: 0.50, hover: 0.90 },

        // 色彩校正
        saturate: 1.20,
        contrast: 1.05,
        brightness: 0.02,

        // 高光方向（左上）
        specularAngle: Math.PI / 3,
    };

    // 动画弹簧参数
    const SPRING = { stiffness: 320, damping: 30, mass: 1 };

    // 性能
    const PERF = {
        dprCap: 1, // Restored: allow high DPI textures (was 1, limiting visual quality)
        resizeDebounce: 10, // Reduced from 100ms for smoother updates
    };

    // ===================== 1) 表面函数 (Surface Functions) =====================
    // Apple Liquid Glass 使用 Squircle 曲线，边缘更柔和

    const SURFACE_FN = {
        // Squircle: Apple 风格，边缘柔和，过渡平滑
        squircle: (x) => Math.pow(1 - Math.pow(1 - x, 4), 1 / 4),
        // 圆形弧：过渡较硬
        circle: (x) => Math.sqrt(1 - (1 - x) ** 2),
        // 凹面
        concave: (x) => 1 - Math.sqrt(1 - (1 - x) ** 2),
    };

    // 当前使用的表面函数
    const currentSurfaceFn = SURFACE_FN.squircle;

    // ===================== 2) Snell 定律折射计算 =====================

    function calculateRefractionProfile(glassThickness, bezelWidth, surfaceFn, refractiveIndex, samples) {
        const eta = 1 / refractiveIndex;

        // 简化折射：假设光线垂直入射 [0, 1]
        function refract(normalX, normalY) {
            const dot = normalY;
            const k = 1 - eta * eta * (1 - dot * dot);
            if (k < 0) return null; // 全内反射
            const kSqrt = Math.sqrt(k);
            return [-(eta * dot + kSqrt) * normalX, eta - (eta * dot + kSqrt) * normalY];
        }

        return Array.from({ length: samples }, (_, i) => {
            const x = i / samples;
            const y = surfaceFn(x);

            // 计算表面法线（通过导数）
            const dx = x < 1 ? 0.0001 : -0.0001;
            const y2 = surfaceFn(x + dx);
            const derivative = (y2 - y) / dx;
            const magnitude = Math.sqrt(derivative * derivative + 1);
            const normal = [-derivative / magnitude, -1 / magnitude];

            const refracted = refract(normal[0], normal[1]);
            if (!refracted) return 0;

            // 计算折射后的位移量
            const remainingHeightOnBezel = y * bezelWidth;
            const remainingHeight = remainingHeightOnBezel + glassThickness;
            return refracted[0] * (remainingHeight / refracted[1]);
        });
    }

    // ===================== 3) 工具函数 =====================

    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

    // ===================== 3.1) 贴图缓存系统 =====================
    // 按尺寸缓存贴图Promise，避免重复生成
    const textureCache = {
        displacement: new Map(), // Map<string, Promise<string>>
        specular: new Map(),     // Map<string, Promise<string>>
        maxSize: 50,
        getKey: (w, h, r, b) => `${Math.round(w)}_${Math.round(h)}_${r}_${b}`,
        prune(cache) {
            if (cache.size > this.maxSize) {
                const firstKey = cache.keys().next().value;
                cache.delete(firstKey);
            }
        }
    };

    // ===================== 3.2) WebGL GPU渲染器 =====================
    // 在GPU上生成置换贴图和高光贴图
    const WebGLRenderer = (() => {
        let gl = null;
        let dispProgram = null;
        let specProgram = null;
        let quadBuffer = null;

        // 顶点着色器 - 简单的全屏四边形
        // 关键修复：翻转Y轴UV，因为Canvas 2D坐标系(0,0在左上)与WebGL纹理坐标(0,0在左下)相反
        // 这确保证了 shader 中的 'y' 逻辑（判断top/bottom）与 CPU 版本一致
        const vertexShaderSource = `#version 300 es
            in vec2 a_position;
            out vec2 v_uv;
            void main() {
                // v_uv.x = 0..1 (Left -> Right)
                // v_uv.y = 1..0 (Top -> Bottom)  <-- Flipped to match Canvas Y-down
                v_uv = vec2(a_position.x * 0.5 + 0.5, 0.5 - a_position.y * 0.5);
                gl_Position = vec4(a_position, 0.0, 1.0);
            }
        `;

        // Dithering function to reduce 8-bit banding
        const ditherFunction = `
            float dither(vec2 position) {
                return (fract(sin(dot(position, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) / 255.0;
            }
        `;

        // 置换贴图片段着色器
        const dispFragmentShaderSource = `#version 300 es
            precision highp float;
            in vec2 v_uv;
            out vec4 fragColor;

            uniform vec2 u_resolution;
            uniform float u_radius;
            uniform float u_bezelWidth;
            uniform float u_maxDisplacement;
            uniform float u_refractionProfile[128];
            uniform int u_samples;

            ${ditherFunction}

            void main() {
                vec2 pixel = v_uv * u_resolution;
                float radius = u_radius;
                float bezel = u_bezelWidth;

                // 计算到四个角的相对坐标
                float x = 0.0, y = 0.0;
                if (pixel.x < radius) {
                    x = pixel.x - radius;
                } else if (pixel.x >= u_resolution.x - radius) {
                    x = pixel.x - (u_resolution.x - radius);
                }
                if (pixel.y < radius) {
                    y = pixel.y - radius;
                } else if (pixel.y >= u_resolution.y - radius) {
                    y = pixel.y - (u_resolution.y - radius);
                }

                float distSq = x * x + y * y;
                float radiusSq = radius * radius;
                float radiusPlusOneSq = (radius + 1.0) * (radius + 1.0);
                float radiusMinusBezelSq = max(0.0, (radius - bezel) * (radius - bezel));

                // 不在bezel区域 -> 中性颜色
                if (distSq > radiusPlusOneSq || distSq < radiusMinusBezelSq) {
                    fragColor = vec4(0.5, 0.5, 0.0, 1.0);
                    return;
                }

                float dist = sqrt(distSq);
                float distFromSide = radius - dist;

                // 抗锯齿
                float opacity = distSq < radiusSq ? 1.0 :
                    1.0 - (dist - sqrt(radiusSq)) / (sqrt(radiusPlusOneSq) - sqrt(radiusSq));

                // 方向向量
                float cosA = x / dist;
                float sinA = y / dist;

                // 从profile查找位移
                int idx = int(clamp(distFromSide / bezel * float(u_samples), 0.0, float(u_samples - 1)));
                float displacement = u_refractionProfile[idx];

                // 归一化位移
                float dX = (-cosA * displacement) / u_maxDisplacement;
                float dY = (-sinA * displacement) / u_maxDisplacement;

                float noise = dither(gl_FragCoord.xy);
                float r = clamp(0.5 + dX * 0.5 * opacity + noise, 0.0, 1.0);
                float g = clamp(0.5 + dY * 0.5 * opacity + noise, 0.0, 1.0);

                fragColor = vec4(r, g, 0.0, 1.0);
            }
        `;

        // 高光贴图片段着色器
        const specFragmentShaderSource = `#version 300 es
            precision highp float;
            in vec2 v_uv;
            out vec4 fragColor;

            uniform vec2 u_resolution;
            uniform float u_radius;
            uniform float u_bezelWidth;
            uniform vec2 u_specularVector;
            uniform float u_dpr;

            ${ditherFunction}

            void main() {
                vec2 pixel = v_uv * u_resolution;
                float radius = u_radius;
                float bezel = u_bezelWidth;

                float x = 0.0, y = 0.0;
                if (pixel.x < radius) {
                    x = pixel.x - radius;
                } else if (pixel.x >= u_resolution.x - radius) {
                    x = pixel.x - (u_resolution.x - radius);
                }
                if (pixel.y < radius) {
                    y = pixel.y - radius;
                } else if (pixel.y >= u_resolution.y - radius) {
                    y = pixel.y - (u_resolution.y - radius);
                }

                float distSq = x * x + y * y;
                float radiusSq = radius * radius;
                float radiusPlusOneSq = (radius + u_dpr) * (radius + u_dpr);
                float radiusMinusBezelSq = max(0.0, (radius - bezel) * (radius - bezel));

                if (distSq > radiusPlusOneSq || distSq < radiusMinusBezelSq) {
                    fragColor = vec4(0.0);
                    return;
                }

                float dist = sqrt(distSq);
                float distFromSide = radius - dist;

                float opacity = distSq < radiusSq ? 1.0 :
                    1.0 - (dist - sqrt(radiusSq)) / (sqrt(radiusPlusOneSq) - sqrt(radiusSq));

                float cosA = x / dist;
                float sinA = -y / dist;

                float dotProduct = abs(cosA * u_specularVector.x + sinA * u_specularVector.y);

                // CPU依靠NaN屏蔽无效值，GPU必须显式检查
                float term = 1.0 - pow(1.0 - distFromSide / u_dpr, 2.0);
                float coefficient = dotProduct * sqrt(max(0.0, term));

                float color = coefficient;
                float finalOpacity = color * coefficient * opacity;

                float noise = dither(gl_FragCoord.xy);
                fragColor = vec4(color + noise, color + noise, color + noise, finalOpacity + noise);
            }
        `;

        function compileShader(source, type) {
            const shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error("Shader compile error:", gl.getShaderInfoLog(shader));
                return null;
            }
            return shader;
        }

        function createProgram(vertSrc, fragSrc) {
            const vert = compileShader(vertSrc, gl.VERTEX_SHADER);
            const frag = compileShader(fragSrc, gl.FRAGMENT_SHADER);
            if (!vert || !frag) return null;

            const program = gl.createProgram();
            gl.attachShader(program, vert);
            gl.attachShader(program, frag);
            gl.linkProgram(program);
            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                console.error("Program link error:", gl.getProgramInfoLog(program));
                return null;
            }
            return program;
        }

        let canvas = null;

        function init() {
            if (gl) return true;

            canvas = document.createElement("canvas");
            gl = canvas.getContext("webgl2", { antialias: false, preserveDrawingBuffer: true });
            if (!gl) {
                console.warn("WebGL2 not supported");
                return false;
            }

            dispProgram = createProgram(vertexShaderSource, dispFragmentShaderSource);
            specProgram = createProgram(vertexShaderSource, specFragmentShaderSource);
            if (!dispProgram || !specProgram) {
                gl = null;
                return false;
            }

            quadBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
                -1, -1, 1, -1, -1, 1,
                -1, 1, 1, -1, 1, 1
            ]), gl.STATIC_DRAW);

            return true;
        }

        function renderDisplacement(width, height, radius, bezelWidth, refractionProfile, maxDisplacement) {
            if (!init()) return null;

            // 复用canvas，调整尺寸
            if (canvas.width !== width || canvas.height !== height) {
                canvas.width = width;
                canvas.height = height;
                gl.viewport(0, 0, width, height);
            }

            gl.useProgram(dispProgram);

            gl.uniform2f(gl.getUniformLocation(dispProgram, "u_resolution"), width, height);
            gl.uniform1f(gl.getUniformLocation(dispProgram, "u_radius"), radius);
            gl.uniform1f(gl.getUniformLocation(dispProgram, "u_bezelWidth"), bezelWidth);
            gl.uniform1f(gl.getUniformLocation(dispProgram, "u_maxDisplacement"), maxDisplacement);
            gl.uniform1i(gl.getUniformLocation(dispProgram, "u_samples"), refractionProfile.length);

            const paddedProfile = new Float32Array(128);
            for (let i = 0; i < Math.min(refractionProfile.length, 128); i++) {
                paddedProfile[i] = refractionProfile[i];
            }
            gl.uniform1fv(gl.getUniformLocation(dispProgram, "u_refractionProfile"), paddedProfile);

            const posLoc = gl.getAttribLocation(dispProgram, "a_position");
            gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
            gl.enableVertexAttribArray(posLoc);
            gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

            gl.clearColor(0.5, 0.5, 0.0, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.drawArrays(gl.TRIANGLES, 0, 6);

            return new Promise(resolve => {
                canvas.toBlob(blob => {
                    resolve(URL.createObjectURL(blob));
                }, 'image/png');
            });
        }

        function renderSpecular(width, height, radius, bezelWidth, specularAngle, dpr) {
            if (!init()) return null;

            if (canvas.width !== width || canvas.height !== height) {
                canvas.width = width;
                canvas.height = height;
                gl.viewport(0, 0, width, height);
            }

            gl.useProgram(specProgram);

            gl.uniform2f(gl.getUniformLocation(specProgram, "u_resolution"), width, height);
            gl.uniform1f(gl.getUniformLocation(specProgram, "u_radius"), radius);
            gl.uniform1f(gl.getUniformLocation(specProgram, "u_bezelWidth"), bezelWidth);
            gl.uniform2f(gl.getUniformLocation(specProgram, "u_specularVector"),
                Math.cos(specularAngle), Math.sin(specularAngle));
            gl.uniform1f(gl.getUniformLocation(specProgram, "u_dpr"), dpr);

            const posLoc = gl.getAttribLocation(specProgram, "a_position");
            gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
            gl.enableVertexAttribArray(posLoc);
            gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

            gl.clearColor(0.0, 0.0, 0.0, 0.0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.drawArrays(gl.TRIANGLES, 0, 6);

            return new Promise(resolve => {
                canvas.toBlob(blob => {
                    resolve(URL.createObjectURL(blob));
                }, 'image/png');
            });
        }

        return { init, renderDisplacement, renderSpecular };
    })();

    class SpringValue {
        constructor(v) {
            this.current = v;
            this.target = v;
            this.velocity = 0;
        }
        set(v) { this.target = v; }
        get() { return this.current; }
        update(dt) {
            if (this.current === this.target && this.velocity === 0) return false;

            const force = (this.target - this.current) * SPRING.stiffness;
            const damp = -this.velocity * SPRING.damping;
            const acc = (force + damp) / SPRING.mass;
            this.velocity += acc * dt;
            this.current += this.velocity * dt;

            const isRest = Math.abs(this.velocity) < 0.05 && Math.abs(this.target - this.current) < 0.05;
            if (isRest) {
                this.current = this.target;
                this.velocity = 0;
                return false;
            }
            return true;
        }
    }

    // ===================== 4) 置换贴图生成 (GPU优先) =====================

    async function generateDisplacementMap(
        width, height, radius, bezelWidth, refractionProfile, maxDisplacement, dpr
    ) {
        // 检查缓存
        const cacheKey = textureCache.getKey(width, height, radius, bezelWidth);
        const cachedPromise = textureCache.displacement.get(cacheKey);
        if (cachedPromise) return cachedPromise;

        const bufferWidth = Math.round(width * dpr);
        const bufferHeight = Math.round(height * dpr);
        const radius_ = radius * dpr;
        const bezel_ = bezelWidth * dpr;

        // 尝试使用WebGL GPU渲染
        // 强制使用GPU，不进行CPU回退
        const gpuPromise = WebGLRenderer.renderDisplacement(
            bufferWidth, bufferHeight, radius_, bezel_,
            refractionProfile, maxDisplacement
        );

        if (gpuPromise) {
            textureCache.displacement.set(cacheKey, gpuPromise);
            textureCache.prune(textureCache.displacement);
            return gpuPromise;
        }

        console.error("Critical: WebGL GPU acceleration failed. Aborting texture generation to prevent CPU stall.");
        return null;
    }

    // ===================== 5) 高光贴图生成 (GPU优先) =====================

    async function generateSpecularMap(width, height, radius, bezelWidth, specularAngle, dpr) {
        // 检查缓存
        const cacheKey = textureCache.getKey(width, height, radius, bezelWidth) + "_spec";
        const cachedPromise = textureCache.specular.get(cacheKey);
        if (cachedPromise) return cachedPromise;

        const bufferWidth = Math.round(width * dpr);
        const bufferHeight = Math.round(height * dpr);
        const radius_ = radius * dpr;
        const bezel_ = bezelWidth * dpr;

        // 尝试使用WebGL GPU渲染
        // 强制使用GPU，不进行CPU回退
        const gpuPromise = WebGLRenderer.renderSpecular(
            bufferWidth, bufferHeight, radius_, bezel_, specularAngle, dpr
        );

        if (gpuPromise) {
            textureCache.specular.set(cacheKey, gpuPromise);
            textureCache.prune(textureCache.specular);
            return gpuPromise;
        }

        console.error("Critical: WebGL GPU acceleration failed. Aborting texture generation to prevent CPU stall.");
        return null;
    }

    // ===================== 6) CSS 注入 =====================

    function injectStyles(wallpaperBgImage) {
        const id = "lg-v20-style";
        if (document.getElementById(id)) return;

        const style = document.createElement("style");
        style.id = id;

        const wallpaperCss = INJECT_WALLPAPER && wallpaperBgImage
            ? `body::before{
                content:"";
                position:fixed; inset:0;
                background-image:${wallpaperBgImage};
                background-size:cover;
                background-position:center center;
                background-attachment:fixed;
                z-index:-99999;
                pointer-events:none;
            }`
            : "";

        style.textContent = `
            ${wallpaperCss}

            .lg-card {
                /* position: relative !important; -> Moved to JS detection */
                overflow: hidden !important;
                border-radius: ${GLASS_STYLE.radius}px !important;
                background: ${GLASS_STYLE.tint} !important;
                border: 1px solid ${GLASS_STYLE.border} !important;
                box-shadow: ${GLASS_STYLE.shadow} !important;
                transform: translateZ(0);
                isolation: isolate;
            }

            .lg-card::after {
                content: "";
                position: absolute; inset: 0;
                pointer-events: none;
                border-radius: inherit;
                box-shadow:
                    inset 0 1px 0 ${GLASS_STYLE.innerTop},
                    inset 0 -1px 0 ${GLASS_STYLE.innerBottom};
            }

            .lg-card:hover {
                background: ${GLASS_STYLE.tintHover} !important;
                border-color: ${GLASS_STYLE.borderHover} !important;
            }

            /* 导航栏特殊样式：不设置 overflow:hidden，允许绝对定位子元素溢出 */
            .lg-card-nav {
                /* position: relative !important; -> Moved to JS detection */
                overflow: visible !important;
                border-radius: ${GLASS_STYLE.radius}px !important;
                background: ${GLASS_STYLE.tint} !important;
                border: 1px solid ${GLASS_STYLE.border} !important;
                box-shadow: ${GLASS_STYLE.shadow} !important;
                transform: translateZ(0);
                isolation: isolate;
            }

            .lg-card-nav::after {
                content: "";
                position: absolute; inset: 0;
                pointer-events: none;
                border-radius: inherit;
                box-shadow:
                    inset 0 1px 0 ${GLASS_STYLE.innerTop},
                    inset 0 -1px 0 ${GLASS_STYLE.innerBottom};
                z-index: -1;
            }

            .lg-card-nav:hover {
                background: ${GLASS_STYLE.tintHover} !important;
                border-color: ${GLASS_STYLE.borderHover} !important;
            }

            /* Fix for Sidebar Issue 2: Force inner content background to transparent */
            .navigation-sidebar__content,
            .navigation-sidebar > div[class*="__content"] {
                background: transparent !important;
            }
        `;
        document.head.appendChild(style);
    }

    // ===================== 7) SVG Filter 管理 =====================

    const SVG_ID = "lg-v20-svg";
    const XLINK = "http://www.w3.org/1999/xlink";

    function ensureSvgRoot() {
        let svg = document.getElementById(SVG_ID);
        if (svg) return svg;

        svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("id", SVG_ID);
        svg.style.cssText = "position:fixed;width:0;height:0;left:-9999px;top:-9999px;";

        const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
        svg.appendChild(defs);
        document.body.appendChild(svg);
        return svg;
    }

    function svgDefs() {
        return ensureSvgRoot().querySelector("defs");
    }

    // 存储每个元素的 filter 状态
    const filterState = new Map();

    function createFilter(filterId, width, height, dispUrl, specUrl, maxDisplacement) {
        const defs = svgDefs();

        // 移除旧的 filter
        const old = document.getElementById(filterId);
        if (old) old.remove();

        const filter = document.createElementNS("http://www.w3.org/2000/svg", "filter");
        filter.setAttribute("id", filterId);
        // 关键修复: 使用 objectBoundingBox，filter 区域自动匹配元素
        // primitiveUnits 使用 userSpaceOnUse，feImage 可以使用绝对像素值
        filter.setAttribute("filterUnits", "objectBoundingBox");
        filter.setAttribute("primitiveUnits", "userSpaceOnUse");
        filter.setAttribute("x", "0%");
        filter.setAttribute("y", "0%");
        filter.setAttribute("width", "100%");
        filter.setAttribute("height", "100%");
        filter.setAttribute("color-interpolation-filters", "sRGB");

        // 置换贴图
        const feDispImg = document.createElementNS("http://www.w3.org/2000/svg", "feImage");
        feDispImg.setAttribute("result", "disp");
        feDispImg.setAttribute("x", "0");
        feDispImg.setAttribute("y", "0");
        feDispImg.setAttribute("width", String(width));
        feDispImg.setAttribute("height", String(height));
        feDispImg.setAttribute("preserveAspectRatio", "none");
        feDispImg.setAttribute("href", dispUrl);
        feDispImg.setAttributeNS(XLINK, "xlink:href", dispUrl);
        filter.appendChild(feDispImg);

        // 高光贴图
        const feSpecImg = document.createElementNS("http://www.w3.org/2000/svg", "feImage");
        feSpecImg.setAttribute("result", "spec");
        feSpecImg.setAttribute("x", "0");
        feSpecImg.setAttribute("y", "0");
        feSpecImg.setAttribute("width", String(width));
        feSpecImg.setAttribute("height", String(height));
        feSpecImg.setAttribute("preserveAspectRatio", "none");
        feSpecImg.setAttribute("href", specUrl);
        feSpecImg.setAttributeNS(XLINK, "xlink:href", specUrl);
        filter.appendChild(feSpecImg);

        // 置换映射
        const feDisp = document.createElementNS("http://www.w3.org/2000/svg", "feDisplacementMap");
        feDisp.setAttribute("in", "SourceGraphic");
        feDisp.setAttribute("in2", "disp");
        feDisp.setAttribute("scale", String(maxDisplacement * OPTICS.lensScale.default));
        feDisp.setAttribute("xChannelSelector", "R");
        feDisp.setAttribute("yChannelSelector", "G");
        feDisp.setAttribute("result", "refr");
        feDisp.setAttribute("id", filterId + "-disp");
        filter.appendChild(feDisp);

        // 饱和度调整
        const feSat = document.createElementNS("http://www.w3.org/2000/svg", "feColorMatrix");
        feSat.setAttribute("in", "refr");
        feSat.setAttribute("type", "saturate");
        feSat.setAttribute("values", String(OPTICS.saturate));
        feSat.setAttribute("result", "sat");
        filter.appendChild(feSat);

        // 对比度/亮度
        const feTone = document.createElementNS("http://www.w3.org/2000/svg", "feComponentTransfer");
        feTone.setAttribute("in", "sat");
        feTone.setAttribute("result", "tone");

        ["R", "G", "B"].forEach(ch => {
            const f = document.createElementNS("http://www.w3.org/2000/svg", "feFunc" + ch);
            f.setAttribute("type", "linear");
            f.setAttribute("slope", String(OPTICS.contrast));
            f.setAttribute("intercept", String(OPTICS.brightness));
            feTone.appendChild(f);
        });
        filter.appendChild(feTone);

        // 高光透明度控制
        const feSpecTransfer = document.createElementNS("http://www.w3.org/2000/svg", "feComponentTransfer");
        feSpecTransfer.setAttribute("in", "spec");
        feSpecTransfer.setAttribute("result", "specA");

        const feFuncA = document.createElementNS("http://www.w3.org/2000/svg", "feFuncA");
        feFuncA.setAttribute("type", "linear");
        feFuncA.setAttribute("slope", String(OPTICS.specular.default));
        feFuncA.setAttribute("id", filterId + "-specA");
        feSpecTransfer.appendChild(feFuncA);
        filter.appendChild(feSpecTransfer);

        // 轻微模糊
        const feBlur = document.createElementNS("http://www.w3.org/2000/svg", "feGaussianBlur");
        feBlur.setAttribute("in", "tone");
        feBlur.setAttribute("stdDeviation", String(OPTICS.blur.default));
        feBlur.setAttribute("result", "toneBlur");
        feBlur.setAttribute("id", filterId + "-blur");
        filter.appendChild(feBlur);

        // 高光叠加
        const feBlend = document.createElementNS("http://www.w3.org/2000/svg", "feBlend");
        feBlend.setAttribute("in", "toneBlur");
        feBlend.setAttribute("in2", "specA");
        feBlend.setAttribute("mode", "screen");
        filter.appendChild(feBlend);

        defs.appendChild(filter);

        return {
            filterNode: filter,
            dispNode: feDisp,
            blurNode: feBlur,
            specFuncNode: feFuncA,
            maxDisplacement,
            springs: null,
        };
    }

    function applyBackdrop(el, filterId) {
        el.style.setProperty("backdrop-filter", `url(#${filterId})`, "important");
        el.style.setProperty("-webkit-backdrop-filter", `url(#${filterId})`, "important");
    }

    // ===================== 8) 全局动画循环 =====================

    let loopRunning = false;

    function wakeUpLoop() {
        if (!loopRunning && document.visibilityState !== "hidden") {
            loopRunning = true;
            requestAnimationFrame(globalTick);
        }
    }

    function globalTick() {
        if (document.visibilityState === "hidden") {
            loopRunning = false;
            return;
        }

        const dt = 1 / 60;
        let anyCardActive = false;

        for (const [id, st] of filterState.entries()) {
            if (!st.springs) continue;

            const sScale = st.springs.scale;
            const sBlur = st.springs.blur;
            const sSpec = st.springs.specular;

            const a = sScale.update(dt);
            const b = sBlur.update(dt);
            const c = sSpec.update(dt);

            if (a || b || c) {
                anyCardActive = true;
                // 仅当数值变化时才更新DOM，避免不必要的重排
                // 性能优化：保留2位小数，减少DOM字符串解析开销
                st.dispNode.setAttribute("scale", (st.maxDisplacement * sScale.get()).toFixed(2));
                st.blurNode.setAttribute("stdDeviation", sBlur.get().toFixed(2));
                st.specFuncNode.setAttribute("slope", sSpec.get().toFixed(2));
            }
        }

        if (anyCardActive) {
            requestAnimationFrame(globalTick);
        } else {
            loopRunning = false;
        }
    }

    // ===================== 9) 元素挂载 =====================

    // ===================== 9) 元素挂载 =====================

    async function attach(el) {
        if (el.dataset.lgAttached === "1") return;

        const rect = el.getBoundingClientRect();
        // Removed strict size check to fix loading issues
        // if (rect.width < 40 || rect.height < 24) return;

        el.dataset.lgAttached = "1";

        // 判断是否为导航栏元素（需要特殊处理）
        const isNavElement = el.matches(NAV_SELECTOR);

        el.classList.add(isNavElement ? "lg-card-nav" : "lg-card");

        // Fix misalignment: only set relative if static
        if (getComputedStyle(el).position === "static") {
            el.style.position = "relative";
        }

        const filterId = "lg-v20-" + Math.random().toString(36).slice(2, 9);
        el.dataset.lgFilterId = filterId;

        const dpr = clamp(window.devicePixelRatio || 1, 1, PERF.dprCap);

        // 生成贴图
        async function generateMaps(width, height) {
            const refractionProfile = calculateRefractionProfile(
                OPTICS.glassThickness,
                OPTICS.bezelWidth,
                currentSurfaceFn,
                OPTICS.refractiveIndex,
                OPTICS.samples
            );
            const maxDisplacement = Math.max(...refractionProfile.map(v => Math.abs(v)));

            const dispUrl = await generateDisplacementMap(
                width, height, GLASS_STYLE.radius, OPTICS.bezelWidth,
                refractionProfile, maxDisplacement, dpr
            );
            const specUrl = await generateSpecularMap(
                width, height, GLASS_STYLE.radius, OPTICS.bezelWidth,
                OPTICS.specularAngle, dpr
            );

            return { dispUrl, specUrl, maxDisplacement };
        }

        let lastWidth = rect.width;
        let lastHeight = rect.height;
        let st = null;

        // 重新生成贴图的函数
        async function regenerate() {
            const currentRect = el.getBoundingClientRect();
            const width = currentRect.width;
            const height = currentRect.height;

            if (width < 10 || height < 10) return;

            lastWidth = width;
            lastHeight = height;

            const maps = await generateMaps(width, height);
            const newSt = createFilter(filterId, width, height, maps.dispUrl, maps.specUrl, maps.maxDisplacement);

            // 保留或初始化动画状态
            if (st && st.springs) {
                newSt.springs = st.springs;
            } else {
                newSt.springs = {
                    scale: new SpringValue(OPTICS.lensScale.default),
                    blur: new SpringValue(OPTICS.blur.default),
                    specular: new SpringValue(OPTICS.specular.default),
                };
            }

            st = newSt;
            filterState.set(filterId, st);
            applyBackdrop(el, filterId);

            // Enforce styles to prevent overriding by active/expanded classes
            el.style.setProperty("background", GLASS_STYLE.tint, "important");
            el.style.setProperty("border-radius", GLASS_STYLE.radius + "px", "important");
            el.style.setProperty("border", "1px solid " + GLASS_STYLE.border, "important");
            el.style.setProperty("box-shadow", GLASS_STYLE.shadow, "important");
        }

        // 初始生成
        regenerate();

        // ResizeObserver: 动态追踪尺寸变化
        let resizeTimeout = null;
        const resizeObserver = new ResizeObserver((entries) => {
            // 防抖
            if (resizeTimeout) clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                for (const entry of entries) {
                    const { width, height } = entry.contentRect;
                    if (Math.abs(width - lastWidth) > 2 || Math.abs(height - lastHeight) > 2) {
                        regenerate();
                    }
                }
            }, PERF.resizeDebounce);
        });
        resizeObserver.observe(el);

        // MutationObserver: 监听类名变化（如 navigation-sidebar--hover-expanded）
        // 当类名变化时，可能伴随尺寸变化，需要延迟重新生成
        // Restore MutationObserver for class changes (Fix Issue 4 & 2)
        // But use minimal delay (10ms) instead of waiting for transition (350ms)
        // This ensures styles are re-enforced immediately when classes change.
        if (isNavElement) {
            let classChangeTimeout = null;
            const classObserver = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    if (mutation.attributeName === "class") {
                        if (classChangeTimeout) clearTimeout(classChangeTimeout);
                        classChangeTimeout = setTimeout(() => {
                            regenerate();
                        }, 10);
                    }
                }
            });
            classObserver.observe(el, { attributes: true, attributeFilter: ["class"] });
        }

        // Hover 处理
        el.addEventListener("mouseenter", () => {
            if (!st || !st.springs) return;
            st.springs.scale.set(OPTICS.lensScale.hover);
            st.springs.blur.set(OPTICS.blur.hover);
            st.springs.specular.set(OPTICS.specular.hover);
            wakeUpLoop();
        });

        el.addEventListener("mouseleave", () => {
            if (!st || !st.springs) return;
            st.springs.scale.set(OPTICS.lensScale.default);
            st.springs.blur.set(OPTICS.blur.default);
            st.springs.specular.set(OPTICS.specular.default);
            wakeUpLoop();
        });
    }

    // ===================== 9.1) 真正的非阻塞异步处理 =====================
    // 使用 setTimeout(0) 链式处理，每批之间让出主线程给浏览器渲染
    let pendingElements = [];
    let isProcessing = false;

    function processBatch() {
        if (pendingElements.length === 0) {
            isProcessing = false;
            return;
        }

        // 高性能CPU：每批处理16个card (Updated for 7800X3D/7900XTX)
        const batchSize = 16;
        const batch = pendingElements.splice(0, batchSize);

        for (const el of batch) {
            if (!el.dataset.lgAttached) {
                attach(el);
            }
        }

        // 使用 setTimeout(0) 让出主线程，允许浏览器渲染
        setTimeout(processBatch, 0);
    }

    function scan() {
        const elements = document.querySelectorAll(CARD_SELECTOR);
        for (const el of elements) {
            if (!el.dataset.lgAttached && !pendingElements.includes(el)) {
                pendingElements.push(el);
            }
        }

        if (!isProcessing && pendingElements.length > 0) {
            isProcessing = true;
            setTimeout(processBatch, 0);
        }
    }

    // ===================== 10) 初始化 =====================

    function getAnyBackgroundImage() {
        const probes = [
            { el: document.body, pseudo: "" },
            { el: document.documentElement, pseudo: "" },
            { el: document.body, pseudo: "::before" },
            { el: document.querySelector("#app"), pseudo: "" },
            { el: document.querySelector(".layout-container"), pseudo: "" },
        ];
        for (const p of probes) {
            if (!p.el) continue;
            const bg = getComputedStyle(p.el, p.pseudo || null).backgroundImage;
            if (bg && bg !== "none") return bg;
        }
        return "";
    }

    function init() {
        let bg = "";
        if (INJECT_WALLPAPER) {
            bg = getAnyBackgroundImage();
            if (!bg && WALLPAPER_FALLBACK_URL) bg = `url("${WALLPAPER_FALLBACK_URL}")`;
        }
        injectStyles(bg);
        ensureSvgRoot();

        // 立即扫描一次
        scan();

        // 延迟扫描：等待页面布局稳定后再次扫描
        // 解决初始加载时某些元素尺寸未稳定的问题
        setTimeout(scan, 100);
        setTimeout(scan, 500);
        setTimeout(scan, 1000);
    }

    // MutationObserver: 自动挂载新元素（带防抖）
    let scanTimeout = null;
    const mo = new MutationObserver(() => {
        if (scanTimeout) clearTimeout(scanTimeout);
        scanTimeout = setTimeout(scan, 50);
    });
    init();
    mo.observe(document.documentElement, { childList: true, subtree: true });

})();