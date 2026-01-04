// ==UserScript==
// @name         Memory based AFK & move to tank
// @namespace    http://tampermonkey.net/
// @version      0.0.3
// @description  set Afk spot with Q, toggle afk with R, toggle move2Tank with T, switch Follow mode: Body/Mouse with G
// @author       r!PsAw
// @match        https://diep.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=diep.io
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551775/Memory%20based%20AFK%20%20move%20to%20tank.user.js
// @updateURL https://update.greasyfork.org/scripts/551775/Memory%20based%20AFK%20%20move%20to%20tank.meta.js
// ==/UserScript==

//define win
const win = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;

//keys bypass
(function() {
    win.frozenHasFocus = {
        hasFocus: () => true
    };
    document.hasFocus = () => true;
})();

//memory hook
if(!win.exists){
    win.exists = false;
    win.Object.defineProperty(win.Object.prototype, "HEAPF32", {
        get: function() {
            return undefined;
        },
        set: function(newHeapF32) {
            if (!newHeapF32 || !this.HEAPU32) return;
            delete win.Object.prototype.HEAPF32;
            window.Module = this;
            window.Module.HEAPF32 = newHeapF32;
            win.Module = window.Module;
            win.exists = true;
        },
        configurable: true,
        enumerable: true
    });
}

//keys definition
const diep_keys = [
  "KeyA", "KeyB", "KeyC", "KeyD", "KeyE", "KeyF", "KeyG", "KeyH", "KeyI", "KeyJ", "KeyK", "KeyL", "KeyM", "KeyN", "KeyO", "KeyP", "KeyQ", "KeyR", "KeyS", "KeyT", "KeyU", "KeyV", "KeyW", "KeyX", "KeyY", "KeyZ",
  "ArrowUp", "ArrowLeft", "ArrowDown", "ArrowRight", "Tab", "Enter", "NumpadEnter", "ShiftLeft", "ShiftRight", "Space", "Numpad0", "Numpad1", "Numpad2", "Numpad3", "Numpad4", "Numpad5", "Numpad6", "Numpad7", "Numpad8", "Numpad9",
  "Digit0", "Digit1", "Digit2", "Digit3", "Digit4", "Digit5", "Digit6", "Digit7", "Digit8", "Digit9", "F2", "End", "Home", "Semicolon", "Comma", "NumpadComma", "Period", "Backslash"
].reduce((n, e, c) => {
    n[e] = c + 1;
    return n;
}, {});

function key_down(Key){
    input.onKeyDown(diep_keys[Key]);
    //console.log('pressing', Key);
}

function key_up(Key){
    input.onKeyUp(diep_keys[Key]);
    //console.log('unpressing', Key);
}

//generate TAB ID
function generate_ID(length) {
    let final_result = "";
    let chars =
        "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+-=/.,".split(
            ""
        );
    for (let i = 0; i < length; i++) {
        final_result += chars[Math.floor(Math.random() * chars.length)];
    }
    return GM_getValue(final_result) ? generate_ID(length) : final_result;
}

//find index
const basevalue = 4.593316236210318e-41; //0x800b
const offsets = {x: 65, y: 69};
let baseindex;


function find_index() {
    //console.log('called find_index');
    if(baseindex && baseindex != -1){
        //console.log('FOUND baseindex: ', baseindex);
        return
    }
    if(win.exists){
        //console.log('win exists');
        baseindex = Module.HEAPF32.indexOf(basevalue);
    }
    setTimeout(find_index, 100);
}
find_index();

//movement control
function unpress_all(){
    key_up("KeyW");
    key_up("KeyA");
    key_up("KeyS");
    key_up("KeyD");
}

class MovementControl{
    constructor(){
        this.afk = false;
        this.move2tank = false;
        this.moving = false;
        this.pressed_keys = [0, 0, 0, 0];
        this.afk_goal = {x: 0, y: 0};
        this.tank_goal = {x: 0, y:0};
    }
    toggle_afk(){
        unpress_all();
        this.afk = !this.afk;
        this.move2tank = false;
    }
    toggle_move2tank(){
        unpress_all();
        this.move2tank = !this.move2tank;
        this.afk = false;
    }
}
const mc = new MovementControl();

//store info about your tab
class Tab{
    constructor(){
        this.id = generate_ID(20);
        this.master = false;
        this.follow = "Body"; //Body or Mouse
        this.last_pos = {x:0, y:0};
        this.current_pos = {x:0, y:0};
        this.predicted_pos = {x:0, y:0};
        this.mouse_pos = {x:0, y:0};
    }
    change_follow(){
        if(this.follow === "Body"){
            this.follow = "Mouse";
        }else if(this.follow === "Mouse"){
            this.follow = "Body";
        }
    }
    update(){
        if(baseindex && baseindex != -1){
            this.last_pos.x = this.current_pos.x;
            this.last_pos.y = this.current_pos.y;
            this.current_pos.x = Module.HEAPF32[baseindex+offsets.x];
            this.current_pos.y = Module.HEAPF32[baseindex+offsets.y];
            this.mouse_pos.x = Module.HEAPF32[18022];
            this.mouse_pos.y = Module.HEAPF32[18024];
        }
    }
    predict(){
        this.predicted_pos.x = this.current_pos.x+((this.current_pos.x-this.last_pos.x)*100);
        this.predicted_pos.y = this.current_pos.y+((this.current_pos.y-this.last_pos.y)*100);
    }
    save(){
        GM_setValue(this.id + ' Body', this.predicted_pos);
        GM_setValue(this.id + ' Mouse', this.mouse_pos);
    }
}

