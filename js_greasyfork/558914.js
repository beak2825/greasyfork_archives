// ==UserScript==
// @name         Tanki Online XP/BP private
// @namespace    Tanki Online XP/BP private
// @version      0.0.7
// @description  try to take over the world!
// @author       wealthydev
// @match        *://tankionline.com/play/
// @run-at       document-start
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tankionline.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558914/Tanki%20Online%20XPBP%20private.user.js
// @updateURL https://update.greasyfork.org/scripts/558914/Tanki%20Online%20XPBP%20private.meta.js
// ==/UserScript==

/*
issues, solutions:
if remove fire bugs, turn it off and on
remove bushes requires to rejoin battle
reload bars require to rejoin battle, if you have lag issues it's caused by your FPS, performance issue so there is nothing we can do

*/
const bulb = {
    server: 0,
    pps: 0,
    smoke: [0, "Remove Fire"],
    bush: [0, "Remove Bush"],
    movement: [0, "Smooth Tank"],
    reload: [0, "Reload Bars"],
    fov: [0, "Camera"]
};

const key = window.key = [];

document.addEventListener("keydown", (event) => {
    if(!key[event.keyCode] && document.activeElement?.type === "text") return;

    if(event.keyCode === 17) {
        menu_active = !menu_active;

        for(let menu of sets) menu.box.style.display = (menu_active ? "block" : "none");
    }

    key[event.keyCode] = true;
});

document.addEventListener("keyup", (event) => {
    if(!key[event.keyCode] || document.activeElement?.type === "text") return;

    key[event.keyCode] = false;
});

let uploaded = false, block = false;

const oops = (text, location) => {
    if(block) return null;
    block = true;

    alert(`ehh, ${text}`);
    window.location.reload();
}

const run = async () => {
    const url = [...document.scripts].find(s => s.src.includes("/static/js/"))?.src;

    while (!url) {
        await sleep(100);

        run();
    }

    const file = window.file = await fetch(url).then(res => res.ok ? res.text() : null).catch(() => null);
    if(!file?.length) return oops("try again later.");

    //try {
        eval(`log("init");${edit(file)}`);
   // } catch(e){
       // log(e.message)
        console.trace()
      //  oops("fixed?", e.message);
    //}
}

const horizontalScore = window.horizontalScore = (data) => {
    if(!data.length) return null;

    let owner = tanks.find(tank => tank.owner);

    try {
        let targets = [], score = 0;

        for(let data_0 of data) {
            let arr = byIndex(data_0, 0, 6, 3, 7, 0);

            if(!arr?.length) continue;

            let name = byIndex(arr, 25, 4);

            let tank = tanks.find(c => c.name === name);
            if(!tank) continue
            if(!tank.owner && tank.type !== owner.type && tank.state === "active") score += 1;

            targets.push(tank);
        }

        log(targets[0].name, score)
        return score;
    }catch(e){log(e.message)}
}

function edit(file) {
    const queue = [["equals", "c"]];

    hook(file);
    let spot = file.split("onControlChanged")[1]?.slice(-300)?.split(">0")[0]?.split("=function")[1];
    if(bulb.movement[0]) queue.push([`=function${spot}`, `= window.spot = function${spot}`, bulb.movement[1]]);

    const vertical = file.split(",e=-1/0,")[1].split("}}")[0]+"}";

   // const priority = file.split(vertical)[1].split("function")[2].split("){")[2].split("=")[1].split(";")[0];
   // const side = priority.split("?")[1].split(":");

/*    queue.push([priority, `${side[0]}.score === ${side[1]}.score ? (${priority}) : (${side[0]}.score > ${side[1]}.score ? ${side[0]} : ${side[1]});side[0].score=0;side[1].score=0;`]);

    const horizontal = file.split("WITHOUT_ASSIST_IGNORE_GRENADE")[1].split("function").find(one => one.includes(2147483647));
    log(horizontal)
 str = horizontal.repeat(1);

let v = str.split("2147483647")[0].split(",").pop().split(".")[0]

str = str.replace("2147483647;", `2147483647;${v}.score=0;let best;try{`)

let fc = str.split("+1|0,")[1].split("))")[0]+"))";
let lup = str.split("+1|0,")[0].split("=").pop()

str = str.replace(`if(${lup}=`, `${lup}=`);

let tr_ = str.split(`${fc},`)[1].split("){")[0]
let tr = tr_.split(`.${tr_.split(".")[2]}`)[0];

let sv = str.split("break")[0].split("{").pop();
str = str.replace(`+1|0,${fc}`, `+1|0;${fc};`)

let brk = str.split("break")[1].split("}")[0].slice(1);
str = str.replace(`break ${brk}}`, "")

str = str.replace(sv, "}")

str = str.replace(`,${tr_}){`, `let targets = byIndex(${tr}, 2, 1), score = window.horizontalScore(targets);if((!best || best < score) && score > 0) {${sv}${v}.score=score;${v}.targets=targets;${v}.shot=${tr};best=score;`);

let mx = str.split(`var ${lup}=1,`)[1].split("=")[0];

let bkl = `;if(best) {log("found best:", ${sv.split("=")[0]}, best)}} catch(e){log("horizontal aim error", e.message)}`
let frst = str.slice(0, -1)
str = str.replace(frst, frst + bkl)

queue.push([horizontal, str])*/
   // queue.push([`this.t17b_1.ski_1`, `((this.t17b_1.ski_1=20) || true)`])
   // queue.push([`this.m5z_1=i`, `this.m5z_1=i,log(this);`])
    //queue.push([`function lr(t){return t.prototype}`, `function lr(t){t.prototype?.toString && !t.prototype.toString.toString().includes("native code") &&log(t.prototype.toString());return t.prototype}`])
    for(let hex of queue) {
        const found = file.includes(hex[0]);

        if(found) file = file.replaceAll(hex[0], hex[1]);
        log(`${(hex[2] || "?")} ${found ? "found:" : "NOT FOUND:"}`, hex);
    }

    return file;
}

setInterval(() => {
    window.spot && window.spot();
}, 1e3/6);

/**
 * Packet Decoder - Decodes server packets using the same logic as script.js
 * Based on the PacketHelper and codec implementations from the main script
 */

let pps = {
    count: 0,
    date: Date.now(), arr: []
}

