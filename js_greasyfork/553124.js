// ==UserScript==
// @name          Speed Hacker for Stake.com - ono.speed - alternative method
// @namespace     https://github.com/cutiejf/stakespeed/blob/main/ono.speed
// @version       2.0.5
// @description   Smooth, optimized speed scaling (rAF delta), timers auto-on, CSS snap for near-instant animations. Collapsible advanced options. Max speed capped at 9.9x.
// @author        jayfantz
// @match https://stake.com/*
// @match https://*.stake.com/*
// @match https://stake.us/*
// @match https://*.stake.us/*
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/553124/Speed%20Hacker%20for%20Stakecom%20-%20onospeed%20-%20alternative%20method.user.js
// @updateURL https://update.greasyfork.org/scripts/553124/Speed%20Hacker%20for%20Stakecom%20-%20onospeed%20-%20alternative%20method.meta.js
// ==/UserScript==
(function () {
    'use strict';

    // ---------------- State / Config
    let speed = 1.0;
    const bootTime = performance.now();
    let scaledTimeOffset = 0;

    const MAX_SPEED = 9.9;
    const MAX_Z_INDEX = '2147483647';
    const BORDER_PURPLE = '#7340a3';

    const hooks = {
        requestAnimationFrame: true,
        setTimeout: true,
        setInterval: true,
        css: true,
        time: false,
        date: false,
        gsap: null,
        pixi: null,
        three: null,
        anime: null,
        velocity: null,
    };

    const MIN_TIMEOUT_MS = 0;
    const MIN_INTERVAL_MS = 1;

    // ---------------- Colors
const C = {
  deepNavy:      '#0f212e',   // background / footer base
  darkPill:      '#1f3341',   // main panel body
  darkerButton:  '#0c1a25',   // inner button tone or accent divs
  midGray:       '#55646e',   // borders, lines, text subtle
  lightGray:     '#909ba1',   // primary text
  actionGreen:   '#107721',   // buttons, highlights, icons
  shadow:        '#263a46'    // shadow / glow edge
};


    // ---------------- Keep native refs
    const native = {
        setTimeout: window.setTimeout.bind(window),
        setInterval: window.setInterval.bind(window),
        requestAnimationFrame: window.requestAnimationFrame.bind(window),
        performance: window.performance,
        Date: window.Date,
    };

    // --- Helper function to format speed ---
    function formatSpeed(s) {
        // Bold the number AND the 'x' multiplier
        return `<b style="font-size: 18px;">${s.toFixed(1)}</b> <b style="font-style: italic;">x</b>`;
    }

    // --- Core Styling for Shadow DOM (Must be self-contained) ---
const globalStyle = `
  * {
    box-sizing: border-box !important;
    font-family: Inter, system-ui, -apple-system, Segoe UI, Arial, sans-serif !important;
    color: ${C.lightGray} !important;
    margin: 0 !important;
    line-height: 1.2 !important;
    user-select: none !important;
  }

  #gauge-wrapper {
    position: fixed;
bottom: 229px;
left: 355px;
    z-index: ${MAX_Z_INDEX};
    cursor: default;
  }

  #gauge {
    background: ${C.darkPill};
    border: 3px solid ${C.midGray};
    border-radius: 18px;
    display: flex;
    flex-direction: column;
    cursor: move;
    box-shadow:
    inset 0 1px 3px rgba(255,255,255,0.06),
    inset 0 -2px 5px rgba(0,0,0,0.6),
    0 0 22px ${C.shadow}bb,
    0 0 30px rgba(15,33,46,0.45);
  }

#gauge-header {
  display: flex;
  align-items: center;
  padding: 8px 10px 6px 12px !important;
  gap: 8px;
  box-shadow:         inset 0 2px 4px rgba(0,0,0,0.75),  /* deep inner top shadow */
    inset 0 2px 4px rgba(255,255,255,0.05); /* subtle lower light */
  border-top-left-radius: 18px;
  border-top-right-radius: 18px;
}

  #gauge-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: ${C.deepNavy};
    border-top: 1px solid ${C.midGray};
    border-bottom-left-radius: 14px;
    border-bottom-right-radius: 14px;
    padding: 8px 18px !important;
  }

  #gauge-footer span {
    font-size: 11px !important;
    color: ${C.lightGray}cc !important;
    font-weight: 700 !important;
  }

  #footer-arrow {
    cursor: pointer !important;
    font-size: 16px !important;
    color: ${C.actionGreen} !important;
    font-weight: bold !important;
  }

  button {
    background: none !important;
    border: none !important;
    color: ${C.actionGreen} !important;
    font-size: 24px !important;
    font-weight: bold !important;
    line-height: 1 !important;
    cursor: pointer !important;
    padding: 0 2px !important;
  }

  #spd {
    min-width: 48px;
    text-align: center;
    line-height: 1;
    white-space: nowrap;
  }

  #spd b {
    font-weight: bold !important;
    font-size: 18px !important;
    color: ${C.lightGray} !important;
    line-height: 1 !important;
  }

  #panel {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    background: ${C.darkPill};
    border: 3px solid ${C.midGray};
    border-radius: 16px;
    padding: 10px 16px !important;
    display: none;
    flex-direction: column;
    font-size: 14px;
    min-width: 280px;
    cursor: default;
    box-shadow:
      0 6px 14px rgba(0,0,0,0.55),
      inset 0 0 0 6px ${C.deepNavy},
      inset 0 2px 4px rgba(255,255,255,0.08);
  }

  #panel .section-title {
    margin-top: 8px !important;
    margin-bottom: 4px !important;
    color: ${C.lightGray} !important;
    opacity: .85 !important;
    font-weight: 600 !important;
    border-bottom: 1px solid ${C.midGray} !important;
    padding-bottom: 4px !important;
  }

  .toggle-row {
    display: grid;
    grid-template-columns: 1fr 46px;
    align-items: center;
    margin: 6px 0 !important;
    gap: 10px;
  }

  .toggle-label-bold {
    font-weight: bold !important;
  }

  .toggle-label-desc {
    color: ${C.lightGray}99 !important;
    font-size: 11px !important;
    font-style: italic !important;
    margin-top: 2px !important;
  }

  .collapsible-toggle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 8px 0 !important;
    padding: 4px 0 !important;
    border-top: 1px solid ${C.midGray};
    color: ${C.actionGreen} !important;
    font-weight: bold !important;
    cursor: pointer;
    font-size: 14px !important;
  }
.warning-text {
    font-size: 9.5px !important;
    color: #ff4444 !important;
    opacity: 0.85;
    margin: 2px 0 6px 0 !important;
    line-height: 1.25 !important;
    letter-spacing: 0.1px;
    text-shadow: 0 0 4px rgba(255, 60, 60, 0.25);
font-weight: 700 !important;
  }

  .collapsible-arrow {
    transition: transform 0.2s;
  }

  .toggle-switch {
    width:46px;height:24px;
    border-radius:20px;
    background:${C.deepNavy};
    border:1px solid ${C.lightGray};
    position:relative;
    cursor:pointer;
    transition:background .2s,border .2s;
  }

  .knob {
    width:20px;height:20px;
    border-radius:50%;
    background:${C.darkPill};
    position:absolute;top:1px;left:1px;
    transition:left .2s, background .2s, box-shadow .2s;
    box-shadow:0 0 6px ${C.shadow};
  }
`;


    // ---------------- UI (Rebuilt inside Shadow DOM) ----------------

    // 1. Create the container (host) for the Shadow DOM
    const shadowHost = document.createElement('div');
    shadowHost.id = 'shadow-host';
    document.documentElement.appendChild(shadowHost);

    // 2. Attach the Shadow DOM
    const shadowRoot = shadowHost.attachShadow({ mode: 'open' });

    // 3. Inject global style into the Shadow DOM
    const styleElement = document.createElement('style');
    styleElement.textContent = globalStyle;
    shadowRoot.appendChild(styleElement);

    // 4. Create the gauge wrapper inside the shadow root
    const gaugeWrapper = document.createElement('div');
    gaugeWrapper.id = 'gauge-wrapper';
    shadowRoot.appendChild(gaugeWrapper);

    const gauge = document.createElement('div');
    gauge.id = 'gauge';
    gaugeWrapper.appendChild(gauge);

    // Create inner elements
    const gaugeHeader = document.createElement('div');
    gaugeHeader.id = 'gauge-header';
    gaugeHeader.innerHTML = `
        <button id="dec">–</button>
        <span id="spd">${formatSpeed(speed)}</span>
        <button id="inc">+</button>
    `;
    gauge.appendChild(gaugeHeader);

    const gaugeFooter = document.createElement('div');
    gaugeFooter.id = 'gauge-footer';
    gaugeFooter.innerHTML = `
        <span>ONO.speed</span>
        <span id="footer-arrow">▼</span>
    `;
    gauge.appendChild(gaugeFooter);

    const panel = document.createElement('div');
    panel.id = 'panel';
    gaugeWrapper.appendChild(panel);


    // --- Descriptions and UI Functions (Re-scoped for Shadow DOM) ---
    const hookDescriptions = {
        requestAnimationFrame: 'Smooth frame-by-frame animation loops',
        setTimeout: 'One-time function delays',
        setInterval: 'Recurring function delays',
        css: 'Browser-native UI movement and styling',
        time: 'Affects high-precision timing for games/physics',
        date: 'Affects login sessions, expiration, and notifications',
        gsap: 'Greensock\'s industry-standard animation engine',
        pixi: 'PIXI.js 2D game loop',
        three: 'THREE.js 3D scene timing',
        anime: 'Anime.js animation library',
        velocity: 'Velocity.js animation library',
    };

    function makeToggleRow(labelText, key, initial) {
        const row = document.createElement('div');
        row.className = 'toggle-row';

        const labelContainer = document.createElement('div');
        labelContainer.innerHTML = `
            <div class="toggle-label-bold">${labelText}</div>
            <div class="toggle-label-desc">${hookDescriptions[key] || ''}</div>
        `;

        const toggle = document.createElement('div');
        toggle.className = 'toggle-switch';
        const toggleWrapper = document.createElement('div');
        toggleWrapper.style = 'justify-self: end;';

        const knob = document.createElement('div');
        knob.className = 'knob';
        toggle.appendChild(knob);
        toggleWrapper.appendChild(toggle);

const setVisual = (on) => {
  knob.style.left = on ? '25px' : '1px';
  knob.style.background = on ? C.actionGreen : '#1c3b4a'; // lighter navy off
  knob.style.boxShadow = on
    ? `0 0 6px ${C.actionGreen}99`
    : `0 0 4px ${C.shadow}55`;
  toggle.style.border = `1px solid ${on ? C.actionGreen : C.midGray}`;
  toggle.style.background = on ? C.darkPill : '#152a37'; // softer off tone
};



        hooks[key] = initial;
        setVisual(!!initial);
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            hooks[key] = !hooks[key];
            setVisual(hooks[key]);
            updateHooks();
        });

        row.append(labelContainer, toggleWrapper);
        return row;
    }

    function section(title) {
        const t = document.createElement('div');
        t.textContent = title;
        t.className = 'section-title';
        panel.appendChild(t);
    }

    function createCollapsibleToggle(panelElement, labelText) {
        const toggleRow = document.createElement('div');
        toggleRow.className = 'collapsible-toggle';
        toggleRow.innerHTML = `
            <span>${labelText}</span>
            <span class="collapsible-arrow">▼</span>
        `;

        const arrowEl = toggleRow.querySelector('.collapsible-arrow');
        panelElement.style.display = 'none';
        arrowEl.style.transform = 'rotate(-90deg)';

        toggleRow.onclick = (e) => {
            e.stopPropagation();
            const isVisible = panelElement.style.display !== 'none';
            panelElement.style.display = isVisible ? 'none' : 'flex';
            arrowEl.style.transform = isVisible ? 'rotate(-90deg)' : 'rotate(0deg)';
        };

        return toggleRow;
    }

    // --- UI Layout Injection (into Shadow DOM) ---

    section('Core JS Timing');
    panel.append(
        makeToggleRow('requestAnimationFrame', 'requestAnimationFrame', hooks.requestAnimationFrame),
        makeToggleRow('setTimeout', 'setTimeout', hooks.setTimeout),
        makeToggleRow('setInterval', 'setInterval', hooks.setInterval),
    );

    // --- Global Clocks Section (Collapsible) ---
    const clockPanel = document.createElement('div');
    clockPanel.style.display = 'flex';
    clockPanel.style.flexDirection = 'column';

    panel.appendChild(createCollapsibleToggle(clockPanel, 'More Clocks (Caution)'));

    const warningText = document.createElement('div');
    warningText.className = 'warning-text';
    warningText.innerHTML = `
        *Caution:* Global clock overrides can lead to session errors or delayed notifications.
    `;
    clockPanel.appendChild(warningText);

    clockPanel.append(
        makeToggleRow('performance.now()', 'time', hooks.time),
        makeToggleRow('Date.now() / new Date()', 'date', hooks.date),
    );
    panel.appendChild(clockPanel);

    // --- CSS & Libraries Section ---
    section('CSS & Libraries');
    panel.append(
        makeToggleRow('CSS Animations/Transitions', 'css', hooks.css),
    );

    // --- Libraries Section (Collapsible) ---
    const libPanel = document.createElement('div');
    libPanel.style.display = 'flex';
    libPanel.style.flexDirection = 'column';

    panel.appendChild(createCollapsibleToggle(libPanel, 'More Libraries'));

    const libRows = {
        gsap: makeToggleRow('GSAP (globalTimeline)', 'gsap', false),
        pixi: makeToggleRow('PIXI (Ticker)', 'pixi', false),
        three: makeToggleRow('THREE.js (Clock)', 'three', false),
        anime: makeToggleRow('Anime.js', 'anime', false),
        velocity: makeToggleRow('Velocity.js', 'velocity', false),
    };
    // Need unique IDs for library rows to detect library presence later
    libRows.gsap.id = 'lib-gsap';
    libRows.pixi.id = 'lib-pixi';
    libRows.three.id = 'lib-three';
    libRows.anime.id = 'lib-anime';
    libRows.velocity.id = 'lib-velocity';

    libPanel.append(libRows.gsap, libRows.pixi, libRows.three, libRows.anime, libRows.velocity);
    panel.appendChild(libPanel);

    // ---------------- Dragging (Re-scoped to Shadow DOM) ----------------
    let dx, dy;

    gauge.addEventListener('mousedown', (e) => {
        // Find if the click target is any interactive element inside the gauge or panel
        const interactiveTarget = e.target.closest('button, #footer-arrow, .knob, .collapsible-toggle');
        const isInsidePanel = panel.contains(e.target);

        // Drag exclusion checks
        if (interactiveTarget || isInsidePanel) {
            return;
        }

        e.preventDefault();
        e.stopPropagation();

        // Temporarily set the body cursor to 'move' for continuous feedback
        document.body.style.cursor = 'move';

        // Calculate offset relative to the Shadow DOM host/page
        const gaugeRect = gaugeWrapper.getBoundingClientRect();
        dx = e.pageX - gaugeRect.left;
        dy = e.pageY - gaugeRect.top;

        const move = (ev)=>{
            gaugeWrapper.style.left = ev.pageX - dx + 'px';
            gaugeWrapper.style.top = ev.pageY - dy + 'px';
        };

        const up = ()=>{
            document.removeEventListener('mousemove', move);
            document.removeEventListener('mouseup', up);

            // Restore body cursor
            document.body.style.cursor = 'default';
        };

        document.addEventListener('mousemove', move);
        document.addEventListener('mouseup', up);
    });

    const spdEl = shadowRoot.querySelector('#spd');
    const footerArrow = shadowRoot.querySelector('#footer-arrow');

    // Panel toggle function
    const togglePanel = (e) => {
        e.stopPropagation();
        const isVisible = panel.style.display === 'flex';
        panel.style.display = isVisible ? 'none' : 'flex';
        footerArrow.textContent = isVisible ? '▼' : '▲'; // Change arrow text
    };

    // Attach click handlers
    shadowRoot.querySelector('#inc').onclick = () => setSpeed(speed + 0.1);
    shadowRoot.querySelector('#dec').onclick = () => setSpeed(Math.max(0.1, speed - 0.1));
    footerArrow.onclick = togglePanel;

    // ---------------- Core / Helper Functions (Unchanged) ----------------
    function setSpeed(target) {
        let newSpeed = Math.max(0.1, target);
        newSpeed = Math.min(MAX_SPEED, newSpeed);

        const currentTime = performance.now();
        const realDelta = currentTime - bootTime;
        const currentScaledTime = realDelta * speed + scaledTimeOffset;

        speed = newSpeed;
        scaledTimeOffset = currentScaledTime - (currentTime - bootTime) * speed;

        spdEl.innerHTML = formatSpeed(speed);
        afterSpeedChange();
    }

    function afterSpeedChange() {
        if (hooks.css) applyCSSScaling();
        applyLibScaling();
        updateHooks();
    }

    function getVirtualTime() {
        return (performance.now() - bootTime) * speed + scaledTimeOffset;
    }

    // ---------------- Core Hooks ----------------
    let rafLast = 0;
    let rafVirtual = 0;

