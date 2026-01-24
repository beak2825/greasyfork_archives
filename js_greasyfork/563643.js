// ==UserScript==
// @name         Kour +
// @match        *://kour.io/*
// @version      1.0.0
// @author       some jew
// @description  debug tool
// @run-at       document-start
// @grant        unsafeWindow
// @namespace https://greasyfork.org/users/1369586
// @downloadURL https://update.greasyfork.org/scripts/563643/Kour%20%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/563643/Kour%20%2B.meta.js
// ==/UserScript==

(function () {
    "use strict";

    if (typeof window === "undefined") return;

    const weapons = [
        { name: "AK-47", id: "0" }, { name: "Deagle", id: "1" }, { name: "AWP", id: "2" },
        { name: "Bayonet", id: "3" }, { name: "Uzi", id: "4" }, { name: "PKM", id: "5" },
        { name: "Revolver", id: "6" }, { name: "RPG", id: "7" }, { name: "USPS", id: "8" },
        { name: "MP5", id: "9" }, { name: "Shotgun", id: "10" }, { name: "Glock", id: "11" },
        { name: "Karambit", id: "12" }, { name: "Knife", id: "13" }, { name: "Scar", id: "14" },
        { name: "Minigun", id: "15" }, { name: "Famas", id: "16" }, { name: "Vector", id: "17" },
        { name: "Flamethrower", id: "18" }, { name: "Kar98k", id: "19" }, { name: "M4A4", id: "20" },
        { name: "Tec-9", id: "21" }, { name: "CZ", id: "22" }, { name: "Berretta92fs", id: "23" },
        { name: "AK-109", id: "24" }, { name: "P90", id: "25" }, { name: "Thompson", id: "26" },
        { name: "UMP45", id: "27" }, { name: "XM1014", id: "28" }, { name: "Butterfly", id: "29" },
        { name: "Laser Gun", id: "30" }, { name: "Bomb", id: "31" }, { name: "Smoke Grenade", id: "32" },
        { name: "Molotov", id: "33" }, { name: "Grenade", id: "34" }, { name: "Flashbang", id: "35" },
        { name: "Glizzy", id: "36" }, { name: "Axe", id: "37" }, { name: "Bare Fists", id: "38" }
    ];

    const skins = [
        { name: "KBI Agent", id: "12" }, { name: "James Kour", id: "13" }, { name: "President", id: "14" },
        { name: "Doctor", id: "15" }, { name: "Trickster", id: "16" }, { name: "Royal Guard", id: "17" },
        { name: "Xmas", id: "18" }, { name: "Kelvis", id: "19" }, { name: "Princess Pink", id: "20" },
        { name: "Princess White", id: "21" }, { name: "Princess Bee", id: "22" }, { name: "Princess Leaf", id: "23" },
        { name: "Koura Kraft", id: "24" }, { name: "Green Hologram", id: "25" }, { name: "Hologrape", id: "26" },
        { name: "Peter", id: "27" }, { name: "Chicken", id: "28" }, { name: "Chickoletta", id: "29" },
        { name: "Kyle", id: "30" }, { name: "Shadowgram", id: "32" }, { name: "IceBunny", id: "33" },
        { name: "CocoBunny", id: "34" }, { name: "Kourean", id: "35" }, { name: "KourG", id: "36" },
        { name: "Hackour", id: "37" }, { name: "Golden Hackour", id: "38" }, { name: "Gas Man", id: "39" },
        { name: "Terrorist", id: "40" }, { name: "Counter Terrorist", id: "41" }, { name: "Ambush", id: "42" },
        { name: "Baby Kour", id: "43" }, { name: "Poacher", id: "44" }, { name: "Astronaut", id: "45" },
        { name: "Kour Parrot", id: "46" }, { name: "Kour Pirate", id: "47" }, { name: "Legionaut", id: "48" },
        { name: "Blue Hologram", id: "49" }, { name: "Mr Wireframe", id: "50" }, { name: "Mythian", id: "51" },
        { name: "Kour Trooper", id: "52" }, { name: "Kour Craft", id: "53" }, { name: "Kour Green Soldier", id: "54" },
        { name: "Yellow Astronaut", id: "55" }, { name: "Orange Astronaut", id: "56" }, { name: "Red Astronaut", id: "57" },
        { name: "Blue Astronaut", id: "58" }, { name: "Kour Banana", id: "59" }, { name: "Mrs Kour", id: "60" },
        { name: "Investor Inverted", id: "61" }, { name: "Kour Jungler", id: "62" }, { name: "Skinny Baby", id: "63" },
        { name: "KourTuber", id: "64" }, { name: "Red Hologram", id: "65" }, { name: "White Hologram", id: "66" },
        { name: "Orange Hologram", id: "67" }, { name: "Dark Blue Hologram", id: "68" }, { name: "Brown Hologram", id: "69" },
        { name: "Yellow Hologram", id: "70" }, { name: "Dark Red Hologram", id: "71" }, { name: "Kourist", id: "72" },
        { name: "Firefighter", id: "73" }, { name: "FireKour", id: "74" }, { name: "Kour Thief", id: "75" },
        { name: "Kour Burger", id: "76" }, { name: "Kour Fan", id: "77" }, { name: "Kour Brady", id: "78" },
        { name: "LeKour James", id: "79" }, { name: "Uncle Kour", id: "80" }, { name: "Chef", id: "81" },
        { name: "KourObby", id: "82" }, { name: "Legionary", id: "83" }, { name: "Kitty Kour One", id: "84" },
        { name: "Kitty Kour Two", id: "85" }, { name: "Kitty Kour Three", id: "86" }, { name: "Kour Crafter", id: "87" },
        { name: "RTX", id: "88" }, { name: "Loony Kour", id: "89" }, { name: "Kour Shocker", id: "90" },
        { name: "Kourkin", id: "91" }, { name: "Forest Kour", id: "92" }, { name: "Slender Kour", id: "93" },
        { name: "Drakour", id: "94" }, { name: "Christmas2024", id: "95" }, { name: "Deer2024", id: "96" }
    ];

    const classMap = {
        Soldier: "class0kills", Hitman: "class1kills", Gunner: "class2kills",
        Heavy: "class3kills", Rocketeer: "class4kills", Agent: "class5kills",
        Brawler: "class6kills", Investor: "class7kills", Assassin: "class8kills",
        Juggernaut: "class9kills", Recon: "class10kills", Pyro: "class11kills",
        Rayblader: "class15kills",
    };

    const classIDMap = {
        Soldier: 0, Hitman: 1, Gunner: 2, Heavy: 3, Rocketeer: 4,
        Agent: 5, Brawler: 6, Investor: 7, Assassin: 8, Juggernaut: 9,
        Recon: 10, Pyro: 11, Rayblader: 12
    };

    function firebaseOp(refPath, data, op = 'update') {
        if (typeof firebase === "undefined" || !firebase.auth().currentUser) return false;
        const ref = firebase.database().ref(`users/${firebase.auth().currentUser.uid}${refPath}`);
        ref[op](data).then(() => {
            if (typeof showUserDetails !== "undefined") showUserDetails(firebase.auth().currentUser.email, firebase.auth().currentUser);
        });
        return true;
    }

    const setStat = (stat, val) => firebaseOp("/public", { [stat]: isNaN(parseInt(val)) ? val : parseInt(val) });
    const setClassKills = (cls, count) => firebaseOp("", { [classMap[cls]]: parseInt(count) });
    const updateTotalKills = (kills) => firebaseOp("", { totalKills: parseInt(kills) });
    const setSecondary = (id) => firebaseOp("/overrideWeaponIndexes1", id, 'set');
    const setMelee = (id) => firebaseOp("/overrideWeaponIndexes2", id, 'set');
    const setSkin = (id) => firebaseOp("", { skin: id });

    function setNickname(name) {
        if (!name?.trim()) return false;
        const cleanName = name.trim();
        localStorage.setItem("playerNickname", cleanName);
        console.log(`[Name Changer] Saved name: ${cleanName}`);

        if (typeof unityInstance !== 'undefined') {
            unityInstance.SendMessage("MapScripts", "SetNickname", cleanName);
            console.log(`[Name Changer] Sent name to Unity: ${cleanName}`);
            return true;
        }
        return false;
    }

    // ===== AUTO-APPLY ON GAME JOIN =====
    let lastHash = window.location.hash;
    setInterval(() => {
        const currentHash = window.location.hash;
        if (currentHash !== lastHash && currentHash.includes("#")) {
            lastHash = currentHash;
            const savedName = localStorage.getItem("playerNickname");
            if (savedName) {
                console.log(`[Name Changer] Game joined, applying name: ${savedName}`);
                setTimeout(() => {
                    if (typeof unityInstance !== 'undefined') {
                        unityInstance.SendMessage("MapScripts", "SetNickname", savedName);
                    }
                }, 1000);
            }
        }
    }, 500);

    function selectClass(className) {
        const id = classIDMap[className];
        if (id === undefined) return false;
        localStorage.setItem("selectedClass", id);
        if (window.unityInstance) unityInstance.SendMessage("MapScripts", "ChangeClassTo", id);
        return true;
    }

    const getStatValue = (path, cb) => {
        if (typeof firebase === "undefined" || !firebase.auth().currentUser) return;
        firebase.database().ref(`users/${firebase.auth().currentUser.uid}${path}`).once('value').then(s => cb(s.val()));
    };

    window.kourProfile = { setStat, setClassKills, updateTotalKills, setNickname, selectClass, classMap, classIDMap };

    const blockAds = () => {
        const selectors = ['#ad-container', '.ad-unit', '[id*="ad-"]', '[class*="ad-"]', 'iframe[src*="googlesyndication"]', '.banner-ad', '#preroll-ad', '#kour-io_300x250', '#kour-io_728x90', '#kour-io_300x600'];
        const run = () => {
            selectors.forEach(s => document.querySelectorAll(s).forEach(el => el.remove()));
            document.querySelectorAll('div[style*="position: absolute"][style*="z-index: 100"]').forEach(ad => {
                if (ad.innerHTML.match(/iframe|google|adnxs/)) ad.remove();
            });
            document.querySelectorAll('.overlay').forEach(o => {
                if (o.textContent.toLowerCase().includes('ad') || o.innerHTML.includes('iframe')) o.style.display = 'none';
            });
        };
        setInterval(run, 2000);
        run();
    };
    blockAds();

    /***************************************
     * Network Hooks (Invisible & Instant Kill)
     ***************************************/

    const Signatures = {
        ping: "f3 07 01 00 00",
        pong: "f3 06 01 01 01",
        anotherPing: "f3 04 e2 03 e3",
        updateState: "f3 02 fd 02 f4 03 c8",
        damageTaken: "f3 04 c8 02 f5 15 04",
    };

    const toHex = (data) => Array.from(new Uint8Array(data)).map(b => b.toString(16).padStart(2, '0')).join(" ");

    const originalWebSocket = unsafeWindow.WebSocket;
    unsafeWindow.WebSocket = class extends originalWebSocket {
        constructor() {
            super(...arguments);
            this.addEventListener("open", () => {
                const send = this.send;
                const onmessage = this.onmessage;

                this.onmessage = (event) => {
                    if (!event.data) return onmessage?.call(this, event);
                    const hex = toHex(event.data);
                    if (hex.startsWith(Signatures.damageTaken) && settings.invisibleEnabled) return;
                    return onmessage?.call(this, event);
                };

                this.send = (data) => {
                    const hex = toHex(data);
                    if (hex.startsWith(Signatures.updateState) && settings.instantKillEnabled) {
                        for (let i = 0; i < 40; i++) send.call(this, data);
                    }
                    return send.call(this, data);
                };
            });
        }
    };

    /***************************************
     * ESP
     ***************************************/

    let gl = null;
    const filters = [
        { min: 1481, max: 1483 }, // normal
        { min: 1553, max: 1555 }, // princess
        { min: 5615, max: 5617 }, // RTX
        { min: 3875, max: 3877 }, // Egg
        //{ min: 239, max: 240},      // Map Secret
    ];

    window.espEnabled = true;

    window.addEventListener("keydown", (e) => {
        if (e.key.toLowerCase() === "p") {
            window.espEnabled = !window.espEnabled;
            const espCheckbox = document.getElementById("espToggle");
            if (espCheckbox) espCheckbox.checked = window.espEnabled;
            console.log(`[ ESP] Toggled ${window.espEnabled ? "ON" : "OFF"}`);
        }
    });

    // Initialize ESP color with a random primary color
    const primaryColors = [
        { r: 0, g: 255, b: 0 }, // Green
        { r: 255, g: 0, b: 0 }, // Red
        { r: 0, g: 0, b: 255 }, // Blue
    ];
    window.espColor = primaryColors[Math.floor(Math.random() * primaryColors.length)];

    const WebGL = WebGL2RenderingContext.prototype;

    HTMLCanvasElement.prototype.getContext = new Proxy(
        HTMLCanvasElement.prototype.getContext,
        {
            apply(target, thisArgs, args) {
                if (args[1]) {
                    args[1].preserveDrawingBuffer = true;
                }
                return Reflect.apply(...arguments);
            },
        },
    );

    const drawHandler = {
        apply(target, thisArgs, args) {
            const count = args[1];
            if (count === 300 && settings.crosshairEnabled) return;
            if (count === 24 && settings.damagenumbersoff) return;
            const blockarms = document.getElementById("blockarms");
            if (blockarms?.checked && count === 1098) return;

            const program = thisArgs.getParameter(thisArgs.CURRENT_PROGRAM);
            if (!program.uniforms) {
                const getLoc = (name) => thisArgs.getUniformLocation(program, name);
                program.uniforms = {
                    vertexCount: getLoc("vertexCount"),
                    espToggle: getLoc("espToggle"),
                    gnilgnim: getLoc("gnilgnim"),
                    espColor: getLoc("espColor"),
                };
            }

            const set1f = (loc, val) => loc && thisArgs.uniform1f(loc, val);
            set1f(program.uniforms.vertexCount, count);
            set1f(program.uniforms.espToggle, window.espEnabled ? 1.0 : 0.0);
            set1f(program.uniforms.gnilgnim, 13371337.0);

            if (program.uniforms.espColor && window.espColor) {
                const { r, g, b } = window.espColor;
                thisArgs.uniform3f(program.uniforms.espColor, r / 255, g / 255, b / 255);
            }

            gl = thisArgs;
            return Reflect.apply(...arguments);
        },
    };

    WebGL.drawElements = new Proxy(WebGL.drawElements, drawHandler);
    WebGL.drawElementsInstanced = new Proxy(
        WebGL.drawElementsInstanced,
        drawHandler,
    );

    function generateRangeConditions(varName) {
        return filters
            .map(
                ({ min, max }) =>
                    `(${varName} >= ${min}.0 && ${varName} <= ${max}.0)`,
            )
            .join(" || ");
    }

    WebGL.shaderSource = new Proxy(WebGL.shaderSource, {
        apply(target, thisArgs, args) {
            let [shader, src] = args;

            if (src.includes("gl_Position")) {
                const conditions = generateRangeConditions("vertexCount");
                src = src.replace(/void\s+main\s*\(\s*\)\s*\{/, `uniform float vertexCount, espToggle, gnilgnim;\nuniform vec3 espColor;\nout float vVertexCount;\nvoid main() {\nvVertexCount = vertexCount;\n`)
                         .replace(/(gl_Position\s*=.+;)/, `$1\nif (espToggle > 0.5 && (${conditions})) gl_Position.z = 0.01 + gl_Position.z * 0.1;\nif (espToggle > 0.5 && gnilgnim == 13371337.0) gl_Position.z *= 1.0;`);
            }

            if (src.includes("SV_Target0")) {
                const conditions = generateRangeConditions("vVertexCount");
                src = src.replace(/void\s+main\s*\(\s*\)\s*\{/, `uniform float espToggle, gnilgnim;\nuniform vec3 espColor;\nin float vVertexCount;\nvoid main() {`)
                         .replace(/return;/, `if (espToggle > 0.5 && (${conditions}) && SV_Target0.a > 0.5) SV_Target0 = vec4(espColor, 1.0);\nif (gnilgnim == 13371337.0) SV_Target0.rgb *= 1.0;\nreturn;`);
            }

            args[1] = src;
            return Reflect.apply(...arguments);
        },
    });

    /***************************************
     * Color Aimbot
     ***************************************/

    let fovCircleEnabled = true;

    const fovCanvas = document.createElement("canvas");
    fovCanvas.style.position = "fixed";
    fovCanvas.style.top = "0";
    fovCanvas.style.left = "0";
    fovCanvas.style.pointerEvents = "none";
    fovCanvas.style.zIndex = "9999";
    document.body.appendChild(fovCanvas);

    const fovCtx = fovCanvas.getContext("2d");

    function resizeCanvas() {
        fovCanvas.width = window.innerWidth;
        fovCanvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    function drawFOVCircle() {
        fovCtx.clearRect(0, 0, fovCanvas.width, fovCanvas.height);
        if (!fovCircleEnabled) return;
        const centerX = fovCanvas.width / 2;
        const centerY = fovCanvas.height / 2;

        fovCtx.beginPath();
        fovCtx.arc(centerX, centerY, settings.fovRadius, 0, Math.PI * 2);
        const { r, g, b } = window.fovColor || { r: 0, g: 255, b: 0 };
        fovCtx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.6)`;
        fovCtx.lineWidth = 2;
        fovCtx.stroke();
    }

    const settings = {
        aimbotEnabled: true,
        aimbotSpeed: 1.2,
        aimbotTriggerButton: ["left", "right"],
        crosshairEnabled: false,
        triggerbotEnabled: true,
        damagenumbersoff: false,
        invisibleEnabled: false,
        instantKillEnabled: false,
        hideArmsEnabled: false,
        fovRadius: 80,
    };

    let mouseButtons = { left: false, right: false };

    const handleMouse = (e, down) => {
        if (e.button === 0) mouseButtons.left = down;
        if (e.button === 2) mouseButtons.right = down;
    };

    document.addEventListener("mousedown", (e) => handleMouse(e, true), true);
    document.addEventListener("mouseup", (e) => handleMouse(e, false), true);
    document.addEventListener("contextmenu", (e) => {}, true);

    function isTriggerPressed() {
        return settings.aimbotTriggerButton.some((btn) => mouseButtons[btn]);
    }

    function isTargetPixel(r, g, b, a, t, c) {
        if (a === 0) return false;

        const dr = r - c.r;
        const dg = g - c.g;
        const db = b - c.b;

        return dr * dr + dg * dg + db * db <= t * t;
    }

    function updateAimbot() {
        drawFOVCircle();
        if (!settings.aimbotEnabled || !gl?.canvas || !isTriggerPressed()) return;

        const { width, height } = gl.canvas;
        // Increase scan area to better match FOV
        const scanW = Math.min(400, width || 0), scanH = Math.min(400, height || 0);
        if (scanW < 10 || scanH < 10) return;

        const centerX = width / 2, centerY = height / 2;
        const startX = Math.floor(centerX - scanW / 2), startY = Math.floor(centerY - scanH / 2);
        const pixels = new Uint8Array(scanW * scanH * 4);

        try {
            // Ensure we are reading from the correct buffer
            gl.readPixels(startX, startY, scanW, scanH, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
        } catch (e) {
            return;
        }

        let closestDist = Infinity, bestDX = 0, bestDY = 0;
        const t = 30; // Slightly higher tolerance for color matching
        const c = window.espColor;

        // Skip pixels for performance and focus on ESP highlights
        for (let i = 0; i < pixels.length; i += 16) {
            const r = pixels[i], g = pixels[i+1], b = pixels[i+2], a = pixels[i+3];

            if (isTargetPixel(r, g, b, a, t, c)) {
                const idx = i / 4;
                const x = idx % scanW;
                const y = Math.floor(idx / scanW);

                // Convert to screen relative coordinates
                const dx = startX + x - centerX;
                const dy = -(startY + y - centerY); // WebGL Y is inverted

                const dist = Math.hypot(dx, dy);
                if (dist > settings.fovRadius) continue;

                if (dist < closestDist) {
                    closestDist = dist;
                    bestDX = dx;
                    bestDY = dy;
                }
            }
        }

        if (closestDist < Infinity) {
            // Apply mouse movement toward target
            gl.canvas.dispatchEvent(new MouseEvent("mousemove", {
                movementX: bestDX * settings.aimbotSpeed,
                movementY: bestDY * settings.aimbotSpeed,
                bubbles: true,
                cancelable: true,
                composed: true
            }));
        }
    }

    setInterval(updateAimbot, 0);

    function createUI() {
        const menu = document.createElement("div");
        menu.id = "Menu";
        Object.assign(menu.style, {
            position: "fixed",
            top: "20px",
            left: "20px",
            width: "320px",
            background: "#2b2b2b",
            color: "#f1f1f1",
            fontFamily: "Consolas, monospace",
            fontSize: "12px",
            border: "1px solid #3a3a3a",
            userSelect: "none",
            padding: "0",
            zIndex: "10000",
            display: "none",
        });

        const tabBar = document.createElement("div");
        Object.assign(tabBar.style, {
            display: "flex",
            borderBottom: "1px solid #3a3a3a",
            background: "#232323",
            cursor: "move",
        });

        let currentTab = "Main";
        const tabs = ["Main", "Profile", "Loadout", "Settings"];
        const tabElements = {};

        tabs.forEach((tab) => {
            const tabEl = document.createElement("div");
            tabEl.textContent = tab;
            tabEl.className = "tab-item";
            Object.assign(tabEl.style, {
                flex: "1",
                padding: "8px 0",
                textAlign: "center",
                color: tab === currentTab ? "#fff" : "#888",
                fontSize: "11px",
                cursor: "pointer",
                borderBottom: tab === currentTab ? "2px solid #3645B5" : "none",
                transition: "all 0.2s ease",
            });
            tabEl.onclick = () => {
                currentTab = tab;
                Object.values(tabElements).forEach((el) => {
                    el.style.color = "#888";
                    el.style.borderBottom = "none";
                });
                tabEl.style.color = "#fff";
                tabEl.style.borderBottom = "2px solid #3645B5";
                renderContent();
            };
            tabElements[tab] = tabEl;
            tabBar.appendChild(tabEl);
        });
        menu.appendChild(tabBar);

        const contentArea = document.createElement("div");
        Object.assign(contentArea.style, {
            padding: "10px",
            maxHeight: "500px",
            overflowY: "auto",
            position: "relative",
        });
        menu.appendChild(contentArea);

        // Highlight element
        const highlight = document.createElement("div");
        Object.assign(highlight.style, {
            position: "absolute",
            background: "rgba(54, 69, 181, 0.4)",
            pointerEvents: "none",
            transition: "all 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
            opacity: "0",
            left: "5px",
            right: "5px",
            borderRadius: "4px",
            zIndex: "0",
        });
        contentArea.appendChild(highlight);

        function updateHighlight(element) {
            const rect = element.getBoundingClientRect();
            const containerRect = contentArea.getBoundingClientRect();
            highlight.style.top =
                rect.top - containerRect.top + contentArea.scrollTop + "px";
            highlight.style.height = rect.height + "px";
            highlight.style.opacity = "1";
        }

        function createRow(label, checked, onChange) {
            const row = document.createElement("div");
            Object.assign(row.style, {
                display: "flex",
                alignItems: "center",
                padding: "4px",
                marginBottom: "4px",
                cursor: "pointer",
                position: "relative",
                zIndex: "1",
            });

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = checked;
            checkbox.style.cssText = "margin-right:8px;cursor:pointer";
            checkbox.onclick = (e) => e.stopPropagation();
            checkbox.onchange = function () { onChange.call(this); };

            const labelEl = document.createElement("span");
            labelEl.textContent = label;

            row.onclick = () => {
                checkbox.checked = !checkbox.checked;
                onChange.call(checkbox);
            };

            row.onmouseenter = () => updateHighlight(row);
            row.onmouseleave = () => { highlight.style.opacity = "0"; };

            row.append(checkbox, labelEl);
            return row;
        }

        function createSlider(label, value, min, max, step, onChange) {
            const container = document.createElement("div");
            container.style.marginBottom = "8px";

            const labelRow = document.createElement("div");
            Object.assign(labelRow.style, {
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "4px",
                padding: "4px",
                cursor: "pointer",
                position: "relative",
                zIndex: "1",
            });

            const labelEl = document.createElement("span");
            labelEl.textContent = label;

            const valueLabel = document.createElement("span");
            valueLabel.textContent = value.toFixed(1);

            labelRow.onmouseenter = () => updateHighlight(labelRow);
            labelRow.onmouseleave = () => { highlight.style.opacity = "0"; };

            labelRow.append(labelEl, valueLabel);

            const slider = document.createElement("input");
            Object.assign(slider, { type: "range", min, max, step, value });
            slider.style.cssText = "width:100%;cursor:pointer";

            slider.oninput = function () {
                const val = parseFloat(slider.value);
                valueLabel.textContent = val.toFixed(1);
                onChange(val);
            };

            container.append(labelRow, slider);
            return container;
        }

        function createColorRow(label, value, onChange) {
            const row = document.createElement("div");
            Object.assign(row.style, {
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "4px",
                marginBottom: "4px",
                cursor: "pointer",
                position: "relative",
                zIndex: "1",
            });
            const labelEl = document.createElement("span");
            labelEl.textContent = label;

            const colorInput = document.createElement("input");
            colorInput.type = "color";
            colorInput.value = value;
            colorInput.style.cursor = "pointer";
            colorInput.onchange = function () { onChange.call(this); };

            row.onmouseenter = () => updateHighlight(row);
            row.onmouseleave = () => { highlight.style.opacity = "0"; };

            row.append(labelEl, colorInput);
            return row;
        }

        function renderContent() {
            contentArea.innerHTML = "";
            contentArea.appendChild(highlight);

            if (currentTab === "Main") {
                contentArea.appendChild(
                    createRow("ESP", window.espEnabled || false, function () {
                        window.espEnabled = this.checked;
                    }),
                );
                contentArea.appendChild(
                    createRow("Aimbot", settings.aimbotEnabled, function () {
                        settings.aimbotEnabled = this.checked;
                    }),
                );
                contentArea.appendChild(
                    createRow("Invisible", settings.invisibleEnabled, function () {
                        settings.invisibleEnabled = this.checked;
                    }),
                );
                contentArea.appendChild(
                    createRow("Instant Kill", settings.instantKillEnabled, function () {
                        settings.instantKillEnabled = this.checked;
                    }),
                );
                contentArea.appendChild(
                    createRow("Hide Arms", settings.hideArmsEnabled, function () {
                        settings.hideArmsEnabled = this.checked;
                    }),
                );
            } else if (currentTab === "Profile") {
                const modderOptions = [
                    { label: "Total Kills", key: "totalKills", type: "kills" },
                    { label: "Level", key: "level", type: "stat" },
                    { label: "Wins", key: "wins", type: "stat" },
                    { label: "Deaths", key: "deaths", type: "stat" },
                    { label: "Points", key: "points", type: "stat" },
                    { label: "ELO", key: "elo", type: "stat" },
                    { label: "Knife Kills", key: "knifeKills", type: "stat" },
                    { label: "Assists", key: "assists", type: "stat" },
                    { label: "Games Played", key: "gamesPlayed", type: "stat" },
                    { label: "Kill Streak", key: "maxKillStreak", type: "stat" },
                ];
                const modderSelect = document.createElement("div");
                modderSelect.style.padding = "4px";
                modderSelect.innerHTML = `<span style="margin-right:8px">Profile Modder:</span><select style="background:#232323;color:#fff;border:1px solid #3a3a3a;font-size:11px"><option>Off</option>${modderOptions.map(o => `<option value="${o.key}">${o.label}</option>`).join("")}</select>`;
                const select = modderSelect.querySelector("select");
                select.onchange = () => {
                    const option = modderOptions.find(o => o.key === select.value);
                    if (option) {
                        const path = option.type === "kills" ? "" : "/public/" + option.key;
                        getStatValue(path, (currentVal) => {
                            const valToPrompt = (option.type === "kills" && typeof currentVal === 'object') ? currentVal.totalKills : currentVal;
                            const val = prompt(`Enter value for ${option.label}:`, valToPrompt || "0");
                            if (val !== null) {
                                if (option.type === "kills") updateTotalKills(val);
                                else setStat(option.key, val);
                            }
                            select.value = "Off";
                        });
                    }
                };
                contentArea.appendChild(modderSelect);

                const nameChangerRow = document.createElement("div");
                Object.assign(nameChangerRow.style, {
                    display: "flex", alignItems: "center", justifyContent: "center",
                    padding: "8px", margin: "4px", background: "#3645B5", color: "#fff",
                    cursor: "pointer", borderRadius: "4px", fontSize: "11px",
                });
                nameChangerRow.textContent = "Change Name";
                nameChangerRow.onclick = () => {
                    const name = prompt("Enter new nickname:");
                    if (name) setNickname(name);
                };
                contentArea.appendChild(nameChangerRow);

                const classSelect = document.createElement("div");
                classSelect.style.padding = "4px";
                classSelect.innerHTML = `<span style="margin-right:8px">Select Class:</span><select style="background:#232323;color:#fff;border:1px solid #3a3a3a;font-size:11px"><option>Off</option>${Object.keys(classIDMap).map(k => `<option value="${k}">${k}</option>`).join("")}</select>`;
                const cSelect = classSelect.querySelector("select");
                cSelect.onchange = () => {
                    if (cSelect.value !== "Off") {
                        selectClass(cSelect.value);
                    }
                };
                contentArea.appendChild(classSelect);

                const killsSelect = document.createElement("div");
                killsSelect.style.padding = "4px";
                killsSelect.innerHTML = `<span style="margin-right:8px">Class Kills:</span><select style="background:#232323;color:#fff;border:1px solid #3a3a3a;font-size:11px"><option>Select Class</option>${Object.keys(classMap).map(k => `<option value="${k}">${k}</option>`).join("")}</select>`;
                const kSelect = killsSelect.querySelector("select");
                kSelect.onchange = () => {
                    if (kSelect.value !== "Select Class") {
                        const className = kSelect.value;
                        getStatValue("/public/" + classMap[className], (currentKills) => {
                            const kills = prompt(`Enter kills for ${className}:`, currentKills || "0");
                            if (kills !== null) setClassKills(className, kills);
                            kSelect.value = "Select Class";
                        });
                    }
                };
                contentArea.appendChild(killsSelect);
            } else if (currentTab === "Loadout") {
                const skinSelect = document.createElement("div");
                skinSelect.style.padding = "4px";
                skinSelect.innerHTML = `<span style="margin-right:8px">Skin Changer:</span><select style="background:#232323;color:#fff;border:1px solid #3a3a3a;font-size:11px">${skins.map(s => `<option value="${s.id}">${s.name}</option>`).join("")}</select>`;
                skinSelect.querySelector("select").onchange = function() { setSkin(this.value); };
                contentArea.appendChild(skinSelect);

                const secondarySelect = document.createElement("div");
                secondarySelect.style.padding = "4px";
                secondarySelect.innerHTML = `<span style="margin-right:8px">Secondary:</span><select style="background:#232323;color:#fff;border:1px solid #3a3a3a;font-size:11px">${weapons.map(w => `<option value="${w.id}">${w.name}</option>`).join("")}</select>`;
                secondarySelect.querySelector("select").onchange = function() { setSecondary(this.value); };
                contentArea.appendChild(secondarySelect);

                const meleeSelect = document.createElement("div");
                meleeSelect.style.padding = "4px";
                meleeSelect.innerHTML = `<span style="margin-right:8px">Melee:</span><select style="background:#232323;color:#fff;border:1px solid #3a3a3a;font-size:11px">${weapons.map(w => `<option value="${w.id}">${w.name}</option>`).join("")}</select>`;
                meleeSelect.querySelector("select").onchange = function() { setMelee(this.value); };
                contentArea.appendChild(meleeSelect);
            } else if (currentTab === "Settings") {
                function hexToRgb(hex) {
                    const bigint = parseInt(hex.slice(1), 16);
                    return {
                        r: (bigint >> 16) & 255,
                        g: (bigint >> 8) & 255,
                        b: bigint & 255,
                    };
                }

                if (!window.espColor) window.espColor = { r: 0, g: 255, b: 0 };

                contentArea.appendChild(
                    createColorRow(
                        "ESP Color",
                        `#${((1 << 24) + (window.espColor.r << 16) + (window.espColor.g << 8) + window.espColor.b).toString(16).slice(1)}`,
                        function () {
                            const rgb = hexToRgb(this.value);
                            window.espColor = rgb;
                        },
                    ),
                );

                contentArea.appendChild(
                    createRow(
                        "Hide Crosshair",
                        settings.crosshairEnabled,
                        function () {
                            settings.crosshairEnabled = this.checked;
                        },
                    ),
                );

                contentArea.appendChild(
                    createRow("FOV Circle", fovCircleEnabled, function () {
                        fovCircleEnabled = this.checked;
                    }),
                );

                if (!window.fovColor) window.fovColor = { r: 0, g: 255, b: 0 };

                contentArea.appendChild(
                    createColorRow(
                        "FOV Circle Color",
                        `#${((1 << 24) + (window.fovColor.r << 16) + (window.fovColor.g << 8) + window.fovColor.b).toString(16).slice(1)}`,
                        function () {
                            const rgb = hexToRgb(this.value);
                            window.fovColor = rgb;
                        },
                    ),
                );

                contentArea.appendChild(
                    createSlider(
                        "Aimbot Speed",
                        settings.aimbotSpeed,
                        0.1,
                        10,
                        0.1,
                        (val) => {
                            settings.aimbotSpeed = val;
                        },
                    ),
                );

                contentArea.appendChild(
                    createSlider(
                        "FOV Circle Size",
                        settings.fovRadius,
                        10,
                        500,
                        5,
                        (val) => {
                            settings.fovRadius = val;
                        },
                    ),
                );
            }
        }

        let isDragging = false,
            startX,
            startY,
            initialX,
            initialY;

        tabBar.onmousedown = (e) => {
            if (e.target.closest(".tab-item")) return; // Don't drag when clicking tabs
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            initialX = menu.offsetLeft;
            initialY = menu.offsetTop;
            e.preventDefault();
        };

        window.addEventListener("mousemove", (e) => {
            if (isDragging) {
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;
                menu.style.left = initialX + dx + "px";
                menu.style.top = initialY + dy + "px";
            }
        });

        window.addEventListener("mouseup", () => {
            isDragging = false;
        });

        document.body.appendChild(menu);
        renderContent();

        let keybinds = {
            toggleMenu: "o",
        };

        const savedKeybinds = localStorage.getItem("Keybinds");
        if (savedKeybinds) {
            try {
                keybinds = JSON.parse(savedKeybinds);
            } catch {}
        }

        document.addEventListener("keydown", function (e) {
            if (
                e.key === keybinds.toggleMenu &&
                !e.target.matches("input, textarea")
            ) {
                const menu = document.getElementById("Menu");
                if (menu) {
                    const isClosing = menu.style.display !== "none";
                    menu.style.display = isClosing ? "none" : "block";
                }
            }
        });
    }

    createUI();
})();
