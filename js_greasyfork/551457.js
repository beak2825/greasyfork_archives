// ==UserScript==
// @name         Pixel Voices! Autohit
// @namespace    http://tampermonkey.net/
// @version      10
// @description  none
// @author       Mom's Pixel
// @match        https://evoworld.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=evoworld.io
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551457/Pixel%20Voices%21%20Autohit.user.js
// @updateURL https://update.greasyfork.org/scripts/551457/Pixel%20Voices%21%20Autohit.meta.js
// ==/UserScript==
(function() {

    const Height = {'grimReaper':150, 'pumpkinGhost':150, 'ghostlyReaper':150};

    const HitRangeX = {'grimReaper':{'grimReaper':140, 'pumpkinGhost':140, 'ghostlyReaper':140},
                      'pumpkinGhost':{'grimReaper':140, 'pumpkinGhost':140, 'ghostlyReaper':140},
                      'ghostlyReaper':{'grimReaper':140, 'pumpkinGhost':140, 'ghostlyReaper':140}
    };
    const DistAdjustmentY = {'grimReaper':5, 'pumpkinGhost':4, 'ghostlyReaper':4};

    const HitBackRangeX = {'grimReaper':{'grimReaper':141, 'pumpkinGhost':141, 'ghostlyReaper':141},
                          'pumpkinGhost':{'grimReaper':141, 'pumpkinGhost':141, 'ghostlyReaper':141},
                          'ghostlyReaper':{'grimReaper':141, 'pumpkinGhost':141, 'ghostlyReaper':141}
    };
    const ReaperList = new Set(['grimReaper', 'pumpkinGhost', 'ghostlyReaper']);

    function simulateQuickRightArrowKeyWithDelay() {
        const keyDownEvent = new KeyboardEvent('keydown', {
            key: 'ArrowRight',
            code: 'ArrowRight',
            keyCode: 39,
            which: 39,
            bubbles: true,
            cancelable: true
        });
        document.dispatchEvent(keyDownEvent);

        setTimeout(() => {
            const keyUpEvent = new KeyboardEvent('keyup', {
                key: 'ArrowRight',
                code: 'ArrowRight',
                keyCode: 39,
                which: 39,
                bubbles: true,
                cancelable: true
            });
            document.dispatchEvent(keyUpEvent);
        }, 35);
    }

    function simulateQuickLeftArrowKeyWithDelay() {
        const keyDownEvent = new KeyboardEvent('keydown', {
            key: 'ArrowLeft',
            code: 'ArrowLeft',
            keyCode: 37,
            which: 37,
            bubbles: true,
            cancelable: true
        });
        document.dispatchEvent(keyDownEvent);

        setTimeout(() => {
            const keyUpEvent = new KeyboardEvent('keyup', {
                key: 'ArrowLeft',
                code: 'ArrowLeft',
                keyCode: 37,
                which: 37,
                bubbles: true,
                cancelable: true
            });
            document.dispatchEvent(keyUpEvent);
        }, 35);
    }

    function getMagnitude(objPos) {
        var myPos = game.me.position;
        var xDifference = Math.abs(myPos.x - objPos.x);
        var yDifference = Math.abs(myPos.y - objPos.y);
        return xDifference + yDifference;
    }

    function getClosestReaper() {
        if (gameServer == 'undefined' || game.me == 'undefined' || imDead || !joinedGame) {
            return;
        }

        let list = game.sortToDraw(game.hashMap.retrieveVisibleByClient(game));
        let reaperInVision = [];
        for(let i=0; i < list.length; i++) {
            var curEntity = list[i];
            if (curEntity.hp != null && curEntity.deleted == false) {
                if (curEntity.level != null) {
                    if (!ReaperList.has(curEntity.name)) continue;
                    if (curEntity == game.me) { continue;
                    }

                    reaperInVision.push(curEntity);
                }
            }
        }

        var closestReaper = 'undefined';
        var closestMagn = 'undefined';
        for(var i = 0; i < reaperInVision.length; i++) {
            var curEntry = reaperInVision[i];
            if (closestReaper === 'undefined') {
                closestReaper = curEntry;
                closestMagn = getMagnitude(curEntry.position);
            } else {
                var checkingMagn = getMagnitude(curEntry.position);
                if (checkingMagn < closestMagn) {
                    closestReaper = curEntry;
                    closestMagn = checkingMagn;
                }
            }
        }
        return closestReaper;
    };

    function isWithinXRange(attacker, target, range, distAdjustment = 0) {

        var x1 = attacker.position.x;
        var x2 = target.position.x;
        var relativeSpeed = Math.abs(attacker.moveSpeed.x - target.moveSpeed.x);
        const frameTime = 1000 / lastFps;
        const serverDelay = latency;
        const totalDelay = frameTime + serverDelay;
        var effectiveDist = Math.abs(x2-x1) - totalDelay*relativeSpeed/1000 + distAdjustment;

        if (effectiveDist<=range[attacker.name][target.name]){
            return true;
        } else {
            return false;
        }
    }

    function isWithinYRange(attacker, target, heights, distAdjustment = 0) {

        var y1 = attacker.position.y;
        var y2 = target.position.y;
        var relativeSpeed = Math.abs(attacker.moveSpeed.y - target.moveSpeed.y);
        const frameTime = 1000 / lastFps;
        const serverDelay = latency;
        const totalDelay = frameTime + serverDelay;
        var effectiveDist = Math.abs(y2-y1) - totalDelay*relativeSpeed/1000 + distAdjustment;
        let hitRangeY;
        if (y1 > y2) {
            hitRangeY = heights[target.name];
        } else {
            hitRangeY = heights[attacker.name];
        }
        if (effectiveDist<=hitRangeY){
            return true;
        } else {
            return false;
        }
    }

    function autoHit(){
        let enemy=getClosestReaper();
        if (typeof enemy != 'object' || typeof game.me != 'object' || !ReaperList.has(game.me.name)){
            return;
        }

        let onLeftSide = (game.me.position.x<=enemy.position.x);
        let enemyFlicking = (onLeftSide && enemy.direction===1) || (!onLeftSide && enemy.direction===-1);
        let facingEnemy = (onLeftSide && game.me.direction===1) || (!onLeftSide && game.me.direction===-1);

        if (!flicking){
            facingEnemy=true;
        }


        if (facingEnemy){
            if (enemyFlicking){
                if (isWithinXRange(game.me, enemy, HitBackRangeX) && isWithinYRange(game.me, enemy, Height)){
                    skillUse();
                    setTimeout(skillStop,100);
                }
            } else if (!enemyFlicking){
                if (isWithinXRange(game.me, enemy, HitRangeX) && isWithinYRange(game.me, enemy, Height)){
                    skillUse();
                    setTimeout(skillStop,100);
                }
            }
        } else if (!facingEnemy){
            if (enemyFlicking){
                if (isWithinXRange(game.me, enemy, HitBackRangeX, -25) && isWithinYRange(game.me, enemy, Height)){
                    if (onLeftSide){
                        simulateQuickRightArrowKeyWithDelay();
                        skillUse();
                        setTimeout(skillStop,100);
                    } else if (!onLeftSide){
                        simulateQuickLeftArrowKeyWithDelay();
                        skillUse();
                        setTimeout(skillStop,100);
                    }

                }
            } else if (!enemyFlicking){
                if (isWithinXRange(game.me, enemy, HitRangeX ,-5) && isWithinYRange(game.me, enemy, Height)){
                    if (onLeftSide){
                        simulateQuickRightArrowKeyWithDelay();
                        skillUse();
                        setTimeout(skillStop,100);
                    } else if (!onLeftSide){
                        simulateQuickLeftArrowKeyWithDelay();
                        skillUse();
                        setTimeout(skillStop,100);
                    }
                }
            }
        }
       console.log([isWithinXRange(game.me, enemy),isWithinYRange(game.me, enemy)]);
    }

    let autoHitting = false;
    let flicking = false;
    const button = document.createElement("div");
    button.id = "autohit-toggle";
    button.style.position = "fixed";
    button.style.top = "450px";
    button.style.right = "20px";
    button.style.backgroundColor = "#f44336";
    button.style.color = "white";
    button.style.padding = "15px 25px";
    button.style.zIndex = 9999;
    button.style.cursor = "pointer";
    button.style.borderRadius = "15px";
    button.style.fontFamily = "Arial, sans-serif";
    button.style.fontWeight = "bold";
    button.style.boxShadow = "0 0 10px rgba(0,0,0,0.3)";
    button.innerHTML = `<div style="text-align:center;">AUTOHIT: OFF<br><span style="font-weight:normal;">Made by Business</span></div>`;
    document.body.appendChild(button);
    button.addEventListener("click", () => {
    autoHitting = !autoHitting;
    flicking = autoHitting;
    button.style.backgroundColor = autoHitting ? "#4CAF50" : "#f44336";
    button.innerHTML = `<div style="text-align:center;">AUTOHIT: ${autoHitting ? "ON" : "OFF"}<br><span style="font-weight:normal;">Made by Business</span></div>`;
    console.log('Autohitting:', autoHitting, 'Flicking:', flicking);
    });

    document.addEventListener("keyup", (event) => {
        if (event.keyCode === 73) {
            let closest = getClosestReaper();
            if (closest) {
            console.log(game.me.position.x-getClosestReaper().position.x);
            console.log(game.me.position.y-getClosestReaper().position.y);
           }
        } else if (event.keyCode === 32) {
            console.log('time to start/stop');
            skillStop();
        } else if (event.keyCode === 40) {
            autoHitting = !autoHitting;
            flicking = autoHitting;
            button.style.backgroundColor = autoHitting ? "#4CAF50" : "#f44336";
            button.innerHTML = `<div style="text-align:center;">AUTOHIT: ${autoHitting ? "ON" : "OFF"}<br><span style="font-weight:normal;">Made by Business</span></div>`;
            console.log('Toggled Autohitting by Arrow Down:', autoHitting);

            if (button.style.display === "none") {
                button.style.display = "block";
            }

        } else if (event.keyCode === 82) {
            autoHitting = !autoHitting;
            flicking = autoHitting;
            button.style.backgroundColor = autoHitting ? "#4CAF50" : "#f44336";
            button.innerHTML = `<div style="text-align:center;">AUTOHIT: ${autoHitting ? "ON" : "OFF"}<br><span style="font-weight:normal;">Made by Business</span></div>`;
            console.log('Toggled Autohitting by R:', autoHitting);

            if (button.style.display === "none") {
                button.style.display = "block";
            }
        }
    });

    try {
        console.log("Trying to make whole script work!!");
    } catch (bananamelon) {
        console.error("Trying to make whole script work!!");
    }

    function initialize() {
        gameServer['on']('disconnect', function() {
            gameServer = undefined;
            WaitForGameServer();
        });

        if (typeof gameServer.on === 'function') {
            gameServer['on'](socketMsgType.SYNC, function(data) {
                if (autoHitting) {
                    autoHit();
                }
            });
        } else {
            console.error('gameServerOn is not a function');
        }
    };

    function WaitForGameServer() {
        if (typeof gameServer === 'undefined' || typeof gameServer['on'] === 'undefined') {
            setTimeout(WaitForGameServer, 1000);
        } else {
            initialize();
        }
    }

    WaitForGameServer();
})();