function enableVirtualRAF() {
        window.requestAnimationFrame = cb => {
            native.requestAnimationFrame(now => {
                // Directly calculate the virtual timestamp on each frame using the 'now'
                // value from rAF. This is more accurate and prevents the accumulation
                // of floating-point errors that cause visual choppiness.
                const virtualNow = (now - bootTime) * speed + scaledTimeOffset;
                cb(virtualNow);
            });
        };
    }

    function disableVirtualRAF() {
        window.requestAnimationFrame = native.requestAnimationFrame;
        rafLast = 0;
        rafVirtual = 0;
    }

    function enableVirtualTime() {
        window.performance.now = () => getVirtualTime();
    }

    function disableVirtualTime() {
        window.performance.now = native.performance.now.bind(native.performance);
    }

    function enableVirtualDate() {
        const nativeDate = native.Date;
        const nativeNow = nativeDate.now;
        const realDateBoot = nativeNow();
        const performanceBoot = performance.now();

        function ScaledDate(...args) {
            if (!new.target) {
                return new nativeDate(realDateBoot + getVirtualTime() - performanceBoot).toString();
            }
            if (args.length === 0) {
                const offset = getVirtualTime() - performanceBoot;
                return new nativeDate(realDateBoot + offset);
            }
            return new nativeDate(...args);
        }
        ScaledDate.now = () => realDateBoot + getVirtualTime() - performanceBoot;
        Object.assign(ScaledDate, nativeDate);
        window.Date = ScaledDate;
    }

    function disableVirtualDate() {
        window.Date = native.Date;
    }