function display_pps() {
    pps.count = pps.arr.filter(date => Date.now() - date < 1e3).length;

    let container = document.getElementsByClassName("BattleHudFpsComponentStyle-container")[0];
    let element = document.getElementById("pps-count");

    let value;

    if (container && !element && bulb.pps) {
        const div = document.createElement("div");
        div.id = "pps-count";
        div.className = "BattleHudFpsComponentStyle-row";

        const label = document.createElement("span");
        label.className = "BattleHudFpsComponentStyle-label";
        label.textContent = "PPS: ";

        const value = document.createElement("span");
        value.id = "pps-text";
        value.className = "BattleHudFpsComponentStyle-value";
        value.style.color = "#8989d8";
        value.textContent = 0;

        div.appendChild(label);
        div.appendChild(value);

        container.appendChild(div);
    } else if(element) {
        if (!bulb.pps) return element.remove();

        if(Date.now() - pps.date >= 1e3) {
            pps.date = Date.now();

            document.getElementById("pps-text").textContent = pps.count;
        }
    }
}

setInterval(display_pps, 1e3);

class parser {
    constructor(file) {
        this.f = file;
    }

    get_smoke() {
        const parts = this.f.split("/600");
        for (const seg of parts) {
            const tail = seg.split("<=0")[0];
            if (tail?.length <= 500) {
                return tail.split("function").pop()?.split("if")[0]?.split("this.").pop()?.split(";")[0];
            }
        }
        return null;
    }

    get_fov() {
        const parts = this.f.split(`"onDeviceKey"`)[1]?.split(`"PITCH"`);
        if (!parts) return null;

        for (const seg of parts) {
            if (seg.length > 300 && seg.length < 700) {
                return seg.split(".call")[1]?.split("),")[1]?.split(".")[1]?.split("=")[0];
            }
        }
        return null;
    }

    get_barFill() {
        const parts = this.f.split('"configureBars"');
        for (const part of parts) {
            if (part.length > 2000) {
                return part.slice(-2000).split('"configure"')[1]?.split("return function")[1]?.split("return")[1]?.split("){")[0]?.split(",")[1]?.split("(")[0]?.split(".")[1];
            }
        }
        return null;
    }

    get_tanks() {
        return this.f.split("onBattleRestart")[0]?.split("function")?.pop()?.split(".")[1]?.split(",")[0];
    }

    get_chargeEffect() {
        const parts = this.f.split("chargeEffect");
        for (const part of parts) {
            if (part.length > 50) return part.slice(-50).split("var")[1]?.split("=")[1]?.split(";")[0]?.split(".")[1];
        }
        return null;
    }

    get_showWeaponBar() {
        return this.f.split("showWeaponBar=")[1]?.split("+")[1]?.split("this.")[1];
    }

    get_userTitleComponent() {
        const parts = this.f.split('"userTitleComponent"');
        for (const part of parts) {
            if (part.length > 50) {
                return part.slice(-50).split("var")[1]?.split("=")[1]?.split(";")[0]?.split(".")[1];
            }
        }
        return null;
    }

    setup() {
        return {
            tanks: this.get_tanks(),
            smoke: this.get_smoke(),
            fov: this.get_fov(),
            barFill: this.get_barFill(),
            chargeEffect: this.get_chargeEffect(),
            showWeaponBar: this.get_showWeaponBar(),
            userTitleComponent: this.get_userTitleComponent(),
        };
    }
}

let tanks = [];

let thread = Date.now();

const update = () => {
    let { list } = window;

    for(let tank of tanks) {
        const { barFill } = keys;
        const { data, chargeEffect, bars } = tank;

        if(!chargeEffect) continue;

        let shotTime = Date.now() - (chargeEffect.date || 0);
        if(tank.type === "enemy" && tank.state === "active" && shotTime < 2600 + 1050 && shotTime > 2500 - 1050 && key[16]) shoot();

        if(bulb.reload[0] && bars?.length) {
            let lightState = shotTime <= 1200,
                display = lightState ? 1 - shotTime / 1200 : (shotTime - 1200) / 2600;

            display = Math.max(0, Math.min(1, display));
            bars[bars.length - 1][barFill](display);
        }
    }

    let old_tanks = Object.assign([], tanks);
    tanks = [];

    if(!list) return requestAnimationFrame(update);
    thread = Date.now();

    const scan = (item) => {
        if (!item || typeof item !== "object") return;

        Object.values(item).forEach(function(data) {
            if(!data?.sort || typeof data[0] === "number") return false;

            let tank = new Tank(data),
                old = old_tanks?.find(e => e.name === tank.name);

            tank.update(old);

            tank.old = { ...tank };
            delete tank.old.old;
            delete tank.old.data;

            tanks.push(tank);
        })
    }

    for(let obj of list) Object.values(obj).forEach(scan);

    for(let tank of tanks) {
        let { data } = tank;
        let old_tank = tank.old;

        let userTitleComponent = keys.userTitleComponent;
        let chargeEffect = `_${keys.chargeEffect}_`;

        let weaponIndex, titleIndex;

        data.forEach((item, index) => {
            let keys = Object.keys(item);

            if(keys.includes(chargeEffect)) weaponIndex = index;
            if(keys.includes(userTitleComponent)) titleIndex = index;
        });

        if(weaponIndex) {
            tank.chargeEffect = data[weaponIndex][chargeEffect];
            if(tank.new) tank.chargeEffect.date = 0;

            let title = data[titleIndex]?.[keys.userTitleComponent];
            if(!title) continue;

            tank.bars = Object.values(title)?.filter(e => e?.[keys.barFill]);
        }
    }
    window.tanks = tanks;

    requestAnimationFrame(update);
}

update();

let button = (key, code, keyCode, timeout = 10) => {
    const pressKey = (type) => {
        const event = new KeyboardEvent(type, {bubbles: true, cancelable: true, key: key, keyCode: keyCode, which: keyCode, code: code, location: 0, altKey: false, ctrlKey: false, metaKey: false, shiftKey: false, repeat: false, fake: true });

        document.activeElement.dispatchEvent(event);
        document.dispatchEvent(event);
    };

    pressKey("keydown");
    setTimeout(() => pressKey("keyup"), timeout);
};

function shoot() {
  button("", "Space", 32);
}

class Tank {
    constructor(data, owner) {
        this.data = data;
        this.owner = data.length > 90;

        this.setup();
    }

    update(old) {
      this.new = !old;
      if(!old) return;

      this.change = old.change;

      let change = old.state !== this.state;
      if(change) this.change = Date.now();
      if(this.owner || !this.change || this.type !== "enemy") return;

      if(key[16] && this.state === "active") shoot();
      if(key[226] && this.state == "semi_active" && Date.now() - this.change >= 1950) shoot();
    }