const you = new Tab();

//handle focus
window.addEventListener("focus", () => {
    if (typeof you !== "undefined" && you) {
        you.master = true;
        unpress_all();
        GM_setValue("Master", you.id);
    }
});

window.addEventListener("blur", () => {
    if (typeof you !== "undefined" && you) {
        you.master = false;
    }
});

//handle movement
function move(goal){
    const your_coords = you.current_pos;
    if (!goal.x || !goal.y) return;
    const deltaX = goal.x - your_coords.x;
    const deltaY = goal.y - your_coords.y;

    const angle = Math.atan2(deltaY, deltaX);
    const angleDeg = (Math.atan2(deltaY, deltaX) * 180 / Math.PI + 360) % 360;
    const quadrant = Math.floor((angleDeg + 22.5) / 45) % 8;
    const directionKeys = [
        [0,0,0,1],
        [0,0,1,1],
        [0,0,1,0],
        [0,1,1,0],
        [0,1,0,0],
        [1,1,0,0],
        [1,0,0,0],
        [1,0,0,1]
    ];
    //console.log(quadrant);
    mc.pressed_keys = directionKeys[quadrant];
    //console.log(mc.pressed_keys, quadrant);
    mc.pressed_keys[0] ? key_down("KeyW") : key_up("KeyW");
    mc.pressed_keys[1] ? key_down("KeyA") : key_up("KeyA");
    mc.pressed_keys[2] ? key_down("KeyS") : key_up("KeyS");
    mc.pressed_keys[3] ? key_down("KeyD") : key_up("KeyD");
}

function handle_movement(){
    if(mc.afk){ //AFK logic
        move(mc.afk_goal);
    }else if(mc.move2tank && !you.master){ //move to tank logic
        move(mc.tank_goal);
    }
}

setInterval(handle_movement, 100);

//handle toggling
function set_goal(){
    mc.afk_goal.x = you.current_pos.x;
    mc.afk_goal.y = you.current_pos.y;
}

function handle_world_pos(){
    window.requestAnimationFrame(handle_world_pos);
    you.update();
    you.predict();
    you.save();
    if(!you.master){
        let master = GM_getValue("Master");
        if(!master) return;
        let raw_pos;
        if(you.follow === "Body"){
            raw_pos = GM_getValue(master + ' Body');
            //console.log(raw_pos);
        }else if(you.follow === "Mouse"){
            raw_pos = GM_getValue(master + ' Mouse');
            //console.log(raw_pos);
        }
        //console.log(raw_pos);
        //if(!raw_pos) return;
        //let parsed_pos = JSON.parse(raw_pos);
        //console.log(raw_pos);
        if(!raw_pos || !raw_pos.x || !raw_pos.y) return;
        mc.tank_goal.x = raw_pos.x;
        mc.tank_goal.y = raw_pos.y;
    }
}
window.requestAnimationFrame(handle_world_pos);

document.onkeydown = function(e) {
    if(!input?.doesHaveTank()) return;
    //console.log(e.key);
    if(e.key === "q" || e.key === "Q"){
        input.inGameNotification(`New position selected at x: ${Math.floor(you.current_pos.x)} y: ${Math.floor(you.current_pos.y)}`, 9999);
        set_goal();
    }else if(e.key === "r" || e.key === "R"){
        mc.toggle_afk();
        let message = mc.afk? "ON" : "OFF";
        input.inGameNotification(`AFK: ${message}`, 999);
    }else if(e.key === "t" || e.key === "T"){
        mc.toggle_move2tank();
        let message = mc.move2tank? "ON" : "OFF";
        input.inGameNotification(`move to Tank: ${message}`, 5000);
    }else if(e.key === "g" || e.key === "G"){
        you.change_follow();
        input.inGameNotification(`Now following: ${you.follow}`, 20000);
    }
};

function debug(){
    console.log(`
    you.master: ${you.master}
    you.id: ${you.id}
    your pos x: ${you.current_pos.x}
    your pos y: ${you.current_pos.y}
    baseindex: ${baseindex}
    real master: ${GM_getValue("Master")}
    move2Tank goal x: ${GM_getValue(GM_getValue("Master")+" Body").x}
    move2Tank goal y: ${GM_getValue(GM_getValue("Master")+" Body").y}
    `);
}
//setInterval(debug, 5000);