// ==UserScript==
// @name         preformance booster for eaglercraft :D
// @description  RGB autoclicker-style UI for iPad Safari Userscripts. Uses trusted DOM events (keydown/input/change) instead of real clicks. Works on any site that accepts them; safely does nothing on sites that don't. ArrowUp = toggle, ; = freeze.
// @match        *://*/*
// @run-at       document-end
// @version 0.0.1.20260116024433
// @namespace https://greasyfork.org/users/1547770
// @downloadURL https://update.greasyfork.org/scripts/562823/preformance%20booster%20for%20eaglercraft%20%3AD.user.js
// @updateURL https://update.greasyfork.org/scripts/562823/preformance%20booster%20for%20eaglercraft%20%3AD.meta.js
// ==/UserScript==

(function() {

    function ready(fn) {
        if (document.readyState !== "loading") fn()
        else document.addEventListener("DOMContentLoaded", fn)
    }

    ready(() => {

        // --- Create panel (hidden by default) ---
        const panel = document.createElement("div")
        panel.id = "gloriousPanel"
        panel.innerHTML = `
            <div class="title">GLORIOUS RGB AUTOCLICKER</div>

            <div class="statusRow">
                <span>Status:</span>
                <span id="gloriousStatus" class="off">OFF</span>
            </div>

            <div class="sliderRow">
                <span>Rate:</span>
                <input id="gloriousRate" type="range" min="1" max="50" value="10">
                <span id="gloriousRateValue">10</span>/s
            </div>

            <div class="hintRow">
                <span>Toggle: ArrowUp</span>
                <span>Freeze: ;</span>
            </div>
        `
        document.body.appendChild(panel)

        // --- Inject CSS ---
        const css = document.createElement("style")
        css.textContent = `
            #gloriousPanel {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 260px;
                padding: 15px;
                background: #0b0b0b;
                border-radius: 12px;
                z-index: 999999;
                color: white;
                font-family: Arial, sans-serif;
                user-select: none;

                opacity: 0;
                pointer-events: none;
                transform: translateY(10px);
                transition: opacity 0.4s ease, transform 0.4s ease;

                border: 3px solid transparent;
                animation: rgbBorder 4s linear infinite;
                box-shadow: 0 0 20px rgba(0,0,0,0.8);
            }

            #gloriousPanel.visible {
                opacity: 1;
                pointer-events: auto;
                transform: translateY(0);
                box-shadow: 0 0 25px rgba(255,255,255,0.25);
            }

            @keyframes rgbBorder {
                0%   { border-color: red; }
                14%  { border-color: orange; }
                28%  { border-color: yellow; }
                42%  { border-color: lime; }
                57%  { border-color: cyan; }
                71%  { border-color: blue; }
                85%  { border-color: magenta; }
                100% { border-color: red; }
            }

            .title {
                text-align: center;
                font-weight: bold;
                margin-bottom: 10px;
                font-size: 13px;
                letter-spacing: 1px;
            }

            .statusRow, .sliderRow, .hintRow {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin: 6px 0;
                font-size: 12px;
            }

            #gloriousStatus.on { color: lime; }
            #gloriousStatus.off { color: red; }

            #gloriousRate {
                flex: 1;
                margin: 0 8px;
            }

            .hintRow span {
                opacity: 0.7;
                font-size: 11px;
            }
        `
        document.head.appendChild(css)

        // --- State ---
        let active = false
        let interval = null
        let uiVisible = false
        let frozen = false   // freeze flag (controlled by ;)

        const statusEl = document.getElementById("gloriousStatus")
        const rateSlider = document.getElementById("gloriousRate")
        const rateValue = document.getElementById("gloriousRateValue")

        rateSlider.addEventListener("input", () => {
            rateValue.textContent = rateSlider.value
            if (active && !frozen) restart()
        })

        function showUI() {
            if (!uiVisible) {
                uiVisible = true
                panel.classList.add("visible")
            }
        }

        function hideUI() {
            uiVisible = false
            panel.classList.remove("visible")
        }

        function spamEvents() {
            if (frozen) return

            const target = document.activeElement || document.body

            // keydown (Space)
            const kd = new KeyboardEvent("keydown", {
                key: " ",
                code: "Space",
                bubbles: true,
                cancelable: true
            })
            target.dispatchEvent(kd)

            // input
            const inp = new Event("input", { bubbles: true, cancelable: true })
            target.dispatchEvent(inp)

            // change
            const ch = new Event("change", { bubbles: true, cancelable: true })
            target.dispatchEvent(ch)
        }

        function start() {
            if (active || frozen) return
            active = true
            statusEl.textContent = "ON"
            statusEl.className = "on"

            const delay = 1000 / rateSlider.value
            interval = setInterval(spamEvents, delay)
        }

        function stop() {
            active = false
            statusEl.textContent = "OFF"
            statusEl.className = "off"
            clearInterval(interval)
        }

        function restart() {
            if (!active || frozen) return
            clearInterval(interval)
            const delay = 1000 / rateSlider.value
            interval = setInterval(spamEvents, delay)
        }

        function freezeAll() {
            frozen = true
            stop()
        }

        function unfreeze() {
            frozen = false
        }

        // --- Keyboard controls ---
        document.addEventListener("keydown", (e) => {
            // Freeze key: ;
            if (e.key === ";") {
                freezeAll()
                return
            }

            // ArrowUp: show UI / toggle (only if not frozen)
            if (e.key === "ArrowUp") {
                if (!uiVisible) {
                    showUI()
                    unfreeze()  // unfreeze when user intentionally reopens UI
                    return
                }
                if (frozen) return
                active ? stop() : start()
            }
        })
    })

})();
