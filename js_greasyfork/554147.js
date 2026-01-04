// ==UserScript==
// @name         Performance booster
// @namespace    http://tampermonkey.net/
// @version      2025-10-28
// @description  Bob's script
// @author       Me
// @match        *://agar.cc/*
// @icon         https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuF_KSuaJJEkISFCeRF_8UkaxXr60DgP7keQ&s
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554147/Performance%20booster.user.js
// @updateURL https://update.greasyfork.org/scripts/554147/Performance%20booster.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const SCRIPT_TO_INTERCEPT = '/data.js';
    const MAX_CACHE_SIZE = 20;

    const performanceSettings = {
        disableWobbleEffect: true,
        disableSkins: true,
        disableFood: true,
        disableBots: true,
        botDetectionThreshold: 10,
        disableFancyNames: true,
        disableMass: true,
    };

    const injectionPayload = `
        let __isSpamMessage = false;

        try {
            if (!window.recentMessagesCache) {
                window.recentMessagesCache = [];
            }

            let tempOffset = offset;
            const tempGetString = () => {
                let text = '', char;
                while ((char = view.getUint16(tempOffset, true)) != 0) {
                    tempOffset += 2;
                    text += String.fromCharCode(char);
                }
                tempOffset += 2;
                return text;
            };

            tempGetString();
            const messageText = tempGetString();
            if (messageText.toLowerCase().includes('my position')) {
            } else {
            if (window.recentMessagesCache.includes(messageText)) {
                __isSpamMessage = true;
            } else {
                  window.recentMessagesCache.push(messageText);
                  if (window.recentMessagesCache.length > ${MAX_CACHE_SIZE}) {
                      window.recentMessagesCache.shift();
                  }
              }
            }
        } catch (e) {
            console.error('[Filter] Error during spam check:', e);
        }

        if (__isSpamMessage) {
            return;
        }
    `;

    const optimizedDrawOneCellFunction = `
        Cell.prototype.drawOneCell = function(ctx) {
            if (!this.shouldRender()) { return; }

            if (performanceSettings.disableFood && !this.isVirus && !this.name && this.size < 40) { return; }

            if (performanceSettings.disableBots && window.botNameList) {
                const cleanName = this.name ? ps(this.name.split("*")[0])[1] : '';
                if (cleanName && window.botNameList.has(cleanName) && cleanName !== "AGAR.CC" && this.size < 500) {
                    return;
                }
            }

            var isSimpleDrawing = performanceSettings.disableWobbleEffect || (5 > this.getNumPoints());
            ctx.save();
            this.drawTime = timestamp;
            var a = this.updatePos();
            this.destroyed && (ctx.globalAlpha *= 1 - a);
            ctx.lineWidth = 10;
            ctx.lineCap = "round";
            ctx.lineJoin = this.isVirus ? "miter" : "round";
            ctx.fillStyle = showColor ? "#FFFFFF" : this.color;
            ctx.strokeStyle = showColor ? "#AAAAAA" : this.color;

            ctx.beginPath();
            if (isSimpleDrawing) {
                ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI, false);
            } else {
                this.movePoints();
                var d = this.getNumPoints();
                ctx.moveTo(this.points[0].x, this.points[0].y);
                for (var c = 1; c <= d; ++c) {
                    var e = c % d;
                    ctx.lineTo(this.points[e].x, this.points[e].y);
                }
            }
            ctx.closePath();
            ctx.fill();

            var skinImage = null;
            if (!performanceSettings.disableSkins && !this.isAgitated && showSkin && ':teams' != gameMode) {
                var skinName = ps(this.name.toLowerCase())[0];
                if (skinName.indexOf('[') != -1) { skinName = skinName.slice(skinName.indexOf('[') + 1, skinName.indexOf(']')); }
                if (-1 != knownNameDict.indexOf(skinName)) {
                    if (!skins.hasOwnProperty(skinName)) {
                        skins[skinName] = new Image;
                        skins[skinName].src = __domain_adi + "/skins/" + skinName + '.webp';
                    }
                    if (0 != skins[skinName].width && skins[skinName].complete) { skinImage = skins[skinName]; }
                }
            }

            if (skinImage) {
                ctx.save();
                ctx.clip();
                ctx.drawImage(skinImage, this.x - this.size, this.y - this.size, 2 * this.size, 2 * this.size);
                ctx.restore();
            }

            if (typeof playerCells[0] !== 'undefined' && this.id == playerCells[0].id && (~~(this.size * this.size / 100)) < userScore / 100 && playerCells.length == 1) {
                ctx.save();
                var dx = rawMouseX - (canvasWidth / 2), dy = rawMouseY - (canvasHeight / 2);
                var rot = Math.atan2(dy, dx);
                ctx.translate(this.x, this.y); ctx.rotate(rot); ctx.translate(-this.x, -this.y);
                ctx.drawImage(arrow, this.x - this.size * 1.5, this.y - this.size * 1.5, 3 * this.size, 3 * this.size);
                ctx.restore();
            }

            ctx.globalAlpha = 1;
            var isMyCell = -1 != playerCells.indexOf(this);

            if (0 != this.id && (showName || isMyCell) && this.name && this.nameCache) {
                 ctx.globalAlpha = 1;
                 ctx.font = "bold " + Math.max(~~(.3 * this.size), 24) + 'px Lato';
                 ctx.fillStyle = '#FFF';
                 ctx.textAlign = "center";

                 let playerName = ps(this.name.split("*")[0])[1];

                 if (performanceSettings.disableFancyNames) {
                     playerName = playerName.replace(/[^\x00-\x7F]/g, "");
                 }



                 ctx.fillText(playerName, this.x, this.y);
            }

            if (!performanceSettings.disableMass && showMass && (isMyCell || 0 == playerCells.length && (!this.isVirus || this.isAgitated) && 20 < this.size)) {
                ctx.font = "bold " + Math.max(~~(.3 * (this.size / 3)), 24) + 'px Lato';
                ctx.fillStyle = '#FFF'; ctx.textAlign = "center";
                ctx.fillText(~~(this.size * this.size / 100), this.x, this.y + 100);
            }

            if (blobb == 1) { ctx.drawImage(blobImage, this.x - this.size, this.y - this.size, 2 * this.size, 2 * this.size); }
            ctx.restore();
        };
    `;

    const botDetectionLogic = `
        if (performanceSettings.disableBots) {
            if (!window.botNameList) window.botNameList = new Set();
            const nameCounts = {};
            // First pass: count all names on screen in this frame.
            for (let i = 0; i < nodelist.length; i++) {
                const cell = nodelist[i];
                if (cell.name) {
                    const cleanName = ps(cell.name.split("*")[0])[1];
                    if (cleanName) {
                        nameCounts[cleanName] = (nameCounts[cleanName] || 0) + 1;
                    }
                }
            }
            for (const name in nameCounts) {
                if (nameCounts[name] > performanceSettings.botDetectionThreshold) {
                    window.botNameList.add(name);
                }
            }
        }
    `;


    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.tagName === 'SCRIPT' && node.src && node.src.includes(SCRIPT_TO_INTERCEPT)) {
                    console.log(`[PerformanceBooster] Intercepted game script: ${node.src}`);
                    observer.disconnect();
                    node.type = 'text/javascript-blocked-by-booster';
                    const originalSrc = node.src;

                    fetch(originalSrc)
                        .then(response => response.text())
                        .then(text => {
                            const originalFunctionSignature = 'function addChat(view, offset) {';
                            let modifiedScript = text.replace(
                                originalFunctionSignature,
                                originalFunctionSignature + injectionPayload
                            );

                            const injectionPoint1 = 'wHandle.onload = gameLoop';
                            const drawingLoopOriginal = 'for (d = 0; d < nodelist.length; d++) nodelist[d].drawOneCell(ctx);';

                            const settingsInjection = `const performanceSettings = ${JSON.stringify(performanceSettings)};`;
                            modifiedScript = modifiedScript.replace(
                                injectionPoint1,
                                settingsInjection + optimizedDrawOneCellFunction + injectionPoint1
                            );

                            modifiedScript = modifiedScript.replace(
                                drawingLoopOriginal,
                                botDetectionLogic + drawingLoopOriginal
                            );

                            if (modifiedScript === text) {
                                console.error('[Filter] Failed to inject code! The function signature "function addChat(view, offset) {" was not found.');
                                return;
                            }

                            console.log('[Filter] Injection successful. Executing modified script.');
                            const newScript = document.createElement('script');
                            newScript.textContent = modifiedScript;
                            document.head.appendChild(newScript);
                        });
                    return;
                }
            }
        }
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

})();
