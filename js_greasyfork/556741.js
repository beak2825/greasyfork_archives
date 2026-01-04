// ==UserScript==
// @name           Cocos Unity WebGL 速度修改器
// @name:en        Cocos Unity WebGL Speed Controller
// @namespace      Violentmonkey Scripts
// @match          *://*/*
// @run-at         document-start
// @grant          none
// @version        1.2
// @author         BigWater
// @license        MIT
// @description    为 Cocos2dx 和 Unity WebGL 页面启用速度控制功能, 帮你跳过太长的动画.
// @description:en Enable speed control for Cocos2dx and Unity WebGL pages to help you skip overly long animations.
// @downloadURL https://update.greasyfork.org/scripts/556741/Cocos%20Unity%20WebGL%20%E9%80%9F%E5%BA%A6%E4%BF%AE%E6%94%B9%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/556741/Cocos%20Unity%20WebGL%20%E9%80%9F%E5%BA%A6%E4%BF%AE%E6%94%B9%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===============================
    // Cocos and Unity detection
    // ===============================
    function isCocos() {
        // Global namespace
        if (window.cc || window.cocos2d || window.__ccGlobal) return true;

        // Script name patterns
        const scripts = [...document.scripts].map(s => s.src);
        if (scripts.some(src => /cocos2d|cocos|project\.js|settings\.js/i.test(src))) {
            return true;
        }

        return false;
    }

    function isUnity() {
        if (window.createUnityInstance || window.UnityLoader) return true;

        const scripts = [...document.scripts].map(s => s.src);
        if (scripts.some(src => /UnityLoader|\.framework\.js|\.data|\.wasm|build\.json/i.test(src))) {
            return true;
        }

        // Canvas detection
        if (document.querySelector('#unity-container, #unity-canvas')) return true;

        return false;
    }


    // ===============================
    // Configuration
    // ===============================
    let speedMultiplier = 1.0;
    const MIN = 0.1;
    const MAX = 32.0;

    // ===============================
    // Hook requestAnimationFrame
    // ===============================
    const originalRAF = window.requestAnimationFrame.bind(window);
    const callbackMap = new Map();
    let nextId = 1;

    window.requestAnimationFrame = function(callback) {
        const id = nextId++;
        const wrapped = function(timestamp) {
            const scaled = timestamp * speedMultiplier;
            callback(scaled);
            callbackMap.delete(id);
        };
        callbackMap.set(id, wrapped);
        return originalRAF(wrapped);
    };

    // ===============================
    // Hook performance.now
    // ===============================
    if (performance && typeof performance.now === 'function') {
        const originalNow = performance.now.bind(performance);
        const baseReal = originalNow();
        const baseFake = baseReal;

        performance.now = function() {
            const real = originalNow();
            return baseFake + (real - baseReal) * speedMultiplier;
        };
    }

    // ===============================
    // Create Floating UI Panel
    // ===============================
    function createUI() {
        // skip if not cocos or unity
        if (!isCocos() && !isUnity()) return;

        const panel = document.createElement('div');
        panel.id = 'speedhack-panel';
        panel.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 999999;
            background: rgba(0,0,0,0.75);
            color: #fff;
            padding: 10px;
            border-radius: 8px;
            font-family: sans-serif;
            font-size: 14px;
            user-select: none;
            width: 160px;
            cursor: move;
        `;

        panel.innerHTML = `
            <div style="margin-bottom:6px;font-weight:bold;">Speed Control</div>
            <input id="speedhack-input" type="number" step="0.1" min="0.1" max="10"
                value="${speedMultiplier}"
                style="width:70px; padding:3px; border-radius:4px; border:1px solid #ccc;">

            <!--<div style="margin-top:8px;">
                <button id="speedhack-slower"
                    style="width:45%; padding:3px; margin-right:2%; border-radius:4px; border:none; cursor:pointer;">
                    -
                </button>
                <button id="speedhack-faster"
                    style="width:45%; padding:3px; border-radius:4px; border:none; cursor:pointer;">
                    +
                </button>
            </div>-->

            <button id="speedhack-reset"
                style="margin-top:6px; width:100%; padding:3px; border-radius:4px; border:none; cursor:pointer;">
                Reset
            </button>
        `;

        document.body.appendChild(panel);

        // Hook events
        const input = document.getElementById('speedhack-input');
        // document.getElementById('speedhack-slower').onclick = () => {
        //     setSpeed(speedMultiplier - 0.5);
        //     input.value = speedMultiplier.toFixed(1);
        // };
        // document.getElementById('speedhack-faster').onclick = () => {
        //     setSpeed(speedMultiplier + 0.5);
        //     input.value = speedMultiplier.toFixed(1);
        // };
        document.getElementById('speedhack-reset').onclick = () => {
            setSpeed(1.0);
            input.value = '1.0';
        };
      input.addEventListener('wheel', e => {
        if (e.deltaY < 0) {
            setSpeed(speedMultiplier + 0.1);
            input.value = speedMultiplier.toFixed(1);
        } else {
            setSpeed(speedMultiplier - 0.1);
            input.value = speedMultiplier.toFixed(1);
        }
      });

        // Draggable panel
        makeDraggable(panel);
    }

    function setSpeed(v) {
        speedMultiplier = Math.max(MIN, Math.min(MAX, v));
        // console.log('[Speedhack] Multiplier:', speedMultiplier);
    }

    // ===============================
    // Make Panel Draggable
    // ===============================
    function makeDraggable(element) {
        let offsetX = 0, offsetY = 0, down = false;

        element.addEventListener('mousedown', e => {
            down = true;
            offsetX = e.clientX - element.offsetLeft;
            offsetY = e.clientY - element.offsetTop;
        });

        document.addEventListener('mousemove', e => {
            if (!down) return;
            element.style.left = (e.clientX - offsetX) + 'px';
            element.style.top = (e.clientY - offsetY) + 'px';
        });

        document.addEventListener('mouseup', () => down = false);
    }

    // ===============================
    // Inject UI when DOM is ready
    // ===============================
    document.addEventListener('DOMContentLoaded', createUI);
})();
