// ==UserScript==
// @name MonkeyType (Educational Purpose Only)
// @author Kamron
// @description Smart typing assistant with natural behavior. Press "/" to activate.
// @icon https://monkeytype.com/images/favicon/favicon-32x32.png
// @version 1.0
// @match *://monkeytype.com/*
// @run-at document-idle
// @grant none
// @license MIT
// @namespace https://greasyfork.org/users/1542493
// @downloadURL https://update.greasyfork.org/scripts/557214/MonkeyType%20%28Educational%20Purpose%20Only%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557214/MonkeyType%20%28Educational%20Purpose%20Only%29.meta.js
// ==/UserScript==

(function() {
    "use strict";

    const TRIGGER_KEY = "Slash";

    let config = {
        speed: 85,
        precision: 94,
        autoFix: true
    };

    let active = false;
    let sessionData = {
        charCount: 0,
        mistakeCount: 0,
        beginTime: null,
        lastMistakeTime: 0,
        streakCount: 0,
        inMistakeChain: false
    };

    const NEARBY_KEYS = {
        'q': ['w', 'a', 's'],
        'w': ['q', 'e', 'a', 's', 'd'],
        'e': ['w', 'r', 's', 'd', 'f'],
        'r': ['e', 't', 'd', 'f', 'g'],
        't': ['r', 'y', 'f', 'g', 'h'],
        'y': ['t', 'u', 'g', 'h', 'j'],
        'u': ['y', 'i', 'h', 'j', 'k'],
        'i': ['u', 'o', 'j', 'k', 'l'],
        'o': ['i', 'p', 'k', 'l'],
        'p': ['o', 'l'],
        'a': ['q', 'w', 's', 'z', 'x'],
        's': ['q', 'w', 'e', 'a', 'd', 'z', 'x', 'c'],
        'd': ['w', 'e', 'r', 's', 'f', 'x', 'c', 'v'],
        'f': ['e', 'r', 't', 'd', 'g', 'c', 'v', 'b'],
        'g': ['r', 't', 'y', 'f', 'h', 'v', 'b', 'n'],
        'h': ['t', 'y', 'u', 'g', 'j', 'b', 'n', 'm'],
        'j': ['y', 'u', 'i', 'h', 'k', 'n', 'm'],
        'k': ['u', 'i', 'o', 'j', 'l', 'm'],
        'l': ['i', 'o', 'p', 'k'],
        'z': ['a', 's', 'x'],
        'x': ['a', 's', 'd', 'z', 'c'],
        'c': ['s', 'd', 'f', 'x', 'v'],
        'v': ['d', 'f', 'g', 'c', 'b'],
        'b': ['f', 'g', 'h', 'v', 'n'],
        'n': ['g', 'h', 'j', 'b', 'm'],
        'm': ['h', 'j', 'k', 'n'],
        ' ': [' ']
    };

    const TRICKY_PAIRS = ['qu', 'xe', 'xc', 'zx', 'bv', 'uy', 'ij', 'kj', 'pq'];

    let prevChar = '';

    function randRange(low, high) {
        return Math.random() * (high - low) + low;
    }

    function calcInterval() {
        const base = 60000 / (config.speed * 5);
        const n1 = Math.random();
        const n2 = Math.random();
        const curve = Math.sqrt(-2 * Math.log(n1)) * Math.cos(2 * Math.PI * n2);
        const factor = Math.max(0.5, Math.min(2, 1 + curve * 0.25));
        return base * factor;
    }

    function calcWordGap() {
        const base = 60000 / (config.speed * 5);
        return base * randRange(1.2, 2.5);
    }

    function isReady() {
        const testArea = document.getElementById("typingTest");
        if (!testArea) return false;
        const hidden = testArea.classList.contains("hidden");
        if (hidden) active = false;
        return active && !hidden;
    }

    function fetchNextChar() {
        const currentWord = document.querySelector(".word.active");
        if (!currentWord) return null;
        for (const letter of currentWord.children) {
            if (letter.className === "") return letter.textContent;
        }
        return " ";
    }

    function getNearbyKey(char) {
        const lower = char.toLowerCase();
        const nearby = NEARBY_KEYS[lower];
        if (!nearby || nearby.length === 0) {
            const fallback = 'asdfghjkl';
            return fallback[Math.floor(Math.random() * fallback.length)];
        }
        const options = nearby.filter(k => k !== lower);
        if (options.length === 0) return nearby[0];
        return options[Math.floor(Math.random() * options.length)];
    }

    function willMistake(char) {
        const baseRate = (100 - config.precision) / 100;
        let chance = baseRate;

        const timeSinceLast = Date.now() - sessionData.lastMistakeTime;
        if (timeSinceLast < 2000 && sessionData.lastMistakeTime > 0) {
            if (sessionData.inMistakeChain) {
                chance *= 2.5;
            }
        } else {
            sessionData.inMistakeChain = false;
        }

        if (sessionData.streakCount > 30) {
            chance *= 0.5;
        } else if (sessionData.streakCount > 15) {
            chance *= 0.7;
        }

        if (sessionData.beginTime) {
            const elapsed = (Date.now() - sessionData.beginTime) / 1000;
            if (elapsed > 45) {
                chance *= 1.3;
            } else if (elapsed > 25) {
                chance *= 1.15;
            }
        }

        const pair = (prevChar + char).toLowerCase();
        if (TRICKY_PAIRS.includes(pair)) {
            chance *= 1.8;
        }

        if (Math.random() < 0.1) {
            chance *= randRange(0.2, 2.5);
        }

        const result = Math.random() < chance;

        if (result) {
            if (Math.random() < 0.3) {
                sessionData.inMistakeChain = true;
            }
            sessionData.lastMistakeTime = Date.now();
            sessionData.streakCount = 0;
            sessionData.mistakeCount++;
        } else {
            sessionData.streakCount++;
        }

        sessionData.charCount++;
        return result;
    }

    function pickMistakeType() {
        const roll = Math.random();
        if (roll < 0.65) return 'nearby';
        if (roll < 0.85) return 'skip';
        return 'double';
    }

    function typeChar(char) {
        const field = document.getElementById("wordsInput");
        if (!field) return false;
        field.focus();
        return document.execCommand("insertText", false, char);
    }

    function eraseChar() {
        const field = document.getElementById("wordsInput");
        if (!field) return false;
        field.focus();
        if (field.value.length > 0) {
            field.value = field.value.slice(0, -1);
            field.dispatchEvent(new InputEvent('input', {
                inputType: 'deleteContentBackward',
                bubbles: true
            }));
            return true;
        }
        return false;
    }

    function processChar() {
        if (!isReady()) {
            console.log("[Keyflow] Stopped");
            refreshStatus(false);
            return;
        }

        const nextChar = fetchNextChar();

        if (nextChar === null) {
            setTimeout(processChar, 100);
            return;
        }

        if (!sessionData.beginTime) {
            sessionData.beginTime = Date.now();
        }

        if (willMistake(nextChar) && nextChar !== " ") {
            const mistakeType = pickMistakeType();

            switch (mistakeType) {
                case 'nearby':
                    doNearbyMistake(nextChar);
                    break;
                case 'skip':
                    doSkipMistake(nextChar);
                    break;
                case 'double':
                    doDoubleMistake(nextChar);
                    break;
                default:
                    doNearbyMistake(nextChar);
            }
        } else {
            typeChar(nextChar);
            prevChar = nextChar;
            const wait = nextChar === " " ? calcWordGap() : calcInterval();
            setTimeout(processChar, wait);
        }
    }

    function doNearbyMistake(correct) {
        const wrong = getNearbyKey(correct);
        typeChar(wrong);

        if (config.autoFix) {
            const notice = randRange(150, 400);
            setTimeout(() => {
                eraseChar();
                setTimeout(() => {
                    typeChar(correct);
                    prevChar = correct;
                    setTimeout(processChar, calcInterval());
                }, randRange(80, 200));
            }, notice);
        } else {
            prevChar = wrong;
            setTimeout(processChar, calcInterval());
        }
    }

    function doSkipMistake(correct) {
        doNearbyMistake(correct);
    }

    function doDoubleMistake(correct) {
        typeChar(correct);

        setTimeout(() => {
            typeChar(correct);

            if (config.autoFix) {
                setTimeout(() => {
                    eraseChar();
                    prevChar = correct;
                    setTimeout(processChar, calcInterval());
                }, randRange(100, 250));
            } else {
                prevChar = correct;
                setTimeout(processChar, calcInterval());
            }
        }, randRange(30, 80));
    }

    window.addEventListener("keydown", function(e) {
        if (e.code === TRIGGER_KEY) {
            e.preventDefault();
            if (e.repeat) return;

            active = !active;
            refreshStatus(active);

            if (active) {
                sessionData = {
                    charCount: 0,
                    mistakeCount: 0,
                    beginTime: null,
                    lastMistakeTime: 0,
                    streakCount: 0,
                    inMistakeChain: false
                };
                prevChar = '';

                console.log("[Keyflow] Running");
                const field = document.getElementById("wordsInput");
                if (field) field.focus();
                setTimeout(processChar, 100);
            } else {
                console.log("[Keyflow] Paused");
            }
        }
    });

    function loadConfig() {
        try {
            const data = localStorage.getItem("keyflow_config_v1");
            if (data) {
                const parsed = JSON.parse(data);
                config = { ...config, ...parsed };
            }
        } catch (err) {}
    }

    function saveConfig() {
        localStorage.setItem("keyflow_config_v1", JSON.stringify(config));
    }

    let stateEl = null;

    function refreshStatus(isOn) {
        if (stateEl) {
            stateEl.textContent = isOn ? "ON" : "OFF";
            stateEl.className = `kf-state ${isOn ? 'active' : 'idle'}`;
        }
    }

    function initPanel() {
        if (document.getElementById("kf-panel")) return;
        loadConfig();

        const panel = document.createElement("div");
        panel.id = "kf-panel";
        panel.innerHTML = `
            <style>
                #kf-panel {
                    position: fixed;
                    bottom: 24px;
                    right: 24px;
                    background: #1e1e1e;
                    border: 1px solid #3a3a3a;
                    border-radius: 12px;
                    padding: 16px;
                    font-family: 'Roboto Mono', 'SF Mono', monospace;
                    font-size: 13px;
                    color: #d4d4d4;
                    z-index: 999999;
                    width: 220px;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
                    user-select: none;
                }

                #kf-panel * {
                    box-sizing: border-box;
                }

                #kf-panel .kf-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 16px;
                    padding-bottom: 12px;
                    border-bottom: 1px solid #3a3a3a;
                }

                #kf-panel .kf-title {
                    font-weight: 600;
                    font-size: 14px;
                    color: #e2b714;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                #kf-panel .kf-ver {
                    font-size: 10px;
                    color: #666;
                    font-weight: normal;
                }

                #kf-panel .kf-state {
                    font-size: 12px;
                    font-weight: 600;
                    padding: 4px 10px;
                    border-radius: 6px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                #kf-panel .kf-state.active {
                    background: rgba(76, 175, 80, 0.2);
                    color: #4CAF50;
                }

                #kf-panel .kf-state.idle {
                    background: rgba(244, 67, 54, 0.2);
                    color: #f44336;
                }

                #kf-panel .kf-ctrl {
                    margin-bottom: 14px;
                }

                #kf-panel .kf-label {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 8px;
                    font-size: 12px;
                    color: #888;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                #kf-panel .kf-val {
                    font-weight: 600;
                    color: #e2b714;
                    font-size: 13px;
                }

                #kf-panel input[type="range"] {
                    width: 100%;
                    height: 6px;
                    border-radius: 3px;
                    background: #3a3a3a;
                    outline: none;
                    -webkit-appearance: none;
                    cursor: pointer;
                }

                #kf-panel input[type="range"]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: #e2b714;
                    cursor: pointer;
                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
                    transition: transform 0.15s ease;
                }

                #kf-panel input[type="range"]::-webkit-slider-thumb:hover {
                    transform: scale(1.1);
                }

                #kf-panel input[type="range"]::-moz-range-thumb {
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: #e2b714;
                    cursor: pointer;
                    border: none;
                }

                #kf-panel .kf-toggle {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 10px 0;
                    border-top: 1px solid #3a3a3a;
                    margin-top: 14px;
                }

                #kf-panel .kf-switch {
                    position: relative;
                    width: 40px;
                    height: 22px;
                    flex-shrink: 0;
                }

                #kf-panel .kf-switch input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                }

                #kf-panel .kf-track {
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: #3a3a3a;
                    border-radius: 22px;
                    transition: 0.3s;
                }

                #kf-panel .kf-track:before {
                    position: absolute;
                    content: "";
                    height: 16px;
                    width: 16px;
                    left: 3px;
                    bottom: 3px;
                    background: #888;
                    border-radius: 50%;
                    transition: 0.3s;
                }

                #kf-panel input:checked + .kf-track {
                    background: rgba(226, 183, 20, 0.3);
                }

                #kf-panel input:checked + .kf-track:before {
                    transform: translateX(18px);
                    background: #e2b714;
                }

                #kf-panel .kf-switchlabel {
                    font-size: 12px;
                    color: #888;
                }

                #kf-panel .kf-hint {
                    text-align: center;
                    margin-top: 14px;
                    padding-top: 12px;
                    border-top: 1px solid #3a3a3a;
                    font-size: 11px;
                    color: #666;
                }

                #kf-panel .kf-hint kbd {
                    background: #3a3a3a;
                    padding: 3px 8px;
                    border-radius: 4px;
                    font-family: inherit;
                    color: #d4d4d4;
                    margin: 0 2px;
                }
            </style>

            <div class="kf-header">
                <div class="kf-title">
                    <span>MonkeyType <span class="kf-ver">v1</span></span>
                </div>
                <span id="kf-state" class="kf-state idle">OFF</span>
            </div>

            <div class="kf-ctrl">
                <div class="kf-label">
                    <span>Speed</span>
                    <span class="kf-val"><span id="kf-speed">${config.speed}</span> WPM</span>
                </div>
                <input type="range" id="kf-speed-slider" min="30" max="180" value="${config.speed}">
            </div>

            <div class="kf-ctrl">
                <div class="kf-label">
                    <span>Accuracy</span>
                    <span class="kf-val"><span id="kf-precision">${config.precision}</span>%</span>
                </div>
                <input type="range" id="kf-precision-slider" min="85" max="100" value="${config.precision}">
            </div>

            <div class="kf-toggle">
                <label class="kf-switch">
                    <input type="checkbox" id="kf-autofix" ${config.autoFix ? 'checked' : ''}>
                    <span class="kf-track"></span>
                </label>
                <span class="kf-switchlabel">Auto-correct errors</span>
            </div>

            <div class="kf-hint">
                Press <kbd>/</kbd> to toggle
            </div>
        `;

        document.body.appendChild(panel);

        stateEl = document.getElementById("kf-state");
        const speedSlider = document.getElementById("kf-speed-slider");
        const speedVal = document.getElementById("kf-speed");
        const precisionSlider = document.getElementById("kf-precision-slider");
        const precisionVal = document.getElementById("kf-precision");
        const autofixToggle = document.getElementById("kf-autofix");

        speedSlider.addEventListener("input", () => {
            config.speed = parseInt(speedSlider.value);
            speedVal.textContent = config.speed;
            saveConfig();
        });

        precisionSlider.addEventListener("input", () => {
            config.precision = parseInt(precisionSlider.value);
            precisionVal.textContent = config.precision;
            saveConfig();
        });

        autofixToggle.addEventListener("change", () => {
            config.autoFix = autofixToggle.checked;
            saveConfig();
        });

        console.log("[Keyflow] Panel ready");
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => setTimeout(initPanel, 500));
    } else {
        setTimeout(initPanel, 500);
    }

    console.log("[Keyflow] Initialized");

})();