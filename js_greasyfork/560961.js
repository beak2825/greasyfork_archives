// ==UserScript==
// @name         multibox hack for diep.io
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  multibox that works for diep.io by mirroring all your inputs
// @license MIT
// @author       Radasca
// @match        *://diep.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560961/multibox%20hack%20for%20diepio.user.js
// @updateURL https://update.greasyfork.org/scripts/560961/multibox%20hack%20for%20diepio.meta.js
// ==/UserScript==

(function(){

const toggle = document.createElement("button");
toggle.textContent = "multibox: OFF";
toggle.style.position = "fixed";
toggle.style.left = "0px";
toggle.style.top = "0px";
toggle.style.zIndex = "9999";
toggle.style.padding = "8px";
toggle.style.color = "red";
toggle.style.background = "black";
document.body.appendChild(toggle);

document.addEventListener("keydown", function(e){
    if (e.key === "`" || e.key === "~"){
        if (toggle.style.display === ""){
            toggle.style.display = "none";
        }
        else{
            toggle.style.display = "";
        }
    }
});

let multiboxing = false;
toggle.addEventListener("click", function(){
    multiboxing = !multiboxing;
    if (multiboxing)
    {
        toggle.textContent = "multibox: ON";
    }
    else
    {
        toggle.textContent = "multibox: OFF";
    }
});

function recordKeyDown(e){
    if (multiboxing)
    {
        let DATA = {key: e.key, code: e.code, keyCode: e.keyCode, which: e.which, bubbles: true, cancelable: true};
        let JSON_DATA = JSON.stringify(DATA);
        localStorage.setItem("key_downJSON", JSON_DATA);
        console.log("key_downJSON");
    }
}

document.addEventListener("keydown", recordKeyDown);

window.addEventListener("storage", function(keydown){
    if (keydown.key == "key_downJSON"){
        let data = JSON.parse(keydown.newValue);

     let clickEvent = new KeyboardEvent("keydown", {
        key: data.key,
        code: data.code,
        which: data.which,
        keyCode: data.keyCode,
        composed: true,
        bubbles: true,
        cancelable: true
        });
    document.dispatchEvent(clickEvent);
    }
    localStorage.clear();
});

function recordKeyUp(e){
    if (multiboxing){
        let DATA = {key: e.key, code: e.code, keyCode: e.keyCode, which: e.which, bubbles: true, cancelable: true, composed: true};
        let JSON_DATA = JSON.stringify(DATA);
        localStorage.setItem("key_upJSON", JSON_DATA);
    }
}

document.addEventListener("keyup", recordKeyUp);

 window.addEventListener("storage", function(keyup){
    if (keyup.key == "key_upJSON"){
        let data = JSON.parse(keyup.newValue);

     let clickEvent = new KeyboardEvent("keyup", {
        key: data.key,
        code: data.code,
        which: data.which,
        keyCode: data.keyCode,
        bubbles: true,
        cancelable: true
        });
    document.dispatchEvent(clickEvent);
    }
     localStorage.clear();
});

function recordMouseDown(e){
    if (multiboxing){
        let DATA = { key:" ", button: e.button, bubbles: true, cancelable: true };
        if (e.button === 1 || e.button === 2) return;
        let JSON_DATA = JSON.stringify(DATA);
        localStorage.setItem("mouse_downJSON", JSON_DATA);
    }
}

document.addEventListener("mousedown", recordMouseDown);

window.addEventListener("storage", function (e){
    if (e.key === "mouse_downJSON"){
        let data = JSON.parse(e.newValue);
        let mouseDownEvent = new KeyboardEvent ("keydown",{
            key: data.key,
            bubbles: true,
            cancelable: true
        });
        document.dispatchEvent(mouseDownEvent);
    }
});

function recordMouseUp(e){
    if (multiboxing){
        let DATA = {key: " ", button: e.button, bubbles: true, cancelable: true}
        if (e.button === 1 || e.button === 2) return;
        let JSON_DATA = JSON.stringify(DATA);
        localStorage.setItem("mouse_upJSON", JSON_DATA);
    }
}

document.addEventListener ("mouseup", recordMouseUp);

window.addEventListener("storage", function (e){
    if (e.key === "mouse_upJSON"){
        let data = JSON.parse(e.newValue);
        let mouseUpEvent = new KeyboardEvent ("keyup", {
            key: data.key,
            bubbles: true,
            cancelable: true
        });
        document.dispatchEvent(mouseUpEvent);
    }
});

function recordMousePos(pos){
    if (multiboxing){
        let DATA = {x: pos.clientX, y: pos.clientY};
        let JSON_DATA = JSON.stringify(DATA);
        localStorage.setItem("mouse_moveJSON", JSON_DATA);
    }
}

document.addEventListener("mousemove", recordMousePos);

window.addEventListener("storage", function(mouseMove) {
    if (mouseMove.key === "mouse_moveJSON") {
        let data = JSON.parse(mouseMove.newValue);

        let moveEvent = new MouseEvent("mousemove", {
            clientX: data.x,
            clientY: data.y,
            bubbles: true,
            cancelable: true
        });
        document.dispatchEvent(moveEvent);
    }
});
})();