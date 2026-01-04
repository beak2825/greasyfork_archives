// ==UserScript==

// @name         Wplace Touch Util
// @namespace    http://tampermonkey.net/
// @version      1.1.2
// @description  wplace 모바일 환경에서 편하게 사용하기 위한 유틸
// @author       mome0320
// @match        *://*.wplace.live/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/550250/Wplace%20Touch%20Util.user.js
// @updateURL https://update.greasyfork.org/scripts/550250/Wplace%20Touch%20Util.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let pressTimer = null;
    let pressTarget = null;
    const pressDuration = 500; // 길게 누르는 기준 시간 (밀리초)
    const multiClickDuration = 1000; // 더블클릭 인식 기준 시간 (밀리초)
    const multiClickRange = 20; // 더블 클릭 유효범위
    let lastPos = {x: -1, y: -1}
    let lastTouchTime = 0;
    let touchCount = 0;

    function calcDistance(pos1,pos2){
    let x = pos1.x - pos2.x
    let y = pos1.y - pos2.y
    return Math.sqrt(x**2+y**2)
    }

    function startPressTimer(e) {
        if(e.touches.length !== 1) return;
        pressTimer = setTimeout(() => {
            handleLongPress(e);
        }, pressDuration);
       let tCount = detectMultipleClick(e)
       if(tCount == 3){
            handleTriplePress(e)
            resetMultipleClick()
        }
    }
    function resetMultipleClick(){
        touchCount = 0
        lastTouchTime = 0
        }
    function createFirstClick(pos){
      touchCount = 1
      lastPos = pos
      lastTouchTime = Date.now()
    }
    function detectMultipleClick(e){
     const pos = {x: e.touches[0].clientX,y: e.touches[0].clientY}
     const delay = Date.now() - lastTouchTime
     if(touchCount === 0 || delay > multiClickDuration){
         createFirstClick(pos);
         return touchCount;
     }
     const distence = calcDistance(lastPos,pos);
     console.log("distance",distence)
     if(distence <= multiClickRange){
      touchCount++
      return touchCount
     }else{
        createFirstClick(pos)
        return touchCount
     }
    }

    function cancelPressTimer(e) {
        if (pressTimer) {
            clearTimeout(pressTimer);
            pressTimer = null;
        }
    }

    function handleLongPress(e) {
        let path = null;
        path = document.querySelector(".btn.btn-square.not-touchscreen\\:hidden");
        if (!path||path.title == "Unlock") return;
        path.click();
    }

    function handleTriplePress(e){
    document.querySelector(".tooltip.ml-auto > button").click();
    }

    document.addEventListener('touchstart', startPressTimer);
    document.addEventListener('touchend', cancelPressTimer);
    document.addEventListener('touchcancel', cancelPressTimer);
    document.addEventListener('touchmove', (e) => {
        if (e.touches.length !== 1) resetMultipleClick()
        cancelPressTimer(e)
        });
})();