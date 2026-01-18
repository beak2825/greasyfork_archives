// ==UserScript==
// @name         DiepCheatz Aim Bot, Esp, Prediction
// @description  Advance Menu, Aimbot, Prediction, Esp, Line, FOV Aim, Smart System
// @version      1.1.5
// @author       DDatiOS
// @match        https://diep.io/*
// @icon         https://www.google.com/s2/favicons?domain=diep.io
// @run-at       document-start
// @grant        none
// @namespace https://greasyfork.org/users/1541498
// @downloadURL https://update.greasyfork.org/scripts/556889/DiepCheatz%20Aim%20Bot%2C%20Esp%2C%20Prediction.user.js
// @updateURL https://update.greasyfork.org/scripts/556889/DiepCheatz%20Aim%20Bot%2C%20Esp%2C%20Prediction.meta.js
// ==/UserScript==


(function () {
    'use strict';

    if (document.getElementById("dd-warning-popup")) return;

    const fa = document.createElement("link");
    fa.rel = "stylesheet";
    fa.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css";
    document.head.appendChild(fa);

    const style = document.createElement("style");
    style.textContent = `
    @keyframes ddWarnIn {
        from { opacity: 0; transform: translate(-50%, -60%) scale(0.85); }
        to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    }

    .dd-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.75);
        backdrop-filter: blur(6px);
        z-index: 99998;
    }

    .dd-popup {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 380px;
        padding: 20px;
        border-radius: 16px;
        background: linear-gradient(145deg, #1a0f0f, #0d0707);
        border: 1px solid rgba(255, 80, 80, 0.6);
        box-shadow:
            0 0 30px rgba(255, 60, 60, 0.6),
            inset 0 0 10px rgba(255,255,255,0.04);
        color: #fff;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
        animation: ddWarnIn 0.35s ease forwards;
        z-index: 99999;
    }

    .dd-header {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 12px;
    }

    .dd-header i {
        font-size: 26px;
        color: #ff5c5c;
        line-height: 1;
        filter: drop-shadow(0 0 8px #ff5c5c);
    }

    .dd-title {
        font-size: 20px;
        font-weight: 700;
        color: #ff6b6b;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .dd-body {
        font-size: 14px;
        line-height: 1.55;
        opacity: 0.92;
        margin-bottom: 16px;
    }

    .dd-body b {
        color: #ffd1d1;
    }

    .dd-actions {
        display: flex;
        gap: 12px;
    }

    .dd-btn {
        flex: 1;
        padding: 11px 12px;
        border-radius: 10px;
        border: none;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;

        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;

        line-height: 1;
        white-space: nowrap;
        transition: 0.25s;
    }

    .dd-btn i {
        font-size: 16px;
        line-height: 1;
        display: block;
    }

    .dd-discord {
        background: linear-gradient(135deg, #5865F2, #404EED);
        color: #fff;
        box-shadow: 0 0 14px rgba(88,101,242,0.6);
    }

    .dd-discord:hover {
        transform: scale(1.05);
        box-shadow: 0 0 22px rgba(88,101,242,0.9);
    }

    .dd-close {
        background: rgba(255,255,255,0.08);
        color: #ccc;
    }

    .dd-close:hover {
        background: rgba(255,255,255,0.15);
    }

    .dd-footer {
        margin-top: 12px;
        text-align: center;
        font-size: 11px;
        opacity: 0.55;
    }
    `;
    document.head.appendChild(style);

    const overlay = document.createElement("div");
    overlay.className = "dd-overlay";

    const popup = document.createElement("div");
    popup.className = "dd-popup";
    popup.id = "dd-warning-popup";

    popup.innerHTML = `
        <div class="dd-header">
            <i class="fa-solid fa-triangle-exclamation"></i>
            <div class="dd-title">Script Patched</div>
        </div>

        <div class="dd-body">
            This script has been detected and patched by the developer.<br><br>
            To avoid faster patches caused by public sharing,
            future updates will only be released inside our
            <b>private Discord server</b>.
        </div>

        <div class="dd-actions">
            <button class="dd-btn dd-discord">
                <i class="fa-brands fa-discord"></i>
                <span>Join Discord</span>
            </button>

            <button class="dd-btn dd-close">
                <i class="fa-solid fa-xmark"></i>
                <span>Close</span>
            </button>
        </div>

        <div class="dd-footer">
            Private release • Anti-patch policy
        </div>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(popup);

    popup.querySelector(".dd-discord").onclick = () => {
        window.open("https://discord.gg/EwT9YWt5dm", "_blank");
    };

    popup.querySelector(".dd-close").onclick = () => {
        popup.remove();
        overlay.remove();
    };
})();

//Script Made By DDatiOS
//Discord : ddatios._.


//still have some bugs but good enough for now

//Use DiepAPI as base
//Credit to Cazka
(() => {
  const _window = 'undefined' == typeof unsafeWindow ? window : unsafeWindow;
  if (_window.diepAPI) return;

  var diepAPI;
  /******/
  (() => { // webpackBootstrap
    /******/
    "use strict";
    /******/ // The require scope
    /******/
    var __webpack_require__ = {};
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
      extensions: () => ( /* reexport */ extensions_namespaceObject),
      tools: () => ( /* reexport */ tools_namespaceObject),
      types: () => ( /* reexport */ types_namespaceObject)
    });

    // NAMESPACE OBJECT: ./src/apis/index.ts
    var apis_namespaceObject = {};
    __webpack_require__.r(apis_namespaceObject);
    __webpack_require__.d(apis_namespaceObject, {
      arena: () => (arena),
      camera: () => (camera),
      game: () => (game),
      input: () => (input),
      minimap: () => (minimap),
      player: () => (player),
      playerMovement: () => (playerMovement),
      scaling: () => (scaling)
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

    // NAMESPACE OBJECT: ./src/extensions/index.ts
    var extensions_namespaceObject = {};
    __webpack_require__.r(extensions_namespaceObject);
    __webpack_require__.d(extensions_namespaceObject, {
      debugTool: () => (debugTool),
      entityManager: () => (entityManager)
    });

    // NAMESPACE OBJECT: ./src/tools/index.ts
    var tools_namespaceObject = {};
    __webpack_require__.r(tools_namespaceObject);
    __webpack_require__.d(tools_namespaceObject, {
      backgroundOverlay: () => (backgroundOverlay),
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

    ; // CONCATENATED MODULE: ./src/core/vector.ts
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

    ; // CONCATENATED MODULE: ./src/core/canvas_kit.ts

    const CANVAS_KIT_BYPASS = Symbol('CanvasKit-bypass');
    class CanvasKit {
      /**
       * If you need a canvas then create it with this method.
       */
      static createCanvas() {
        const canvas = document.createElement('canvas');
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
       * The consumer will be called before
       */
      static hookCtx(method, consumer, useOffscreenCtx = false) {
        const target = useOffscreenCtx ?
          _window.OffscreenCanvasRenderingContext2D.prototype :
          _window.CanvasRenderingContext2D.prototype;
        target[method] = new Proxy(target[method], {
          apply(target, thisArg, args) {
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
        const onFillPolygon = (ctx) => cb(vertices, ctx);
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

    ; // CONCATENATED MODULE: ./src/core/event_emitter.ts
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

    ; // CONCATENATED MODULE: ./src/apis/game.ts

    /**
     * Events:
     * - ready: Emitted when the game is ready
     * - frame_start: Emitted before `frame`.
     * - frame: Emitted every frame. Can be used for things that should be executed on every frame
     * - frame_end: Emitted after `frame` and is mainly used internally to update position variables
     * - state => (state): Emitted whenever the game changes its state: 'home', 'game', 'stats', 'loading', 'captcha
     * - s_home: Emitted when the game changes its state to home
     * - s_game: Emitted when the game changes its state to game
     * - s_stats: Emitted when the game changes its state to stats
     * - s_loading: Emitted when the game changes its state to loading
     * - s_captcha: Emitted when the game changes its state to captcha
     */
    class Game extends EventEmitter {
      #ready = false;
      #shadowRoot;
      constructor() {
        super();
        CanvasKit.hookRAF(() => {
          this.#onframe();
        });
      }
      #onframe() {
        if (!this.#ready && _window.input !== undefined) {
          this.#ready = true;
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
        const screen = document.querySelector('d-base')?.shadowRoot?.querySelector('.screen');
        if (screen) {
          return screen.tagName.slice(2).toLowerCase();
        }
        // Fallback or default state if not found
        if (document.getElementById('loading-bar')) return 'loading';
        if (document.getElementById('main-menu')) return 'home';
        if (document.getElementById('canvas')) return 'game';
        return 'unknown';
      }
      get inHome() {
        return this.state === 'home';
      }
      get inGame() {
        // A more reliable check for being in-game
        return document.getElementById('canvas')?.style.display !== 'none' && !document.querySelector('[data-is-active=true]');
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

    ; // CONCATENATED MODULE: ./src/apis/minimap.ts

    /**
     * The Minimap API
     */
    class Minimap {
      #minimapDim = new Vector(1, 1);
      #minimapPos = new Vector(0, 0);
      #viewportDim = new Vector(1, 1);
      #viewportPos = new Vector(1, 1);
      #arrowPos = new Vector(0.5, 0.5);
      #drawViewport = false;
      constructor() {
        game.once('ready', () => {
          if (_window.input == null) {
            throw new Error('diepAPI: window.input does not exist.');
          }
          _window.input.set_convar('ren_minimap_viewport', 'true');
          _window.input.set_convar = new Proxy(_window.input.set_convar, {
            apply: (target, thisArg, args) => {
              if (args[0] === 'ren_minimap_viewport') {
                this.#drawViewport = args[1];
                return;
              }
              return Reflect.apply(target, thisArg, args);
            },
          });
        });
        this.#minimapHook();
        this.#viewportHook();
        this.#arrowHook();
      }
      get minimapDim() {
        return this.#minimapDim;
      }
      get minimapPos() {
        return this.#minimapPos;
      }
      get viewportDim() {
        return this.#viewportDim;
      }
      get viewportPos() {
        return this.#viewportPos;
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
      #viewportHook() {
        CanvasKit.overrideCtx('fillRect', (target, thisArg, args) => {
          const transform = thisArg.getTransform();
          if (Math.round(thisArg.globalAlpha * 10) / 10 !== 0.1) {
            Reflect.apply(target, thisArg, args);
            return;
          }
          if (Math.abs(transform.a / transform.d - _window.innerWidth / _window.innerHeight) >
            (_window.innerWidth / _window.innerHeight) * 0.00005) {
            Reflect.apply(target, thisArg, args);
            return;
          }
          this.#viewportDim = new Vector(transform.a, transform.d);
          this.#viewportPos = new Vector(transform.e, transform.f);
          if (this.#drawViewport) {
            Reflect.apply(target, thisArg, args);
            return;
          }
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

    ; // CONCATENATED MODULE: ./src/apis/camera.ts

    class Camera {
      #position = new Vector(0, 0);
      constructor() {
        game.on('frame_end', () => {
          const center = Vector.add(minimap.viewportPos, Vector.unscale(2, minimap.viewportDim));
          const cameraPos = Vector.subtract(center, minimap.minimapPos);
          const normalized = Vector.divide(cameraPos, minimap.minimapDim);
          this.#position = arena.scale(normalized);
        });
      }
      get position() {
        return this.#position;
      }
    }
    const camera = new Camera();

    ; // CONCATENATED MODULE: ./src/apis/scaling.ts

    class Scaling {
      #scalingFactor = 1;
      #drawSolidBackground = false;
      constructor() {
        // TODO: game.on('ready')
        setTimeout(() => {
          if (_window.input == null) {
            throw new Error('diepAPI: window.input does not exist.');
          }
          _window.input.set_convar = new Proxy(_window.input.set_convar, {
            apply: (target, thisArg, args) => {
              if (args[0] === 'ren_solid_background')
                this.#drawSolidBackground = args[1];
              else
                Reflect.apply(target, thisArg, args);
            },
          });
        }, 1000);
        CanvasKit.overrideCtx('stroke', (target, thisArg, args) => {
          if (thisArg.fillStyle !== '#cccccc') {
            Reflect.apply(target, thisArg, args);
            return;
          }
          if (thisArg.globalAlpha === 0) {
            Reflect.apply(target, thisArg, args);
            return;
          }
          this.#scalingFactor = thisArg.globalAlpha * 10;
          if (!this.#drawSolidBackground) {
            Reflect.apply(target, thisArg, args);
            return;
          }
        });
      }
      get windowRatio() {
        return Math.max(_window.innerWidth / 1920, _window.innerHeight / 1080);
      }
      get scalingFactor() {
        return this.#scalingFactor;
      }
      get fov() {
        return this.#scalingFactor / this.windowRatio;
      }
      /**
       *
       * @param {Vector} v The vector in canvas units
       * @returns {Vector} The vector in arena units
       */
      toArenaUnits(v) {
        return Vector.round(Vector.unscale(this.#scalingFactor, v));
      }
      /**
       *
       * @param {Vector} v The vector in arena units
       * @returns {Vector} The vector in canvas units
       */
      toCanvasUnits(v) {
        return Vector.round(Vector.scale(this.#scalingFactor, v));
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

    ; // CONCATENATED MODULE: ./src/apis/arena.ts

    class Arena {
      #size = 1;
      constructor() {
        setInterval(() => {
          const ratio = Vector.divide(minimap.minimapDim, minimap.viewportDim);
          const arenaDim = Vector.multiply(ratio, scaling.screenToCanvas(new Vector(_window.innerWidth, _window.innerHeight)));
          const arenaSize = scaling.toArenaUnits(arenaDim);
          this.#size = arenaSize.x;
        }, 16);
      }
      /**
       * @returns {number} The Arena size in arena units
       */
      get size() {
        return this.#size;
      }
      /**
       *
       * @param {Vector} vector The vector in [0, 1] coordinates
       * @returns {Vector} The scaled vector in [-Arena.size/2, Arena.size/2] coordinates
       */
      scale(vector) {
        const scale = (value) => Math.round(this.#size * (value - 0.5));
        return new Vector(scale(vector.x), scale(vector.y));
      }
      /**
       *
       * @param {Vector} vector - The scaled vector in [-Arena.size/2, Arena.size/2] coordinates
       * @returns {Vector} The unscaled vector in [0, 1] coordinates
       */
      unscale(vector) {
        const unscale = (value) => value / this.#size + 0.5;
        return new Vector(unscale(vector.x), unscale(vector.y));
      }
    }
    const arena = new Arena();

    ; // CONCATENATED MODULE: ./src/apis/input.ts

    const sleep = (ms) => new Promise((resolve, reject) => setTimeout(resolve, ms));
    class Input {
      #gameCanvas;
      constructor() {
        game.once('ready', () => {
          this.#gameCanvas = document.getElementById('canvas');
          if (this.#gameCanvas == null) {
            throw new Error('diepAPI: Game canvas does not exist.');
          }
        });
      }
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
        this.#gameCanvas?.dispatchEvent(mousemove);
      }
      /**
       * button: 0 = left, 1 = middle, 2 = right
       */
      mouseDown(button) {
        const mouseDown = new MouseEvent('mousedown', {
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
      mouseUp(button) {
        const mouseUp = new MouseEvent('mouseup', {
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
      async mousePress(button) {
        this.mouseDown(button);
        await sleep(200);
        this.mouseUp(button);
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

    ; // CONCATENATED MODULE: ./src/apis/gamepad.ts
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

    ; // CONCATENATED MODULE: ./src/core/movement.ts

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

    ; // CONCATENATED MODULE: ./src/apis/player_movement.ts

    class PlayerMovement extends Movement {
      /**
       * Using the minimap arrow to get the player position and velocity
       */
      constructor() {
        super();
        game.on('frame_end', () => {
          super.updatePos(arena.scale(minimap.arrowPos));
        });
      }
    }
    const playerMovement = new PlayerMovement();

    ; // CONCATENATED MODULE: ./src/apis/player.ts

    const player_sleep = (ms) => new Promise((resolve, reject) => setTimeout(resolve, ms));
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
          const canvas = document.getElementById('canvas');
          if (canvas == null) {
            throw new Error('diepAPI: Game canvas does not exist.');
          }
          canvas.onmousemove = new Proxy(canvas.onmousemove ??
            (() => {
              /* empty */
            }), {
              apply: (target, thisArg, args) => {
                if (this.#mouseLock)
                  return;
                this.#onmousemove(args[0]);
                return Reflect.apply(target, thisArg, args);
              },
            });
          canvas.onmousedown = new Proxy(canvas.onmousedown ??
            (() => {
              /* empty */
            }), {
              apply: (target, thisArg, args) => {
                if (this.#mouseLock)
                  return;
                this.#onmousedown(args[0]);
                return Reflect.apply(target, thisArg, args);
              },
            });
          canvas.onmouseup = new Proxy(canvas.onmouseup ??
            (() => {
              /* empty */
            }), {
              apply: (target, thisArg, args) => {
                if (this.#mouseLock)
                  return;
                this.#onmouseup(args[0]);
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
                return Reflect.apply(target, thisArg, args);
              },
            });
          _window.onkeyup = new Proxy(_window.onkeyup ??
            (() => {
              /* empty */
            }), {
              apply: (target, thisArg, args) => {
                this.#onkeyup(args[0]);
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
        document.execCommand('insertText', false, name);
        document.getElementById('spawn-button')?.click();
      }
      async upgrade_stat(id, level) {
        if (id < 1 || id > 8)
          throw new Error(`diepAPI: ${id} is not a supported stat`);
        input.keyDown(85);
        for (let i = 0; i < level; i++) {
          await input.keyPress(48 + id);
        }
        input.keyUp(85);
        await player_sleep(250);
      }
      async upgrade_tank(index) {
        if (index < 1)
          throw new Error(`diepAPI: ${index} is not a supported tank index`);
        index -= 1;
        const x_index = index % 2;
        const y_index = Math.floor(index / 2);
        const x = scaling.screenToCanvasUnits(scaling.windowRatio * (x_index * 115 + 97.5));
        const y = scaling.screenToCanvasUnits(scaling.windowRatio * (y_index * 110 + 120));
        this.#mouseLock = true;
        input.mouse(x, y);
        await input.mousePress(0);
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
        input.mouse(position.x / _window.devicePixelRatio, position.y / _window.devicePixelRatio);
        this.#onmousemove({
          clientX: position.x / _window.devicePixelRatio,
          clientY: position.y / _window.devicePixelRatio
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
        if (gamepad.connected)
          this.#onkeydown({
            keyCode: e.which
          });
      }
      #onmouseup(e) {
        if (gamepad.connected)
          this.#onkeyup({
            keyCode: e.which
          });
      }
      #onkeydown(e) {
        super.emit('keydown', e.keyCode);
        if (gamepad.connected) {
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
        super.emit('keyup', e.keyCode);
        if (gamepad.connected) {
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

    ; // CONCATENATED MODULE: ./src/apis/index.ts

    ; // CONCATENATED MODULE: ./src/core/index.ts

    ; // CONCATENATED MODULE: ./src/tools/overlay.ts

    class Overlay {
      canvas;
      ctx;
      constructor() {
        this.canvas = CanvasKit.createCanvas();
        const ctx = this.canvas.getContext('2d');
        if (ctx == null) {
          throw new Error('diepAPI: Your browser does not support canvas.');
        }
        this.ctx = ctx;
        game.once('ready', () => {
          document.body.appendChild(this.canvas);
          _window.addEventListener('resize', () => {
            this.#onResize();
          });
          game.on('frame_start', () => {
            this.#onFrameStart();
          });
          this.#onResize();
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
    }
    const overlay = new Overlay();

    ; // CONCATENATED MODULE: ./src/types/entity.ts

    var EntityType;
    (function(EntityType) {
      EntityType[EntityType["Player"] = 0] = "Player";
      EntityType[EntityType["Bullet"] = 1] = "Bullet";
      EntityType[EntityType["Drone"] = 2] = "Drone";
      EntityType[EntityType["Trap"] = 3] = "Trap";
      EntityType[EntityType["Square"] = 4] = "Square";
      EntityType[EntityType["Triangle"] = 5] = "Triangle";
      EntityType[EntityType["Pentagon"] = 6] = "Pentagon";
      EntityType[EntityType["AlphaPentagon"] = 7] = "AlphaPentagon";
      EntityType[EntityType["Crasher"] = 8] = "Crasher";
      EntityType[EntityType["UNKNOWN"] = 9] = "UNKNOWN";
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

    ; // CONCATENATED MODULE: ./src/extensions/extension.ts
    class Extension {
      onload;
      #loaded = false;
      constructor(onload) {
        this.onload = onload;
      }
      load() {
        if (this.#loaded) {
          return;
        }
        this.#loaded = true;
        this.onload();
      }
    }

    ; // CONCATENATED MODULE: ./src/extensions/entity_manager.ts

    const random_id = () => Math.random().toString(36).slice(2, 5);
    /**
     * Entity Manager is used to access the information about the entities, that are currently drawn on the screen.
     * To access the entities the EntityManager exposes the EntityManager.entities field.
     */
    class EntityManager extends Extension {
      #entities = [];
      #entitiesLastFrame = this.#entities;
      constructor() {
        super(() => {
          game.on('frame_end', () => {
            this.#entitiesLastFrame = this.#entities;
            this.#entities = [];
          });
          this.#triangleHook();
          this.#squareHook();
          this.#pentagonHook();
          //when is a bullet being drawn?
          //when is a player being drawn?
          this.#playerHook();
        });
      }
      get entities() {
        return this.#entities;
      }
      get entitiesLastFrame() {
        return this.#entitiesLastFrame;
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
                    if (EntityColor.Square === color) {
                        type = EntityType.Square;
                    } else if (TeamColors.includes(color) || EntityColor.NecromancerDrone === color) {
                        type = EntityType.Drone;
                    }
                    break;
                default:
                    if (radius > 56 && TeamColors.includes(color)) {
                        type = EntityType.Player;
                    }
                    break;
            }
            if (type !== EntityType.UNKNOWN) {
                this.#add(type, position, { color, radius });
            }
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

    ; // CONCATENATED MODULE: ./src/extensions/debug_tool.ts

    class DebugTool extends Extension {
      #drawBoundingBox = false;
      #drawVelocity = false;
      #drawParent = false;
      #drawInfo = false;
      #drawStats = false;
      constructor() {
        super(() => {
          entityManager.load();
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
        size: ${Math.round(arena.size)}

        Camera Info:
        position: ${camera.position.x},${camera.position.y}
        scaling factor: ${scaling.scalingFactor}
        fov: ${scaling.fov}

        Minimap Info:
        minimapDim: ${minimap.minimapDim.x},${minimap.minimapDim.y}
        minimapPos: ${minimap.minimapPos.x},${minimap.minimapPos.y}
        viewportDim: ${minimap.viewportDim.x},${minimap.viewportDim.y}
        viewportPos: ${minimap.viewportPos.x},${minimap.viewportPos.y}
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

    ; // CONCATENATED MODULE: ./src/extensions/index.ts

    ; // CONCATENATED MODULE: ./src/tools/background_overlay.ts

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

    ; // CONCATENATED MODULE: ./src/tools/index.ts

    ; // CONCATENATED MODULE: ./src/types/index.ts

    ; // CONCATENATED MODULE: ./src/index.ts

    diepAPI = __webpack_exports__;
    /******/
  })();

  _window.diepAPI = diepAPI;

  (async () => {
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    while (!_window.diepAPI || !_window.diepAPI.apis || !_window.diepAPI.extensions) {
      await sleep(100);
    }

    const {
      scaling,
      game,
      player
    } = _window.diepAPI.apis;
    const {
      entityManager
    } = _window.diepAPI.extensions;
    const {
      overlay
    } = _window.diepAPI.tools;
    const {
      Vector
    } = _window.diepAPI.core;
    const {
      EntityType,
      EntityColor
    } = _window.diepAPI.types;

    try {
      entityManager.load();
    } catch (e) {}

    if (overlay.canvas) {
      overlay.canvas.style.zIndex = "999999";
      overlay.canvas.style.pointerEvents = "none";
    }

    const CONFIG = {
      aimbot: true,
      aimPrediction: true,
      teamModeSupport: true,
      showPredictionCircle: true,
      priority: 'smart',
      fov: 1000,
      esp: true,
      espLines: true,
      showFov: true,
      aimTracer: true,
      snowfall: true,
      lineWidth: 2,
      cEnemy: '#ff3b30',
      cTeam: '#30D158',
      cFarm: '#ffcc00',
      cPenta: '#007aff',
      cTrace: '#FFFFFF',
      cFov: '#ffffff',
      keys: {
        toggleMenu: 'Escape',
        toggleAimbot: 'KeyB',
        toggleEsp: 'KeyN',
        toggleLines: 'KeyL'
      }
    };

    let measuredBulletSpeed = 1500; //1500
    const bulletSpeedSamples = [];
    const MAX_SAMPLES = 20;
    let myNewBullets = new Set();
    const snowflakes = [];

    function solveQuadratic(a, b, c) {
      let result = null;
      if (Math.abs(a) < 1e-6) {
        if (Math.abs(b) < 1e-6) result = Math.abs(c) < 1e-6 ? [0, 0] : null;
        else result = [-c / b, -c / b];
      } else {
        let disc = b * b - 4 * a * c;
        if (disc >= 0) {
          disc = Math.sqrt(disc);
          a = 2 * a;
          result = [(-b - disc) / a, (-b + disc) / a];
        }
      }
      return result;
    }

    function calculateInterception(source, target, bulletSpeed) {
      const tx = target.x - source.x,
        ty = target.y - source.y,
        tvx = target.vx,
        tvy = target.vy;
      const a = tvx * tvx + tvy * tvy - bulletSpeed * bulletSpeed;
      const b = 2 * (tvx * tx + tvy * ty);
      const c = tx * tx + ty * ty;
      const solutions = solveQuadratic(a, b, c);
      if (solutions) {
        let t = Math.min(solutions[0], solutions[1]);
        if (t < 0.01) t = Math.max(solutions[0], solutions[1]);
        if (t > 0.01) return new Vector(target.x + tvx * t, target.y + tvy * t);
      }
      return null;
    }

    const css = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap');
    :root {
        --bg-main: #121212;
        --bg-secondary: #1E1E1E;
        --border-color: #333333;
        --text-primary: #EAEAEA;
        --text-secondary: #888888;
        --accent-active: #FFFFFF;
        --accent-bg: #2B2B2B;
        --font-main: 'Inter', sans-serif;
        --font-mono: 'JetBrains Mono', monospace;
    }
    #ios-gui *{box-sizing:border-box;font-family: var(--font-main);user-select:none;outline:none}
    #open-hint{position:fixed;top:40%;left:50%;transform:translateX(-50%);background:rgba(20,20,25,.8);backdrop-filter:blur(10px);border:1px solid var(--border-color);color:#fff;padding:12px 24px;border-radius:12px;font-size:16px;font-weight:500;z-index:9999999;transition:opacity .5s ease,top .5s ease;pointer-events:none}
    #open-hint.fade-out{opacity:0;top:38%}
    #open-hint span{font-family: var(--font-mono); background:rgba(255,255,255,.1);padding:3px 6px;border-radius:6px;margin:0 4px}
    #ios-menu{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) scale(.95);width:800px;height:550px;background-color:var(--bg-main);border:1px solid var(--border-color);border-radius:24px;box-shadow:0 25px 50px -12px rgba(0,0,0,.75);display:none;opacity:0;transition:all .4s cubic-bezier(.19,1,.22,1);overflow:hidden;z-index:9999998;}
    #ios-menu.open{display:flex;opacity:1;transform:translate(-50%,-50%) scale(1);pointer-events:auto}
    #ios-menu:not(.open){pointer-events:none}
    .sidebar{width:240px;background:transparent;border-right:1px solid var(--border-color);padding:20px 10px;display:flex;flex-direction:column;position:relative;}
    .nav-glider{position:absolute;left:10px;width:calc(100% - 20px);height:44px;background:var(--accent-bg);border-radius:10px;transition:top .4s cubic-bezier(.25,.8,.25,1);z-index:0;pointer-events:none; border: 1px solid var(--border-color);}
    .nav-item{position:relative;z-index:1;padding:0 16px;margin-bottom:4px;border-radius:10px;color:var(--text-secondary);font-weight:500;font-size:15px;cursor:pointer;transition:color .3s;height:44px;display:flex;align-items:center;gap:14px;}
    .nav-item:hover,.nav-item.active{color:var(--accent-active); font-weight: 600;}
    .nav-item svg { width: 20px; height: 20px; stroke-width: 2; transition: all .3s; }
    .nav-item.active svg { color: var(--accent-active); }
    .content{flex:1;padding:30px 40px;overflow-y:auto;position: relative;}
    .content::-webkit-scrollbar{display:none}
    .tab-page{display:none;animation:fadeSlide .4s ease}.tab-page.active{display:block}@keyframes fadeSlide{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
    .header{font-size:28px;font-weight:700;color:var(--text-primary);margin-bottom:25px; letter-spacing: -0.5px;}
    .card{background: var(--bg-secondary);border-radius:16px;overflow:hidden;margin-bottom:20px;border:1px solid var(--border-color);}
    .row{display:flex;justify-content:space-between;align-items:center;padding:16px 20px;border-bottom:1px solid var(--border-color)}.row:last-child{border-bottom:none}
    .label{font-size:15px;font-weight:500;color:var(--text-primary)}
    .ios-switch{width:50px;height:30px;background:var(--bg-secondary);border:1px solid var(--border-color);border-radius:15px;position:relative;cursor:pointer;transition:.3s}.ios-switch::after{content:'';position:absolute;top:2px;left:2px;width:24px;height:24px;background:var(--text-secondary);border-radius:50%;transition:.3s}.ios-switch.active{background:var(--accent-active); border-color: var(--accent-active);}.ios-switch.active::after{background: var(--bg-main); transform:translateX(20px);}
    .key-btn{background:var(--bg-secondary);padding:6px 12px;border-radius:8px;color:var(--text-primary);font-family:var(--font-mono);font-size:13px;font-weight:500;border:1px solid var(--border-color);cursor:pointer;min-width:80px;text-align:center}.key-btn.recording{background:#ff453a;border-color:#ff453a}
    input[type=range]{-webkit-appearance:none;width:160px;height:4px;background:var(--border-color);border-radius:2px;}
    input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;background:var(--text-primary);border-radius:50%;cursor:pointer;}
    input[type=color]{-webkit-appearance:none;border:none;width:32px;height:32px;border-radius:50%;background:0 0;cursor:pointer}input[type=color]::-webkit-color-swatch{border:2px solid var(--border-color);border-radius:50%}
    select{background:var(--bg-secondary);color:var(--text-primary);border:1px solid var(--border-color);padding:6px 12px;border-radius:8px;font-size:14px;cursor:pointer;}
    .changelog-content, .info-content { color: var(--text-secondary); line-height: 1.6; font-size: 14px;}
    .changelog-content h3, .info-content h3 { color: var(--text-primary); font-weight: 600; margin-top: 20px; margin-bottom: 8px; border-bottom: 1px solid var(--border-color); padding-bottom: 5px; }
    .changelog-content ul, .info-content ul { list-style: none; padding-left: 0; }
    .changelog-content li, .info-content li { margin-bottom: 5px; padding-left: 1.5em; position: relative; }
    .changelog-content li::before, .info-content li::before { content: '•'; color: var(--text-primary); position: absolute; left: 0; }
    .info-content a { color: var(--text-primary); text-decoration: none; }
    .info-content a:hover { text-decoration: underline; }
    `;
    const s = document.createElement('style');
    s.innerHTML = css;
    document.head.appendChild(s);
    const gui = document.createElement('div');
    gui.id = 'ios-gui';

    const menu = document.createElement('div');
    menu.id = 'ios-menu';

    menu.innerHTML = `
<div class="sidebar">
    <div class="nav-glider" id="nav-glider"></div>

    <div class="nav-item active" data-target="combat">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
        </svg>
        Combat
    </div>

    <div class="nav-item" data-target="visuals">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
        </svg>
        Visuals
    </div>

    <div class="nav-item" data-target="colors">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"/>
        </svg>
        Colors
    </div>

    <div class="nav-item" data-target="binds">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M5 11h14M5 15h14M8 11V5H6a2 2 0 00-2 2v2m12 0V7a2 2 0 00-2-2h-2M8 15v4a2 2 0 002 2h4a2 2 0 002-2v-4M8 5a2 2 0 012-2h4a2 2 0 012 2v2"/>
        </svg>
        Keybinds
    </div>

    <div class="nav-item" data-target="info">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        Info
    </div>

    <div class="nav-item" data-target="changelog">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
        </svg>
        Changelog
    </div>
</div>

<div class="content">

    <div id="tab-combat" class="tab-page active">
        <div class="header">Combat</div>
        <div class="card">

            <div class="row">
                <span class="label">Aimbot Enabled</span>
                <div class="ios-switch" id="chk-aimbot"></div>
            </div>

            <div class="row">
                <span class="label">Aim Prediction (Bug on recently game update)</span>
                <div class="ios-switch" id="chk-aimPrediction"></div>
            </div>

            <div class="row">
                <span class="label">Team Mode Support</span>
                <div class="ios-switch" id="chk-teamModeSupport"></div>
            </div>

            <div class="row">
                <span class="label">Priority</span>
                <select id="sel-priority">
                    <option value="smart">Smart (Enemy)</option>
                    <option value="player">Player Only</option>
                    <option value="distance">Distance</option>
                </select>
            </div>

            <div class="row">
                <span class="label">FOV Radius</span>
                <input type="range" id="rng-fov" min="100" max="4000">
            </div>

        </div>
    </div>

    <div id="tab-visuals" class="tab-page">
        <div class="header">Visuals</div>
        <div class="card">

            <div class="row">
                <span class="label">Draw ESP</span>
                <div class="ios-switch" id="chk-esp"></div>
            </div>

            <div class="row">
                <span class="label">Trace Lines</span>
                <div class="ios-switch" id="chk-espLines"></div>
            </div>

            <div class="row">
                <span class="label">Aim Tracer</span>
                <div class="ios-switch" id="chk-aimTracer"></div>
            </div>

            <div class="row">
                <span class="label">FOV Ring</span>
                <div class="ios-switch" id="chk-showFov"></div>
            </div>

            <div class="row">
                <span class="label">Show Prediction Point</span>
                <div class="ios-switch" id="chk-showPredictionCircle"></div>
            </div>

            <div class="row">
                <span class="label">Snowfall Effect</span>
                <div class="ios-switch" id="chk-snowfall"></div>
            </div>

            <div class="row">
                <span class="label">Line Width</span>
                <input type="range" id="rng-lineWidth" min="1" max="6">
            </div>

        </div>
    </div>

    <div id="tab-colors" class="tab-page">
        <div class="header">Colors</div>
        <div class="card">
            <div class="row">
                <span class="label">Enemy</span>
                <input type="color" id="col-cEnemy">
            </div>

            <div class="row">
                <span class="label">Teammate</span>
                <input type="color" id="col-cTeam">
            </div>

            <div class="row">
                <span class="label">Farm</span>
                <input type="color" id="col-cFarm">
            </div>

            <div class="row">
                <span class="label">Penta</span>
                <input type="color" id="col-cPenta">
            </div>

            <div class="row">
                <span class="label">Tracer</span>
                <input type="color" id="col-cTrace">
            </div>
        </div>
    </div>

    <div id="tab-binds" class="tab-page">
        <div class="header">Keybinds</div>
        <div class="card">
            <div class="row">
                <span class="label">Toggle Menu</span>
                <div class="key-btn" id="bind-toggleMenu"></div>
            </div>

            <div class="row">
                <span class="label">Toggle Aimbot</span>
                <div class="key-btn" id="bind-toggleAimbot"></div>
            </div>

            <div class="row">
                <span class="label">Toggle ESP</span>
                <div class="key-btn" id="bind-toggleEsp"></div>
            </div>

            <div class="row">
                <span class="label">Toggle Lines</span>
                <div class="key-btn" id="bind-toggleLines"></div>
            </div>
        </div>
    </div>

    <div id="tab-info" class="tab-page">
        <div class="header">Information</div>
        <div class="info-content">
            <h3>DCheatz v1.1.4 Beta</h3>
            <p>This is a script for diep.io made with love by DDatiOS.</p>
            <ul>
                <li><b>User rate good on greasyfork you can trust this is the best script ever</li>
                <li><b>Easy to use</li>
                <li><b>Thank to me :)</li>
            </ul>
            <p>Made With Love <3</p>
        </div>
    </div>

    <div id="tab-changelog" class="tab-page">
        <div class="header">Changelog</div>
        <div class="changelog-content">

            <h3>Version 1.1.1</h3>
            <ul>
                <li>Aim Prediction 95%</li>
                <li>Add TeamMode Support</li>
                <li>Fix Aimbot to teammate</li>
            </ul>

            <h3>Version 1.1.0</h3>
            <ul>
                <li>Aimbot FOV Radius change to 4000</li>
            </ul>

            <h3>Version 1.0.9</h3>
            <ul>
                <li>Optimize aim prediction accuracy</li>
            </ul>

            <h3>Version 1.0.8</h3>
            <ul>
                <li>Add Aim Prediction</li>
            </ul>

            <h3>Version 1.0.7</h3>
            <ul>
                <li>Optimize aimbot v2</li>
            </ul>

            <h3>Version 1.0.6</h3>
            <ul>
                <li>Add hint for open menu</li>
            </ul>

            <h3>Version 1.0.5</h3>
            <ul>
                <li>Update API</li>
            </ul>

            <h3>Version 1.0.4</h3>
            <ul>
                <li>Fix Aimbot aim to tank self</li>
            </ul>

            <h3>Version 1.0.3</h3>
            <ul>
                <li>Optimize Aimbot</li>
                <li>Optimize FOV Aim</li>
            </ul>

            <h3>Version 1.0.2</h3>
            <ul>
                <li>Add New Theme for menu</li>
                <li>Add snow effect</li>
            </ul>

            <h3>Version 1.0.1</h3>
            <ul>
                <li>Fix Menu Display</li>
            </ul>

            <h3>Version 1.0.0</h3>
            <ul>
                <li>Script Created</li>
            </ul>

        </div>
    </div>

</div>
`;

    gui.appendChild(menu);
    document.body.appendChild(gui);

    /*const hint = document.createElement('div');
    hint.id = 'open-hint';
    hint.innerHTML = 'Press <span>ESC</span> to open menu';
    document.body.appendChild(hint);
    setTimeout(() => {
      hint.classList.add('fade-out');
      setTimeout(() => hint.remove(), 500);
    }, 4000);*/

    let isOpen = !1;
    const menuEl = document.getElementById('ios-menu'),
      glider = document.getElementById('nav-glider');

    function toggleMenu() {
      isOpen = !isOpen, isOpen ? (menuEl.style.display = 'flex', moveGlider(document.querySelector('.nav-item.active')), setTimeout(() => menuEl.classList.add('open'), 10)) : (menuEl.classList.remove('open'), setTimeout(() => menuEl.style.display = 'none', 400))
    }

    function moveGlider(e) {
      e && (glider.style.top = e.offsetTop + 'px')
    }
    gui.querySelectorAll('.nav-item').forEach(e => {
      e.addEventListener('click', () => {
        gui.querySelectorAll('.nav-item').forEach(e => e.classList.remove('active')), document.querySelectorAll('.tab-page').forEach(e => e.classList.remove('active')), e.classList.add('active'), document.getElementById('tab-' + e.dataset.target).classList.add('active'), moveGlider(e)
      })
    });
    setTimeout(() => moveGlider(gui.querySelector('.nav-item.active')), 100);

    function bindCheck(e, t) {
      const n = document.getElementById(e);
      if (!n) return;
      const o = () => n.className = 'ios-switch ' + (CONFIG[t] ? 'active' : '');
      o(), n.addEventListener('click', () => {
        CONFIG[t] = !CONFIG[t], o()
      }), n.updateVisual = o
    }

    function bindVal(e, t) {
      const n = document.getElementById(e);
      n && (n.value = CONFIG[t], n.addEventListener('input', () => CONFIG[t] = 'range' === n.type ? parseFloat(n.value) : n.value))
    }

    function setupKeybind(e, t) {
      const n = document.getElementById(e);
      n && (n.innerText = CONFIG.keys[t].replace('Key', ''), n.addEventListener('click', () => {
        n.classList.add('recording'), n.innerText = '...';
        const o = e => {
          e.preventDefault(), e.stopPropagation(), CONFIG.keys[t] = e.code, n.innerText = e.code.replace('Key', ''), n.classList.remove('recording'), window.removeEventListener('keydown', o, !0)
        };
        window.addEventListener('keydown', o, !0)
      }))
    }

    bindCheck('chk-aimbot', 'aimbot'), bindCheck('chk-aimPrediction', 'aimPrediction'), bindCheck('chk-teamModeSupport', 'teamModeSupport'), bindCheck('chk-showPredictionCircle', 'showPredictionCircle'), bindCheck('chk-esp', 'esp'), bindCheck('chk-espLines', 'espLines'), bindCheck('chk-aimTracer', 'aimTracer'), bindCheck('chk-showFov', 'showFov'), bindCheck('chk-snowfall', 'snowfall');
    bindVal('sel-priority', 'priority'), bindVal('rng-fov', 'fov'), bindVal('rng-lineWidth', 'lineWidth');
    bindVal('col-cEnemy', 'cEnemy'), bindVal('col-cTeam', 'cTeam'), bindVal('col-cFarm', 'cFarm'), bindVal('col-cPenta', 'cPenta'), bindVal('col-cTrace', 'cTrace');
    setupKeybind('bind-toggleMenu', 'toggleMenu'), setupKeybind('bind-toggleAimbot', 'toggleAimbot'), setupKeybind('bind-toggleEsp', 'toggleEsp'), setupKeybind('bind-toggleLines', 'toggleLines');

    window.addEventListener('keydown', e => {
      if (document.querySelector('.key-btn.recording') || 'INPUT' === e.target.tagName || 'SELECT' === e.target.tagName) return;
      e.code === CONFIG.keys.toggleMenu && toggleMenu();
      e.code === CONFIG.keys.toggleAimbot && (CONFIG.aimbot = !CONFIG.aimbot, document.getElementById('chk-aimbot')?.updateVisual());
      e.code === CONFIG.keys.toggleEsp && (CONFIG.esp = !CONFIG.esp, document.getElementById('chk-esp')?.updateVisual());
      e.code === CONFIG.keys.toggleLines && (CONFIG.espLines = !CONFIG.espLines, document.getElementById('chk-espLines')?.updateVisual())
    });

    const VALID_TARGET_TYPES = [EntityType.Player, EntityType.Crasher, EntityType.Square, EntityType.Triangle, EntityType.Pentagon, EntityType.AlphaPentagon];

    function createSnowflakes() {
      const snowflakeCount = 200;
      const canvasWidth = overlay.canvas.width;
      const canvasHeight = overlay.canvas.height;
      for (let i = 0; i < snowflakeCount; i++) {
        snowflakes.push({
          x: Math.random() * canvasWidth,
          y: Math.random() * canvasHeight,
          r: Math.random() * 3 + 1,
          d: Math.random() + 0.5,
          o: Math.random() * 0.5 + 0.2
        });
      }
    }
    if (overlay.canvas.width > 0) createSnowflakes();

    game.on('frame', () => {
      if (!player || !entityManager || !Vector || !EntityType) return;

      myNewBullets.clear();
      if (!player.isDead) {
        const currentBullets = entityManager.entities.filter(e => e.type === EntityType.Bullet);
        const previousBulletIds = new Set(entityManager.entitiesLastFrame.filter(e => e.type === EntityType.Bullet).map(e => e.extras.id));
        const newBullets = currentBullets.filter(cb => !previousBulletIds.has(cb.extras.id));

        for (const bullet of newBullets) {
          if (Vector.distance(player.position, bullet.position) < 150) {
            const lookDirection = Vector.subtract(player.mouse, player.position);
            const lookAngle = Math.atan2(lookDirection.y, lookDirection.x);
            const bulletAngle = Math.atan2(bullet.velocity.y, bullet.velocity.x);

            let angleDiff = lookAngle - bulletAngle;
            while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
            while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;

            if (Math.abs(angleDiff) < Math.PI / 2) {
                myNewBullets.add(bullet.extras.id);
                const speed = Vector.len(bullet.velocity);
                if (speed > 500) {
                    bulletSpeedSamples.push(speed);
                    if (bulletSpeedSamples.length > MAX_SAMPLES) bulletSpeedSamples.shift();
                    measuredBulletSpeed = bulletSpeedSamples.reduce((a, b) => a + b, 0) / bulletSpeedSamples.length;
                }
            }
          }
        }
      }

      const ctx = overlay.ctx;
      const width = overlay.canvas.width;
      const height = overlay.canvas.height;
      ctx.clearRect(0, 0, width, height);
      const cx = width / 2,
        cy = height / 2;

      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      if (CONFIG.snowfall) {
        ctx.fillStyle = 'rgba(255, 255, 255, 1)';
        ctx.beginPath();
        for (let i = 0; i < snowflakes.length; i++) {
          const f = snowflakes[i];
          f.y += f.d;
          if (f.y > height) {
            f.y = -5;
            f.x = Math.random() * width;
          }
          ctx.globalAlpha = f.o;
          ctx.moveTo(f.x, f.y);
          ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2, true);
        }
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      if (!player.isDead) {
        ctx.font = "bold 18px 'SF Pro Display', sans-serif";
        ctx.fillStyle = "rgba(234, 234, 234, 0.8)";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.shadowColor = "rgba(0, 0, 0, 0.7)";
        ctx.shadowBlur = 5;
        ctx.fillText("DCheatz", 20, 20);
        ctx.font = "18px 'SF Pro Display', sans-serif";
        ctx.fillStyle = "rgba(136, 136, 136, 0.9)";
        ctx.fillText("v1.1.1 Beta", 20 + ctx.measureText("DCheatz").width + 5, 20);
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
      }
      if (player.isDead) return;

      const isTeamMode = CONFIG.teamModeSupport && player.gamemode !== 'ffa';

      let myTeamColor = null;
      if (isTeamMode) {
        const myPlayerEntity = entityManager.getPlayer();
        if (myPlayerEntity && myPlayerEntity.extras) {
            myTeamColor = myPlayerEntity.extras.color;
        }
      }

      if (CONFIG.showFov && CONFIG.aimbot) {
        ctx.beginPath();
        ctx.strokeStyle = CONFIG.cFov;
        ctx.globalAlpha = 0.2;
        ctx.lineWidth = 2;
        ctx.arc(cx, cy, CONFIG.fov * scaling.scalingFactor, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      let best = null,
        minScore = Infinity;
      entityManager.entities.forEach(e => {
        if (!e || !e.position || !e.extras || !e.velocity) return;
        if (myNewBullets.has(e.extras.id)) return;
        if (e.type === EntityType.Player && Vector.len(e.velocity) > 800) return;
        if (!VALID_TARGET_TYPES.includes(e.type)) return;

        const r = e.extras.radius || 0;
        if (r < 15) return;
        const pos = scaling.toCanvasPos(e.position);
        const dist = Math.hypot(pos.x - cx, pos.y - cy);
        if (dist < 40) return;

        let isTeammate = false;
        let isEnemy = false;

        if (e.type === EntityType.Player) {
            if (isTeamMode && myTeamColor) {
                if (e.extras.color === myTeamColor) {
                    isTeammate = true;
                } else {
                    isEnemy = true;
                }
            } else {
                isEnemy = true;
            }
        } else if (e.type === EntityType.Crasher) {
            isEnemy = true;
        }

        if (CONFIG.esp) {
          const dr = r * scaling.scalingFactor;
          let col = CONFIG.cFarm;
          let lw = parseInt(CONFIG.lineWidth);

          if (isTeammate) {
              col = CONFIG.cTeam;
          } else if (isEnemy) {
            col = CONFIG.cEnemy;
            lw += 2;
          } else if (e.type === EntityType.AlphaPentagon) {
            col = CONFIG.cPenta;
          }

          ctx.beginPath();
          ctx.strokeStyle = col;
          ctx.lineWidth = lw;
          ctx.arc(pos.x, pos.y, dr, 0, Math.PI * 2);
          ctx.stroke();

          if (CONFIG.espLines && (isEnemy || e.type === EntityType.AlphaPentagon)) {
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(pos.x, pos.y);
            ctx.strokeStyle = col;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        if (isTeammate) return;
        if (dist > CONFIG.fov * scaling.scalingFactor) return;
        if (CONFIG.priority === 'player' && !isEnemy) return;

        let score = dist;
        if (CONFIG.priority === 'smart') {
          if (isEnemy) score -= 50000;
          else if (e.type === EntityType.AlphaPentagon) score -= 10000;
        }

        if (score < minScore) {
          minScore = score;
          best = e;
        }
      });

      if (CONFIG.aimbot && best) {
        let aimPosition = best.position,
          predicted = false;
        if (CONFIG.aimPrediction && best.velocity && (best.velocity.x !== 0 || best.velocity.y !== 0)) {
          const interceptionPoint = calculateInterception({
            x: player.position.x,
            y: player.position.y
          }, {
            x: best.position.x,
            y: best.position.y,
            vx: best.velocity.x,
            vy: best.velocity.y
          }, measuredBulletSpeed);
          if (interceptionPoint) {
            aimPosition = interceptionPoint;
            predicted = true;
          }
        }
        player.lookAt(aimPosition);
        const targetCanvasPos = scaling.toCanvasPos(aimPosition);
        if (CONFIG.aimTracer) {
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(targetCanvasPos.x, targetCanvasPos.y);
          ctx.strokeStyle = CONFIG.cTrace;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
        if (predicted && CONFIG.showPredictionCircle) {
          ctx.beginPath();
          ctx.fillStyle = 'rgba(48, 209, 88, 0.25)';
          ctx.arc(targetCanvasPos.x, targetCanvasPos.y, 40, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#30D158';
          ctx.lineWidth = 3;
          ctx.stroke();
        }
      }
    });
  })();
})();