function updateHooks() {
        if (hooks.setTimeout) {
            window.setTimeout = (fn, t, ...a) => {
                const base = Number.isFinite(t) ? (t ?? 0) : 0;
                // KEY FIX: Removed Math.round() for perfectly smooth, proportional scaling.
                const scaled = Math.max(MIN_TIMEOUT_MS, base / speed);
                return native.setTimeout(fn, scaled, ...a);
            };
        } else {
            window.setTimeout = native.setTimeout;
        }

        if (hooks.setInterval) {
            window.setInterval = (fn, t, ...a) => {
                const base = Number.isFinite(t) ? (t ?? 0) : 0;
                // KEY FIX: Removed Math.round() for perfectly smooth, proportional scaling.
                const scaled = Math.max(MIN_INTERVAL_MS, base / speed);
                return native.setInterval(fn, scaled, ...a);
            };
        } else {
            window.setInterval = native.setInterval;
        }

        if (hooks.requestAnimationFrame) enableVirtualRAF(); else disableVirtualRAF();
        if (hooks.time) enableVirtualTime(); else disableVirtualTime();
        if (hooks.date) enableVirtualDate(); else disableVirtualDate();
        if (hooks.css) applyCSSScaling(); else restoreCSSDurations();
    }
// ---------------- CSS scaling ----------------
// ---------------- CSS scaling ----------------

