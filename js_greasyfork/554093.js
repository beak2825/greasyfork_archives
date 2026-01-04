// ==UserScript==
// @name         OWOP Antiban
// @namespace    https://tampermonkey.net/
// @version      1.1
// @description  May prevent you from getting banned
// @author       thisisks
// @match        https://ourworldofpixels.com/*
// @match        https://pre.ourworldofpixels.com/*
// @exclude      https://ourworldofpixels.com/api/*
// @exclude      https://pre.ourworldofpixels.com/api/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555393/OWOP%20Antiban.user.js
// @updateURL https://update.greasyfork.org/scripts/555393/OWOP%20Antiban.meta.js
// ==/UserScript==

(() => {
    'use strict'

    const waitUntil = (probe, cb, t = 200) => {
        const id = setInterval(() => { try { if (probe()) { clearInterval(id); cb(); } } catch { } }, t);
    };
    waitUntil(() => OWOP?.misc?.world?.players && OWOP.mouse?.tileY && OWOP.net?.protocol?.ws?.close && OWOP.camera?.centerCameraTo && OWOP.misc.chatSendModifier && OWOP.chat?.local && OWOP.windowSys?.class?.window && OWOP.on && OWOP.events, install);

    function install() {
        let playerList = OWOP.misc.world.players;
        let minDist = 20000;
        let exclude = [];
        let action = 0;
        let active = false;
        function createInterval() {
            playerList = OWOP.misc.world.players
            setInterval(() => {
                if (!active) return;
                for (let x in playerList) {
                    if (exclude.includes(x)) continue;
                    let p = playerList[x];
                    if (Math.abs(p.x / 16 - OWOP.mouse.tileX) < minDist && Math.abs(p.y / 16 - OWOP.mouse.tileY) < minDist) {
                        if (action == 0) {
                            OWOP.net.protocol.ws.close();
                        } else if (action == 1) {
                            fetch("api/banme", { method: "PUT" });
                        } else if (action == 2) {
                            OWOP.camera.centerCameraTo(33554432 * Math.random() - 16777216, 33554432 * Math.random() - 16777216);
                        } else if (action == 3) {
                            OWOP.camera.centerCameraTo(0, 0);
                        }
                    };
                }
            }, 100);
        };
        OWOP.on(OWOP.events.net.world.join, createInterval);
        createInterval();

        const oldSendModifier = OWOP.misc.chatSendModifier;
        OWOP.misc.chatSendModifier = (msg) => {
            msg = oldSendModifier(msg);
            if (msg.startsWith("/")) {
                let [cmd, ...args] = msg.slice(1).split(" ");
                if (cmd == "antiban") {
                    if (args.length !== 0) {
                        OWOP.chat.local("Usage: /antiban");
                        return "";
                    };
                    OWOP.windowSys.addWindow(new OWOP.windowSys.class.window("Antiban Options", { closeable: true, centerOnce: true }, (win) => {
                        if (!document.getElementById('ksStyle-v1-0')) {
                            let ksStyle = document.createElement('style');
                            ksStyle.id = 'ksStyle-v1-0';
                            ksStyle.innerHTML = `.ksCont-v1-0 {
                                & input {
			                        background-color: rgba(0, 0, 0, 0.3);
			                        color: white;
		                        }
		                        & input::placeholder {
		                        	color: #BFBFBF;
		                        }
                                & > div > input,
                                & > div > select {
                                    flex-grow: 1;
                                    flex-basis: 171px;
                                }
                                & select {
                                    background-color: #ABA389;
                                    border: 6px #ABA389 solid;
                                    border-image: url(/img/small_border..png) 6 repeat;
                                    border-image-outset: 1px;
                                }
                                & > div {
                                    display: flex;
                                    align-items: center;
                                }
                                & > div > label {
                                    text-wrap: nowrap;
                                }
                            }`;
                            document.head.appendChild(ksStyle);
                        };
                        win.container.className = "wincontainer ksCont-v1-0";

                        let minDistDiv = document.createElement('div');
                        minDistDiv.innerHTML = `<label for="antibanMinDist">Minimum distance:&ensp;</label><input type="number" name="antibanMinDist" placeholder="Distance in pixels" value="${minDist}"></input>`;
                        let minDistIn = minDistDiv.getElementsByTagName("input")[0];
                        minDistIn.addEventListener("blur", (e) => {
                            minDist = minDistIn.value;
                        });
                        win.addObj(minDistDiv);

                        let exclDiv = document.createElement('div');
                        exclDiv.innerHTML = `<label for="antibanExcl">Exclude:&ensp;</label><input type="text" name="antibanExcl" placeholder="IDs must be comma separated" value="${exclude.join(", ")}"></input>`;
                        let exclIn = exclDiv.getElementsByTagName("input")[0];
                        exclIn.addEventListener("blur", (e) => {
                            exclude = exclIn.value.split(',').map((elem) => { return elem.trim() });
                            for (let x = 0; x < exclude.length; x++) {
                                if (!playerList[exclude[x]] || exclude.indexOf(exclude[x]) != x) {
                                    exclude.splice(x, 1);
                                    x -= 1;
                                };
                            };
                            exclIn.value = exclude.join(', ');
                        });
                        win.addObj(exclDiv);

                        let doDiv = document.createElement("div");
                        doDiv.innerHTML = `<label for="antibanDo">Do:&ensp;</label>
                        <select name="antibanDo">
                            <option value="0"${action == 0 ? " selected" : ""}>Disconnect</option>
                            <option value="1"${action == 1 ? " selected" : ""}>Self Ban</option>
                            <option value="2"${action == 2 ? " selected" : ""}>Tp away</option>
                            <option value="3"${action == 3 ? " selected" : ""}>Tp to spawn</option>
                        </select>`;
                        let doIn = doDiv.getElementsByTagName("select")[0];
                        doIn.addEventListener("blur", (e) => {
                            action = doIn.value;
                        });
                        win.addObj(doDiv);

                        let activateBtn = document.createElement("button");
                        activateBtn.innerHTML = active ? "On" : "Off";
                        activateBtn.style.display = "inline-block";
                        activateBtn.addEventListener("click", (e) => {
                            active = !active;
                            activateBtn.innerHTML = active ? "On" : "Off";
                        });
                        win.addObj(activateBtn);
                    }));
                    return "";
                }
                return msg;
            }
            return msg;
        }
    }
})();
