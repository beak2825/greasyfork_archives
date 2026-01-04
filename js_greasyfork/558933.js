// ==UserScript==
// @name         Wobbly chat
// @namespace    owot-wobbly-chat
// @version      1.1.1
// @description  Makes chat in OWoT wobbly.
// @author       Helloim0_0
// @match        https://*.ourworldoftext.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ourworldoftext.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558933/Wobbly%20chat.user.js
// @updateURL https://update.greasyfork.org/scripts/558933/Wobbly%20chat.meta.js
// ==/UserScript==

// inspired by kat, https://discord.com/channels/366609898164715520/373803780505862147/1449425422029688954

// config
var bounce = true; // default: true; recommended to set elementSnapApprox at 10 if disabled
var bounceX = 1; // default: 1; how fast chat goes after hitting left or right wall
var bounceY = 1; // default: 1; how fast chat goes after hitting ceiling or floor
var chatFriction = 0.02; // default: 0.02; how fast chat stops moving after being released
var chatSpeed = 0.3; // default: 0.3; how fast chat goes after being released
var speedMomentum = 2; // default: 2; how long chat takes to get to mouse speed or lose speed while holding
var speedDeadPoint = 0.25; // default: 0.25; maximum speed for chat to stop moving
var chatMinSize = 0.5; // default: 0.5; how compressed chat can get when moving
var scaleIntensity = 0.01; // default: 0.01; very sensitive value, be careful
var wobbleSpeed = 0.75; // default: 0.75; messed up with too low and too high values
var wobbleIntensity = 0.4; // default: 0.4; 1 = infinite wobbling
var wobbleStretch = 0.1; // default: 0.1; how far stretching goes compared to moved distance
var wobbleLimit = 30; // default: 30; the skewing hard limit in degrees
var wobbleDeadPoint = 0.1; // default: 0.1; maximum skew for chat to stop wobbling

// other config
var hitboxBgColor = "#00000000"; // default: #00000000

// owot config
window.elementSnapApprox = 0; // default: 0; owot default: 10; how many pixels from border needed to snap to it

/* examples of other values
bounce            | true:      files.catbox.moe/w2kbzv.mp4 | false:     files.catbox.moe/7nrpzx.mp4
bounceX           | 0.3:       files.catbox.moe/s7qtm3.mp4 | 3:         files.catbox.moe/mhyp37.mp4
bounceY           | 0.3:       files.catbox.moe/h08kge.mp4 | 3:         files.catbox.moe/7bb9lp.mp4
chatFriction      | 0.01:      files.catbox.moe/jdf2xb.mp4 | 0.04:      files.catbox.moe/0v0bqe.mp4
chatSpeed         | 0.1:       files.catbox.moe/ym90xg.mp4 | 1:         files.catbox.moe/3menfm.mp4
speedMomentum     | 1:         files.catbox.moe/vl2qm5.mp4 | 5:         files.catbox.moe/hhbgaa.mp4
speedDeadPoint    | 0.1:       files.catbox.moe/5fg9k0.mp4 | 1:         files.catbox.moe/a2k8qb.mp4
chatMinSize       | 0.2:       files.catbox.moe/r70jbt.mp4 | 0.8:       files.catbox.moe/s05k2u.mp4
scaleIntensity    | 0.05:      files.catbox.moe/tpsxrm.mp4 | 0.25:      files.catbox.moe/l836ut.mp4 | note: 0.01 is too low for the recording's width so higher values were used
wobbleSpeed       | 0.25:      files.catbox.moe/4z1co7.mp4 | 2:         files.catbox.moe/yainv1.mp4
wobbleIntensity   | 0.1:       files.catbox.moe/sqf76x.mp4 | 0.99:      files.catbox.moe/to9aoq.mp4
wobbleStretch     | 0.05:      files.catbox.moe/l8x135.mp4 | 0.5:       files.catbox.moe/6pr8s5.mp4
wobbleLimit       | 10:        files.catbox.moe/9p0dhb.mp4 | 60:        files.catbox.moe/nuvsld.mp4
wobbleDeadPoint   | 0.05:      files.catbox.moe/xcjbkm.mp4 | 0.5:       files.catbox.moe/9a4m24.mp4
hitboxBgColor     | #00000000: files.catbox.moe/e66u91.mp4 | #80008020: files.catbox.moe/yiij28.mp4
elementSnapApprox | 0:         files.catbox.moe/x484fz.mp4 | 25:        files.catbox.moe/4ps5vm.mp4
*/

// script variables
var previousX;
var previousY;
var speedX = 0;
var speedY = 0;
var scaleX = 1;
var scaleY = 1;
var skewX = 0;
var skewY = 0;
var skewSpeedX = 0;
var skewSpeedY = 0;
var stopTurnX = 0.1;
var stopTurnY = 0.1;
var directionX = false; // false = left
var directionY = false; // false = up
var lastDiffX = 0;
var lastDiffY = 0;
var draggingChat = false;

