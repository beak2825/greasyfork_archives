// ==UserScript==
// @name         Diep.io Internal Custom FOV
// @description  Set FOV by scrolling the mouse wheel
// @version      1.0.0.1
// @author       DDatiOS
// @match        https://diep.io/*
// @icon         https://www.google.com/s2/favicons?domain=diep.io
// @run-at       document-start
// @grant        none
// @namespace https://greasyfork.org/users/1541498
// @downloadURL https://update.greasyfork.org/scripts/562202/Diepio%20Internal%20Custom%20FOV.user.js
// @updateURL https://update.greasyfork.org/scripts/562202/Diepio%20Internal%20Custom%20FOV.meta.js
// ==/UserScript==

// yo lol, feel free to contact me if you have any problems

// Tested and working on 11/01/26

/**
 * Credits
 * ----------------------------------------
 * Base library : diepAPI
 * Author       : Cazka
 * Repository   : https://github.com/Cazka/diepAPI
 *
 * This project uses diepAPI as a base.
 * Modified / extended by: DDatiOS
 * My Github    : https://github.com/DDatiOSCheat
 * My Discord   : ddatios._.
 */

(() => {
    const _window = 'undefined' == typeof unsafeWindow ? window : unsafeWindow;
    if (_window.diepAPI) return;
    // if (Object.is('diepAPI')) return;

    var diepAPI;
    /******/
    (() => { // webpackBootstrap
        /******/
        "use strict";
        /******/
        var __webpack_modules__ = ({

            /***/
            56() {

                /**
                 * Patch for Function.prototype.toString to return correct function name for native functions.
                 * This is neccessary since proxying functions causes the name to be lost.
                 */
                // eslint-disable-next-line @typescript-eslint/unbound-method
                Function.prototype.toString = new Proxy(Function.prototype.toString, {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
                    apply(target, thisArg, args) {
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                        const result = Reflect.apply(target, thisArg, args);
                        if (result === `function () { [native code] }` && thisArg.name.length > 0) {
                            return `function ${thisArg.name}() { [native code] }`;
                        }
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                        return result;
                    },
                });

                /***/
            },

            /***/
            329() {

                /**
                 * Patch to make Event.isTrusted always return true.
                 */
                /**
                 * Wraps an event object in a Proxy that returns true for isTrusted
                 */
                function getProxiedEvent(event) {
                    const handler = {
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        get(target, prop, receiver) {
                            if (prop === 'isTrusted') {
                                return true;
                            }
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                            return Reflect.get(target, prop, target);
                        },
                    };
                    return new Proxy(event, handler);
                }
                /**
                 * Wraps an event listener to proxy events before they reach the handler
                 */
                // Modified
                function getProxiedListener(listener) {
                    return new Proxy(listener, {
                        apply(target, thisArg, args) {
                            const e = args[0];
                            if (!(e instanceof MouseEvent)) {
                                args[0] = getProxiedEvent(e);
                            }

                            return Reflect.apply(target, thisArg, args);
                        },
                    });
                }
                // eslint-disable-next-line @typescript-eslint/unbound-method
                EventTarget.prototype.addEventListener = new Proxy(EventTarget.prototype.addEventListener, {
                    apply(target, thisArg, args) {
                        if (args[1] instanceof Function) {
                            args[1] = getProxiedListener(args[1]);
                            // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
                            return Reflect.apply(target, thisArg, args);
                        }
                        if (args[1] instanceof Object && args[1].handleEvent instanceof Function) {
                            // eslint-disable-next-line @typescript-eslint/unbound-method
                            args[1].handleEvent = getProxiedListener(args[1].handleEvent);
                            // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
                            return Reflect.apply(target, thisArg, args);
                        }
                        // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
                        return Reflect.apply(target, thisArg, args);
                    },
                });

                /***/
            }

            /******/
        });
        /************************************************************************/
        /******/ // The module cache
        /******/
        var __webpack_module_cache__ = {};
        /******/
        /******/ // The require function
        /******/
        function __webpack_require__(moduleId) {
            /******/ // Check if module is in cache
            /******/
            var cachedModule = __webpack_module_cache__[moduleId];
            /******/
            if (cachedModule !== undefined) {
                /******/
                return cachedModule.exports;
                /******/
            }
            /******/ // Create a new module (and put it into the cache)
            /******/
            var module = __webpack_module_cache__[moduleId] = {
                /******/ // no module.id needed
                /******/ // no module.loaded needed
                /******/
                exports: {}
                /******/
            };
            /******/
            /******/ // Execute the module function
            /******/
            __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
            /******/
            /******/ // Return the exports of the module
            /******/
            return module.exports;
            /******/
        }
        /******/
        /************************************************************************/
        /******/
        /* webpack/runtime/define property getters */
        /******/
        (() => {
            /******/ // define getter functions for harmony exports
            /******/
            __webpack_require__.d = (exports, definition) => {
                /******/
                for (var key in definition) {
                    /******/
                    if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
                        /******/
                        Object.defineProperty(exports, key, {
                            enumerable: true,
                            get: definition[key]
                        });
                        /******/
                    }
                    /******/
                }
                /******/
            };
            /******/
        })();
        /******/
        /******/
        /* webpack/runtime/hasOwnProperty shorthand */
        /******/
        (() => {
            /******/
            __webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
            /******/
        })();
        /******/
        /******/
        /* webpack/runtime/make namespace object */
        /******/
        (() => {
            /******/ // define __esModule on exports
            /******/
            __webpack_require__.r = (exports) => {
                /******/
                if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
                    /******/
                    Object.defineProperty(exports, Symbol.toStringTag, {
                        value: 'Module'
                    });
                    /******/
                }
                /******/
                Object.defineProperty(exports, '__esModule', {
                    value: true
                });
                /******/
            };
            /******/
        })();
        /******/
        /************************************************************************/
        var __webpack_exports__ = {};
        // ESM COMPAT FLAG
        __webpack_require__.r(__webpack_exports__);

        // EXPORTS
        __webpack_require__.d(__webpack_exports__, {
            apis: () => ( /* reexport */ apis_namespaceObject),
            core: () => ( /* reexport */ core_namespaceObject),
            tools: () => ( /* reexport */ tools_namespaceObject),
            types: () => ( /* reexport */ types_namespaceObject),
            wasm: () => ( /* reexport */ wasm_namespaceObject)
        });

        // NAMESPACE OBJECT: ./src/wasm/codec.ts
        var codec_namespaceObject = {};
        __webpack_require__.r(codec_namespaceObject);
        __webpack_require__.d(codec_namespaceObject, {
            decode: () => (decode),
            decodeFloat: () => (decodeFloat),
            encode: () => (encode),
            encodeFloat: () => (encodeFloat)
        });

        // NAMESPACE OBJECT: ./src/wasm/config.ts
        var config_namespaceObject = {};
        __webpack_require__.r(config_namespaceObject);
        __webpack_require__.d(config_namespaceObject, {
            ARENA_HEIGHT_ADDR: () => (ARENA_HEIGHT_ADDR),
            ARENA_WIDTH_ADDR: () => (ARENA_WIDTH_ADDR),
            CameraPositionX_ADDR: () => (CameraPositionX_ADDR),
            CameraPositionY_ADDR: () => (CameraPositionY_ADDR),
            FOV_ADDR: () => (FOV_ADDR)
        });

        // NAMESPACE OBJECT: ./src/core/index.ts
        var core_namespaceObject = {};
        __webpack_require__.r(core_namespaceObject);
        __webpack_require__.d(core_namespaceObject, {
            CanvasKit: () => (CanvasKit),
            EventEmitter: () => (EventEmitter),
            Movement: () => (Movement),
            Vector: () => (Vector)
        });

        // NAMESPACE OBJECT: ./src/wasm/index.ts
        var wasm_namespaceObject = {};
        __webpack_require__.r(wasm_namespaceObject);
        __webpack_require__.d(wasm_namespaceObject, {
            codec: () => (codec_namespaceObject),
            config: () => (config_namespaceObject),
            memoryAccess: () => (memoryAccess),
            memoryScanner: () => (memoryScanner),
            wasmInstance: () => (wasmInstance)
        });

        // NAMESPACE OBJECT: ./src/apis/index.ts
        var apis_namespaceObject = {};
        __webpack_require__.r(apis_namespaceObject);
        __webpack_require__.d(apis_namespaceObject, {
            arena: () => (arena),
            camera: () => (camera),
            game: () => (game),
            gamepad: () => (gamepad),
            input: () => (input),
            minimap: () => (minimap),
            player: () => (player),
            playerMovement: () => (playerMovement),
            scaling: () => (scaling)
        });

        // NAMESPACE OBJECT: ./src/tools/index.ts
        var tools_namespaceObject = {};
        __webpack_require__.r(tools_namespaceObject);
        __webpack_require__.d(tools_namespaceObject, {
            backgroundOverlay: () => (backgroundOverlay),
            debugTool: () => (debugTool),
            overlay: () => (overlay)
        });

        // NAMESPACE OBJECT: ./src/types/index.ts
        var types_namespaceObject = {};
        __webpack_require__.r(types_namespaceObject);
        __webpack_require__.d(types_namespaceObject, {
            Entity: () => (Entity),
            EntityColor: () => (EntityColor),
            EntityType: () => (EntityType)
        });

        // EXTERNAL MODULE: ./src/patches/event_isTrusted.ts
        var event_isTrusted = __webpack_require__(329);
        // EXTERNAL MODULE: ./src/patches/function_toString.ts
        var function_toString = __webpack_require__(56);; // ./src/patches/index.ts

        ; // ./src/core/vector.ts
        class Vector {
            x;
            y;
            constructor(x, y) {
                this.x = x;
                this.y = y;
            }
            static len(v) {
                return Math.sqrt(v.x ** 2 + v.y ** 2);
            }
            static round(v) {
                return new Vector(Math.round(v.x), Math.round(v.y));
            }
            static scale(r, v) {
                return new Vector(r * v.x, r * v.y);
            }
            static unscale(r, v) {
                return new Vector(v.x / r, v.y / r);
            }
            static add(u, v) {
                return new Vector(u.x + v.x, u.y + v.y);
            }
            static subtract(u, v) {
                return new Vector(u.x - v.x, u.y - v.y);
            }
            static multiply(u, v) {
                return new Vector(u.x * v.x, u.y * v.y);
            }
            static divide(u, v) {
                return new Vector(u.x / v.x, u.y / v.y);
            }
            static distance(u, v) {
                return Vector.len(Vector.subtract(u, v));
            }
            /**
             * Calculates the [centroid](https://en.wikipedia.org/wiki/Centroid)
             */
            static centroid(...vertices) {
                const sum = vertices.reduce((acc, vec) => Vector.add(acc, vec), new Vector(0, 0));
                const centroid = Vector.scale(1 / vertices.length, sum);
                return centroid;
            }
            /**
             * Calcutes the radius from a set of vertices that are placed on a circle
             */
            static radius(...vertices) {
                const centroid = Vector.centroid(...vertices);
                const distance = vertices.reduce((acc, vec) => acc + Vector.distance(centroid, vec), 0);
                const radius = distance / vertices.length;
                return radius;
            }
        }

        ; // ./src/wasm/codec.ts
        /**
         * Encode a 32-bit float into an obfuscated 32-bit integer.
         * This is used by the game to store float values in memory in an obfuscated way.
         */
        function encode(floatBits) {
            const orig = floatBits >>> 0;
            const c = ((orig ^ 112) + 11) >>> 0;
            const b = (((orig >>> 8) ^ 113) >>> 0) - c - 57;
            const d = (((orig >>> 16) ^ 110) >>> 0) - b;
            const top = (((orig >>> 24) ^ 31) >>> 0) - d;
            const result = (((top << 24) >>> 0) | (((d + 81) & 255) << 16) | (((b & 0xff) << 8) >>> 0) | (c & 255)) >>> 0;
            return (result + 1946157056) >>> 0;
        }
        /**
         * Decode an obfuscated 32-bit integer back into a 32-bit float.
         * This reverses the encode function.
         */
        function decode(encoded) {
            const i = encoded >>> 0;
            const local4 = (i >>> 16) & 0xffff;
            const local5 = (i >>> 8) & 0xffffff;
            const part1 = (((local4 << 24) >>> 0) + i) & 0xff000000;
            const part2 = (i + 245) & 0xff;
            const part3 = (((local4 + local5) << 16) + 11468800) & 0x00ff0000;
            const part4 = (((i + local5) << 8) + 14592) & 0x0000ff00;
            const combined = (part1 | part2 | part3 | part4) >>> 0;
            return ((combined + 989855744) ^ 527331696) >>> 0;
        }
        /**
         * Encode a float value into its obfuscated representation.
         */
        function encodeFloat(v) {
            return encode(f32ToU32(v));
        }
        /**
         * Decode an obfuscated integer back into its float representation.
         */
        function decodeFloat(e) {
            return u32ToF32(decode(e));
        }

        function f32ToU32(f) {
            return new Uint32Array(new Float32Array([f]).buffer)[0];
        }

        function u32ToF32(u) {
            return new Float32Array(new Uint32Array([u]).buffer)[0];
        }

        ; // ./src/wasm/config.ts
        const FOV_ADDR = 583440;
        const CameraPositionX_ADDR = 583428;
        const CameraPositionY_ADDR = 583432;
        const ARENA_WIDTH_ADDR = 599188;
        const ARENA_HEIGHT_ADDR = 599192;

        ; // ./src/core/canvas_kit.ts

        const CANVAS_KIT_BYPASS = Symbol('CanvasKit-bypass');
        class CanvasKit {
            /**
             * If you need a canvas then create it with this method.
             */
            static createCanvas() {
                const canvas = document.createElement('canvas');
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
                canvas[CANVAS_KIT_BYPASS] = true;
                canvas.style.pointerEvents = 'none';
                canvas.style.position = 'fixed';
                canvas.style.zIndex = '1';
                canvas.style.top = '0px';
                canvas.style.left = '0px';
                canvas.style.right = '0px';
                canvas.style.bottom = '0px';
                canvas.style.width = '100%';
                canvas.style.height = '100%';
                return canvas;
            }
            /**
             * The consumer will be called before.
             */
            static hookRAF(consumer) {
                _window.requestAnimationFrame = new Proxy(_window.requestAnimationFrame, {
                    apply(target, thisArg, args) {
                        consumer();
                        return Reflect.apply(target, thisArg, args);
                    },
                });
            }
            /**
             * replaces the function. Use `return Reflect.apply(target, thisArg, args);` in
             * your function to call the original function.
             */
            static replaceRAF(func) {
                _window.requestAnimationFrame = new Proxy(_window.requestAnimationFrame, {
                    apply(target, thisArg, args) {
                        return func(target, thisArg, args);
                    },
                });
            }
            /**
             * The consumer will be called before
             */
            static hookCtx(method, consumer, useOffscreenCtx = false) {
                const target = useOffscreenCtx ?
                    _window.OffscreenCanvasRenderingContext2D.prototype :
                    _window.CanvasRenderingContext2D.prototype;
                target[method] = new Proxy(target[method], {
                    apply(target, thisArg, args) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
                        if (!thisArg.canvas[CANVAS_KIT_BYPASS])
                            consumer(target, thisArg, args);
                        return Reflect.apply(target, thisArg, args);
                    },
                });
            }
            /**
             * replaces the function. Use `return Reflect.apply(target, thisArg, args);` in
             * your function to call the original function.
             */
            static overrideCtx(method, func, useOffscreenCtx = false) {
                const target = useOffscreenCtx ?
                    _window.OffscreenCanvasRenderingContext2D.prototype :
                    _window.CanvasRenderingContext2D.prototype;
                target[method] = new Proxy(target[method], {
                    apply(target, thisArg, args) {
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
                        if (!thisArg.canvas[CANVAS_KIT_BYPASS])
                            return func(target, thisArg, args);
                        return Reflect.apply(target, thisArg, args);
                    },
                });
            }
            /**
             *
             * Calls the callback method when a polygon with `numVertices` is being drawn.
             */
            static hookPolygon(numVertices, cb, useOffscreenCtx = false) {
                let index = 0;
                let vertices = [];
                const onFillPolygon = (ctx) => {
                    cb(vertices, ctx);
                };
                CanvasKit.hookCtx('beginPath', (target, thisArg, args) => {
                    index = 1;
                    vertices = [];
                }, useOffscreenCtx);
                CanvasKit.hookCtx('moveTo', (target, thisArg, args) => {
                    if (index === 1) {
                        index++;
                        vertices.push(new Vector(args[0], args[1]));
                        return;
                    }
                    index = 0;
                }, useOffscreenCtx);
                CanvasKit.hookCtx('lineTo', (target, thisArg, args) => {
                    if (index >= 2 && index <= numVertices) {
                        index++;
                        vertices.push(new Vector(args[0], args[1]));
                        return;
                    }
                    index = 0;
                }, useOffscreenCtx);
                CanvasKit.hookCtx('fill', (target, thisArg, args) => {
                    if (index === numVertices + 1) {
                        index++;
                        onFillPolygon(thisArg);
                        return;
                    }
                    index = 0;
                }, useOffscreenCtx);
            }
        }

        ; // ./src/core/event_emitter.ts
        class EventEmitter extends EventTarget {
            emit(eventName, ...args) {
                super.dispatchEvent(new CustomEvent(eventName, {
                    detail: args
                }));
            }
            on(eventName, listener) {
                super.addEventListener(eventName, ((e) => {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                    Reflect.apply(listener, this, e.detail);
                }));
            }
            once(eventName, listener) {
                super.addEventListener(eventName, ((e) => {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                    Reflect.apply(listener, this, e.detail);
                }), {
                    once: true,
                });
            }
            off(eventName, listener) {
                super.removeEventListener(eventName, listener);
            }
        }

        ; // ./src/core/movement.ts

        class Movement {
            #position = new Vector(0, 0);
            #velocity = new Vector(0, 0);
            /*
             * used for average velocity calculation
             */
            #velocitySamplesSize = 10;
            #velocitySamples = [];
            #velocitySamplesIndex = 0;
            #velocityLastNow = performance.now();
            get position() {
                return this.#position;
            }
            /**
             * Velocity in [diep_]units / second
             */
            get velocity() {
                return this.#velocity;
            }
            /**
             * Predict where this object will be after `time`
             * @param time The time in ms.
             */
            predictPos(time) {
                const duration = (time + performance.now() - this.#velocityLastNow) / 1000;
                return Vector.add(this.#position, Vector.scale(duration, this.#velocity));
            }
            updatePos(newPos) {
                this.#updateVelocity(newPos);
                this.#position = newPos;
            }
            #updateVelocity(newPos) {
                const now = performance.now();
                const time = (now - this.#velocityLastNow) / 1000;
                if (time === 0)
                    return;
                this.#velocityLastNow = now;
                const velocity = Vector.unscale(time, Vector.subtract(newPos, this.#position));
                // add current velocity to our samples array
                this.#velocitySamples[this.#velocitySamplesIndex++] = velocity;
                this.#velocitySamplesIndex %= this.#velocitySamplesSize;
                // calculate the average velocity
                this.#velocity = Vector.unscale(this.#velocitySamples.length, this.#velocitySamples.reduce((acc, x) => Vector.add(acc, x)));
            }
        }

        ; // ./src/core/index.ts

        ; // ./src/utils/assert.ts
        function assert(predicate, message) {
            if (!predicate) {
                console.error('Assertion failed:', message);
            }
        }

        ; // ./src/wasm/wasm-instance.ts

        /**
         * Events:
         * - instantiated: Emitted when the wasm instance is instantiated
         */
        class WasmInstance extends EventEmitter {
            #instance = null;
            #module = null;
            #importDescriptors = null;
            #exportDescriptors = null;
            #imports = null;
            #exports = null;
            #memory = null;
            get instance() {
                return this.#instance;
            }
            get module() {
                return this.#module;
            }
            get importDescriptors() {
                return this.#importDescriptors;
            }
            get exportDescriptors() {
                return this.#exportDescriptors;
            }
            get imports() {
                return this.#imports;
            }
            get exports() {
                return this.#exports;
            }
            get memory() {
                return this.#memory;
            }
            constructor() {
                super();
                WebAssembly.instantiateStreaming = new Proxy(WebAssembly.instantiateStreaming, {
                    apply: async (target, thisArg, args) => {
                        const [source, importObject] = args;
                        assert(source instanceof Promise, 'diepAPI: Source must be a Response');
                        assert(importObject != null, 'diepAPI: importObject must be a WebAssembly.Imports');
                        const result = await Reflect.apply(target, thisArg, args);
                        this.#instance = result.instance;
                        this.#module = result.module;
                        this.#importDescriptors = WebAssembly.Module.imports(this.#module);
                        this.#exportDescriptors = WebAssembly.Module.exports(this.#module);
                        this.#imports = importObject;
                        this.#exports = result.instance.exports;
                        const memoryDescriptor = wasmInstance.exportDescriptors?.find((desc) => desc.kind === 'memory');
                        assert(memoryDescriptor != null, 'diepAPI: No memory export found in WASM module');
                        this.#memory = this.#exports[memoryDescriptor.name];
                        assert(this.#memory instanceof WebAssembly.Memory, 'diepAPI: Exported memory is invalid');
                        super.emit('instantiated');
                        console.log('diepAPI: WASM instance instantiated');
                        return result;
                    },
                });
            }
        }
        const wasmInstance = new WasmInstance();

        ; // ./src/wasm/memory-access.ts

        class MemoryAccess extends EventEmitter {
            #buffer = null;
            #HEAP8 = null;
            #HEAP16 = null;
            #HEAP32 = null;
            #HEAPU8 = null;
            #HEAPU16 = null;
            #HEAPU32 = null;
            #HEAPF32 = null;
            #HEAPF64 = null;
            get buffer() {
                return this.#buffer;
            }
            get HEAP8() {
                return this.#HEAP8;
            }
            get HEAP16() {
                return this.#HEAP16;
            }
            get HEAP32() {
                return this.#HEAP32;
            }
            get HEAPU8() {
                return this.#HEAPU8;
            }
            get HEAPU16() {
                return this.#HEAPU16;
            }
            get HEAPU32() {
                return this.#HEAPU32;
            }
            get HEAPF32() {
                return this.#HEAPF32;
            }
            get HEAPF64() {
                return this.#HEAPF64;
            }
            constructor() {
                super();
                wasmInstance.on('instantiated', () => {
                    assert(wasmInstance.memory !== null, 'MemoryAccess: WASM memory is null upon instantiation');
                    this.#buffer = wasmInstance.memory.buffer;
                    this.#HEAP8 = new Int8Array(this.#buffer);
                    this.#HEAP16 = new Int16Array(this.#buffer);
                    this.#HEAP32 = new Int32Array(this.#buffer);
                    this.#HEAPU8 = new Uint8Array(this.#buffer);
                    this.#HEAPU16 = new Uint16Array(this.#buffer);
                    this.#HEAPU32 = new Uint32Array(this.#buffer);
                    this.#HEAPF32 = new Float32Array(this.#buffer);
                    this.#HEAPF64 = new Float64Array(this.#buffer);
                    super.emit('instantiated');
                });
            }
        }
        const memoryAccess = new MemoryAccess();

        ; // ./src/wasm/memory-scanner.ts

        const DATA_TYPE_SIZES = {
            i8: 1,
            i16: 2,
            i32: 4,
            u8: 1,
            u16: 2,
            u32: 4,
            f32: 4,
            f64: 8,
        };
        class MemoryAddress {
            #address;
            constructor(address) {
                this.#address = address;
            }
            get i8() {
                assert(memoryAccess.HEAP8 !== null, 'diepAPI: HEAP8 is null');
                return memoryAccess.HEAP8[this.#address];
            }
            set i8(value) {
                assert(memoryAccess.HEAP8 !== null, 'diepAPI: HEAP8 is null');
                memoryAccess.HEAP8[this.#address] = value;
            }
            get i16() {
                assert(memoryAccess.HEAP16 !== null, 'diepAPI: HEAP16 is null');
                return memoryAccess.HEAP16[this.#address >> 1];
            }
            set i16(value) {
                assert(memoryAccess.HEAP16 !== null, 'diepAPI: HEAP16 is null');
                memoryAccess.HEAP16[this.#address >> 1] = value;
            }
            get i32() {
                assert(memoryAccess.HEAP32 !== null, 'diepAPI: HEAP32 is null');
                return memoryAccess.HEAP32[this.#address >> 2];
            }
            set i32(value) {
                assert(memoryAccess.HEAP32 !== null, 'diepAPI: HEAP32 is null');
                memoryAccess.HEAP32[this.#address >> 2] = value;
            }
            get u8() {
                assert(memoryAccess.HEAPU8 !== null, 'diepAPI: HEAPU8 is null');
                return memoryAccess.HEAPU8[this.#address];
            }
            set u8(value) {
                assert(memoryAccess.HEAPU8 !== null, 'diepAPI: HEAPU8 is null');
                memoryAccess.HEAPU8[this.#address] = value;
            }
            get u16() {
                assert(memoryAccess.HEAPU16 !== null, 'diepAPI: HEAPU16 is null');
                return memoryAccess.HEAPU16[this.#address >> 1];
            }
            set u16(value) {
                assert(memoryAccess.HEAPU16 !== null, 'diepAPI: HEAPU16 is null');
                memoryAccess.HEAPU16[this.#address >> 1] = value;
            }
            get u32() {
                assert(memoryAccess.HEAPU32 !== null, 'diepAPI: HEAPU32 is null');
                return memoryAccess.HEAPU32[this.#address >> 2];
            }
            set u32(value) {
                assert(memoryAccess.HEAPU32 !== null, 'diepAPI: HEAPU32 is null');
                memoryAccess.HEAPU32[this.#address >> 2] = value;
            }
            get f32() {
                assert(memoryAccess.HEAPF32 !== null, 'diepAPI: HEAPF32 is null');
                return memoryAccess.HEAPF32[this.#address >> 2];
            }
            set f32(value) {
                assert(memoryAccess.HEAPF32 !== null, 'diepAPI: HEAPF32 is null');
                memoryAccess.HEAPF32[this.#address >> 2] = value;
            }
            get f64() {
                assert(memoryAccess.HEAPF64 !== null, 'diepAPI: HEAPF64 is null');
                return memoryAccess.HEAPF64[this.#address >> 3];
            }
            set f64(value) {
                assert(memoryAccess.HEAPF64 !== null, 'diepAPI: HEAPF64 is null');
                memoryAccess.HEAPF64[this.#address >> 3] = value;
            }
        }
        class ScanAddress extends MemoryAddress {
            #type;
            #oldValue;
            get oldValue() {
                return this.#oldValue;
            }
            constructor(address, type) {
                super(address);
                this.#type = type;
                this.#oldValue = this.current;
            }
            get current() {
                return this[this.#type];
            }
            update() {
                this.#oldValue = this.current;
            }
        }
        class ScanSession {
            predicates = {
                unchanged: (current, old) => current === old,
                changed: (current, old) => current !== old,
                equalTo: (value) => (current, old) => current === value,
                inRange: (min, max) => (current, old) => current >= min && current <= max,
                increased: (current, old) => current > old,
                decreased: (current, old) => current < old,
            };
            #values = [];
            constructor(type) {
                this.#values = [];
                assert(memoryAccess.buffer !== null, 'diepAPI: Memory buffer is null');
                for (let addr = 0; addr < memoryAccess.buffer.byteLength; addr += DATA_TYPE_SIZES[type]) {
                    this.#values.push(new ScanAddress(addr, type));
                }
            }
            get results() {
                return this.#values;
            }
            scan(predicate) {
                this.#values = this.#values.filter((value) => predicate(value.current, value.oldValue));
                this.#values.forEach((value) => {
                    value.update();
                });
                return this;
            }
            changed() {
                return this.scan(this.predicates.changed);
            }
            unchanged() {
                return this.scan(this.predicates.unchanged);
            }
            equalTo(value) {
                return this.scan(this.predicates.equalTo(value));
            }
            inRange(min, max) {
                return this.scan(this.predicates.inRange(min, max));
            }
            increased() {
                return this.scan(this.predicates.increased);
            }
            decreased() {
                return this.scan(this.predicates.decreased);
            }
        }
        class MemoryScanner {
            createSession(type) {
                assert(memoryAccess.buffer !== null, 'diepAPI: Memory buffer is null');
                return new ScanSession(type);
            }
        }
        const memoryScanner = new MemoryScanner();

        ; // ./src/wasm/index.ts

        ; // ./src/apis/arena.ts

        class Arena {
            /**
             * @returns {Vector} The Arena size in arena units
             */
            get size() {
                if (!memoryAccess.HEAPF32) {
                    return new Vector(1, 1);
                }
                const width = Math.round(memoryAccess.HEAPF32[ARENA_WIDTH_ADDR >> 2]);
                const height = Math.round(memoryAccess.HEAPF32[ARENA_HEIGHT_ADDR >> 2]);
                return new Vector(width, height);
            }
            /**
             *
             * @param {Vector} vector The vector in [0, 1] coordinates
             * @returns {Vector} The scaled vector in [-Arena.size/2, Arena.size/2] coordinates
             */
            scale(vector) {
                const scaleX = (value) => Math.round(this.size.x * (value - 0.5));
                const scaleY = (value) => Math.round(this.size.y * (value - 0.5));
                return new Vector(scaleX(vector.x), scaleY(vector.y));
            }
            /**
             *
             * @param {Vector} vector - The scaled vector in [-Arena.size/2, Arena.size/2] coordinates
             * @returns {Vector} The unscaled vector in [0, 1] coordinates
             */
            unscale(vector) {
                const unscaleX = (value) => value / this.size.x + 0.5;
                const unscaleY = (value) => value / this.size.y + 0.5;
                return new Vector(unscaleX(vector.x), unscaleY(vector.y));
            }
        }
        const arena = new Arena();

        ; // ./src/apis/camera.ts

        class Camera {
            get position() {
                if (!memoryAccess.HEAPU32) {
                    return new Vector(0, 0);
                }
                const cameraX = Math.round(decodeFloat(memoryAccess.HEAPU32[CameraPositionX_ADDR >> 2]));
                const cameraY = Math.round(decodeFloat(memoryAccess.HEAPU32[CameraPositionY_ADDR >> 2]));
                return new Vector(cameraX, cameraY);
            }
        }
        const camera = new Camera();

        ; // ./src/apis/game.ts

        /**
         * Events:
         * - ready: Emitted when the game is ready
         * - before_frame: Emitted before the game frame starts
         * - after_frame: Emitted after the game frame ends
         * - frame_start: Emitted before `frame` and is mainly used internally to run setup code before the frame handlers
         * - frame: Emitted every frame after game logic is processed. Can be used for things that should be executed on every frame
         * - frame_end: Emitted after `frame` and is mainly used internally to update position variables
         * - state => (state): Emitted whenever the game changes its state: 'home', 'game', 'stats', 'loading', 'captcha
         * - s_home: Emitted when the game changes its state to home
         * - s_game: Emitted when the game changes its state to game
         * - s_stats: Emitted when the game changes its state to stats
         * - s_loading: Emitted when the game changes its state to loading
         * - s_captcha: Emitted when the game changes its state to captcha
         */
        class Game extends EventEmitter {
            #isReady = false;
            #shadowRoot;
            constructor() {
                super();
                CanvasKit.replaceRAF((target, thisArg, args) => {
                    super.emit('before_frame');
                    this.#onFrame();
                    const result = Reflect.apply(target, thisArg, args);
                    super.emit('after_frame');
                    return result;
                });
            }
            #onFrame() {
                if (!this.#isReady && _window.input !== undefined) {
                    this.#isReady = true;
                    this.#onready();
                }
                super.emit('frame_start');
                super.emit('frame');
                super.emit('frame_end');
            }
            #onready() {
                setTimeout(() => {
                    super.emit('ready');
                }, 100);
                // TODO: Causes the game not to load. Find a fix.
                // this.#shadowRoot = document.querySelector('d-base')?.shadowRoot;
                // if (this.#shadowRoot == null) {
                //   throw new Error('diepAPI: Shadow root does not exist.');
                // }
                // new MutationObserver((mutationList, observer) => {
                //   mutationList.forEach((mutation) => {
                //     if (mutation.addedNodes.length === 0) {
                //       return;
                //     }
                //     super.emit('state', this.state);
                //     super.emit(`s_${this.state}`);
                //   });
                // }).observe(this.#shadowRoot, { childList: true });
            }
            get state() {
                return this.#shadowRoot?.querySelector('.screen')?.tagName.slice(2).toLowerCase();
            }
            get inHome() {
                return this.state === 'home';
            }
            get inGame() {
                return this.state === 'game';
            }
            get inStats() {
                return this.state === 'stats';
            }
            get inLoading() {
                return this.state === 'loading';
            }
            get inCaptcha() {
                return this.state === 'captcha';
            }
        }
        const game = new Game();

        ; // ./src/apis/gamepad.ts
        class Gamepad {
            #axes;
            #buttons;
            connected;
            /**
             * Emulates a Gampad
             * when `gamepad.connected` is set to `true` the game will
             * ignore following keyboard inputs:
             * 		W, A, S, D, upArrow, leftArrow, downArrow, rightArray
             *      leftMouse, rightMouse, Spacebar, Shift,
             *      MouseMovement to change tank angle
             * these are also the only keys we emulate with this gamepad
             *
             */
            constructor() {
                this.#axes = [0, 0, 0, 0];
                this.#buttons = Array.from({
                    length: 17
                }, () => ({
                    pressed: false
                }));
                this.connected = false;
                // eslint-disable-next-line @typescript-eslint/unbound-method
                _window.navigator.getGamepads = new Proxy(_window.navigator.getGamepads, {
                    apply: (target, thisArg, args) => {
                        if (this.connected)
                            return [this.#toGamepad()];
                        return Reflect.apply(target, thisArg, args);
                    },
                });
            }
            set x(value) {
                this.#axes[0] = value;
            }
            get x() {
                return this.#axes[0];
            }
            set y(value) {
                this.#axes[1] = value;
            }
            get y() {
                return this.#axes[1];
            }
            set mx(value) {
                this.#axes[2] = value;
            }
            get mx() {
                return this.#axes[2];
            }
            set my(value) {
                this.#axes[3] = value;
            }
            get my() {
                return this.#axes[3];
            }
            set leftMouse(value) {
                this.#buttons[7].pressed = value;
            }
            get leftMouse() {
                return this.#buttons[7].pressed;
            }
            set rightMouse(value) {
                this.#buttons[6].pressed = value;
            }
            get rightMouse() {
                return this.#buttons[6].pressed;
            }
            #toGamepad() {
                return {
                    axes: this.#axes,
                    buttons: this.#buttons,
                    mapping: 'standard',
                };
            }
        }
        const gamepad = new Gamepad();

        ; // ./src/apis/input.ts
        const sleep = (ms) => new Promise((resolve, reject) => setTimeout(resolve, ms));
        class Input {
            keyDown(key) {
                if (typeof key == 'string') {
                    key = this.#toKeyCode(key);
                }
                const keydown = new KeyboardEvent('keydown', {
                    key: '',
                    code: '',
                    keyCode: key,
                    which: key,
                    cancelable: true,
                    composed: true,
                    bubbles: true,
                });
                _window.dispatchEvent(keydown);
            }
            keyUp(key) {
                if (typeof key == 'string') {
                    key = this.#toKeyCode(key);
                }
                const keyup = new KeyboardEvent('keyup', {
                    key: '',
                    code: '',
                    keyCode: key,
                    which: key,
                    cancelable: true,
                    composed: true,
                    bubbles: true,
                });
                _window.dispatchEvent(keyup);
            }
            async keyPress(key) {
                this.keyDown(key);
                await sleep(200);
                this.keyUp(key);
                await sleep(10);
            }
            mouse(x, y) {
                const mousemove = new MouseEvent('mousemove', {
                    clientX: x,
                    clientY: y,
                    cancelable: true,
                    composed: true,
                    bubbles: true,
                });
                _window.dispatchEvent(mousemove);
            }
            /**
             * button: 0 = left, 1 = middle, 2 = right
             */
            mouseDown(x, y, button) {
                const mouseDown = new MouseEvent('mousedown', {
                    clientX: x,
                    clientY: y,
                    button: button,
                    cancelable: true,
                    composed: true,
                    bubbles: true,
                });
                _window.dispatchEvent(mouseDown);
            }
            /**
             * button: 0 = left, 1 = middle, 2 = right
             */
            mouseUp(x, y, button) {
                const mouseUp = new MouseEvent('mouseup', {
                    clientX: x,
                    clientY: y,
                    button: button,
                    cancelable: true,
                    composed: true,
                    bubbles: true,
                });
                _window.dispatchEvent(mouseUp);
            }
            /**
             * button: 0 = left, 1 = middle, 2 = right
             */
            async mousePress(x, y, button) {
                this.mouseDown(x, y, button);
                await sleep(200);
                this.mouseUp(x, y, button);
                await sleep(10);
            }
            #toKeyCode(key) {
                if (key.length != 1) {
                    throw new Error(`diepAPI: Unsupported key: ${key}`);
                }
                return key.toUpperCase().charCodeAt(0);
            }
        }
        const input = new Input();

        ; // ./src/apis/minimap.ts

        /**
         * The Minimap API
         */
        class Minimap {
            #minimapDim = new Vector(1, 1);
            #minimapPos = new Vector(0, 0);
            #arrowPos = new Vector(0.5, 0.5);
            constructor() {
                this.#minimapHook();
                this.#arrowHook();
            }
            get minimapDim() {
                return this.#minimapDim;
            }
            get minimapPos() {
                return this.#minimapPos;
            }
            get arrowPos() {
                return this.#arrowPos;
            }
            #minimapHook() {
                CanvasKit.hookCtx('strokeRect', (target, thisArg, args) => {
                    const transform = thisArg.getTransform();
                    this.#minimapDim = new Vector(transform.a, transform.d);
                    this.#minimapPos = new Vector(transform.e, transform.f);
                });
            }
            #arrowHook() {
                CanvasKit.hookPolygon(3, (vertices, ctx) => {
                    const side1 = Math.round(Vector.distance(vertices[0], vertices[1]));
                    const side2 = Math.round(Vector.distance(vertices[0], vertices[2]));
                    const side3 = Math.round(Vector.distance(vertices[1], vertices[2]));
                    if (side1 === side2 && side2 === side3)
                        return;
                    const centroid = Vector.centroid(...vertices);
                    const arrowPos = Vector.subtract(centroid, this.#minimapPos);
                    const position = Vector.divide(arrowPos, this.#minimapDim);
                    this.#arrowPos = position;
                });
            }
        }
        const minimap = new Minimap();

        ; // ./src/apis/player_movement.ts

        class PlayerMovement extends Movement {
            /**
             * Using the minimap arrow to get the player position and velocity
             */
            constructor() {
                super();
                game.on('frame_end', () => {
                    super.updatePos(camera.position);
                });
            }
        }
        const playerMovement = new PlayerMovement();

        ; // ./src/apis/scaling.ts

        class Scaling {
            get windowRatio() {
                return Math.max(_window.innerWidth / 1920, _window.innerHeight / 1080);
            }
            get scalingFactor() {
                return this.fov * this.windowRatio;
            }
            get fov() {
                if (!memoryAccess.HEAPU32) {
                    return 0;
                }
                const fov = memoryAccess.HEAPU32[FOV_ADDR >> 2];
                return decodeFloat(fov);
            }
            /**
             *
             * @param {Vector} v The vector in canvas units
             * @returns {Vector} The vector in arena units
             */
            toArenaUnits(v) {
                return Vector.round(Vector.unscale(this.scalingFactor, v));
            }
            /**
             *
             * @param {Vector} v The vector in arena units
             * @returns {Vector} The vector in canvas units
             */
            toCanvasUnits(v) {
                return Vector.round(Vector.scale(this.scalingFactor, v));
            }
            /**
             * Will translate coordinates from canvas to arena
             * @param {Vector} canvasPos The canvas coordinates
             * @returns {Vector} The `canvasPos` translated to arena coordinates
             */
            toArenaPos(canvasPos) {
                const direction = Vector.subtract(canvasPos, this.screenToCanvas(new Vector(_window.innerWidth / 2, _window.innerHeight / 2)));
                const scaled = this.toArenaUnits(direction);
                const arenaPos = Vector.add(scaled, camera.position);
                return arenaPos;
            }
            /**
             * Will translate coordinates from arena to canvas
             * @param {Vector} arenaPos The arena coordinates
             * @returns {Vector} The `arenaPos` translated to canvas coordinates
             */
            toCanvasPos(arenaPos) {
                const direction = Vector.subtract(arenaPos, camera.position);
                const scaled = this.toCanvasUnits(direction);
                const canvasPos = Vector.add(scaled, this.screenToCanvas(new Vector(_window.innerWidth / 2, _window.innerHeight / 2)));
                return canvasPos;
            }
            screenToCanvasUnits(n) {
                return n * _window.devicePixelRatio;
            }
            canvasToScreenUnits(n) {
                return n / _window.devicePixelRatio;
            }
            /**
             * Will translate coordinates from screen to canvas
             * @param v The screen coordinates
             * @returns The canvas coordinates
             */
            screenToCanvas(v) {
                return Vector.scale(_window.devicePixelRatio, v);
            }
            /**
             * Will translate coordinates from canvas to screen
             * @param v The canvas coordinates
             * @returns the screen coordinates
             */
            canvasToScreen(v) {
                return Vector.scale(1 / _window.devicePixelRatio, v);
            }
        }
        const scaling = new Scaling();

        ; // ./src/apis/player.ts

        const player_sleep = (ms) => new Promise((r) => setTimeout(r, ms));
        class Player extends EventEmitter {
            #isDead = true;
            #mouseLock = false;
            #mouseCanvasPos = new Vector(0, 0);
            #mousePos = new Vector(0, 0);
            #username = _window.localStorage.name ?? '';
            #gamemode = _window.localStorage.selected_gamemode ?? '';
            #level = 1;
            #tank = 'Tank';
            constructor() {
                super();
                game.once('ready', () => {
                    //Check dead or alive
                    game.on('frame', () => {
                        const isDead = document.getElementById('dimmer')?.dataset.isActive === 'true';
                        if (this.#isDead == isDead)
                            return;
                        this.#isDead = isDead;
                        if (this.#isDead)
                            void this.#ondead();
                        else
                            void this.#onspawn();
                    });
                    //update mouse position
                    game.on('frame', () => {
                        this.#mousePos = scaling.toArenaPos(this.#mouseCanvasPos);
                    });
                    //Mouse events
                    // TODO: mouseLock wont work here since the game uses addEventListener. Need to hook into that instead. Maybe we can extend event_proxy.ts to support this.
                    _window.onmousemove = new Proxy(_window.onmousemove ??
                        (() => {
                            /* empty */
                        }), {
                            apply: (target, thisArg, args) => {
                                if (this.#mouseLock)
                                    return;
                                this.#onmousemove(args[0]);
                                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                                return Reflect.apply(target, thisArg, args);
                            },
                        });
                    _window.onmousedown = new Proxy(_window.onmousedown ??
                        (() => {
                            /* empty */
                        }), {
                            apply: (target, thisArg, args) => {
                                if (this.#mouseLock)
                                    return;
                                this.#onmousedown(args[0]);
                                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                                return Reflect.apply(target, thisArg, args);
                            },
                        });
                    _window.onmouseup = new Proxy(_window.onmouseup ??
                        (() => {
                            /* empty */
                        }), {
                            apply: (target, thisArg, args) => {
                                if (this.#mouseLock)
                                    return;
                                this.#onmouseup(args[0]);
                                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                                return Reflect.apply(target, thisArg, args);
                            },
                        });
                    //Key events
                    _window.onkeydown = new Proxy(_window.onkeydown ??
                        (() => {
                            /* empty */
                        }), {
                            apply: (target, thisArg, args) => {
                                this.#onkeydown(args[0]);
                                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                                return Reflect.apply(target, thisArg, args);
                            },
                        });
                    _window.onkeyup = new Proxy(_window.onkeyup ??
                        (() => {
                            /* empty */
                        }), {
                            apply: (target, thisArg, args) => {
                                this.#onkeyup(args[0]);
                                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                                return Reflect.apply(target, thisArg, args);
                            },
                        });
                    // tank and level event listener
                    CanvasKit.hookCtx('fillText', (target, thisArg, args) => {
                        const text = args[0];
                        const match = /^Lvl (\d+) (.+)$/.exec(text);
                        if (match == null) {
                            return;
                        }
                        const newLevel = Number(match[1]);
                        const newTank = match[2];
                        // make sure to trigger events for all levels in between.
                        while (newLevel > this.#level + 1) {
                            super.emit('level', ++this.#level);
                        }
                        if (newLevel !== this.#level)
                            super.emit('level', newLevel);
                        if (newTank !== this.#tank)
                            super.emit('tank', newTank);
                        this.#level = newLevel;
                        this.#tank = match[2];
                    });
                });
            }
            get position() {
                return playerMovement.position;
            }
            get velocity() {
                return playerMovement.velocity;
            }
            get mouse() {
                return this.#mousePos;
            }
            get isDead() {
                return this.#isDead;
            }
            get gamemode() {
                return this.#gamemode;
            }
            get level() {
                return this.#level;
            }
            get tank() {
                return this.#tank;
            }
            /**
             * Predict where this object will be after `time`
             * @param time The time in ms
             */
            predictPos(time) {
                return playerMovement.predictPos(time);
            }
            async #ondead() {
                await player_sleep(50);
                super.emit('dead');
            }
            async #onspawn() {
                this.#gamemode = _window.localStorage.selected_gamemode ?? '';
                this.#username = _window.localStorage.player_name ?? '';
                await player_sleep(50);
                super.emit('spawn');
            }
            useGamepad(value) {
                gamepad.connected = value;
            }
            async spawn(name = this.#username) {
                await Promise.resolve();
                if (!this.#isDead) {
                    return;
                }
                const spawnNameInput = document.getElementById('spawn-nickname');
                spawnNameInput.select();
                // eslint-disable-next-line @typescript-eslint/no-deprecated
                document.execCommand('insertText', false, name);
                document.getElementById('spawn-button')?.click();
            }
            async upgrade_stat(id, level) {
                if (id < 1 || id > 8)
                    throw new Error(`diepAPI: ${id.toString()} is not a supported stat`);
                input.keyDown(85);
                for (let i = 0; i < level; i++) {
                    await input.keyPress(48 + id);
                }
                input.keyUp(85);
                await player_sleep(250);
            }
            async upgrade_tank(index) {
                if (index < 1)
                    throw new Error(`diepAPI: ${index.toString()} is not a supported tank index`);
                index -= 1;
                const x_index = index % 2;
                const y_index = Math.floor(index / 2);
                const x = scaling.screenToCanvasUnits(scaling.windowRatio * (x_index * 115 + 97.5));
                const y = scaling.screenToCanvasUnits(scaling.windowRatio * (y_index * 110 + 120));
                this.#mouseLock = true;
                await input.mousePress(x, y, 0);
                // wait 200 ms before disabling mouselock
                await player_sleep(200);
                this.#mouseLock = false;
                // wait 1500 ms for the animation to finish
                await player_sleep(1500);
            }
            moveTo(arenaPos) {
                if (gamepad.connected) {
                    const direction = Vector.subtract(arenaPos, this.position);
                    const distance = Vector.len(direction);
                    if (distance === 0) {
                        gamepad.x = 0;
                        gamepad.y = 0;
                        return;
                    }
                    //max speed
                    const velocity = Vector.scale(1 / distance, direction);
                    gamepad.x = velocity.x;
                    gamepad.y = velocity.y;
                } else {
                    const direction = Vector.subtract(arenaPos, this.position);
                    if (direction.x > 0) {
                        input.keyUp('a');
                        input.keyDown('d');
                    } else if (direction.x < 0) {
                        input.keyUp('d');
                        input.keyDown('a');
                    } else {
                        input.keyUp('a');
                        input.keyUp('d');
                    }
                    if (direction.y > 0) {
                        input.keyUp('w');
                        input.keyDown('s');
                    } else if (direction.y < 0) {
                        input.keyUp('s');
                        input.keyDown('w');
                    } else {
                        input.keyUp('w');
                        input.keyUp('s');
                    }
                }
            }
            lookAt(arenaPos) {
                const position = scaling.toCanvasPos(arenaPos);
                input.mouse(position.x, position.y);
                this.#onmousemove({
                    clientX: position.x,
                    clientY: position.y
                });
            }
            #onmousemove(e) {
                this.#mouseCanvasPos = scaling.screenToCanvas(new Vector(e.clientX, e.clientY));
                if (gamepad.connected) {
                    const arenaPos = scaling.toArenaPos(this.#mouseCanvasPos);
                    const direction = Vector.subtract(arenaPos, this.position);
                    let axes = Vector.scale(scaling.fov / 1200 / 1.1, direction);
                    const length = Vector.len(axes);
                    if (length !== 0 && length < 0.15) {
                        axes = Vector.scale(0.15 / length, axes);
                    }
                    gamepad.mx = axes.x;
                    gamepad.my = axes.y;
                }
            }
            #onmousedown(e) {
                // eslint-disable-next-line @typescript-eslint/no-deprecated
                if (gamepad.connected)
                    this.#onkeydown({
                        keyCode: e.which
                    });
            }
            #onmouseup(e) {
                // eslint-disable-next-line @typescript-eslint/no-deprecated
                if (gamepad.connected)
                    this.#onkeyup({
                        keyCode: e.which
                    });
            }
            #onkeydown(e) {
                // eslint-disable-next-line @typescript-eslint/no-deprecated
                super.emit('keydown', e.keyCode);
                if (gamepad.connected) {
                    // eslint-disable-next-line @typescript-eslint/no-deprecated
                    switch (e.keyCode) {
                        case 37:
                        case 65:
                            gamepad.x = -1;
                            break;
                        case 40:
                        case 83:
                            gamepad.y = 1;
                            break;
                        case 38:
                        case 87:
                            gamepad.y = -1;
                            break;
                        case 39:
                        case 68:
                            gamepad.x = 1;
                            break;
                        case 1:
                        case 32:
                            gamepad.leftMouse = true;
                            break;
                        case 3:
                        case 16:
                            gamepad.rightMouse = true;
                            break;
                    }
                }
            }
            #onkeyup(e) {
                // eslint-disable-next-line @typescript-eslint/no-deprecated
                super.emit('keyup', e.keyCode);
                if (gamepad.connected) {
                    // eslint-disable-next-line @typescript-eslint/no-deprecated
                    switch (e.keyCode) {
                        case 37:
                        case 65:
                            gamepad.x = 0;
                            break;
                        case 40:
                        case 83:
                            gamepad.y = 0;
                            break;
                        case 38:
                        case 87:
                            gamepad.y = 0;
                            break;
                        case 39:
                        case 68:
                            gamepad.x = 0;
                            break;
                        case 1:
                        case 32:
                            gamepad.leftMouse = false;
                            break;
                        case 3:
                        case 16:
                            gamepad.rightMouse = false;
                            break;
                    }
                }
            }
        }
        const player = new Player();

        ; // ./src/apis/index.ts

        ; // ./src/tools/background_overlay.ts

        class BackgroundOverlay {
            canvas;
            ctx;
            #gameCanvas;
            #gameContext;
            constructor() {
                this.canvas = CanvasKit.createCanvas();
                const ctx = this.canvas.getContext('2d');
                if (ctx == null) {
                    throw new Error('diepAPI: Your browser does not support canvas.');
                }
                this.ctx = ctx;
                _window.addEventListener('resize', () => {
                    this.#onResize();
                });
                game.on('frame_start', () => {
                    this.#onFrameStart();
                });
                this.#onResize();
                game.once('ready', () => {
                    this.#gameCanvas = document.getElementById('canvas');
                    if (this.#gameCanvas == null) {
                        throw new Error('diepAPI: Game canvas does not exist.');
                    }
                    this.#gameContext = this.#gameCanvas.getContext('2d');
                    if (this.#gameContext == null) {
                        throw new Error('diepAPI: Game canvas context does not exist.');
                    }
                    this.#hookBackground();
                });
            }
            #onResize() {
                this.canvas.width = _window.innerWidth * _window.devicePixelRatio;
                this.canvas.height = _window.innerHeight * _window.devicePixelRatio;
            }
            #onFrameStart() {
                this.canvas.width = _window.innerWidth * _window.devicePixelRatio;
                this.canvas.height = _window.innerHeight * _window.devicePixelRatio;
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.ctx.setTransform(1, 0, 0, 1, 0, 0);
            }
            #hookBackground() {
                CanvasKit.overrideCtx('fillRect', (target, thisArg, args) => {
                    if (typeof thisArg.fillStyle !== 'object' || this.#gameContext == null) {
                        Reflect.apply(target, thisArg, args);
                        return;
                    }
                    Reflect.apply(target, thisArg, args);
                    this.#gameContext.save();
                    this.#gameContext.setTransform(1, 0, 0, 1, 0, 0);
                    this.#gameContext.globalAlpha = 1;
                    this.#gameContext.drawImage(this.canvas, 0, 0);
                    this.#gameContext.restore();
                });
            }
        }
        const backgroundOverlay = new BackgroundOverlay();

        ; // ./src/types/entity.ts

        var EntityType;
        (function(EntityType) {
            EntityType[EntityType["Player"] = 0] = "Player";
            EntityType[EntityType["Bullet"] = 1] = "Bullet";
            EntityType[EntityType["Drone"] = 2] = "Drone";
            EntityType[EntityType["Trap"] = 3] = "Trap";
            EntityType[EntityType["Square"] = 4] = "Square";
            EntityType[EntityType["Triangle"] = 5] = "Triangle";
            EntityType[EntityType["Pentagon"] = 6] = "Pentagon";
            EntityType[EntityType["Hexagon"] = 7] = "Hexagon";
            EntityType[EntityType["AlphaPentagon"] = 8] = "AlphaPentagon";
            EntityType[EntityType["Crasher"] = 9] = "Crasher";
            EntityType[EntityType["UNKNOWN"] = 10] = "UNKNOWN";
        })(EntityType || (EntityType = {}));
        var EntityColor;
        (function(EntityColor) {
            EntityColor["TeamBlue"] = "#00b2e1";
            EntityColor["TeamRed"] = "#f14e54";
            EntityColor["TeamPurple"] = "#bf7ff5";
            EntityColor["TeamGreen"] = "#00e16e";
            EntityColor["Square"] = "#ffe869";
            EntityColor["Triangle"] = "#fc7677";
            EntityColor["Pentagon"] = "#768dfc";
            EntityColor["Hexagon"] = "#35c5db";
            // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
            EntityColor["AlphaPentagon"] = "#768dfc";
            EntityColor["Crasher"] = "#f177dd";
            EntityColor["NecromancerDrone"] = "#fcc376";
        })(EntityColor || (EntityColor = {}));
        const TeamColors = [
            EntityColor.TeamBlue,
            EntityColor.TeamRed,
            EntityColor.TeamPurple,
            EntityColor.TeamGreen,
        ];
        /**
         * Represents an ingame Entity.
         *
         * Holds minimal information currently.
         */
        class Entity extends Movement {
            type;
            parent;
            extras;
            constructor(type, parent, extras) {
                super();
                this.type = type;
                this.parent = parent;
                this.extras = extras;
            }
            updatePos(newPos) {
                super.updatePos(newPos);
            }
        }

        ; // ./src/apis/entity_manager.ts

        const random_id = () => Math.random().toString(36).slice(2, 5);
        /**
         * Entity Manager is used to access the information about the entities, that are currently drawn on the screen.
         * To access the entities the EntityManager exposes the EntityManager.entities field.
         */
        class EntityManager {
            #entities = [];
            #entitiesLastFrame = this.#entities;
            constructor() {
                game.on('frame_end', () => {
                    this.#entitiesLastFrame = this.#entities;
                    this.#entities = [];
                });
                this.#triangleHook();
                this.#squareHook();
                this.#pentagonHook();
                this.#hexagonHook();
                //when is a bullet being drawn?
                //when is a player being drawn?
                this.#playerHook();
            }
            get entities() {
                return this.#entities;
            }
            /**
             *
             * @returns The own player entity
             */
            getPlayer() {
                const player = this.#entities.filter((entity) => entity.type == EntityType.Player &&
                    Vector.distance(entity.position, playerMovement.position) < 28);
                return player[0];
            }
            /**
             * Adds the entity to `#entities`.
             *
             * Will either find the entity in `#entitiesLastFrame` or create a new `Entity`.
             */
            #add(type, position, extras) {
                let entity = this.#findEntity(type, position);
                if (!entity) {
                    const parent = this.#findParent(type, position);
                    entity = new Entity(type, parent, {
                        id: random_id(),
                        timestamp: performance.now(),
                        ...extras,
                    });
                }
                //TODO: remove radius from extras
                entity.extras.radius = extras.radius;
                entity.updatePos(position);
                this.#entities.push(entity);
            }
            /**
             * If an entity is newly created, try to find it's parent entity.
             */
            #findParent(type, position) {
                if (type == EntityType.Bullet) {
                    // TODO: do we want to change the parent entity to EntityType.Barrel in the future?
                    return this.#findEntity(EntityType.Player, position, 300);
                }
            }
            /**
             * Searches `#entitiesLastFrame` for the entity that is closest to `position`
             * @returns the entity or null if there is no match.
             */
            #findEntity(type, position, tolerance = 42) {
                let result = undefined;
                let shortestDistance = Infinity;
                this.#entitiesLastFrame.forEach((entity) => {
                    if (entity.type !== type)
                        return;
                    const distance = Vector.distance(entity.position, position);
                    if (distance < shortestDistance) {
                        shortestDistance = distance;
                        result = entity;
                    }
                });
                if (shortestDistance > tolerance) {
                    return undefined;
                }
                return result;
            }
            #triangleHook() {
                CanvasKit.hookPolygon(3, (vertices, ctx) => {
                    const side1 = Math.round(Vector.distance(vertices[0], vertices[1]));
                    const side2 = Math.round(Vector.distance(vertices[0], vertices[2]));
                    const side3 = Math.round(Vector.distance(vertices[1], vertices[2]));
                    //ignore minimap arrow
                    if (side1 !== side2 || side2 !== side3)
                        return;
                    //ignore leader arrow
                    if ('#000000' === ctx.fillStyle)
                        return;
                    vertices = vertices.map((x) => scaling.toArenaPos(x));
                    const position = Vector.centroid(...vertices);
                    const radius = Math.round(Vector.radius(...vertices));
                    const color = ctx.fillStyle;
                    let type = EntityType.UNKNOWN;
                    switch (radius) {
                        case 23:
                            //battleship drone
                            if (TeamColors.includes(color))
                                type = EntityType.Drone;
                            break;
                        case 30:
                            //base drone
                            if (TeamColors.includes(color))
                                type = EntityType.Drone;
                            break;
                        case 35:
                            //small crasher
                            if (EntityColor.Crasher === color)
                                type = EntityType.Crasher;
                            break;
                        case 40:
                        case 41:
                        case 42:
                        case 43:
                        case 44:
                        case 45:
                        case 46:
                            //overseer/overlord drone
                            if (TeamColors.includes(color))
                                type = EntityType.Drone;
                            break;
                        case 55:
                            //big crasher
                            if (EntityColor.Crasher === color)
                                type = EntityType.Crasher;
                            //triangle
                            if (EntityColor.Triangle === color)
                                type = EntityType.Triangle;
                            break;
                    }
                    this.#add(type, position, {
                        color,
                        radius
                    });
                });
            }
            #squareHook() {
                CanvasKit.hookPolygon(4, (vertices, ctx) => {
                    vertices = vertices.map((x) => scaling.toArenaPos(x));
                    const position = Vector.centroid(...vertices);
                    const radius = Math.round(Vector.radius(...vertices));
                    const color = ctx.fillStyle;
                    let type = EntityType.UNKNOWN;
                    switch (radius) {
                        case 55:
                            //square
                            if (EntityColor.Square === color)
                                type = EntityType.Square;
                            //necromancer drone
                            if (TeamColors.includes(color) || EntityColor.NecromancerDrone === color)
                                type = EntityType.Drone;
                            break;
                    }
                    this.#add(type, position, {
                        color,
                        radius
                    });
                });
            }
            #pentagonHook() {
                CanvasKit.hookPolygon(5, (vertices, ctx) => {
                    vertices = vertices.map((x) => scaling.toArenaPos(x));
                    const position = Vector.centroid(...vertices);
                    const radius = Math.round(Vector.radius(...vertices));
                    const color = ctx.fillStyle;
                    let type = EntityType.UNKNOWN;
                    switch (radius) {
                        case 75:
                            if (EntityColor.Pentagon === color)
                                type = EntityType.Pentagon;
                            break;
                        case 200:
                            if (EntityColor.AlphaPentagon === color)
                                type = EntityType.AlphaPentagon;
                            break;
                    }
                    this.#add(type, position, {
                        color,
                        radius
                    });
                });
            }
            #hexagonHook() {
                CanvasKit.hookPolygon(6, (vertices, ctx) => {
                    vertices = vertices.map((x) => scaling.toArenaPos(x));
                    const position = Vector.centroid(...vertices);
                    const radius = Math.round(Vector.radius(...vertices));
                    const color = ctx.fillStyle;
                    let type = EntityType.UNKNOWN;
                    switch (radius) {
                        case 100:
                            if (EntityColor.Hexagon === color)
                                type = EntityType.Hexagon;
                            break;
                    }
                    this.#add(type, position, {
                        color,
                        radius
                    });
                });
            }
            #playerHook() {
                let index = 0;
                let position;
                let color;
                let radius;
                const onCircle = () => {
                    position = scaling.toArenaPos(position);
                    radius = scaling.toArenaUnits(new Vector(radius, radius)).x;
                    let type = EntityType.UNKNOWN;
                    if (radius > 53) {
                        type = EntityType.Player;
                    } else {
                        type = EntityType.Bullet;
                    }
                    this.#add(type, position, {
                        color,
                        radius,
                    });
                };
                //Sequence: beginPath -> arc -> fill -> beginPath -> arc -> fill -> arc
                CanvasKit.hookCtx('beginPath', (target, thisArg, args) => {
                    //start
                    if (index !== 3) {
                        index = 1;
                        return;
                    }
                    // TODO: check if this is a bug.
                    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                    if (index === 3) {
                        index++;
                        return;
                    }
                    index = 0;
                });
                //check when a circle is drawn.
                CanvasKit.hookCtx('arc', (target, thisArg, args) => {
                    //outline
                    if (index === 1) {
                        index++;
                        const transform = thisArg.getTransform();
                        position = new Vector(transform.e, transform.f);
                        radius = transform.a;
                        return;
                    }
                    if (index === 4) {
                        index++;
                        color = thisArg.fillStyle;
                        return;
                    }
                    //last arc call
                    if (index === 6) {
                        index++;
                        onCircle();
                        return;
                    }
                    index = 0;
                });
                CanvasKit.hookCtx('fill', (target, thisArg, args) => {
                    if (index === 2) {
                        index++;
                        return;
                    }
                    if (index === 5) {
                        index++;
                        return;
                    }
                    index = 0;
                });
            }
        }
        const entityManager = new EntityManager();

        ; // ./src/tools/overlay.ts

        class Overlay {
            canvas;
            ctx;
            #gameCanvas;
            #gameContext;
            constructor() {
                this.canvas = CanvasKit.createCanvas();
                const ctx = this.canvas.getContext('2d');
                if (ctx == null) {
                    throw new Error('diepAPI: Your browser does not support canvas.');
                }
                this.ctx = ctx;
                _window.addEventListener('resize', () => {
                    this.#onResize();
                });
                game.on('frame_start', () => {
                    this.#onFrameStart();
                });
                this.#onResize();
                game.once('ready', () => {
                    this.#gameCanvas = document.getElementById('canvas');
                    if (this.#gameCanvas == null) {
                        throw new Error('diepAPI: Game canvas does not exist.');
                    }
                    this.#gameContext = this.#gameCanvas.getContext('2d');
                    if (this.#gameContext == null) {
                        throw new Error('diepAPI: Game canvas context does not exist.');
                    }
                    game.on('frame_end', () => {
                        this.#drawOnGameCanvas();
                    });
                });
            }
            #onResize() {
                this.canvas.width = _window.innerWidth * _window.devicePixelRatio;
                this.canvas.height = _window.innerHeight * _window.devicePixelRatio;
            }
            #onFrameStart() {
                this.canvas.width = _window.innerWidth * _window.devicePixelRatio;
                this.canvas.height = _window.innerHeight * _window.devicePixelRatio;
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.ctx.setTransform(1, 0, 0, 1, 0, 0);
            }
            #drawOnGameCanvas() {
                if (this.#gameContext == null) {
                    return;
                }
                this.#gameContext.save();
                this.#gameContext.setTransform(1, 0, 0, 1, 0, 0);
                this.#gameContext.globalAlpha = 1;
                this.#gameContext.drawImage(this.canvas, 0, 0);
                this.#gameContext.restore();
            }
        }
        const overlay = new Overlay();

        ; // ./src/tools/debug_tool.ts

        class DebugTool {
            #drawBoundingBox = false;
            #drawVelocity = false;
            #drawParent = false;
            #drawInfo = false;
            #drawStats = false;
            constructor() {
                game.on('frame', () => {
                    entityManager.entities.forEach((entity) => {
                        const position = scaling.toCanvasPos(entity.position);
                        const futurePos = scaling.toCanvasPos(entity.predictPos(1000));
                        const dimensions = scaling.toCanvasUnits(new Vector(2 * (entity.extras.radius ?? 0), 2 * (entity.extras.radius ?? 0)));
                        if (this.#drawBoundingBox) {
                            this.#_drawboundingBox(entity, position, dimensions);
                        }
                        if (this.#drawVelocity) {
                            this.#_drawVelocity(position, futurePos);
                        }
                        if (this.#drawParent) {
                            this.#_drawParent(entity, position);
                        }
                        if (this.#drawInfo) {
                            this.#_drawInfo(entity, position, dimensions);
                        }
                    });
                    if (this.#drawStats) {
                        this.#_drawStats();
                    }
                });
            }
            drawAll(v) {
                this.#drawBoundingBox = v;
                this.#drawVelocity = v;
                this.#drawParent = v;
                this.#drawInfo = v;
                this.#drawStats = v;
            }
            drawBoundingBox(v) {
                this.#drawBoundingBox = v;
            }
            drawVelocity(v) {
                this.#drawVelocity = v;
            }
            drawParent(v) {
                this.#drawParent = v;
            }
            drawInfo(v) {
                this.#drawInfo = v;
            }
            drawStats(v) {
                this.#drawStats = v;
            }
            #_drawboundingBox(entity, position, dimensions) {
                overlay.ctx.save();
                overlay.ctx.strokeStyle =
                    entity.type === EntityType.UNKNOWN ? '#ffffff' : (entity.extras.color ?? '#ffffff');
                overlay.ctx.lineWidth = scaling.toCanvasUnits(new Vector(5, 5)).x;
                overlay.ctx.strokeRect(position.x - dimensions.x / 2, position.y - dimensions.y / 2, dimensions.x, dimensions.y);
                overlay.ctx.restore();
            }
            #_drawVelocity(position, futurePos) {
                overlay.ctx.save();
                overlay.ctx.strokeStyle = '#000000';
                overlay.ctx.lineWidth = scaling.toCanvasUnits(new Vector(5, 5)).x;
                overlay.ctx.beginPath();
                overlay.ctx.moveTo(position.x, position.y);
                overlay.ctx.lineTo(futurePos.x, futurePos.y);
                overlay.ctx.stroke();
                overlay.ctx.restore();
            }
            #_drawParent(entity, position) {
                if (entity.parent == null) {
                    return;
                }
                const parentPos = scaling.toCanvasPos(entity.parent.position);
                overlay.ctx.save();
                overlay.ctx.strokeStyle = '#8aff69';
                overlay.ctx.lineWidth = scaling.toCanvasUnits(new Vector(5, 5)).x;
                overlay.ctx.beginPath();
                overlay.ctx.moveTo(position.x, position.y);
                overlay.ctx.lineTo(parentPos.x, parentPos.y);
                overlay.ctx.stroke();
                overlay.ctx.restore();
            }
            #_drawInfo(entity, position, dimensions) {
                overlay.ctx.save();
                const fontSize = scaling.toCanvasUnits(new Vector(30, 30)).x;
                overlay.ctx.font = `${fontSize}px Ubuntu`;
                overlay.ctx.fillStyle = `#ffffff`;
                overlay.ctx.strokeStyle = '#000000';
                overlay.ctx.lineWidth = fontSize / 5;
                const text = `${entity.extras.id} ${Math.floor((performance.now() - entity.extras.timestamp) / 1000)}`;
                const textMetrics = overlay.ctx.measureText(text);
                const textWidth = textMetrics.actualBoundingBoxRight + textMetrics.actualBoundingBoxLeft;
                const textHeight = textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent;
                overlay.ctx.strokeText(text, position.x - textWidth / 2, position.y - dimensions.y / 2 - textHeight / 2);
                overlay.ctx.fillText(text, position.x - textWidth / 2, position.y - dimensions.y / 2 - textHeight / 2);
                const positionText = `${entity.position.x.toFixed()},${entity.position.y.toFixed()}`;
                const positionTextMetrics = overlay.ctx.measureText(positionText);
                const positionTextWidth = positionTextMetrics.actualBoundingBoxRight + positionTextMetrics.actualBoundingBoxLeft;
                const positionTextHeight = positionTextMetrics.actualBoundingBoxAscent + positionTextMetrics.actualBoundingBoxDescent;
                overlay.ctx.strokeText(positionText, position.x - positionTextWidth / 2, position.y + dimensions.y / 2 + positionTextHeight);
                overlay.ctx.fillText(positionText, position.x - positionTextWidth / 2, position.y + dimensions.y / 2 + positionTextHeight);
                overlay.ctx.restore();
            }
            #_drawStats() {
                const text = `Debug Tool:
        Game Info:
        gamemode: ${player.gamemode}
        entities: ${entityManager.entities.length}

        Player Info:
        Is dead: ${player.isDead}
        level: ${player.level}
        tank: ${player.tank}
        position: ${Math.round(player.position.x)},${Math.round(player.position.y)}
        mouse: ${Math.round(player.mouse.x)},${Math.round(player.mouse.y)}
        velocity [units/seconds]: ${Math.round(Math.hypot(player.velocity.x, player.velocity.y))}

        Arena Info:
        width: ${Math.round(arena.size.x)}
        height: ${Math.round(arena.size.y)}

        Camera Info:
        position: ${camera.position.x},${camera.position.y}
        scaling factor: ${scaling.scalingFactor}
        fov: ${scaling.fov}

        Minimap Info:
        minimapDim: ${minimap.minimapDim.x},${minimap.minimapDim.y}
        minimapPos: ${minimap.minimapPos.x},${minimap.minimapPos.y}
        arrowPos: ${minimap.arrowPos.x},${minimap.arrowPos.y}
        `;
                overlay.ctx.save();
                const fontSize = 20 * _window.devicePixelRatio;
                overlay.ctx.font = `${fontSize}px Ubuntu`;
                overlay.ctx.fillStyle = `#ffffff`;
                overlay.ctx.strokeStyle = '#000000';
                overlay.ctx.lineWidth = fontSize / 5;
                text.split('\n').forEach((x, i) => {
                    overlay.ctx.strokeText(x, 0, _window.innerHeight * 0.25 + i * fontSize * 1.05);
                    overlay.ctx.fillText(x, 0, _window.innerHeight * 0.25 + i * fontSize * 1.05);
                });
                overlay.ctx.restore();
            }
        }
        const debugTool = new DebugTool();

        ; // ./src/tools/index.ts

        ; // ./src/types/index.ts

        ; // ./src/index.ts
        /*
         * This file defines the public API of the diepAPI library.
         * All exports from this file are accessible by the global object `diepAPI`.
         */
        // import patches first.

        diepAPI = __webpack_exports__;
        /******/
    })();

    _window.diepAPI = diepAPI;

    //alert("discord : ddatios._. | feel free to contact me if you have any problems :)");

    window.oncontextmenu = () => false;
    (() => {
        let FovAhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh = 0.5;

        function setFov(value) {
            const wasm = diepAPI.wasm;
            if (!wasm?.memoryAccess?.HEAPU32) return;

            const addr = wasm.config.FOV_ADDR >> 2;
            wasm.memoryAccess.HEAPU32[addr] = wasm.codec.encodeFloat(value);
        }

        diepAPI.wasm.wasmInstance.on('instantiated', () => {
            console.log('wasm ready :)');

            diepAPI.apis.game.on('frame', () => {
                setFov(FovAhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh);
            });
        });

        const prevOnWheel = window.onwheel;

        window.onwheel = function(e) {
            const el = document.activeElement;
            if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)) {
                if (prevOnWheel) return prevOnWheel.call(this, e);
                return;
            }

            FovAhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh += e.deltaY > 0 ? -0.05 : 0.05;

            if (FovAhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh < 0.1) FovAhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh = 0.1;
            if (FovAhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh > 4) FovAhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh = 4;

            console.log('fov set : ', FovAhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh.toFixed(2));

            if (prevOnWheel) return prevOnWheel.call(this, e);
        };
    })();

})();
