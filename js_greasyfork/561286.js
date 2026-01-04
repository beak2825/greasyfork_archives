// ==UserScript==
// @name         💥SURVEV.IO MULTIBOX💥
// @namespace    http://tampermonkey.net/
// @version      2025-12-25
// @description  Script that can control a squad of 4 players or a duo of 2 players
// @author       BigDiddy
// @match        *://survev.io/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561286/%F0%9F%92%A5SURVEVIO%20MULTIBOX%F0%9F%92%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/561286/%F0%9F%92%A5SURVEVIO%20MULTIBOX%F0%9F%92%A5.meta.js
// ==/UserScript==

(function(){

alert ('Please join our discord server: https://discord.gg/9YFyJysQ for more useful scripts and updates.');

const toggle = document.createElement("button");
toggle.textContent = "multibox: OFF";
toggle.style.position = "fixed";
toggle.style.left = "0px";
toggle.style.top = "0px";
toggle.style.color = "red";
toggle.style.background = "black";
toggle.style.zIndex = "9999";
toggle.style.padding = "8px";
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
        let DATA = {key: e.key, code: e.code, keyCode: e.keyCode, which: e.which, bubbles: true, cancelable: true, composed: true};
        let JSON_DATA = JSON.stringify(DATA);
        localStorage.setItem("key_downJSON", JSON_DATA);
        console.log(DATA);
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
        composed: true,
        bubbles: true,
        cancelable: true
        });
    document.dispatchEvent(clickEvent);
    }
     localStorage.clear();
});

function recordMouseDown(e){
    if (multiboxing){
        let DATA = { button: e.button, buttons: e.buttons, bubbles: true, cancelable: true};
        let JSON_DATA = JSON.stringify(DATA);
        localStorage.setItem("mouse_downJSON", JSON_DATA);
    }
}

document.addEventListener("mousedown", recordMouseDown);

window.addEventListener("storage", function (e){
    if (e.key === "mouse_downJSON"){
        let data = JSON.parse(e.newValue);
        let mouseDownEvent = new MouseEvent ("mousedown",{
            button: data.button,
            buttons: data.buttons,
            bubbles: true,
            cancelable: true
        });
        document.dispatchEvent(mouseDownEvent);
    }
});

function recordMouseUp(e){
    if (multiboxing){
        let DATA = {button: e.button, buttons: e.buttons, bubbles: true, cancelable: true}
        let JSON_DATA = JSON.stringify(DATA);
        localStorage.setItem("mouse_upJSON", JSON_DATA);
    }
}

document.addEventListener ("mouseup", recordMouseUp);

window.addEventListener("storage", function (e){
    if (e.key === "mouse_upJSON"){
        let data = JSON.parse(e.newValue);
        let mouseUpEvent = new MouseEvent ("mouseup", {
            button: data.button,
            buttons: data.buttons,
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