// moving chat as a separated function, accounting for transformations
function moveElm(elm, elmWidth, elmHeight, newX, newY) {
    elm.style.top = newY + "px";
    elm.style.left = newX + "px";
    if(newX <= elementSnapApprox) {
        if (bounce && !draggingChat) {
            newX = Math.abs(newX);
            elm.style.left = newX + "px";
            speedX = Math.abs(speedX) * bounceX;
        } else {
            elm.style.left = "0px";
            newX = 0;
            scaleX = 1;
        }
    }
    if(newX + elmWidth >= getWndWidth() - elementSnapApprox) {
        if (bounce && !draggingChat) {
            newX = newX - Math.abs(newX - getWndWidth() + elmWidth + elementSnapApprox / 2) + elementSnapApprox / 2;
            elm.style.left = newX + "px";
            speedX = -Math.abs(speedX) * bounceX;
        } else {
            elm.style.left = "";
            elm.style.right = "0px";
            newX = getWndWidth() - elmWidth;
            scaleX = 1;
        }
    }
    if(newY <= elementSnapApprox) {
        if (bounce && !draggingChat) {
            newY = Math.abs(newY);
            elm.style.top = newY + "px";
            speedY = Math.abs(speedY) * bounceY;
        } else {
            elm.style.top = "0px";
            newY = 0;
            scaleY = 1;
        }
    }
    if(newY + elmHeight >= getWndHeight() - elementSnapApprox) {
        if (bounce && !draggingChat) {
            newY = newY - Math.abs(newY - getWndHeight() + elmHeight + elementSnapApprox / 2) + elementSnapApprox / 2;
            elm.style.top = newY + "px";
            speedY = -Math.abs(speedY) * bounceY;
        } else {
            elm.style.top = "";
            elm.style.bottom = "0px";
            newY = getWndHeight() - elmHeight;
            scaleY = 1;
        }
    }
    return [newX, newY];
}

// used for when dragging chat window
function updateVars(newX, newY) {
    lastDiffX = newX - previousX;
    lastDiffY = newY - previousY;
    previousX = newX;
    previousY = newY;

    speedX = (speedX * (speedMomentum - 1) + lastDiffX) / speedMomentum;
    speedY = (speedY * (speedMomentum - 1) + lastDiffY) / speedMomentum;

    directionX = speedX != 0 ? speedX > 0 : directionX;
    stopTurnX = 0.1;
    directionY = speedY != 0 ? speedY > 0 : directionY;
    stopTurnY = 0.1;

    if (speedX != 0 || skewX != 0) {
        skewSpeedX = speedX * wobbleStretch;
        if (Math.abs(skewSpeedX) < 0.1) skewSpeedX = 0.1 * (directionX ? 1 : -1);
    }
    if (speedY != 0 || skewY != 0) {
        skewSpeedY = speedY * wobbleStretch;
        if (Math.abs(skewSpeedY) < 0.1) skewSpeedY = 0.1 * (directionY ? 1 : -1);
    }
    updateHitbox();
}

// main dragging function, comes from draggable_element in owot
function draggable_element_chat(dragger, dragged, exclusions, onDrag) {
    if(!dragged) {
        dragged = dragger;
    }
    var elmX = 0;
    var elmY = 0;
    var elmHeight = 0;
    var elmWidth = 0;
    draggingChat = false;

    var clickX = 0;
    var clickY = 0;
    dragger.addEventListener("mousedown", function(e) {
        if(exclusions) {
            for(var i = 0; i < exclusions.length; i++) {
                if(closest(e.target, exclusions[i])) {
                    return;
                }
            }
        }
        if(!closest(e.target, dragger)) return;
        elmX = dragged.offsetLeft;
        elmY = dragged.offsetTop;
        elmWidth = dragged.offsetWidth;
        elmHeight = dragged.offsetHeight;
        clickX = e.pageX;
        clickY = e.pageY;
        draggingChat = true;
        if (!chatResizing) {
            speedX = 0;
            speedY = 0;
        }
    });
    // when the element is being dragged (owot comment)
    draggable_element_mousemove.push(function(e, arg_pageX, arg_pageY) {
        if(!draggingChat) return;
        if(onDrag) {
            if(onDrag() == -1) return;
        }
        dragged.style.top = "";
        dragged.style.bottom = "";
        dragged.style.left = "";
        dragged.style.right = "";

        if (previousX === undefined) previousX = elmX;
        if (previousY === undefined) previousY = elmY;
        var diffX = arg_pageX - clickX;
        var diffY = arg_pageY - clickY;

        var newY = elmY + diffY;
        var newX = elmX + diffX;

        [newX, newY] = moveElm(dragged, elmWidth, elmHeight, newX, newY);
        updateVars(newX, newY);
    });
    // when the element is released (owot comment)
    draggable_element_mouseup.push(function() {
        draggingChat = false;
    });
}

