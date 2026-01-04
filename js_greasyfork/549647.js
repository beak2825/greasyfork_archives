// ==UserScript==
// @name         Terri DonoBots 1.5
// @namespace    Violentmonkey Scripts
// @version      1.3
// @description  Spawns iframes, simulates typing names, clicks Multiplayer. Adds centralized control for all iframes including mode selection.
// @match        https://territorial.io/*
// @grant        none
// @run-at       document-end
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/549647/Terri%20DonoBots%2015.user.js
// @updateURL https://update.greasyfork.org/scripts/549647/Terri%20DonoBots%2015.meta.js
// ==/UserScript==

(function () {
    "use strict";

    document.addEventListener("click", function (event) {
        if (event.shiftKey && event.button === 0) {
            event.preventDefault();
            if (window.top !== window) {
                window.top.postMessage({ type: "SPAWN_IFRAMES_REQUEST" }, "*");
            } else {
                const count = +prompt("How many iframes to spawn?", "2");
                if (!isNaN(count) && count > 0) spawnIframes(count);
            }
        }
    });

    if (window.top === window) {
        window.addEventListener("message", (event) => {
            if (event.data?.type === "SPAWN_IFRAMES_REQUEST") {
                const count = +prompt("How many iframes to spawn?", "2");
                if (!isNaN(count) && count > 0) spawnIframes(count);
            }
        });
    }

    function spawnIframes(count) {
        const URL = "https://territorial.io/";
        const clanTag = prompt("Enter clan tag to prepend (e.g. [TAG]):", "[TAG]") || "";

        const predefinedNames = [
            "Iron Legion",
            "Player 834",
            "[TX] LoneStar",
            "Neo Persia",
            "Soviet Revival",
            "Player 219",
            "[GOD] RulerMaximus",
            "Empire of Ice",
            "🦅 EagleStrike",
            "New Caliphate"
        ]



        let container = document.getElementById("iframeContainer");
        if (!container) {
            container = document.createElement("div");
            container.id = "iframeContainer";
            document.body.innerHTML = "";
            document.body.appendChild(container);
            applyPageStyles();
            createCommandPanel(); // Add control panel
        }

        const { cols, rows } = getGridDimensions(count);
        Object.assign(container.style, {
            display: "grid",
            gap: "10px",
            width: "100%",
            height: "100vh",
            padding: "10px",
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 1fr)`
        });

        container.innerHTML = "";

        for (let i = 0; i < count; i++) {
            const playerName = `${clanTag} ${predefinedNames[i % predefinedNames.length]}`;
            const wrapper = createIframeWrapper(URL, playerName);
            container.appendChild(wrapper);
        }
    }

    function createIframeWrapper(src, fullName) {
        const wrapper = document.createElement("div");
        Object.assign(wrapper.style, {
            position: "relative",
            width: "100%",
            height: "100%"
        });

        const iframe = document.createElement("iframe");
        iframe.src = src;
        iframe.sandbox = "allow-scripts allow-forms allow-same-origin";
        Object.assign(iframe.style, {
            width: "100%",
            height: "100%",
            border: "2px solid white",
            borderRadius: "10px",
            background: "#000",
            transition: "transform 0.2s ease-in-out"
        });

       iframe.onload = () => {
           const wait = setInterval(() => {
               if (!iframe.contentDocument || !iframe.contentWindow) return;

               const input = iframe.contentDocument.querySelector('input');
               const multiplayerButton = Array.from(iframe.contentDocument.getElementsByTagName('button'))
               .find(btn => btn.innerText.includes('Multiplayer'));

               if (input && multiplayerButton && input.offsetParent !== null) {
                   clearInterval(wait);

                   input.focus();
                   input.setSelectionRange(0, 0);
                   input.value = ""; // Clear default name

                   simulateTyping(input, fullName, () => {
                       input.blur();
                       setTimeout(() => input.focus(), 50);
                       setTimeout(() => {
                           const rect = multiplayerButton.getBoundingClientRect();
                           const x = rect.left + rect.width / 2;
                           const y = rect.top + rect.height / 2;

                           ['mousedown', 'mouseup', 'click'].forEach(type => {
                               multiplayerButton.dispatchEvent(new MouseEvent(type, {
                                   view: iframe.contentWindow,
                                   bubbles: true,
                                   cancelable: true,
                                   clientX: x,
                                   clientY: y,
                                   button: 0
                               }));
                           });
                       }, 100);
                   });
               }
           }, 200);
       };


        iframe.onmouseover = () => (iframe.style.transform = "scale(1.02)");
        iframe.onmouseout = () => (iframe.style.transform = "scale(1)");

        const controls = createControls(wrapper);
        wrapper.appendChild(controls);
        wrapper.appendChild(iframe);
        return wrapper;
    }


    function simulateTyping(input, prependText, callback) {
        const originalValue = input.value.trim();
        const fullText = originalValue.startsWith(prependText) ? originalValue : prependText + originalValue;

        input.focus();
        input.value = "";
        input.dispatchEvent(new InputEvent("input", { bubbles: true }));

        let i = 0;

        function typeNext() {
            if (i >= fullText.length) {
                input.dispatchEvent(new InputEvent("input", { bubbles: true }));
                input.dispatchEvent(new Event("change", { bubbles: true }));
                setTimeout(() => callback?.(), 200);
                return;
            }

            const char = fullText[i];
            const start = input.selectionStart;

            input.setRangeText(char, start, start, "end");

            input.dispatchEvent(new KeyboardEvent("keydown", { key: char, bubbles: true }));
            input.dispatchEvent(new KeyboardEvent("keypress", { key: char, bubbles: true }));

            input.dispatchEvent(new InputEvent("input", {
                bubbles: true,
                data: char,
                inputType: "insertText"
            }));

            input.dispatchEvent(new KeyboardEvent("keyup", { key: char, bubbles: true }));

            i++;
            setTimeout(typeNext, 60);
        }

        typeNext();
    }

    function createControls(wrapper) {
        const controls = document.createElement("div");
        Object.assign(controls.style, {
            position: "absolute",
            top: "5px",
            right: "5px",
            zIndex: "10",
            display: "flex",
            gap: "5px"
        });

        function makeButton(label, color, handler) {
            const btn = document.createElement("button");
            btn.innerText = label;
            Object.assign(btn.style, {
                background: color,
                border: "none",
                padding: "5px",
                cursor: "pointer",
                color: "white",
                borderRadius: "5px"
            });
            btn.onclick = handler;
            return btn;
        }

        const closeBtn = makeButton("✖", "red", () => wrapper.remove());
        const maxBtn = makeButton("⛶", "green", () => toggleMaximize(wrapper, maxBtn));

        controls.appendChild(closeBtn);
        controls.appendChild(maxBtn);
        return controls;
    }

    function toggleMaximize(wrapper, button) {
        const isMaximized = wrapper.style.position === "fixed";
        if (isMaximized) {
            Object.assign(wrapper.style, {
                position: "relative",
                width: "100%",
                height: "100%",
                zIndex: "1"
            });
            button.innerText = "⛶";
        } else {
            Object.assign(wrapper.style, {
                position: "fixed",
                top: "0",
                left: "0",
                width: "100vw",
                height: "100vh",
                zIndex: "999"
            });
            button.innerText = "🗗";
        }
    }

    function applyPageStyles() {
        document.body.style.display = "flex";
        document.body.style.justifyContent = "center";
        document.body.style.alignItems = "center";
        document.body.style.height = "100vh";
        document.body.style.backgroundColor = "#222";
        document.body.style.overflow = "hidden";
    }

    function getGridDimensions(count) {
        if (count <= 3) return { cols: count, rows: 1 };
        if (count === 4) return { cols: 2, rows: 2 };
        if (count <= 6) return { cols: 3, rows: Math.ceil(count / 3) };
        if (count <= 8) return { cols: 4, rows: Math.ceil(count / 4) };
        const cols = Math.ceil(Math.sqrt(count));
        const rows = Math.ceil(count / cols);
        return { cols, rows };
    }

    // 🌐 COMMAND BROADCASTING
    function createCommandPanel() {
        const panel = document.createElement("div");
        Object.assign(panel.style, {
            position: "fixed",
            bottom: "10px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: "1000",
            backgroundColor: "#333",
            color: "white",
            padding: "10px",
            borderRadius: "8px",
            display: "flex",
            gap: "10px",
            alignItems: "center",
            flexWrap: "wrap",
            cursor: "move",
            userSelect: "none"
        });

        let isDragging = false;
        let offsetX = 0;
        let offsetY = 0;

        panel.addEventListener("mousedown", (e) => {
            isDragging = true;
            offsetX = e.clientX - panel.getBoundingClientRect().left;
            offsetY = e.clientY - panel.getBoundingClientRect().top;
            panel.style.transition = "none";
        });

        document.addEventListener("mousemove", (e) => {
            if (!isDragging) return;
            e.preventDefault();
            panel.style.left = `${e.clientX - offsetX}px`;
            panel.style.top = `${e.clientY - offsetY}px`;
            panel.style.bottom = "auto";
            panel.style.transform = "none";
        });

        document.addEventListener("mouseup", () => {
            isDragging = false;
        });

        const select = document.createElement("select");
        Object.assign(select.style, {
            background: "#444",
            color: "white",
            border: "none",
            padding: "5px",
            borderRadius: "4px"
        });

        const modes = ["Team", "Battle Royale", "1v1", "Zombie"];
        modes.forEach(mode => {
            const option = document.createElement("option");
            option.value = mode;
            option.textContent = mode;
            select.appendChild(option);
        });

        const setModeBtn = document.createElement("button");
        setModeBtn.textContent = "Set Mode";
        Object.assign(setModeBtn.style, {
            background: "#555",
            color: "white",
            border: "none",
            padding: "5px 10px",
            borderRadius: "4px",
            cursor: "pointer"
        });
        setModeBtn.onclick = () => broadcastCommand("SELECT_MODE", { mode: select.value });

        const readyBtn = document.createElement("button");
        readyBtn.textContent = "Ready";
        Object.assign(readyBtn.style, {
            background: "#228B22",
            color: "white",
            border: "none",
            padding: "5px 10px",
            borderRadius: "4px",
            cursor: "pointer"
        });
        readyBtn.onclick = () => broadcastCommand("CLICK_READY");

        const attackBtn = document.createElement("button");
        attackBtn.textContent = "Attack";
        Object.assign(attackBtn.style, {
            background: "#d9534f",
            color: "white",
            border: "none",
            padding: "5px 10px",
            borderRadius: "4px",
            cursor: "pointer"
        });
        attackBtn.onclick = () => broadcastCommand("ATTACK");

        const openingBtn = document.createElement("button");
        openingBtn.textContent = "Run GB v1";
        Object.assign(openingBtn.style, {
            background: "#337ab7",
            color: "white",
            border: "none",
            padding: "5px 10px",
            borderRadius: "4px",
            cursor: "pointer"
        });
        openingBtn.onclick = () => broadcastCommand("RUN_OPENING");

        const multiplayerBtn = document.createElement("button");
        multiplayerBtn.textContent = "Multiplayer";
        Object.assign(multiplayerBtn.style, {
            background: "#007bff",
            color: "white",
            border: "none",
            padding: "5px 10px",
            borderRadius: "4px",
            cursor: "pointer"
        });
        multiplayerBtn.onclick = () => broadcastCommand("CLICK_MULTIPLAYER");

        const backBtn = document.createElement("button");
        backBtn.textContent = "Back";
        Object.assign(backBtn.style, {
            background: "#6c757d",
            color: "white",
            border: "none",
            padding: "5px 10px",
            borderRadius: "4px",
            cursor: "pointer"
        });
        backBtn.onclick = () => broadcastCommand("CLICK_BACK");

        panel.appendChild(multiplayerBtn);
        panel.appendChild(backBtn);
        panel.appendChild(openingBtn);
        panel.appendChild(attackBtn);
        panel.appendChild(select);
        panel.appendChild(setModeBtn);
        panel.appendChild(readyBtn);
        document.body.appendChild(panel);
    }



    function broadcastCommand(command, payload = {}) {
        const iframes = document.querySelectorAll("iframe");
        for (const iframe of iframes) {
            iframe.contentWindow.postMessage({
                type: "IFRAME_COMMAND",
                command,
                ...payload
            }, "*");
        }
    }

    // 📥 LISTEN IN IFRAME
    if (window.top !== window) {
        window.addEventListener("message", (event) => {
            const data = event.data;
            if (data?.type === "IFRAME_COMMAND") {
                if (data.command === "CLICK_READY") {
                    const interval = setInterval(() => {
                        const readyButton = [...document.querySelectorAll("button")]
                            .find(btn => btn.innerText.toLowerCase().includes("ready"));
                        if (readyButton && readyButton.offsetParent !== null) {
                            readyButton.click();
                            clearInterval(interval);
                            console.log("✅ Ready button clicked");
                        }
                    }, 500);
                }

                if (data.command === "SELECT_MODE") {
                    const targetText = data.mode;
                    const interval = setInterval(() => {
                        const btns = [...document.querySelectorAll("button")];
                        const modeButton = btns.find(btn =>
                            btn.innerText.trim().toLowerCase().startsWith(targetText.toLowerCase())
                        );

                        if (modeButton && modeButton.offsetParent !== null) {
                            modeButton.click();
                            clearInterval(interval);
                            console.log("✅ Mode selected:", targetText);
                        }
                    }, 500);
                }
                // Simulate pressing the spacebar key to trigger attack in iframe
                if (data.command === "ATTACK") {
                    const keyboardEventInit = {
                        key: "m",
                        code: "KeyM",
                        keyCode: 77,
                        which: 77,
                        bubbles: true,
                        cancelable: true
                    };

                    ['keydown', 'keypress', 'keyup'].forEach(type => {
                        document.dispatchEvent(new KeyboardEvent(type, keyboardEventInit));
                    });

                    console.log("✅ Attack command triggered (M key simulated)");
                }

                if (data.command === "CLICK_MULTIPLAYER") {
                    const interval = setInterval(() => {
                        const multiplayerBtn = [...document.querySelectorAll("button")]
                        .find(btn => btn.innerText.toLowerCase().includes("multiplayer"));
                        if (multiplayerBtn && multiplayerBtn.offsetParent !== null) {
                            multiplayerBtn.click();
                            clearInterval(interval);
                            console.log("🎮 Multiplayer button clicked");
                        }
                    }, 500);
                }

                if (data.command === "CLICK_BACK") {
                    const interval = setInterval(() => {
                        const backBtn = [...document.querySelectorAll("button")]
                        .find(btn => btn.innerText.toLowerCase().includes("back"));
                        if (backBtn && backBtn.offsetParent !== null) {
                            backBtn.click();
                            clearInterval(interval);
                            console.log("↩️ Back button clicked");
                        }
                    }, 500);
                }

                if (data.command === "RUN_OPENING") {
                    const multiplayerDelay = 2; // ⏱️ Inputs are sent earlier by this amount (in seconds)

                    const openingSteps = [
                        { delay: 4.1, keys: "sssssddd" },
                        { delay: 9.7, keys: "wwaa" },
                        { delay: 15.3, keys: "aa" },
                        { delay: 20.9, keys: "a" },
                        { delay: 26, keys: "wwdd" },
                        { delay: 28.6, keys: "sss" },
                        { delay: 30.2, keys: "ss" },
                        { delay: 32.8, keys: "ss" },
                        { delay: 35.5, keys: "ss" },
                        { delay: 39.5, keys: "ss" },
                        { delay: 45.5, keys: "s" },
                        { delay: 49.5, keys: "d" },
                        { delay: 55.5, keys: "d" },
                    ];

                    function pressKeys(sequence, startDelayMs) {
                        for (let i = 0; i < sequence.length; i++) {
                            const key = sequence[i];
                            const eventProps = {
                                key: key,
                                code: `Key${key.toUpperCase()}`,
                                keyCode: key.toUpperCase().charCodeAt(0),
                                which: key.toUpperCase().charCodeAt(0),
                                bubbles: true
                            };
                            setTimeout(() => {
                                ['keydown', 'keypress', 'keyup'].forEach(type =>
                                                                         document.dispatchEvent(new KeyboardEvent(type, eventProps))
                                                                        );
                            }, startDelayMs + i * 100);
                        }
                    }

                    function pressM(atDelayMs) {
                        const eventProps = {
                            key: "m",
                            code: "KeyM",
                            keyCode: 77,
                            which: 77,
                            bubbles: true
                        };
                        setTimeout(() => {
                            ['keydown', 'keypress', 'keyup'].forEach(type =>
                                                                     document.dispatchEvent(new KeyboardEvent(type, eventProps))
                                                                    );
                            console.log(`🚀 Attack triggered with M at ${atDelayMs / 1000}s`);
                        }, atDelayMs);
                    }

                    openingSteps.forEach(({ delay, keys }) => {
                        const adjustedDelayMs = Math.max(0, (delay - multiplayerDelay) * 1000);
                        const keyPressDuration = keys.length * 100; // 100ms per key
                        const keyStartTime = adjustedDelayMs - keyPressDuration;

                        // Press keys first (so they complete before M)
                        if (keyStartTime >= 0) {
                            pressKeys(keys, keyStartTime);
                        } else {
                            // Not enough time to type before attack — fallback to immediate typing
                            pressKeys(keys, 0);
                        }

                        // Press M at exact adjusted delay
                        pressM(adjustedDelayMs);
                    });
                }




            }
        });
    }

})();
