// ==UserScript==
// @name         Kour.io ODDmenu
// @match        *://kour.io/*
// @version      4.1
// @author       Happyjeffery, Rasperiiii & suppress
// @icon         https://i.imgur.com/11sYWVM.png
// @description  Speed Hack, Sky Mode, And many more. "Insert" to open menu.
// @run-at       document-start
// @grant        unsafeWindow
// @namespace https://greasyfork.org/users/1369586
// @downloadURL https://update.greasyfork.org/scripts/562051/Kourio%20ODDmenu.user.js
// @updateURL https://update.greasyfork.org/scripts/562051/Kourio%20ODDmenu.meta.js
// ==/UserScript==

(function () {
    ("use strict");

    /***************************************
   * Performance.now Speed Hack
   ***************************************/
    const originalPerfNow = performance.now.bind(performance);

    function updatePerformanceNow(multiplier) {
        if (multiplier === 1) {
            performance.now = originalPerfNow;
            return;
        }

        performance.now = new Proxy(originalPerfNow, {
            apply(target, thisArg, argArray) {
                try {
                    throw new Error();
                } catch (e) {
                    if (!e.stack.includes("invoke_")) {
                        return target.apply(thisArg, argArray) * multiplier;
                    }
                }
                return target.apply(thisArg, argArray);
            },
        });
    }

    updatePerformanceNow(1);

    /***************************************
     * Sky Mode
     ***************************************/
    // Signatures removed - no damage blocking

    function hexOf(buf) {
        return Array.from(new Uint8Array(buf))
            .map((b) => b.toString(16).padStart(2, "0"))
            .join(" ");
    }

    // Damage system removed - all damage works normally

    // Sky Mode shooting detection
    let lastShootTime = 0;

    // Detect shooting (left mouse click)
    document.addEventListener('mousedown', function(e) {
        if (e.button === 0 && kourInstance.config.Invisible) { // Left click
            lastShootTime = Date.now();
            console.log("[ODDmenu] Shot detected - grounding player");
        }
    });

    // Also detect keyboard shooting keys (common in games)
    document.addEventListener('keydown', function(e) {
        if ((e.key === ' ' || e.key.toLowerCase() === 'f') && kourInstance.config.Invisible) {
            lastShootTime = Date.now();
            console.log("[ODDmenu] Action key detected - grounding player");
        }
    });

    /***************************************
     * AntiAim
     ***************************************/
    const HEADER_SIG = [0xf3, 0x02, 0xfd, 0x02, 0xf4, 0x03];
    const SAFE_MIN_LENGTH = 70;

    function arrayStartsWith(arr, prefix) {
        if (arr.length < prefix.length) return false;
        for (let i = 0; i < prefix.length; i++) {
            if (arr[i] !== prefix[i]) return false;
        }
        return true;
    }

    function isSafeToModify(packet) {
        return packet.byteLength >= SAFE_MIN_LENGTH && !kourInstance.config.Invisible && kourInstance.config.AntiAim;
    }

    function modifyPacket(packet) {
        const view = new DataView(packet.buffer, packet.byteOffset, packet.byteLength);

        let x = view.getFloat32(28, true);
        const xDelta = Math.random() < 0.5 ? -0.2 : 0.2;
        x += xDelta;
        view.setFloat32(28, x, true);

        let z = view.getFloat32(36, true);
        const zDelta = Math.random() < 0.5 ? -0.2 : 0.2;
        z += zDelta;
        view.setFloat32(36, z, true);

        //console.log(`[Packet Modified] X: ${x.toFixed(2)}, Z: ${z.toFixed(2)}`);

        return packet;
    }

    /***************************************
 * Spinbot Angle Modifier
 ***************************************/
    const crazyNumbers = [
        3822588238527201280.00, -1857736430059520.00, 0.00, -0.00, -1.4284511533486216e+24,
        -0.00, 0.00, 0.12, -1.8763868419170566e+22, 0.00, 556457979374085341184.00, 0.00,
        -228963383699832832.00, -0.00, 478289722746077184.00, 0.00, -1707527.88, 0.00,
        2.0849836473005435e+26, -0.00, 343366451878428672.00, -0.00, 0.00, -0.00, -398.99,
        -7.327271464138011e+37, -0.00, 7.479676797675635e+34, 6077727.50, -112678365030856523776.00,
        64406255347955662848.00, -0.00, 3.9367609144474995e+28, -0.68, -4.1272324222675643e+34,
        0.00, -34401746419712.00, 256284.98, -0.00, -992099.94, -46124.25, -0.00, -0.23,
        3573135.75, -0.00, 3.4937574108676156e+24, 31446140.00, -0.00, 0.00,
        -2.633920784508417e+22, 1.5002101046880594e+23, -662611.81, 0.00, -7.82,
        2.1554711763577515e+33, -4781238408011841536.00, -8.267893275317273e+33, -0.00, 0.00,
        -4.7050078084659084e+24, 63447551577279168512.00, 0.00, 5.614778816753592e+36, 5183327.50,
    ];

    let currentIndex = 0;
    const ANGLE_OFFSET = 0x38;

    /***************************************
     * WebSocket Hooking
     ***************************************/
    (function hookWS() {
        const OrigWS = unsafeWindow.WebSocket;
        unsafeWindow.WebSocket = function (...args) {
            const ws = new OrigWS(...args);

            const { addEventListener } = ws;
            ws.addEventListener = (type, fn, opts) =>
            addEventListener.call(
                ws,
                type,
                type === "message" ? (ev) => fn(ev) : fn,
                opts
            );

            const protoDesc = Object.getOwnPropertyDescriptor(OrigWS.prototype, "onmessage");
            Object.defineProperty(ws, "onmessage", {
                set(fn) {
                    protoDesc.set.call(this, (ev) => fn(ev));
                },
                get() {
                    return protoDesc.get.call(this);
                },
            });

            const originalSend = ws.send;
            ws.send = function (data) {
                if (data instanceof ArrayBuffer || data instanceof Uint8Array) {
                    let packet = data instanceof Uint8Array ? data : new Uint8Array(data);

                    const hex = hexOf(packet);

            if (arrayStartsWith(packet, HEADER_SIG)) {
                if (isSafeToModify(packet)) {
                    packet = modifyPacket(packet);
                    data = packet.buffer;
                }

                // Sky Mode: Move player high in the sky (but bring down when shooting)
                if (kourInstance.config.Invisible && packet.byteLength >= 44) {
                    const view = new DataView(data);
                    // If player recently shot, keep them at ground level to avoid disconnect
                    if (Date.now() - lastShootTime < 2000) {
                        // Keep at normal height when shooting
                        view.setFloat32(32, 5, true);
                        console.log("[ODDmenu] Sky Mode - Grounded for shooting");
                    } else {
                        // Set Y position to moderately high (50) - visible if looked up but no disconnect
                        view.setFloat32(32, 10,true);
                        console.log("[ODDmenu] Sky Mode Active - Player moderately high!");
                    }
                }

                if (kourInstance.config.SpinBot && packet.byteLength >= ANGLE_OFFSET + 4 && !kourInstance.config.Invisible) {
                            const view = new DataView(data);
                            const num = crazyNumbers[currentIndex];

                            view.setFloat32(ANGLE_OFFSET, num, true);

                            currentIndex++;
                            if (currentIndex >= crazyNumbers.length) currentIndex = 0;
                        }
                    }
                }

                return originalSend.call(this, data);
            };

            return ws;
        };

        unsafeWindow.WebSocket.prototype = OrigWS.prototype;
    })();

    /***************************************
     * Config Object
     ***************************************/
    class Kour {
        constructor() {
            this.config = {
                Invisible: false,
                AntiAim: false,
                SpinBot: false,
                airStrafing: true,
            };
        }
    }

    const kourInstance = new Kour();
    unsafeWindow.kourInstance = kourInstance;

    /***************************************
   * Weapon Changer (Lobby Only!)
   ***************************************/
    const weapons = [
        { name: "AK-47", id: "0" },
        { name: "Deagle", id: "1" },
        { name: "AWP", id: "2" },
        { name: "Bayonet", id: "3" },
        { name: "Uzi", id: "4" },
        { name: "PKM", id: "5" },
        { name: "Revolver", id: "6" },
        { name: "RPG", id: "7" },
        { name: "USPS", id: "8" },
        { name: "MP5", id: "9" },
        { name: "Shotgun", id: "10" },
        { name: "Glock", id: "11" },
        { name: "Karambit", id: "12" },
        { name: "Knife", id: "13" },
        { name: "Scar", id: "14" },
        { name: "Minigun", id: "15" },
        { name: "Famas", id: "16" },
        { name: "Vector", id: "17" },
        { name: "Flamethrower", id: "18" },
        { name: "Kar98k", id: "19" },
        { name: "M4A4", id: "20" },
        { name: "Tec-9", id: "21" },
        { name: "CZ", id: "22" },
        { name: "Berretta92fs", id: "23" },
        { name: "AK-109", id: "24" },
        { name: "P90", id: "25" },
        { name: "Thompson", id: "26" },
        { name: "UMP45", id: "27" },
        { name: "XM1014", id: "28" },
        { name: "Butterfly", id: "29" },
        { name: "Laser Gun", id: "30" },
        { name: "Bomb", id: "31" },
        { name: "Smoke Grenade", id: "32" },
        { name: "Molotov", id: "33" },
        { name: "Grenade", id: "34" },
        { name: "Flashbang", id: "35" },
        { name: "Glizzy", id: "36" },
        { name: "Axe", id: "37" },
        { name: "Bare Fists", id: "38" },
    ];

    function setSecondaryWeapon(weaponID) {
        firebase
            .database()
            .ref("users/" + firebase.auth().currentUser.uid)
            .child("overrideWeaponIndexes1")
            .set(weaponID);
        showUserDetails(
            firebase.auth().currentUser.email,
            firebase.auth().currentUser
        );
    }

    function setMeleeWeapon(weaponID) {
        firebase
            .database()
            .ref("users/" + firebase.auth().currentUser.uid)
            .child("overrideWeaponIndexes2")
            .set(weaponID);
        showUserDetails(
            firebase.auth().currentUser.email,
            firebase.auth().currentUser
        );
    }

    /***************************************
   * Skin Changer (Lobby Only!)
   ***************************************/

    const skins = [
        { name: "KBI Agent", id: "12" },
        { name: "James Kour", id: "13" },
        { name: "President", id: "14" },
        { name: "Doctor", id: "15" },
        { name: "Trickster", id: "16" },
        { name: "Royal Guard", id: "17" },
        { name: "Xmas", id: "18" },
        { name: "Kelvis", id: "19" },
        { name: "Princess Pink", id: "20" },
        { name: "Princess White", id: "21" },
        { name: "Princess Bee", id: "22" },
        { name: "Princess Leaf", id: "23" },
        { name: "Koura Kraft", id: "24" },
        { name: "Green Hologram", id: "25" },
        { name: "Hologrape", id: "26" },
        { name: "Peter", id: "27" },
        { name: "Chicken", id: "28" },
        { name: "Chickoletta", id: "29" },
        { name: "Kyle", id: "30" },
        { name: "Shadowgram", id: "32" },
        { name: "IceBunny", id: "33" },
        { name: "CocoBunny", id: "34" },
        { name: "Kourean", id: "35" },
        { name: "KourG", id: "36" },
        { name: "Hackour", id: "37" },
        { name: "Golden Hackour", id: "38" },
        { name: "Gas Man", id: "39" },
        { name: "Terrorist", id: "40" },
        { name: "Counter Terrorist", id: "41" },
        { name: "Ambush", id: "42" },
        { name: "Baby Kour", id: "43" },
        { name: "Poacher", id: "44" },
        { name: "Astronaut", id: "45" },
        { name: "Kour Parrot", id: "46" },
        { name: "Kour Pirate", id: "47" },
        { name: "Legionaut", id: "48" },
        { name: "Blue Hologram", id: "49" },
        { name: "Mr Wireframe", id: "50" },
        { name: "Mythian", id: "51" },
        { name: "Kour Trooper", id: "52" },
        { name: "Kour Craft", id: "53" },
        { name: "Kour Green Soldier", id: "54" },
        { name: "Yellow Astronaut", id: "55" },
        { name: "Orange Astronaut", id: "56" },
        { name: "Red Astronaut", id: "57" },
        { name: "Blue Astronaut", id: "58" },
        { name: "Kour Banana", id: "59" },
        { name: "Mrs Kour", id: "60" },
        { name: "Investor Inverted", id: "61" },
        { name: "Kour Jungler", id: "62" },
        { name: "Skinny Baby", id: "63" },
        { name: "KourTuber", id: "64" },
        { name: "Red Hologram", id: "65" },
        { name: "White Hologram", id: "66" },
        { name: "Orange Hologram", id: "67" },
        { name: "Dark Blue Hologram", id: "68" },
        { name: "Brown Hologram", id: "69" },
        { name: "Yellow Hologram", id: "70" },
        { name: "Dark Red Hologram", id: "71" },
        { name: "Kourist", id: "72" },
        { name: "Firefighter", id: "73" },
        { name: "FireKour", id: "74" },
        { name: "Kour Thief", id: "75" },
        { name: "Kour Burger", id: "76" },
        { name: "Kour Fan", id: "77" },
        { name: "Kour Brady", id: "78" },
        { name: "LeKour James", id: "79" },
        { name: "Uncle Kour", id: "80" },
        { name: "Chef", id: "81" },
        { name: "KourObby", id: "82" },
        { name: "Legionary", id: "83" },
        { name: "Kitty Kour One", id: "84" },
        { name: "Kitty Kour Two", id: "85" },
        { name: "Kitty Kour Three", id: "86" },
        { name: "Kour Crafter", id: "87" },
        { name: "RTX", id: "88" },
        { name: "Loony Kour", id: "89" },
        { name: "Kour Shocker", id: "90" },
        { name: "Kourkin", id: "91" },
        { name: "Forest Kour", id: "92" },
        { name: "Slender Kour", id: "93" },
        { name: "Drakour", id: "94" },
        { name: "Christmas2024", id: "95" },
        { name: "Deer2024", id: "96" }
    ];

    function setSkin(skinID) {
        firebase
            .database()
            .ref("users/" + firebase.auth().currentUser.uid)
            .child("skin")
            .set(skinID);
        showUserDetails(
            firebase.auth().currentUser.email,
            firebase.auth().currentUser
        );
    }

    /***************************************
   * Profile Stats
   ***************************************/
    function setStat(stat, value) {
        const parsedValue = parseInt(value, 10);
        const finalValue = isNaN(parsedValue) ? value : parsedValue;
        firebase
            .database()
            .ref("users/" + firebase.auth().currentUser.uid + "/public")
            .child(stat)
            .set(finalValue);
        showUserDetails(
            firebase.auth().currentUser.email,
            firebase.auth().currentUser
        );
    }

    /***************************************
   * Clan Editing
   ***************************************/

    function overrideCreateClan() {
        if (typeof createClan === 'function') {
            createClan = function(clanName, leaderUserId, clanColor, reqID) {
                unityInstanceWrapper.sendMessage(firebaseObjName, 'OnSetDataNew', clanName + "&" + reqID);
            };
            //console.log("override done.");
        } else {
            setTimeout(overrideCreateClan, 500);
        }
    }

    overrideCreateClan();

    /***************************************
   * Class Kills
   ***************************************/
    const classMap = {
        Soldier: "class0kills",
        Hitman: "class1kills",
        Gunner: "class2kills",
        Heavy: "class3kills",
        Rocketeer: "class4kills",
        Agent: "class5kills",
        Brawler: "class6kills",
        Investor: "class7kills",
        Assassin: "class8kills",
        Juggernaut: "class9kills",
        Recon: "class10kills",
        Pyro: "class11kills",
        Rayblader: "class15kills",
    };

    function setClassKills() {
        const existingDialog = document.getElementById("classSelectionDialog");
        if (existingDialog) existingDialog.remove();

        const classSelectionDialog = document.createElement("div");
        classSelectionDialog.id = "classSelectionDialog";
        Object.assign(classSelectionDialog.style, {
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#5a2d72",
            color: "#fff",
            padding: "20px",
            zIndex: "10002",
            fontFamily: "Arial, sans-serif",
            fontSize: "14px",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            width: "300px",
            maxHeight: "400px",
            overflowY: "auto",
            cursor: "move",
            userSelect: "none",
        });

        const closeBtn = document.createElement("button");
        closeBtn.textContent = "×";
        closeBtn.style.position = "absolute";
        closeBtn.style.top = "5px";
        closeBtn.style.right = "5px";
        closeBtn.style.background = "none";
        closeBtn.style.border = "none";
        closeBtn.style.color = "#fff";
        closeBtn.style.fontSize = "16px";
        closeBtn.style.cursor = "pointer";
        closeBtn.addEventListener("click", () => classSelectionDialog.remove());
        classSelectionDialog.appendChild(closeBtn);

        const dialogTitle = document.createElement("div");
        dialogTitle.textContent = "Select Class";
        dialogTitle.style.fontWeight = "bold";
        dialogTitle.style.fontSize = "18px";
        dialogTitle.style.marginBottom = "15px";
        dialogTitle.style.textAlign = "center";
        classSelectionDialog.appendChild(dialogTitle);

        const classButtonContainer = document.createElement("div");
        classButtonContainer.style.display = "grid";
        classButtonContainer.style.gridTemplateColumns = "repeat(2, 1fr)";
        classButtonContainer.style.gap = "8px";

        Object.keys(classMap).forEach((className) => {
            const classBtn = document.createElement("button");
            classBtn.textContent = className;
            Object.assign(classBtn.style, {
                padding: "8px",
                cursor: "pointer",
                backgroundColor: "#9b3e9f",
                border: "none",
                borderRadius: "5px",
                fontSize: "13px",
                color: "#fff",
                transition: "background-color 0.3s",
            });

            classBtn.addEventListener(
                "mouseover",
                () => (classBtn.style.backgroundColor = "#a74cbf")
            );
            classBtn.addEventListener(
                "mouseout",
                () => (classBtn.style.backgroundColor = "#9b3e9f")
            );

            classBtn.addEventListener("click", () => {
                const killsValue = prompt(
                    `Enter kill count for ${className}:`,
                    "10000"
                );
                if (killsValue === null) return;

                const numKills = Number(killsValue);
                if (isNaN(numKills)) {
                    alert("Please enter a valid number!");
                    return;
                }

                const dbField = classMap[className];
                updateClassKills(dbField, numKills);
                classSelectionDialog.remove();
            });

            classButtonContainer.appendChild(classBtn);
        });

        classSelectionDialog.appendChild(classButtonContainer);

        const cancelBtn = document.createElement("button");
        cancelBtn.textContent = "Cancel";
        Object.assign(cancelBtn.style, {
            width: "100%",
            marginTop: "15px",
            padding: "8px",
            cursor: "pointer",
            backgroundColor: "#444",
            border: "none",
            borderRadius: "5px",
            color: "#fff",
        });
        cancelBtn.addEventListener("click", () => classSelectionDialog.remove());
        classSelectionDialog.appendChild(cancelBtn);

        let pos1 = 0,
            pos2 = 0,
            pos3 = 0,
            pos4 = 0;
        classSelectionDialog.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            if (e.target.tagName === "BUTTON" || e.target.tagName === "INPUT") {
                return;
            }

            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            classSelectionDialog.style.top =
                classSelectionDialog.offsetTop - pos2 + "px";
            classSelectionDialog.style.left =
                classSelectionDialog.offsetLeft - pos1 + "px";
            classSelectionDialog.style.transform = "none";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }

        document.body.appendChild(classSelectionDialog);
    }

    function updateClassKills(classField, killCount) {
        if (!firebase.auth().currentUser) {
            console.log("[Zeph Menu] User is not logged in");
            return;
        }

        const updateData = {};
        updateData[classField] = killCount;

        firebase
            .database()
            .ref(`users/${firebase.auth().currentUser.uid}`)
            .update(updateData)
            .then(() => {
            showUserDetails(
                firebase.auth().currentUser.email,
                firebase.auth().currentUser
            );
            console.log(
                `[ODDmenu] ${classField} successfully updated to ${killCount}`
        );
            showUserDetails(
                firebase.auth().currentUser.email,
                firebase.auth().currentUser
            );
        })
            .catch((err) => {
            console.error(`[ODDmenu] Failed to update ${classField}:`, err);
        });
    }

    /***************************************
   * Stats Changer
   ***************************************/
    function updateKDStats(kills) {
        if (!firebase.auth().currentUser) {
            console.log("[ODDmenu] User is not logged in");
            alert("login first!");
            return;
        }

        const updateData = {
            totalKills: kills,
        };

        firebase
            .database()
            .ref(`users/${firebase.auth().currentUser.uid}`)
            .update(updateData)
            .then(() => {
            showUserDetails(
                firebase.auth().currentUser.email,
                firebase.auth().currentUser
            );
            console.log(
                `[ODDmenu] Stats updated to Kills:${kills}`
        );
        })
            .catch((err) => {
            console.error("[ODDmenu] Failed to update stats:", err);
        });
    }

    function setKDStats() {
        const kills = prompt("Enter new Total Kills:", "1337");
        if (kills === null) return;
        const parsedKills = Number(kills);

        if (isNaN(parsedKills)) {
            alert("Please enter valid numbers for kills.");
            return;
        }

        updateKDStats(parsedKills);
    }


    /***************************************
   * Air strafing
   ***************************************/

    let spaceHeld = false;
    let turningLeft = false;
    let turningRight = false;

    let lastMoveTime = 0;
    const activeTimeout = 150;

    document.addEventListener('mousemove', e => {
        if (e.movementX < 0) {
            turningLeft = true;
            turningRight = false;
        } else if (e.movementX > 0) {
            turningRight = true;
            turningLeft = false;
        }
        lastMoveTime = Date.now();
    });

    document.addEventListener('keydown', e => {
        if (e.code === 'Space') spaceHeld = true;
    });

    document.addEventListener('keyup', e => {
        if (e.code === 'Space') spaceHeld = false;
    });

    function simulateKey(code, down = true) {
        const event = new KeyboardEvent(down ? 'keydown' : 'keyup', {
            code: code,
            key: code.replace('Key', ''),
            keyCode: code === 'KeyA' ? 65 : 68,
            which: code === 'KeyA' ? 65 : 68,
            bubbles: true,
            cancelable: true,
        });
        document.dispatchEvent(event);
    }

    let aHeld = false;
    let dHeld = false;

    function loop() {
        const now = Date.now();
        const mouseActive = (now - lastMoveTime) < activeTimeout;
        if (kourInstance.config.airStrafing){
            if (spaceHeld && mouseActive) {
                if (turningLeft && !aHeld) {
                    simulateKey('KeyA', true);
                    aHeld = true;
                } else if (!turningLeft && aHeld) {
                    simulateKey('KeyA', false);
                    aHeld = false;
                }

                if (turningRight && !dHeld) {
                    simulateKey('KeyD', true);
                    dHeld = true;
                } else if (!turningRight && dHeld) {
                    simulateKey('KeyD', false);
                    dHeld = false;
                }
            } else {
                if (aHeld) {
                    simulateKey('KeyA', false);
                    aHeld = false;
                }
                if (dHeld) {
                    simulateKey('KeyD', false);
                    dHeld = false;
                }
            }

            requestAnimationFrame(loop);
        }
    }

    loop();

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
            console.log(`[ODDmenu ESP] Toggled ${window.espEnabled ? "ON" : "OFF"}`);
        }
    });

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
        }
    );

    try {
        window.espColor = JSON.parse(localStorage.getItem("espColorRGB")) || { r: 0, g: 0, b: 0 };
    } catch {
        window.espColor = { r: 0, g: 0, b: 0 };
    }

    const drawHandler = {
        apply(target, thisArgs, args) {
            const count = args[1];
            const blockarms = document.getElementById("blockarms");
            if (count === 300 && settings.crosshairEnabled) {
                return;
            }
            if (count === 24 && settings.damagenumbersoff) {
                return;
            }
            if (blockarms && blockarms.checked && count === 1098) {
                return;
            }
            const program = thisArgs.getParameter(thisArgs.CURRENT_PROGRAM);
            if (!program.uniforms) {
                program.uniforms = {
                    vertexCount: thisArgs.getUniformLocation(program, "vertexCount"),
                    espToggle: thisArgs.getUniformLocation(program, "espToggle"),
                    gnilgnim: thisArgs.getUniformLocation(program, "gnilgnim"),
                    espColor: thisArgs.getUniformLocation(program, "espColor"),
                };
            }

            if (program.uniforms.vertexCount) {
                thisArgs.uniform1f(program.uniforms.vertexCount, count);
            }
            if (program.uniforms.espToggle) {
                thisArgs.uniform1f(program.uniforms.espToggle, window.espEnabled ? 1.0 : 0.0);
            }
            if (program.uniforms.gnilgnim) {
                thisArgs.uniform1f(program.uniforms.gnilgnim, 13371337.0);
            }
            if (program.uniforms.espColor && window.espColor) {
                const { r, g, b } = window.espColor;
                thisArgs.uniform3f(program.uniforms.espColor, r / 255, g / 255, b / 255);
            }

            gl = thisArgs;
            return Reflect.apply(...arguments);
        },
    };

    WebGL.drawElements = new Proxy(WebGL.drawElements, drawHandler);
    WebGL.drawElementsInstanced = new Proxy(WebGL.drawElementsInstanced, drawHandler);

    function generateRangeConditions(varName) {
        return filters
            .map(({ min, max }) => `(${varName} >= ${min}.0 && ${varName} <= ${max}.0)`)
            .join(" || ");
    }

    WebGL.shaderSource = new Proxy(WebGL.shaderSource, {
        apply(target, thisArgs, args) {
            let [shader, src] = args;

            if (src.includes("gl_Position")) {
                const conditions = generateRangeConditions("vertexCount");
                src = src.replace(
                    /void\s+main\s*\(\s*\)\s*\{/,
                    `uniform float vertexCount;\nuniform float espToggle;\nuniform float gnilgnim;\nout float vVertexCount;\nuniform vec3 espColor;\nvoid main() {\nvVertexCount = vertexCount;\n`
            );
                src = src.replace(
                    /(gl_Position\s*=.+;)/,
                    `$1\nif (espToggle > 0.5 && (${conditions})) {\n  gl_Position.z = 0.01 + gl_Position.z * 0.1;\n}\nif (espToggle > 0.5 && gnilgnim == 13371337.0) {\n  gl_Position.z *= 1.0;\n}`
            );
            }

            if (src.includes("SV_Target0")) {
                const conditions = generateRangeConditions("vVertexCount");
                src = src
                    .replace(
                    /void\s+main\s*\(\s*\)\s*\{/,
                    `uniform float espToggle;\nuniform float gnilgnim;\nin float vVertexCount;\nuniform vec3 espColor;\nvoid main() {`
                )
                    .replace(
                    /return;/,
                    `if (espToggle > 0.5 && (${conditions}) && SV_Target0.a > 0.5) {\n  SV_Target0 = vec4(espColor, 1.0);\n}\nif (gnilgnim == 13371337.0) {\n  SV_Target0.rgb *= 1.0;\n}\nreturn;`
                );
            }

            args[1] = src;
            return Reflect.apply(...arguments);
        },
    });

    /***************************************
   * Color Aimbot
   ***************************************/

    let fovCircleEnabled = true;

    const fovCanvas = document.createElement('canvas');
    fovCanvas.style.position = 'fixed';
    fovCanvas.style.top = '0';
    fovCanvas.style.left = '0';
    fovCanvas.style.pointerEvents = 'none';
    fovCanvas.style.zIndex = '9999';
    document.body.appendChild(fovCanvas);

    const fovCtx = fovCanvas.getContext('2d');

    function resizeCanvas() {
        fovCanvas.width = window.innerWidth;
        fovCanvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const fovRadius = 80;

    function drawFOVCircle() {
        fovCtx.clearRect(0, 0, fovCanvas.width, fovCanvas.height);
        if (!fovCircleEnabled) return;
        const centerX = fovCanvas.width / 2;
        const centerY = fovCanvas.height / 2;

        fovCtx.beginPath();
        fovCtx.arc(centerX, centerY, fovRadius, 0, Math.PI * 2);
        fovCtx.strokeStyle = 'rgba(0, 255, 0, 0.6)';
        fovCtx.lineWidth = 2;
        fovCtx.stroke();
    }

    const settings = {
        aimbotEnabled: true,
        aimbotSpeed: 1.2,
        aimbotTriggerButton: ['left', 'right'],
        crosshairEnabled: false,
        triggerbotEnabled: true,
        damagenumbersoff: false,
    };

    let mouseButtons = { left: false, right: false};

    document.addEventListener("mousedown", (e) => {
        if (e.button === 0) mouseButtons.left = true;
        if (e.button === 2) mouseButtons.right = true;
    });
    document.addEventListener("mouseup", (e) => {
        if (e.button === 0) mouseButtons.left = false;
        if (e.button === 2) mouseButtons.right = false;
    });

    function isTriggerPressed() {
        return settings.aimbotTriggerButton.some(btn => mouseButtons[btn]);
    }

    function isTargetPixel(r, g, b, a, t, c) {
        if (a === 0) return false;

        const dr = r - c.r;
        const dg = g - c.g;
        const db = b - c.b;

        return (dr * dr + dg * dg + db * db) <= (t * t);
    }

    function updateAimbot() {
        drawFOVCircle();
        if (!settings.aimbotEnabled || !gl || !gl.canvas || !gl.readPixels || !isTriggerPressed()) return;

        const width = Math.min(150, gl.canvas?.width || 0);
        const height = Math.min(150, gl.canvas?.height || 0);
        if (width < 10 || height < 10) {
            return;
        }
        const t = 20;
        const c = window.espColor;

        const centerX = gl.canvas.width / 2;
        const centerY = gl.canvas.height / 2;
        const startX = Math.floor(centerX - width / 2);
        const startY = Math.floor(centerY - height / 2);
        const pixels = new Uint8Array(width * height * 4);

        gl.readPixels(startX, startY, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

        let closestDist = Infinity;
        let bestDX = 0;
        let bestDY = 0;
        let targetCount = 0;
        //console.log(window.espColor);
        for (let i = 0; i < pixels.length; i += 4) {
            const r = pixels[i], g = pixels[i + 1], b = pixels[i + 2], a = pixels[i + 3];
            if (isTargetPixel(r, g, b, a, t, c)) {
                targetCount++;
                const index = i / 4;
                const x = index % width;
                const y = Math.floor(index / width);
                const dx = startX + x - centerX;
                const dy = -(startY + y - centerY);
                const dist = Math.hypot(dx, dy);
                if (fovCircleEnabled) {
                    if (dist > fovRadius) continue;
                }
                const gnilgnim = "signature Start X - Y";
                if (dist < closestDist) {
                    closestDist = dist;
                    bestDX = dx;
                    bestDY = dy;
                }
            }
        }

        if (closestDist < Infinity) {
            //console.log("moving");
            const factor = settings.aimbotSpeed;
            gl.canvas.dispatchEvent(new MouseEvent("mousemove", {
                movementX: bestDX * factor,
                movementY: bestDY * factor,
                bubbles: true,
                cancelable: true,
                composed: true,
            }));
        }
    }

    setInterval(updateAimbot, 0);


    function createUI() {
        const menu = document.createElement("div");
        menu.id = "zephMenu";
        Object.assign(menu.style, {
            position: "fixed",
            top: "50px",
            right: "50px",
            width: "250px",
            maxHeight: "600px",
            overflowY: "auto",
            backgroundColor: "#5a2d72",
            color: "#fff",
            padding: "15px",
            zIndex: "10000",
            fontFamily: "Arial, sans-serif",
            fontSize: "16px",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            display: "none",
            transition: "all 0.3s ease-in-out",
        });

        const secondaryWeaponMenu = createWeaponMenu("Secondary Weapon", false);
        const meleeWeaponMenu = createWeaponMenu("Melee Weapon", true);
        const skinMenu = createSkinMenu();

        const profileModderMenu = document.createElement("div");
        profileModderMenu.id = "zephProfileModderMenu";
        Object.assign(profileModderMenu.style, {
            position: "fixed",
            top: "50px",
            right: "320px",
            width: "220px",
            backgroundColor: "#5a2d72",
            color: "#fff",
            padding: "15px",
            zIndex: "10000",
            fontFamily: "Arial, sans-serif",
            fontSize: "14px",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            display: "none",
            transition: "all 0.3s ease-in-out",
        });

        const profileHeader = document.createElement("div");
        profileHeader.textContent = "Profile Modder";
        profileHeader.style.textAlign = "center";
        profileHeader.style.fontWeight = "bold";
        profileHeader.style.marginBottom = "10px";
        profileModderMenu.appendChild(profileHeader);

        const buttonContainer = document.createElement("div");
        Object.assign(buttonContainer.style, {
            maxHeight: "400px",
            overflowY: "auto",
        });
        profileModderMenu.appendChild(buttonContainer);

        function createStyledButton(text, onClick) {
            const btn = document.createElement("button");
            btn.textContent = text;
            Object.assign(btn.style, {
                width: "100%",
                margin: "5px 0",
                padding: "8px",
                cursor: "pointer",
                backgroundColor: "#9b3e9f",
                border: "none",
                borderRadius: "5px",
                fontSize: "14px",
                color: "#fff",
                transition: "background-color 0.3s",
            });
            btn.addEventListener("click", onClick);
            btn.addEventListener("mouseover", () => (btn.style.backgroundColor = "#a74cbf"));
            btn.addEventListener("mouseout", () => (btn.style.backgroundColor = "#9b3e9f"));
            buttonContainer.appendChild(btn);
        }

        createStyledButton("Set Class Kills", setClassKills);
        createStyledButton("Change Kills", setKDStats);

        const statMappings = [
            { label: "ELO", key: "elo" },
            { label: "Chickalettas Killed", key: "chickalettasKilled" },
            //{ label: "Deaths", key: "totalDeaths" }, // dont we wish LOL
            { label: "Games Played", key: "gamesPlayed" },
            { label: "Games Won", key: "gamesWon" },
            //{ label: "Games Lost", key: "gamesLost" },  //could be possible i just cant lose a game LOL
            { label: "Knife Kills", key: "knifeKills" },
            { label: "Assists", key: "assists" },
            { label: "Highest Kill Streak", key: "maxKillStreak" },
            { label: "Barrels Shot", key: "barrels" },
            { label: "Kyles Killed", key: "kylesKilled" },
        ];

        function createStatButton(label, key) {
            createStyledButton(`Change ${label}`, () => {
                const newValue = prompt(`Enter new value for ${label}:`);
                if (newValue !== null) {
                    setStat(key, newValue);
                }
            });
        }

        statMappings.forEach(({ label, key }) => {
            createStatButton(label, key);
        });

        const headerContainer = document.createElement("div");
        headerContainer.style.marginBottom = "15px";
        headerContainer.style.position = "relative";

        const madeByText = document.createElement("div");
        madeByText.textContent = "Made by: Happyjeffery, Rasperiiii, suppress";
        madeByText.style.fontSize = "10px";
        madeByText.style.textAlign = "center";
        madeByText.style.marginBottom = "5px";
        madeByText.style.fontWeight = "bold";
        madeByText.style.letterSpacing = "0.5px";

        let hue = 0;
        function updateRGB() {
            hue = (hue + 1) % 360;
            madeByText.style.color = `hsl(${hue}, 100%, 70%)`;
            requestAnimationFrame(updateRGB);
        }
        updateRGB();

        headerContainer.appendChild(madeByText);

        const titleContainer = document.createElement("div");
        titleContainer.style.display = "flex";
        titleContainer.style.alignItems = "center";
        titleContainer.style.justifyContent = "center";
        titleContainer.style.gap = "8px";

        const header = document.createElement("div");
        header.textContent = "ODDmenu";
        header.style.fontWeight = "bold";
        header.style.fontSize = "20px";

        const discordLogo = document.createElement("img");
        discordLogo.src = "https://i.ibb.co/sJV6y56H/Zeph-Menu-Discordlogo.png";
        discordLogo.alt = "Discord Logo";
        discordLogo.style.width = "22px";
        discordLogo.style.height = "22px";
        discordLogo.style.cursor = "pointer";
        discordLogo.style.transition = "all 0.2s ease";
        discordLogo.style.borderRadius = "4px";
        discordLogo.addEventListener("click", () => window.open("https://discord.gg/3XCAwXdRUh", "_blank"));
        discordLogo.addEventListener("mouseover", () => {
            discordLogo.style.transform = "scale(1.1) rotate(2deg)";
            discordLogo.style.filter = "brightness(1.2) drop-shadow(0 0 2px rgba(255,255,255,0.3))";
        });
        discordLogo.addEventListener("mouseout", () => {
            discordLogo.style.transform = "scale(1) rotate(0deg)";
            discordLogo.style.filter = "none";
        });

        titleContainer.appendChild(header);
        titleContainer.appendChild(discordLogo);
        headerContainer.appendChild(titleContainer);
        menu.appendChild(headerContainer);

        const profileModderBtn = document.createElement("button");
        profileModderBtn.textContent = "Profile Modder";
        Object.assign(profileModderBtn.style, {
            width: "100%",
            margin: "8px 0",
            padding: "8px",
            cursor: "pointer",
            backgroundColor: "#9b3e9f",
            border: "none",
            borderRadius: "5px",
            fontSize: "14px",
            color: "#fff",
            transition: "background-color 0.3s",
        });
        profileModderBtn.addEventListener("click", () => {
            profileModderMenu.style.display = profileModderMenu.style.display === "none" ? "block" : "none";
            secondaryWeaponMenu.style.display = "none";
            meleeWeaponMenu.style.display = "none";
            skinMenu.style.display = "none";
        });
        profileModderBtn.addEventListener("mouseover", () => (profileModderBtn.style.backgroundColor = "#a74cbf"));
        profileModderBtn.addEventListener("mouseout", () => (profileModderBtn.style.backgroundColor = "#9b3e9f"));
        menu.appendChild(profileModderBtn);

        const secondaryWeaponBtn = document.createElement("button");
        secondaryWeaponBtn.textContent = "Set Secondary Weapon";
        Object.assign(secondaryWeaponBtn.style, {
            width: "100%",
            margin: "8px 0",
            padding: "8px",
            cursor: "pointer",
            backgroundColor: "#53277E",
            border: "none",
            borderRadius: "5px",
            fontSize: "14px",
            color: "#fff",
            transition: "background-color 0.3s",
        });
        secondaryWeaponBtn.addEventListener("click", () => {
            secondaryWeaponMenu.style.display = secondaryWeaponMenu.style.display === "none" ? "block" : "none";
            meleeWeaponMenu.style.display = "none";
            profileModderMenu.style.display = "none";
            skinMenu.style.display = "none";
        });
        secondaryWeaponBtn.addEventListener("mouseover", () => (secondaryWeaponBtn.style.backgroundColor = "#6a359c"));
        secondaryWeaponBtn.addEventListener("mouseout", () => (secondaryWeaponBtn.style.backgroundColor = "#53277E"));
        menu.appendChild(secondaryWeaponBtn);

        const meleeWeaponBtn = document.createElement("button");
        meleeWeaponBtn.textContent = "Set Melee Weapon";
        Object.assign(meleeWeaponBtn.style, {
            width: "100%",
            margin: "8px 0",
            padding: "8px",
            cursor: "pointer",
            backgroundColor: "#53277E",
            border: "none",
            borderRadius: "5px",
            fontSize: "14px",
            color: "#fff",
            transition: "background-color 0.3s",
        });
        meleeWeaponBtn.addEventListener("click", () => {
            meleeWeaponMenu.style.display = meleeWeaponMenu.style.display === "none" ? "block" : "none";
            secondaryWeaponMenu.style.display = "none";
            profileModderMenu.style.display = "none";
        });
        meleeWeaponBtn.addEventListener("mouseover", () => (meleeWeaponBtn.style.backgroundColor = "#6a359c"));
        meleeWeaponBtn.addEventListener("mouseout", () => (meleeWeaponBtn.style.backgroundColor = "#53277E"));
        menu.appendChild(meleeWeaponBtn);

        const skinBtn = document.createElement("button");
        skinBtn.textContent = "Set Skin";
        Object.assign(skinBtn.style, {
            width: "100%",
            margin: "8px 0",
            padding: "8px",
            cursor: "pointer",
            backgroundColor: "#53277E",
            border: "none",
            borderRadius: "5px",
            fontSize: "14px",
            color: "#fff",
            transition: "background-color 0.3s",
        });
        skinBtn.addEventListener("click", () => {
            meleeWeaponMenu.style.display = "none";
            secondaryWeaponMenu.style.display = "none";
            profileModderMenu.style.display = "none";
            skinMenu.style.display = skinMenu.style.display === "none" ? "block" : "none";
        });
        skinBtn.addEventListener("mouseover", () => (skinBtn.style.backgroundColor = "#6a359c"));
        skinBtn.addEventListener("mouseout", () => (skinBtn.style.backgroundColor = "#53277E"));
        menu.appendChild(skinBtn);

        const speedContainer = document.createElement("div");
        speedContainer.style.margin = "15px 0";
        const speedLabel = document.createElement("label");
        speedLabel.textContent = "Speed Hack Multiplier: ";
        speedContainer.appendChild(speedLabel);
        const speedValue = document.createElement("span");
        speedValue.textContent = "1x";
        speedContainer.appendChild(speedValue);
        const speedSlider = document.createElement("input");
        speedSlider.type = "range";
        speedSlider.min = "1";
        speedSlider.max = "6";
        speedSlider.step = "0.5";
        speedSlider.value = "1";
        speedSlider.style.width = "100%";
        speedSlider.addEventListener("input", function() {
            let multiplier = parseFloat(speedSlider.value);
            speedValue.textContent = multiplier.toFixed(1) + "x";
            updatePerformanceNow(multiplier);
        });
        speedContainer.appendChild(speedSlider);
        menu.appendChild(speedContainer);

        const airContainer = document.createElement("div");
        const airCheckbox = document.createElement("input");
        airCheckbox.type = "checkbox";
        airCheckbox.id = "airToggle";
        airCheckbox.checked = kourInstance.config.airStrafing;
        airCheckbox.addEventListener("change", function() {
            kourInstance.config.airStrafing = this.checked;
        });
        const airLabel = document.createElement("label");
        airLabel.htmlFor = "airToggle";
        airLabel.textContent = " Air Strafing";
        airContainer.appendChild(airCheckbox);
        airContainer.appendChild(airLabel);
        menu.appendChild(airContainer);

        const aimContainer = document.createElement("div");
        const aimCheckbox = document.createElement("input");
        aimCheckbox.type = "checkbox";
        aimCheckbox.id = "aimToggle";
        aimCheckbox.checked = kourInstance.config.AntiAim;
        aimCheckbox.addEventListener("change", function() {
            kourInstance.config.AntiAim = this.checked;
        });
        const aimLabel = document.createElement("label");
        aimLabel.htmlFor = "aimToggle";
        aimLabel.textContent = " AntiPlayer (Turn off invis in lobby)";
        aimContainer.appendChild(aimCheckbox);
        aimContainer.appendChild(aimLabel);
        menu.appendChild(aimContainer);

        const invisContainer = document.createElement("div");
        const invisCheckbox = document.createElement("input");
        invisCheckbox.type = "checkbox";
        invisCheckbox.id = "invisToggle";
        invisCheckbox.checked = kourInstance.config.Invisible;
        invisCheckbox.addEventListener("change", function() {
            kourInstance.config.Invisible = this.checked;
            console.log("Sky Mode set to " + this.checked);
        });
        const invisLabel = document.createElement("label");
        invisLabel.htmlFor = "invisToggle";
        invisLabel.textContent = " Sky Mode";
        invisContainer.appendChild(invisCheckbox);
        invisContainer.appendChild(invisLabel);
        menu.appendChild(invisContainer);

        const blockarmsContainer = document.createElement("div");
        const blockarmsCheckbox = document.createElement("input");
        blockarmsCheckbox.type = "checkbox";
        blockarmsCheckbox.id = "blockarms";
        blockarmsCheckbox.checked = true;

        const blockarmsLabel = document.createElement("label");
        blockarmsLabel.htmlFor = "blockarms";
        blockarmsLabel.textContent = " Hide Arms";
        blockarmsContainer.appendChild(blockarmsCheckbox);
        blockarmsContainer.appendChild(blockarmsLabel);
        menu.appendChild(blockarmsContainer);

        function hexToRgb(hex) {
            const bigint = parseInt(hex.slice(1), 16);
            return {
                r: (bigint >> 16) & 255,
                g: (bigint >> 8) & 255,
                b: bigint & 255
            };
        }

        const espContainer = document.createElement("div");
        const espCheckbox = document.createElement("input");
        espCheckbox.type = "checkbox";
        espCheckbox.id = "espToggle";
        espCheckbox.checked = window.espEnabled || false;
        espCheckbox.addEventListener("change", function() {
            window.espEnabled = this.checked;
            console.log("[Zeph ESP] Toggled " + (this.checked ? "ON" : "OFF"));
        });

        const espColorContainer = document.createElement("div");
        espColorContainer.style.marginTop = "8px";
        espColorContainer.style.display = "flex";
        espColorContainer.style.alignItems = "center";
        espColorContainer.style.gap = "8px";

        const espColorLabel = document.createElement("label");
        espColorLabel.htmlFor = "espColorPicker";
        espColorLabel.textContent = "ESP Color:";
        espColorLabel.style.flexShrink = "0";

        let savedRgb = localStorage.getItem("espColorRGB");
        if (savedRgb) {
            try {
                window.espColor = JSON.parse(savedRgb);
            } catch {
                window.espColor = { r: 0, g: 0, b: 0 };
            }
        } else {
            window.espColor = { r: 0, g: 0, b: 0 };
        }

        const espColorPicker = document.createElement("input");
        espColorPicker.type = "color";
        espColorPicker.id = "espColorPicker";
        espColorPicker.value = `#${((1 << 24) + (window.espColor.r << 16) + (window.espColor.g << 8) + window.espColor.b).toString(16).slice(1)}`;

        espColorPicker.addEventListener("input", (e) => {
            const rgb = hexToRgb(e.target.value);
            window.espColor = rgb;
            localStorage.setItem("espColorRGB", JSON.stringify(rgb));
        });

        espColorContainer.appendChild(espColorLabel);
        espColorContainer.appendChild(espColorPicker);
        menu.appendChild(espColorContainer);

        const espLabel = document.createElement("label");
        espLabel.htmlFor = "espToggle";
        espLabel.textContent = " ESP";
        espContainer.appendChild(espCheckbox);
        espContainer.appendChild(espLabel);
        menu.appendChild(espContainer);

        const crosshairContainer = document.createElement("div");
        const crosshairCheckbox = document.createElement("input");
        crosshairCheckbox.type = "checkbox";
        crosshairCheckbox.id = "crosshairToggle";
        crosshairCheckbox.checked = settings.crosshairEnabled;
        crosshairCheckbox.addEventListener("change", function() {
            settings.crosshairEnabled = this.checked;
        });
        const crosshairLabel = document.createElement("label");
        crosshairLabel.htmlFor = "crosshairToggle";
        crosshairLabel.textContent = " Hide crosshair";
        crosshairContainer.appendChild(crosshairCheckbox);
        crosshairContainer.appendChild(crosshairLabel);
        menu.appendChild(crosshairContainer);

        const aimbotContainer = document.createElement("div");
        const aimbotCheckbox = document.createElement("input");
        aimbotCheckbox.type = "checkbox";
        aimbotCheckbox.id = "aimbotToggle";
        aimbotCheckbox.checked = settings.aimbotEnabled;
        aimbotCheckbox.addEventListener("change", function() {
            settings.aimbotEnabled = this.checked;
            console.log("aimbot set to " + this.checked);
        });
        const aimbotLabel = document.createElement("label");
        aimbotLabel.htmlFor = "aimbotToggle";
        aimbotLabel.textContent = " Aimbot";
        aimbotContainer.appendChild(aimbotCheckbox);
        aimbotContainer.appendChild(aimbotLabel);
        menu.appendChild(aimbotContainer);

        const fovContainer = document.createElement("div");
        const fovCheckbox = document.createElement("input");
        fovCheckbox.type = "checkbox";
        fovCheckbox.id = "fovToggle";
        fovCheckbox.checked = fovCircleEnabled;
        fovCheckbox.addEventListener("change", () => {
            fovCircleEnabled = fovCheckbox.checked;
        });

        const fovLabel = document.createElement("label");
        fovLabel.htmlFor = "fovToggle";
        fovLabel.textContent = " FOV Circle";
        fovContainer.appendChild(fovCheckbox);
        fovContainer.appendChild(fovLabel);
        menu.appendChild(fovContainer);

        const savedName = localStorage.getItem("playerNickname") || "";

        const nameButton = document.createElement("button");
        nameButton.textContent = "Edit Name";
        Object.assign(nameButton.style, {
            marginTop: "10px",
            padding: "5px 10px",
            backgroundColor: "#7b3fa0",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            display: "block"
        });

        nameButton.addEventListener("click", () => {
            const newName = prompt("Enter your nickname:", savedName);
            if (newName !== null && newName.trim() !== "") {
                localStorage.setItem("playerNickname", newName.trim());
                if (window.location.href.includes("#")) {
                    unityInstance.SendMessage("MapScripts", "SetNickname", newName.trim());
                }
            }
        });

        menu.appendChild(nameButton);

        let savedClass = localStorage.getItem("selectedClass");

        const classBtn = document.createElement("button");
        classBtn.textContent = "Select Class";
        Object.assign(classBtn.style, {
            marginTop: "10px",
            padding: "5px 10px",
            backgroundColor: "#7b3fa0",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
        });

        const classDropdown = document.createElement("div");
        Object.assign(classDropdown.style, {
            display: "none",
            marginTop: "10px",
            backgroundColor: "#673a91",
            padding: "10px",
            borderRadius: "8px"
        });

        const classMap = {
            "Soldier": 0,
            "Hitman": 1,
            "Gunner": 2,
            "Heavy": 3,
            "Rocketeer": 4,
            "Agent": 5,
            "Brawler": 6,
            "Investor": 7,
            "Assassin": 8,
            "Juggernaut": 9,
            "Recon": 10,
            "Pyro": 11,
            "Rayblader": 12
        };

        Object.keys(classMap).forEach(cls => {
            const classOption = document.createElement("button");
            classOption.textContent = cls;
            Object.assign(classOption.style, {
                display: "block",
                width: "100%",
                margin: "5px 0",
                padding: "5px",
                backgroundColor: "#9b3e9f",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
            });
            classOption.addEventListener("click", () => {
                const classID = classMap[cls];
                localStorage.setItem("selectedClass", classID);
                unityInstance.SendMessage("MapScripts", "ChangeClassTo", classID);
                classDropdown.style.display = "none";
            });
            classDropdown.appendChild(classOption);
        });

        classBtn.addEventListener("click", () => {
            classDropdown.style.display = classDropdown.style.display === "none" ? "block" : "none";
        });

        menu.appendChild(classBtn);
        menu.appendChild(classDropdown);

        const keybindBtn = document.createElement("button");
        keybindBtn.textContent = "Keybind Settings";
        Object.assign(keybindBtn.style, {
            marginTop: "10px",
            padding: "5px 10px",
            backgroundColor: "#7b3fa0",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
        });
        keybindBtn.addEventListener("click", () => {
            keybindMenu.style.display = keybindMenu.style.display === "none" ? "block" : "none";
        });

        const keybindMenu = document.createElement("div");
        Object.assign(keybindMenu.style, {
            display: "none",
            marginTop: "10px",
            padding: "10px",
            backgroundColor: "#673a91",
            borderRadius: "8px"
        });

        const toggleLabel = document.createElement("label");
        toggleLabel.textContent = "Toggle Menu Key: ";
        toggleLabel.style.marginRight = "5px";

        const toggleInput = document.createElement("input");
        toggleInput.type = "text";
        toggleInput.value = keybinds.toggleMenu;
        toggleInput.maxLength = 10;
        toggleInput.style.width = "60px";

        toggleInput.addEventListener("keydown", (e) => {
            e.preventDefault(); // Don't type into box
            toggleInput.value = e.key;
            keybinds.toggleMenu = e.key;
            localStorage.setItem("zephKeybinds", JSON.stringify(keybinds));
        });

        keybindMenu.appendChild(toggleLabel);
        keybindMenu.appendChild(toggleInput);
        menu.appendChild(keybindBtn);
        menu.appendChild(keybindMenu);


        const style = document.createElement("style");
        style.textContent = `
        @keyframes fadeInOut {
            0% { opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { opacity: 0; }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        @keyframes flashRed {
            0% { color: #FF3C3C; }
            50% { color: #FFFFFF; }
            100% { color: #FF3C3C; }
        }
    `;
        document.head.appendChild(style);

        document.body.appendChild(menu);
        document.body.appendChild(secondaryWeaponMenu);
        document.body.appendChild(meleeWeaponMenu);
        document.body.appendChild(profileModderMenu);
        document.body.appendChild(skinMenu);
    }

    function createSkinMenu() {
        const skinMenu = document.createElement("div");
        skinMenu.id = `zephSkinMenu`;
        Object.assign(skinMenu.style, {
            position: "fixed",
            top: "50px",
            right: "320px",
            width: "250px",
            maxHeight: "400px",
            overflowY: "auto",
            backgroundColor: "#5a2d72",
            color: "#fff",
            padding: "15px",
            zIndex: "10000",
            fontFamily: "Arial, sans-serif",
            fontSize: "14px",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            display: "none",
            transition: "all 0.3s ease-in-out",
        });

        const skinHeader = document.createElement("div");
        skinHeader.textContent = "Skin";
        skinHeader.style.textAlign = "center";
        skinHeader.style.fontWeight = "bold";
        skinHeader.style.marginBottom = "10px";
        skinMenu.appendChild(skinHeader);

        skins.forEach((skin) => {
            const btn = document.createElement("button");
            btn.textContent = `${skin.name} (${skin.id})`;
            Object.assign(btn.style, {
                width: "100%",
                margin: "5px 0",
                padding: "5px",
                cursor: "pointer",
                backgroundColor: "#9b3e9f",
                border: "none",
                borderRadius: "5px",
                fontSize: "12px",
                color: "#fff",
                transition: "background-color 0.3s",
            });
            btn.addEventListener("click", () => {
                setSkin(skin.id);
                skinMenu.style.display = "none";
            });
            btn.addEventListener(
                "mouseover",
                () => (btn.style.backgroundColor = "#a74cbf")
            );
            btn.addEventListener(
                "mouseout",
                () => (btn.style.backgroundColor = "#9b3e9f")
            );
            skinMenu.appendChild(btn);
        });

        return skinMenu;
    }

    function createWeaponMenu(title, isMelee) {
        const weaponMenu = document.createElement("div");
        weaponMenu.id = `zeph${isMelee ? "Melee" : "Secondary"}WeaponMenu`;
        Object.assign(weaponMenu.style, {
            position: "fixed",
            top: "50px",
            right: "320px",
            width: "250px",
            maxHeight: "400px",
            overflowY: "auto",
            backgroundColor: "#5a2d72",
            color: "#fff",
            padding: "15px",
            zIndex: "10000",
            fontFamily: "Arial, sans-serif",
            fontSize: "14px",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            display: "none",
            transition: "all 0.3s ease-in-out",
        });

        const weaponHeader = document.createElement("div");
        weaponHeader.textContent = title;
        weaponHeader.style.textAlign = "center";
        weaponHeader.style.fontWeight = "bold";
        weaponHeader.style.marginBottom = "10px";
        weaponMenu.appendChild(weaponHeader);

        weapons.forEach((weapon) => {
            const btn = document.createElement("button");
            btn.textContent = `${weapon.name} (${weapon.id})`;
            Object.assign(btn.style, {
                width: "100%",
                margin: "5px 0",
                padding: "5px",
                cursor: "pointer",
                backgroundColor: "#9b3e9f",
                border: "none",
                borderRadius: "5px",
                fontSize: "12px",
                color: "#fff",
                transition: "background-color 0.3s",
            });
            btn.addEventListener("click", () => {
                if (isMelee) {
                    setMeleeWeapon(weapon.id);
                } else {
                    setSecondaryWeapon(weapon.id);
                }
                weaponMenu.style.display = "none";
            });
            btn.addEventListener(
                "mouseover",
                () => (btn.style.backgroundColor = "#a74cbf")
            );
            btn.addEventListener(
                "mouseout",
                () => (btn.style.backgroundColor = "#9b3e9f")
            );
            weaponMenu.appendChild(btn);
        });

        return weaponMenu;
    }

    window.addEventListener("keydown", (e) => {
        if (e.key.toLowerCase() === "v") {
            const savedClassID = localStorage.getItem("selectedClass");
            if (
                savedClassID !== null &&
                window.location.href.includes("#")
            ) {
                unityInstance.SendMessage("MapScripts", "ChangeClassTo", parseInt(savedClassID));
            }
        }
    });

    /***************************************
   * Keybinds
   ***************************************/

    let lastHash = window.location.hash;

    setInterval(() => {
        const currentHash = window.location.hash;

        // Only run if hash has changed AND there's a # in the URL
        if (currentHash !== lastHash && currentHash.includes("#")) {
            lastHash = currentHash;

            const storedName = localStorage.getItem("playerNickname");
            if (storedName) {
                unityInstance.SendMessage("MapScripts", "SetNickname", storedName);
            }
        }
    }, 500);

    let keybinds = {
        toggleMenu: "o",
    }

    const savedKeybinds = localStorage.getItem("zephKeybinds");
    if (savedKeybinds) {
        try {
            keybinds = JSON.parse(savedKeybinds);
        } catch {}
    }

    document.addEventListener("keydown", function (e) {
        if (e.key === keybinds.toggleMenu && !e.target.matches("input, textarea")) {
            const menu = document.getElementById("zephMenu");
            if (menu) {
                const isClosing = menu.style.display !== "none";
                menu.style.display = isClosing ? "none" : "block";
                if (isClosing) {
                    document.getElementById("zephSecondaryWeaponMenu").style.display = "none";
                    document.getElementById("zephMeleeWeaponMenu").style.display = "none";
                    document.getElementById("zephProfileModderMenu").style.display = "none";
                    document.getElementById("zephSkinMenu").style.display = "none";
                }
            }
        }
    });


    window.addEventListener("load", createUI);
})();