    setup() {
    for(let part of this.data) {
    let values = Object.values(part),
        strings = values.filter(c => typeof c === "string");

    if(strings.length) {
        let type = values.filter(c => typeof c === "object" && ["ENEMY", "ALLY"].includes(byIndex(c, 0)))?.pop();

        this.type = byIndex(type, 0)?.toLowerCase();

        if(strings.length === 2) {
            this.tag = strings[1];
            this.name = strings[0];
            this.nickname = `[${this.tag}] ${this.name}`;
        } else this.name = this.nickname = strings[0];
    }
}

        let strings = [];
        let fuzzy = Object.values(this.data[0]).map(c => {
            let value = byIndex(c, 0);
            if(typeof value === "string") strings.push(value.toLowerCase())
        });

        if(strings) this.state = strings[0];
}
}

const byIndex = window.byIndex = function(obj) {
    if(!obj) return

    let res = obj;
    for(let i = 1; i < arguments.length; i += 1) {
        let index = arguments[i];

        if(typeof index === "number" && res) res = Object.values(res);
        if(res) res = res[index];
    }
    return res;
}

const apply = (property, setter, getter) => property && Object.defineProperty(Object.prototype, property, {
    get() {
        return getter ? getter.call(this, `_${property}_`, this[`_${property}_`]) : this[`_${property}_`];
    },
    set(value) {
        this[`_${property}_`] = setter ? setter.call(this, value) : value;
    },
    configurable: true
});

/* stops original file */
apply("equals", function(value) {
    return null;
});

let keys;

const hook = function(str) {
    try {
        keys = new parser(str).setup();
log(keys)
        apply(keys.showWeaponBar, null, function(name) {
            let data = this[name];

            return bulb.reload[0];
        });

        apply(keys.chargeEffect, null, function(name) {
            let data = this[name];

            data.date = Date.now();

            return data;
        });

        apply("xe6_1", null, function(value) {
           log("laser", value)
        })

        apply(keys.tanks, function(value) {
            window.list = byIndex(value, 1);

            return value;
        })

        apply(keys.smoke, null, function(name) {
            let data = this[name];
            if(bulb.smoke[0]) data = null;

            return data;
        });

        apply(keys.fov, null, function(name) {
            let data = this[name];
            if(bulb.fov[0] && typeof data === "number") data = 1.0471 * 1.35;

            return data;
        });

        log("keys:", keys);
    } catch(e){
        oops("outdated?", e.message);
    }
}

const compare = (arr1, arr2) => {
    if(!arr1.sort) {
        arr1 = Object.values(arr1);
        arr2 = Object.values(arr2);

        return arr1.length === arr2.length;
    }

    return arr1.length === arr2.length && arr1.every((element, index) => element === arr2[index]);
}

const sleep = ms => new Promise(action => setTimeout(action, ms));

new Proxy(window, { set: (_, prop, val) => { window[prop] = val; return true; }, deleteProperty: (_, prop) => { delete window[prop]; return true; } });

const log = window.log = console.info;
["log", "warn", "error", "info", "debug"].forEach(method => {
    console[method] = () => {};
});

let menu_active, sets = [];

function menu(type, html) {
    let shadow = { host: document.createElement("div") }
    document.body.appendChild(shadow.host);

    let root = shadow.root = shadow.host.attachShadow({ mode: 'open' });
    root.innerHTML = html;

    const box = root.querySelector("#box");
    sets.push({ x: 0, y: 0, box });

    let hue = 0;

    function animate() {
        hue = (hue + 1) % 360;
        box.style["background-color"] = `hsl(${hue}, 70%, 60%)`;
    }

    if(!type) setInterval(animate, 50);

    return [ root, box ];
}

const sliding = 0;