// apply chat transformation
function transformChat() {
    requestAnimationFrame(transformChat);
    elm.chat_window.style.transform = `skew(${-skewX}deg, ${skewY}deg) scale(${scaleX}, ${scaleY})`;
}

// run chat functions
draggable_element_chat(elm.chat_window, null, [
    elm.chatbar, elm.chatsend, elm.chat_close, elm.chat_page_tab, elm.chat_global_tab, elm.page_chatfield, elm.global_chatfield
], function() {
    if(chatResizing) {
        return -1;
    }
});
transformChat();

// prevent canvas from being clicked due to chat being out of mouse when releasing
var invisibleHitbox = document.createElement("span");
invisibleHitbox.style.backgroundColor = hitboxBgColor;
invisibleHitbox.style.position = "absolute";
document.body.appendChild(invisibleHitbox);
elm.chat_window.style.zIndex = 1;
function updateHitbox() {
    invisibleHitbox.style.width = elm.chat_window.offsetWidth + "px";
    invisibleHitbox.style.height = elm.chat_window.offsetHeight + "px";
    invisibleHitbox.style.left = elm.chat_window.offsetLeft + "px";
    invisibleHitbox.style.top = elm.chat_window.offsetTop + "px";
}

// variables interval
setInterval(function() {
    if (isNaN(speedX)) speedX = 0;
    if (isNaN(speedY)) speedY = 0;
    speedX /= 1 + chatFriction;
    speedY /= 1 + chatFriction;
    if (Math.abs(speedX) < speedDeadPoint) speedX = 0;
    if (Math.abs(speedY) < speedDeadPoint) speedY = 0;
    scaleX = Math.max(1 - Math.abs(speedX) * scaleIntensity, chatMinSize);
    scaleY = Math.max(1 - Math.abs(speedY) * scaleIntensity, chatMinSize);
    if (chatResizing) {
        previousX = elm.chat_window.offsetLeft;
        previousY = elm.chat_window.offsetTop;
        speedX = 0;
        speedY = 0;
    }
    updateHitbox();
    if ((draggingChat && !chatResizing) || previousX === undefined || previousY === undefined) return;
    var elmWidth = elm.chat_window.offsetWidth;
    var elmHeight = elm.chat_window.offsetHeight;
    var moveX = previousX + speedX * chatSpeed;
    var moveY = previousY + speedY * chatSpeed;
    var elmX, elmY;
    [elmX, elmY] = moveElm(elm.chat_window, elmWidth, elmHeight, moveX, moveY);
    previousX = elmX;
    previousY = elmY;
});

// wobble interval
setInterval(function() {
    if (directionX ^ (skewX < 0)) {
        skewSpeedX /= 1 + wobbleSpeed;
    } else {
        skewSpeedX *= 1 + (wobbleSpeed * wobbleIntensity);
    }
    if (Math.abs(skewSpeedX) <= stopTurnX && Math.abs(skewSpeedX) != 0) {
        directionX = !directionX;
        skewSpeedX = -skewSpeedX;
        stopTurnX = Math.abs(skewSpeedX);
        if (stopTurnX < wobbleDeadPoint / 100) stopTurnX = wobbleDeadPoint / 100;
        if (Math.abs(skewX) < wobbleDeadPoint) {
            skewSpeedX = 0;
            skewX = 0;
        }
    }
    skewX += skewSpeedX;
    if (skewX > wobbleLimit) {
        skewX = wobbleLimit;
        skewSpeedX = -0.1;
        stopTurnX = 0.1;
    }
    if (skewX < -wobbleLimit) {
        skewX = -wobbleLimit;
        skewSpeedX = 0.1;
        stopTurnX = 0.1;
    }

    if (directionY ^ (skewY < 0)) {
        skewSpeedY /= 1 + wobbleSpeed;
    } else {
        skewSpeedY *= 1 + (wobbleSpeed * wobbleIntensity);
    }
    if (Math.abs(skewSpeedY) <= stopTurnY && Math.abs(skewSpeedY) != 0) {
        directionY = !directionY;
        skewSpeedY = -skewSpeedY;
        stopTurnY = Math.abs(skewSpeedY);
        if (stopTurnY < wobbleDeadPoint / 100) stopTurnY = wobbleDeadPoint / 100;
        if (Math.abs(skewY) < wobbleDeadPoint) {
            skewSpeedY = 0;
            skewY = 0;
        }
    }
    skewY += skewSpeedY;
    if (skewY > wobbleLimit) {
        skewY = wobbleLimit;
        skewSpeedY = -0.1;
        stopTurnY = 0.1;
    }
    if (skewY < -wobbleLimit) {
        skewY = -wobbleLimit;
        skewSpeedY = 0.1;
        stopTurnY = 0.1;
    }
}, 15);