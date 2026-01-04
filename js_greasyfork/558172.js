// ==UserScript==
// @name         Bonk.io Arrow Trajectory
// @version      2.7
// @description  Bonk.io script to draws out an arrow's full trajectory when aiming
// @author       Triton
// @icon         https://bonk.io/graphics/tt/favicon-32x32.png
// @match        https://bonk.io/*
// @match        https://bonk.io/gameframe-release.html
// @run-at       document-end
// @grant        none
// @namespace    https://greasyfork.org/users/1015072
// @downloadURL https://update.greasyfork.org/scripts/558172/Bonkio%20Arrow%20Trajectory.user.js
// @updateURL https://update.greasyfork.org/scripts/558172/Bonkio%20Arrow%20Trajectory.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function injector(func) {
        if (window.location.hostname === "bonk.io" && window.location.pathname !== "/gameframe-release.html") {
            const waitForFrame = setInterval(() => {
                const frame = document.getElementById("maingameframe");
                if (frame && frame.contentWindow && frame.contentDocument) {
                    const script = document.createElement("script");
                    script.textContent = `(${func.toString()})();`;
                    frame.contentDocument.head.appendChild(script);
                    clearInterval(waitForFrame);
                }
            }, 500);
        } else {
            func();
        }
    }

    injector(function () {
        const scope = window;
        if (!scope.PIXI || !scope.PIXI.Graphics) return;

        //Constants
        const BASE_RADIUS_PPM = 19.709589041095892;

        const PHYSICS = {
            GRAVITY: 197,
            VEL_MULT: 592,
            VEL_BASE: 301
        };

        const CONFIG = {
            MAX_CHARGE: 1.5,
            KEY: "KeyZ",
            POINTS: 50,
            SIM_TIME: 5.0, //Set higher to show longer trajectory
            DRAW_ENEMIES: false, //Set to true to see enemy trajectories

            //Your trajectory settings
            LOCAL: {
                COLOR: 0xD3D3D3, //Sets trajectory color
                THICKNESS: 2,
                ALPHA: 0.1, //Sets trajectory transparency
            },

            //Enemy trajectory settings (ignore if DRAW_ENEMIES is false)
            ENEMY: {
                COLOR: 0xD3D3D3,
                THICKNESS: 2,
                ALPHA: 0.1,
            }
        };

        let myUserName = null;
        let myPlayerContainer = null;
        let gameWorld = null;
        let myPlayerID = -1;
        let arcGraphics = null;
        let isHoldingKey = false;
        let currentPPM = BASE_RADIUS_PPM;
        let pixiObjectId = 0;

        //Websocket hook
        const originalSend = scope.WebSocket.prototype.send;
        scope.WebSocket.prototype.send = function (args) {
            if (typeof args === "string" && args.startsWith('42[12,')) {
                try {
                    const json = JSON.parse(args.substring(2));
                    myUserName = json[1].userName;
                } catch (e) { }
            }
            return originalSend.apply(this, arguments);
        };

        //PIXI hook
        const originalDrawCircle = scope.PIXI.Graphics.prototype.drawCircle;
        scope.PIXI.Graphics.prototype.drawCircle = function (...args) {
            const radius = args[2];
            const parent = this.parent;

            setTimeout(() => {
                if (parent && parent.visible) {
                    if (parent._bonkId === undefined) parent._bonkId = pixiObjectId++;

                    let foundName = null;
                    if (parent.children) {
                        for (let i = 0; i < parent.children.length; i++) {
                            const c = parent.children[i];
                            if (c && c._text) { foundName = c._text; break; }
                        }
                    }

                    if (foundName) {
                        if (!myUserName) {
                            try {
                                const topBar = window.parent.document.getElementById("maingameframe").contentWindow.document.getElementById("pretty_top_name");
                                if (topBar) myUserName = topBar.textContent.trim();
                            } catch (e) {
                                console.error(`Username Error: ${e}`);
                            }
                        }

                        if (myUserName && foundName.trim() === myUserName.trim()) {
                            myPlayerContainer = parent;
                            myPlayerID = parent._bonkId;

                            if (parent.parent) {
                                gameWorld = parent.parent;
                            }

                            if (radius > 5 && radius < 60) currentPPM = radius;
                        }
                    }
                }
            }, 0);

            return originalDrawCircle.apply(this, args);
        };

        function getGlobalTransform(obj) {
            if (!obj || !obj.transform) return { x: 0, y: 0, rot: 0 };
            obj.updateTransform();
            const wt = obj.transform.worldTransform;
            const globalPos = obj.getGlobalPosition();
            return {
                x: globalPos.x,
                y: globalPos.y,
                rot: Math.atan2(wt.b, wt.a)
            };
        }

        document.addEventListener("keydown", (e) => {
            if (e.code === CONFIG.KEY) isHoldingKey = true;
        });
        document.addEventListener("keyup", (e) => {
            if (e.code === CONFIG.KEY) isHoldingKey = false;
        });

        const originalRAF = scope.requestAnimationFrame;

        scope.requestAnimationFrame = function (callback) {
            if (!arcGraphics && scope.PIXI) {
                arcGraphics = new scope.PIXI.Graphics();
            }

            if (gameWorld && gameWorld.transform && arcGraphics) {

                if (arcGraphics.parent !== gameWorld) {
                    gameWorld.addChild(arcGraphics);
                }

                arcGraphics.clear();

                const children = gameWorld.children;

                for (let i = 0; i < children.length; i++) {
                    const playerObj = children[i];

                    if (!playerObj || !playerObj.visible || !playerObj.children) continue;

                    let isMe = false;
                    let isPlayer = false;

                    for (let j = 0; j < playerObj.children.length; j++) {
                        const child = playerObj.children[j];
                        if (child && child._text) {
                            isPlayer = true;
                            if (myUserName && child._text.trim() === myUserName.trim()) {
                                isMe = true;
                            }
                            break;
                        }
                    }

                    if (!isPlayer) continue;

                    if (!isMe && !CONFIG.DRAW_ENEMIES) continue;

                    let aimerChild = null;
                    for (let j = 0; j < playerObj.children.length; j++) {
                        const c = playerObj.children[j];
                        if (c.constructor.name === 'e' || c.constructor.name === 'h') {
                            aimerChild = c;
                            break;
                        }
                    }

                    const arrowVisible = aimerChild && aimerChild.visible && aimerChild.alpha > 0.1;

                    let shouldDraw = false;

                    if (isMe) {
                        shouldDraw = isHoldingKey && arrowVisible;
                    } else {
                        shouldDraw = arrowVisible;
                    }

                    if (shouldDraw) {
                        const settings = isMe ? CONFIG.LOCAL : CONFIG.ENEMY;
                        arcGraphics.lineStyle(settings.THICKNESS, settings.COLOR, settings.ALPHA);

                        if (!playerObj._bonkChargeStart) {
                            playerObj._bonkChargeStart = Date.now();
                        }

                        const scale = currentPPM / BASE_RADIUS_PPM;
                        const G_term = PHYSICS.GRAVITY * scale;
                        const h = Math.min(((Date.now() - playerObj._bonkChargeStart) / 1000.0), CONFIG.MAX_CHARGE);
                        const V_total = (PHYSICS.VEL_MULT * h + PHYSICS.VEL_BASE) * scale;

                        const tf = getGlobalTransform(aimerChild);
                        const n = -tf.rot;
                        const cos_n = Math.cos(n);
                        const sin_n = Math.sin(n);

                        const startLocal = gameWorld.toLocal({ x: tf.x, y: tf.y });
                        arcGraphics.moveTo(startLocal.x, startLocal.y);

                        const dt = CONFIG.SIM_TIME / CONFIG.POINTS;

                        for (let k = 1; k <= CONFIG.POINTS; k++) {
                            const t = k * dt;
                            const dx = V_total * cos_n * t;
                            const dy = (V_total * sin_n * t) - (G_term * Math.pow(t, 2));

                            const pLoc = gameWorld.toLocal({
                                x: tf.x + dx,
                                y: tf.y - dy
                            });

                            arcGraphics.lineTo(pLoc.x, pLoc.y);
                        }
                    } else {
                        playerObj._bonkChargeStart = 0;
                    }
                }
            }

            return originalRAF.call(scope, callback);
        };
    });
})();