// A dedicated style tag for our CSS overrides.
let overrideStyleSheet = null;

// The responsive curve that eliminates the "in-between" stutter.
const MASTER_EASING_CURVE = 'cubic-bezier(0.23, 1, 0.32, 1)';

// This function now simply calculates the new duration and applies our override styles.
function applyCSSScaling() {
    // The base duration is 300ms, as confirmed by the logs from both apps.
    const newDuration = 300 / speed;

    // Set the master --duration variable for the whole page.
    document.documentElement.style.setProperty('--duration', `${newDuration.toFixed(2)}ms`);

    // Create our stylesheet only once.
    if (!overrideStyleSheet) {
        overrideStyleSheet = document.createElement('style');
        document.head.appendChild(overrideStyleSheet);
    }

    // Inject a rule to force our responsive easing curve onto the key elements.
    // This targets all elements that have "svelte-" in their class name,
    // which covers both apps we've tested.
    overrideStyleSheet.textContent = `
        [class*="svelte-"] {
            transition-timing-function: ${MASTER_EASING_CURVE} !important;
            animation-timing-function: ${MASTER_EASING_CURVE} !important;
        }
    `;
}

// This function now just has to clean up our changes.
function restoreCSSDurations() {
    // Reset the CSS variable to its original value.
    document.documentElement.style.removeProperty('--duration');

    // Remove our injected stylesheet.
    if (overrideStyleSheet) {
        overrideStyleSheet.remove();
        overrideStyleSheet = null;
    }
}
    // ---------------- Library hooks ----------------
    let threePatched = false;
    let pixiPatched = false;

    function applyLibScaling() {
        if (window.gsap) {
            try {
                if (hooks.gsap) window.gsap.globalTimeline.timeScale(speed);
                else window.gsap.globalTimeline.timeScale(1);
            } catch {}
        }
        if (window.PIXI && window.PIXI.Ticker) {
            try {
                if (hooks.pixi) {
                    if (window.PIXI.Ticker.shared) window.PIXI.Ticker.shared.speed = speed;
                    if (window.PIXI.Ticker.system) window.PIXI.Ticker.system.speed = speed;
                    if (!pixiPatched) { pixiPatched = true; }
                } else {
                    if (window.PIXI.Ticker.shared) window.PIXI.Ticker.shared.speed = 1;
                    if (window.PIXI.Ticker.system) window.PIXI.Ticker.system.speed = 1;
                }
            } catch {}
        }
        if (window.THREE && window.THREE.Clock) {
            try {
                const C = window.THREE.Clock;
                if (!threePatched) {
                    if (!C.prototype.___nativeGetDelta) {
                        C.prototype.___nativeGetDelta = C.prototype.getDelta;
                        C.prototype.getDelta = function () {
                            const d = this.___nativeGetDelta();
                            return hooks.three ? d * speed : d;
                        };
                    }
                    if (!C.prototype.___nativeGetElapsedTime) {
                        C.prototype.___nativeGetElapsedTime = C.prototype.getElapsedTime;
                        C.prototype.getElapsedTime = function () {
                            const e = this.___nativeGetElapsedTime();
                            return hooks.three ? e * speed : e;
                        };
                    }
                    threePatched = true;
                }
            } catch {}
        }
        if (window.anime) {
            try { window.anime.speed = hooks.anime ? speed : 1; } catch {}
        }
        if (window.Velocity) {
            try { window.Velocity.mock = hooks.velocity ? (1 / speed) : false; } catch {}
        }
    }

    const libDetectAndInit = () => {
        // Querying the main window for library objects still works
        const present = { gsap:  !!(window.gsap), pixi:  !!(window.PIXI && window.PIXI.Ticker), three: !!(window.THREE && window.THREE.Clock), anime: !!(window.anime), velocity: !!(window.Velocity) };
        for (const k of Object.keys(present)) {
            if (hooks[k] === null) hooks[k] = present[k];
            // Re-select elements using the shadowRoot
            const rowMap = {
                gsap: shadowRoot.querySelector('#lib-gsap'),
                pixi: shadowRoot.querySelector('#lib-pixi'),
                three: shadowRoot.querySelector('#lib-three'),
                anime: shadowRoot.querySelector('#lib-anime'),
                velocity: shadowRoot.querySelector('#lib-velocity')
            };
            // Note: The logic below assumes the element and its class structure exist
            if (rowMap[k]) {
                const boldLabel = rowMap[k].querySelector('.toggle-label-bold');
                if (boldLabel) boldLabel.style.opacity = present[k] ? '1' : '.55';
            }
        }
        applyLibScaling();
    };
    native.setInterval(libDetectAndInit, 1500);
    libDetectAndInit();

    // ---------------- Init
    function boot() {
        const initialPerformanceNow = native.performance.now();
        scaledTimeOffset = initialPerformanceNow - initialPerformanceNow * speed;
        updateHooks();
    }
    boot();
})();