(function() {
    let list = "";

    let storage = JSON.parse(localStorage.getItem("storage_item"));
    if(storage && !compare(storage, bulb)) storage = null;

    for(let light in bulb) {
        let value = bulb[light];

        if(typeof value !== "object") continue;

        if(storage) value[0] = storage[light][0];

        let [ toggle, name ] = value;

        let id = name.replace(" ", "_").toLowerCase();

        let box = `
  <div class="check">
    <input type="checkbox" id="${id}" ${value[0] ? "checked" : ""}>
    <label for="${id}">${name.toLowerCase()}</label>
  </div>`;

        list += box;
    }

    const [ root, box ] = menu(1, `
<style>
.mini-box {
    display: none;
    z-index: 999999;
    position: absolute;
    top: 104px;
    left: 100px;
    width: 140px;
    background-color: #2d2a2a;
    color: white;
    border-radius: 6px;
    padding: 10px;
    box-shadow: 0 2px 10px rgba(0,0,0,.1);
}

.mini-box label, .mini-box select {
    font-size: 12px
}

.mini-box select {
    width: 100%;
    padding: 4px;
    margin-top: 5px
}

.check {
    display: flex;
    align-items: center;
    gap: 0.5em;
}

#discord {
    position: absolute;
    top: 5px;
    right: 5px;
    width: 25px;
    height: 25px;
    cursor: pointer;
}
</style>

<div class=mini-box id=box>
   <div style=display:flex;justify-content:space-between;align-items:center;margin-bottom:6px>
   <label style=font-size:large>XP/BP</label>

     <a href="https://discord.gg/7XfTKqEcsq" target="_blank">
    <img id="discord" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAACHAAAAhwCAYAAABPzFtpAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAP+lSURBVHhe7N15lJ3lfeD5391r0YY2tC+AEJIAiUWAWMQOQgKEJBaBwcY2TjpLJ51MEtuJ4yRO4jjOZLPT6UmnTy+npyedM2dm3GemkzhOvOGFGLDZN4PZzQ4Ca697q6beW68MmE1LVT13+XzOuefe51aJ/6j33vf9vr+nsPUjrw0FAAAAAAAAAADJFPNnAAAAAAAAAAASEXAAAAAAAAAAACQm4AAAAAAAAAAASEzAAQAAAAAAAACQmIADAAAAAAAAACAxAQcAAAAAAAAAQGICDgAAAAAAAACAxAQcAAAAAAAAAACJCTgAAAAAAAAAABITcAAAAAAAAAAAJCbgAAAAAAAAAABITMABAAAAAAAAAJCYgAMAAAAAAAAAIDEBBwAAAAAAAABAYgIOAAAAAAAAAIDEBBwAAAAAAAAAAIkJOAAAAAAAAAAAEhNwAAAAAAAAAAAkJuAAAAAAAAAAAEhMwAEAAAAAAAAAkJiAAwAAAAAAAAAgMQEHAAAAAAAAAEBiAg4AAAAAAAAAgMQEHAAAAAAAAAAAiQk4AAAAAAAAAAASE3AAAAAAAAAAACQm4AAAAAAAAAAASEzAAQAAAAAAAACQmIADAAAAAAAAACAxAQcAAAAAAAAAQGICDgAAAAAAAACAxAQcAAAAAAAAAACJCTgAAAAAAAAAABITcAAAAAAAAAAAJCbgAAAAAAAAAABITMABAAAAAAAAAJCYgAMAAAAAAAAAIDEBBwAAAAAAAABAYgIOAAAAAAAAAIDEBBwAAAAAAAAAAIkJOAAAAAAAAAAAEhNwAAAAAAAAAAAkJuAAAAAAAAAAAEhMwAEAAAAAAAAAkJiAAwAAAAAAAAAgMQEHAAAAAAAAAEBiAg4AAAAAAAAAgMQEHAAAAAAAAAAAiQk4AAAAAAAAAAASE3AAAAAAAAAAACQm4AAAAAAAAAAASEzAAQAAAAAAAACQmIADAAAAAAAAACAxAQcAAAAAAAAAQGICDgAAAAAAAACAxAQcAAAAAAAAAACJCTgAAAAAAAAAABITcAAAAAAAAAAAJCbgAAAAAAAAAABITMABAAAAAAAAAJCYgAMAAAAAAAAAIDEBBwAAAAAAAABAYgIOAAAAAAAAAIDEBBwAAAAAAAAAAIkJOAAAAAAAAAAAEhNwAAAAAAAAAAAkJuAAAAAAAAAAAEhMwAEAAAAAAAAAkJiAAwAAAAAAAAAgMQEHAAAAAAAAAEBiAg4AAAAAAAAAgMQEHAAAAAAAAAAAiQk4AAAAAAAAAAASE3AAAAAAAAAAACQm4AAAAAAAAAAASEzAAQAAAAAAAACQmIADAAAAAAAAACAxAQcAAAAAAAAAQGICDgAAAAAAAACAxAQcAAAAAAAAAACJCTgAAAAAAAAAABITcAAAAAAAAAAAJCbgAAAAAAAAAABITMABAAAAAAAAAJCYgAMAAAAAAAAAIDEBBwAAAAAAAABAYgIOAAAAAAAAAIDEBBwAAAAAAAAAAIkJOAAAAAAAAAAAEhNwAAAAAAAAAAAkJuAAAAAAAAAAAEhMwAEAAAAAAAAAkJiAAwAAAAAAAAAgMQEHAAAAAAAAAEBiAg4AAAAAAAAAgMQEHAAAAAAAAAAAiQk4AAAAAAAAAAASE3AAAAAAAAAAACQm4AAAAAAAAAAASEzAAQAAAAAAAACQmIADAAAAAAAAACAxAQcAAAAAAAAAQGICDgAAAAAAAACAxAQcAAAAAAAAAACJCTgAAAAAAAAAABITcAAAAAAAAAAAJCbgAAAAAAAAAABITMABAAAAAAAAAJCYgAMAAAAAAAAAIDEBBwAAAAAAAABAYgIOAAAAAAAAAIDEBBwAAAAAAAAAAIkJOAAAAAAAAAAAEhNwAAAAAAAAAAAkJuAAAAAAAAAAAEhMwAEAAAAAAAAAkJiAAwAAAAAAAAAgMQEHAAAAAAAAAEBiAg4AAAAAAAAAgMQEHAAAAAAAAAAAiQk4AAAAAAAAAAASE3AAAAAAAAAAACQm4AAAAAAAAAAASEzAAQAAAAAAAACQmIADAAAAAAAAACAxAQcAAAAAAAAAQGICDgAAAAAAAACAxAQcAAAAAAAAAACJCTgAAAAAAAAAABITcAAAAAAAAAAAJCbgAAAAAAAAAABITMABAAAAAAAAAJCYgAMAAAAAAAAAIDEBBwAAAAAAAABAYgIOAAAAAAAAAIDEBBwAAAAAAAAAAIkJOAAAAAAAAAAAEhNwAAAAAAAAAAAkJuAAAAAAAAAAAEhMwAEAAAAAAAAAkJiAAwAAAAAAAAAgMQEHAAAAAAAAAEBiAg4AAAAAAAAAgMQEHAAAAAAAAAAAiQk4AAAAAAAAAAASE3AAAAAAAAAAACQm4AAAAAAAAAAASEzAAQAAAAAAAACQmIADAAAAAAAAACAxAQcAAAAAAAAAQGICDgAAAAAAAACAxAQcAAAAAAAAAACJCTgAAAAAAAAAABITcAAAAAAAAAAAJCbgAAAAAAAAAABITMABAAAAAAAAAJCYgAMAAAAAAAAAIDEBBwAAAAAAAABAYgIOAAAAAAAAAIDEBBwAAAAAAAAAAIkJOAAAAAAAAAAAEhNwAAAAAAAAAAAkJuAAAAAAAAAAAEhMwAEAAAAAAAAAkJiAAwAAAAAAAAAgMQEHAAAAAAAAAEBiAg4AAAAAAAAAgMQEHAAAAAAAAAAAiQk4AAAAAAAAAAASE3AAAAAAAAAAACQm4AAAAAAAAAAASEzAAQAAAAAAAACQmIADAAAAAAAAACAxAQcAAAAAAAAAQGICDgAAAAAAAACAxAQcAAAAAAAAAACJCTgAAAAAAAAAABITcAAAAAAAAAAAJCbgAAAAAAAAAABITMABAAAAAAAAAJCYgAMAAAAAAAAAIDEBBwAAAAAAAABAYgIOAAAAAAAAAIDEBBwAAAAAAAAAAIkJOAAAAAAAAAAAEhNwAAAAAAAAAAAkJuAAAAAAAAAAAEhMwAEAAAAAAAAAkJiAAwAAAAAAAAAgMQEHAAAAAAAAAEBiAg4AAAAAAAAAgMQEHAAAAAAAAAAAiQk4AAAAAAAAAAASE3AAAAAAAAAAACQm4AAAAAAAAAAASEzAAQAAAAAAAACQmIADAAAAAAAAACAxAQcAAAAAAAAAQGICDgAAAAAAAACAxAQcAAAAAAAAAACJCTgAAAAAAAAAABITcAAAAAAAAAAAJCbgAAAAAAAAAABITMABAAAAAAAAAJCYgAMAAAAAAAAAIDEBBwAAAAAAAABAYgIOAAAAAAAAAIDEBBwAAAAAAAAAAIkJOAAAAAAAAAAAEhNwAAAAAAAAAAAkJuAAAAAAAAAAAEhMwAEAAAAAAAAAkJiAAwAAAAAAAAAgMQEHAAAAAAAAAEBiAg4AAAAAAAAAgMQEHAAAAAAAAAAAiQk4AAAAAAAAAAASE3AAAAAAAAAAACQm4AAAAAAAAAAASEzAAQAAAAAAAACQmIADAAAAAAAAACAxAQcAAAAAAAAAQGICDgAAAAAAAACAxAQcAAAAAAAAAACJCTgAAAAAAAAAABITcAAAAAAAAAAAJCbgAAAAAAAAAABITMABAAAAAAAAAJCYgAMAAAAAAAAAIDEBBwAAAAAAAABAYgIOAAAAAAAAAIDEBBwAAAAAAAAAAIkJOAAAAAAAAAAAEhNwAAAAAAAAAAAkJuAAAAAAAAAAAEhMwAEAAAAAAAAAkJiAAwAAAAAAAAAgMQEHAAAAAAAAAEBiAg4AAAAAAAAAgMQEHAAAAAAAAAAAiQk4AAAAAAAAAAASE3AAAAAAAAAAACQm4AAAAAAAAAAASEzAAQAAAAAAAACQmIADAAAAAAAAACAxAQcAAAAAAAAAQGICDgAAAAAAAACAxAQcAAAAAAAAAACJCTgAAAAAAAAAABITcAAAAAAAAAAAJCbgAAAAAAAAAABITMABAAAAAAAAAJCYgAMAAAAAAAAAIDEBBwAAAAAAAABAYgIOAAAAAAAAAIDEBBwAAAAAAAAAAIkJOAAAAAAAAAAAEhNwAAAAAAAAAAAkJuAAAAAAAAAAAEhMwAEAAAAAAAAAkJiAAwAAAAAAAAAgMQEHAAAAAAAAAEBiAg4AAAAAAAAAgMQEHAAAAAAAAAAAiQk4AAAAAAAAAAASE3AAAAAAAAAAACQm4AAAAAAAAAAASEzAAQAAAAAAAACQmIADAAAAAAAAACAxAQcAAAAAAAAAQGICDgAAAAAAAACAxAQcAAAAAAAAAACJCTgAAAAAAAAAABITcAAAAAAAAAAAJCbgAAAAAAAAAABITMABAAAAAAAAAJCYgAMAAAAAAAAAIDEBBwAAAAAAAABAYgIOAAAAAAAAAIDEBBwAAAAAAAAAAIkJOAAAAAAAAAAAEhNwAAAAAAAAAAAkJuAAAAAAAAAAAEhMwAEAAAAAAAAAkJiAAwAAAAAAAAAgMQEHAAAAAAAAAEBiAg4AAAAAAAAAgMQEHAAAAAAAAAAAiQk4AAAAAAAAAAASE3AAAAAAAAAAACQm4AAAAAAAAAAASEzAAQAAAAAAAACQmIADAAAAAAAAACAxAQcAAAAAAAAAQGICDgAAAAAAAACAxAQcAAAAAAAAAACJCTgAAAAAAAAAABITcAAAAAAAAAAAJCbgAAAAAAAAAABITMABAAAAAAAAAJCYgAMAAAAAAAAAIDEBBwAAAAAAAABAYgIOAAAAAAAAAIDEBBwAAAAAAAAAAIkJOAAAAAAAAAAAEhNwAAAAAAAAAAAkJuAAAAAAAAAAAEhMwAEAAAAAAAAAkJiAAwAAAAAAAAAgMQEHAAAAAAAAAEBiAg4AAAAAAAAAgMQEHAAAAAAAAAAAiQk4AAAAAAAAAAASE3AAAAAAAAAAACQm4AAAAAAAAAAASEzAAQAAAAAAAACQmIADAAAAAAAAACAxAQcAAAAAAAAAQGICDgAAAAAAAACAxAQcAAAAAAAAAACJCTgAAAAAAAAAABITcAAAAAAAAAAAJCbgAAAAAAAAAABITMABAAAAAAAAAJCYgAMAAAAAAAAAIDEBBwAAAAAAAABAYgIOAAAAAAAAAIDEBBwAAAAAAAAAAIkJOAAAAAAAAAAAEhNwAAAAAAAAAAAkJuAAAAAAAAAAAEhMwAEAAAAAAAAAkJiAAwAAAAAAAAAgMQEHAAAAAAAAAEBiAg4AAAAAAAAAgMQEHAAAAAAAAAAAiQk4AAAAAAAAAAASE3AAAAAAAAAAACQm4AAAAAAAAAAASEzAAQAAAAAAAACQmIADAAAAAAAAACAxAQcAAAAAAAAAQGICDgAAAAAAAACAxAQcAAAAAAAAAACJCTgAAAAAAAAAABITcAAAAAAAAAAAJCbgAAAAAAAAAABITMABAAAAAAAAAJCYgAMAAAAAAAAAIDEBBwAAAAAAAABAYgIOAAAAAAAAAIDEBBwAAAAAAAAAAIkJOAAAAAAAAAAAEhNwAAAAAAAAAAAkJuAAAAAAAAAAAEhMwAEAAAAAAAAAkJiAAwAAAAAAAAAgMQEHAAAAAAAAAEBiAg4AAAAAAAAAgMQEHAAAAAAAAAAAiQk4AAAAAAAAAAASE3AAAAAAAAAAACQm4AAAAAAAAAAASEzAAQAAAAAAAACQmIADAAAAAAAAACAxAQcAAAAAAAAAQGICDgAAAAAAAACAxAQcAAAAAAAAAACJCTgAAAAAAAAAABITcAAAAAAAAAAAJCbgAAAAAAAAAABITMABAAAAAAAAAJCYgAMAAAAAAAAAIDEBBwAAAAAAAABAYgIOAAAAAAAAAIDEBBwAAAAAAAAAAIkJOAAAAAAAAAAAEhNwAAAAAAAAAAAkJuAAAAAAAAAAAEhMwAEAAAAAAAAAkJiAAwAAAAAAAAAgMQEHAAAAAAAAAEBiAg4AAAAAAAAAgMQEHAAAAAAAAAAAiQk4AAAAAAAAAAASE3AAAAAAAAAAACQm4AAAAAAAAAAASEzAAQAAAAAAAACQmIADAAAAAAAAACAxAQcAAAAAAAAAQGICDgAAAAAAAACAxAQcAAAAAAAAAACJCTgAAAAAAAAAABITcAAAAAAAAAAAJCbgAAAAAAAAAABITMABAAAAAAAAAJCYgAMAAAAAAAAAIDEBBwAAAAAAAABAYgIOAAAAAAAAAIDEBBwAAAAAAAAAAIkJOAAAAAAAAAAAEhNwAAAAAAAAAAAkJuAAAAAAAAAAAEhMwAEAAAAAAAAAkJiAAwAAAAAAAAAgMQEHAAAAAAAAAEBiAg4AAAAAAAAAgMQEHAAAAAAAAAAAiQk4AAAAAAAAAAASE3AAAAAAAAAAACQm4AAAAAAAAAAASEzAAQAAAAAAAACQmIADAAAAAAAAACAxAQcAAAAAAAAAQGICDgAAAAAAAACAxAQcAAAAAAAAAACJCTgAAAAAAAAAABITcAAAAAAAAAAAJCbgAAAAAAAAAABITMABAAAAAAAAAJCYgAMAAAAAAAAAIDEBBwAAAAAAAABAYgIOAAAAAAAAAIDEBBwAAAAAAAAAAIkJOAAAAAAAAAAAEhNwAAAAAAAAAAAkJuAAAAAAAAAAAEhMwAEAAAAAAAAAkJiAAwAAAAAAAAAgMQEHAAAAAAAAAEBiAg4AAAAAAAAAgMQEHAAAAAAAAAAAiQk4AAAAAAAAAAASE3AAAAAAAAAAACQm4AAAAAAAAAAASEzAAQAAAAAAAACQmIADAAAAAAAAACAxAQcAAAAAAAAAQGICDgAAAAAAAACAxAQcAAAAAAAAAACJCTgAAAAAAAAAABITcAAAAAAAAAAAJCbgAAAAAAAAAABITMABAAAAAAAAAJCYgAMAAAAAAAAAIDEBBwAAAAAAAABAYgIOAAAAAAAAAIDEBBwAAAAAAAAAAIkJOAAAAAAAAAAAEhNwAAAAAAAAAAAkJuAAAAAAAAAAAEhMwAEAAAAAAAAAkJiAAwAAAAAAAAAgMQEHAAAAAAAAAEBiAg4AAAAAAAAAgMQEHAAAAAAAAAAAiQk4AAAAAAAAAAASE3AAAAAAAAAAACQm4AAAAAAAAAAASEzAAQAAAAAAAACQmIADAAAAAAAAACAxAQcAAAAAAAAAQGICDgAAAAAAAACAxAQcAAAAAAAAAACJCTgAAAAAAAAAABIT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pEzAAQAAAAAAAACQMgEHAAAAAAAAAEDKBBwAAAAAAAAAACkTcAAAAAAAAAAApEzAAQAAAAAAAACQMgEHAAAAAAAAAEDKBBwAAAAAAAAAACkTcAAAAAAAAAAApEzAAQAAAAAAAACQMgEHAAAAAAAAAEDKBBwAAAAAAAAAACkTcAAAAAAAAAAApEzAAQAAAAAAAACQMgEHAAAAAAAAAEDKBBwAAAAAAAAAACkTcAAAAAAAAAAApEzAAQAAAAAAAACQMgEHAAAAAAAAAEDKBBwAAAAAAAAAACkTcAAAAAAAAAAApEzAAQAAAAAAAACQMgEHAAAAAAAAAEDKBBwAAAAAAAAAACkTcAAAAAAAAAAApEzAAQAAAAAAAACQMgEHAAAAAAAAAEDKBBwAAAAAAAAAACkTcAAAAAAAAAAApEzAAQAAAAAAAACQMgEHAAAAAAAAAEDKBBwAAAAAAAAAACkTcAAAAAAAAAAApEzAAQAAAAAAAACQMgEHAAAAAAAAAEDKBBwAAAAAAAAAACkTcAAAAAAAAAAApEzAAQAAAAAAAACQMgEHAAAAAAAAAEDKBBwAAAAAAAAAACkTcAAAAAAAAAAApEzAAQAAAAAAAACQMgEHAAAAAAAAAEDKBBwAAAAAAAAAACkTcAAAAAAAAAAApEzAAQAAAAAAAACQMgEHAAAAAAAAAEDKBBwAAAAAAAAAACkTcAAAAAAAAAAApEzAAQAAAAAAAACQMgEHAAAAAAAAAEDKBBwAAAAAAAAAACkTcAAAAAAAAAAApEzAAQAAAAAAAACQMgEHAAAAAAAAAEDKBBwAAAAAAAAAACkTcAAAAAAAAAAApEzAAQAAAAAAAACQMgEHAAAAAAAAAEDKBBwAAAAAAAAAACkTcAAAAAAAAAAApEzAAQAAAAAAAACQMgEHAAAAAAAAAEDKBBwAAAAAAAAAACkTcAAAAAAAAAAApEzAAQAAAAAAAACQMgEHAB2KdpYAABCASURBVAAAAAAAAEDKBBwAAAAAAAAAACkTcAAAAAAAAAAApEzAAQAAAAAAAACQMgEHAAAAAAAAAEDKBBwAAAAAAAAAACkTcAAAAAAAAAAApEzAAQAAAAAAAACQMgEHAAAAAAAAAEDKBBwAAAAAAAAAACkTcAAAAAAAAAAApEzAAQAAAAAAAACQMgEHAAAAAAAAAEDKBBwAAAAAAAAAACkTcAAAAAAAAAAApEzAAQAAAAAAAACQMgEHAAAAAAAAAEDKBBwAAAAAAAAAACkTcAAAAAAAAAAApEzAAQAAAAAAAACQMgEHAAAAAAAAAEDKBBwAAAAAAAAAACkTcAAAAAAAAAAApEzAAQAAAAAAAACQMgEHAAAAAAAAAEDKBBwAAAAAAAAAACkTcAAAAAAAAAAApEzAAQAAAAAAAACQMgEHAAAAAAAAAEDKBBwAAAAAAAAAACkTcAAAAAAAAAAApEzAAQAAAAAAAACQMgEHAAAAAAAAAEDKBBwAAAAAAAAAACkTcAAAAAAAAAAApEzAAQAAAAAAAACQMgEHAAAAAAAAAEDKBBwAAAAAAAAAACkTcAAAAAAAAAAApEzAAQAAAAAAAACQMgEHAAAAAAAAAEDKBBwAAAAAAAAAACkTcAAAAAAAAAAApEzAAQAAAAAAAACQMgEHAAAAAAAAAEDKBBwAAAAAAAAAACkTcAAAAAAAAAAApEzAAQAAAAAAAACQMgEHAAAAAAAAAEDKBBwAAAAAAAAAACkTcAAAAAAAAAAApEzAAQAAAAAAAACQMgEHAAAAAAAAAEDKBBwAAAAAAAAAACkTcAAAAAAAAAAApEzAAQAAAAAAAACQMgEHAAAAAAAAAEDKBBwAAAAAAAAAACkTcAAAAAAAAAAApEzAAQAAAAAAAACQMgEHAAAAAAAAAEDKBBwAAAAAAAAAACkTcAAAAAAAAAAApEzAAQAAAAAAAACQMgEHAAAAAAAAAEDKBBwAAAAAAAAAACkTcAAAAAAAAAAApEzAAQAAAAAAAACQMgEHAAAAAAAAAEDKBBwAAAAAAAAAACkTcAAAAAAAAAAApEzAAQAAAAAAAACQMgEHAAAAAAAAAEDKBBwAAAAAAAAAACkTcAAAAAAAAAAApEzAAQAAAAAAAACQMgEHAAAAAAAAAEDKBBwAAAAAAAAAACkTcAAAAAAAAAAApEzAAQAAAAAAAACQMgEHAAAAAAAAAEDKBBwAAAAAAAAAACkTcAAAAAAAAAAApEzAAQAAAAAAAACQMgEHAAAAAAAAAEDKBBwAAAAAAAAAACkTcAAAAAAAAAAApEzAAQAAAAAAAACQMgEHAAAAAAAAAEDKBBwAAAAAAAAAACkTcAAAAAAAAAAApEzAAQAAAAAAAACQMgEHAAAAAAAAAEDKBBwAAAAAAAAAACkTcAAAAAAAAAAApEzAAQAAAAAAAACQMgEHAAAAAAAAAEDKBBwAAAAAAAAAACkTcAAAAAAAAAAApEzAAQAAAAAAAACQMgEHAAAAAAAAAEDKBBwAAAAAAAAAACkTcAAAAAAAAAAApEzAAQAAAAAAAACQMgEHAAAAAAAAAEDKBBwAAAAAAAAAACkTcAAAAAAAAAAApEzAAQAAAAAAAACQMgEHAAAAAAAAAEDKBBwAAAAAAAAAACkTcAAAAAAAAAAApEzAAQAAAAAAAACQMgEHAAAAAAAAAEDKBBwAAAAAAAAAACkTcAAAAAAAAAAApEzAAQAAAAAAAACQMgEHAAAAAAAAAEDKBBwAAAAAAAAAACkTcAAAAAAAAAAApEzAAQAAAAAAAACQMgEHAAAAAAAAAEDKBBwAAAAAAAAAACkTcAAAAAAAAAAApEzAAQAAAAAAAACQMgEHAAAAAAAAAEDKBBwAAAAAAAAAACkTcAAAAAAAAAAApEzAAQAAAAAAAACQMgEHAAAAAAAAAEDKBBwAAAAAAAAAACkTcAAAAAAAAAAApEzAAQAAAAAAAACQMgEHAAAAAAAAAEDKBBwAAAAAAAAAACkTcAAAAAAAAAAApEzAAQAAAAAAAACQMgEHAAAAAAAAAEDKBBwAAAAAAAAAACkTcAAAAAAAAAAApEzAAQAAAAAAAACQMgEHAAAAAAAAAEDKBBwAAAAAAAAAACkTcAAAAAAAAAAApEzAAQAAAAAAAACQMgEHAAAAAAAAAEDKBBwAAAAAAAAAACkTcAAAAAAAAAAApEzAAQAAAAAAAACQMgEHAAAAAAAAAEDKBBwAAAAAAAAAACkTcAAAAAAAAAAApEzAAQAAAAAAAACQMgEHAAAAAAAAAEDKBBwAAAAAAAAAACkTcAAAAAAAAAAApEzAAQAAAAAAAACQMgEHAAAAAAAAAEDKBBwAAAAAAAAAACkTcAAAAAAAAAAApEzAAQAAAAAAAACQMgEHAAAAAAAAAEDKBBwAAAAAAAAAACkTcAAAAAAAAAAApEzAAQAAAAAAAACQMgEHAAAAAAAAAEDKBBwAAAAAAAAAACkTcAAAAAAAAAAApEzAAQAAAAAAAACQMgEHAAAAAAAAAEDKBBwAAAAAAAAAACkTcAAAAAAAAAAApEzAAQAAAAAAAACQMgEHAAAAAAAAAEDKBBwAAAAAAAAAACkTcAAAAAAAAAAApEzAAQAAAAAAAACQMgEHAAAAAAAAAEDKBBwAAAAAAAAAACkTcAAAAAAAAAAApEzAAQAAAAAAAACQMgEHAAAAAAAAAEDKBBwAAAAAAAAAACkTcAAAAAAAAAAApEzAAQAAAAAAAACQMgEHAAAAAAAAAEDKBBwAAAAAAAAAACkTcAAAAAAAAAAApEzAAQAAAAAAAACQMgEHAAAAAAAAAEDKBBwAAAAAAAAAACkTcAAAAAAAAAAApEzAAQAAAAAAAACQMgEHAAAAAAAAAEDKBBwAAAAAAAAAACkTcAAAAAAAAAAApEzAAQAAAAAAAACQMgEHAAAAAAAAAEDKBBwAAAAAAAAAACkTcAAAAAAAAAAApEzAAQAAAAAAAACQMgEHAAAAAAAAAEDKBBwAAAAAAAAAACkTcAAAAAAAAAAApEzAAQAAAAAAAACQMgEHAAAAAAAAAEDKBBwAAAAAAAAAACkTcAAAAAAAAAAApEzAAQAAAAAAAACQMgEHAAAAAAAAAEDKBBwAAAAAAAAAACkTcAAAAAAAAAAApEzAAQAAAAAAAACQMgEHAAAAAAAAAEDKBBwAAAAAAAAAACkTcAAAAAAAAAAApEzAAQAAAAAAAACQMgEHAAAAAAAAAEDKBBwAAAAAAAAAACkTcAAAAAAAAAAApEzAAQAAAAAAAACQMgEHAAAAAAAAAEDKBBwAAAAAAAAAACkTcAAAAAAAAAAApEzAAQAAAAAAAACQMgEHAAAAAAAAAEDKBBwAAAAAAAAAACkTcAAAAAAAAAAApEzAAQAAAAAAAACQMgEHAAAAAAAAAEDKBBwAAAAAAAAAACkTcAAAAAAAAAAApEzAAQAAAAAAAACQMgEHAAAAAAAAAEDKBBwAAAAAAAAAACkTcAAAAAAAAAAApEzAAQAAAAAAAACQMgEHAAAAAAAAAEDKBBwAAAAAAAAAACkTcAAAAAAAAAAApEzAAQAAAAAAAACQMgEHAAAAAAAAAEDKBBwAAAAAAAAAACkTcAAAAAAAAAAApEzAAQAAAAAAAACQMgEHAAAAAAAAAEDKBBwAAAAAAAAAACkTcAAAAAAAAAAApEzAAQAAAAAAAACQMgEHAAAAAAAAAEDKBBwA8P/btWMCAAAAhEH2T22MPZADAAAAAAAAiAkcAAAAAAAAAAAxgQMAAAAAAAAAICZwAAAAAAAAAADEBA4AAAAAAAAAgJjAAQAAAAAAAAAQEzgAAAAAAAAAAGICBwAAAAAAAABATOAAAAAAAAAAAIgJHAAAAAAAAAAAMYEDAAAAAAAAACAmcAAAAAAAAAAAxAQOAAAAAAAAAICYwAEAAAAAAAAAEBM4AAAAAAAAAABiAgcAAAAAAAAAQEzgAAAAAAAAAACICRwAAAAAAAAAADGBAwAAAAAAAAAgJnAAAAAAAAAAAMQEDgAAAAAAAACAmMABAAAAAAAAABATOAAAAAAAAAAAYgIHAAAAAAAAAEBM4AAAAAAAAAAAiAkcAAAAAAAAAAAxgQMAAAAAAAAAICZwAAAAAAAAAADEBA4AAAAAAAAAgJjAAQAAAAAAAAAQEzgAAAAAAAAAAGICBwAAAAAAAABATOAAAAAAAAAAAIgJHAAAAAAAAAAAMYEDAAAAAAAAACAmcAAAAAAAAAAAxAQOAAAAAAAAAICYwAEAAAAAAAAAEBM4AAAAAAAAAABiAgcAAAAAAAAAQEzgAAAAAAAAAACICRwAAAAAAAAAADGBAwAAAAAAAAAgJnAAAAAAAAAAAMQEDgAAAAAAAACAmMABAAAAAAAAABATOAAAAAAAAAAAYgIHAAAAAAAAAEBM4AAAAAAAAAAAiAkcAAAAAAAAAAAxgQMAAAAAAAAAICZwAAAAAAAAAADEBA4AAAAAAAAAgJjAAQAAAAAAAAAQEzgAAAAAAAAAAGICBwAAAAAAAABATOAAAAAAAAAAAIgJHAAAAAAAAAAAMYEDAAAAAAAAACAmcAAAAAAAAAAAxAQOAAAAAAAAAICYwAEAAAAAAAAAEBM4AAAAAAAAAABiAgcAAAAAAAAAQEzgAAAAAAAAAACICRwAAAAAAAAAADGBAwAAAAAAAAAgJnAAAAAAAAAAAMQEDgAAAAAAAACAmMABAAAAAAAAABATOAAAAAAAAAAAYgIHAAAAAAAAAEBM4AAAAAAAAAAAiAkcAAAAAAAAAAAxgQMAAAAAAAAAICZwAAAAAAAAAADEBA4AAAAAAAAAgJjAAQAAAAAAAAAQEzgAAAAAAAAAAGICBwAAAAAAAABATOAAAAAAAAAAAIgJHAAAAAAAAAAAMYEDAAAAAAAAACAmcAAAAAAAAAAAxAQOAAAAAAAAAICYwAEAAAAAAAAAEBM4AAAAAAAAAABiAgcAAAAAAAAAQEzgAAAAAAAAAACICRwAAAAAAAAAADGBAwAAAAAAAAAgJnAAAAAAAAAAAMQEDgAAAAAAAACAmMABAAAAAAAAABATOAAAAAAAAAAAYgIHAAAAAAAAAEBM4AAAAAAAAAAAiAkcAAAAAAAAAAAxgQMAAAAAAAAAICZwAAAAAAAAAADEBA4AAAAAAAAAgJjAAQAAAAAAAAAQEzgAAAAAAAAAAGICBwAAAAAAAABATOAAAAAAAAAAAIgJHAAAAAAAAAAAMYEDAAAAAAAAACAmcAAAAAAAAAAAxAQOAAAAAAAAAICYwAEAAAAAAAAAEBM4AAAAAAAAAABiAgcAAAAAAAAAQEzgAAAAAAAAAACICRwAAAAAAAAAADGBAwAAAAAAAAAgJnAAAAAAAAAAAMQEDgAAAAAAAACAmMABAAAAAAAAABATOAAAAAAAAAAAYgIHAAAAAAAAAEBM4AAAAAAAAAAAiAkcAAAAAAAAAAAxgQMAAAAAAAAAICZwAAAAAAAAAADEBA4AAAAAAAAAgJjAAQAAAAAAAAAQEzgAAAAAAAAAAGICBwAAAAAAAABATOAAAAAAAAAAAIgJHAAAAAAAAAAAMYEDAAAAAAAAACAmcAAAAAAAAAAApLYDZqhR8rClkREAAAAASUVORK5CYII=" alt="Clickable Image">
  </a>
</div>

${list}

</div>`);

    box.style.display = "block";

    function update(storage){
        let boxes = box.getElementsByClassName("check");

        for(let light in bulb) {
            let value = bulb[light];

            if(typeof value !== "object") continue;

            let [ toggle, name ] = value;

            let id = name.replace(" ", "_").toLowerCase();

            let el = box.querySelector(`#${id}`);
            value[0] = el.checked;
        }

        localStorage.setItem("storage_item", JSON.stringify(bulb))
    }

    setInterval(update, 500);
})();

window.addEventListener("beforeunload", () => {
    for(let menu of sets) menu.save();
    localStorage.setItem("storage_item", JSON.stringify(bulb))
});

run();