// ==UserScript==
// @name         Auto - Mill
// @version      v1.4
// @description  Hotkeys: [Z] Enable / Disable Auto - Mill
// @author       _bamiball
// @match        *://*.moomoo.io/*
// @match        *://*moomoo.io/*
// @require      https://code.jquery.com/jquery-3.3.1.slim.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.4.5/socket.io.min.js
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @require      https://cdn.jsdelivr.net/npm/msgpack-lite@0.1.26/dist/msgpack.min.js
// @require      https://cdn.jsdelivr.net/npm/fontfaceobserver@2.1.0/fontfaceobserver.standalone.min.js
// @grant        none
// @namespace    https://www.youtube.com/@bamiball-x-4
// @link         youtube.com/@bamiball-x-4?sub_confirmation=1
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/553867/Auto%20-%20Mill.user.js
// @updateURL https://update.greasyfork.org/scripts/553867/Auto%20-%20Mill.meta.js
// ==/UserScript==

let mouseX;
let mouseY;
let width;
let height;
let coreURL = new URL(window.location.href);
window.sessionStorage.force = coreURL.searchParams.get("fc");

function aim(x, y) {
    var cvs = document.getElementById("touch-controls-fullscreen");
    cvs.dispatchEvent(new MouseEvent("mousemove", {
        clientX: x,
        clientY: y
    }));
}

var millType;
var ws;
var msgpack5 = window.msgpack;
var boostDir;
var myPlayeroldx;
var myPlayeroldy;
var automillx = 10;
var automilly = 10;
var walkmillhaha = false;

let myPlayer = {
    id: null,
    x: null,
    y: null,
    dir: null,
    object: null,
    weapon: null,
    clan: null,
    isLeader: null,
    hat: null,
    accessory: null,
    isSkull: null
};

document.msgpack = window.msgpack;

function n() {
    this.buffer = new Uint8Array([0]);
    Object.setPrototypeOf(this.buffer, Uint8Array.prototype);
    this.type = 0;
}

WebSocket.prototype.oldSend = WebSocket.prototype.send;
WebSocket.prototype.send = function(m) {
    if (!ws) {
        document.ws = this;
        ws = this;
        socketFound(this);
    }
    this.oldSend(m);
};

function socketFound(socket) {
    socket.addEventListener("message", function(message) {
        handleMessage(message);
    });
}

function handleMessage(m) {
    let temp = msgpack5.decode(new Uint8Array(m.data));
    let data;
    if (temp.length > 1) {
        data = [temp[0], ...temp[1]];
        if (data[1] instanceof Array) {
            data = data;
        }
    } else {
        data = temp;
    }
    let item = data[0];
    if (!data) {
        return;
    }
    if (item == "C" && myPlayer.id == null) {
        myPlayer.id = data[1];
    }
    if (item == "a") {
        for (let i = 0; i < data[1].length / 13; i++) {
            var object = data[1].slice(13 * i, 13 * i + 13);
            if (object[0] == myPlayer.id) {
                myPlayer.x = object[1];
                myPlayer.y = object[2];
                myPlayer.dir = object[3];
                myPlayer.object = object[4];
                myPlayer.weapon = object[5];
                myPlayer.clan = object[7];
                myPlayer.isLeader = object[8];
                myPlayer.hat = object[9];
                myPlayer.accessory = object[10];
                myPlayer.isSkull = object[11];
            }
        }
        if (automillx == false) {
            automillx = myPlayer.x;
        }
        if (automilly == false) {
            automilly = myPlayer.y;
        }
        if (myPlayeroldy != myPlayer.y || myPlayeroldx != myPlayer.x) {
            if (walkmillhaha == true) {
                if (Math.sqrt(Math.pow(myPlayer.y - automilly, 2) + Math.pow(myPlayer.x - automillx, 2)) > 100) {
                    place(millType, Math.atan2(myPlayeroldy - myPlayer.y, myPlayeroldx - myPlayer.x) + toRad(78));
                    place(millType, Math.atan2(myPlayeroldy - myPlayer.y, myPlayeroldx - myPlayer.x) - toRad(78));
                    place(millType, Math.atan2(myPlayeroldy - myPlayer.y, myPlayeroldx - myPlayer.x) - toRad(0));
                    doNewSend(["D", [Math.atan2(mouseY - height / 2, mouseX - width / 2)]]);
                    automillx = myPlayer.x;
                    automilly = myPlayer.y;
                }
            }
            myPlayeroldx = myPlayer.x;
            myPlayeroldy = myPlayer.y;
        }
    }
    update();
}

function doNewSend(sender) {
    ws.send(new Uint8Array(Array.from(msgpack5.encode(sender))));
}

function place(id, angle = Math.atan2(mouseY - height / 2, mouseX - width / 2)) {
    doNewSend(["z", [id, null]]);
    doNewSend(["F", [1, angle]]);
    doNewSend(["F", [0, angle]]);
    doNewSend(["z", [myPlayer.weapon, true]]);
    doNewSend(["z", [id, null]]);
    doNewSend(["F", [1, angle]]);
    doNewSend(["F", [0, angle]]);
    doNewSend(["z", [myPlayer.weapon, true]]);
}

// == mills key = Z ==
document.addEventListener("keydown", function(a) {
    if (a.key.toLowerCase() === "z" && document.activeElement.id.toLowerCase() !== "chatbox") {
        walkmillhaha = !walkmillhaha;
        doNewSend(["6", ["Mills : " + walkmillhaha]]);
    }
});

function isElementVisible(options) {
    return options.offsetParent !== null;
}

function toRad(degrees) {
    return degrees * 0.01745329251;
}

function dist(p1, p) {
    return Math.sqrt(Math.pow(p.y - p1[2], 2) + Math.pow(p.x - p1[1], 2));
}

function update() {
    var f = 26;
    for (; f < 29; f++) {
        if (isElementVisible(document.getElementById("actionBarItem" + f.toString()))) {
            millType = f - 16;
        }
    }
}