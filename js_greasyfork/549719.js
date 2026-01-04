// ==UserScript==
// @name                UnsafeYT Decoder
// @author              ElectroKnight22
// @namespace           unsafe-yt-decoder-namespace
// @version             1.2.0
// @match               https://www.youtube.com/*
// @match               https://m.youtube.com/*
// @match               *://www.youtube-nocookie.com/*
// @exclude             *://www.youtube.com/live_chat*
// @require             https://update.greasyfork.org/scripts/549881/1702524/YouTube%20Helper%20API.js
// @grant               none
// @run-at              document-idle
// @inject-into         page
// @license             MIT
// @description         Processes scrambled YouTube videos back into a human understandable format using a token. Optimized and fully working. Decodes hover previews and embedded videos. Includes an aggressive audio compressor to limit loud noises.
// @downloadURL https://update.greasyfork.org/scripts/549719/UnsafeYT%20Decoder.user.js
// @updateURL https://update.greasyfork.org/scripts/549719/UnsafeYT%20Decoder.meta.js
// ==/UserScript==

/*jshint esversion: 11 */
/* global youtubeHelperApi */

(function () {
    'use strict';

    const api = youtubeHelperApi;
    if (!api) return console.error('Helper API not found. Likely incompatible script manager or extension settings.');

    const SCREEN_SHADERS = {
        VERTEX: `#version 300 es

            in vec2 a_position;
            in vec2 a_texCoord;

            out vec2 v_texCoord;

            void main() {
                gl_Position = vec4(a_position, 0.0, 1.0);
                v_texCoord = a_texCoord;
            }
        `,
        FRAGMENT: `#version 300 es
            precision highp float;

            in vec2 v_texCoord;
            out vec4 fragColor;

            uniform sampler2D u_sampler;
            uniform sampler2D u_shuffle;

            const float PI = 3.14159265359;

            vec4 getColor(vec2 uv) {
                vec2 uv_clamped = clamp(uv, 0.0, 1.0);
                vec2 shuffle_sample = texture(u_shuffle, uv_clamped).rg;
                vec2 final_sample_pos = uv + shuffle_sample;
                vec4 c = texture(u_sampler, final_sample_pos);
                return vec4(1.0 - c.rgb, c.a);
            }

            vec2 getNormal(vec2 uv) {
                vec2 offset = vec2(0.0065);
                vec2 cell_center = round((uv + offset) * 80.0) / 80.0;
                return (cell_center - (uv + offset)) * 80.0;
            }

            float getAxis(vec2 uv) {
                vec2 normal = getNormal(uv);
                float axisX = abs(normal.x) > 0.435 ? 1.0 : 0.0;
                return abs(normal.y) > 0.4 ? 2.0 : axisX;
            }

            float getGrid(vec2 uv) {
                return getAxis(uv) > 0.0 ? 1.0 : 0.0;
            }

            vec4 getGridFix(vec2 uv) {
                vec2 normal = getNormal(uv);
                vec4 baseColor = getColor(uv);
                vec4 offsetColor = getColor(uv + normal * 0.002);
                float gridAmount = getGrid(uv);
                return mix(baseColor, offsetColor, gridAmount);
            }

            vec4 getSmoothed(vec2 uv, float power, float slice) {
                vec4 totalColor = vec4(0.0);
                float totalWeight = 0.0;
                const float sigma = 0.45;
                const int sampleCount = 16;

                vec2 samples[16] = vec2[](
                    vec2(-.326, -.405), vec2(-.840, -.073), vec2(-.695, .457), vec2(-.203, .620),
                    vec2(.962, -.194), vec2(.473, -.480), vec2(.519, .767), vec2(.185, -.893),
                    vec2(.507, .064), vec2(.896, .412), vec2(-.321, .932), vec2(-.791, -.597),
                    vec2(.089, .290), vec2(.354, -.215), vec2(-.825, .223), vec2(-.913, -.281)
                );

                for (int i = 0; i < sampleCount; i++) {
                    vec2 offset = samples[i] * power;
                    float dist = length(samples[i]);
                    float weight = exp(-(dist * dist) / (2.0 * sigma * sigma));

                    totalColor += getGridFix(uv + offset) * weight;
                    totalWeight += weight;
                }

                return totalColor / totalWeight;
            }

            void main() {
                vec2 uv = vec2(v_texCoord.x, 1.0 - v_texCoord.y);

                float axis = getAxis(uv);
                float grid = axis > 0.0 ? 1.0 : 0.0;

                float s[3] = float[3](0.0, 0.0, PI);

                vec4 baseColor = getGridFix(uv);
                vec4 smoothedColor = getSmoothed(uv, 0.0008, s[int(axis)]);

                vec4 finalColor = mix(baseColor, smoothedColor, grid);

                fragColor = finalColor;
            }
        `,
    };

    const initialAudioState = Object.freeze({
        context: null,
        sourceNode: null,
        unprocessedAudioGainNode: null,
        processedAudioGainNode: null,
        gainNode: null,
        compressor: null,
        outputGainNode: null,
        notchFilters: [],
    });

    const initialAppState = Object.freeze({
        token: '',
        isRendering: false,
        canvas: null,
        webGlContext: null,
        shuffleTexture: null,
        renderLoop: () => {},
        audio: { ...initialAudioState },
        renderFrameId: null,
        originalContainerStyle: null,
        resizeObserver: null,
        listenerController: null,
        videoElement: null,
        playerContainer: null,
    });
    let appState = { ...initialAppState };
    let isApplyingEffects = false;

    const persistentAudio = {
        context: null,
        sourceNodeCache: new WeakMap(),
    };

    const UI_CACHE = {
        toggle: null,
        manual: null,
    };

    const mutationObserver = {
        topLevelButtonsGroup: null,
    };

    let userscriptHTMLPolicy = null;
    function createTrustedHTML(htmlString) {
        if (window.trustedTypes && window.trustedTypes.createPolicy) {
            if (!userscriptHTMLPolicy) {
                userscriptHTMLPolicy = window.trustedTypes.createPolicy('userscript-html-policy', { createHTML: (s) => s });
            }
            return userscriptHTMLPolicy.createHTML(htmlString);
        }
        return htmlString;
    }

    function injectUiStyles() {
        if (document.getElementById('unsafeyt-styles')) return;
        const STYLES = `
            #unsafeyt-toggle {
                border: 2px solid rgba(200, 0, 0, 0.95);
            }

            #unsafeyt-toggle.active {
                border-color: rgba(0, 200, 0, 0.95);
            }
        `;
        const styleSheet = document.createElement('style');
        styleSheet.id = 'unsafeyt-styles';
        styleSheet.innerHTML = createTrustedHTML(STYLES);
        document.head.appendChild(styleSheet);
    }

    function getDeterministicHash(inputString, prime = 31, modulus = Math.pow(2, 32)) {
        let hash = 0;
        modulus = Math.floor(modulus);
        for (let i = 0; i < inputString.length; i++) {
            const charCode = inputString.charCodeAt(i);
            hash = (hash * prime + charCode) % modulus;
            if (hash < 0) {
                hash += modulus;
            }
        }
        return hash / modulus;
    }

    function _generateUnshuffleOffsetMapFloat32Array(seedToken, width, height) {
        if (!seedToken || width <= 0 || height <= 0) {
            throw new Error('Invalid params for unshuffle map.');
        }
        const totalPixels = width * height;
        const startHash = getDeterministicHash(seedToken, 31, 2 ** 32 - 1);
        const stepHash = getDeterministicHash(seedToken + '_step', 37, 2 ** 32 - 2);
        const startAngle = startHash * Math.PI * 2.0;
        const angleIncrement = (stepHash * Math.PI) / Math.max(width, height);
        const indexedValues = Array.from({ length: totalPixels }, (_, index) => ({
            value: Math.sin(startAngle + index * angleIncrement),
            index: index,
        }));
        indexedValues.sort((itemA, itemB) => itemA.value - itemB.value);
        const permutationArray = new Array(totalPixels);
        for (let index = 0; index < totalPixels; index++) {
            permutationArray[indexedValues[index].index] = index;
        }
        const offsetMapFloats = new Float32Array(totalPixels * 2);
        for (let originalY = 0; originalY < height; originalY++) {
            for (let originalX = 0; originalX < width; originalX++) {
                const originalLinearIndex = originalY * width + originalX;
                const shuffledLinearIndex = permutationArray[originalLinearIndex];
                const shuffledY = Math.floor(shuffledLinearIndex / width);
                const shuffledX = shuffledLinearIndex % width;
                const offsetX = (shuffledX - originalX) / width;
                const offsetY = (shuffledY - originalY) / height;
                const pixelDataIndex = (originalY * width + originalX) * 2;
                offsetMapFloats[pixelDataIndex] = offsetX;
                offsetMapFloats[pixelDataIndex + 1] = offsetY;
            }
        }
        return offsetMapFloats;
    }

    function extractTokenFromText(text) {
        try {
            if (!text) return '';
            const trimmed = text.trim();
            const firstLine = trimmed.split(/\r?\n/)[0] || '';
            const keyMarkers = ['token:', 'key:'];
            let key = '';
            keyMarkers.forEach((marker) => {
                if (firstLine.toLowerCase().startsWith(marker)) {
                    key = firstLine.substring(marker.length).trim();
                    return;
                }
            });

            return key;
        } catch (error) {
            console.error('[UnsafeYT] Token extraction error:', error);
            return '';
        }
    }

    async function _handleManualTokenInput() {
        const userInput = prompt("Enter token (first line of description can also be 'token:...' or 'key:...'):")?.trim();
        if (!userInput) return;
        try {
            await applyEffects(userInput);
        } catch (error) {
            console.error('[UnsafeYT] Manual token apply failed:', error);
        }
    }

    function tryCreateControlButtons() {
        if (api.page.isIframe) return;
        const uiSelectorId = '.unsafeyt-button';
        const topLevelButtonsGroupSelector = 'ytd-watch-metadata #top-level-buttons-computed';
        const topLevelButtonsGroup = {
            get() {
                this.element = document.querySelector(topLevelButtonsGroupSelector);
                return this.element;
            },
            element: null,
        };
        const _cleanupObserver = () => {
            if (mutationObserver.topLevelButtonsGroup) {
                mutationObserver.topLevelButtonsGroup.disconnect();
                mutationObserver.topLevelButtonsGroup = null;
            }
        };
        if (api.page.type !== 'watch') {
            document.querySelectorAll(uiSelectorId)?.forEach((element) => {
                element.remove();
            });
            _cleanupObserver();
            return;
        }
        const _handleControlButtonCreation = () => {
            if (!topLevelButtonsGroup.get() || !topLevelButtonsGroup.element.children[0]) return;
            _cleanupObserver();
            if (topLevelButtonsGroup.element.querySelector(uiSelectorId)) return;

            try {
                const backupClassList =
                    'yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-leading yt-spec-button-shape-next--enable-backdrop-filter-experiment';
                const youtubeButtonClassList =
                    document.querySelector('yt-button-view-model button')?.classList || backupClassList.split(' ');

                const manualButton = document.createElement('button');
                UI_CACHE.manual = manualButton;
                manualButton.id = 'unsafeyt-manual';
                manualButton.type = 'button';
                manualButton.className = 'unsafeyt-button';
                manualButton.classList.add(...youtubeButtonClassList);
                manualButton.textContent = 'Enter Token';
                manualButton.addEventListener('click', _handleManualTokenInput);
                topLevelButtonsGroup.element.insertBefore(manualButton, topLevelButtonsGroup.element.firstChild);

                const toggleButton = document.createElement('button');
                UI_CACHE.toggle = toggleButton;
                toggleButton.id = 'unsafeyt-toggle';
                toggleButton.type = 'button';
                toggleButton.className = 'unsafeyt-button';
                toggleButton.classList.add(...youtubeButtonClassList);
                topLevelButtonsGroup.element.insertBefore(toggleButton, topLevelButtonsGroup.element.firstChild);

                toggleButton.addEventListener('click', async () => {
                    appState.isRendering ? removeEffects(false) : await applyEffects(appState.token);
                    updateUIState();
                });

                const topLevelButtons = topLevelButtonsGroup.element.childNodes;
                const marginToUse = window.getComputedStyle(topLevelButtons[topLevelButtons.length - 1])?.marginLeft ?? '8px';
                topLevelButtons.forEach((element) => {
                    if (element && typeof element.style === 'object') element.style.marginLeft = marginToUse;
                });

                updateUIState();
            } catch (error) {
                console.error('[UnsafeYT] Error creating control buttons:', error);
            }
        };

        if (topLevelButtonsGroup.get()) {
            _handleControlButtonCreation();
        } else {
            const targetNode = document.body;
            if (!mutationObserver.topLevelButtonsGroup)
                mutationObserver.topLevelButtonsGroup = new MutationObserver(_handleControlButtonCreation);
            const observerConfig = {
                childList: true,
                subtree: true,
            };
            mutationObserver.topLevelButtonsGroup.observe(targetNode, observerConfig);
        }
    }

    function updateUIState() {
        if (UI_CACHE.toggle) {
            UI_CACHE.toggle.textContent = `Decode ${appState.isRendering ? 'ON' : 'OFF'}`;
            UI_CACHE.toggle.style.opacity = appState.token ? '1' : '0.5';
            UI_CACHE.toggle.classList.toggle('active', appState.isRendering);
        }
    }

    function compileShader(gl, type, src) {
        try {
            if (!gl) return null;
            const shader = gl.createShader(type);
            if (!shader) throw new Error('Failed to create shader.');
            gl.shaderSource(shader, src);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                const infoLog = gl.getShaderInfoLog(shader);
                gl.deleteShader(shader);
                throw new Error(infoLog);
            }
            return shader;
        } catch (error) {
            console.error('[UnsafeYT] Shader compile error:', error);
            return null;
        }
    }

    function createProgram(gl, vertexShaderSource, fragmentShaderSource) {
        let vertexShader = null;
        let fragmentShader = null;
        try {
            if (!gl) return null;
            vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
            fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
            if (!vertexShader || !fragmentShader) throw new Error('Shader creation failed.');
            const program = gl.createProgram();
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);
            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                const infoLog = gl.getProgramInfoLog(program);
                try {
                    gl.deleteProgram(program);
                } catch (error) {
                    console.warn('[UnsafeYT] Failed to delete program:', error);
                }
                throw new Error(`Program link error: ${infoLog}`);
            }
            gl.useProgram(program);
            return program;
        } catch (error) {
            console.error('[UnsafeYT] Program creation error:', error);
            return null;
        } finally {
            try {
                if (vertexShader) gl.deleteShader(vertexShader);
                if (fragmentShader) gl.deleteShader(fragmentShader);
            } catch (error) {
                console.warn('[UnsafeYT] Failed to delete shader post-link:', error);
            }
        }
    }

    function setupWebGL(gl, videoElement, token) {
        let oesTextureFloatExt = null;
        if (gl instanceof WebGLRenderingContext) {
            oesTextureFloatExt = gl.getExtension('OES_texture_float');
        }

        try {
            const program = createProgram(gl, SCREEN_SHADERS.VERTEX, SCREEN_SHADERS.FRAGMENT);
            if (!program) {
                throw new Error('Program creation failed');
            }
            const positionLocation = gl.getAttribLocation(program, 'a_position');
            const texCoordLocation = gl.getAttribLocation(program, 'a_texCoord');
            const videoSamplerLocation = gl.getUniformLocation(program, 'u_sampler');
            const shuffleSamplerLocation = gl.getUniformLocation(program, 'u_shuffle');
            const quadVerts = new Float32Array([-1, -1, 0, 0, 1, -1, 1, 0, -1, 1, 0, 1, -1, 1, 0, 1, 1, -1, 1, 0, 1, 1, 1, 1]);
            const vertexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, quadVerts, gl.STATIC_DRAW);
            gl.enableVertexAttribArray(positionLocation);
            gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 16, 0);
            gl.enableVertexAttribArray(texCoordLocation);
            gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 16, 8);
            const videoTexture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, videoTexture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            let unshuffleMapFloats = null;
            try {
                unshuffleMapFloats = _generateUnshuffleOffsetMapFloat32Array(token, 80, 80);
            } catch (error) {
                console.error('[UnsafeYT] Failed to generate unshuffle map:', error);
                throw error;
            }
            const shuffleTexture = gl.createTexture();
            appState.shuffleTexture = shuffleTexture;
            gl.activeTexture(gl.TEXTURE1);
            gl.bindTexture(gl.TEXTURE_2D, shuffleTexture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            if (gl instanceof WebGL2RenderingContext) {
                try {
                    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RG32F, 80, 80, 0, gl.RG, gl.FLOAT, unshuffleMapFloats);
                } catch (error) {
                    console.warn('[UnsafeYT] WebGL2 RG32F texture failed, falling back to RGBA32F:', error);
                    try {
                        const rgbaFloatArray = new Float32Array(80 * 80 * 4);
                        for (let i = 0; i < unshuffleMapFloats.length / 2; i++) {
                            rgbaFloatArray[i * 4] = unshuffleMapFloats[i * 2];
                            rgbaFloatArray[i * 4 + 1] = unshuffleMapFloats[i * 2 + 1];
                        }
                        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, 80, 80, 0, gl.RGBA, gl.FLOAT, rgbaFloatArray);
                    } catch (error) {
                        console.error('[UnsafeYT] WebGL2 RGBA32F texture failed:', error);
                        throw error;
                    }
                }
            } else if (oesTextureFloatExt) {
                try {
                    const rgbaFloatArray = new Float32Array(80 * 80 * 4);
                    for (let i = 0; i < unshuffleMapFloats.length / 2; i++) {
                        rgbaFloatArray[i * 4] = unshuffleMapFloats[i * 2];
                        rgbaFloatArray[i * 4 + 1] = unshuffleMapFloats[i * 2 + 1];
                    }
                    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 80, 80, 0, gl.RGBA, gl.FLOAT, rgbaFloatArray);
                } catch (error) {
                    console.error('[UnsafeYT] WebGL1 RGBA texture failed:', error);
                    throw error;
                }
            } else {
                throw new Error('No float texture support.');
            }
            gl.clearColor(0, 0, 0, 1);

            const render = () => {
                if (!appState.isRendering || !gl || !videoElement || !appState.canvas) return;
                try {
                    if (videoElement.readyState >= videoElement.HAVE_CURRENT_DATA) {
                        gl.activeTexture(gl.TEXTURE0);
                        gl.bindTexture(gl.TEXTURE_2D, videoTexture);
                        try {
                            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, videoElement);
                        } catch (error) {
                            console.warn('[UnsafeYT] Failed to update video texture:', error);
                            try {
                                gl.texImage2D(
                                    gl.TEXTURE_2D,
                                    0,
                                    gl.RGBA,
                                    videoElement.videoWidth,
                                    videoElement.videoHeight,
                                    0,
                                    gl.RGBA,
                                    gl.UNSIGNED_BYTE,
                                    null,
                                );
                            } catch (error) {
                                console.warn('[UnsafeYT] Failed to update video texture:', error);
                            }
                        }
                        gl.uniform1i(videoSamplerLocation, 0);
                        gl.uniform1i(shuffleSamplerLocation, 1);
                        gl.clear(gl.COLOR_BUFFER_BIT);
                        gl.drawArrays(gl.TRIANGLES, 0, 6);
                    }
                } catch (error) {
                    console.error('[UnsafeYT] WebGL render loop failed:', error);
                    removeEffects(true);
                }
            };
            return render;
        } catch (error) {
            console.error('[UnsafeYT] WebGL setup failed:', error);
            throw error;
        }
    }

    function setupAudio(audioContext, videoElement) {
        try {
            if (!audioContext || !videoElement) return {};

            let sourceNode = persistentAudio.sourceNodeCache.get(videoElement);
            if (!sourceNode) {
                try {
                    sourceNode = audioContext.createMediaElementSource(videoElement);
                    persistentAudio.sourceNodeCache.set(videoElement, sourceNode);
                } catch (error) {
                    console.error('[UnsafeYT] Could not create media element source:', error);
                    return {};
                }
            }

            appState.audio.sourceNode = sourceNode;

            const unprocessedAudioGainNode = audioContext.createGain();
            const processedAudioGainNode = audioContext.createGain();

            unprocessedAudioGainNode.gain.value = 0.0;
            processedAudioGainNode.gain.value = 1.0;

            const splitter = audioContext.createChannelSplitter(2);
            const leftGain = audioContext.createGain();
            const rightGain = audioContext.createGain();
            const merger = audioContext.createChannelMerger(1);
            leftGain.gain.value = 0.25;
            rightGain.gain.value = 0.25;

            const gainNode = audioContext.createGain();
            gainNode.gain.value = 1.0;

            const compressor = audioContext.createDynamicsCompressor();
            compressor.threshold.value = -72;
            compressor.knee.value = 35;
            compressor.ratio.value = 15;
            compressor.attack.value = 0.003;
            compressor.release.value = 0.25;

            const outputGainNode = audioContext.createGain();
            outputGainNode.gain.value = 4.0;

            const filterConfigs = [
                { f: 200, q: 3, g: 1 },
                { f: 440, q: 2, g: 1 },
                { f: 6600, q: 1, g: 0 },
                { f: 15600, q: 1, g: 0 },
                { f: 5000, q: 20, g: 1 },
                { f: 6000, q: 20, g: 1 },
                { f: 6300, q: 5, g: 1 },
                { f: 8000, q: 40, g: 1 },
                { f: 10000, q: 40, g: 1 },
                { f: 12500, q: 40, g: 1 },
                { f: 14000, q: 40, g: 1 },
                { f: 15000, q: 40, g: 1 },
                { f: 15500, q: 1, g: 0 },
                { f: 15900, q: 1, g: 0 },
                { f: 16000, q: 40, g: 1 },
            ];

            const notchFilters = filterConfigs.map((config) => {
                const filter = audioContext.createBiquadFilter();
                filter.type = 'notch';
                filter.frequency.value = config.f;
                filter.Q.value = config.q * 3.5;
                filter.gain.value = config.g;
                return filter;
            });

            if (appState.audio.sourceNode) {
                appState.audio.sourceNode.connect(unprocessedAudioGainNode);
                unprocessedAudioGainNode.connect(audioContext.destination);

                appState.audio.sourceNode.connect(processedAudioGainNode);
                processedAudioGainNode.connect(splitter);
                splitter.connect(leftGain, 0);
                splitter.connect(rightGain, 1);
                leftGain.connect(merger, 0, 0);
                rightGain.connect(merger, 0, 0);
                const audioChain = [merger, gainNode, ...notchFilters, compressor, outputGainNode, audioContext.destination];
                audioChain.reduce((prev, next) => prev.connect(next));
            }

            const listenerController = new AbortController();
            const { signal } = listenerController;

            const handleAudioState = async () => {
                if (!audioContext || audioContext.state === 'closed') return;
                try {
                    if (videoElement.paused) {
                        if (audioContext.state === 'running') {
                            await audioContext.suspend();
                        }
                    } else {
                        if (audioContext.state === 'suspended') {
                            await audioContext.resume();
                        }
                    }
                } catch (error) {
                    console.warn('[UnsafeYT] Audio context state change error:', error);
                }
            };

            videoElement.addEventListener('play', handleAudioState, { signal });
            videoElement.addEventListener('pause', handleAudioState, { signal });
            if (!videoElement.paused) handleAudioState();

            return {
                unprocessedAudioGainNode,
                processedAudioGainNode,
                gainNode,
                compressor,
                outputGainNode,
                notchFilters,
                listenerController,
            };
        } catch (error) {
            console.error('[UnsafeYT] Audio graph setup failed:', error);
            return {};
        }
    }

    function startVideoFrameLoop(videoElement, renderCallback) {
        const videoFrameCallback = () => {
            if (!appState.isRendering) {
                return;
            }

            renderCallback();

            if (appState.videoElement) {
                try {
                    appState.videoElement.requestVideoFrameCallback(videoFrameCallback);
                } catch (error) {
                    console.warn('[UnsafeYT] Failed to request next video frame callback:', error);
                }
            }
        };

        if (typeof videoElement.requestVideoFrameCallback !== 'function') {
            console.warn('[UnsafeYT] requestVideoFrameCallback not supported. Falling back to requestAnimationFrame.');

            const rafLoop = () => {
                if (!appState.isRendering) {
                    appState.renderFrameId = null;
                    return;
                }
                renderCallback();
                appState.renderFrameId = requestAnimationFrame(rafLoop);
            };
            appState.renderFrameId = requestAnimationFrame(rafLoop);
        } else {
            videoElement.requestVideoFrameCallback(videoFrameCallback);
        }
    }

    function _updateShuffleTexture(gl, unshuffleMapFloats) {
        if (!gl || !appState.shuffleTexture || !unshuffleMapFloats) {
            throw new Error('Missing GL, texture, or map for shuffle update.');
        }

        const oesTextureFloatExt = gl instanceof WebGLRenderingContext ? gl.getExtension('OES_texture_float') : null;

        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, appState.shuffleTexture);

        if (gl instanceof WebGL2RenderingContext) {
            try {
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RG32F, 80, 80, 0, gl.RG, gl.FLOAT, unshuffleMapFloats);
            } catch (error) {
                console.warn('[UnsafeYT] WebGL2 RG32F texture update failed, falling back to RGBA32F:', error);
                const rgbaFloatArray = new Float32Array(80 * 80 * 4);
                for (let i = 0; i < unshuffleMapFloats.length / 2; i++) {
                    rgbaFloatArray[i * 4] = unshuffleMapFloats[i * 2];
                    rgbaFloatArray[i * 4 + 1] = unshuffleMapFloats[i * 2 + 1];
                }
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, 80, 80, 0, gl.RGBA, gl.FLOAT, rgbaFloatArray);
            }
        } else if (oesTextureFloatExt) {
            const rgbaFloatArray = new Float32Array(80 * 80 * 4);
            for (let i = 0; i < unshuffleMapFloats.length / 2; i++) {
                rgbaFloatArray[i * 4] = unshuffleMapFloats[i * 2];
                rgbaFloatArray[i * 4 + 1] = unshuffleMapFloats[i * 2 + 1];
            }
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 80, 80, 0, gl.RGBA, gl.FLOAT, rgbaFloatArray);
        } else {
            throw new Error('No float texture support for hot-swap.');
        }
    }

    function removeEffects(forceDestroy = false) {
        if (isApplyingEffects) return;
        if (!forceDestroy && !appState.isRendering) return;

        isApplyingEffects = true;
        try {
            appState.isRendering = false;
            if (appState.renderFrameId !== null) {
                cancelAnimationFrame(appState.renderFrameId);
                appState.renderFrameId = null;
            }

            if (!forceDestroy) {
                if (appState.canvas) appState.canvas.style.display = 'none';
                if (appState.videoElement) appState.videoElement.style.opacity = '1';

                if (appState.audio.unprocessedAudioGainNode) appState.audio.unprocessedAudioGainNode.gain.value = 0.2;
                if (appState.audio.processedAudioGainNode) appState.audio.processedAudioGainNode.gain.value = 0.0;

                updateUIState();
                return;
            }

            if (appState.webGlContext) {
                appState.webGlContext = null;
                appState.shuffleTexture = null;
            }

            if (appState.listenerController) {
                appState.listenerController.abort();
                appState.listenerController = null;
            }

            if (appState.canvas) {
                try {
                    appState.canvas.remove();
                } catch (error) {
                    console.warn('[UnsafeYT] Canvas remove error:', error);
                }
                appState.canvas = null;
            }

            if (appState.resizeObserver) {
                appState.resizeObserver.disconnect();
                appState.resizeObserver = null;
            }

            const container = appState.playerContainer;
            if (container && appState.originalContainerStyle) {
                try {
                    Object.assign(container.style, appState.originalContainerStyle);
                } catch (error) {
                    console.warn('[UnsafeYT] Container style reset error:', error);
                }
                appState.originalContainerStyle = null;
            }

            if (appState.audio.sourceNode) {
                try {
                    setTimeout(() => {
                        appState.audio.sourceNode.disconnect();
                    }, 0);
                } catch (error) {
                    console.warn('[UnsafeYT] Audio node disconnect error:', error);
                }
            }

            appState.audio = { ...initialAudioState };

            const video = appState.videoElement;
            if (video) video.style.opacity = '1';

            appState.renderLoop = () => {};
            appState.token = '';

            updateUIState();
        } catch (error) {
            console.error('[UnsafeYT] Failed to remove effects:', error);
        } finally {
            isApplyingEffects = false;
        }
    }

    async function applyEffects(seedToken) {
        if (isApplyingEffects) return;
        if (typeof seedToken !== 'string' || seedToken.length < 3) {
            if (appState.webGlContext) removeEffects(true);
            return;
        }

        const videoElement = appState.videoElement;
        const playerContainer = appState.playerContainer;
        if (!playerContainer?.contains(videoElement)) return;

        isApplyingEffects = true;
        videoElement.currentTime += 0.001; // Apply seek to force refresh stale video buffer.

        try {
            if (appState.webGlContext && appState.canvas) {
                const isCanvasStale = !playerContainer.querySelector('#unsafeyt-glcanvas');
                if (isCanvasStale) {
                    console.warn('[UnsafeYT] Stale canvas detected (player container was swapped). Forcing full recreation.');
                } else if (appState.token === seedToken) {
                    console.log('[UnsafeYT] Processing same video as previous load.');
                    videoElement.style.opacity = '0';
                    appState.canvas.style.display = 'block';

                    if (appState.audio.unprocessedAudioGainNode) appState.audio.unprocessedAudioGainNode.gain.value = 0.0;
                    if (appState.audio.processedAudioGainNode) appState.audio.processedAudioGainNode.gain.value = 1.0;

                    try {
                        if (appState.audio.context?.state === 'suspended' && !videoElement.paused) await appState.audio.context.resume();
                    } catch (error) {
                        console.warn('[UnsafeYT] Audio context resume error:', error);
                    }

                    if (!appState.isRendering) {
                        appState.isRendering = true;
                        startVideoFrameLoop(videoElement, appState.renderLoop);
                    }
                    updateUIState();
                    return;
                } else {
                    try {
                        console.log(`[UnsafeYT] Hot-swapping token: "${seedToken}"`);
                        const unshuffleMapFloats = _generateUnshuffleOffsetMapFloat32Array(seedToken, 80, 80);
                        _updateShuffleTexture(appState.webGlContext, unshuffleMapFloats);

                        appState.token = seedToken;

                        videoElement.style.opacity = '0';
                        appState.canvas.style.display = 'block';
                        if (appState.audio.unprocessedAudioGainNode) appState.audio.unprocessedAudioGainNode.gain.value = 0.0;
                        if (appState.audio.processedAudioGainNode) appState.audio.processedAudioGainNode.gain.value = 1.0;
                        try {
                            if (appState.audio.context?.state === 'suspended' && !videoElement.paused) {
                                await appState.audio.context.resume();
                            }
                        } catch (error) {
                            console.warn('[UnsafeYT] Audio context resume error:', error);
                        }

                        if (!appState.isRendering) {
                            appState.isRendering = true;
                            startVideoFrameLoop(videoElement, appState.renderLoop);
                        }
                        updateUIState();
                        return;
                    } catch (hotSwapError) {
                        console.error('[UnsafeYT] Hot-swap failed, forcing full cold-swap:', hotSwapError);
                    }
                }
            }

            removeEffects(true);
            console.log(`[UnsafeYT] Applying effects with token: "${seedToken}"`);

            videoElement.style.opacity = '0';
            videoElement.crossOrigin = 'anonymous';

            appState.canvas = document.createElement('canvas');
            appState.canvas.id = 'unsafeyt-glcanvas';
            Object.assign(appState.canvas.style, {
                position: 'absolute',
                pointerEvents: 'none',
                zIndex: 12,
                touchAction: 'none',
                display: 'block',
            });
            if (!appState.originalContainerStyle)
                appState.originalContainerStyle = {
                    position: playerContainer.style.position,
                    height: playerContainer.style.height,
                };
            Object.assign(playerContainer.style, { position: 'relative', height: '100%' });
            playerContainer.appendChild(appState.canvas);

            appState.webGlContext =
                appState.canvas.getContext('webgl2', { alpha: false }) || appState.canvas.getContext('webgl', { alpha: false });
            if (!appState.webGlContext) {
                throw new Error('Failed to get WebGL context.');
            }

            const resizeCallback = () => {
                if (!appState.canvas || !videoElement || !playerContainer) return;

                const videoWidth = videoElement.offsetWidth;
                const videoHeight = videoElement.offsetHeight;
                const videoTop = videoElement.offsetTop;
                const videoLeft = videoElement.offsetLeft;

                appState.canvas.width = videoWidth || 640;
                appState.canvas.height = videoHeight || 360;

                appState.canvas.style.top = `${videoTop}px`;
                appState.canvas.style.left = `${videoLeft}px`;
                appState.canvas.style.width = `${videoWidth}px`;
                appState.canvas.style.height = `${videoHeight}px`;

                if (appState.webGlContext) {
                    try {
                        appState.webGlContext.viewport(
                            0,
                            0,
                            appState.webGlContext.drawingBufferWidth,
                            appState.webGlContext.drawingBufferHeight,
                        );
                    } catch (error) {
                        console.warn('[UnsafeYT] GL viewport error:', error);
                    }
                }
            };

            appState.resizeObserver = new ResizeObserver(resizeCallback);
            appState.resizeObserver.observe(videoElement);
            resizeCallback();

            appState.renderLoop = setupWebGL(appState.webGlContext, videoElement, seedToken);
            appState.token = seedToken;

            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                if (!persistentAudio.context) persistentAudio.context = new AudioCtx();
                const audioNodes = setupAudio(persistentAudio.context, videoElement);
                appState.audio = { ...appState.audio, ...audioNodes, context: persistentAudio.context };
            }

            appState.isRendering = true;

            startVideoFrameLoop(videoElement, appState.renderLoop);

            updateUIState();
            console.log('[UnsafeYT] Effects applied.');
        } catch (error) {
            console.error('[UnsafeYT] Failed to apply effects:', error);
            removeEffects(true);
        } finally {
            isApplyingEffects = false;
        }
    }

    async function processVideo(event) {
        try {
            const newToken = extractTokenFromText(event.detail.video.rawDescription);
            if (!newToken) {
                if (appState.webGlContext) removeEffects(true);
                return;
            }

            await applyEffects(newToken);
        } catch (error) {
            console.error('[UnsafeYT] Error in processVideo:', error);
        }
    }

    async function _handleApiUpdate(event) {
        appState.playerContainer = event.detail.player.playerObject;
        appState.videoElement = event.detail.player.videoElement;
        await processVideo(event);
    }

    function initialize() {
        injectUiStyles();
        window.addEventListener('pageshow', tryCreateControlButtons);
        window.addEventListener('yt-page-data-updated', tryCreateControlButtons);
        api.eventTarget.addEventListener('yt-helper-api-ready', _handleApiUpdate);
    }

    initialize();
})();
