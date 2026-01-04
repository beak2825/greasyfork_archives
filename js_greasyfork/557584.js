// ==UserScript==
// @name         Eclipse Client
// @icon
// @license      GNU
// @namespace    Eclipse
// @match        *://moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @version      1
// @grant        none
// @description  A powerfull script for some people that have it
// @author       Ultra Hack
// @downloadURL https://update.greasyfork.org/scripts/557584/Eclipse%20Client.user.js
// @updateURL https://update.greasyfork.org/scripts/557584/Eclipse%20Client.meta.js
// ==/UserScript==

function getEl(id) {
    return document.getElementById(id);
}

getEl("leaderboardButton").remove();
getEl("foodDisplay").remove();
getEl("woodDisplay").remove();
getEl("stoneDisplay").remove();
getEl("ageText").remove();

// Know If Teamate:
function isTeam(tmpObj) {
    return (tmpObj == player || (tmpObj.team && tmpObj.team == player.team));
}
function cdf (e, t){
    try {
        return Math.hypot((t.y2||t.y)-(e.y2||e.y), (t.x2||t.x)-(e.x2||e.x));
    } catch(e){
        return Infinity;
    }
}

getEl("wideAdCard").remove();
getEl("partyButton").remove();
getEl("joinPartyButton").remove();

getEl("linksContainer2").remove();
getEl("mainMenu").style.backgroundImage = "url('')";
getEl("gameName").style.font = "120px  zamruds";
getEl('menuCardHolder').style.marginTop = '50px';
getEl("gameName").style.textShadow = "0px 0px 10px rgba(255, 255, 255, 1)";
getEl('gameName').style.marginTop = '0px';
getEl('gameName').innerHTML = 'Eclipse Client';

let userPayload;
function handleStateChange(event) {
    var state;
    if (((state = event == null ? undefined : event.detail) == null ? undefined : state.state) === "verified") {
        userPayload = event.detail.payload;
        document.getElementById("altcha").remove();
        enterGameButton.innerText = "Play";
        enterGameButton.classList.remove("disabled");
    }
}

let enterGameButton = getEl("enterGame");
window.addEventListener("load", () => {
    document.getElementById("altcha_checkbox").click();
    enterGameButton.innerText = "Verify";
    const altchaElement = document.getElementById("altcha");
    if (!(altchaElement == null)) {
        altchaElement.addEventListener("statechange", handleStateChange);
    }
});

let founda = false;
let testMode = window.location.hostname == "127.0.0.1";

let scriptTags = document.getElementsByTagName("script");
for (let i = 0; i < scriptTags.length; i++) {
    if (scriptTags[i].src.includes("index-f3a4c1ad.js") && !founda) {
        scriptTags[i].remove();
        founda = true;
        break;
    }
}

let newFont = document.createElement("link");
newFont.rel = "stylesheet";
newFont.href = "https://fonts.googleapis.com/css?family=Ubuntu:700";
newFont.type = "text/css";
document.body.append(newFont);

let min = document.createElement("script");
min.src = "https://rawgit.com/kawanet/msgpack-lite/master/dist/msgpack.min.js";
document.body.append(min);
window.oncontextmenu = function() {
    //return false;
};
let autoOneFrameToggled = false;

const {
    awas, // sin
    cawas, // cos
    sawas, // sqrt

} = Math;
let config = window.config;

// CLIENT:
config.clientSendRate = 9; // Aim Packet Send Rate
config.serverUpdateRate = 9;

// UI:
config.deathFadeout = 0;

config.playerCapacity = 9999;

// CHECK IN SANDBOX:
config.isSandbox = window.location.hostname == "sandbox.moomoo.io";
// CHECK IN SANDBOX:
config.isNormal = window.location.hostname == "moomoo.io";
// CUSTOMIZATION:
config.skinColors = ["#bf8f54", "#cbb091", "#896c4b",
                     "#fadadc", "#ececec", "#c37373", "#4c4c4c", "#ecaff7", "#738cc3",
                     "#8bc373", "#91b2db"
                    ];
config.weaponVariants = [{
    id: 0,
    src: "",
    xp: 0,
    val: 1,
}, {
    id: 1,
    src: "_g",
    xp: 3000,
    val: 1.1,
}, {
    id: 2,
    src: "_d",
    xp: 7000,
    val: 1.18,
}, {
    id: 3,
    src: "_r",
    poison: true,
    xp: 12000,
    val: 1.18,
}, {
    id: 4,
    src: "_e",
    poison: true,
    heal: true,
    xp: 24000,
    val: 1.18,
}];

// VISUAL:
config.anotherVisual = true;
config.useWebGl = false;
config.resetRender = true;

function waitTime(timeout) {
    return new Promise((done) => {
        setTimeout(() => {
            done();
        }, timeout);
    });
}

// STORAGE:
let canStore;
if (typeof(Storage) !== "undefined") {
    canStore = true;
}

function saveVal(name, val) {
    if (canStore) localStorage.setItem(name, val);
}

function deleteVal(name) {
    if (canStore) localStorage.removeItem(name);
}

function getSavedVal(name) {
    if (canStore) return localStorage.getItem(name);
    return null;
}

// CONFIGS:
let gC = function(a, b) {
    try {
        let res = JSON.parse(getSavedVal(a));
        if (typeof res === "object") {
            return b;
        } else {
            return res;
        }
    } catch (e) {
        alert("dieskid");
        return b;
    }
};

function setCommands() {
    return {
        "help": {
            desc: "Show Commands",
            action: function(message) {
                for (let cmds in commands) {
                    addMenuChText("/" + cmds, commands[cmds].desc, "lime", 1);
                }
            }
        },
        "clear": {
            desc: "Clear Chats",
            action: function(message) {
                resetMenuChText();
            }
        },
        "debug": {
            desc: "Debug Mod For Development",
            action: function(message) {
                addDeadPlayer(player);
                addMenuChText("Debug", "Done", "#99ee99", 1);
            }
        },
        "play": {
            desc: "Play Music ( /play [link] )",
            action: function(message) {
                let link = message.split(" ");
                if (link[1]) {
                    let audio = new Audio(link[1]);
                    audio.play();
                } else {
                    addMenuChText("Warn", "Enter Link ( /play [link] )", "#99ee99", 1);
                }
            }
        },
        "bye": {
            desc: "Leave Game",
            action: function(message) {
                window.leave();
            }
        },
    };
}

let commands = setCommands();
let configs = {
    healingBeta: true,
    doAntiPush: true,
    AutoMatePlace: true,
    antiBull: true,
    autoSync: true,
    isNormal: false,
    autoOneFrame: true,
    secondaryOnCounter: true,
    attackDir: false,
    showDir: false,
    spin: false,
    attackDir: false,
    showDir: false,
    SafeAntiSpikeTick: true,
    autoPlace: true,
    autoPlaceOnReplace: true,
    autoReplace: true,
    autoPrePlace: true,
    dualAngles: true,
    noDir: true,
};

window.updateShowingConfig = function() {
    let config = document.getElementById("config").value;
    document.getElementById("configCheck").checked = configs[config];
};
window.updateConfig = function() {
    let config = document.getElementById("config").value;
    configs[config] = !configs[config];
};

for (let cF in configs) {
    configs[cF] = gC(cF, configs[cF]);
};

// MENU FUNCTIONS:
window.changeMenu = function() {};
window.debug = function() {};
window.freezePlayer = function() {};
window.wasdMode = function() {};

// PAGE 1:
window.startGrind = function() {};

// PAGE 3:
window.resBuild = function() {};
window.toggleVisual = function() {};

// SOME FUNCTIONS:
window.leave = function() {};

// nah hahahahahhh why good ping
window.ping = 0;

class HtmlAction {
    constructor(element) {
        this.element = element;
    };
    add(code) {
        if (!this.element) return undefined;
        this.element.innerHTML += code;
    };
    newLine(amount) {
        let result = `<br>`;
        if (amount > 0) {
            result = ``;
            for (let i = 0; i < amount; i++) {
                result += `<br>`;
            }
        }
        this.add(result);
    };
    checkBox(setting) {
        let newCheck = `<input type = "checkbox"`;
        setting.id && (newCheck += ` id = ${setting.id}`);
        setting.style && (newCheck += ` style = ${setting.style.replaceAll(" ", "")}`);
        setting.class && (newCheck += ` class = ${setting.class}`);
        setting.checked && (newCheck += ` checked`);
        setting.onclick && (newCheck += ` onclick = ${setting.onclick}`);
        newCheck += `>`;
        this.add(newCheck);
    };
    text(setting) {
        let newText = `<input type = "text"`;
        setting.id && (newText += ` id = ${setting.id}`);
        setting.style && (newText += ` style = ${setting.style.replaceAll(" ", "")}`);
        setting.class && (newText += ` class = ${setting.class}`);
        setting.size && (newText += ` size = ${setting.size}`);
        setting.maxLength && (newText += ` maxLength = ${setting.maxLength}`);
        setting.value && (newText += ` value = ${setting.value}`);
        setting.placeHolder && (newText += ` placeHolder = ${setting.placeHolder.replaceAll(" ", "&nbsp;")}`);
        newText += `>`;
        this.add(newText);
    };
    select(setting) {
        let newSelect = `<select`;
        setting.id && (newSelect += ` id = ${setting.id}`);
        setting.style && (newSelect += ` style = ${setting.style.replaceAll(" ", "")}`);
        setting.class && (newSelect += ` class = ${setting.class}`);
        newSelect += `>`;
        for (let options in setting.option) {
            newSelect += `<option value = ${setting.option[options].id}`
            setting.option[options].selected && (newSelect += ` selected`);
            newSelect += `>${options}</option>`;
        }
        newSelect += `</select>`;
        this.add(newSelect);
    };
    button(setting) {
        let newButton = `<button`;
        setting.id && (newButton += ` id = ${setting.id}`);
        setting.style && (newButton += ` style = ${setting.style.replaceAll(" ", "")}`);
        setting.class && (newButton += ` class = ${setting.class}`);
        setting.onclick && (newButton += ` onclick = ${setting.onclick}`);
        newButton += `>`;
        setting.innerHTML && (newButton += setting.innerHTML);
        newButton += `</button>`;
        this.add(newButton);
    };
    selectMenu(setting) {
        let newSelect = `<select`;
        if (!setting.id) {
            alert("please put id skid");
            return;
        }
        window[setting.id + "Func"] = function() {};
        setting.id && (newSelect += ` id = ${setting.id}`);
        setting.style && (newSelect += ` style = ${setting.style.replaceAll(" ", "")}`);
        setting.class && (newSelect += ` class = ${setting.class}`);
        newSelect += ` onchange = window.${setting.id + "Func"}()`;
        newSelect += `>`;
        let last;
        let i = 0;
        for (let options in setting.menu) {
            newSelect += `<option value = ${"option_" + options} id = ${"O_" + options}`;
            setting.menu[options] && (newSelect += ` checked`);
            newSelect += ` style = "color: ${setting.menu[options] ? "#000" : "#fff"}; background: ${setting.menu[options] ? "#8ecc51" : "#cc5151"};">${options}</option>`;
            i++;
        }
        newSelect += `</select>`;

        this.add(newSelect);

        i = 0;
        for (let options in setting.menu) {
            window[options + "Func"] = function() {
                setting.menu[options] = getEl("check_" + options).checked ? true : false;
                saveVal(options, setting.menu[options]);

                getEl("O_" + options).style.color = setting.menu[options] ? "#000" : "#fff";
                getEl("O_" + options).style.background = setting.menu[options] ? "#8ecc51" : "#cc5151";

                //getEl(setting.id).style.color = setting.menu[options] ? "#8ecc51" : "#cc5151";

            };
            this.checkBox({
                id: "check_" + options,
                style: `display: ${i == 0 ? "inline-block" : "none"};`,
                class: "checkB",
                onclick: `window.${options + "Func"}()`,
                checked: setting.menu[options]
            });
            i++;
        }

        last = "check_" + getEl(setting.id).value.split("_")[1];
        window[setting.id + "Func"] = function() {
            getEl(last).style.display = "none";
            last = "check_" + getEl(setting.id).value.split("_")[1];
            getEl(last).style.display = "inline-block";

            //getEl(setting.id).style.color = setting.menu[last.split("_")[1]] ? "#8ecc51" : "#fff";

        };
    };
};
class Html {
    constructor() {
        this.element = null;
        this.action = null;
        this.divElement = null;
        this.startDiv = function(setting, func) {

            let newDiv = document.createElement("div");
            setting.id && (newDiv.id = setting.id);
            setting.style && (newDiv.style = setting.style);
            setting.class && (newDiv.className = setting.class);
            this.element.appendChild(newDiv);
            this.divElement = newDiv;

            let addRes = new HtmlAction(newDiv);
            typeof func == "function" && func(addRes);

        };
        this.addDiv = function(setting, func) {

            let newDiv = document.createElement("div");
            setting.id && (newDiv.id = setting.id);
            setting.style && (newDiv.style = setting.style);
            setting.class && (newDiv.className = setting.class);
            setting.appendID && getEl(setting.appendID).appendChild(newDiv);
            this.divElement = newDiv;

            let addRes = new HtmlAction(newDiv);
            typeof func == "function" && func(addRes);

        };
    };
    set(id) {
        this.element = getEl(id);
        this.action = new HtmlAction(this.element);
    };
    resetHTML(text) {
        if (text) {
            this.element.innerHTML = ``;
        } else {
            this.element.innerHTML = ``;
        }
    };
    setStyle(style) {
        this.element.style = style;
    };
    setCSS(style) {
        this.action.add(`<style>` + style + `</style>`);
    };
};
const HTML = new class {
    newLine(amount) {
        let text = ``;
        for (let i = 0; i < amount; i++) {
            text += `<br>`;
        }
        return text;
    }

    line() {
        return `<hr>`;
    }

    text(id, value, size, length) {
        return `<input type = "text" id = ${id} size = ${size} value = ${value} maxlength = ${length}>`;
    }

    checkBox(id, name, checked, rl) {
        return `<label class="switch">
        ${rl ? name + ` ` : ``} <input class="checkB" type = "checkbox" ${checked ? `checked` : ``} id = ${id}> ${rl ? `` : ` ` + name} <span class="slider round"></span>
        </label>`;
    }

    button(id, name, onclick, classs) {
        return `<button class = ${classs} id = ${id} onclick = ${onclick} style = "background: rgb(0,0,0,0.3); text-align: center; font-size: 15px; padding: 6px; color: #fff;">${name}</button>`;
    }

    select(id, selects) {
        let text = `<select class="select" id = ${id}>`;
        selects.forEach((e,i)=>{
            text += `<option value = ${e.value} ${e.selected ? ` selected` : ``}>${e.name}</option>`;
            if (i == selects.length - 1) {
                text += `</select>`;
            }
        }
                       );
        return text;
    }

    modChange(id, selects) {
        console.log("test");
    }

    hotkey(id, value, size, length) {
        return `<input type = "text" id = ${id} size = ${size} value = ${value} maxlength = ${length}> <input type = "checkbox" checked id = ${id + "k"}>`;
    }

    addCheckBox(id = "", isChecked = false, onclick = "! function(){}()") {
        return `<label class="switch"> <input type = "checkbox" id = "${id}" ${isChecked ? "checked" : ""} onclick = "${onclick}"> <span class="slider round"></span></label>`;
    }

    addOptions(id = "", selected = "", options = {}, oninput = "! function(){}()") {
        let optionsText = "";
        for (let i in options) {
            optionsText +=
                `<option ${i == selected ? "selected" : ""} value = "${i}">${i}</option>`;
        }
        return `<select class="select" id = "${id}" oninput = "${oninput}">${optionsText}</select>`;
    }

    values(id, min, max, cur) {
        return `<input type="range" min="${min}" max="${max}" value="${cur}" class="slider" id="${id}">`;
    }
}();
var datatitle;
class DataMenu {
    static init() {
        datatitle = document.createElement('div');
        var mainf = document.createElement('div');

        return mainf.style = `font-size: 25px; color: rgb(255, 255, 255);`,
            datatitle.innerHTML = `<div id='helpText' style='font-size: 28px; color: rgb(255, 255, 255);'>Data</div>`,
            datatitle.appendChild(mainf), {
            add: function(e) {
                let object = document.createElement(e.tag || `span`);
                return object.id = e.id || ``,
                    object.style = e.style || ``,
                    object.innerHTML = e.html || ``,
                    mainf.appendChild(object), object;
            },
            prepend: function (e) {
                e.appendChild(datatitle);
            },
            writeStyle: function (e) {
                datatitle.style = e;
            },
        }
    }
}
var datamenu = DataMenu.init();
datamenu.writeStyle(`
padding: 10px;
border-radius: 15px;
background-color: rgba(0, 0, 0, 0.25);
position: absolute;
left: 20px;
top: 20px;
font-size: 28px;
border-radius: 15px;
box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
width: 200px;
height: 105px;
`);

datamenu.add({
    tag: 'div',
    id: 'database',
    html: `No Information`
});
datamenu.prepend(document.body);
let modMenu = document.createElement("div");
modMenu.id = "modMenu";
document.body.append(modMenu);
modMenu.style = `
    display: none;
    padding: 10px;
    border-radius: 15px;
    background-color: rgba(0, 0, 0, 0.5);
    position: absolute;
    inset: 0px;
    width: 375px;
    min-height: min-content;
    max-height: 440px;
    z-index: 999;
    margin: auto;
`;
document.body.append(modMenu);

function getTabId(el) {
    return el.id == "tHome" ? "homeTab" : el.id == "t1" ? "miscTab" : el.id == "t2" ? "renderTab" : el.id == "t3" ? "combatTab" : "homeTab";
}

function changeEtcfrrrrrrrrrrr0917237891x828xjiwaskdaslmfaofmalfaiosf() {
    getEl("homeTab").style.display = "none";
    getEl("miscTab").style.display = "none";
    getEl("renderTab").style.display = "none";
    getEl("combatTab").style.display = "none";

    getEl("tHome").style.color = "#fff";
    getEl("tHome").style.backgroundColor = "rgb(0, 0, 0, .3)";
    getEl("tHome").style.boxShadow = "none";
    for (let i = 1; i <= 3; i++) {
        getEl("t" + i).style.color = "#fff";
        getEl("t" + i).style.backgroundColor = "rgb(0, 0, 0, .3)";
        getEl("t" + i).style.boxShadow = "none";
    }
}

function changeDisp(el) {
    changeEtcfrrrrrrrrrrr0917237891x828xjiwaskdaslmfaofmalfaiosf();
    getEl(el.id).style.color = "#000";
    getEl(el.id).style.backgroundColor = "#44b090";
    getEl(el.id).style.boxShadow = "0px 0px 8px 5px #44b090";
    getEl(getTabId(el)).style.display = "block";
}

function updateHtml() {
    modMenu.innerHTML = `
<style>
    .menuCard, #modMenu, #leaderboard,
    #scoreDisplay, #stoneDisplay, #woodDisplay, #foodDisplay,
    #ageBar, #killCounter, .leaderHolder {
        background: rgba(15, 20, 35, 0.85) !important;
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid rgba(80, 180, 255, 0.3);
        box-shadow:
            0 8px 32px rgba(0, 0, 0, 0.6),
            0 0 20px rgba(80, 180, 255, 0.15) !important;
        border-radius: 18px;
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .menuCard:hover, #modMenu:hover, #leaderboard:hover,
    #scoreDisplay:hover, #stoneDisplay:hover, #woodDisplay:hover,
    #foodDisplay:hover, #ageBar:hover, #killCounter:hover,
    .leaderHolder:hover {
        transform: translateY(-8px) scale(1.03) !important;
        border-color: rgba(80, 180, 255, 0.6);
        box-shadow:
            0 20px 40px rgba(0, 0, 0, 0.7),
            0 0 30px rgba(80, 180, 255, 0.4) !important;
    }
    #negr, .menuButton, .tabchange, .select {
        background: linear-gradient(145deg, rgba(50, 70, 120, 0.95), rgba(20, 30, 60, 0.95));
        border: 1px solid rgba(100, 200, 255, 0.4);
        color: #e0f0ff !important;
        font-weight: 600;
        text-shadow: 0 1px 3px rgba(0,0,0,0.8);
        box-shadow:
            0 6px 15px rgba(0,0,0,0.5),
            inset 0 1px 0 rgba(255,255,255,0.15);
        border-radius: 14px;
        padding: 12px 24px;
        transition: all 0.3s ease;
    }

    #negr:hover, .menuButton:hover, .tabchange:hover, .select:hover {
        transform: translateY(-5px) scale(1.08);
        background: linear-gradient(145deg, rgba(70, 120, 200, 1), rgba(40, 70, 140, 1));
        border-color: #64c8ff;
        box-shadow:
            0 15px 30px rgba(0,0,0,0.6),
            0 0 25px rgba(100, 200, 255, 0.7);
    }
    #nameInput, .input {
        background: rgba(20, 25, 40, 0.9) !important;
        border: 1px solid rgba(80, 180, 255, 0.4);
        color: white !important;
        border-radius: 14px;
        padding: 12px 18px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.4);
        backdrop-filter: blur(8px);
        transition: all 0.3s;
    }

    #nameInput:focus, .input:focus {
        border-color: #64c8ff;
        box-shadow: 0 0 20px rgba(100, 200, 255, 0.6);
        outline: none;
    }
    .logoText {
        font-size: 44px !important;
        font-weight: 900;
        background: linear-gradient(90deg, #64c8ff, #ffffff, #4080ff);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-shadow: 0 0 30px rgba(100, 200, 255, 0.6);
        padding: 20px 50px !important;
        border-radius: 25px;
        background-color: rgba(15, 20, 35, 0.7);
        border: 1px solid rgba(100, 200, 255, 0.3);
        box-shadow: 0 12px 35px rgba(0,0,0,0.6);
    }
    .switch {
        background-color: rgba(40,40,40,0.7) !important;
    }
    .slider:before {
        background: linear-gradient(145deg, #ffffff, #c0e0ff);
        box-shadow: 0 3px 8px rgba(0,0,0,0.4);
    }
    input:checked + .slider {
        background: linear-gradient(145deg, #4080ff, #2060c0);
    }
    .leaderHolder {
        background: rgba(25, 35, 60, 0.7);
        border-radius: 12px;
        border: 1px solid rgba(100, 200, 255, 0.2);
        padding: 8px 12px;
        margin: 6px 10px;
    }
    .menuCard::before, #modMenu::before {
        content: '';
        position: absolute;
        top: -2px; left: -2px; right: -2px; bottom: -2px;
        background: linear-gradient(45deg, #4080ff, #64c8ff, #4080ff);
        border-radius: 20px;
        z-index: -1;
        opacity: 0;
        transition: opacity 0.4s;
    }
    .menuCard:hover::before, #modMenu:hover::before {
        opacity: 0.35;
    }

    #gameCanvas { background-color: black; }
</style>

      <div id="helpText">
        <legend class="logoText">Eclipse Client</legend><br>

        <legend class="logoText" style="background-color: rgb(0, 0, 0, 0);">
          ${HTML.button("tHome", "Home", "", "tabchange")}
          ${HTML.button("t1", "Misc", "", "tabchange")}
          ${HTML.button("t3", "Combat", "", "tabchange")}
          ${HTML.button("t2", "Render", "", "tabchange")}
        </legend>

        <div style="font-size: 12px; overflow-y: scroll; height: 250px; color: white; text-align: center; line-height: 20px;">

          <hr style = "margin-bottom: 20px; width: 300px; border-radius: 20px;">

          <div id = "homeTab" style = "display: block">
              ${HTML.button("anVis", "Another Visual", "window.toggleVisual()", "tabchange")}
              ${HTML.button("debuged", "Debug", "window.debug()", "tabchange")}
              ${HTML.button("freezee", "Freeze", "window.freezePlayer()", "tabchange")}<br>

              <br>

              Happy Mod v7: ${HTML.checkBox("HappyModTroll", "", true)}<br>
              Kill Chat: ${HTML.checkBox("KillChat", "", false)}<br>
          </div>

          <div id = "miscTab" style = "display: none">
              Auto Grind: ${HTML.checkBox("weaponGrind", "", false)}<br>

              Configs ${HTML.addOptions("config", "", configs, `window.updateShowingConfig()`)}
              ${HTML.addCheckBox("configCheck", Object.values(configs)[0], `window.updateConfig()`)}<br>

              <br><br>

              Anti Bull: ${HTML.select("antiBullType", antiBullCfgs)}<br>
              Hats Change Type: ${HTML.select("HathchangerType", hatChTypeAEAEAEAEAEAE)}<br>

              Data Menu: ${HTML.checkBox("doHideDataMenu", "", false)}<br>

              <br><br>

              Songs (p): ${HTML.select("song", songstypessesese)}<br>
          </div>

          <div id = "combatTab" style = "display: none">
              Counter Insta: ${HTML.checkBox("CounterInsta", "", true)}<br>
              Simple Reverse Insta: ${HTML.checkBox("revTick", "", true)}<br>
              Spike Insta: ${HTML.checkBox("doSpikeOnReverse", "", false)}<br>
              One Shot Insta: ${HTML.checkBox("oneShotInsta", "", true)}<br>

              <br>

              Auto Push: ${HTML.checkBox("autoPush", "", true)}<br>
              Vel OneTick (toggle shif T): ${HTML.checkBox("VelocityOneTick", "", true)}<br>
              BoostSpikeType: ${HTML.select("BoostSpikeType", BoostSpike)}<br>
          </div>

          <div id = "renderTab" style = "display: none">
              Render Preplace: ${HTML.checkBox("preIndi", "", true)}<br>
              Render BuildHP: ${HTML.checkBox("buildHp", "", false)}<br>
              Render Morning Time: ${HTML.checkBox("morning", "", true)}<br>
              Render Grids: ${HTML.checkBox("grids", "", true)}<br>
          </div>
        </div>
      </div>

    `;
};

var antiBullCfgs = [
    { name: "Disable", value: "noab" },
    { name: "Hit SpikeGear", value: "abreload" },
    { name: "SpikeGear", value: "abalway" },
];

var BoostSpike = [
    { name: "Eveee", value: "Eveee" },
    { name: "Normal", value: "Normal" },
];

var hatChTypeAEAEAEAEAEAE = [
    { name: "Normal", value: "Eclipse" },
    { name: "Spike Gear", value: "SpikeGear" },
    { name: "Samurai", value: "Samurai" },
];

var songstypessesese = [
    { name: "Dead Of Night", value: "0" },
    { name: "none", value: "1" },
    { name: "none", value: "2" },
];

updateHtml();

changeDisp(getEl("tHome")); // i just lazy do new ;oo
let menuPagesRate = ["tHome", "t1", "t2", "t3"];
menuPagesRate.forEach(id => {
    let el = getEl(id);
    el.onclick = function() {
        changeDisp(this);
    };
});

let buluredCanvas = false;
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        $("#modMenu").toggle();
        buluredCanvas = !buluredCanvas
        if (buluredCanvas) {
            $("#gameCanvas").css({
                "filter": "blur(8px)",
                "-webkit-filter": "blur(8px)",
            });
        } else {
            $("#gameCanvas").css({
                "filter": "",
                "-webkit-filter": "",
            });
        }
    }
});
let song1 = new Audio("https://ncs.io/track/download/3db2d7b2-fe13-4063-a618-a29eca83f45f");
let Songs = [song1];
let songC1 = {
    '0:03' : "Baby, this is do or die",
    '0:06' : "Feel it in my veins at night",
    '0:08' : "Emotional suicide",
    '0:11' : "You know it's an eye for eye",
    '0:13' : "I didn't wanna walk,",
    '0:15' : "didn't wanna walk the plank",
    '0:19' : "No,",
    '0:20' : "but then ready or not,",
    '0:21' : "then ready or not it came",
    '0:23' : "Like the thunder,",
    '0:24' : "I was on my way to going under",
    '0:26' : "(under)",
    '0:27' : "Swimming in the pain,",
    '0:28' : "yeah, I was covered",
    '0:30' : "In a tidal wave,",
    '0:32' : "in a tidal wave",
    '0:33' : "But I'm a fighter",
    '0:34' : "(hu)",
    '0:35' : "Tryna take me down,",
    '0:36' : "I'm going higher",
    '0:37' : "(I'm higher)",
    '0:38' : "Baby, you've been playing",
    '0:39' : "with some fire",
    '0:40' : "(you've playing)",
    '0:41' : "You've been playing with fire",
    '0:42' : "(playing with fire)",
    '0:43' : "One day you will see",
    '0:46' : "What you made of me",
    '0:48' : "Found my inner beast",
    '0:49' : "(inner beast)",
    '0:51' : "You'll watch it release",
    '0:53' : "In the dead of night",
    '1:05' : "In the dead of night",
    '1:10' : "In the dead of",
    '1:14' : "  Night  ",
    '1:18' : "Baby, when it's do or die",
    '1:19' : "(when it's do or die)",
    '1:20' : "You know it's an eye for eye",
    '1:22' : "(it's an eye for eye)",
    '1:23' : "Feel the energy align",
    '1:25' : "(oh)",
    '1:26' : "In the dead of night",
    '1:27' : "you've been playing with fire",
    '1:28' : "In the dead of night,",
    '1:31' : "In the dead of night",
    '1:33' : "(in the dead of night)",
    '1:37' : "In the dead of night",
    '1:50' : "You can save your alibi",
    '1:52' : "I already know you lied",
    '1:55' : "Oh no, no don't even try",
    '1:57' : "(don't even try)",
    '1:58' : "Watch the flame in me ignite",
    '2:00' : "You didn't wanna walk,",
    '2:02' : "didn't wanna walk the plank",
    '2:05' : "But then ready or not,",
    '2:07' : "then ready or not it came",
    '2:09' : "Baby, it was dark",
    '2:10' : "It was hard to see",
    '2:12' : "And that's when a spark",
    '2:14' : "lit inside of me,",
    '2:16' : " Oh ",
    '2:17' : "I was lost in reverie,",
    '2:19' : "Oh-oh, oh-oh",
    '2:22' : "One day you will see",
    '2:23' : "(you will see)",
    '2:24' : "What you made of me",
    '2:27' : "What's inside of me",
    '2:28' : "(what's inside of me)",
    '2:30' : "Oh, one day you will see",
    '2:35' : "I found my inner beast",
    '2:37' : "(I found my inner beast)",
    '2:38' : "You'll watch it release",
    '2:41' : "In the dead of night, oh",
    '2:51' : "In the dead of night",
    '2:55' : "(In the dead of)",
    '2:57' : "In the dead of night, oh-woah",
    '3:03' : "In the dead of night",
    '3:05' : "Baby, when it's do or die",
    '3:07' : "You know it's an eye for eye",
    '3:10' : "Feel the energy align",
    '3:12' : "In the dead of night",
    '3:16' : " In the dead of night ",
    '3:18' : "  In the dead of night  ",
    '3:21' : "   In the dead of night   ",
    '3:23' : "    In the dead of night    ",
    '3:26' : "And one day you will see",
    '3:28' : "What you made of me",
    '3:31' : "What's inside of me",
    '3:35' : "Oh, and one day you will see",
    '3:39' : "I found my inner beast",
    '3:42' : "And you'll watch it release",
}
let songC = [songC1];

let HTML1 = new Html();

let menuChatDiv = document.createElement("div");
menuChatDiv.id = "menuChatDiv";
document.body.appendChild(menuChatDiv);
HTML1.set("menuChatDiv");
HTML1.setStyle(`
            position: absolute;
            display: none;
            left: 165px;
            top: 405px;
          //  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.65);
            `);
HTML1.resetHTML();
HTML1.setCSS(`
                    .chDiv {
    color: #fff;
    padding: 10px;
    height: 217px;
    background-color: rgba(0, 0, 0, 0);
    font-family: "HammerSmith One", monospace;
 //   border-radius: 15px;
//    box-shadow: black 1px 2px 19px;
//backdrop-filter: blur(3px);

}
.chMainDiv {
    font-family: "Ubuntu";
    font-size: 16px;
    max-height: 215px;
    overflow-y: scroll;
    scrollbar-width: thin;
    scrollbar-color: rgba(0, 0, 0, 0) rgba(0, 0, 0, 0);
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    overflow-x: hidden;
}
.chMainDiv::-webkit-scrollbar {
    width: 8px;
}
.chMainDiv::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.5);
}
.chMainDiv::-webkit-scrollbar-thumb:hover {
    background-color: rgba(0, 0, 0, 0.7);
}
.chMainBox {
display:none;
     position: absolute;
    left: 10px;
    bottom: 10px;
    width: 380px;
    height: 25px;
    background-color: rgba(255, 255, 255, 0);
    border-radius: 5px;
    color: rgba(255, 255, 255, 0.75);
    font-family: "HammerSmith One";
    font-size: 12px;
}
            `);
HTML1.startDiv({
    id: "mChDiv",
    class: "chDiv"
}, (html) => {
    HTML1.addDiv({
        id: "mChMain",
        class: "chMainDiv",
        appendID: "mChDiv"
    }, (html) => {});
    html.text({
        id: "mChBox",
        class: "chMainBox",
        //  placeHolder: `To chat click here or press "Enter" key`
    });
});

let menuChats = getEl("mChMain");
let menuChatBox = getEl("mChBox");
let menuCBFocus = false;
let menuChCounts = 0;

menuChatBox.value = "";
menuChatBox.addEventListener("focus", () => {
    menuCBFocus = true;
});
menuChatBox.addEventListener("blur", () => {
    menuCBFocus = false;
});

function addMenuChText(name, message, color, noTimer) {
    HTML1.set("menuChatDiv");
    color = color || "white";
    let time = new Date();
    let min = time.getMinutes();
    let hour = time.getHours();
    let text = ``;
    if (!noTimer) text += `${(hour < 10 ? '0' : '') + hour}:${(min < 10 ? '0' : '') + min}`;
    if (name) text += `${(!noTimer ? " - " : "") + name}`;
    if (message) text += `${(name ? ": " : !noTimer ? " - " : "") + message}\n`;
    text = `<plaintext>${text}`;
    HTML1.addDiv({ id: "menuChDisp", style: `color: ${color}`, appendID: "mChMain" }, (html) => {
        html.add(text);
    });
    menuChats.scrollTop = menuChats.scrollHeight;
    menuChCounts++;
}
function chch(name, message, color, noTimer) {
    HTML1.set("menuChatDiv");
    color = color || "white";
    let time = new Date();
    let text = ``;
    // if (name) text += `${(!noTimer ? " - " : "") + name}`;
    if (message) text += `${(name ? ": " : !noTimer ? "" : "") + message}\n`;
    HTML1.addDiv({ id: "menuChDisp", style: `color: ${color}`, appendID: "mChMain" }, (html) => {
        html.add(text);
    });
    menuChats.scrollTop = menuChats.scrollHeight;
    menuChCounts++;
}

function resetMenuChText() {
    menuChats.innerHTML = ``;
    menuChCounts = 0;
    addMenuChText(null, "", "white", 1) // chat history
}
resetMenuChText();

let menuIndex = 0;
let menus = ["menuMain", "menuConfig", "menuOther"];
window.changeMenu = function() {
    getEl(menus[menuIndex % menus.length]).style.display = "none";
    menuIndex++;
    getEl(menus[menuIndex % menus.length]).style.display = "block";
};
let hatELs = {
    6: true,
    7: true,
    40: true,
    22: true,
    15: true,
    26: true,
    31: true,
    11: true,
    12: true,
    20: true
};
let mStatus = document.createElement("div");
mStatus.id = "status";
getEl("gameUI").appendChild(mStatus);
HTML1.set("status");
HTML1.setStyle(`
            padding: 10px;
-webkit-border-radius: 4px;
-moz-border-radius: 4px;
border-radius: 4px;
width: 250px; height: 110px;
            display: block;
            position: absolute;
            color: #ddd;
            font: 15px Hammersmith One;
            bottom: 20px;
            left: 165px;
background-color: rgba(0, 0, 0, 0.5);
    transition: transform .7s;
    box-shadow: 0px 0px 5px 3px #000000;
            `);
HTML1.resetHTML();
HTML1.startDiv({
    id: "uehmod",
    style: "margin-top: -2px;",
    class: "sizing"
}, (html) => {
    html.add(`Ping: `);
    HTML1.addDiv({
        id: "pingFps",
        class: "mod",
        appendID: "uehmod"
    }, (html) => {
        html.add("None");
    });
    html.newLine();
    html.add(`Packet: `);
    HTML1.addDiv({
        id: "packetStatus",
        class: "mod",
        appendID: "uehmod"
    }, (html) => {
        html.add("None");
    });
    html.newLine();
    html.add(`Enemies: `);
    HTML1.addDiv({
        id: "EnemiesLength",
        class: "mod",
        appendID: "uehmod"
    }, (html) => {
        html.add("None");
    });
    html.newLine();
    html.add(`Turrets that can hit you: `);
    HTML1.addDiv({
        id: "TurretLength",
        class: "mod",
        appendID: "uehmod"
    }, (html) => {
        html.add("None");
    });
});
HTML1.setCSS(`
            .sizing {
                font-size: 15px;
            }
            .mod {
                font-size: 15px;
                display: inline-block;
                position: block;
            }
            .augh {
                    display: inline-block;
                    width: 30px;
                    border-radius: 5px;
                    height: 30px;
                    background-size: cover;
                    background-color: #fff;
                    margin-right: -2.5px;
                    opacity: 0.4;
                }
            </style>
            <div id = "hatdispdiv" style = "display: block; margin-top: 9px;">
                <div id = "hatdisp6" class = "augh" style = "background-image: url(https://moomoo.io/img/hats/hat_6.png);"></div>
                <div id = "hatdisp7" class = "augh" style = "background-image: url(https://moomoo.io/img/hats/hat_7.png);"></div>
                <div id = "hatdisp40" class = "augh" style = "background-image: url(https://moomoo.io/img/hats/hat_40.png);"></div>
                <div id = "hatdisp22" class = "augh" style = "background-image: url(https://moomoo.io/img/hats/hat_22.png);"></div>
                <div id = "hatdisp15" class = "augh" style = "background-image: url(https://moomoo.io/img/hats/hat_15.png);"></div>
                <div id = "hatdisp12" class = "augh" style = "background-image: url(https://moomoo.io/img/hats/hat_12.png);"></div>
                <div id = "hatdisp26" class = "augh" style = "background-image: url(https://moomoo.io/img/hats/hat_26.png);"></div>
                <div id = "hatdisp31" class = "augh" style = "background-image: url(https://moomoo.io/img/hats/hat_31.png);"></div>
            </div>
`);

let openMenu = false;

let WS = undefined;
let socketID = undefined;

let useWasd = false;
let secPacket = 0;
let secMax = 120;
let secTime = 1000;
let firstSend = {
    sec: false
};
let game = new class {
    constructor() {
        this.tick = 0;
        this.tickQueue = [];
        this.tickBase = function(set, tick) {
            if (this.tickQueue[this.tick + tick]) {
                this.tickQueue[this.tick + tick].push(set);
            } else {
                this.tickQueue[this.tick + tick] = [set];
            }
        };
        this.tickRate = (1000 / config.serverUpdateRate);
        this.tickSpeed = 0;
        this.lastTick = performance.now();
    }
    gameTick() {
        this.tick++;

        enemy = [];
        nears = [];
        near = [];

        this.tickSpeed = performance.now() - this.lastTick;
        this.lastTick = performance.now();
    }
    updateEnemies() {
        if (enemy.length) {
            near = enemy.sort(function(tmp1, tmp2) {
                return tmp1.dist2 - tmp2.dist2;
            })[0];

            nears.forEach((e)=>{
                if (e.primaryIndex != undefined && e.reloads[e.primaryIndex] == 0 && e.primaryIndex != undefined && e.reloads[e.primaryIndex] == 0) {
                    player.syncThreats++;
                }
            });
        } else {
            near = {};
        }
    }
    manageTickBase() {
        if (this.tickQueue[this.tick]) {
            this.tickQueue[this.tick].forEach((action) => {
                action();
            });
            delete this.tickQueue[this.tick];
        }
    }
}();
let modConsole = [];

let dontSend = false;
let fpsTimer = {
    last: 0,
    time: 0,
    ltime: 0
}
let lastMoveDir = undefined;
let lastsp = ["cc", 1, "__proto__"];

WebSocket.prototype.nsend = WebSocket.prototype.send;
WebSocket.prototype.send = function(message) {
    if (!WS) {
        WS = this;
        WS.addEventListener("message", function(msg) {
            getMessage(msg);
        });
        WS.addEventListener("close", (event) => {
            if (event.code == 4001) {
                window.location.reload();
            }
        });
    }
    if (WS == this) {
        dontSend = false;

        // EXTRACT DATA ARRAY:
        let data = new Uint8Array(message);
        let parsed = window.msgpack.decode(data);
        let type = parsed[0];
        data = parsed[1];

        // SEND MESSAGE:
        if (type == "6") {

            if (data[0]) {
                // ANTI PROFANITY:
                let profanity = ["cunt", "whore", "fuck", "shit", "faggot", "nigger", "nigga", "dick", "vagina", "minge", "cock", "rape", "cum", "sex", "tits", "penis", "clit", "pussy", "meatcurtain", "jizz", "prune", "douche", "wanker", "damn", "bitch", "dick", "fag", "bastard", ];
                let tmpString;
                profanity.forEach((profany) => {
                    if (data[0].indexOf(profany) > -1) {
                        tmpString = "";
                        for (let i = 0; i < profany.length; ++i) {
                            if (i == 1) {
                                tmpString += String.fromCharCode(0);
                            }
                            tmpString += profany[i];
                        }
                        let re = new RegExp(profany, "g");
                        data[0] = data[0].replace(re, tmpString);
                    }
                });

                // FIX CHAT:
                data[0] = data[0].slice(0, 30);
            }

        } else if (type == "L") {
            // MAKE SAME CLAN:
            data[0] = data[0] + (String.fromCharCode(0).repeat(7));
            data[0] = data[0].slice(0, 7);
        } else if (type == "M") {
            // APPLY CYAN COLOR:
            data[0].name = data[0].name == "" ? "ZylexOriginal" : data[0].name;
            data[0].moofoll = true;
            data[0].skin = data[0].skin == 10 ? "__proto__" : data[0].skin;
            lastsp = [data[0].name, data[0].moofoll, data[0].skin];
        } else if (type == "D") {
            if ((my.lastDir == data[0]) || [null, undefined].includes(data[0])) {
                dontSend = true;
            } else {
                my.lastDir = data[0];
            }
        } else if (type == "F") {
            if (!data[2]) {
                dontSend = true;
            } else {
                if (![null, undefined].includes(data[1])) {
                    my.lastDir = data[1];
                }
            }
        } else if (type == "K") {
            if (!data[1]) {
                dontSend = true;
            }
        } else if (type == "S") {
            instaC.wait = !instaC.wait;
            dontSend = true;
        } else if (type == "9") {
            if (data[1]) {
                if (player.moveDir == data[0]) {
                    dontSend = true;
                }
                player.moveDir = data[0];
            } else {
                dontSend = true;
            }
        }
        if (!dontSend) {
            let binary = window.msgpack.encode([type, data]);
            this.nsend(binary);

            // START COUNT:
            if (!firstSend.sec) {
                firstSend.sec = true;
                setTimeout(() => {
                    firstSend.sec = false;
                    secPacket = 0;
                }, secTime);
            }

            secPacket++;
        }
    } else {
        this.nsend(message);
    }
}

function packet(type) {
    // EXTRACT DATA ARRAY:
    let data = Array.prototype.slice.call(arguments, 1);

    // SEND MESSAGE:
    let binary = window.msgpack.encode([type, data]);
    WS.send(binary);
}
function Send(type) {
    // EXTRACT DATA ARRAY:
    let data = Array.prototype.slice.call(arguments, 1);

    // SEND MESSAGE:
    let binary = window.msgpack.encode([type, data]);
    if (!type[0]) return // FOR DEBUG
    WS.send(binary);
}
function origPacket(type) {
    // EXTRACT DATA ARRAY:
    let data = Array.prototype.slice.call(arguments, 1);

    // SEND MESSAGE:
    let binary = window.msgpack.encode([type, data]);
    WS.nsend(binary);
}

window.leave = function() {
    origPacket("kys", {
        "frvr is so bad": true,
        "sidney is too good": true,
        "dev are too weak": true,
    });
};

//...lol
let io = {
    send: packet
};

function getMessage(message) {
    let data = new Uint8Array(message.data);
    let parsed = window.msgpack.decode(data);
    let type = parsed[0];
    data = parsed[1];
    let events = {
        A: setInitData, // id: setInitData,
        //B: disconnect,
        C: setupGame, // 1: setupGame,
        D: addPlayer, // 2: addPlayer,
        E: removePlayer, // 4: removePlayer,
        a: updatePlayers, // 33: updatePlayers,
        G: updateLeaderboard, // 5: updateLeaderboard,here
        H: loadGameObject, // 6: loadGameObject,
        I: loadAI, // a: loadAI,
        J: animateAI, // aa: animateAI,
        K: gatherAnimation, // 7: gatherAnimation,
        L: wiggleGameObject, // 8: wiggleGameObject,
        M: shootTurret, // sp: shootTurret,
        N: updatePlayerValue, // 9: updatePlayerValue,
        O: updateHealth, // h: updateHealth2,//here
        O: updateHealth2, // h: updateHealth2,//here
        P: killPlayer, // 11: killPlayer,
        Q: killObject, // 12: killObject,
        R: killObjects, // 13: killObjects,
        S: updateItemCounts, // 14: updateItemCounts,
        T: updateAge, // 15: updateAge,
        U: updateUpgrades, // 16: updateUpgrades,
        V: updateItems, // 17: updateItems,
        X: addProjectile, // 18: addProjectile,
        // Y: remProjectile, // 19: remProjectile,
        //Z: serverShutdownNotice,
        //0: addAlliance,
        //1: deleteAlliance,
        3: setPlayerTeam, // st: setPlayerTeam,
        4: setAlliancePlayers, // sa: setAlliancePlayers,
        5: updateStoreItems, // us: updateStoreItems,
        6: receiveChat, // ch: receiveChat,
        6: ChatSee,
        7: updateMinimap, // mm: updateMinimap,
        8: showText, // t: showText,
        9: pingMap, // p: pingMap,
        0: pingSocketResponse,
    };
    if (type == "io-init") {
        socketID = data[0];
    } else {
        if (events[type]) {
            events[type].apply(undefined, data);
        }
    }
}

// MATHS:
Math.lerpAngle = function(value1, value2, amount) {
    let difference = Math.abs(value2 - value1);
    if (difference > Math.PI) {
        if (value1 > value2) {
            value2 += Math.PI * 2;
        } else {
            value1 += Math.PI * 2;
        }
    }
    let value = value2 + ((value1 - value2) * amount);
    if (value >= 0 && value <= Math.PI * 2) return value;
    return value % (Math.PI * 2);
};

// REOUNDED RECTANGLE:
CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    if (r < 0)
        r = 0;
    this.beginPath();
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    this.closePath();
    return this;
};

// GLOBAL VALUES:
function resetMoveDir() {
    keys = {};
    io.send("e");
}

let ticks = {
    tick: 0,
    delay: 0,
    time: [],
    manage: [],
};
let ais = [];
let players = [];
let alliances = [];
let alliancePlayers = [];
let allianceNotifications = [];
let gameObjects = [];
let closeObjects = [];
let liztobj = [];
let projectiles = [];
let deadPlayers = [];

let player;
let playerSID;
let tmpObj;

let enemy = [];
let hatLoop = false;
let loopIndex = 0;
let loopHats = [51, 50, 28, 29, 30, 36, 37, 38, 44, 35, 42, 43, 49];
let nears = [];
let near = {
    enemys: [],
    enemy: [],
    nears: [],
    aim: undefined,
    dist: undefined
}
let nmalHat = 0;
let nearSpike;
let track = {
    hits: {
        waitHit: 0,
    },
    auto: {
        aim: false,
        revAim: false,
    },
    tick: {
        ageInsta: true,
        antiTick: 0,
        antiSync: false,
    },
    force: {
        soldierspike: false,
        soldier: false,
    },
    dist: 0,
    trapAim: 0,
    inTrap: false,
    replaced: false,
    antiTrapped: false,
    info: {},
    safePrimary: function (tmpObj) {
        return [0, 8].includes(tmpObj.primaryIndex);
    },
    safeSecondary: function (tmpObj) {
        return [10, 11, 14].includes(tmpObj.secondaryIndex);
    },
    lastDir: 0,
    enemy: [],
    nears: [],
    near: [],
    people: [],
    nearestEnemy: undefined,
    pushdata: {
        autoPush: false,
        pushData: {}
    },
}
let antiTurretSpam = false;
let my = {
    reloaded: false,
    waitHit: 0,
    autoAim: false,
    revAim: false,
    ageInsta: true,
    defaultHat: false,
    reSync: false,
    bullTick: 0,
    anti0Tick: 0,
    SpikeAim: false,
    canHat: true,
    canMove: true,
    FastAim: false,
    antiSync: false,
    BullAim: false,
    MillAim: false,
    waitItem: false,
    safePrimary: function(tmpObj) {
        return [0, 8].includes(tmpObj.primaryIndex);
    },
    safeSecondary: function(tmpObj) {
        return [10, 11, 14].includes(tmpObj.secondaryIndex);
    },
    lastDir: 0,
    autoPush: false,
    pushData: {}
}

// FIND OBJECTS BY ID/SID:
function findID(tmpObj, tmp) {
    return tmpObj.find((THIS) => THIS.id == tmp);
}

function findSID(tmpObj, tmp) {
    return tmpObj.find((THIS) => THIS.sid == tmp);
}

function findPlayerByID(id) {
    return findID(players, id);
}

function findPlayerBySID(sid) {
    return findSID(players, sid);
}

function findAIBySID(sid) {
    return findSID(ais, sid);
}

function findObjectBySid(sid) {
    return findSID(gameObjects, sid);
}

function findProjectileBySid(sid) {
    return findSID(gameObjects, sid);
}

let adCard = getEl("adCard");
adCard.remove();
let promoImageHolder = getEl("promoImgHolder");
promoImageHolder.remove();

let chatButton = getEl("chatButton");
chatButton.remove();
let gameCanvas = getEl("gameCanvas");
let mainContext = gameCanvas.getContext("2d");
let mapDisplay = getEl("mapDisplay");
let mapContext = mapDisplay.getContext("2d");
mapDisplay.width = 300;
mapDisplay.height = 300;
let storeMenu = getEl("storeMenu");
let storeHolder = getEl("storeHolder");
let upgradeHolder = getEl("upgradeHolder");
let upgradeCounter = getEl("upgradeCounter");
let chatBox = getEl("chatBox");
chatBox.autocomplete = "off";
chatBox.style.textAlign = "center";
chatBox.style.width = "18em";
let chatHolder = getEl("chatHolder");
let actionBar = getEl("actionBar");
let leaderboardData = getEl("leaderboardData");
let itemInfoHolder = getEl("itemInfoHolder");
let menuCardHolder = getEl("menuCardHolder");
let mainMenu = getEl("mainMenu");
$("#mainMenu").css({
    "background-color": "rgba(0, 0, 0, 0.35)",
    position: "absolute",
    width: "100%",
    height: "100%",
    "z-index": "10",
});
let diedText = getEl("diedText");
let screenWidth;
let screenHeight;
let maxScreenWidth = config.maxScreenWidth;
let maxScreenHeight = config.maxScreenHeight;
let pixelDensity = 1;
let delta;
let now;
let lastUpdate = performance.now();
let camX;
let camY;
let tmpDir;
let mouseX = 0;
let mouseY = 0;
let allianceMenu = getEl("allianceMenu");
let waterMult = 1;
let waterPlus = 0;

let outlineColor = "#525252";
let darkOutlineColor = "#3d3f42";
let outlineWidth = 5.5;

let firstSetup = true;
let keys = {};
let moveKeys = {
    87: [0, -1],
    38: [0, -1],
    83: [0, 1],
    40: [0, 1],
    65: [-1, 0],
    37: [-1, 0],
    68: [1, 0],
    39: [1, 0],
};
let attackState = 0;
let inGame = false;

let macro = {};
let mills = {
    place: 0,
    placeSpawnPads: 0
};
let lastDir;

let lastLeaderboardData = [];

// ON LOAD:
let inWindow = true;
window.onblur = function() {
    inWindow = false;
};
window.onfocus = function() {
    inWindow = true;
    if (player && player.alive) {
        // resetMoveDir();
    }
};
let ms = {
    avg: 0,
    max: 0,
    min: 0,
    delay: 0
}
function pingSocketResponse() {
    let pingTime = window.pingTime;
    const pingDisplay = document.getElementById("pingDisplay")
    pingDisplay.innerText = "";
    if (pingTime > ms.max || isNaN(ms.max)) {
        ms.max = pingTime;
    }
    if (pingTime < ms.min || isNaN(ms.min)) {
        ms.min = pingTime;
    }

    // if (pingTime >= 90) {
    //     doAutoQ = true;
    // } else {
    //     doAutoQ = false;
    // }
}

/** CLASS CODES */
let profanityList = [];
class Utils {
    constructor() {

        // MATH UTILS:
        let mathABS = Math.abs,
            mathCOS = Math.cos,
            mathSIN = Math.sin,
            mathPOW = Math.pow,
            mathSQRT = Math.sqrt,
            mathATAN2 = Math.atan2,
            mathPI = Math.PI;

        let _this = this;

        // GLOBAL UTILS:
        this.round = function(n, v) {
            return Math.round(n * v) / v;
        };
        this.toRad = function(angle) {
            return angle * (mathPI / 180);
        };
        this.toAng = function(radian) {
            return radian / (mathPI / 180);
        };
        this.randInt = function(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };
        this.randFloat = function(min, max) {
            return Math.random() * (max - min + 1) + min;
        };
        this.lerp = function(value1, value2, amount) {
            return value1 + (value2 - value1) * amount;
        };
        this.decel = function(val, cel) {
            if (val > 0)
                val = Math.max(0, val - cel);
            else if (val < 0)
                val = Math.min(0, val + cel);
            return val;
        };
        this.getDistance = function(x1, y1, x2, y2) {
            return mathSQRT((x2 -= x1) * x2 + (y2 -= y1) * y2);
        };
        this.getDist = function(tmp1, tmp2, type1, type2) {
            let tmpXY1 = {
                x: type1 == 0 ? tmp1.x : type1 == 1 ? tmp1.x1 : type1 == 2 ? tmp1.x2 : type1 == 3 && tmp1.x3,
                y: type1 == 0 ? tmp1.y : type1 == 1 ? tmp1.y1 : type1 == 2 ? tmp1.y2 : type1 == 3 && tmp1.y3,
            };
            let tmpXY2 = {
                x: type2 == 0 ? tmp2.x : type2 == 1 ? tmp2.x1 : type2 == 2 ? tmp2.x2 : type2 == 3 && tmp2.x3,
                y: type2 == 0 ? tmp2.y : type2 == 1 ? tmp2.y1 : type2 == 2 ? tmp2.y2 : type2 == 3 && tmp2.y3,
            };
            return mathSQRT((tmpXY2.x -= tmpXY1.x) * tmpXY2.x + (tmpXY2.y -= tmpXY1.y) * tmpXY2.y);
        };
        this.getDirection = function(x1, y1, x2, y2) {
            return mathATAN2(y1 - y2, x1 - x2);
        };
        this.getDirect = function(tmp1, tmp2, type1, type2) {
            let tmpXY1 = {
                x: type1 == 0 ? tmp1.x : type1 == 1 ? tmp1.x1 : type1 == 2 ? tmp1.x2 : type1 == 3 && tmp1.x3,
                y: type1 == 0 ? tmp1.y : type1 == 1 ? tmp1.y1 : type1 == 2 ? tmp1.y2 : type1 == 3 && tmp1.y3,
            };
            let tmpXY2 = {
                x: type2 == 0 ? tmp2.x : type2 == 1 ? tmp2.x1 : type2 == 2 ? tmp2.x2 : type2 == 3 && tmp2.x3,
                y: type2 == 0 ? tmp2.y : type2 == 1 ? tmp2.y1 : type2 == 2 ? tmp2.y2 : type2 == 3 && tmp2.y3,
            };
            return mathATAN2(tmpXY1.y - tmpXY2.y, tmpXY1.x - tmpXY2.x);
        };
        this.getAngle = function (pointA, pointB) {
            return Math.atan2(pointB.y - pointA.y, pointB.x - pointA.x);
        };
        this.getAngleDist = function(a, b) {
            let p = mathABS(b - a) % (mathPI * 2);
            return (p > mathPI ? (mathPI * 2) - p : p);
        };
        this.isNumber = function(n) {
            return (typeof n == "number" && !isNaN(n) && isFinite(n));
        };
        this.isString = function(s) {
            return (s && typeof s == "string");
        };
        this.kFormat = function(num) {
            return num > 999 ? (num / 1000).toFixed(1) + "k" : num;
        };
        this.sFormat = function(num) {
            let fixs = [{
                num: 1e3,
                string: "k"
            },
                        {
                            num: 1e6,
                            string: "m"
                        },
                        {
                            num: 1e9,
                            string: "b"
                        },
                        {
                            num: 1e12,
                            string: "q"
                        }
                       ].reverse();
            let sp = fixs.find(v => num >= v.num);
            if (!sp) return num;
            return (num / sp.num).toFixed(1) + sp.string;
        };
        this.capitalizeFirst = function(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        };
        this.fixTo = function(n, v) {
            return parseFloat(n.toFixed(v));
        };
        this.sortByPoints = function(a, b) {
            return parseFloat(b.points) - parseFloat(a.points);
        };
        this.lineInRect = function(recX, recY, recX2, recY2, x1, y1, x2, y2) {
            let minX = x1;
            let maxX = x2;
            if (x1 > x2) {
                minX = x2;
                maxX = x1;
            }
            if (maxX > recX2)
                maxX = recX2;
            if (minX < recX)
                minX = recX;
            if (minX > maxX)
                return false;
            let minY = y1;
            let maxY = y2;
            let dx = x2 - x1;
            if (Math.abs(dx) > 0.0000001) {
                let a = (y2 - y1) / dx;
                let b = y1 - a * x1;
                minY = a * minX + b;
                maxY = a * maxX + b;
            }
            if (minY > maxY) {
                let tmp = maxY;
                maxY = minY;
                minY = tmp;
            }
            if (maxY > recY2)
                maxY = recY2;
            if (minY < recY)
                minY = recY;
            if (minY > maxY)
                return false;
            return true;
        };
        this.containsPoint = function(element, x, y) {
            let bounds = element.getBoundingClientRect();
            let left = bounds.left + window.scrollX;
            let top = bounds.top + window.scrollY;
            let width = bounds.width;
            let height = bounds.height;

            let insideHorizontal = x > left && x < left + width;
            let insideVertical = y > top && y < top + height;
            return insideHorizontal && insideVertical;
        };
        this.mousifyTouchEvent = function(event) {
            let touch = event.changedTouches[0];
            event.screenX = touch.screenX;
            event.screenY = touch.screenY;
            event.clientX = touch.clientX;
            event.clientY = touch.clientY;
            event.pageX = touch.pageX;
            event.pageY = touch.pageY;
        };
        this.hookTouchEvents = function(element, skipPrevent) {
            let preventDefault = !skipPrevent;
            let isHovering = false;
            // let passive = window.Modernizr.passiveeventlisteners ? {passive: true} : false;
            let passive = false;
            element.addEventListener("touchstart", this.checkTrusted(touchStart), passive);
            element.addEventListener("touchmove", this.checkTrusted(touchMove), passive);
            element.addEventListener("touchend", this.checkTrusted(touchEnd), passive);
            element.addEventListener("touchcancel", this.checkTrusted(touchEnd), passive);
            element.addEventListener("touchleave", this.checkTrusted(touchEnd), passive);

            function touchStart(e) {
                _this.mousifyTouchEvent(e);
                window.setUsingTouch(true);
                if (preventDefault) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                if (element.onmouseover)
                    element.onmouseover(e);
                isHovering = true;
            }

            function touchMove(e) {
                _this.mousifyTouchEvent(e);
                window.setUsingTouch(true);
                if (preventDefault) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                if (_this.containsPoint(element, e.pageX, e.pageY)) {
                    if (!isHovering) {
                        if (element.onmouseover)
                            element.onmouseover(e);
                        isHovering = true;
                    }
                } else {
                    if (isHovering) {
                        if (element.onmouseout)
                            element.onmouseout(e);
                        isHovering = false;
                    }
                }
            }

            function touchEnd(e) {
                _this.mousifyTouchEvent(e);
                window.setUsingTouch(true);
                if (preventDefault) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                if (isHovering) {
                    if (element.onclick)
                        element.onclick(e);
                    if (element.onmouseout)
                        element.onmouseout(e);
                    isHovering = false;
                }
            }
        };
        this.removeAllChildren = function(element) {
            while (element.hasChildNodes()) {
                element.removeChild(element.lastChild);
            }
        };
        this.generateElement = function(config) {
            let element = document.createElement(config.tag || "div");

            function bind(configValue, elementValue) {
                if (config[configValue])
                    element[elementValue] = config[configValue];
            }
            bind("text", "textContent");
            bind("html", "innerHTML");
            bind("class", "className");
            for (let key in config) {
                switch (key) {
                    case "tag":
                    case "text":
                    case "html":
                    case "class":
                    case "style":
                    case "hookTouch":
                    case "parent":
                    case "children":
                        continue;
                    default:
                        break;
                }
                element[key] = config[key];
            }
            if (element.onclick)
                element.onclick = this.checkTrusted(element.onclick);
            if (element.onmouseover)
                element.onmouseover = this.checkTrusted(element.onmouseover);
            if (element.onmouseout)
                element.onmouseout = this.checkTrusted(element.onmouseout);
            if (config.style) {
                element.style.cssText = config.style;
            }
            if (config.hookTouch) {
                this.hookTouchEvents(element);
            }
            if (config.parent) {
                config.parent.appendChild(element);
            }
            if (config.children) {
                for (let i = 0; i < config.children.length; i++) {
                    element.appendChild(config.children[i]);
                }
            }
            return element;
        };
        this.checkTrusted = function(callback) {
            return function(ev) {
                if (ev && ev instanceof Event && (ev && typeof ev.isTrusted == "boolean" ? ev.isTrusted : true)) {
                    callback(ev);
                } else {
                    //console.error("Event is not trusted.", ev);
                }
            };
        };
        this.randomString = function(length) {
            let text = "";
            let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for (let i = 0; i < length; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            return text;
        };
        this.countInArray = function(array, val) {
            let count = 0;
            for (let i = 0; i < array.length; i++) {
                if (array[i] === val) count++;
            }
            return count;
        };
        this.hexToRgb = function(hex) {
            return hex.slice(1).match(/.{1,2}/g).map(g => parseInt(g, 16));
        };
        this.getRgb = function(r, g, b) {
            return [r / 255, g / 255, b / 255].join(", ");
        };
    }
};
class Animtext {
    // ANIMATED TEXT:
    constructor() {
        this.init = function (x, y, scale, speed, life, text, color) {
            this.x = x;
            this.y = y;
            this.color = color;
            this.scale = scale;
            this.startScale = this.scale;
            this.maxScale = scale * 1.5;
            this.scaleSpeed = 0.7;
            this.speed = speed;
            this.life = life;
            this.text = text;
            this.acc = 1;
            this.alpha = 0;
            this.maxLife = life;
            this.ranX = UTILS.randFloat(-1, 1);
        };
        this.update = function (delta) {
            if (this.life) {
                this.life -= delta;
                if (config.anotherVisual) {
                    this.y -= this.speed * delta * this.acc;
                    this.acc -= delta / (this.maxLife / 2.5);
                    if (this.life <= 8) {
                        if (this.alpha > 0) {
                            this.alpha = Math.max(0, this.alpha - delta / 12);
                        }
                    } else if (this.alpha < 1) {
                        this.alpha = Math.min(1, this.alpha + delta / 64);
                    }
                    this.x += this.ranX;
                } else {
                    this.y -= this.speed * delta;
                }
                this.scale += this.scaleSpeed * delta;
                if (this.scale >= this.maxScale) {
                    this.scale = this.maxScale;
                    this.scaleSpeed *= -1;
                } else if (this.scale <= this.startScale) {
                    this.scale = this.startScale;
                    this.scaleSpeed = 0;
                }
                if (this.life <= 0) {
                    this.life = 0;
                }
            }
        };
        this.render = function (ctxt, xOff, yOff, value) {
            ctxt.lineWidth = 0xa;
            ctxt.fillStyle = this.color;
            ctxt.font = this.scale + "px " + (config.anotherVisual ? "Hammersmith One" : "Hammersmith One");
            if (config.anotherVisual) {
                ctxt.globalAlpha = this.alpha;
                ctxt.strokeStyle = "#3d3f42";
                ctxt.strokeText(this.text, this.x - xOff, this.y - yOff);
            }
            ctxt.fillText(this.text, this.x - xOff, this.y - yOff);
            ctxt.globalAlpha = 1;
        };
    }
}
;
class Textmanager {
    // TEXT MANAGER:
    constructor() {
        this.texts = [];
        this.stack = [];

        this.update = function (delta, ctxt, xOff, yOff) {
            ctxt.textBaseline = "middle";
            ctxt.textAlign = "center";
            for (let i = 0; i < this.texts.length; ++i) {
                if (this.texts[i].life) {
                    this.texts[i].update(delta);
                    this.texts[i].render(ctxt, xOff, yOff);
                }
            }
        };

        this.showText = function (x, y, scale, speed, life, text, color) {
            let tmpText;
            for (let i = 0; i < this.texts.length; ++i) {
                if (!this.texts[i].life) {
                    tmpText = this.texts[i];
                    break;
                }
            }
            if (!tmpText) {
                tmpText = new Animtext();
                this.texts.push(tmpText);
            }
            tmpText.init(x, y, scale, speed, life, text, color);
        };
    }
}

class GameObject {
    constructor(sid) {
        this.sid = sid;

        // INIT:
        this.init = function(x, y, dir, scale, type, data, owner) {
            data = data || {};
            this.sentTo = {};
            this.gridLocations = [];
            this.active = true;
            this.render = true;
            this.doUpdate = data.doUpdate;
            this.x = x;
            this.y = y;
            this.dir = dir;
            this.lastDir = dir;
            this.xWiggle = 0;
            this.yWiggle = 0;
            this.visScale = scale;
            this.scale = scale;
            this.type = type;
            this.id = data.id;
            this.owner = owner;
            this.name = data.name;
            this.isItem = (this.id != undefined);
            this.group = data.group;
            this.maxHealth = data.health;
            this.health = this.maxHealth;
            this.layer = 2;
            if (this.group != undefined) {
                this.layer = this.group.layer;
            } else if (this.type == 0) {
                this.layer = 3;
            } else if (this.type == 2) {
                this.layer = 0;
            } else if (this.type == 4) {
                this.layer = -1;
            }
            this.colDiv = data.colDiv || 1;
            this.blocker = data.blocker;
            this.ignoreCollision = data.ignoreCollision;
            this.dontGather = data.dontGather;
            this.hideFromEnemy = data.hideFromEnemy;
            this.friction = data.friction;
            this.projDmg = data.projDmg;
            this.dmg = data.dmg;
            this.pDmg = data.pDmg;
            this.pps = data.pps;
            this.zIndex = data.zIndex || 0;
            this.turnSpeed = data.turnSpeed;
            this.req = data.req;
            this.trap = data.trap;
            this.healCol = data.healCol;
            this.teleport = data.teleport;
            this.boostSpeed = data.boostSpeed;
            this.projectile = data.projectile;
            this.shootRange = data.shootRange;
            this.shootRate = data.shootRate;
            this.shootCount = this.shootRate;
            this.spawnPoint = data.spawnPoint;
            this.alpha = data.alpha || 1;
            this.maxAlpha = data.alpha || 1;
            this.damaged = 0;
        };

        // GET HIT:
        this.changeHealth = function(amount, doer) {
            this.health += amount;
            return (this.health <= 100);
        };

        // GET SCALE:
        this.getScale = function(sM, ig) {
            sM = sM || 1;
            return this.scale * ((this.isItem || this.type == 2 || this.type == 3 || this.type == 4) ?
                                 1 : (0.6 * sM)) * (ig ? 1 : this.colDiv);
        };

        // VISIBLE TO PLAYER:
        this.visibleToPlayer = function(player) {
            return !(this.hideFromEnemy) || (this.owner && (this.owner == player ||
                                                            (this.owner.team && player.team == this.owner.team)));
        };

        // UPDATE:
        this.update = function(delta) {
            if (this.active) {
                if (this.xWiggle) {
                    this.xWiggle *= Math.pow(0.99, delta);
                }
                if (this.yWiggle) {
                    this.yWiggle *= Math.pow(0.99, delta);
                }
                let d2 = UTILS.getAngleDist(this.lastDir, this.dir);
                if (d2 > 0.01) {
                    this.dir += d2 / 5;
                } else {
                    this.dir = this.lastDir;
                }
            } else {
                if (this.alive) {
                    this.alpha -= delta / (200 / this.maxAlpha);
                    this.visScale += delta / (this.scale / 2.5);
                    if (this.alpha <= 0) {
                        this.alpha = 0;
                        this.alive = false;
                    }
                }
            }
        };
        // CHECK TEAM:
        this.isTeam = function(tmpObj) {
            return (this == tmpObj || (this.team && this.team == tmpObj.team));
        };
        // CHECK TEAM:
        this.isTeamObject = function(tmpObj) {
            return this.owner == null ? true : (this.owner && tmpObj.sid == this.owner.sid || tmpObj.findAllianceBySid(this.owner.sid));
        };
    }
}
class Items {
    constructor() {
        // ITEM GROUPS:
        this.groups = [{
            id: 0,
            name: "food",
            layer: 0
        }, {
            id: 1,
            name: "walls",
            place: true,
            limit: 30,
            layer: 0
        }, {
            id: 2,
            name: "spikes",
            place: true,
            limit: 15,
            layer: 0
        }, {
            id: 3,
            name: "mill",
            place: true,
            limit: 7,
            layer: 1
        }, {
            id: 4,
            name: "mine",
            place: true,
            limit: 1,
            layer: 0
        }, {
            id: 5,
            name: "trap",
            place: true,
            limit: 6,
            layer: -1
        }, {
            id: 6,
            name: "booster",
            place: true,
            limit: 12,
            layer: -1
        }, {
            id: 7,
            name: "turret",
            place: true,
            limit: 2,
            layer: 1
        }, {
            id: 8,
            name: "watchtower",
            place: true,
            limit: 12,
            layer: 1
        }, {
            id: 9,
            name: "buff",
            place: true,
            limit: 4,
            layer: -1
        }, {
            id: 10,
            name: "spawn",
            place: true,
            limit: 1,
            layer: -1
        }, {
            id: 11,
            name: "sapling",
            place: true,
            limit: 2,
            layer: 0
        }, {
            id: 12,
            name: "blocker",
            place: true,
            limit: 3,
            layer: -1
        }, {
            id: 13,
            name: "teleporter",
            place: true,
            limit: 2,
            layer: -1
        }];

        // PROJECTILES:
        this.projectiles = [{
            indx: 0,
            layer: 0,
            src: "arrow_1",
            dmg: 25,
            speed: 1.6,
            scale: 103,
            range: 1000
        }, {
            indx: 1,
            layer: 1,
            dmg: 25,
            scale: 20
        }, {
            indx: 0,
            layer: 0,
            src: "arrow_1",
            dmg: 35,
            speed: 2.5,
            scale: 103,
            range: 1200
        }, {
            indx: 0,
            layer: 0,
            src: "arrow_1",
            dmg: 30,
            speed: 2,
            scale: 103,
            range: 1200
        }, {
            indx: 1,
            layer: 1,
            dmg: 16,
            scale: 20
        }, {
            indx: 0,
            layer: 0,
            src: "bullet_1",
            dmg: 50,
            speed: 3.6,
            scale: 160,
            range: 1400
        }];

        // WEAPONS:
        this.weapons = [{
            id: 0,
            type: 0,
            name: "tool hammer",
            desc: "tool for gathering all resources",
            src: "hammer_1",
            length: 140,
            width: 140,
            xOff: -3,
            yOff: 18,
            dmg: 25,
            range: 65,
            gather: 1,
            speed: 300
        }, {
            id: 1,
            type: 0,
            age: 2,
            name: "hand axe",
            desc: "gathers resources at a higher rate",
            src: "axe_1",
            length: 140,
            width: 140,
            xOff: 3,
            yOff: 24,
            dmg: 30,
            spdMult: 1,
            range: 70,
            gather: 2,
            speed: 400
        }, {
            id: 2,
            type: 0,
            age: 8,
            pre: 1,
            name: "great axe",
            desc: "deal more damage and gather more resources",
            src: "great_axe_1",
            length: 140,
            width: 140,
            xOff: -8,
            yOff: 25,
            dmg: 35,
            spdMult: 1,
            range: 75,
            gather: 4,
            speed: 400
        }, {
            id: 3,
            type: 0,
            age: 2,
            name: "short sword",
            desc: "increased attack power but slower move speed",
            src: "sword_1",
            iPad: 1.3,
            length: 130,
            width: 210,
            xOff: -8,
            yOff: 46,
            dmg: 35,
            spdMult: 0.85,
            range: 110,
            gather: 1,
            speed: 300
        }, {
            id: 4,
            type: 0,
            age: 8,
            pre: 3,
            name: "katana",
            desc: "greater range and damage",
            src: "samurai_1",
            iPad: 1.3,
            length: 130,
            width: 210,
            xOff: -8,
            yOff: 59,
            dmg: 40,
            spdMult: 0.8,
            range: 118,
            gather: 1,
            speed: 300
        }, {
            id: 5,
            type: 0,
            age: 2,
            name: "polearm",
            desc: "long range melee weapon",
            src: "spear_1",
            iPad: 1.3,
            length: 130,
            width: 210,
            xOff: -8,
            yOff: 53,
            dmg: 45,
            knock: 0.2,
            spdMult: 0.82,
            range: 142,
            gather: 1,
            speed: 700
        }, {
            id: 6,
            type: 0,
            age: 2,
            name: "bat",
            desc: "fast long range melee weapon",
            src: "bat_1",
            iPad: 1.3,
            length: 110,
            width: 180,
            xOff: -8,
            yOff: 53,
            dmg: 20,
            knock: 0.7,
            range: 110,
            gather: 1,
            speed: 300
        }, {
            id: 7,
            type: 0,
            age: 2,
            name: "daggers",
            desc: "really fast short range weapon",
            src: "dagger_1",
            iPad: 0.8,
            length: 110,
            width: 110,
            xOff: 18,
            yOff: 0,
            dmg: 20,
            knock: 0.1,
            range: 65,
            gather: 1,
            hitSlow: 0.1,
            spdMult: 1.13,
            speed: 100
        }, {
            id: 8,
            type: 0,
            age: 2,
            name: "stick",
            desc: "great for gathering but very weak",
            src: "stick_1",
            length: 140,
            width: 140,
            xOff: 3,
            yOff: 24,
            dmg: 1,
            spdMult: 1,
            range: 70,
            gather: 7,
            speed: 400
        }, {
            id: 9,
            type: 1,
            age: 6,
            name: "hunting bow",
            desc: "bow used for ranged combat and hunting",
            src: "bow_1",
            req: ["wood", 4],
            length: 120,
            width: 120,
            xOff: -6,
            yOff: 0,
            Pdmg: 25,
            projectile: 0,
            spdMult: 0.75,
            speed: 600
        }, {
            id: 10,
            type: 1,
            age: 6,
            name: "great hammer",
            desc: "hammer used for destroying structures",
            src: "great_hammer_1",
            length: 140,
            width: 140,
            xOff: -9,
            yOff: 25,
            dmg: 10,
            Pdmg: 10,
            spdMult: 0.88,
            range: 75,
            sDmg: 7.5,
            gather: 1,
            speed: 400
        }, {
            id: 11,
            type: 1,
            age: 6,
            name: "wooden shield",
            desc: "blocks projectiles and reduces melee damage",
            src: "shield_1",
            length: 120,
            width: 120,
            shield: 0.2,
            xOff: 6,
            yOff: 0,
            Pdmg: 0,
            spdMult: 0.7
        }, {
            id: 12,
            type: 1,
            age: 8,
            pre: 9,
            name: "crossbow",
            desc: "deals more damage and has greater range",
            src: "crossbow_1",
            req: ["wood", 5],
            aboveHand: true,
            armS: 0.75,
            length: 120,
            width: 120,
            xOff: -4,
            yOff: 0,
            Pdmg: 35,
            projectile: 2,
            spdMult: 0.7,
            speed: 700
        }, {
            id: 13,
            type: 1,
            age: 9,
            pre: 12,
            name: "repeater crossbow",
            desc: "high firerate crossbow with reduced damage",
            src: "crossbow_2",
            req: ["wood", 10],
            aboveHand: true,
            armS: 0.75,
            length: 120,
            width: 120,
            xOff: -4,
            yOff: 0,
            Pdmg: 30,
            projectile: 3,
            spdMult: 0.7,
            speed: 230
        }, {
            id: 14,
            type: 1,
            age: 6,
            name: "mc grabby",
            desc: "steals resources from enemies",
            src: "grab_1",
            length: 130,
            width: 210,
            xOff: -8,
            yOff: 53,
            dmg: 0,
            Pdmg: 0,
            steal: 250,
            knock: 0.2,
            spdMult: 1.05,
            range: 125,
            gather: 0,
            speed: 700
        }, {
            id: 15,
            type: 1,
            age: 9,
            pre: 12,
            name: "musket",
            desc: "slow firerate but high damage and range",
            src: "musket_1",
            req: ["stone", 10],
            aboveHand: true,
            rec: 0.35,
            armS: 0.6,
            hndS: 0.3,
            hndD: 1.6,
            length: 205,
            width: 205,
            xOff: 25,
            yOff: 0,
            Pdmg: 50,
            projectile: 5,
            hideProjectile: true,
            spdMult: 0.6,
            speed: 1500
        }];
        const weaponConfigs = {
            0: {
                id: 0,
                type: 0,
                name: "tool hammer",
                desc: "tool for gathering all resources",
                range: 65,
            },
            1: {
                id: 1,
                type: 0,
                name: "hand axe",
                desc: "gathers resources at a higher rate",
                range: 70,
            },
            2: {
                id: 2,
                type: 0,
                name: "great axe",
                desc: "deal more damage and gather more resources",
                range: 75,
            },
            3: {
                id: 3,
                type: 0,
                name: "short sword",
                desc: "increased attack power but slower move speed",
                range: 110,
            },
            4: {
                id: 4,
                type: 0,
                name: "katana",
                desc: "greater range and damage",
                range: 118,
            },
            5: {
                id: 5,
                type: 0,
                name: "polearm",
                desc: "long range melee weapon",
                range: 142,
            },
            6: {
                id: 6,
                type: 0,
                name: "bat",
                desc: "fast long range melee weapon",
                range: 110,
            },
            7: {
                id: 7,
                type: 0,
                name: "daggers",
                desc: "really fast short range weapon",
                range: 65,
            },
            8: {
                id: 8,
                type: 0,
                name: "stick",
                desc: "great for gathering but very weak",
                range: 70,
            },
            9: {
                id: 9,
                type: 1,
                name: "hunting bow",
                desc: "bow used for ranged combat and hunting",
                range: 120, // Pro luk přidáme dosah (není v původní konfiguraci)
            },
            10: {
                id: 10,
                type: 1,
                name: "great hammer",
                desc: "hammer used for destroying structures",
                range: 75,
            },
            11: {
                id: 11,
                type: 1,
                name: "wooden shield",
                desc: "blocks projectiles and reduces melee damage",
                range: 50, // Předpokládáme menší dosah pro štít
            },
            12: {
                id: 12,
                type: 1,
                name: "crossbow",
                desc: "deals more damage and has greater range",
                range: 150,
            },
            13: {
                id: 13,
                type: 1,
                name: "repeater crossbow",
                desc: "high firerate crossbow with reduced damage",
                range: 140,
            },
            14: {
                id: 14,
                type: 1,
                name: "mc grabby",
                desc: "steals resources from enemies",
                range: 125,
            },
            15: {
                id: 15,
                type: 1,
                name: "musket",
                desc: "slow firerate but high damage and range",
                range: 180, // Největší dosah pro mušketu
            },
        };

        // ITEMS:
        this.list = [{
            group: this.groups[0],
            name: "apple",
            desc: "restores 20 health when consumed",
            req: ["food", 10],
            consume: function(doer) {
                return doer.changeHealth(20, doer);
            },
            scale: 22,
            holdOffset: 15,
            healing: 20,
            itemID: 0,
            itemAID: 16,
        }, {
            age: 3,
            group: this.groups[0],
            name: "cookie",
            desc: "restores 40 health when consumed",
            req: ["food", 15],
            consume: function(doer) {
                return doer.changeHealth(40, doer);
            },
            scale: 27,
            holdOffset: 15,
            healing: 40,
            itemID: 1,
            itemAID: 17,
        }, {
            age: 7,
            group: this.groups[0],
            name: "cheese",
            desc: "restores 30 health and another 50 over 5 seconds",
            req: ["food", 25],
            consume: function(doer) {
                if (doer.changeHealth(30, doer) || doer.health < 100) {
                    doer.dmgOverTime.dmg = -10;
                    doer.dmgOverTime.doer = doer;
                    doer.dmgOverTime.time = 5;
                    return true;
                }
                return false;
            },
            scale: 27,
            holdOffset: 15,
            healing: 30,
            itemID: 2,
            itemAID: 18,
        }, {
            group: this.groups[1],
            name: "wood wall",
            desc: "provides protection for your village",
            req: ["wood", 10],
            projDmg: true,
            health: 380,
            scale: 50,
            holdOffset: 20,
            placeOffset: -5,
            itemID: 3,
            itemAID: 19,
        }, {
            age: 3,
            group: this.groups[1],
            name: "stone wall",
            desc: "provides improved protection for your village",
            req: ["stone", 25],
            health: 900,
            scale: 50,
            holdOffset: 20,
            placeOffset: -5,
            itemID: 4,
            itemAID: 20,
        }, {
            age: 7,
            group: this.groups[1],
            name: "castle wall",
            desc: "provides powerful protection for your village",
            req: ["stone", 35],
            health: 1500,
            scale: 52,
            holdOffset: 20,
            placeOffset: -5,
            itemID: 5,
            itemAID: 21,
        }, {
            group: this.groups[2],
            name: "spikes",
            desc: "damages enemies when they touch them",
            req: ["wood", 20, "stone", 5],
            health: 400,
            dmg: 20,
            scale: 49,
            spritePadding: -23,
            holdOffset: 8,
            placeOffset: -5,
            itemID: 6,
            itemAID: 22,
        }, {
            age: 5,
            group: this.groups[2],
            name: "greater spikes",
            desc: "damages enemies when they touch them",
            req: ["wood", 30, "stone", 10],
            health: 500,
            dmg: 35,
            scale: 52,
            spritePadding: -23,
            holdOffset: 8,
            placeOffset: -5,
            itemID: 7,
            itemAID: 23,
        }, {
            age: 9,
            group: this.groups[2],
            name: "poison spikes",
            desc: "poisons enemies when they touch them",
            req: ["wood", 35, "stone", 15],
            health: 600,
            dmg: 30,
            pDmg: 5,
            scale: 52,
            spritePadding: -23,
            holdOffset: 8,
            placeOffset: -5,
            itemID: 8,
            itemAID: 24,
        }, {
            age: 9,
            group: this.groups[2],
            name: "spinning spikes",
            desc: "damages enemies when they touch them",
            req: ["wood", 30, "stone", 20],
            health: 500,
            dmg: 45,
            turnSpeed: 0.003,
            scale: 52,
            spritePadding: -23,
            holdOffset: 8,
            placeOffset: -5,
            itemID: 9,
            itemAID: 25,
        }, {
            group: this.groups[3],
            name: "windmill",
            desc: "generates gold over time",
            req: ["wood", 50, "stone", 10],
            health: 400,
            pps: 1,
            turnSpeed: 0.0016,
            spritePadding: 25,
            iconLineMult: 12,
            scale: 45,
            holdOffset: 20,
            placeOffset: 5,
            itemID: 10,
            itemAID: 26,
        }, {
            age: 5,
            group: this.groups[3],
            name: "faster windmill",
            desc: "generates more gold over time",
            req: ["wood", 60, "stone", 20],
            health: 500,
            pps: 1.5,
            turnSpeed: 0.0025,
            spritePadding: 25,
            iconLineMult: 12,
            scale: 47,
            holdOffset: 20,
            placeOffset: 5,
            itemID: 11,
            itemAID: 27,
        }, {
            age: 8,
            group: this.groups[3],
            name: "power mill",
            desc: "generates more gold over time",
            req: ["wood", 100, "stone", 50],
            health: 800,
            pps: 2,
            turnSpeed: 0.005,
            spritePadding: 25,
            iconLineMult: 12,
            scale: 47,
            holdOffset: 20,
            placeOffset: 5,
            itemID: 12,
            itemAID: 28,
        }, {
            age: 5,
            group: this.groups[4],
            type: 2,
            name: "mine",
            desc: "allows you to mine stone",
            req: ["wood", 20, "stone", 100],
            iconLineMult: 12,
            scale: 65,
            holdOffset: 20,
            placeOffset: 0,
            itemID: 13,
            itemAID: 29,
        }, {
            age: 5,
            group: this.groups[11],
            type: 0,
            name: "sapling",
            desc: "allows you to farm wood",
            req: ["wood", 150],
            iconLineMult: 12,
            colDiv: 0.5,
            scale: 110,
            holdOffset: 50,
            placeOffset: -15,
            itemID: 14,
            itemAID: 30,
        }, {
            age: 4,
            group: this.groups[5],
            name: "pit trap",
            desc: "pit that traps enemies if they walk over it",
            req: ["wood", 30, "stone", 30],
            trap: true,
            ignoreCollision: true,
            hideFromEnemy: true,
            health: 500,
            colDiv: 0.2,
            scale: 50,
            holdOffset: 20,
            placeOffset: -5,
            alpha: 0.6,
            itemID: 15,
            itemAID: 31,
        }, {
            age: 4,
            group: this.groups[6],
            name: "boost pad",
            desc: "provides boost when stepped on",
            req: ["stone", 20, "wood", 5],
            ignoreCollision: true,
            boostSpeed: 1.5,
            health: 150,
            colDiv: 0.7,
            scale: 45,
            holdOffset: 20,
            placeOffset: -5,
            itemID: 16,
            itemAID: 32,
        }, {
            age: 7,
            group: this.groups[7],
            doUpdate: true,
            name: "turret",
            desc: "defensive structure that shoots at enemies",
            req: ["wood", 200, "stone", 150],
            health: 800,
            projectile: 1,
            shootRange: 700,
            shootRate: 2200,
            scale: 43,
            holdOffset: 20,
            placeOffset: -5,
            itemID: 17,
            itemAID: 33,
        }, {
            age: 7,
            group: this.groups[8],
            name: "platform",
            desc: "platform to shoot over walls and cross over water",
            req: ["wood", 20],
            ignoreCollision: true,
            zIndex: 1,
            health: 300,
            scale: 43,
            holdOffset: 20,
            placeOffset: -5,
            itemID: 18,
            itemAID: 34,
        }, {
            age: 7,
            group: this.groups[9],
            name: "healing pad",
            desc: "standing on it will slowly heal you",
            req: ["wood", 30, "food", 10],
            ignoreCollision: true,
            healCol: 15,
            health: 400,
            colDiv: 0.7,
            scale: 45,
            holdOffset: 20,
            placeOffset: -5,
            itemID: 19,
            itemAID: 35,
        }, {
            age: 9,
            group: this.groups[10],
            name: "spawn pad",
            desc: "you will spawn here when you die but it will dissapear",
            req: ["wood", 100, "stone", 100],
            health: 400,
            ignoreCollision: true,
            spawnPoint: true,
            scale: 45,
            holdOffset: 20,
            placeOffset: -5,
            itemID: 20,
            itemAID: 36,
        }, {
            age: 7,
            group: this.groups[12],
            name: "blocker",
            desc: "blocks building in radius",
            req: ["wood", 30, "stone", 25],
            ignoreCollision: true,
            blocker: 300,
            health: 400,
            colDiv: 0.7,
            scale: 45,
            holdOffset: 20,
            placeOffset: -5,
            itemID: 21,
            itemAID: 37,
        }, {
            age: 7,
            group: this.groups[13],
            name: "teleporter",
            desc: "teleports you to a random point on the map",
            req: ["wood", 60, "stone", 60],
            ignoreCollision: true,
            teleport: true,
            health: 200,
            colDiv: 0.7,
            scale: 45,
            holdOffset: 20,
            placeOffset: -5,
            itemID: 22,
            itemAID: 38
        }];

        // CHECK ITEM ID:
        this.checkItem = {
            index: function(id, myItems) {
                return [0, 1, 2].includes(id) ? 0 : [3, 4, 5].includes(id) ? 1 : [6, 7, 8, 9].includes(id) ? 2 : [10, 11, 12].includes(id) ? 3 : [13, 14].includes(id) ? 5 : [15, 16].includes(id) ? 4 : [17, 18, 19, 21, 22].includes(id) ? [13, 14].includes(myItems) ? 6 :
                5 :
                id == 20 ? [13, 14].includes(myItems) ? 7 :
                6 :
                undefined;
            }
        }

        // ASSIGN IDS:
        for (let i = 0; i < this.list.length; ++i) {
            this.list[i].id = i;
            if (this.list[i].pre) this.list[i].pre = i - this.list[i].pre;
        }

        // TROLOLOLOL:
        if (typeof window !== "undefined") {
            function shuffle(a) {
                for (let i = a.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [a[i], a[j]] = [a[j], a[i]];
                }
                return a;
            }
            //shuffle(this.list);
        }
    }
}
class Objectmanager {
    constructor(GameObject, closeObjects, UTILS, config, players, server) {
        let mathFloor = Math.floor,
            mathABS = Math.abs,
            mathCOS = Math.cos,
            mathSIN = Math.sin,
            mathPOW = Math.pow,
            mathSQRT = Math.sqrt;

        this.ignoreAdd = false;
        this.hitObj = [];

        this.disableObj = function(obj) {
            obj.active = false;
            if (configs.anotherVisual) {} else {
                obj.alive = false;
            }
        };

        // ADD NEW:
        let tmpObj;
        this.add = function(sid, x, y, dir, s, type, data, setSID, owner) {
            tmpObj = findObjectBySid(sid);
            if (!tmpObj) {
                tmpObj = gameObjects.find((tmp) => !tmp.active);
                if (!tmpObj) {
                    tmpObj = new GameObject(sid);
                    gameObjects.push(tmpObj);
                }
            }
            if (setSID) {
                tmpObj.sid = sid;
            }
            tmpObj.init(x, y, dir, s, type, data, owner);
        };

        // DISABLE BY SID:
        this.disableBySid = function(sid) {
            let find = findObjectBySid(sid);
            if (find) {
                this.disableObj(find);
            }
        };

        // REMOVE ALL FROM PLAYER:
        this.removeAllItems = function(sid, server) {
            gameObjects.filter((tmp) => tmp.active && tmp.owner && tmp.owner.sid == sid).forEach((tmp) => this.disableObj(tmp));
        };

        // CHECK IF PLACABLE:
        this.checkItemLocation = function(x, y, s, sM, indx, ignoreWater, placer) {
            let cantPlace = closeObjects.find((tmp) => tmp.active && UTILS.getDistance(x, y, tmp.x, tmp.y) < s + (tmp.blocker ? tmp.blocker : tmp.getScale(sM, tmp.isItem)));
            if (cantPlace) return false;
            if (!ignoreWater && indx != 18 && y >= config.mapScale / 2 - config.riverWidth / 2 && y <= config.mapScale / 2 + config.riverWidth / 2) return false;
            return true;
        };

        // CHECK COLLISIONS:
        this.checkCollision2 = function(e, t, n = 1) {
            const dx = e.x2 - t.x;
            const dy = e.y2 - t.y;
            const radius = 35 + (t.realScale || t.scale);

            if (Math.abs(dx) <= radius || Math.abs(dy) <= radius) {
                const distance = Math.sqrt(dx * dx + dy * dy) - radius;
                if (distance <= 0) {
                    return true;
                }
            }
            return false;
        };

        // CHECK HITS:
        this.hitsToBreak = function(object, _) {
            if (!inGame || !object || !enemy.length || !_) return;

            let weapon = (_.secondaryIndex != undefined && _.primaryIndex != undefined) ? _.secondaryIndex == 10 ? _.secondaryIndex : _.primaryIndex : 10;
            let variant = _[(weapon < 9 ? "prima" : "seconda") + "ryVariant"];
            let variantDmg = variant != undefined ? config.weaponVariants[variant].val : 1.18;
            let damage = items.weapons[weapon].dmg;

            let tank = _.skinIndex == 40 ? 3.3 : 1;

            let effectiveDamage = damage * variantDmg * (items.weapons[weapon].sDmg || 1) * tank;

            return object.health / effectiveDamage;
        };

        this.canHit = function(player, object, weapon, moreSafe = 0) {
            let toRange = items.weapons[weapon].range + player.scale + object.scale/3.25 + moreSafe;

            return UTILS.getDist(player, object, 2, 0) <= toRange;
        };
    }
}
class Projectile {
    constructor(players, ais, objectManager, items, config, UTILS, server) {

        // INIT:
        this.init = function(indx, x, y, dir, spd, dmg, rng, scl, owner) {
            this.active = true;
            this.tickActive = true;
            this.indx = indx;
            this.x = x;
            this.y = y;
            this.x2 = x;
            this.y2 = y;
            this.dir = dir;
            this.skipMov = true;
            this.speed = spd;
            this.dmg = dmg;
            this.scale = scl;
            this.range = rng;
            this.r2 = rng;
            this.owner = owner;
        };

        // UPDATE:
        this.update = function(delta) {
            if (this.active) {
                let tmpSpeed = this.speed * delta;
                if (!this.skipMov) {
                    this.x += tmpSpeed * Math.cos(this.dir);
                    this.y += tmpSpeed * Math.sin(this.dir);
                    this.range -= tmpSpeed;
                    if (this.range <= 0) {
                        this.x += this.range * Math.cos(this.dir);
                        this.y += this.range * Math.sin(this.dir);
                        tmpSpeed = 1;
                        this.range = 0;
                        this.active = false;
                    }
                } else {
                    this.skipMov = false;
                }
            }
        };
        this.tickUpdate = function(delta) {
            if (this.tickActive) {
                let tmpSpeed = this.speed * delta;
                if (!this.skipMov) {
                    this.x2 += tmpSpeed * Math.cos(this.dir);
                    this.y2 += tmpSpeed * Math.sin(this.dir);
                    this.r2 -= tmpSpeed;
                    if (this.r2 <= 0) {
                        this.x2 += this.r2 * Math.cos(this.dir);
                        this.y2 += this.r2 * Math.sin(this.dir);
                        tmpSpeed = 1;
                        this.r2 = 0;
                        this.tickActive = false;
                    }
                } else {
                    this.skipMov = false;
                }
            }
        };
    }
};
class Store {
    constructor() {
        // STORE HATS:
        this.hats = [{
            id: 45,
            name: "Shame!",
            dontSell: true,
            price: 0,
            scale: 120,
            desc: "hacks are for winners"
        }, {
            id: 51,
            name: "Moo Cap",
            price: 0,
            scale: 120,
            desc: "coolest mooer around"
        }, {
            id: 50,
            name: "Apple Cap",
            price: 0,
            scale: 120,
            desc: "apple farms remembers"
        }, {
            id: 28,
            name: "Moo Head",
            price: 0,
            scale: 120,
            desc: "no effect"
        }, {
            id: 29,
            name: "Pig Head",
            price: 0,
            scale: 120,
            desc: "no effect"
        }, {
            id: 30,
            name: "Fluff Head",
            price: 0,
            scale: 120,
            desc: "no effect"
        }, {
            id: 36,
            name: "Pandou Head",
            price: 0,
            scale: 120,
            desc: "no effect"
        }, {
            id: 37,
            name: "Bear Head",
            price: 0,
            scale: 120,
            desc: "no effect"
        }, {
            id: 38,
            name: "Monkey Head",
            price: 0,
            scale: 120,
            desc: "no effect"
        }, {
            id: 44,
            name: "Polar Head",
            price: 0,
            scale: 120,
            desc: "no effect"
        }, {
            id: 35,
            name: "Fez Hat",
            price: 0,
            scale: 120,
            desc: "no effect"
        }, {
            id: 42,
            name: "Enigma Hat",
            price: 0,
            scale: 120,
            desc: "join the enigma army"
        }, {
            id: 43,
            name: "Blitz Hat",
            price: 0,
            scale: 120,
            desc: "hey everybody i'm blitz"
        }, {
            id: 49,
            name: "Bob XIII Hat",
            price: 0,
            scale: 120,
            desc: "like and subscribe"
        }, {
            id: 57,
            name: "Pumpkin",
            price: 50,
            scale: 120,
            desc: "Spooooky"
        }, {
            id: 8,
            name: "Bummle Hat",
            price: 100,
            scale: 120,
            desc: "no effect"
        }, {
            id: 2,
            name: "Straw Hat",
            price: 500,
            scale: 120,
            desc: "no effect"
        }, {
            id: 15,
            name: "Winter Cap",
            price: 600,
            scale: 120,
            desc: "allows you to move at normal speed in snow",
            coldM: 1
        }, {
            id: 5,
            name: "Cowboy Hat",
            price: 1000,
            scale: 120,
            desc: "no effect"
        }, {
            id: 4,
            name: "Ranger Hat",
            price: 2000,
            scale: 120,
            desc: "no effect"
        }, {
            id: 18,
            name: "Explorer Hat",
            price: 2000,
            scale: 120,
            desc: "no effect"
        }, {
            id: 31,
            name: "Flipper Hat",
            price: 2500,
            scale: 120,
            desc: "have more control while in water",
            watrImm: true
        }, {
            id: 1,
            name: "Marksman Cap",
            price: 3000,
            scale: 120,
            desc: "increases arrow speed and range",
            aMlt: 1.3
        }, {
            id: 10,
            name: "Bush Gear",
            price: 3000,
            scale: 160,
            desc: "allows you to disguise yourself as a bush"
        }, {
            id: 48,
            name: "Halo",
            price: 3000,
            scale: 120,
            desc: "no effect"
        }, {
            id: 6,
            name: "Soldier Helmet",
            price: 4000,
            scale: 120,
            desc: "reduces damage taken but slows movement",
            spdMult: 0.94,
            dmgMult: 0.75
        }, {
            id: 23,
            name: "Anti Venom Gear",
            price: 4000,
            scale: 120,
            desc: "makes you immune to poison",
            poisonRes: 1
        }, {
            id: 13,
            name: "Medic Gear",
            price: 5000,
            scale: 110,
            desc: "slowly regenerates health over time",
            healthRegen: 3
        }, {
            id: 9,
            name: "Miners Helmet",
            price: 5000,
            scale: 120,
            desc: "earn 1 extra gold per resource",
            extraGold: 1
        }, {
            id: 32,
            name: "Musketeer Hat",
            price: 5000,
            scale: 120,
            desc: "reduces cost of projectiles",
            projCost: 0.5
        }, {
            id: 7,
            name: "Bull Helmet",
            price: 6000,
            scale: 120,
            desc: "increases damage done but drains health",
            healthRegen: -5,
            dmgMultO: 1.5,
            spdMult: 0.96
        }, {
            id: 22,
            name: "Emp Helmet",
            price: 6000,
            scale: 120,
            desc: "turrets won't attack but you move slower",
            antiTurret: 1,
            spdMult: 0.7
        }, {
            id: 12,
            name: "Booster Hat",
            price: 6000,
            scale: 120,
            desc: "increases your movement speed",
            spdMult: 1.16
        }, {
            id: 26,
            name: "Barbarian Armor",
            price: 8000,
            scale: 120,
            desc: "knocks back enemies that attack you",
            dmgK: 0.6
        }, {
            id: 21,
            name: "Plague Mask",
            price: 10000,
            scale: 120,
            desc: "melee attacks deal poison damage",
            poisonDmg: 5,
            poisonTime: 6
        }, {
            id: 46,
            name: "Bull Mask",
            price: 10000,
            scale: 120,
            desc: "bulls won't target you unless you attack them",
            bullRepel: 1
        }, {
            id: 14,
            name: "Windmill Hat",
            topSprite: true,
            price: 10000,
            scale: 120,
            desc: "generates points while worn",
            pps: 1.5
        }, {
            id: 11,
            name: "Spike Gear",
            topSprite: true,
            price: 10000,
            scale: 120,
            desc: "deal damage to players that damage you",
            dmg: 0.45
        }, {
            id: 53,
            name: "Turret Gear",
            topSprite: true,
            price: 10000,
            scale: 120,
            desc: "you become a walking turret",
            turret: {
                proj: 1,
                range: 700,
                rate: 2500
            },
            spdMult: 0.7
        }, {
            id: 20,
            name: "Samurai Armor",
            price: 12000,
            scale: 120,
            desc: "increased attack speed and fire rate",
            atkSpd: 0.78
        }, {
            id: 58,
            name: "Dark Knight",
            price: 12000,
            scale: 120,
            desc: "restores health when you deal damage",
            healD: 0.4
        }, {
            id: 27,
            name: "Scavenger Gear",
            price: 15000,
            scale: 120,
            desc: "earn double points for each kill",
            kScrM: 2
        }, {
            id: 40,
            name: "Tank Gear",
            price: 15000,
            scale: 120,
            desc: "increased damage to buildings but slower movement",
            spdMult: 0.3,
            bDmg: 3.3
        }, {
            id: 52,
            name: "Thief Gear",
            price: 15000,
            scale: 120,
            desc: "steal half of a players gold when you kill them",
            goldSteal: 0.5
        }, {
            id: 55,
            name: "Bloodthirster",
            price: 20000,
            scale: 120,
            desc: "Restore Health when dealing damage. And increased damage",
            healD: 0.25,
            dmgMultO: 1.2,
        }, {
            id: 56,
            name: "Assassin Gear",
            price: 20000,
            scale: 120,
            desc: "Go invisible when not moving. Can't eat. Increased speed",
            noEat: true,
            spdMult: 1.1,
            invisTimer: 1000
        }];

        // STORE ACCESSORIES:
        this.accessories = [{
            id: 12,
            name: "Snowball",
            price: 1000,
            scale: 105,
            xOff: 18,
            desc: "no effect"
        }, {
            id: 9,
            name: "Tree Cape",
            price: 1000,
            scale: 90,
            desc: "no effect"
        }, {
            id: 10,
            name: "Stone Cape",
            price: 1000,
            scale: 90,
            desc: "no effect"
        }, {
            id: 3,
            name: "Cookie Cape",
            price: 1500,
            scale: 90,
            desc: "no effect"
        }, {
            id: 8,
            name: "Cow Cape",
            price: 2000,
            scale: 90,
            desc: "no effect"
        }, {
            id: 11,
            name: "Monkey Tail",
            price: 2000,
            scale: 97,
            xOff: 25,
            desc: "Super speed but reduced damage",
            spdMult: 1.35,
            dmgMultO: 0.2
        }, {
            id: 17,
            name: "Apple Basket",
            price: 3000,
            scale: 80,
            xOff: 12,
            desc: "slowly regenerates health over time",
            healthRegen: 1
        }, {
            id: 6,
            name: "Winter Cape",
            price: 3000,
            scale: 90,
            desc: "no effect"
        }, {
            id: 4,
            name: "Skull Cape",
            price: 4000,
            scale: 90,
            desc: "no effect"
        }, {
            id: 5,
            name: "Dash Cape",
            price: 5000,
            scale: 90,
            desc: "no effect"
        }, {
            id: 2,
            name: "Dragon Cape",
            price: 6000,
            scale: 90,
            desc: "no effect"
        }, {
            id: 1,
            name: "Super Cape",
            price: 8000,
            scale: 90,
            desc: "no effect"
        }, {
            id: 7,
            name: "Troll Cape",
            price: 8000,
            scale: 90,
            desc: "no effect"
        }, {
            id: 14,
            name: "Thorns",
            price: 10000,
            scale: 115,
            xOff: 20,
            desc: "no effect"
        }, {
            id: 15,
            name: "Blockades",
            price: 10000,
            scale: 95,
            xOff: 15,
            desc: "no effect"
        }, {
            id: 20,
            name: "Devils Tail",
            price: 10000,
            scale: 95,
            xOff: 20,
            desc: "no effect"
        }, {
            id: 16,
            name: "Sawblade",
            price: 12000,
            scale: 90,
            spin: true,
            xOff: 0,
            desc: "deal damage to players that damage you",
            dmg: 0.15
        }, {
            id: 13,
            name: "Angel Wings",
            price: 15000,
            scale: 138,
            xOff: 22,
            desc: "slowly regenerates health over time",
            healthRegen: 3
        }, {
            id: 19,
            name: "Shadow Wings",
            price: 15000,
            scale: 138,
            xOff: 22,
            desc: "increased movement speed",
            spdMult: 1.1
        }, {
            id: 18,
            name: "Blood Wings",
            price: 20000,
            scale: 178,
            xOff: 26,
            desc: "restores health when you deal damage",
            healD: 0.2
        }, {
            id: 21,
            name: "Corrupt X Wings",
            price: 20000,
            scale: 178,
            xOff: 26,
            desc: "deal damage to players that damage you",
            dmg: 0.25
        }];
    }
};
class ProjectileManager {
    constructor(Projectile, projectiles, players, ais, objectManager, items, config, UTILS, server) {
        this.addProjectile = function(x, y, dir, range, speed, indx, owner, ignoreObj, layer, inWindow) {
            let tmpData = items.projectiles[indx];
            let tmpProj;
            for (let i = 0; i < projectiles.length; ++i) {
                if (!projectiles[i].active) {
                    tmpProj = projectiles[i];
                    break;
                }
            }
            if (!tmpProj) {
                tmpProj = new Projectile(players, ais, objectManager, items, config, UTILS, server);
                tmpProj.sid = projectiles.length;
                projectiles.push(tmpProj);
            }
            tmpProj.init(indx, x, y, dir, speed, tmpData.dmg, range, tmpData.scale, owner);
            tmpProj.ignoreObj = ignoreObj;
            tmpProj.layer = layer || tmpData.layer;
            tmpProj.inWindow = inWindow;
            tmpProj.src = tmpData.src;
            return tmpProj;
        };
    }
};
class AiManager {

    // AI MANAGER:
    constructor(ais, AI, players, items, objectManager, config, UTILS, scoreCallback, server) {

        // AI TYPES:
        this.aiTypes = [{
            id: 0,
            src: "cow_1",
            killScore: 150,
            health: 500,
            weightM: 0.8,
            speed: 0.00095,
            turnSpeed: 0.001,
            scale: 72,
            drop: ["food", 50]
        }, {
            id: 1,
            src: "pig_1",
            killScore: 200,
            health: 800,
            weightM: 0.6,
            speed: 0.00085,
            turnSpeed: 0.001,
            scale: 72,
            drop: ["food", 80]
        }, {
            id: 2,
            name: "Bull",
            src: "bull_2",
            hostile: true,
            dmg: 20,
            killScore: 1000,
            health: 1800,
            weightM: 0.5,
            speed: 0.00094,
            turnSpeed: 0.00074,
            scale: 78,
            viewRange: 800,
            chargePlayer: true,
            drop: ["food", 100]
        }, {
            id: 3,
            name: "Bully",
            src: "bull_1",
            hostile: true,
            dmg: 20,
            killScore: 2000,
            health: 2800,
            weightM: 0.45,
            speed: 0.001,
            turnSpeed: 0.0008,
            scale: 90,
            viewRange: 900,
            chargePlayer: true,
            drop: ["food", 400]
        }, {
            id: 4,
            name: "Wolf",
            src: "wolf_1",
            hostile: true,
            dmg: 8,
            killScore: 500,
            health: 300,
            weightM: 0.45,
            speed: 0.001,
            turnSpeed: 0.002,
            scale: 84,
            viewRange: 800,
            chargePlayer: true,
            drop: ["food", 200]
        }, {
            id: 5,
            name: "Quack",
            src: "chicken_1",
            dmg: 8,
            killScore: 2000,
            noTrap: true,
            health: 300,
            weightM: 0.2,
            speed: 0.0018,
            turnSpeed: 0.006,
            scale: 70,
            drop: ["food", 100]
        }, {
            id: 6,
            name: "MOOSTAFA",
            nameScale: 50,
            src: "enemy",
            hostile: true,
            dontRun: true,
            fixedSpawn: true,
            spawnDelay: 60000,
            noTrap: true,
            colDmg: 100,
            dmg: 40,
            killScore: 8000,
            health: 18000,
            weightM: 0.4,
            speed: 0.0007,
            turnSpeed: 0.01,
            scale: 80,
            spriteMlt: 1.8,
            leapForce: 0.9,
            viewRange: 1000,
            hitRange: 210,
            hitDelay: 1000,
            chargePlayer: true,
            drop: ["food", 100]
        }, {
            id: 7,
            name: "Treasure",
            hostile: true,
            nameScale: 35,
            src: "crate_1",
            fixedSpawn: true,
            spawnDelay: 120000,
            colDmg: 200,
            killScore: 5000,
            health: 20000,
            weightM: 0.1,
            speed: 0.0,
            turnSpeed: 0.0,
            scale: 70,
            spriteMlt: 1.0
        }, {
            id: 8,
            name: "MOOFIE",
            src: "wolf_2",
            hostile: true,
            fixedSpawn: true,
            dontRun: true,
            hitScare: 4,
            spawnDelay: 30000,
            noTrap: true,
            nameScale: 35,
            dmg: 10,
            colDmg: 100,
            killScore: 3000,
            health: 7000,
            weightM: 0.45,
            speed: 0.0015,
            turnSpeed: 0.002,
            scale: 90,
            viewRange: 800,
            chargePlayer: true,
            drop: ["food", 1000]
        }, {
            id: 9,
            name: "💀MOOFIE",
            src: "wolf_2",
            hostile: !0,
            fixedSpawn: !0,
            dontRun: !0,
            hitScare: 50,
            spawnDelay: 6e4,
            noTrap: !0,
            nameScale: 35,
            dmg: 12,
            colDmg: 100,
            killScore: 3e3,
            health: 9e3,
            weightM: .45,
            speed: .0015,
            turnSpeed: .0025,
            scale: 94,
            viewRange: 1440,
            chargePlayer: !0,
            drop: ["food", 3e3],
            minSpawnRange: .85,
            maxSpawnRange: .9
        }, {
            id: 10,
            name: "💀Wolf",
            src: "wolf_1",
            hostile: !0,
            fixedSpawn: !0,
            dontRun: !0,
            hitScare: 50,
            spawnDelay: 3e4,
            dmg: 10,
            killScore: 700,
            health: 500,
            weightM: .45,
            speed: .00115,
            turnSpeed: .0025,
            scale: 88,
            viewRange: 1440,
            chargePlayer: !0,
            drop: ["food", 400],
            minSpawnRange: .85,
            maxSpawnRange: .9
        }, {
            id: 11,
            name: "💀Bully",
            src: "bull_1",
            hostile: !0,
            fixedSpawn: !0,
            dontRun: !0,
            hitScare: 50,
            dmg: 20,
            killScore: 5e3,
            health: 5e3,
            spawnDelay: 1e5,
            weightM: .45,
            speed: .00115,
            turnSpeed: .0025,
            scale: 94,
            viewRange: 1440,
            chargePlayer: !0,
            drop: ["food", 800],
            minSpawnRange: .85,
            maxSpawnRange: .9
        }];

        // SPAWN AI:
        this.spawn = function(x, y, dir, index) {
            let tmpObj = ais.find((tmp) => !tmp.active);
            if (!tmpObj) {
                tmpObj = new AI(ais.length, objectManager, players, items, UTILS, config, scoreCallback, server);
                ais.push(tmpObj);
            }
            tmpObj.init(x, y, dir, index, this.aiTypes[index]);
            return tmpObj;
        };
    }

};
class AI {
    constructor(sid, objectManager, players, items, UTILS, config, scoreCallback, server) {
        this.sid = sid;
        this.isAI = true;
        this.nameIndex = UTILS.randInt(0, config.cowNames.length - 1);

        // INIT:
        this.init = function(x, y, dir, index, data) {
            this.x = x;
            this.y = y;
            this.startX = data.fixedSpawn ? x : null;
            this.startY = data.fixedSpawn ? y : null;
            this.xVel = 0;
            this.yVel = 0;
            this.zIndex = 0;
            this.dir = dir;
            this.dirPlus = 0;
            this.showName = 'aaa';
            this.index = index;
            this.src = data.src;
            if (data.name) this.name = data.name;
            this.weightM = data.weightM;
            this.speed = data.speed;
            this.killScore = data.killScore;
            this.turnSpeed = data.turnSpeed;
            this.scale = data.scale;
            this.maxHealth = data.health;
            this.leapForce = data.leapForce;
            this.health = this.maxHealth;
            this.chargePlayer = data.chargePlayer;
            this.viewRange = data.viewRange;
            this.drop = data.drop;
            this.dmg = data.dmg;
            this.hostile = data.hostile;
            this.dontRun = data.dontRun;
            this.hitRange = data.hitRange;
            this.hitDelay = data.hitDelay;
            this.hitScare = data.hitScare;
            this.spriteMlt = data.spriteMlt;
            this.nameScale = data.nameScale;
            this.colDmg = data.colDmg;
            this.noTrap = data.noTrap;
            this.spawnDelay = data.spawnDelay;
            this.hitWait = 0;
            this.waitCount = 1000;
            this.moveCount = 0;
            this.targetDir = 0;
            this.active = true;
            this.alive = true;
            this.runFrom = null;
            this.chargeTarget = null;
            this.dmgOverTime = {};
        };

        let tmpRatio = 0;
        let animIndex = 0;
        this.animate = function(delta) {
            if (this.animTime > 0) {
                this.animTime -= delta;
                if (this.animTime <= 0) {
                    this.animTime = 0;
                    this.dirPlus = 0;
                    tmpRatio = 0;
                    animIndex = 0;
                } else {
                    if (animIndex == 0) {
                        tmpRatio += delta / (this.animSpeed * config.hitReturnRatio);
                        this.dirPlus = UTILS.lerp(0, this.targetAngle, Math.min(1, tmpRatio));
                        if (tmpRatio >= 1) {
                            tmpRatio = 1;
                            animIndex = 1;
                        }
                    } else {
                        tmpRatio -= delta / (this.animSpeed * (1 - config.hitReturnRatio));
                        this.dirPlus = UTILS.lerp(0, this.targetAngle, Math.max(0, tmpRatio));
                    }
                }
            }
        };

        // ANIMATION:
        this.startAnim = function() {
            this.animTime = this.animSpeed = 600;
            this.targetAngle = Math.PI * 0.8;
            tmpRatio = 0;
            animIndex = 0;
        };

    };

};
class addCh {
    constructor(x, y, chat, tmpObj) {
        this.x = x;
        this.y = y;
        this.alpha = 0;
        this.active = true;
        this.alive = false;
        this.chat = chat;
        this.owner = tmpObj;
    };
};
class DeadPlayer {
    constructor(x, y, dir, buildIndex, weaponIndex, weaponVariant, skinColor, scale, name) {
        this.x = x;
        this.y = y;
        this.lastDir = dir;
        this.dir = dir + Math.PI;
        this.buildIndex = buildIndex;
        this.weaponIndex = weaponIndex;
        this.weaponVariant = weaponVariant;
        this.skinColor = skinColor;
        this.scale = scale;
        this.visScale = 0;
        this.name = name;
        this.alpha = 1;
        this.active = true;
        this.animate = function(delta) {
            let d2 = UTILS.getAngleDist(this.lastDir, this.dir);
            if (d2 > 0.01) {
                this.dir += d2 / 20;
            } else {
                this.dir = this.lastDir;
            }
            if (this.visScale < this.scale) {
                this.visScale += delta / (this.scale / 2);
                if (this.visScale >= this.scale) {
                    this.visScale = this.scale;
                }
            }
            this.alpha -= delta / 30000;
            if (this.alpha <= 0) {
                this.alpha = 0;
                this.active = false;
            }
        }
    }
};
class Player {
    constructor(id, sid, config, UTILS, projectileManager, objectManager, players, ais, items, hats, accessories, server, scoreCallback, iconCallback) {
        this.id = id;
        this.sid = sid;
        this.tmpScore = 0;
        this.team = null;
        this.latestSkin = 0;
        this.oldSkinIndex = 0;
        this.skinIndex = 0;
        this.latestTail = 0;
        this.oldTailIndex = 0;
        this.tailIndex = 0;
        this.hitTime = 0;
        this.lastHit = 0;
        this.showName = 'NOOO';
        this.tails = {};
        for (let i = 0; i < accessories.length; ++i) {
            if (accessories[i].price <= 0) this.tails[accessories[i].id] = 1;
        }
        this.skins = {};
        for (let i = 0; i < hats.length; ++i) {
            if (hats[i].price <= 0) this.skins[hats[i].id] = 1;
        }
        this.points = 0;
        this.dt = 0;
        this.hidden = false;
        this.itemCounts = {};
        this.isPlayer = true;
        this.pps = 0;
        this.moveDir = undefined;
        this.skinRot = 0;
        this.lastPing = 0;
        this.iconIndex = 0;
        this.skinColor = 0;
        this.dist2 = 0;
        this.aim2 = 0;
        this.maxSpeed = 1;
        this.chat = {
            message: null,
            count: 0
        };
        this.circle = false;
        this.cAngle = 0;
        // SPAWN:
        this.spawn = function(moofoll) {
            this.attacked = false;
            this.timeDamaged = 0;
            this.timeHealed = 0;
            this.pinge = 0;
            this.millPlace = 'NOOO';
            this.lastshamecount = 0;
            this.death = false;
            this.spinDir = 0;
            this.sync = false;
            this.antiBull = 0;
            this.bullTimer = 0;
            this.poisonTimer = 0;
            this.active = true;
            this.alive = true;
            this.lockMove = false;
            this.lockDir = false;
            this.minimapCounter = 0;
            this.chatCountdown = 0;
            this.shameCount = 0;
            this.shameTimer = 0;
            this.sentTo = {};
            this.gathering = 0;
            this.gatherIndex = 0;
            this.shooting = {};
            this.shootIndex = 9;
            this.autoGather = 0;
            this.animTime = 0;
            this.animSpeed = 0;
            this.mouseState = 0;
            this.buildIndex = -1;
            this.weaponIndex = 0;
            this.weaponCode = 0;
            this.weaponVariant = 0;
            this.primaryIndex = undefined;
            this.secondaryIndex = undefined;
            this.dmgOverTime = {};
            this.noMovTimer = 0;
            this.maxXP = 300;
            this.XP = 0;
            this.age = 1;
            this.kills = 0;
            this.upgrAge = 2;
            this.upgradePoints = 0;
            this.syncThreats = 0;
            this.x = 0;
            this.y = 0;
            this.oldXY = {
                x: 0,
                y: 0
            };
            this.zIndex = 0;
            this.xVel = 0;
            this.yVel = 0;
            this.slowMult = 1;
            this.dir = 0;
            this.dirPlus = 0;
            this.targetDir = 0;
            this.targetAngle = 0;
            this.maxHealth = 100;
            this.health = this.maxHealth;
            this.oldHealth = this.maxHealth;
            this.damaged = 0;
            this.scale = config.playerScale;
            this.speed = config.playerSpeed;
            this.resetMoveDir();
            this.resetResources(moofoll);
            this.items = [0, 3, 6, 10];
            this.weapons = [0];
            this.shootCount = 0;
            this.weaponXP = [];
            this.reloads = {
                0: 0,
                1: 0,
                2: 0,
                3: 0,
                4: 0,
                5: 0,
                6: 0,
                7: 0,
                8: 0,
                9: 0,
                10: 0,
                11: 0,
                12: 0,
                13: 0,
                14: 0,
                15: 0,
                53: 0,
            };
            this.bowThreat = {
                9: 0,
                12: 0,
                13: 0,
                15: 0,
            };
            this.damageThreat = 0;
            this.inTrap = false;
            this.canEmpAnti = false;
            this.empAnti = false;
            this.soldierAnti = false;
            this.poisonTick = 0;
            this.bullTick = 0;
            this.setPoisonTick = false;
            this.setBullTick = false;
            this.antiTimer = 2;
            this.hasAttackedThisTick = false;
            this._attackedThisTickTempVariable = false
            this.hasFiredProjectileThisTick = false;
            this._firedThisTickTempVariable = false;
            this.hitDetect = [];
            this.primaryReload = 1
            this.inAnti = false
            this.lastAntiTick = 0
            this.secondaryReload = 1
            this.turretReload = 1
        };

        // RESET MOVE DIR:
        this.resetMoveDir = function() {
            this.moveDir = undefined;
        };

        // RESET RESOURCES:
        this.resetResources = function(moofoll) {
            for (let i = 0; i < config.resourceTypes.length; ++i) {
                this[config.resourceTypes[i]] = moofoll ? 100 : 0;
            }
        };

        // ADD ITEM:
        this.getItemType = function(id) {
            let findindx = this.items.findIndex((ids) => ids == id);
            if (findindx != -1) {
                return findindx;
            } else {
                return items.checkItem.index(id, this.items);
            }
        };

        // SET DATA:
        this.setData = function(data) {
            this.id = data[0];
            this.sid = data[1];
            this.name = data[2];
            this.x = data[3];
            this.y = data[4];
            this.dir = data[5];
            this.health = data[6];
            this.maxHealth = data[7];
            this.scale = data[8];
            this.skinColor = data[9];
        };

        // UPDATE POISON TICK:
        this.updateTimer = function() {

            this.bullTimer -= 1;
            if (this.bullTimer <= 0) {
                this.setBullTick = false;
                this.bullTick = game.tick - 1;
                this.bullTimer = config.serverUpdateRate;
            }
            this.poisonTimer -= 1;
            if (this.poisonTimer <= 0) {
                this.setPoisonTick = false;
                this.poisonTick = game.tick - 1;
                this.poisonTimer = config.serverUpdateRate;
            }

        };
        this.update = function(delta) {
            if (this.active) {

                // MOVE:
                let gear = {
                    skin: findID(hats, this.skinIndex),
                    tail: findID(accessories, this.tailIndex)
                }
                let spdMult = ((this.buildIndex >= 0) ? 0.5 : 1) * (items.weapons[this.weaponIndex].spdMult || 1) * (gear.skin ? (gear.skin.spdMult || 1) : 1) * (gear.tail ? (gear.tail.spdMult || 1) : 1) * (this.y <= config.snowBiomeTop ? ((gear.skin && gear.skin.coldM) ? 1 : config.snowSpeed) : 1) * this.slowMult;
                this.maxSpeed = spdMult;

            }
        };

        let tmpRatio = 0;
        let animIndex = 0;
        this.animate = function(delta) {
            if (this.animTime > 0) {
                this.animTime -= delta;
                if (this.animTime <= 0) {
                    this.animTime = 0;
                    this.dirPlus = 0;
                    tmpRatio = 0;
                    animIndex = 0;
                } else {
                    if (animIndex == 0) {
                        tmpRatio += delta / (this.animSpeed * config.hitReturnRatio);
                        this.dirPlus = UTILS.lerp(0, this.targetAngle, Math.min(1, tmpRatio));
                        if (tmpRatio >= 1) {
                            tmpRatio = 1;
                            animIndex = 1;
                        }
                    } else {
                        tmpRatio -= delta / (this.animSpeed * (1 - config.hitReturnRatio));
                        this.dirPlus = UTILS.lerp(0, this.targetAngle, Math.max(0, tmpRatio));
                    }
                }
            }
        };

        // GATHER ANIMATION:
        this.startAnim = function(didHit, index) {
            this.animTime = this.animSpeed = items.weapons[index].speed;
            this.targetAngle = (didHit ? -config.hitAngle : -Math.PI);
            tmpRatio = 0;
            animIndex = 0;
        };

        // CAN SEE:
        this.canSee = function(other) {
            if (!other) return false;
            let dx = Math.abs(other.x - this.x) - other.scale;
            let dy = Math.abs(other.y - this.y) - other.scale;
            return dx <= (config.maxScreenWidth / 2) * 1.3 && dy <= (config.maxScreenHeight / 2) * 1.3;
        };

        // SHAME SYSTEM:
        this.judgeShame = function() {
            if (this.oldHealth < this.health) {
                if (this.hitTime) {
                    let timeSinceHit = game.tick - this.hitTime;
                    this.lastHit = game.tick;
                    this.hitTime = 0;
                    if (timeSinceHit < 2) {
                        this.shameCount++;
                    } else {
                        this.shameCount = Math.max(0, this.shameCount - 2);
                    }
                }
            } else if (this.oldHealth > this.health) {
                this.hitTime = game.tick;
            }
        };
        this.addShameTimer = function() {
            this.shameCount = 0;
            this.shameTimer = 30;
            let interval = setInterval(() => {
                this.shameTimer--;
                if (this.shameTimer <= 0) {
                    clearInterval(interval);
                }
            }, 1000);
        };

        // CHECK TEAM:
        this.isTeam = function(tmpObj) {
            return (this == tmpObj || (this.team && this.team == tmpObj.team));
        };

        // FOR THE PLAYER:
        this.findAllianceBySid = function(sid) {
            return this.team ? alliancePlayers.find((THIS) => THIS === sid) : null;
        };
        this.checkCanInsta = function(nobull) {
            let totally = 0;
            if (this.alive && inGame) {
                let primary = {
                    weapon: this.weapons[0],
                    variant: this.primaryVariant,
                    dmg: this.weapons[0] == undefined ? 0 : items.weapons[this.weapons[0]].dmg,
                };
                let secondary = {
                    weapon: this.weapons[1],
                    variant: this.secondaryVariant,
                    dmg: this.weapons[1] == undefined ? 0 : items.weapons[this.weapons[1]].Pdmg,
                };
                let bull = this.skins[7] && !nobull ? 1.5 : 1;
                let pV = primary.variant != undefined ? config.weaponVariants[primary.variant].val : 1;
                if (primary.weapon != undefined && this.reloads[primary.weapon] == 0) {
                    totally += primary.dmg * pV * bull;
                }
                if (secondary.weapon != undefined && this.reloads[secondary.weapon] == 0) {
                    totally += secondary.dmg;
                }
                if (this.skins[53] && this.reloads[53] <= (player.weapons[1] == 10 ? 0 : game.tickRate) && near.skinIndex != 22) {
                    totally += 25;
                }
                totally *= near.skinIndex == 6 ? 0.75 : 1;
                return totally;
            }
            return 0;
        };

        // UPDATE WEAPON RELOAD:
        const BASE_TRAP_PLACEMENT_RADIUS = 70;
        const LOW_HEALTH_THRESHOLD = 272.58;
        const BASE_PLACE_DELAY = 0.001;
        const SAFETY_BUFFER = 50;
        const TARGET_PREDICTION_STEPS = 20;
        const OPTIMIZED_SCORE_WEIGHT = 2.0;
        const ANGLE_INCREMENT = 27;
        const ENVIRONMENTAL_IMPACT_RADIUS = 100;
        const LINE_OF_SIGHT_BLOCKAGE_PENALTY = 20;
        const TEAMMATE_PROXIMITY_PENALTY = 20;
        const MAX_ENVIRONMENTAL_SCORE = 100;
        const HEATMAP_DECAY_RATE = 0.1;
        const ENVIRONMENTAL_ADAPTATION_MULTIPLIER = 1.5;

        let lastPlacementTime = 0;
        let enemyHeatmap = {};
        let enemyMovementPatterns = {};
        let environmentalFactors = {};
        let trapPositionCache = {};
        let teamCoordination = {};
        let liveCombatData = {};

        // Ensure this is called periodically (e.g., in a game loop or tick).
        this.manageReload = function () {
            if (this.shooting[53]) {
                this.shooting[53] = 0;
                this.reloads[53] = (2500 - game.tickRate);
            } else {
                if (this.reloads[53] > 0) {
                    this.reloads[53] = Math.max(0, this.reloads[53] - game.tickRate);
                }
            }

            if (this.gathering || this.shooting[1]) {
                if (this.gathering) {
                    this.gathering = 0;
                    this.reloads[this.gatherIndex] = (items.weapons[this.gatherIndex].speed * (this.skinIndex == 20 ? 0.78 : 1));
                    this.attacked = true;
                }
                if (this.shooting[1]) {
                    this.shooting[1] = 0;
                    this.reloads[this.shootIndex] = (items.weapons[this.shootIndex].speed * (this.skinIndex == 20 ? 0.78 : 1));
                    this.attacked = true;
                }
            } else {
                this.attacked = false;
                if (this.buildIndex < 0) {
                    if (this.reloads[this.weaponIndex] > 0) {
                        this.reloads[this.weaponIndex] = Math.max(0, this.reloads[this.weaponIndex] - game.tickRate);
                        if (this == player) {
                            if (getEl("weaponGrind").checked) {
                                for (let i = 0; i < Math.PI * 2; i += Math.PI / 2) {
                                    checkPlace(player.getItemType(22), i);
                                }
                            }
                        }
                        if (this.reloads[this.primaryIndex] == 0 && this.reloads[this.weaponIndex] == 0) {
                            this.antiBull++;
                            game.tickBase(() => {
                                this.antiBull = 0;
                            }, 1);
                        }
                    }
                }
            }
        }

        // FOR ANTI INSTA:
        this.addDamageThreat = function (tmpObj) {
            const defaultPrimaryDmg = 45;
            const defaultSecondaryDmg = 35;
            const bullMultiplier = 1.5;
            const defaultVariantVal = 1.18;
            const skinIndexPenalty = 0.75;
            const closeRangeThreshold = 300;
            const additionalThreatReloadTickRate = game.tickRate;
            const additionalThreatValue = 25;
            let { primaryIndex, primaryVariant, secondaryIndex, secondaryVariant, reloads, dist2 } = this;
            let { weapons } = items;
            let { weaponVariants } = config;
            let primary = {
                weapon: primaryIndex,
                variant: primaryVariant,
                dmg: primaryIndex === undefined ? defaultPrimaryDmg : weapons[primaryIndex].dmg
            };
            let secondary = {
                weapon: secondaryIndex,
                variant: secondaryVariant,
                dmg: secondaryIndex === undefined ? defaultSecondaryDmg : weapons[secondaryIndex].Pdmg
            };
            let primaryVariantValue = primary.variant !== undefined ? weaponVariants[primary.variant].val : defaultVariantVal;
            let secondaryVariantValue = secondary.variant !== undefined && ![9, 12, 17, 15].includes(secondary.weapon) ? weaponVariants[secondary.variant].val : defaultVariantVal;
            let damageThreat = 0;
            if (primary.weapon === undefined || reloads[primary.weapon] === 0) {
                damageThreat += primary.dmg * primaryVariantValue * bullMultiplier;
            }
            if (secondary.weapon === undefined || reloads[secondary.weapon] === 0) {
                damageThreat += secondary.dmg * secondaryVariantValue;
            }
            if (reloads[53] <= additionalThreatReloadTickRate) {
                damageThreat += additionalThreatValue;
            }
            damageThreat *= tmpObj.skinIndex === 6 ? skinIndexPenalty : 1;
            if (!this.isTeam(tmpObj) && dist2 <= closeRangeThreshold) {
                tmpObj.damageThreat += damageThreat;
            }
            // ANTI
            this.addDamageProbability = function (tmpObj) {
                let primary = {
                    weapon: this.primaryIndex,
                    variant: this.primaryVariant,
                    dmg: this.primaryIndex === undefined ? 45 : items.weapons[this.primaryIndex].dmg
                };
                let secondary = {
                    weapon: this.secondaryIndex,
                    variant: this.secondaryVariant,
                    dmg: this.secondaryIndex === undefined ? 50 : items.weapons[this.secondaryIndex].Pdmg
                };
                let bull = 1.5;
                let pV = primary.variant !== undefined ? config.weaponVariants[primary.variant].val : 1.18;
                let sV = secondary.variant !== undefined ? [9, 12, 17, 15].includes(secondary.weapon) ? 1 : config.weaponVariants[secondary.variant].val : 1.18;
                if (this.reloads[primary.weapon] === 0) {
                    this.damageProbably += primary.dmg * pV * bull * 0.75;
                }
                if (this.reloads[secondary.weapon] === 0) {
                    this.damageProbably += secondary.dmg * sV;
                }
                this.damageProbably *= 0.75;
                if (!this.isTeam(tmpObj) && this.dist2 <= 300) {
                    tmpObj.damageProbably += this.damageProbably;
                }
            }
        };
    }
};

// SOME CODES:
function sendUpgrade(index) {
    player.reloads[index] = 0;
    packet("H", index);
}

function storeEquip(id, index) {
    packet("c", 0, id, index);
}

function storeBuy(id, index) {
    packet("c", 1, id, index);
}

function buyEquip(id, index) {
    let nID = player.skins[6] ? 6 : 0;
    if (player.alive && inGame) {
        if (index == 0) {
            if (player.skins[id]) {
                if (player.latestSkin != id) {
                    packet("c", 0, id, 0);
                }
            } else {
                if (true) {
                    let find = findID(hats, id);
                    if (find) {
                        if (player.points >= find.price) {
                            packet("c", 1, id, 0);
                            packet("c", 0, id, 0);
                        } else {
                            if (player.latestSkin != nID) {
                                packet("c", 0, nID, 0);
                            }
                        }
                    } else {
                        if (player.latestSkin != nID) {
                            packet("c", 0, nID, 0);
                        }
                    }
                } else {
                    if (player.latestSkin != nID) {
                        packet("c", 0, nID, 0);
                    }
                }
            }
        } else if (index == 1) {
            if (useWasd && (id != 11 && id != 0)) {
                if (player.latestTail != 0) {
                    packet("c", 0, 0, 1);
                }
                return;
            }
            if (player.tails[id]) {
                if (player.latestTail != id) {
                    packet("c", 0, id, 1);
                }
            } else {
                if (true) {
                    let find = findID(accessories, id);
                    if (find) {
                        if (player.points >= find.price) {
                            packet("c", 1, id, 1);
                            packet("c", 0, id, 1);
                        } else {
                            if (player.latestTail != 0) {
                                packet("c", 0, 0, 1);
                            }
                        }
                    } else {
                        if (player.latestTail != 0) {
                            packet("c", 0, 0, 1);
                        }
                    }
                } else {
                    if (player.latestTail != 0) {
                        packet("c", 0, 0, 1);
                    }
                }
            }
        } else {
            if (hatLoop) {
                packet("c", 0, loopHats[loopIndex++], 0, "buyËquip");
            } else if (player.latestSkin != 0) {
                packet("c", 0, my.defaultHat, 0, "buyËquip");
            }
        }
    }
}

function selectToBuild(index, wpn) {
    packet("z", index, wpn);
}

function selectWeapon(index, isPlace) {
    if (!isPlace) {
        player.weaponCode = index;
    }
    packet("z", index, 1);
}

function sendAutoGather() {
    packet("K", 1, 1);
}

function sendAtck(id, angle) {
    packet("F", id, angle, 1);
}

// PLACER:
function place(id, rad, rmd) {
    try {
        if (id == undefined) return;
        let item = items.list[player.items[id]];
        let tmpS = player.scale + item.scale + (item.placeOffset || 0);
        let tmpX = player.x2 + tmpS * Math.cos(rad);
        let tmpY = player.y2 + tmpS * Math.sin(rad);
        if ((player.alive && inGame && player.itemCounts[item.group.id] == undefined ? true : player.itemCounts[item.group.id] < (config.isSandbox ? 299 : item.group.limit ? item.group.limit : 99))) {
            selectToBuild(player.items[id]);
            sendAtck(1, rad);
            selectWeapon(player.weaponCode, 1);
        }
    } catch (e) {}
}

function checkPlace(id, rad) {
    try {
        if (id == undefined) return;
        let item = items.list[player.items[id]];
        let tmpS = player.scale + item.scale + (item.placeOffset || 0);
        let tmpX = player.x2 + tmpS * Math.cos(rad);
        let tmpY = player.y2 + tmpS * Math.sin(rad);
        if (objectManager.checkItemLocation(tmpX, tmpY, item.scale, 0.6, item.id, false, player)) {
            place(id, rad, 1);
        }
    } catch (e) {}
}
function getDamageThreat(tmpObj) {
    tmpObj.instaThreat = 0;
    if (isTeam(tmpObj)) {
        let primary = {
            weapon: tmpObj.primaryIndex,
            variant: tmpObj.primaryVariant,
            dmg: tmpObj.primaryIndex == undefined ? 45 : items.weapons[tmpObj.primaryIndex].dmg,
        };
        let secondary = {
            weapon: tmpObj.secondaryIndex,
            variant: tmpObj.secondaryVariant,
            dmg: tmpObj.secondaryIndex == undefined ? 50 : items.weapons[tmpObj.secondaryIndex].Pdmg,
        };
        let bull = tmpObj.skinIndex == 7 ? 1.5 : 1;
        let pV = primary.variant != undefined ? config.weaponVariants[primary.variant].val : 1.18;
        if (primary.weapon != undefined && tmpObj.reloads[primary.weapon] == 0) {
            tmpObj.instaThreat += primary.dmg * pV * bull;
        }
        if (secondary.weapon != undefined && tmpObj.reloads[secondary.weapon] == 0) {
            tmpObj.instaThreat += secondary.dmg;
        }
        if (tmpObj.reloads[53] === 0) {
            tmpObj.instaThreat += 25;
        }
        tmpObj.instaThreat *= player.skinIndex == 6 ? 0.75 : 1;
    }
}
let bestMonkeys = 0;
// UPDATE HEALTH:
function updateHealth(sid, value) {
    tmpObj = findPlayerBySID(sid);
    if (tmpObj) {
        tmpObj.oldHealth = tmpObj.health;
        tmpObj.health = value;
        if (tmpObj.oldHealth < tmpObj.health) {
            if (tmpObj.hitTime) {
                let timeSinceHit = Date.now() - tmpObj.hitTime;
                let tickiy = ticks.time.filter(e => e == "lag");
                tmpObj.hitTime = 0;
                if (timeSinceHit <= (tickiy.length >= 2 ? 120 : 120)) {
                    tmpObj.shameCount += 1;
                    if (instaC.isTrue) {
                        tmpObj.healSid = Math.min(3, tmpObj.healSid + 1);
                    }
                    if (tmpObj.shameCount > tmpObj.maxShame) {
                        tmpObj.maxShame = tmpObj.shameCount;
                    }
                } else {
                    tmpObj.shameCount = Math.max(0, tmpObj.shameCount - 2);
                    if (instaC.isTrue) {
                        tmpObj.healSid = Math.max(-1, tmpObj.healSid - 1);
                    }
                }
            }
            var isAlly = function(id){
                for(let i = 0;i < alliancePlayers.length;i+=2){
                    if(id == alliancePlayers[i]){
                        return true;
                    }
                }
            }
            function GetangleSpike(a, b) {
                if (a == player) {
                    return Math.sqrt(Math.pow((b.y - a.y2), 2) + Math.pow((b.x - a.x2), 2));
                } else if (b == player) {
                    return Math.sqrt(Math.pow((b.y2 - a.y), 2) + Math.pow((b.x2 - a.x), 2));
                } else {
                    return Math.sqrt(Math.pow((b.y - a.y), 2) + Math.pow((b.x - a.x), 2));
                }
            }
            let spikes = gameObjects.filter(obj => (obj.name == "spikes" || obj.name == "greater spikes" || obj.name == "spinning spikes" || obj.name == "poison spikes") && GetangleSpike(player, obj) < player.scale + obj.scale + 50 && !isAlly(obj.owner.sid) && obj.active)
            let direction = Math.atan2(player.y2 - near.y2, player.x2 - near.x2)
            let newPos = {
                x: player.x + Math.cos(direction) * 35,
                y: player.y2 + Math.sin(direction) * 35,
            }
            if (GetangleSpike(spikes, player) <= 200 && near.dist2 <= 250) {
                if (near.reloads[near.primaryIndex] || near.reloads[near.secondaryIndex] && near.reloads[53] == 0 && items.weapons[near.secondaryIndex == 10 || near.secondaryIndex]) {
                    for (let i = 0; i < spikes.length; i++) {
                        if (GetangleSpike(spikes[i], newPos) < player.scale + spikes[i].scale && (!my.inTrap || my.inTrap)) {
                            buyEquip(6, 0);
                            player.soldierAnti = true;
                        }
                    }
                } else {
                    if (player.health <= 25 >= 90 && player.shameCount <= 5) {
                        setTimeout(healer(), 111)
                        buyEquip(6, 0);
                    } else {
                        setTimeout(healer(), 111)
                    }
                }
            }
        }
    }
}
// UPDATE HEALTH:
let doEmpAntiInsta = false;
let judgeAtNextTick = false;

// FUNCTIONS
const alwaysSoldier = () => {
    buyEquip(6, 0);
    my.anti0Tick++;
}
let enemyDmg = 0;
function antiKnockBack(tmpObj) { // ANTI KNOCK BACK
    if (!tmpObj || tmpObj.primaryVariant == undefined || tmpObj.primaryIndex == undefined || traps.intrap) return;
    enemyDmg = items.weapons[tmpObj.primaryIndex].dmg * config.weaponVariants[tmpObj.primaryVariant].val * 1.5 + (tmpObj.reloads[53] == 0 ? 25 : 0);
    let HitR1 = items.weapons[tmpObj.primaryIndex].range*((items.weapons[tmpObj.primaryIndex].mR||0))+config.playerScale*2;
    let attackRange = HitR1;
    let objs = gameObjects.filter(tmp => tmp.active && UTILS.getDist(tmp, tmpObj, 0, 2) <= 600);
    for (let obj of objs) {
        if (obj.dmg && !obj.isTeamObject(player)) {
            let objAim = UTILS.getDirect(obj, tmpObj, 0, 2);
            let objAimSE = UTILS.getDirect(player, obj, 2, 0);
            let objAimE = UTILS.getDirect(obj, player, 0, 2);
            let objDstE = UTILS.getDist(obj, player, 0, 2);
            if (objDstE <= (attackRange + obj.scale)) {
                enemyDmg += obj.dmg;
                if (near.dist <= items.weapons[tmpObj.primaryIndex].range+config.playerScale*2) {
                    let endPos = {
                        x: player.x2 + Math.cos(near.aim+Math.PI) * attackRange,
                        y: player.y2 + Math.sin(near.aim+Math.PI) * attackRange
                    }
                    if ((UTILS.getAngleDist(UTILS.getDirect(endPos, obj, 0, 0), objAimE) <= 0.69 || UTILS.getDist(endPos, obj, 0, 0) <= (obj.scale + player.scale))) {
                        if (enemyDmg*(player.skinIndex==6?(3/4):1) >= 100) {
                            alwaysSoldier();
                            if (player.shameCount < 4) place(0, getAttackDir());
                        }
                    }
                }
            }
        }
    }
}
// HEALING:
function soldierMult() {
    return player.latestSkin == 6 ? 0.75 : 1;
}

function getAttacker(damaged) {
    let attackers = enemy.filter(tmp => {
        let damages = new Damages(items);
        let dmg = damages.weapons[tmp.weaponIndex];
        let by = tmp.weaponIndex < 9 ? [dmg[0], dmg[1], dmg[2], dmg[3]] : [dmg[0], dmg[1]];
        let rule = {
            one: tmp.dist2 <= 300,
            two: by.includes(damaged),
            three: tmp.attacked
        }
        return rule.one && rule.two && rule.three;
    });
    return attackers;
}

function healer(extra = 0) {
    if (extra == 0) {
        for (let i = 0; i < healthBased(); i++) {
            place(0, getAttackDir());
        }
    } else {
        for (let i = 0; i < healthBased() + extra; i++) {
            place(0, getAttackDir());
        }
    }
}
// ADVANCED:
// ADVANCED:
function applCxC(value) {
    if (player.skinIndex != 45 && player.skinIndex != 56) {
        if (0 == player.items[0]) {
            if (value < -80) {
                return 5;
            } else if (value < -60) {
                return 4;
            } else if (value < -40) {
                return 3;
            } else if (value < -20) {
                return 2;
            } else {
                return 1;
            }
        } else if (1 == player.items[0]) {
            if (value < -80) {
                return 3;
            } else if (value < -40) {
                return 2;
            } else {
                return 1;
            }
        } else if (2 == player.items[0]) {
            if (value < -90) {
                return 4;
            } else if (value < -60) {
                return 3;
            } else if (value < -30) {
                return 2;
            } else {
                return 1;
            }
        } else {
            return 4;
        }
    } else {
        return 0;
    }
}
function healthBased() {
    if (player.health == 100) return 0;
    if (player.skinIndex != 45 && player.skinIndex != 56) {
        return Math.ceil((100 - player.health) / items.list[player.items[0]].healing);
    }
    return 0;
}

function calcDmg(value) {
    return value * player.skinIndex == 6 ? 0.75 : 1;
}
let predictDamage = 0;

let stopHealing = false;
function healIntrap(tmpObj, value) {
    var heal = function(amount, after) {
        setTickout(() => {
            for (let i = 0; i < applCxC(amount); i++) {
                place(0, getAttackDir());
            }
        }, after);
    };
    if (enemy.length) {
        heal(value, 2);
    } else {
        heal(value, 3);
    }
}
let backupAnti = [];
let hittedTime = Date.now();

function autoHealer(tmpObj, value) {
    let pingHeal = function() {
        return Math.max(0, 175 - window.pingTime);
    };
    let antiInsta = false;
    let findAttacker = undefined;
    if (true) {
        if (near.dist2 <= 300) {
            if (value >= 20 && (Date.now() - hittedTime >= 180 || Date.now() - hittedTime <= 60)) {
                if (tmpObj.shameCount < tmpObj.dangerShame) {
                    for (let i = 0; i < applCxC(value); i++) {
                        place(0, getAttackDir());
                        if (Date.now() - hittedTime >= 260) {
                            place(0, getAttackDir());
                        }
                    }
                    if (value >= 70) {
                        const heal = () => {
                            let times = player.items[0] === 1 ? 3 : 4;
                            for(let i = 0; i < times; i++) place(0, getAttackDir());
                        }
                        const slowHeal = () => {
                            setTimeout(()=>{
                                heal();
                            }, pingHeal())
                        }
                        slowHeal();
                    }
                } else {
                    setTickout(()=>{
                        for (let i = 0; i < applCxC(value); i++) {
                            place(0, getAttackDir());
                        }
                    }, 2);
                }
            } else {
                if (traps.inTrap) {
                    healIntrap(tmpObj, value);
                } else {
                    setTickout(()=>{
                        for (let i = 0; i < applCxC(value); i++) {
                            place(0, getAttackDir());
                        }
                    }, 2);
                }
            }
            if (player.skinIndex == 11) {
                if (value >= 30) {
                    instaC.isCounter = true;
                }
            }
            if (value >= 20) {
                hittedTime = Date.now();
                judgeAtNextTick = true;
            }
        } else {
            if (traps.inTrap) {
                healIntrap(tmpObj, value);
            } else {
                setTickout(()=>{
                    for (let i = 0; i < applCxC(value); i++) {
                        place(0, getAttackDir());
                    }
                }, 2);
            }
        }
    }
}

function antiSyncHealing(timearg) {
    my.antiSync = true;
    let healAnti = setInterval(()=>{
        if (player.shameCount < 5) {
            place(0, getAttackDir());
        }
    }, 75);
    setTimeout(()=>{
        clearInterval(healAnti);
        setTimeout(()=>{
            my.antiSync = false;
        }, config.tickRate);
    }, config.tickRate * timearg);
}
let noTail = false;
function biomeGear(ignoreStandStill, returns) {
    let asda = getMoveDir();
    let antiBullTrue = configs.antiBull;
    let soldDist = false;
    for (let i = 0; i < enemy.length; i++) {
        let tmpDist = near.boosted ? 100 : near.hasBoost ? 80 : player.skinIndex == 6 ? 75 : 70;
    }
    if (
        player.tailIndex !=
        (!ignoreStandStill && near && near.dist3 <= 280
         ? player.tails[antiBullTrue ? 21 : 19]
         ? antiBullTrue
         ? 21
         : 19
         : 0
         : (ignoreStandStill || near.dist3 >= 320) && player.tails[11]
         ? 11
         : 0)
    ) {
        buyEquip(
            ignoreStandStill && (near.dist3 <= 280 || noTail)
            ? antiBullTrue
            ? 21
            : 19
            : ignoreStandStill || near.dist3 >= 320
            ? 11
            : antiBullTrue
            ? 21
            : 19,
            1
        );
    } else if (asda == undefined && !ignoreStandStill) {
        buyEquip(hatLoop ? loopHats[loopIndex++] : my.defaultHat, 0);
    } else {
        if (
            player.y2 >= config.mapScale / 2 - config.riverWidth / 2 &&
            player.y2 <= config.mapScale / 2 + config.riverWidth / 2
        ) {
            buyEquip(
                player.skins[31] ? 31 : hatLoop ? loopHats[loopIndex++] : my.defaultHat,
                0
            );
        } else {
            if (player.y2 <= config.snowBiomeTop) {
                if (returns) return enemy && near.dist2 <= 300 ? 15 : hatLoop;
                buyEquip(15, 0);
            } else {
                buyEquip(
                    player.skins[6] && enemy && !ignoreStandStill && soldDist
                    ? 6
                    : hatLoop
                    ? loopHats[loopIndex++]
                    : player.skins[12]
                    ? 12
                    : my.defaultHat,
                    0
                );
            }
        }
    }
}
function biomeGearHat(ignoreStandStill) {
    let asda = getMoveDir();
    if (asda == undefined) {
        return hatLoop ? loopHats[loopIndex++] : my.defaultHat;
    } else {
        if (
            player.y2 >= config.mapScale / 2 - config.riverWidth / 2 &&
            player.y2 <= config.mapScale / 2 + config.riverWidth / 2
        ) {
            return player.skins[31]
                ? 31
            : hatLoop
                ? loopHats[loopIndex++]
            : my.defaultHat;
        } else {
            if (player.y2 <= config.snowBiomeTop) {
                return player.skins[15]
                    ? 15
                : hatLoop
                    ? loopHats[loopIndex++]
                : my.defaultHat;
            } else {
                return hatLoop
                    ? loopHats[loopIndex++]
                : player.skins[12]
                    ? 12
                : my.defaultHat;
            }
        }
    }
}
let advHeal = [];
let tracker = {
    draw3: {
        active: false,
        x: 0,
        y: 0,
        scale: 0,
    },
    moveDir: undefined,
    lastPos: {
        x: 0,
        y: 0,
    }
}

class Traps {
    constructor(UTILS, items) {
        this.dist = 0;
        this.aim = 0;
        this.broken = [];
        this.inTrap = false;
        this.replaced = false;
        this.antiTrapped = false;
        this.hasSpike = false;
        this.objectToIgnore = undefined;
        this.hasAimed = false;
        this.preplaceInfo = [];
        this.info = {};

        this.notFast = function(object = this.info[0]) {
            if (player.weapons[1] != 10) return false;

            if ((object.health > items.weapons[player.weapons[0]].dmg) || [5].includes(player.weapons[0])) return true;

            return false;
        }

        this.testCanPlace = function(id, first = -(Math.PI / 2), repeat = (Math.PI / 2), plus = (Math.PI / 18), radian, replacer, yaboi) {
            try {
                let item = items.list[player.items[id]];
                let tmpS = player.scale + item.scale + (item.placeOffset || 0);
                let counts = {
                    attempts: 0,
                    placed: 0
                };
                let tmpObjects = [];
                gameObjects.forEach((p) => {
                    tmpObjects.push({
                        x: p.x,
                        y: p.y,
                        active: p.active,
                        blocker: p.blocker,
                        scale: p.scale,
                        isItem: p.isItem,
                        type: p.type,
                        colDiv: p.colDiv,
                        getScale: function(sM, ig) {
                            sM = sM || 1;
                            return this.scale * ((this.isItem || this.type == 2 || this.type == 3 || this.type == 4)
                                                 ? 1 : (0.6 * sM)) * (ig ? 1 : this.colDiv);
                        },
                    });
                });
                for (let i = first; i < repeat; i += plus) {
                    counts.attempts++;
                    let relAim = radian + i;
                    let tmpX = player.x2 + tmpS * Math.cos(relAim);
                    let tmpY = player.y2 + tmpS * Math.sin(relAim);
                    let cantPlace = tmpObjects.find((tmp) => tmp.active && UTILS.getDistance(tmpX, tmpY, tmp.x, tmp.y) < item.scale + (tmp.blocker ? tmp.blocker : tmp.getScale(0.6, tmp.isItem)));
                    if (cantPlace) continue;
                    if (item.id != 19 && tmpY >= config.mapScale / 2 - config.riverWidth / 2 && tmpY <= config.mapScale / 2 + config.riverWidth / 2) continue;
                    if ((!replacer && yaboi) || useWasd) {
                        if (useWasd ? false : yaboi.inTrap) {
                            if (UTILS.getAngleDist(near.aim2 + Math.PI, relAim + Math.PI) <= Math.PI) {
                                place(2, relAim, 1);
                            } else {
                                player.items[4] == 15 && place(4, relAim, 1);
                            }
                        } else {
                            if (UTILS.getAngleDist(near.aim2, relAim) <= config.gatherAngle / 1.5) {
                                place(2, relAim, 1);
                            } else {
                                player.items[4] == 15 && place(4, relAim, 1);
                            }
                        }
                    } else {
                        place(id, relAim, 1);
                    }
                    tmpObjects.push({
                        x: tmpX,
                        y: tmpY,
                        active: true,
                        blocker: item.blocker,
                        scale: item.scale,
                        isItem: true,
                        type: null,
                        colDiv: item.colDiv,
                        getScale: function() {
                            return this.scale;
                        },
                    });
                    if (UTILS.getAngleDist(near.aim2, relAim) <= 1) {
                        counts.placed++;
                    }
                }
                if (counts.placed > 0 && replacer && item.dmg) {
                    if (near.dist2 <= items.weapons[player.weapons[0]].range + (player.scale * 1.8)) {
                        instaC.canSpikeTick = true;
                    }
                }
            } catch (err) {
            }
        };
        // ANTI SP TICK
        this.checkSpikeTick = function () {
            try {
                if (![3, 4, 5].includes(near.primaryIndex)) return false;

                if (((configs?.SafeAntiSpikeTick ?? false) || my.autoPush) ? false : near.primaryIndex == undefined ? true : (near.reloads[near.primaryIndex] > game.tickRate)) return false;

                if (near.dist2 <= items.weapons[near.primaryIndex || 5].range + (near.scale * 1.8)) {
                    let item = items.list[9];
                    let tmpS = near.scale + item.scale + (item.placeOffset || 0);

                    let spikeX = near.x2 + tmpS * Math.cos(near.aim2);
                    let spikeY = near.y2 + tmpS * Math.sin(near.aim2);

                    let cantPlace = closeObjects.find((tmp) => tmp.active &&
                                                      UTILS.getDistance(spikeX, spikeY, tmp.x, tmp.y) < item.scale + (tmp.blocker ? tmp.blocker : tmp.getScale(0.6, tmp.isItem))
                                                     );

                    let danger = 0;
                    let counts = {
                        attempts: 0,
                        block: `unblocked`
                    };

                    for (let i = -1; i <= 1; i += 1 / 10) {
                        counts.attempts++;
                        let relAim = UTILS.getDirect(player, near, 2, 2) + i;
                        let tmpX = near.x2 + tmpS * Math.cos(relAim);
                        let tmpY = near.y2 + tmpS * Math.sin(relAim);

                        let cantPlace = gameObjects.find((tmp) => tmp.active &&
                                                         UTILS.getDistance(tmpX, tmpY, tmp.x, tmp.y) < item.scale + (tmp.blocker ? tmp.blocker : tmp.getScale(0.6, tmp.isItem))
                                                        );

                        if (cantPlace) continue;
                        if (tmpY >= config.mapScale / 2 - config.riverWidth / 2 && tmpY <= config.mapScale / 2 + config.riverWidth / 2) continue;

                        danger++;
                        counts.block = `blocked`;
                        break;
                    }

                    if (danger) {
                        my.anti0Tick = 1;
                        return true;
                    }
                }
            } catch (err) {
                return null;
            }
            return false;
        };
        function getDist(e, t) {
            try {
                return Math.hypot((t.y2 || t.y) - (e.y2 || e.y), (t.x2 || t.x) - (e.x2 || e.x));
            } catch (e) {
                return Infinity;
            }
        }

        this.protect = function (aim, obj) {
            if (!configs.antiTrap) return;

            this.testCanPlace(4, -(Math.PI / 2), (Math.PI / 2), (Math.PI / (24 - 6)), aim + Math.PI);
            this.antiTrapped = true;
        };

        let nearTrap = gameObjects.filter(e => e.trap && e.active && e.isTeamObject(player) && UTILS.getDist(e, near, 0, 2) <= (near.scale + e.getScale() + 5)).sort(function(a, b) {
            return UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2);
        })[0];

        let testMode = window.location.hostname == "1";
        let autoQ = false;
        this.antiSpT = function () {
            return this.antiSpikeTick();
        }
        function getEnemyVelocity(near) {
            return Math.sqrt(near.xVel * near.xVel + near.yVel * near.yVel);
        }

        function getEnemyDirection(near) {
            return Math.atan2(near.yVel, near.xVel);
        }
        function findAnglesToTest() {
            let anglesToTest = [];

            for (let i = 0; i < 360; i += 250) {
                anglesToTest.push((Math.PI/180) * i);
            }

            return anglesToTest;
        }
        function findAnglesToTest2(obj, player) {
            let perfectAngle = UTILS.getDirect(obj, player, 0, 2);
            for (let i = 0; i < 360; i += 25) {
                perfectAngle.push((Math.PI/180) * i);
            }
            return perfectAngle;
        }
        function findAnglesToTest1() {
            let anglesToTest = [];

            for (let i = 0; i < 360; i += 25) {
                anglesToTest.push((Math.PI/180) * i);
            }

            return anglesToTest;
        }
        UTILS.deg2rad = function (degrees) {
            return degrees * (Math.PI / 180);
        }
        let placedSpikePositions = new Set();
        let placedTrapPositions = new Set();
        var breakTrack = [];
        const PLACE_SPEED = 100;
        function calculatePerfectAngle(x1, y1, x2, y2) {
            return Math.atan2(y2 - y1, x2 - x1);
        }
        function isObjectBroken(object) {
            const healthThreshold = 20;
            return object.health < healthThreshold;
        }
        function PlacementLocation(x, y, trapType) {
            this.x = x;
            this.y = y;
            this.trapType = trapType;
        }
        function checkPlaceWithAngles1(angle1, angle2, x, y) {
            checkPlace(4, x, y, angle1, angle2);
        }
        function checkPlaceWithAngles2(angle1, angle2, x, y) {
            checkPlace(2, x, y, angle1, angle2);
        }
        this.autoPlace = function () {
            if (!enemy.length || !configs.AutoMatePlace || instaC.ticking || near.dist2 > 300) return;

            if (secPacket <= 90) {
                const autoPlaceTick = Math.max(1, parseInt()) || 1;
                if (game.tick % autoPlaceTick !== 0) return;

                if (!closeObjects.length) return;

                const near2 = { inTrap: false };
                const nearTrap = closeObjects.filter(e => e.trap && e.active && e.isTeamObject(player) && UTILS.getDist(e, near, 0, 2) <= (near.scale + e.getScale() + 5))
                .sort((a, b) => UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2))[0];

                if (nearTrap) near2.inTrap = true;

                function predictEnemyPosition(enemy) {
                    const predictionTime = 0.5;
                    const predictedX = enemy.x + enemy.xVel * predictionTime;
                    const predictedY = enemy.y + enemy.yVel * predictionTime;

                    return { x: predictedX, y: predictedY };
                }

                function isPositionValid(position) {
                    const playerX = player.x2;
                    const playerY = player.y2;
                    const distToPosition = Math.hypot(position[0] - playerX, position[1] - playerY);

                    return distToPosition > 35;
                }

                /*
                if (near.dist2 <= 385) {
                    const aimAngle = near.aim2;
                    const fullCircle = Math.PI * 2;
                    const smallStep = Math.PI / 36;

                    if (near.dist2 <= 200) {
                        this.testCanPlace(4, 0, fullCircle, smallStep, aimAngle, 0, { inTrap: near2.inTrap });
                    } else if (player.items[4] === 15) {
                        this.testCanPlace(4, 0, fullCircle, smallStep, aimAngle);
                    }
                }*/

                let randomDir = Math.random() * Math.PI * 1.5;
                if (closeObjects.length) {
                    let tryTicked = [3, 4, 5].includes(near.primaryIndex);

                    const id = nearTrap || near.dist2 <= items.weapons[player.weapons[0]].range + near.scale * 1.8 ? 2 : 4;
                    this.testCanPlace(id, -(Math.PI * 1.5), randomDir, Math.PI / 48, near.aim2, tryTicked && id === 2);
                } else {
                    this.testCanPlace(4, 0, Math.PI * 2, Math.PI / 24, randomDir);
                }

                if (nearTrap && near.dist2 <= 160) {
                    const trapX = nearTrap.x;
                    const trapY = nearTrap.y;
                    const circleRadius = 102;
                    const numPositions = 72;

                    for (let i = 0; i < numPositions; i++) {
                        const angle = (2 * Math.PI * i) / numPositions;
                        const offsetX = trapX + circleRadius * Math.cos(angle);
                        const offsetY = trapY + circleRadius * Math.sin(angle);
                        const position = [offsetX, offsetY];
                        const distToPlayer = Math.hypot(position[0] - player.x2, position[1] - player.y2);

                        const predictedEnemy = predictEnemyPosition(near);
                        const predictedDist = Math.hypot(predictedEnemy.x - position[0], predictedEnemy.y - position[1]);

                        if (!placedSpikePositions.has(JSON.stringify(position)) && isPositionValid(position) && distToPlayer <= 87 && predictedDist <= 50) {
                            const angleToPlace = Math.atan2(position[1] - player.y2, position[0] - player.x2);
                            checkPlace(2, angleToPlace);
                            placedSpikePositions.add(JSON.stringify(position));
                        }
                    }
                }
            }
        };
    }
    // angle scanning codes
    createTempObject() {
        return { x: 0, y: 0, scale: 0 }
    };
    getPosFromAngle(id, angle, velocity){
        return {
            x: (velocity ? player.xVel : player.x2) + (35 + items.list[id].scale + (items.list[id].placeOffset || 0)) * Math.cos(angle),
            y: (velocity ? player.yVel : player.y2) + (35 + items.list[id].scale + (items.list[id].placeOffset || 0)) * Math.sin(angle),
            scale: items.list[id].scale,
        }
    }
    secondaryCheck(id, radian) {
        try {
            var item = items.list[id];
            var tmpS = player.scale + item.scale + (item.placeOffset || 0);
            var tmpX = player.x2 + tmpS * Math.cos(radian);
            var tmpY = player.y2 + tmpS * Math.sin(radian);
            if (objectManager.checkItemLocation(tmpX,tmpY,item.scale,0.6,item.id,false,player)) {
                if (
                    player.itemCounts[item.group.id] == undefined
                    ? true
                    : player.itemCounts[item.group.id] <
                    (true
                     ? 99
                     : item.group.limit
                     ? 99
                     : 99)
                ) {
                    return true
                }
            }
        } catch (e) {

        }
    }
    manageAngles(angles) {
        angles.sort((a, b) => a[0] - b[0]);
        let mergedAngles = [angles[0]];
        for (let i = 1; i < angles.length; i++) {
            let last = mergedAngles[mergedAngles.length - 1];
            if (last[1] >= angles[i][0]) {
                last[1] = Math.max(last[1], angles[i][1]);
            } else {
                mergedAngles.push(angles[i]);
            }
        }
        return mergedAngles;
    }
    makeAngles(building, type) {
        let buildings = building.filter(obj => UTILS.getDist(obj, player, 0, 2) <= player.scale + items.list[type].scale + obj.scale + 50 && obj.active);
        let allAngles = [], scale, offset = player.scale + items.list[type].scale + (items.list[type].placeOffset || 0);
        for (let i = 0; i < buildings.length; i++) {
            let scale
            if (!buildings[i].isItem) {
                if ((buildings[i].scale != 80 && buildings[i].scale != 85 && buildings[i].scale != 90 || buildings[i].type == 1)) {
                    scale = buildings[i].scale * 0.40

                } else {
                    scale = buildings[i].scale
                }
            } else {
                scale = buildings[i].scale
            }
            let angles = [], dist = (items.list[type].scale + scale + 1), dPTB = UTILS.getDist(buildings[i], player, 0, 2), cosLaw;
            if (dPTB > dist + offset) {
                cosLaw = Math.acos(((Math.pow(offset, 2) + Math.pow(dist, 2)) - Math.pow(dPTB, 2)) / (2 * dist * offset))
                cosLaw = Math.asin((dist * Math.sin(cosLaw)) / dPTB)
            } else {
                cosLaw = Math.acos(((Math.pow(offset, 2) + Math.pow(dPTB, 2)) - Math.pow(dist, 2)) / (2 * dPTB * offset))
            }
            let aPTB = Math.atan2(buildings[i].y - player.y2, buildings[i].x - player.x2)
            let ang1 = (aPTB - cosLaw), ang2 = (aPTB + cosLaw)
            if (!isNaN(cosLaw)) {
                angles.push(ang1)
                angles.push(ang2)
                angles.push(buildings[i])
            }
            allAngles.push(angles)
        }

        for (let i = 0; i < allAngles.length * 3; i++) {
            allAngles = this.manageAngles(allAngles)

        }
        if (!allAngles.length) {
            allAngles = [0, 0.0001]
        }
        for (let i = 0; i < allAngles.length; i++) {
            if (allAngles != false) {
                if (!this.secondaryCheck(type, allAngles[i][0]) || !this.secondaryCheck(type, allAngles[i][1])) {
                    allAngles = false
                }
            }
        }
        return allAngles
    }
    findNearestAngle(angles, targetAngle) {
        let closestAngle = null;
        let closestDist = Infinity;
        for (let i = 0; i < angles.length; i++) {
            let angle1 = angles[i][0];
            let angle2 = angles[i][1];
            let dist1 = Math.min(Math.abs(angle1 - targetAngle), 2 * Math.PI - Math.abs(angle1 - targetAngle));
            let dist2 = Math.min(Math.abs(angle2 - targetAngle), 2 * Math.PI - Math.abs(angle2 - targetAngle));
            if (dist1 < closestDist) {
                closestDist = dist1;
                closestAngle = angle1;
            }
            if (dist2 < closestDist) {
                closestDist = dist2;
                closestAngle = angle2;
            }
        }
        return closestAngle;
    }
    calculateAngles(initAngleRad) {
        let angles = [initAngleRad];
        for (let i = 1; i < 4; i++) {
            let angleOffset = (Math.PI / 2) * i;
            let newAngle = (initAngleRad + angleOffset) % (2 * Math.PI);
            angles.push(newAngle);
        }
        return angles;
    }
    calculateAngle(baseAngleRad, numOffsets = 1) {
        numOffsets = Math.min(numOffsets, 3);
        return Array.from({ length: numOffsets + 1 }, (_, i) => {
            let angleOffset = (Math.PI / 2) * i;
            return (baseAngleRad + angleOffset) % (2 * Math.PI);
        });
    }
    refineAngles(type) {
        const clampAngle = function(angle) {
            while (angle < 0) {
                angle += 2 * Math.PI;
            }
            while (angle >= 2 * Math.PI) {
                angle -= 2 * Math.PI;
            }
            return angle;
        }
        let buildings = gameObjects.sort((a, b) => Math.hypot(player.y2 - a.y, player.x2 - a.x) - Math.hypot(player.y2 - b.y, player.x2 - b.x));
        let buildingsInRange = buildings.filter(obj => UTILS.getDist(obj, player, 0, 2) <= player.scale + items.list[type].scale + obj.scale + 50 && obj.active);
        let allAngles = [];
        let offset = player.scale + items.list[type].scale + (items.list[type].placeOffset || 0);
        buildingsInRange.forEach(building => {
            let scale = building.isItem ? building.scale : building.scale !== 80 && building.scale !== 85 && building.scale !== 90 || building.type === 1 ? building.scale * 0.40 : building.scale;
            let dist = items.list[type].scale + scale + 1;
            let dPTB = UTILS.getDist(building, player, 0, 2);
            let cosLaw = (dPTB > dist + offset) ? Math.asin((dist * Math.sin(Math.acos((offset ** 2 + dist ** 2 - dPTB ** 2) / (2 * dist * offset)))) / dPTB) :
            Math.acos((offset ** 2 + dPTB ** 2 - dist ** 2) / (2 * dPTB * offset));
            let aPTB = Math.atan2(building.y - player.y2, building.x - player.x2);
            let ang1 = clampAngle(aPTB - cosLaw);
            let ang2 = clampAngle(aPTB + cosLaw);
            if (!isNaN(ang1) && !isNaN(ang2)) {
                allAngles.push([ang1, ang2]);
            }
        });
        if (allAngles.length > 0) {
            return allAngles.flatMap(anglePair => anglePair).filter(angle => typeof angle === 'number');
        } else {
            return this.calculateAngles(UTILS.getAngle(near, player, 2, 2));
        }
    }
    potentialBuildDamage(object, singlePlayer) {
        try {
            let selectedWeapon = singlePlayer.weapons[player.weapons[1] == 10 ? 1 : 0];
            let weaponInfo = items.weapons[singlePlayer.weapons[singlePlayer.weapons[1] == 10 ? 1 : 0]];
            let isWithinRange = UTILS.getDist(object, singlePlayer, 0, 2) <= object.getScale() + weaponInfo.range;
            return singlePlayer.visible && isWithinRange && UTILS.getAngleDist(UTILS.getDirect(object, singlePlayer, 0, 2), singlePlayer.dir) <= config.gatherAngle ? weaponInfo.dmg * (config.weaponVariants[singlePlayer.weaponVariant].val ? config.weaponVariants[singlePlayer.weaponVariant].val : 1) * (weaponInfo.sDmg || 1) * 3.3 : 0;
        } catch (e) {
        }
    }
    getClosestAngle(anglesArray, targetDirection) {
        if (!anglesArray.length) return targetDirection;
        let closestAngle = anglesArray.reduce((closest, current) => {
            return Math.abs(current - targetDirection) < Math.abs(closest - targetDirection) ? current : closest;
        });
        return closestAngle;
    };
    preplaceAngle(filteredGameObjects, objWithLowestHealth) {
        let priorityResults = [];
        let trapCandidates = [];
        let spikeCandidates = [];
        let buildings = gameObjects.filter(object => UTILS.getDist(object, player, 0, 2) <= 300);
        let spikeAngles = this.refineAngles(2);
        let trapAngles = [];
        if (player.items[4]) {
            trapAngles = this.makeAngles(buildings, player.items[4]);
        }
        if (player.inTrap) {
            spikeCandidates = filteredGameObjects
                .filter(obj => obj.dmg && obj.active && UTILS.getDist(obj, this.info, 0, 0) <= (player.scale + this.info.scale + obj.scale + 5))
                .sort((a, b) => UTILS.getDist(a, player, 0, 2) - UTILS.getDist(b, player, 0, 2));
            if (spikeCandidates.length > 0) {
                let spikeAngle = this.getClosestAngle(spikeAngles, UTILS.getDirect(spikeCandidates[0], player, 0, 2));
                priorityResults.push(["spike", spikeCandidates[0], spikeAngle]);
            } else {
                trapCandidates = filteredGameObjects
                    .filter(obj => obj.trap && obj.active && obj.isTeamObject(player) && UTILS.getDist(obj, near, 0, 2) <= (near.scale + obj.getScale() + 15))
                    .sort((a, b) => UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2));
                if (trapCandidates.length > 0) {
                    let trapAngle = this.getClosestAngle(trapAngles, UTILS.getDirect(trapCandidates[0], player, 0, 2));
                    priorityResults.push(["trap", trapCandidates[0], trapAngle]);
                } else {
                    let spikeAngle = this.getClosestAngle(spikeAngles, UTILS.getDirect(objWithLowestHealth, player, 0, 2));
                    priorityResults.push(["spike", objWithLowestHealth, spikeAngle]);
                }
            }
        } else {
            trapCandidates = filteredGameObjects
                .filter(obj => obj.trap && obj.active && obj.isTeamObject(player) && UTILS.getDist(obj, near, 0, 2) <= (near.scale + obj.getScale() + 15))
                .sort((a, b) => UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2));
            if (trapCandidates.length > 0) {
                let trapAngle = this.getClosestAngle(trapAngles, UTILS.getDirect(trapCandidates[0], player, 0, 2));
                priorityResults.push(["trap", trapCandidates[0], trapAngle]);
                spikeCandidates = filteredGameObjects
                    .filter(obj => obj.dmg && obj.active && obj.isTeamObject(player) && UTILS.getDist(obj, trapCandidates[0], 0, 0) <= (near.scale + trapCandidates[0].scale + obj.scale + 5))
                    .sort((a, b) => Utils.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2));
                if (spikeCandidates.length > 0) {
                    let spikeAngle = this.getClosestAngle(spikeAngles, UTILS.getDirect(spikeCandidates[0], player, 0, 2));
                    priorityResults.push(["spike", spikeCandidates[0], spikeAngle]);
                }
            } else {
                let spikeAngle = this.getClosestAngle(spikeAngles, UTILS.getDirect(objWithLowestHealth, player, 0, 2));
                priorityResults.push(["spike", objWithLowestHealth, spikeAngle]);
                let secondaryObject = filteredGameObjects.find(obj => obj !== objWithLowestHealth && obj.health > 0);
                if (secondaryObject) {
                    let trapAngle = this.getClosestAngle(trapAngles, UTILS.getDirect(secondaryObject, player, 0, 2));
                    priorityResults.push(["trap", secondaryObject, trapAngle]);
                }
            }
        }
        return priorityResults.slice(0, 2);
    };
    replacer(findObj) {
        if (!findObj || !configs.autoReplace || !inGame || this.antiTrapped) return;

        this.angles = this.angles || [];

        let objAim = UTILS.getDirect(findObj, player, 0, 2);
        let objDst = UTILS.getDist(findObj, player, 0, 2);
        let weaponRange = items.weapons[player.weaponIndex].range + player.scale;

        if (getEl("weaponGrind").checked && objDst <= weaponRange) return;

        let danger = this.checkSpikeTick();
        let canPlaceCondition = [4, 5].includes(player.weapons[0]) && !danger;

        let spikSync = false;
        game.tickBase(() => {
            if (objDst <= 300 && near.dist2 <= 300) {
                let inRange = near.dist3 <= items.weapons[near.primaryIndex || 5].range + (near.scale * 1.8);
                let checkCanSpikeSync = !danger && (inRange || (traps.inTrap && objDst <= 150) || near.inTrap);

                if (checkCanSpikeSync) {
                    this.angles.push(objAim);

                    if (this.angles.length > 5) {
                        this.angles.shift();
                    }

                    let smoothedAngle = this.angles.reduce((a, b) => a + b, 0) / this.angles.length;

                    smoothedAngle += Math.PI / 2;

                    let timeAdjustment = (Math.PI / 24) * Math.sin(Date.now() / 1000);
                    let placementAngle = smoothedAngle + timeAdjustment;

                    this.testCanPlace(2, placementAngle, placementAngle + Math.PI * 2, Math.PI / 24, placementAngle - Math.PI, 1);
                    this.testCanPlace(2, 0, Math.PI * 2, Math.PI / 24, objAim, 1);

                    spikSync = true;
                } else if (player.items[4] === 15 || near.dist2 <= 100) {
                    spikSync = false;

                    let trapPlacementAngle = objAim + Math.PI;

                    player.items[4] == 15 &&
                        this.testCanPlace(
                        4,
                        trapPlacementAngle,
                        trapPlacementAngle + Math.PI * 2,
                        Math.PI / 24,
                        objAim, 1
                    );
                } else {
                    spikSync = false;

                    let startAngle = Math.random() * Math.PI * 1.5;
                    let step = Math.PI / (32 + Math.random() * 12);

                    this.testCanPlace(4, -startAngle, Math.PI * 1.5, step, objAim, 1);
                    this.testCanPlace(4, 0, (Math.PI * 2), (Math.PI / 24), objAim , 1);
                }

                let checkAim = UTILS.getAngleDist(near.aim2, objAim) <= 1;
                if (inRange && checkAim) {// if got aim to preobject can use him here for preSpikeSync
                    if (checkCanSpikeSync) {
                        if ([3, 4, 5, 8].includes(player.weapons[0]) && !instaC.isTrue) {
                            instaC.canSpikeTick = true;
                        }
                    } else {
                        checkPlace(4, objAim);
                        ShowSettingText(300, "reTrap test", "#00c", findObj);
                    }
                }

                this.replaced = true;
            }
        }, 1);
    }
};
var preIndi = [];
function cplace(id, rad) {
    if (id == undefined) return;
    let item = items.list[player.items[id]];
    let tmpS = player.scale + item.scale + (item.placeOffset || 0);
    let tmpX = player.x2 + tmpS * Math.cos(rad);
    let tmpY = player.y2 + tmpS * Math.sin(rad);
    if (getEl("preIndi").checked) {
        preIndi.push({
            x: tmpX,
            y: tmpY,
            name: item.name,
            scale: item.scale,
            dir: rad
        });
        game.tickBase(() => {
            preIndi.shift();
        }, 1);
        game.tickBase(() => {
            preIndi.shift();
        }, 2);
    }
    if (id === 0 || (player.alive && inGame)) {
        selectToBuild(player.items[id]);
        sendAtck(1, rad);
        selectWeapon(player.weaponCode, 1);
    }
}
class prePlace {
    constructor() { // useless tbh
        this.numberValue = 0;
        this.speed = 0;
        this.delay = 0;
        this.ticks = 2;
        this.ping = window.pingTime;
        this.value = 5;
        this.prePlacer = function() {
            if (!gameObjects.length || !inGame || !enemy.length || !player) return;

            this.Pot = function(obj, user) {
                let weaponIndex = user.weapons[1] === 10 && !player.reloads[user.weapons[1]] ? 1 : 0;
                let weapon = user.weapons[weaponIndex];
                if (player.reloads[weapon]) return 0;
                let itemWeapon = items.weapons[weapon];
                let isNear = UTILS.getDist(obj.x, obj.y, user.x2, user.y2) <= obj.scale + itemWeapon.range;
                return user.visible && isNear ? itemWeapon.dmg * (itemWeapon.sDmg || 1) * 3.3 : 0;
            };

            let lowObjHealth = [];
            for (let i = 0; i < gameObjects.length; i++) {
                let obj = gameObjects[i];
                if (obj.active && obj.health > 0 && UTILS.getDist(obj, player, 0, 2) <= player.scale + obj.scale * 2) {
                    let dmg = this.Pot(obj, player);
                    if (obj.health <= dmg) {
                        lowObjHealth.push(obj);
                    }
                }
            }
            lowObjHealth.sort((a, b) => a.health - b.health);
            let objectss = lowObjHealth.slice(0, Math.min(2, lowObjHealth.length));

            if (objectss.length == 0) return;

            for (let obj of objectss) {
                let angles = Math.atan2(obj.y - player.y2, obj.x - player.x2);
                let enemyTrapped = gameObjects.filter(tmp => tmp.trap && tmp.active && tmp.isTeamObject(player) && UTILS.getDist(tmp, obj, 0, 2) <= obj.scale + tmp.getScale() + 15).sort((a, b) => {
                    return UTILS.getDist(a, obj, 0, 2) - UTILS.getDist(b, obj, 0, 2);
                })[0];
                if (near.dist2 < 300 && player.items[4] == 15) { // dont need notify bc it uses the preplacer circle:
                    if (near.dist2 < 180 && [4,5].includes(player.primaryIndex)) { // i soon improve logic first I remodel the script
                        cplace(2, angles, 1);
                    }
                    if (near.dist2 < 300) {
                        cplace(4, angles, 1);
                    }
                    if (traps.inTrap && near.dist2 < 250 || my.autoPush) {
                        cplace(4, angles);
                    }
                    if (enemyTrapped || enemyTrapped == obj) {
                        cplace(2, near.aim2);
                    }
                }
            }
        };
        this.syncWithServerTicks = function() {
            let nextServerTick = performance.now();
            let currentTime = performance.now();
            let estimatedServerTime = currentTime - window.pingTime / 2;
            let nextExpectedTick = Math.ceil(estimatedServerTime / ticks.tick) * 1000/9;
            nextServerTick = nextExpectedTick > nextServerTick ? nextExpectedTick : nextServerTick + 1000/9;
            let idealSendTime = nextServerTick - window.pingTime / 2 - 1;
            let clientSendTime = idealSendTime + window.pingTime / 2;
            const schedulePre = (t) => {
                if (performance.now() >= t) {
                    this.prePlacer(); // RUN UR PREPLACER HERE
                    nextServerTick += 1000/9;
                    schedulePre(nextServerTick);
                } else {
                    setTimeout(() => schedulePre(nextServerTick));
                }
            };
            let timeUntilSend = clientSendTime - currentTime;
            if (timeUntilSend <= (1000/9)) {
                schedulePre(clientSendTime);
            } else {
                setTimeout(() => schedulePre(clientSendTime), timeUntilSend - 1);
            }
        };
    }
}
let preplaceUsages = new prePlace(); // use
preplaceUsages.syncWithServerTicks(); // call function for loop

class Instakill {
    constructor() {
        this.wait = false;
        this.can = false;
        this.isTrue = false;
        this.nobull = false;
        this.ticking = false;
        this.canSpikeTick = false;
        this.startTick = false;
        this.readyTick = false;
        this.canCounter = false;
        this.revTick = false;
        this.syncHit = false;
        this.changeType = function(type) {
            this.wait = false;
            this.isTrue = true;
            my.autoAim = true;
            let instaLog = [type];
            let backupNobull = near.backupNobull;
            near.backupNobull = false;
            game.tickBase(() => {
                instaLog.push(player.skinIndex);
                game.tickBase(() => {
                    if (near.skinIndex == 22) {
                        near.backupNobull = true;
                    }
                    instaLog.push(player.skinIndex);
                }, 1);
            }, 1);
            if (type == "rev") {
                selectWeapon(player.weapons[1]);
                buyEquip(53, 0);
                buyEquip(21, 1);
                sendAutoGather();
                game.tickBase(() => {
                    selectWeapon(player.weapons[0]);
                    if (near.dist2 <= 140 && getEl("doSpikeOnReverse").checked) checkPlace(2, getAttackDir());
                    buyEquip(7, 0);
                    game.tickBase(() => {
                        sendAutoGather();
                        this.isTrue = false;
                        my.autoAim = false;
                    }, 1);
                }, 1);
            } else if (type == "nobull") {
                buyEquip(7, 0);
                selectWeapon(player.weapons[0]);
                if (near.dist2 <= 140 && getEl("doSpikeOnReverse").checked) checkPlace(2, getAttackDir());
                sendAutoGather();
                game.tickBase(() => {
                    selectWeapon(player.weapons[1]);
                    buyEquip(player.reloads[53] == 0 ? 53 : 6, 0);
                    buyEquip(21, 1);
                    game.tickBase(() => {
                        sendAutoGather();
                        this.isTrue = false;
                        my.autoAim = false;
                    }, 1);
                }, 1);

            } else if (type == "normal") {
                buyEquip(20, 0);
                selectWeapon(player.weapons[0]);
                if (near.dist2 <= 140 && getEl("doSpikeOnReverse").checked) checkPlace(2, getAttackDir());
                buyEquip(7, 0);
                sendAutoGather();
                game.tickBase(() => {
                    selectWeapon(player.weapons[1]);
                    buyEquip(player.reloads[53] == 0 ? 53 : 6, 0);
                    buyEquip(21, 1);
                    game.tickBase(() => {
                        sendAutoGather();
                        this.isTrue = false;
                        my.autoAim = false;
                    }, 1);
                }, 1);
            } else {
                setTimeout(() => {
                    this.isTrue = false;
                    my.autoAim = false;
                }, 50);
            }
        };
        this.counterType = function () {
            if (!getEl("CounterInsta").checked) {
                return;
            }
            this.isTrue = true;
            my.autoAim = true;
            selectWeapon(player.weapons[0]);
            buyEquip(7, 0);
            buyEquip(21, 1);
            sendAutoGather();
            game.tickBase(() => {
                if (player.reloads[53] == 0) {
                    buyEquip(53, 0);
                    buyEquip(21, 1);
                    if ([9, 12, 13, 15].includes(player.weapons[1]) && player.reloads[player.weapons[1]] == 0 && configs.secondaryOnCounter) {
                        selectWeapon(player.weapons[1]);
                    }
                    game.tickBase(() => {
                        sendAutoGather();
                        this.isTrue = false;
                        my.autoAim = false;
                    }, 1);
                } else {
                    if ([9, 12, 13, 15].includes(player.weapons[1]) && player.reloads[player.weapons[1]] == 0 && configs.secondaryOnCounter) {
                        selectWeapon(player.weapons[1]);
                    }
                    game.tickBase(() => {
                        sendAutoGather();
                        this.isTrue = false;
                        my.autoAim = false;
                    }, 1);
                }
            }, 1);
        };
        this.hammerCounterType = function () {
            if (!getEl("CounterInsta").checked) {
                return;
            }
            this.isTrue = true;
            my.autoAim = true;
            if (near.dist2 <= 70 && configs.secondaryOnCounter) {
                selectWeapon(player.weapons[1]);
                if (player.reloads[53] == 0) {
                    buyEquip(53, 0);
                } else {
                    buyEquip(7, 0);
                }
                sendAutoGather();
                game.tickBase(() => {
                    buyEquip(7, 0);
                    selectWeapon(player.weapons[0]);
                    game.tickBase(() => {
                        sendAutoGather();
                        this.isTrue = false;
                        my.autoAim = false;
                    }, 1);
                }, 1);
            } else {
                selectWeapon(player.weapons[0]);
                buyEquip(7, 0);
                sendAutoGather();
                game.tickBase(() => {
                    if (player.reloads[53] == 0) {
                        buyEquip(53, 0);
                    }
                    game.tickBase(() => {
                        sendAutoGather();
                        this.isTrue = false;
                        my.autoAim = false;
                    }, 1);
                }, 1);
            }
        };
        let inantiantibull = false;
        this.antiCounterType = function () {
            my.autoAim = true;
            this.isTrue = true;
            inantiantibull = true;
            selectWeapon(player.weapons[0]);
            buyEquip(6, 0);
            buyEquip(21, 1);
            io.send("D", near.aim2);
            sendAutoGather();
            game.tickBase(() => {
                buyEquip(player.reloads[53] == 0 ? player.skins[53] ? 53 : 6 : 6, 0);
                buyEquip(21, 1);
                game.tickBase(() => {
                    sendAutoGather();
                    this.isTrue = false;
                    my.autoAim = false;
                    inantiantibull = false;
                }, 1);
            }, 1);
        };
        this.spikeTickType = function() {
            ShowSettingText(300, "SpikeTick", "#f00");
            this.isTrue = true;
            my.autoAim = true;
            selectWeapon(player.weapons[0]);
            buyEquip(7, 0);
            sendAutoGather();
            game.tickBase(() => {
                selectWeapon(player.weapons[0]);
                buyEquip(53, 0);
                game.tickBase(() => {
                    sendAutoGather();
                    this.isTrue = false;
                    my.autoAim = false;
                }, 1);
            }, 1);
        };
        this.AutoSync = function() {
            this.isTrue = true;
            my.autoAim = true;
            selectWeapon(player.weapons[0]);
            buyEquip(7, 0);
            sendAutoGather();
            game.tickBase(() => {
                selectWeapon(player.weapons[0]);
                buyEquip(53, 0);
                game.tickBase(() => {
                    sendAutoGather();
                    this.isTrue = false;
                    my.autoAim = false;
                }, 1);
            }, 1);
        };
        this.syncTry = function() {
            buyEquip(53, 0);
            game.tickBase(() => {
                this.isTrue = true;
                my.autoAim = true;
                selectWeapon(player.weapons[1]);
                sendAutoGather();
                game.tickBase(() => {
                    my.autoAim = false;
                    this.isTrue = false;
                    sendAutoGather();
                }, 1);
            }, 2);
        };
        this.MapSync = function() {
            let nearDistCheck;
            nearDistCheck = (near.dist2 <= 300) ? 1 : 2
            buyEquip(53, 0);
            game.tickBase(() => {
                selectWeapon(player.weapons[1]);
                sendAutoGather();
                this.isTrue = true;
                my.autoAim = true;
                game.tickBase(() => {
                    my.autoAim = false;
                    this.isTrue = false;
                    sendAutoGather();
                }, 1);
            }, nearDistCheck);
        };
        this.rangeType = function(type) {
            this.isTrue = true;
            my.autoAim = true;
            if (type == "ageInsta") {
                my.ageInsta = false;
                if (player.items[5] == 18) {
                    place(5, near.aim2);
                }
                packet("9", undefined, 1);
                buyEquip(22, 0);
                buyEquip(21, 1);
                game.tickBase(() => {
                    selectWeapon(player.weapons[1]);
                    buyEquip(53, 0);
                    buyEquip(21, 1);
                    sendAutoGather();
                    game.tickBase(() => {
                        sendUpgrade(12);
                        selectWeapon(player.weapons[1]);
                        buyEquip(53, 0);
                        buyEquip(21, 1);
                        game.tickBase(() => {
                            sendUpgrade(15);
                            selectWeapon(player.weapons[1]);
                            buyEquip(53, 0);
                            buyEquip(21, 1);
                            game.tickBase(() => {
                                sendAutoGather();
                                this.isTrue = false;
                                my.autoAim = false;
                            }, 1);
                        }, 1);
                    }, 1);
                }, 1);
            } else {
                selectWeapon(player.weapons[1]);
                if (player.reloads[53] == 0 && near.dist2 <= 700 && near.skinIndex != 22) {
                    buyEquip(53, 0);
                } else {
                    buyEquip(20, 0);
                }
                buyEquip(11, 1);
                sendAutoGather();
                game.tickBase(() => {
                    sendAutoGather();
                    this.isTrue = false;
                    my.autoAim = false;
                }, 1);
            }
        };
        this.threeOneTickType = function() {
            io.send("");
            this.isTrue = true;
            my.autoAim = true;
            selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
            biomeGear();
            buyEquip(0, 1);
            packet("9", near.aim2, 1);
            game.tickBase(() => {
                selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                buyEquip(53, 0);
                buyEquip(0, 1);
                packet("9", near.aim2, 1);
                game.tickBase(() => {
                    selectWeapon(player.weapons[0]);
                    buyEquip(7, 0);
                    buyEquip(0, 1);
                    sendAutoGather();
                    packet("9", near.aim2, 1);
                    game.tickBase(() => {
                        sendAutoGather();
                        this.isTrue = false;
                        my.autoAim = false;
                        packet("9", undefined, 1);
                    }, 1);
                }, 1);
            }, 1);
        };
        /* end shit */
        this.VelocityTickorBow = function() { // Stary Code
            this.isTrue = true;
            my.autoAim = true;
            biomeGear();
            buyEquip(19, 1);
            packet("9", near.aim2, 1);
            game.tickBase(() => {
                if (player.weapons[1] == 15) {
                    my.revAim = true;
                }
                selectWeapon(player.weapons[[9, 12, 13, 15].includes(player.weapons[1]) ? 1 : 0]);
                buyEquip(53, 0);
                buyEquip(21, 1);
                if ([9, 12, 13, 15].includes(player.weapons[1])) {
                    sendAutoGather();
                }
                packet("9", near.aim2, 1);
                game.tickBase(() => {
                    my.revAim = false;
                    selectWeapon(player.weapons[0]);
                    buyEquip(7, 0);
                    buyEquip(18, 1);
                    if (![9, 12, 13, 15].includes(player.weapons[1])) {
                        sendAutoGather();
                    }
                    packet("9", near.aim2, 1);
                    game.tickBase(() => {
                        sendAutoGather();
                        this.isTrue = false;
                        my.autoAim = false;
                        packet("9", undefined, 1);
                    }, 2);
                }, 1);
            }, 1);
        };
        this.kmTickType = function() {
            this.isTrue = true;
            my.autoAim = true;
            my.revAim = true;
            selectWeapon(player.weapons[1]);
            buyEquip(53, 0);
            buyEquip(0, 1);
            sendAutoGather();
            packet("9", near.aim2, 1);
            game.tickBase(() => {
                my.revAim = false;
                selectWeapon(player.weapons[0]);
                buyEquip(7, 0);
                buyEquip(0, 1);
                packet("9", near.aim2, 1);
                game.tickBase(() => {
                    sendAutoGather();
                    this.isTrue = false;
                    my.autoAim = false;
                    packet("9", undefined, 1);
                }, 1);
            }, 1);
        };
        this.OneTickType = function() { // Stary Code
            this.isTrue = true;
            my.autoAim = true;
            biomeGear();
            buyEquip(19, 1);
            packet("9", near.aim2, 1);
            game.tickBase(() => {
                if (player.weapons[1] == 15) {
                    my.revAim = true;
                }
                selectWeapon(player.weapons[[9, 12, 13, 15].includes(player.weapons[1]) ? 1 : 0]);
                buyEquip(53, 0);
                buyEquip(21, 1);
                if ([9, 12, 13, 15].includes(player.weapons[1])) {
                    sendAutoGather();
                }
                packet("9", near.aim2, 1);
                game.tickBase(() => {
                    my.revAim = false;
                    selectWeapon(player.weapons[0]);
                    buyEquip(7, 0);
                    buyEquip(18, 1);
                    if (![9, 12, 13, 15].includes(player.weapons[1])) {
                        sendAutoGather();
                    }
                    packet("9", near.aim2, 1);
                    game.tickBase(() => {
                        sendAutoGather();
                        this.isTrue = false;
                        my.autoAim = false;
                        packet("9", undefined, 1);
                    }, 2);
                }, 1);
            }, 1);
        };
        this.BoostOneTICKERS = function() { // Stary Code
            this.isTrue = true;
            my.autoAim = true;
            biomeGear();
            buyEquip(19, 1);
            packet("9", near.aim2, 1);
            game.tickBase(() => {
                selectWeapon(player.weapons[0]);
                buyEquip(53, 0);
                buyEquip(21, 1);
                packet("9", near.aim2, 1);
                place(4, near.aim2);
                game.tickBase(() => {
                    my.revAim = false;
                    selectWeapon(player.weapons[0]);
                    buyEquip(7, 0);
                    buyEquip(18, 1);
                    sendAutoGather();
                    packet("9", near.aim2, 1);
                    game.tickBase(() => {
                        sendAutoGather();
                        this.isTrue = false;
                        my.autoAim = false;
                        packet("9", undefined, 1);
                    }, 5);
                }, 1);
            }, 1);
        };
        this.PerfectedBoostSpiketick = function() { // Stary Code
            this.isTrue = true;
            my.autoAim = true;
            biomeGear();
            buyEquip(19, 1);
            packet("9", near.aim2, 1);
            game.tickBase(() => {
                selectWeapon(player.weapons[0]);
                buyEquip(53, 0);
                buyEquip(21, 1);
                packet("9", near.aim2, 1);
                place(4, near.aim2);
                game.tickBase(() => {
                    my.revAim = false;
                    selectWeapon(player.weapons[0]);
                    buyEquip(7, 0);
                    place(2, getAttackDir());
                    buyEquip(18, 1);
                    sendAutoGather();
                    packet("9", near.aim2, 1);
                    game.tickBase(() => {
                        sendAutoGather();
                        this.isTrue = false;
                        my.autoAim = false;
                        packet("9", undefined, 1);
                    }, 5);
                }, 1);
            }, 1);
        };
        this.boostTickType = function() { // Stary Code
            /*this.isTrue = true;
                        my.autoAim = true;
                        selectWeapon(player.weapons[0]);
                        buyEquip(53, 0);
                        buyEquip(11, 1);
                        packet("f", near.aim2);
                        game.tickBase(() => {
                            place(4, near.aim2);
                            selectWeapon(player.weapons[1]);
                            biomeGear();
                            buyEquip(11, 1);
                            sendAutoGather();
                            packet("f", near.aim2);
                            game.tickBase(() => {
                                selectWeapon(player.weapons[0]);
                                buyEquip(7, 0);
                                buyEquip(19, 1);
                                packet("f", near.aim2);
                                game.tickBase(() => {
                                    sendAutoGather();
                                    this.isTrue = false;
                                    my.autoAim = false;
                                    packet("f", undefined);
                                }, 1);
                            }, 1);
                        }, 1);*/
            this.isTrue = true;
            my.autoAim = true;
            biomeGear();
            buyEquip(11, 1);
            packet("9", near.aim2, 1);
            game.tickBase(() => {
                if (player.weapons[1] == 15) {
                    my.revAim = true;
                }
                selectWeapon(player.weapons[[9, 12, 13, 15].includes(player.weapons[1]) ? 1 : 0]);
                buyEquip(53, 0);
                buyEquip(11, 1);
                if ([9, 12, 13, 15].includes(player.weapons[1])) {
                    sendAutoGather();
                }
                packet("9", near.aim2, 1);
                place(4, near.aim2);
                game.tickBase(() => {
                    my.revAim = false;
                    selectWeapon(player.weapons[0]);
                    buyEquip(7, 0);
                    buyEquip(0, 1);
                    if (![9, 12, 13, 15].includes(player.weapons[1])) {
                        sendAutoGather();
                    }
                    packet("9", near.aim2, 1);
                    game.tickBase(() => {
                        sendAutoGather();
                        this.isTrue = false;
                        my.autoAim = false;
                        packet("9", undefined, 1);
                    }, 5);
                }, 1);
            }, 1);
        };
        this.gotoGoal = function(goto, OT) {
            let slowDists = (weeeee) => weeeee * config.playerScale;
            let goal = {
                a: goto - OT,
                b: goto + OT,
                c: goto - slowDists(1),
                d: goto + slowDists(1),
                e: goto - slowDists(2),
                f: goto + slowDists(2),
                g: goto - slowDists(4),
                h: goto + slowDists(4)
            };
            let bQ = function (wwww, awwww) {
                if (player.y2 >= config.mapScale / 2 - config.riverWidth / 2 && player.y2 <= config.mapScale / 2 + config.riverWidth / 2 && awwww == 0) {
                    buyEquip(31, 0);
                } else {
                    buyEquip(wwww, awwww);
                }
            }
            if (enemy.length) {
                let dst = near.dist2;
                this.ticking = true;
                if (dst >= goal.a && dst <= goal.b) {
                    bQ(22, 0);
                    bQ(11, 1);
                    if (player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0] || player.buildIndex > -1) {
                        selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                    }
                    return {
                        dir: undefined,
                        action: 1
                    };
                } else {
                    if (dst < goal.a) {
                        if (dst >= goal.g) {
                            if (dst >= goal.e) {
                                if (dst >= goal.c) {
                                    bQ(40, 0);
                                    bQ(10, 1);
                                    if (false) {
                                        player.buildIndex != player.items[1] && selectToBuild(player.items[1]);
                                    } else {
                                        if ((player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]) || player.buildIndex > -1) {
                                            selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                                        }
                                    }
                                } else {
                                    bQ(22, 0);
                                    bQ(0, 1);
                                    if ((player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]) || player.buildIndex > -1) {
                                        selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                                    }
                                }
                            } else {
                                bQ(6, 0);
                                bQ(0, 1);
                                if ((player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]) || player.buildIndex > -1) {
                                    selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                                }
                            }
                        } else {
                            biomeGear();
                            bQ(11, 1);
                            if ((player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]) || player.buildIndex > -1) {
                                selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                            }
                        }
                        return {
                            dir: near.aim2 + Math.PI,
                            action: 0
                        };
                    } else if (dst > goal.b) {
                        if (dst <= goal.h) {
                            if (dst <= goal.f) {
                                if (dst <= goal.d) {
                                    bQ(40, 0);
                                    bQ(0, 1);
                                    if (false) {
                                        player.buildIndex != player.items[1] && selectToBuild(player.items[1]);
                                    } else {
                                        if ((player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]) || player.buildIndex > -1) {
                                            selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                                        }
                                    }
                                } else {
                                    bQ(22, 0);
                                    bQ(0, 1);
                                    if ((player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]) || player.buildIndex > -1) {
                                        selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                                    }
                                }
                            } else {
                                bQ(6, 0);
                                bQ(0, 1);
                                if ((player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]) || player.buildIndex > -1) {
                                    selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                                }
                            }
                        } else {
                            biomeGear();
                            bQ(11, 1);
                            if ((player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]) || player.buildIndex > -1) {
                                selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                            }
                        }
                        return {
                            dir: near.aim2,
                            action: 0
                        };
                    }
                    return {
                        dir: undefined,
                        action: 0
                    };
                }
            } else {
                this.ticking = false;
                return {
                    dir: undefined,
                    action: 0
                };
            }
        }
        /** wait 1 tick for better quality */
        this.bowMovement = function() {
            let moveMent = this.gotoGoal(685, 3);
            if (moveMent.action) {
                if (player.reloads[53] == 0 && !this.isTrue) {
                    this.rangeType("ageInsta");
                } else {
                    packet("9", moveMent.dir, 1);
                }
            } else {
                packet("9", moveMent.dir, 1);
            }
        },
            this.tickMovement = function() {
            let dist = player.weapons[1] == 9 ? 245 : 245;
            let actionDist = player.weapons[1] == 9 ? 2 : player.weapons[1] == 12 ? 1.5 : player.weapons[1] == 13 ? 1 : player.weapons[1] == 15 ? 2 : 3;
            let moveMent = this.gotoGoal(245, 3);
            if (moveMent.action) {
                if (player.reloads[53] == 0 && !this.isTrue) {
                    this.OneTickType();
                } else {
                    packet("9", moveMent.dir, 1);
                }
            } else {
                packet("9", moveMent.dir, 1);
            }
        },
            this.VelocityOneTick = function() {
            let dist = player.weapons[1] == 9 ? 240 : 240;
            let actionDist = player.weapons[1] == 9 ? 2 : player.weapons[1] == 12 ? 1.5 : player.weapons[1] == 13 ? 1 : player.weapons[1] == 15 ? 2 : 3;
            let moveMent = this.gotoGoal(238, 3);
            if (moveMent.action) {
                if (player.reloads[53] == 0 && !this.isTrue) {
                    this.VelocityTickorBow();
                } else {
                    packet("9", moveMent.dir, 1);
                }
            } else {
                packet("9", moveMent.dir, 1);
            }
            let trapped = false;
            let trapsInRange = gameObjects.filter(trap => {
                if (trap.trap && trap.active && trap.isTeamObject(player)) {
                    return UTILS.getDist(trap, near, 0, 2) <= (near.scale + trap.getScale() + 15);
                }
                return false;
            });
            if (trapsInRange.length > 0) {
                trapped = true;
            }
            if (!trapped && getEl("VelocityOneTick").checked && player.reloads[player.weapons[0]] == 0 && player.reloads[53] == 0 && player.weapons[0] == 5 && near.dist2 > 0 && near.dist2 <= 245 && near.skinIndex != 6) {
                let oneFrameMovement = { x: moveMent.dir % 2 ? 1 : -1, y: 0 };
                let oneFramePacket = { type: "move", x: oneFrameMovement.x, y: oneFrameMovement.y };
                let nextPacket = { type: "move", x: near.aim2 % 2 ? 1 : -1, y: 0 };
                game.sendPacket(oneFramePacket);
                game.tickBase(() => {
                    game.sendPacket(nextPacket);
                });
                instaC.VelocityTickorBow();
            }
        },
            this.kmTickMovement = function() {
            let moveMent = this.gotoGoal(240, 3);
            if (moveMent.action) {
                if (near.skinIndex != 22 && player.reloads[53] == 0 && !this.isTrue && ((game.tick - near.poisonTick) % config.serverUpdateRate == 8)) {
                    this.kmTickType();
                } else {
                    packet("9", moveMent.dir, 1);
                }
            } else {
                packet("9", moveMent.dir, 1);
            }
        },
            this.BoostOneTick = function() {
            let dist = player.weapons[1] == 9 ? 365 : player.weapons[1] == 12 ? 380 : player.weapons[1] == 13 ? 365 : player.weapons[1] == 15 ? 365 : 370;
            let actionDist = player.weapons[1] == 9 ? 2 : player.weapons[1] == 12 ? 1.5 : player.weapons[1] == 13 ? 1 : player.weapons[1] == 15 ? 2 : 3;
            let moveMent = this.gotoGoal(372, 3);
            if (moveMent.action) {
                if (player.reloads[53] == 0 && !this.isTrue) {
                    this.BoostOneTICKERS();
                } else {
                    packet("9", moveMent.dir, 1);
                }
            } else {
                packet("9", moveMent.dir, 1);
            }
        }
        this.BoostPerfectedSpiketick = function() {
            let dist = player.weapons[1] == 9 ? 365 : player.weapons[1] == 12 ? 380 : player.weapons[1] == 13 ? 365 : player.weapons[1] == 15 ? 365 : 370;
            let actionDist = player.weapons[1] == 9 ? 2 : player.weapons[1] == 12 ? 1.5 : player.weapons[1] == 13 ? 1 : player.weapons[1] == 15 ? 2 : 3;
            let moveMent = this.gotoGoal(372, 3);
            if (moveMent.action) {
                if (player.reloads[53] == 0 && !this.isTrue) {
                    this.PerfectedBoostSpiketick();
                } else {
                    packet("9", moveMent.dir, 1);
                }
            } else {
                packet("9", moveMent.dir, 1);
            }
        }
        this.boostTickMovement = function() {
            let dist = player.weapons[1] == 9 ? 365 : player.weapons[1] == 12 ? 380 : player.weapons[1] == 13 ? 365 : player.weapons[1] == 15 ? 365 : 370;
            let actionDist = player.weapons[1] == 9 ? 2 : player.weapons[1] == 12 ? 1.5 : player.weapons[1] == 13 ? 1 : player.weapons[1] == 15 ? 2 : 3;
            let moveMent = this.gotoGoal(372, 3);
            if (moveMent.action) {
                if (player.reloads[53] == 0 && !this.isTrue) {
                    this.boostTickType();
                } else {
                    packet("9", moveMent.dir, 1);
                }
            } else {
                packet("9", moveMent.dir, 1);
            }
        }
        /** wait 1 tick for better quality */
        this.perfCheck = function(pl, nr) {
            if (nr.weaponIndex == 11 && UTILS.getAngleDist(nr.aim2 + Math.PI, nr.d2) <= config.shieldAngle) return false;
            if (![9, 12, 13, 15].includes(player.weapons[1])) return true;
            let pjs = {
                x: nr.x2 + (70 * Math.cos(nr.aim2 + Math.PI)),
                y: nr.y2 + (70 * Math.sin(nr.aim2 + Math.PI))
            };
            if (UTILS.lineInRect(pl.x2 - pl.scale, pl.y2 - pl.scale, pl.x2 + pl.scale, pl.y2 + pl.scale, pjs.x, pjs.y, pjs.x, pjs.y)) {
                return true;
            }
            let finds = ais.filter(tmp => tmp.visible).find((tmp) => {
                if (UTILS.lineInRect(tmp.x2 - tmp.scale, tmp.y2 - tmp.scale, tmp.x2 + tmp.scale, tmp.y2 + tmp.scale, pjs.x, pjs.y, pjs.x, pjs.y)) {
                    return true;
                }
            });
            if (finds) return false;
            finds = closeObjects.filter(tmp => tmp.active).find((tmp) => {
                let tmpScale = tmp.getScale();
                if (!tmp.ignoreCollision && UTILS.lineInRect(tmp.x - tmpScale, tmp.y - tmpScale, tmp.x + tmpScale, tmp.y + tmpScale, pjs.x, pjs.y, pjs.x, pjs.y)) {
                    return true;
                }
            });
            if (finds) return false;
            return true;
        }
    }
};

class Autobuy {
    constructor(buyHat, buyAcc) {
        this.hat = function() {
            buyHat.forEach((id) => {
                let find = findID(hats, id);
                if (find && !player.skins[id] && player.points >= find.price) packet("c", 1, id, 0);
            });
        };
        this.acc = function() {
            buyAcc.forEach((id) => {
                let find = findID(accessories, id);
                if (find && !player.tails[id] && player.points >= find.price) packet("c", 1, id, 1);
            });
        };
    }
};

class Damages {
    constructor(items) {
        // 0.75 1 1.125 1.5
        this.calcDmg = function(dmg, val) {
            return dmg * val;
        };
        this.getAllDamage = function(dmg) {
            return [this.calcDmg(dmg, 0.75), dmg, this.calcDmg(dmg, 1.125), this.calcDmg(dmg, 1.5)];
        };
        this.weapons = [];
        for (let i = 0; i < items.weapons.length; i++) {
            let wp = items.weapons[i];
            let name = wp.name.split(" ").length <= 1 ? wp.name : (wp.name.split(" ")[0] + "_" + wp.name.split(" ")[1]);
            this.weapons.push(this.getAllDamage(i > 8 ? wp.Pdmg : wp.dmg));
            this[name] = this.weapons[i];
        }
    }
}

/** CLASS CODES */
// jumpscare code warn
let tmpList = [];

// LOADING:
let UTILS = new Utils();
let items = new Items();
let itemsWeapons = Items.weapons;
let objectManager = new Objectmanager(GameObject, gameObjects, UTILS, config);
let store = new Store();
let hats = store.hats;
let accessories = store.accessories;
let projectileManager = new ProjectileManager(Projectile, projectiles, players, ais, objectManager, items, config, UTILS);
let aiManager = new AiManager(ais, AI, players, items, null, config, UTILS);
let textManager = new Textmanager();
// let sCombat = new Combat(UTILS, items);
let traps = new Traps(UTILS, items);
let instaC = new Instakill();
let autoBuy = new Autobuy([40, 6, 7, 22, 53, 15, 31], [11, 21, 18, 13]);
let spikes = {
    aim: 0,
    inRange: false,
    info: {}
}
let lastDeath;
let minimapData;
let mapMarker = {};
let mapPings = [];
let tmpPing;

let breakTrackers = [];

function sendChat(message) {
    packet("6", message.slice(0, 30));
}

let runAtNextTick = [];

const turretAnti = (tmpObj) => {
    if (tmpObj.dist2 <= 300 && player.alive) {
        if (enemy.includes(tmpObj)) {
            if(near.primaryIndex == 5 && config.weaponVariants[tmpObj.primaryVariant].id >= 2) {
                buyEquip(6, 0);
                my.anti0Tick = true;
            }
        }
    }
}
function checkProjectileHolder(x, y, dir, range, speed, indx, layer, sid) {
    let weaponIndx = indx == 0 ? 9 : indx == 2 ? 12 : indx == 3 ? 13 : indx == 5 && 15;
    let projOffset = config.playerScale * 2;
    let projXY = {
        x: indx == 1 ? x : x - projOffset * Math.cos(dir),
        y: indx == 1 ? y : y - projOffset * Math.sin(dir),
    };
    let nearPlayer = players.filter((e) => player.visible && UTILS.getDist(projXY, e, 0, 2) <= player.scale).sort(function (a, b) {
        return UTILS.getDist(projXY, a, 0, 2) - UTILS.getDist(projXY, b, 0, 2);
    })[0];
    if (nearPlayer) {
        if (indx == 1) {
            nearPlayer.shooting[53] = 1;
            turretAnti(nearPlayer);
        } else {
            nearPlayer.shootIndex = weaponIndx;
            nearPlayer.shooting[1] = 1;
            antiProj(nearPlayer, dir, range, speed, indx, weaponIndx);
        }
    }
}
let projectileCount = 0;
function notif(title, description) {
    let mouseCoord = player;
    let m = textManager;
    if (typeof title !== "undefined") {
        m.showText(mouseCoord.x, mouseCoord.y, 40, .18, 500, title, "white");
    }
    if (typeof description !== "undefined") {
        m.showText(mouseCoord.x, mouseCoord.y + 40, 30, .18, 500, description, "white");
    }
}
// LATER:
function predictHeal(times) {
    for (let i = 0; i < times; i++) {
        place(0, getAttackDir());
    }
}
function antiProj(tmpObj, dir, range, speed, index, weaponIndex, indx, y, x) {
    let weaponIndx = indx == 0 ? 9 : indx == 2 ? 12 : indx == 3 ? 13 : indx == 5 && 15;
    let projOffset = config.playerScale * 2;
    let projXY = {
        x: indx == 1 ? x : x - projOffset * Math.cos(dir),
        y: indx == 1 ? y : y - projOffset * Math.sin(dir),
    };
    let fixXY = function(tmpObj) {
        return {
            x2: UTILS.fixTo(tmpObj.x2, 2),
            y2: UTILS.fixTo(tmpObj.y2, 2),
        };
    };
    let nearPlayer = players.filter((e)=>e.visible && UTILS.getDist(projXY, e, 0, 2) <= e.scale).sort(function(a, b) {
        return (UTILS.getDist(projXY, a, 0, 2) - UTILS.getDist(projXY, b, 0, 2));
    })[0];
    if (!tmpObj.isTeam(player)) {
        tmpDir = UTILS.getDirect(player, tmpObj, 2, 2);
        if (UTILS.getAngleDist(tmpDir, dir) <= 0.2) {
            tmpObj.bowThreat[weaponIndex]++;
            if (index == 5) {
                projectileCount++;
            }
            if (enemy) {
                let enemyIndex = enemy.index;
                if (index == 1 || index == 2 || index == 3 || index == 5 || index == 13 || index == 14 || index == 15) {
                    player.shooting[53] = 1;
                    setTimeout(() => {
                        player.shooting[53] = 0;
                    }, range / speed);
                }

                player.bowThreat[index]++;
                setTimeout(() => {
                    player.bowThreat[index]--;
                }, range / speed);
            }
            if (tmpObj.bowThreat[9] >= 1 && (tmpObj.bowThreat[12] >= 1 || tmpObj.bowThreat[15] >= 1)) {
                place(3, tmpObj.aim2);
                buyEquip(22, 0);
                game.tickBase(() => {
                    buyEquip(6, 0);
                }, 1);
                my.anti0Tick = 4;
                if (!my.antiSync) {
                    antiSyncHealing(4);
                    packet("9", tmpObj.aim2+3.1415926535897932/2, 1)
                    game.tickBase(() => {
                        packet("9", undefined, 1)
                    }, 2)
                }
            }
        } else {
            if (near.dist2 < 550) {
                if (projectileCount >= 2) {
                    place(3, tmpObj.aim2);
                    packet("9", tmpObj.aim2+3.1415926535897932/2, 1)
                    my.anti0Tick = 4;
                    predictHeal(2)
                    game.tickBase(() => {
                        packet("9", undefined, 1)
                    }, 4)
                    if (!my.antiSync) {
                        antiSyncHealing(4);
                    }
                } else {
                    if (projectileCount === 1 && near.reloads[near.weapons[0]] == 0 && near.dist2 < items.weapons[near.weapons[0]].range + player.scale * 1.8) {
                        buyEquip(6, 0);
                        buyEquip(21, 1);
                    }
                }
            }
        }
    }
}

// SHOW ITEM INFO:
function showItemInfo(item, isWeapon, isStoreItem) {
    if (player && item) {
        UTILS.removeAllChildren(itemInfoHolder);
        itemInfoHolder.classList.add("visible");
        UTILS.generateElement({
            id: "itemInfoName",
            text: UTILS.capitalizeFirst(item.name),
            parent: itemInfoHolder
        });
        UTILS.generateElement({
            id: "itemInfoDesc",
            text: item.desc,
            parent: itemInfoHolder
        });
        if (isStoreItem) {

        } else if (isWeapon) {
            UTILS.generateElement({
                class: "itemInfoReq",
                text: !item.type ? "primary" : "secondary",
                parent: itemInfoHolder
            });
        } else {
            for (let i = 0; i < item.req.length; i += 2) {
                UTILS.generateElement({
                    class: "itemInfoReq",
                    html: item.req[i] + "<span class='itemInfoReqVal'> x" + item.req[i + 1] + "</span>",
                    parent: itemInfoHolder
                });
            }
            if (item.group.limit) {
                UTILS.generateElement({
                    class: "itemInfoLmt",
                    text: (player.itemCounts[item.group.id] || 0) + "/" + (config.isSandbox ? 99 : item.group.limit),
                    parent: itemInfoHolder
                });
            }
        }
    } else {
        itemInfoHolder.classList.remove("visible");
    }
}

// RESIZE:
window.addEventListener("resize", UTILS.checkTrusted(resize));

function resize() {
    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;
    let scaleFillNative = Math.max(screenWidth / maxScreenWidth, screenHeight / maxScreenHeight) * pixelDensity;
    gameCanvas.width = screenWidth * pixelDensity;
    gameCanvas.height = screenHeight * pixelDensity;
    gameCanvas.style.width = screenWidth + "px";
    gameCanvas.style.height = screenHeight + "px";
    mainContext.setTransform(
        scaleFillNative, 0,
        0, scaleFillNative,
        (screenWidth * pixelDensity - (maxScreenWidth * scaleFillNative)) / 2,
        (screenHeight * pixelDensity - (maxScreenHeight * scaleFillNative)) / 2
    );
}
resize();

// MOUSE INPUT:
var usingTouch;
const mals = document.getElementById('touch-controls-fullscreen');
mals.style.display = 'block';
mals.addEventListener("mousemove", gameInput, false);

function gameInput(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
}
let clicks = {
    left: false,
    middle: false,
    right: false,
};
mals.addEventListener("mousedown", mouseDown, false);

function mouseDown(e) {
    if (attackState != 1) {
        attackState = 1;
        if (e.button == 0) {
            clicks.left = true;
        } else if (e.button == 1 || e.key === 'b') {
            clicks.middle = true;
        } else if (e.button == 2) {
            clicks.right = true;
        }
    }
}
mals.addEventListener("mouseup", UTILS.checkTrusted(mouseUp));

function mouseUp(e) {
    if (attackState != 0) {
        attackState = 0;
        if (e.button == 0) {
            clicks.left = false;
        } else if (e.button == 1 || e.key === 'b') {
            clicks.middle = false;
        } else if (e.button == 2) {
            clicks.right = false;
        }
    }
}
mals.addEventListener("wheel", wheel, false);

let wbe = 1;
function wheel(e) {
    if (e.deltaY < 0) {
        wbe -= 0.05;
        maxScreenWidth = config.maxScreenWidth * wbe;
        maxScreenHeight = config.maxScreenHeight * wbe;
        resize()
    } else {
        wbe += 0.05;
        maxScreenWidth = config.maxScreenWidth * wbe;
        maxScreenHeight = config.maxScreenHeight * wbe;
        resize()
    }
}


// INPUT UTILS:
function getMoveDir() {
    let dx = 0;
    let dy = 0;
    for (let key in moveKeys) {
        let tmpDir = moveKeys[key];
        dx += !!keys[key] * tmpDir[0];
        dy += !!keys[key] * tmpDir[1];
    }
    return dx == 0 && dy == 0 ? undefined : Math.atan2(dy, dx);
}

let checkDist = 75;
let plusDir = 0;
let lastSpin = Date.now();
function getSafeDir() {
    if (!player) return 0;
    lastDir = Math.atan2(mouseY - screenHeight / 2, mouseX - screenWidth / 2);
    return lastDir || 0;
}


function doesCircleIntersectSector(obj, radius, sectorMidpoint, weaponRadius) {
    const unhittableRadius = player.scale * 1.5;
    const weaponAngle = Math.PI / 2.6 / 2;
    const angleStep = Math.PI / 8;

    const normalize = (angle) => (angle + Math.PI * 2) % (Math.PI * 2) - Math.PI;
    const normalizedSectorStart = normalize(sectorMidpoint - weaponAngle);
    const normalizedSectorEnd = normalize(sectorMidpoint + weaponAngle);

    for (let angleOffset = -Math.PI; angleOffset < Math.PI; angleOffset += angleStep) {
        const edgeX = obj.x + radius * Math.cos(angleOffset);
        const edgeY = obj.y + radius * Math.sin(angleOffset);

        const angleToEdge = Math.atan2(edgeY - player.y2, edgeX - player.x2);
        const distanceToEdge = Math.hypot(edgeY - player.y2, edgeX - player.x2);

        const normalizedAngleToEdge = normalize(angleToEdge);

        if (distanceToEdge >= unhittableRadius && distanceToEdge <= weaponRadius) {
            return (normalizedSectorStart <= normalizedSectorEnd)
                ? (normalizedAngleToEdge >= normalizedSectorStart && normalizedAngleToEdge <= normalizedSectorEnd)
            : (normalizedAngleToEdge >= normalizedSectorStart || normalizedAngleToEdge <= normalizedSectorEnd);
        }
    }

    return false;
}

function canHitBothObjects(obj1, obj1Radius, obj2, obj2Radius, weaponRange) {
    const obj1Angle = Math.atan2(obj1.y - player.y2, obj1.x - player.x2);
    const obj2Angle = Math.atan2(obj2.y - player.y2, obj2.x - player.x2);

    let midpointAngle = (obj1Angle + obj2Angle) / 2;
    if (Math.abs(obj1Angle - obj2Angle) > Math.PI) {
        midpointAngle += Math.PI;
        midpointAngle = (midpointAngle + Math.PI) % (2 * Math.PI) - Math.PI;
    }

    const obj1InRange = doesCircleIntersectSector(obj1, obj1Radius, midpointAngle, weaponRange);
    const obj2InRange = doesCircleIntersectSector(obj2, obj2Radius, midpointAngle, weaponRange);

    return [obj1InRange && obj2InRange, obj1Angle, obj2Angle, midpointAngle];
}

function getPredictTrapAim() {
    const checkObj = traps.hasSpike && objectManager.hitsToBreak(traps.info[1], player) <= objectManager.hitsToBreak(traps.info[0], player) ? traps.info[1] : traps.info[0];
    const weapon = traps.notFast(checkObj) ? player.weapons[1] : player.weapons[0];
    const weaponRange = items.weapons[weapon].range + player.scale + (traps.hasSpike ? traps.info[1].scale / 3.25 : 0);
    let bestAim = traps.aim;

    if (traps.hasSpike && objectManager.canHit(player, traps.info[1], weapon)) {
        const calculationStuff = canHitBothObjects(traps.info[0], 50, traps.info[1], 50, weaponRange);
        if (calculationStuff[0]) {
            bestAim = calculationStuff[3];
        } else if (checkObj.sid === traps.info[1].sid) {
            bestAim = calculationStuff[2];
        }
    }

    return bestAim;
}

let spinner;
let spinDir = 0;
function getAttackDir(debug) {
    if (!player) return 0;

    let nearAim = my.autoAim || (
        ((clicks.left && near.dist2 <= 350) || (useWasd && near.dist2 <= items.weapons[player.weapons[0]].range + near.scale * 1.8 && !traps.inTrap))
        && player.reloads[player.weapons[0]] === 0
    );
    let aimToTrap = traps.inTrap && player.reloads[traps.notFast(traps.info[1] || traps.info[0]) ? player.weapons[1] : player.weapons[0]] == 0;
    let rightClickAim = clicks.right && player.reloads[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0;

    if (nearAim) {
        lastDir = getEl("weaponGrind").checked ? getSafeDir() : enemy.length ? my.revAim ? (near.aim2 + Math.PI) : near.aim2 : getSafeDir();
    } else if (rightClickAim) {
        lastDir = getSafeDir();
    } else if (aimToTrap) {
        lastDir = getPredictTrapAim();
    } else if (spikes.inRange && configs.doAutoBreakSpike && player.reloads[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0) {
        lastDir = spikes.aim;
    } else if (breakSpike.active) {
        lastDir = breakSpike.aim;
    } else if (spinner) {
        let spinSpeed = parseFloat();
        if (spinSpeed > 0) {
            spinDir += (Math.PI / 10) * spinSpeed;
        } else {
            spinDir = 0;
        }
        return spinDir;
    } else {
        if (!player.lockDir) {
            if (configs.noDir) {
                lastDir = lastDir;
            } else {
                lastDir = getSafeDir();
            }
        }
    }

    return lastDir || 0;
}
function spin() {
    let random = [2, 3, 4, 5, 7, 3, 23, -1];
    setTimeout(() => {
        spinner = true;
        setTimeout(() => {
            spinner = false;
        }, random[Math.floor(Math.random() * random.length)]);
    }, 1);
}
if (configs.spin && !(clicks.middle || clicks.left || clicks.right) && !my.waitHit && !traps.inTrap) {
    spinner = true;
} else {
    spinner = false;
}

function getVisualDir() {
    if (!player) return 0;
    let dx = mouseX - screenWidth / 2;
    let dy = mouseY - screenHeight / 2;
    let direction = Math.atan2(dy, dx);
    return direction;
}
// KEYS:
function keysActive() {
    return (allianceMenu.style.display != "block" &&
            chatHolder.style.display != "block" &&
            !menuCBFocus);
}
let changeCounts = 0;
let opacity = 0;
let toggle;
function toggleMenuChat() {
    if (menuChatDiv.style.display != "none") {
        let cmd = function(command) {
            return {
                found: command.startsWith("/") && commands[command.slice(1).split(" ")[0]],
                fv: commands[command.slice(1).split(" ")[0]]
            }
        }
        let command = cmd(menuChatBox.value);
        if (command.found) {
            if (typeof command.fv.action === "function") {
                command.fv.action(menuChatBox.value);
            }
        } else {
            sendChat(menuChatBox.value);
        }
        menuChatBox.value = "";
        menuChatBox.blur();
    } else {
        if (menuCBFocus) {
            menuChatBox.blur();
        } else {
            menuChatBox.focus();
        }
    }
}
let autos = {
    insta: {
        todo: false,
        wait: false,
        count: 4,
        shame: 5,
        toggle: false
    },
    instaing: false,
    bull: false,
    antibull: 0,
    reloaded: false,
    stopspin: true
}
function toRad(angle) {
    return angle * 0.01745329251;
}
let boostSpikings = false;
function placeQuad() {
    place(4, near.aim2);
    place(4, near.aim2 + toRad(45));
    place(4, near.aim2 - toRad(90));
    place(4, near.aim2 + Math.PI);
}
let follow = (ang) => {
    packet("9", ang)
}
setInterval(()=>{
    if (getEl("BoostSpikeType").value == "Normal") {
        if (boostSpikings) {
            if (near.dist2 <= 150) {
                packet("9", near.aim2);
                place(2, near.aim2 + Math.PI / 2);
                place(2, near.aim2 - Math.PI / 2);
                place(2, near.aim2 + Math.PI);
            }
            if (near.dist2 < 70) {
                place(2, near.aim2);
            }
            if (near.dist2 >= 150) {
                packet("9", near.aim2);
                place(4, near.aim2);
            }
        }
    }
}, 100);
setInterval(()=>{
    if (getEl("BoostSpikeType").value == "Eveee") {
        if (boostSpikings) {
            if (near.dist2 >= 150) {
                packet("9", near.aim2);
                place(4, near.aim2);
                place(2, near.aim2 + toRad(90));
                place(2, near.aim2 - toRad(90));
            }
        }
    }
}, 100);
var Healing;
function keyDown(event) {
    let keyNum = event.which || event.keyCode || 0;
    if (player && player.alive && keysActive()) {
        if (!keys[keyNum]) {
            keys[keyNum] = 1;
            macro[event.key] = 1;
            if (keyNum == 27) {
                openMenu = !openMenu;
            } else if (keyNum == 17) {
                openMenu = !openMenu;
                $("#menuChatDiv").toggle();
            } else if (keyNum == 69) {
                sendAutoGather();
            } else if (keyNum == 67) {
                updateMapMarker();
            } else if (event.key === "n") {
                boostSpikings=true;
            } else if (event.key == "j") {
                placeQuad();
            } else if (player.weapons[keyNum - 49] != undefined) {
                player.weaponCode = player.weapons[keyNum - 49];
            } else if (moveKeys[keyNum]) {
                sendMoveDir();
            } else if (event.key == "b") {
                place(2, near.aim2 + toRad(45));
                place(2, near.aim2 - toRad(45));
                selectWeapon(player.weapons[0]);
                buyEquip(7, 0);
                sendAutoGather();
                game.tickBase(() => {
                    selectWeapon(player.weapons[0]);
                    buyEquip(53, 0);
                    game.tickBase(() => {
                        sendAutoGather();
                        my.autoAim = false;
                    }, 1);
                }, 1);
            } else if (event.key == "x") {
                place(2, near.aim2);
                selectWeapon(player.weapons[0]);
                buyEquip(7, 0);
                sendAutoGather();
                game.tickBase(() => {
                    selectWeapon(player.weapons[0]);
                    buyEquip(53, 0);
                    game.tickBase(() => {
                        sendAutoGather();
                        my.autoAim = false;
                    }, 1);
                }, 1);
            } else if (event.key == "/") {
                mills.placeSpawnPads = !mills.placeSpawnPads;
            } else if (event.key == 'b') {
                clicks.middle = true;
            } else if (event.key == "z") {
                mills.place = !mills.place;
            } else if (event.key == "Z") {
                typeof window.debug == "function" && window.debug();
            } else if (keyNum == 32) {
                packet("F", 1, getSafeDir(), 1);
                packet("F", 0, getSafeDir(), 1);
            }
        }
    }
}
let Playing = false;
let currentPart = 0;
function playSong() {
    Playing = !Playing;
    if (Playing) {
        let Song = Songs[Number(getEl("song").value)];
        Song.play();
        Song.onended = function() {
            if (Playing) {
                Songs[Number(getEl("song").value)].play();
            }
        };
        Song.ontimeupdate = function(t) {
            let part = songC[Number(getEl("song").value)][getTime(Math.round(this.currentTime))];
            if (part && part !== currentPart) {
                currentPart = part;
            }
        };
    } else {
        Songs[0].pause();
    }
}

function getTime(t) {
    let sec = Math.floor(t) % 60;
    let min = Math.floor(Math.floor(t) % 3600 / 60);
    sec < 10 && (sec = `0${sec}`)
    return min + ":" + sec;
}
let lastType, Sync = false;
let lastDamage = 0;
let oldEnemy;
let Shadow = 0.35;
setInterval(()=>{
    if (advHeal.length) {
        advHeal.forEach((updHealth) => {
            let sid = updHealth[0];
            let value = updHealth[1];
            let damaged = updHealth[2];
            tmpObj = findPlayerBySID(sid);
            if (tmpObj) {
                if (tmpObj == oldEnemy && (tmpObj.oldHealth <= damaged || damaged == items.list[player.items[2]].dmg*(tmpObj.skinIndex==6?3/4:1))) { // CHECK SYNC
                    if (lastDamage == damaged) {
                        Sync = true;
                        game.tickBase(() => {
                            Sync = false;
                        }, 5);
                    } else if (tmpObj.oldHealth != damaged) lastDamage = damaged;
                };
            }
        });
        advHeal = [];
    }
}, 30);

addEventListener("keydown", UTILS.checkTrusted(keyDown));

function keyUp(event) {
    if (player && player.alive) {
        let keyNum = event.which || event.keyCode || 0;
        if (keyNum == 13) {
            toggleMenuChat();
        } else if (keysActive()) {
            if (keys[keyNum]) {
                keys[keyNum] = 0;
                macro[event.key] = 0;
                if (moveKeys[keyNum]) {
                    sendMoveDir();
                } else if (event.key == "n") {
                    boostSpikings=false;
                } else if (event.key == 'b') {
                    clicks.middle = false;
                }
            }
        }
    }
}


window.addEventListener("keyup", UTILS.checkTrusted(keyUp));

function sendMoveDir() {
    if(found) {
        packet("9", undefined, 1);
    } else {
        let newMoveDir = getMoveDir();
        if (lastMoveDir == undefined || newMoveDir == undefined || Math.abs(newMoveDir - lastMoveDir) > 0.3) {
            if (!my.autoPush && !found) {
                packet("9", newMoveDir, 1);
            }
            lastMoveDir = newMoveDir;
        }
    }
}

// ITEM COUNT DISPLAY:
let isItemSetted = [];

function updateItemCountDisplay(index = undefined) {
    for (let i = 3; i < items.list.length; ++i) {
        let id = items.list[i].group.id;
        let tmpI = items.weapons.length + i;
        if (!isItemSetted[tmpI]) {
            isItemSetted[tmpI] = document.createElement("div");
            isItemSetted[tmpI].id = "itemCount" + tmpI;
            getEl("actionBarItem" + tmpI).appendChild(isItemSetted[tmpI]);
            isItemSetted[tmpI].style = `
                        display: block;
                        position: absolute;
                        padding-left: 5px;
                        font-size: 2em;
                        color: #fff;
                        `;
            isItemSetted[tmpI].innerHTML = player.itemCounts[id] || 0;
        } else {
            if (index == id) isItemSetted[tmpI].innerHTML = player.itemCounts[index] || 0;
        }
    }
}

// AUTOPUSH:
function followPath(path) {
    if (path.length > 1) {
        const nextStep = path[1];
        const targetPosition = {
            x: player.x2 - pathFind.scale / 2 + (pathFind.scale / pathFind.grid) * nextStep.x,
            y: player.y2 - pathFind.scale / 2 + (pathFind.scale / pathFind.grid) * nextStep.y
        };
        console.log("Moving to next step:", targetPosition);
        if (isPathClear(targetPosition)) {
            packet("9", UTILS.getDirect(targetPosition, player, 0, 2), 1);
        } else {
            console.log("Path obstructed, recalculating...");
            pathfinderToRandomPosition(nextStep.x, nextStep.y);
        }
    }
}
function pathfinderToRandomPosition(targetX, targetY) {
    if (!pathFind.active) return;
    pathFind.scale = (config.maxScreenWidth / 2) * 1.3;
    createPath();
    const startX = Math.floor(pathFind.grid / 2);
    const startY = Math.floor(pathFind.grid / 2);
    console.log("Finding path from", startX, startY, "to", targetX, targetY);
    easystar.findPath(startX, startY, targetX, targetY, function (path) {
        if (path === null) {
            console.error("Path not found to target:", targetX, targetY);
            pathFind.array = [];
        } else {
            console.log("Path found:", path);
            pathFind.array = path;
            followPath(path);
        }
    });
    easystar.calculate();
}
function isPathClear(targetPosition) {
    return !gameObjects.some(tmp => {
        if (!tmp.ignoreCollision && UTILS.lineInRect(tmp.x - tmp.getScale(), tmp.y - tmp.getScale(), tmp.x + tmp.getScale(), tmp.y + tmp.getScale(), player.x2, player.y2, targetPosition.x, targetPosition.y)) {
            console.log("Obstacle detected at", tmp);
            return true;
        }
        return false;
    });
}
function checkPathColl(tmp) {
    return ((player.scale + tmp.getScale()) / (player.maxSpeed * items.weapons[player.weaponIndex].spdMult)) + (tmp.dmg && !tmp.isTeamObject(player) ? 35 : 0);
}
function checkObject() {
    let checkColl = gameObjects.filter(tmp => player.canSee(tmp) && tmp.active);
    grid = [];
    for (let y = 0; y < pathFind.grid; y++) {
        grid[y] = [];
        for (let x = 0; x < pathFind.grid; x++) {
            let tmpXY = {
                x: (player.x2 - (pathFind.scale / 2)) + ((pathFind.scale / pathFind.grid) * x),
                y: (player.y2 - (pathFind.scale / 2)) + ((pathFind.scale / pathFind.grid) * y)
            }
            let distance = UTILS.getDist(pathFind.chaseNear ? near : pathFind, tmpXY, pathFind.chaseNear ? 2 : 0, 0);
            if (distance <= (pathFind.chaseNear ? 35 : 60)) {
                pathFind.lastX = x;
                pathFind.lastY = y;
                grid[y][x] = 0;
                continue;
            }
            let find = checkColl.find(tmp => UTILS.getDist(tmp, tmpXY, 0, 0) <= checkPathColl(tmp));
            if (find) {
                grid[y][x] = find.trap ? 0 : 1;
            } else {
                grid[y][x] = 0;
            }
        }
    }
}
function createPath() {
    checkObject();
}
var EasyStar = (function (modules) {
    var moduleCache = {};
    function require(moduleId) {
        if (moduleCache[moduleId]) return moduleCache[moduleId].exports;
        var module = (moduleCache[moduleId] = {
            i: moduleId,
            l: false,
            exports: {},
        });
        modules[moduleId].call(module.exports, module, module.exports, require);
        module.l = true;
        return module.exports;
    }
    require.m = modules;
    require.c = moduleCache;
    require.d = function (exports, name, getter) {
        if (!require.o(exports, name)) {
            Object.defineProperty(exports, name, {
                enumerable: true,
                get: getter,
            });
        }
    };
    require.r = function (exports) {
        if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
            Object.defineProperty(exports, Symbol.toStringTag, {
                value: "Module",
            });
        }
        Object.defineProperty(exports, "__esModule", {
            value: true,
        });
    };
    require.t = function (value, mode) {
        if (mode & 1) value = require(value);
        if (mode & 8) return value;
        if (mode & 4 && typeof value === "object" && value && value.__esModule) return value;
        var ns = Object.create(null);
        require.r(ns);
        Object.defineProperty(ns, "default", {
            enumerable: true,
            value: value,
        });
        if (mode & 2 && typeof value != "string") {
        }
        for (var key in value) {
        }
        require.d(ns, key, function (key) {
            return value[key];
        }.bind(null, key));
        return ns;
    };
    require.n = function (module) {
        var getter = module && module.__esModule ? function getDefault() {
            return module.default;
        } : function getModuleExports() {
            return module;
        };
        require.d(getter, "9", getter);
        return getter;
    };
    require.o = function (object, property) {
        return Object.prototype.hasOwnProperty.call(object, property);
    };
    require.p = "/bin/";
    return require(require.s = 0);
})([
    function (module, exports, require) {
        const Node = require(1);
        const MinHeap = require(2);
        const EasyStar = {};
        module.exports = EasyStar;
        let instanceIdCounter = 1;
        EasyStar.Pathfinder = function () {
            let grid,
                acceptableTiles,
                enableSync = false,
                diagonalsEnabled = false,
                tileCosts = {},
                additionalCosts = {},
                directionalConditions = {},
                maxIterations = Number.MAX_VALUE,
                avoidingPoints = {},
                cornerCuttingEnabled = true,
                paths = {},
                pathQueue = [];
            this.setAcceptableTiles = function (tiles) {
                if (Array.isArray(tiles)) {
                    acceptableTiles = tiles;
                } else if (!isNaN(parseFloat(tiles)) && isFinite(tiles)) {
                    acceptableTiles = [tiles];
                }
            };
            this.enableSync = function () {
                enableSync = true;
            };
            this.disableSync = function () {
                enableSync = false;
            };
            this.enableDiagonals = function () {
                diagonalsEnabled = true;
            };
            this.disableDiagonals = function () {
                diagonalsEnabled = false;
            };
            this.setGrid = function (newGrid) {
                grid = newGrid;
                tileCosts = {};
                for (let row = 0; row < grid.length; row++) {
                    for (let col = 0; col < grid[0].length; col++) {
                        tileCosts[grid[row][col]] = 1;
                    }
                }
            };
            this.setTileCost = function (tile, cost) {
                if (acceptableTiles && !acceptableTiles.includes(tile)) {
                    throw new Error(`Tile ${tile} is not in the acceptableTiles list.`);
                }
                tileCosts[tile] = cost;
            };
            this.setAdditionalPointCost = function (x, y, cost) {
                additionalCosts[y] = additionalCosts[y] || {};
                additionalCosts[y][x] = cost;
            };
            this.removeAdditionalPointCost = function (x, y) {
                if (additionalCosts[y]) {
                    delete additionalCosts[y][x];
                }
            };
            this.removeAllAdditionalPointCosts = function () {
                additionalCosts = {};
            };
            this.setDirectionalCondition = function (x, y, directions) {
                directionalConditions[y] = directionalConditions[y] || {};
                directionalConditions[y][x] = directions;
            };
            this.removeAllDirectionalConditions = function () {
                directionalConditions = {};
            };
            this.setIterationsPerCalculation = function (iterations) {
                maxIterations = iterations;
            };
            this.avoidAdditionalPoint = function (x, y) {
                avoidingPoints[y] = avoidingPoints[y] || {};
                avoidingPoints[y][x] = true;
            };
            this.stopAvoidingAdditionalPoint = function (x, y) {
                if (avoidingPoints[y]) {
                    delete avoidingPoints[y][x];
                }
            };
            this.enableCornerCutting = function () {
                cornerCuttingEnabled = true;
            };
            this.disableCornerCutting = function () {
                cornerCuttingEnabled = false;
            };
            this.stopAvoidingAllAdditionalPoints = function () {
                avoidingPoints = {};
            };
            this.findPath = function (startX, startY, endX, endY, callback) {
                if (!acceptableTiles) {
                    throw new Error("You must call setAcceptableTiles() before findPath().");
                }
                if (!grid) {
                    throw new Error("You must call setGrid() before findPath().");
                }
                if (startX < 0 || startY < 0 || endX < 0 || endY < 0 || startX >= grid[0].length || startY >= grid.length || endX >= grid[0].length || endY >= grid.length) {
                    throw new Error("Start or end point is outside the scope of your grid.");
                }
                if (startX === endX && startY === endY) {
                    return callback([]);
                }
                const endTile = grid[endY][endX];
                if (!acceptableTiles.includes(endTile)) {
                    return callback(null);
                }
                const pathId = instanceIdCounter++;
                const pathFinder = {
                    openList: new MinHeap((a, b) => a.estimatedTotalCost - b.estimatedTotalCost),
                    isDone: false,
                    nodeMap: {},
                    startX,
                    startY,
                    endX,
                    endY,
                    callback,
                };
                pathFinder.openList.push(createNode(pathFinder, startX, startY, null, 0));
                paths[pathId] = pathFinder;
                pathQueue.push(pathId);

                return pathId;
            };
            this.cancelPath = function (pathId) {
                if (paths[pathId]) {
                    delete paths[pathId];
                    return true;
                }
                return false;
            };
            this.calculate = function () {
                if (pathQueue.length > 0 && grid && acceptableTiles) {
                    for (let i = 0; i < maxIterations; i++) {
                        if (pathQueue.length === 0) return;
                        if (enableSync) i = 0;
                        const pathId = pathQueue[0];
                        const pathFinder = paths[pathId];
                        if (pathFinder && !pathFinder.isDone) {
                            const currentNode = pathFinder.openList.pop();
                            if (currentNode) {
                                if (currentNode.x === pathFinder.endX && currentNode.y === pathFinder.endY) {
                                    const path = [];
                                    let node = currentNode;
                                    while (node) {
                                        path.push({ x: node.x, y: node.y });
                                        node = node.parent;
                                    }
                                    path.reverse();
                                    pathFinder.callback(path);
                                    pathFinder.isDone = true;
                                    delete paths[pathId];
                                    pathQueue.shift();
                                } else {
                                    expandNode(pathFinder, currentNode);
                                }
                            } else {
                                pathQueue.shift();
                            }
                        }
                    }
                }
            };
            function expandNode(pathFinder, node) {
                const directions = [
                    [0, -1], // up
                    [1, 0], // right
                    [0, 1], // down
                    [-1, 0], // left
                ];
                if (diagonalsEnabled) {
                    directions.push(
                        [-1, -1], // up-left
                        [1, -1], // up-right
                        [1, 1], // down-right
                        [-1, 1] // down-left
                    );
                }
                directions.forEach(([dx, dy]) => {
                    const newX = node.x + dx;
                    const newY = node.y + dy;
                    if (isValidTile(newX, newY, node, pathFinder)) {
                        const movementCost = (dx === 0 || dy === 0) ? 1 : 1.4;
                        const tileCost = getTileCost(newX, newY);
                        const totalCost = node.costSoFar + movementCost * tileCost;

                        let neighbor = getNode(pathFinder, newX, newY);
                        if (!neighbor) {
                            neighbor = createNode(pathFinder, newX, newY, node, totalCost);
                            pathFinder.openList.push(neighbor);
                        } else if (totalCost < neighbor.costSoFar) {
                            neighbor.parent = node;
                            neighbor.costSoFar = totalCost;
                            neighbor.estimatedTotalCost = totalCost + getHeuristic(newX, newY, pathFinder.endX, pathFinder.endY);
                            pathFinder.openList.updateItem(neighbor);
                        }
                    }
                });
            }
            function getTileCost(x, y) {
                let cost = tileCosts[grid[y][x]] || 1;
                if (additionalCosts[y] && additionalCosts[y][x] !== undefined) {
                    cost += additionalCosts[y][x];
                }
                return cost;
            }
            function getNode(pathFinder, x, y) {
                return pathFinder.nodeMap[`${x}-${y}`];
            }
            function createNode(pathFinder, x, y, parent, costSoFar) {
                const estimatedTotalCost = costSoFar + getHeuristic(x, y, pathFinder.endX, pathFinder.endY);
                const node = new Node(x, y, parent, costSoFar, estimatedTotalCost);
                pathFinder.nodeMap[`${x}-${y}`] = node;
                return node;
            }
            function isValidTile(x, y, fromNode, pathFinder) {
                if (x < 0 || y < 0 || x >= grid[0].length || y >= grid.length) return false;
                const tile = grid[y][x];
                if (!acceptableTiles.includes(tile)) return false;
                if (avoidingPoints[y] && avoidingPoints[y][x]) return false;
                if (directionalConditions[y] && directionalConditions[y][x]) {
                    const validDirections = directionalConditions[y][x];
                    const dx = x - fromNode.x;
                    const dy = y - fromNode.y;
                    if (!validDirections.includes(getDirection(dx, dy))) return false;
                }
                if (!cornerCuttingEnabled) {
                    if (x !== fromNode.x && y !== fromNode.y) {
                        if (
                            !acceptableTiles.includes(grid[fromNode.y][x]) ||
                            !acceptableTiles.includes(grid[y][fromNode.x])
                        ) {
                            return false;
                        }
                    }
                }
                return true;
            }
            function getDirection(dx, dy) {
                if (dx === 0 && dy === -1) return "up";
                if (dx === 1 && dy === 0) return "right";
                if (dx === 0 && dy === 1) return "down";
                if (dx === -1 && dy === 0) return "left";
                if (dx === -1 && dy === -1) return "up-left";
                if (dx === 1 && dy === -1) return "up-right";
                if (dx === 1 && dy === 1) return "down-right";
                if (dx === -1 && dy === 1) return "down-left";
            }
            function getHeuristic(x1, y1, x2, y2) {
                const dx = Math.abs(x1 - x2);
                const dy = Math.abs(y1 - y2);
                return dx + dy;
            }
        };
    },
    function (module, exports) {
        function Node(x, y, parent, costSoFar, estimatedTotalCost) {
            this.x = x;
            this.y = y;
            this.parent = parent;
            this.costSoFar = costSoFar;
            this.estimatedTotalCost = estimatedTotalCost;
        }
        module.exports = Node;
    },
    function (module, exports) {
        const MinHeap = (function () {
            function MinHeap(compare) {
                this.heap = [];
                this.compare = compare;
            }
            MinHeap.prototype.push = function (item) {
                this.heap.push(item);
                this.bubbleUp(this.heap.length - 1);
            };
            MinHeap.prototype.pop = function () {
                const result = this.heap[0];
                const end = this.heap.pop();
                if (this.heap.length > 0) {
                    this.heap[0] = end;
                    this.sinkDown(0);
                }
                return result;
            };
            MinHeap.prototype.size = function () {
                return this.heap.length;
            };
            MinHeap.prototype.updateItem = function (item) {
                const index = this.heap.indexOf(item);
                if (index !== -1) {
                    this.bubbleUp(index);
                    this.sinkDown(index);
                }
            };
            MinHeap.prototype.bubbleUp = function (n) {
                const element = this.heap[n];
                while (n > 0) {
                    const parentN = Math.floor((n + 1) / 2) - 1;
                    const parent = this.heap[parentN];
                    if (this.compare(element, parent) >= 0) {
                        break;
                    }
                    this.heap[parentN] = element;
                    this.heap[n] = parent;
                    n = parentN;
                }
            };
            MinHeap.prototype.sinkDown = function (n) {
                const length = this.heap.length;
                const element = this.heap[n];

                while (true) {
                    const child2N = (n + 1) * 2;
                    const child1N = child2N - 1;
                    let swap = null;

                    if (child1N < length) {
                        const child1 = this.heap[child1N];
                        if (this.compare(child1, element) < 0) {
                            swap = child1N;
                        }
                    }
                    if (child2N < length) {
                        const child2 = this.heap[child2N];
                        if (this.compare(child2, swap === null ? element : this.heap[child1N]) < 0) {
                            swap = child2N;
                        }
                    }
                    if (swap === null) break;

                    this.heap[n] = this.heap[swap];
                    this.heap[swap] = element;
                    n = swap;
                }
            };
            return MinHeap;
        })();
        module.exports = MinHeap;
    },
]);
let pathFindTest = 0;
let grid = [];
const easystar = new EasyStar.Pathfinder();
function Pathfinder() {
    pathFind.scale = (config.maxScreenWidth / 2) * 1.3;

    if (!track.inTrap && (pathFind.chaseNear ? enemy.length : true)) {
        if (near.dist2 <= items.weapons[player.weapons[0]].range) {
            packet("9", undefined, 1);
            return;
        }

        createPath();

        if (!grid || !Array.isArray(grid) || grid.length === 0) {
            console.error("Invalid grid setup:", grid);
            return;
        }

        easystar.setGrid(grid);

        const acceptableTiles = [0];
        if (track.inTrap) {
            acceptableTiles.push(2);
        }
        easystar.setAcceptableTiles(acceptableTiles);
        easystar.enableDiagonals();

        const startX = Math.floor(grid[0].length / 2);
        const startY = Math.floor(grid.length / 2);
        const targetX = pathFind.lastX;
        const targetY = pathFind.lastY;

        /*console.log("Pathfinder Start:", startX, startY);
        console.log("Pathfinder Target:", targetX, targetY);*/

        easystar.findPath(startX, startY, targetX, targetY, function (path) {
            if (path === null) {
                console.warn("Pathfinding failed: No path found.");
                pathFind.array = [];

                if (retryPathfinding(startX, startY, targetX, targetY)) {
                    console.log("Retrying pathfinding with fallback strategy.");
                } else {
                    if (near.dist2 <= items.weapons[player.weapons[0]].range) {
                        packet("9", undefined, 1);
                    } else {
                        packet("9", near.aim2, 1);
                    }
                }
            } else {
                pathFind.array = path;

                if (pathFind.array.length > 1) {
                    const nextStep = path[1];
                    const tmpXY = {
                        x: (player.x2 - (pathFind.scale / 2)) + ((pathFind.scale / pathFind.grid) * nextStep.x),
                        y: (player.y2 - (pathFind.scale / 2)) + ((pathFind.scale / pathFind.grid) * nextStep.y)
                    };

                    console.log("Next Step:", nextStep);
                    console.log("Translated Coordinates:", tmpXY);

                    if (checkForObstacles(tmpXY)) {
                        console.warn("Obstacle detected, recalculating path.");
                        pathFind.array = [];
                        easystar.calculate();
                        return;
                    }

                    packet("9", UTILS.getDirect(tmpXY, player, 0, 2), 1);
                }
            }
        });

        easystar.calculate();
    }
}

function retryPathfinding(startX, startY, targetX, targetY) {
    easystar.setAcceptableTiles([0, 1]);

    let fallbackPathFound = false;

    easystar.findPath(startX, startY, targetX, targetY, function (path) {
        if (path !== null) {
            fallbackPathFound = true;
            pathFind.array = path;
            console.log("Fallback path found:", path);
        }
    });

    easystar.calculate();
    return fallbackPathFound;
}

function checkForObstacles(position) {
    return gameObjects.some(obj =>
                            obj.active &&
                            obj.dmg &&
                            UTILS.getDistance(obj, position) <= obj.getScale() + 35
                           );
}
easystar.enableDiagonals();
easystar.setIterationsPerCalculation(1000);
setInterval(() => {
    easystar.calculate();
}, 100);

// MOVEMENT:
function move(dir) {
    packet("9", dir, 1);
}

function setMoveDir(dir) {
    move(dir);

    game.tickBase(() => {
        move(lastMoveDir);
    },1);
}

// DDODGE OBJECTS:
const dodgeSpike = () => {
    if (traps.inTrap) return;

    let aspike = closeObjects.find(obj => obj.dmg && obj.active && !obj.isTeamObject(player) && UTILS.getDist(obj, player, 0, 3) <= (player.scale * 2 + obj.getScale()));

    if (!aspike) {
        if (tracker.draw3.active) tracker.draw3.active = false;
        return;
    }

    tracker.draw3 = {
        active: true,
        x: aspike.x,
        y: aspike.y,
        scale: aspike.getScale() || aspike.scale,
    };

    let spikeDir = UTILS.getDirect(aspike, player, 0, 2);

    setMoveDir(spikeDir + Math.PI);
};

// AUTOPUSH:
function autoPush() {
    let nearTrap = closeObjects.filter(tmp => tmp.trap && tmp.active && tmp.isTeamObject(player) && UTILS.getDist(tmp, near, 0, 2) <= (near.scale + tmp.getScale() + 15)).sort(function(a, b) {
        return UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2);
    })[0];
    if (!nearTrap) {
        track.pushdata.autoPush = false;
        pathFind.active = false;
        pathFind.chaseNear = false;

        return;
    }

    let ifNearSpikes = closeObjects.some(tmp => tmp.dmg && tmp.active && !tmp.isTeamObject(player) && UTILS.getDist(tmp, nearTrap, 0, 0) <= (near.scale + nearTrap.scale + tmp.scale + 5));
    if (ifNearSpikes) {
        track.pushdata.autoPush = false;
        pathFind.active = false;
        pathFind.chaseNear = false;

        return;
    }

    let spike = closeObjects.filter(tmp => tmp.dmg && tmp.active && tmp.isTeamObject(player) && UTILS.getDist(tmp, nearTrap, 0, 0) <= (near.scale + nearTrap.scale + tmp.scale + 5)).sort(function(a, b) {
        return UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2);
    })[0];
    if (!spike) {
        track.pushdata.autoPush = false;
        pathFind.active = false;
        pathFind.chaseNear = false;

        return;
    }

    let pos = {
        x: spike.x + (250 * Math.cos(UTILS.getDirect(near, spike, 2, 0))),
        y: spike.y + (250 * Math.sin(UTILS.getDirect(near, spike, 2, 0))),
        x2: spike.x + ((UTILS.getDist(near, spike, 2, 0) + player.scale) * Math.cos(UTILS.getDirect(near, spike, 2, 0))),
        y2: spike.y + ((UTILS.getDist(near, spike, 2, 0) + player.scale) * Math.sin(UTILS.getDirect(near, spike, 2, 0)))
    };
    let finds = gameObjects.filter(tmp => tmp.active).find((tmp) => {
        let tmpScale = tmp.getScale();
        if (!tmp.ignoreCollision && UTILS.lineInRect(tmp.x - tmpScale, tmp.y - tmpScale, tmp.x + tmpScale, tmp.y + tmpScale, player.x2, player.y2, pos.x2, pos.y2)) {
            return true;
        }
    });

    let collider = objectManager.checkCollision2(near, spike);
    if (collider && player.weapons[0] == 7) {
        instaC.canSpikeTick = true;
    }

    if (finds && near.dist2 >= 110) {
        track.pushdata.autoPush = false;
        pathFind.active = true;
        pathFind.chaseNear = true;
    } else {
        pathFind.active = false;
        pathFind.chaseNear = false;
        track.pushdata.autoPush = true;
        track.pushdata.pushData = {
            x: spike.x + Math.cos(30),
            y: spike.y + Math.sin(30),
            x2: pos.x2 + Math.cos(60),
            y2: pos.y2 + Math.sin(60)
        };
        let angle = Math.atan2(near.y2 - spike.y, near.x2 - spike.x)
        let point = {
            x: near.x2 + Math.cos(angle) * 53,
            y: near.y2 + Math.sin(angle) * 53,
        }
        let num = UTILS.getDist(near, spike, 2, 0);
        let text = num.toString(10);
        let scale = (player.scale / 10);
        if (UTILS.getDist(near, spike, 2, 0) >= 105) {
            if (UTILS.lineInRect(player.x2 - scale, player.y2 - scale, player.x2 + scale, player.y2 + scale, near.x2, near.y2, pos.x, pos.y)) {
                io.send("9", near.aim2, 1);
            } else {
                io.send("9", UTILS.getDirect(pos, player, 2, 2), 1);
            }
        } else {
            io.send("9", Math.atan2(point.y - player.y2, point.x - player.x2), 1);
        }
    }
}

// ADD DEAD PLAYER:
function addDeadPlayer(tmpObj) {
    deadPlayers.push(new DeadPlayer(tmpObj.x, tmpObj.y, tmpObj.dir, tmpObj.buildIndex, tmpObj.weaponIndex, tmpObj.weaponVariant, tmpObj.skinColor, tmpObj.scale, tmpObj.name));
}

/** APPLY SOCKET CODES */

// SET INIT DATA:
function setInitData(data) {
    alliances = data.teams;
}

// SETUP GAME:
function setupGame(yourSID) {
    keys = {};
    macro = {};
    playerSID = yourSID;
    attackState = 0;
    inGame = true;
    packet("F", 0, getAttackDir(), 1);
    my.ageInsta = true;
    if (firstSetup) {
        firstSetup = false;
        gameObjects.length = 0;
        closeObjects.length = 0;
    }
}

// ADD NEW PLAYER:
function addPlayer(data, isYou) {
    let near = findPlayerByID(data[0]);
    if (!near) {
        near = new Player(data[0], data[1], config, UTILS, projectileManager,
                          objectManager, players, ais, items, hats, accessories);
        players.push(near);
        if (data[1] != playerSID) {
            addMenuChText(null, `Found ${data[2]} {${data[1]}}`, "lime");
        }
    } else {
        if (data[1] != playerSID) {
            addMenuChText(null, `Found ${data[2]} {${data[1]}}`, "lime");
        }
    }
    near.spawn(isYou ? true : null);
    near.visible = false;
    near.oldPos = {
        x2: undefined,
        y2: undefined
    };
    near.x2 = undefined;
    near.y2 = undefined;
    near.x3 = undefined;
    near.y3 = undefined;
    near.setData(data);
    if (isYou) {
        player = near;
        camX = player.x;
        camY = player.y;
        my.lastDir = 0;
        updateItems();
        updateAge();
        updateItemCountDisplay();
        if (player.skins[7]) {
            my.reSync = true;
        }
    }
}

// REMOVE PLAYER:
function removePlayer(id) {
    for (let i = 0; i < players.length; i++) {
        if (players[i].id == id) {
            addMenuChText("Game", players[i].name + "[" + players[i].sid + "] left the game", "red");
            players.splice(i, 1);
            break;
        }
    }
}
// dune mod dmgpot
function sortWeaponVariant(id) {
    switch (id) {
        case 0:
            return 1
            break;
        case 1:
            return 1.1
            break;
        case 2:
            return 1.18
            break;
        case 3:
            return 1.18
            break;
        default:
            return 1
            break;
    }
}
function sortSecondaryAmmoDamage(weapon) {
    switch (weapon) {
        case 10:
            return 12
            break
        case 15:
            return 50
            break;
        case 9:
            return 25
            break;
        case 12:
            return 35
            break;
        case 13:
            return 30
            break;
        default:
            return 0
    }
}
let antiinsta = true;
let antiinsta1 = false;
function heal() {
    for (let i = 0; i < Math.ceil((100 - player.health) / items.list[player.items[0]].healing); i++) {
        place(0, getAttackDir());
    }
}
function healer1() {
    place(0, getAttackDir());
    return Math.ceil((100 - player.health) / items.list[player.items[0]].healing);
}
// UPDATE HEALTH:
function updateHealth2(sid, value) {
    let _ = findPlayerBySID(sid);
    let secondary = {
        weapon: this.secondaryIndex,
        variant: this.secondaryVariant
    };
    if (!_) return;

    if (_) {
        _.oldHealth = _.health;
        _.health = value;
        _.judgeShame();
        if (_.oldHealth > _.health) {
            _.timeDamaged = Date.now();
            _.damaged = _.oldHealth - _.health;
            let damaged = _.damaged;
            _ = findPlayerBySID(sid);
            let bullTicked = false;
            if (_.health <= 0) {
                if (!_.death) {
                    _.death = true;
                    addDeadPlayer(_);
                }
            }
            if (_ == player) {
                if (_.skinIndex == 7 && (damaged == 5 || (_.latestTail == 13 && damaged == 2))) {
                    if (my.reSync) {
                        my.reSync = false;
                        _.setBullTick = true;
                    }
                    bullTicked = true;
                }
                let antiinsta = true;
                let antiinsta1 = false;


                let EmpAnti = (player.empAnti);
                let antiinsta3 = true;
                let autoheal = false;
                let antiinsta4 = true;
                let healTimeout = 85;
                let attackers = getAttacker(damaged);
                let gearDmgs = [0.25, 0.45].map((val) => val * items.weapons[player.weapons[0]].dmg);
                let includeSpikeDmgs = near.length ? !bullTicked && (gearDmgs.includes(damaged) && near[0].skinIndex == 11 && near[0].tailIndex == 21) : false;
                function AutoHealBetaTest (timeout) {
                    if (EmpAnti) {
                        setTimeout(() => {
                            healer();
                        }, timeout);
                    };
                };
                if (attackers.length) {
                    let by = attackers.filter(tmp => {
                        if (tmp.dist2 <= (tmp.weaponIndex < 9 ? 300 : 700)) {
                            tmpDir = UTILS.getDirect(player, tmp, 2, 2);
                            if (UTILS.getAngleDist(tmpDir, tmp.d2) <= Math.PI) {
                                return tmp;
                            }
                        }
                    });
                    if (healTimeout && player.dmg) {
                        if (healTimeout) {
                            healTimeout = (65 || 80);
                            if (by.length) {
                                let maxDamage = includeSpikeDmgs ? 10 : 10;
                                if (damaged > maxDamage && game.tick - _.antiTimer > 1) {
                                    _.canEmpAnti = true;
                                    _.antiTimer = game.tick;
                                    let shame = 4;
                                    if (_.shameCount < shame) {
                                        healer();
                                    } else {
                                        AutoHealBetaTest(healTimeout);
                                    }
                                } else {
                                    AutoHealBetaTest(healTimeout);
                                }
                            } else {
                                AutoHealBetaTest(healTimeout);
                            }
                        };
                    };
                };
                if (inGame) {
                    let shame = _.weapons[0] == 4 ? 2 : 5;
                    let damageThreatCondition = damaged >= (includeSpikeDmgs ? 8 : 20) && _.damageThreat >= 20;
                    if (damageThreatCondition && antiinsta4 && (game.tick - _.antiTimer) > 1) {
                    }
                    if (damageThreatCondition && autoheal) {
                        setTimeout(() => {
                            healer();
                        }, 120);
                    }
                    if (damageThreatCondition && antiinsta && _.primaryIndex !== "4" && (game.tick - _.antiTimer) > 1);
                    if (damaged >= 20 && player.skinIndex == 11 && player.shameCount <= 3) {
                        instaC.canCounter = true;
                    }
                    if (damaged >= 0 && damaged <= 66 && player.shameCount === 4 && _.primaryIndex !== "4") {
                        autoheal = true;
                        antiinsta = false;
                        antiinsta1 = false;
                        antiinsta4 = false;
                    } else if (player.shameCount !== 4) {
                        autoheal = false;
                        antiinsta = true;
                        antiinsta4 = true;
                    }
                    if (damaged <= 66 && player.shameCount === 3 && _.primaryIndex !== "4") {
                        antiinsta = false;
                    } else if (player.shameCount !== 3) {
                        antiinsta = true;
                    }
                    if (damaged <= 66 && player.shameCount === 4 && _.primaryIndex !== "4") {
                        antiinsta1 = true;
                    } else if (player.shameCount !== 4) {
                        antiinsta1 = false;
                    }
                    if (damaged <= 66 && player.skinIndex != 6 && enemy.weaponIndex === 4) {
                        game.tickBase(() => {
                            healer1();
                        }, 2);
                    }
                };
                let dmg = 100 - player.health;
                if (damaged >= (includeSpikeDmgs ? 8 : 20) && _.damageThreat >= 20 && antiinsta4 && (game.tick - _.antiTimer) > 1) {
                    if (_.reloads[53] == 0 && _.reloads[_.weapons[1]] == 0) {
                        _.canEmpAnti = true;
                    } else {
                        player.soldierAnti = true;
                    }
                    _.antiTimer = game.tick;
                    let shame = _.weapons[0] == 4 ? 2 : 5;
                    if (_.shameCount < shame) {
                        healer();
                    } else {
                        game.tickBase(() => {
                            healer();
                        }, 2);
                    }
                    if (damaged >= (includeSpikeDmgs ? 8 : 20) && _.damageThreat >= 20 && autoheal) {
                        setTimeout(() => {
                            healer();
                        }, 120);
                    }
                    let dmg = 100 - player.health;
                    if (damaged >= (includeSpikeDmgs ? 8 : 20) && _.damageThreat >= 20 && antiinsta && _.primaryIndex !== "4" && (game.tick - _.antiTimer) > 1) {
                        if (_.reloads[53] == 0 && _.reloads[_.weapons[1]] == 0) {
                            _.canEmpAnti = true;
                        } else {
                            player.soldierAnti = true;
                        }
                        _.antiTimer = game.tick;
                        let shame = _.weapons[0] == 4 ? 2 : 5;
                        if (_.shameCount < shame) {
                            healer();
                        } else {
                            game.tickBase(() => {
                                healer();
                            }, 2);
                        }
                    }
                    if (damaged >= 20 && player.skinIndex == 11 && player.shameCount <= 3) instaC.canCounter = true;
                } else {
                    game.tickBase(() => {
                        healer();
                    }, 2);
                }
            } else {
                _.maxShameCount = Math.max(_.maxShameCount, _.shameCount);
            }
        } else if (!_.setPoisonTick && (_.damaged == 5 || (_.latestTail == 13 && _.damaged == 2))) {
            _.setPoisonTick = true;
        }
    }
    if (nears.length && _.shameCount <= 5 && nears.some(items => [9, 12, 17, 15].includes(secondary.weapon))) {
        if (near.reloads[near.secondaryIndex] == 0) {
            my.empAnti = true;
            my.soldierAnti = false;
        } else {
            my.soldierAnti = true
            my.empAnti = false;
        }
    }
}
let lastSp;
// KILL PLAYER:
function killPlayer() {
    inGame = false;
    lastDeath = {
        x: player.x,
        y: player.y,
    };
    getEl("diedText").style.display = "none";
    packet("M", {
        name: lastsp[0],
        moofoll: lastsp[1],
        skin: lastsp[2]
    });
}

// UPDATE PLAYER ITEM VALUES:
function updateItemCounts(index, value) {
    if (player) {
        player.itemCounts[index] = value;
        updateItemCountDisplay(index);
    }
}

// UPDATE AGE:
function updateAge(xp, mxp, age) {
    if (xp != undefined) player.XP = xp;
    if (mxp != undefined) player.maxXP = mxp;
    if (age != undefined) player.age = age;
}

// UPDATE UPGRADES:
function updateUpgrades(points, age) {
    player.upgradePoints = points;
    player.upgrAge = age;
    if (points > 0) {
        tmpList.length = 0;
        UTILS.removeAllChildren(upgradeHolder);
        for (let i = 0; i < items.weapons.length; ++i) {
            if (items.weapons[i].age == age && (items.weapons[i].pre == undefined || player.weapons.indexOf(items.weapons[i].pre) >= 0)) {
                let e = UTILS.generateElement({
                    id: "upgradeItem" + i,
                    class: "actionBarItem",
                    onmouseout: function() {
                        showItemInfo();
                    },
                    parent: upgradeHolder
                });
                e.style.backgroundImage = getEl("actionBarItem" + i).style.backgroundImage;
                tmpList.push(i);
            }
        }
        for (let i = 0; i < items.list.length; ++i) {
            if (items.list[i].age == age && (items.list[i].pre == undefined || player.items.indexOf(items.list[i].pre) >= 0)) {
                let tmpI = (items.weapons.length + i);
                let e = UTILS.generateElement({
                    id: "upgradeItem" + tmpI,
                    class: "actionBarItem",
                    onmouseout: function() {
                        showItemInfo();
                    },
                    parent: upgradeHolder
                });
                e.style.backgroundImage = getEl("actionBarItem" + tmpI).style.backgroundImage;
                tmpList.push(tmpI);
            }
        }
        for (let i = 0; i < tmpList.length; i++) {
            (function(i) {
                let tmpItem = getEl('upgradeItem' + i);
                // tmpItem.onmouseover = function() {
                //     if (items.weapons[i]) {
                //         showItemInfo(items.weapons[i], true);
                //     } else {
                //         showItemInfo(items.list[i - items.weapons.length]);
                //     }
                // };
                tmpItem.onclick = UTILS.checkTrusted(function() {
                    packet("H", i);
                });
                UTILS.hookTouchEvents(tmpItem);
            })(tmpList[i]);
        }
        if (tmpList.length) {
            upgradeHolder.style.display = "block";
            upgradeCounter.style.display = "block";
            upgradeCounter.innerHTML = "SELECT ITEMS (" + points + ")";
        } else {
            upgradeHolder.style.display = "none";
            upgradeCounter.style.display = "none";
            showItemInfo();
        }
    } else {
        upgradeHolder.style.display = "none";
        upgradeCounter.style.display = "none";
        showItemInfo();
    }
}
function toR(e) {
    var n = (e * Math.PI / 180) % (2 * Math.PI);
    return n > Math.PI ? Math.PI - n : n
}
function toD(e) {
    var n = (e / Math.PI * 360) % 360;
    return n >= 360 ? n - 360 : n;
}
let enemies = [];
const placedSpikePositions = new Set();
let PrePlaceCount = false;
// KILL OBJECT:
function killObject(sid) {
    let findObj = findObjectBySid(sid);
    objectManager.disableBySid(sid);

    if (findObj && player) {
        traps.replacer(findObj);
        if (!player.canSee(findObj)) {
            breakTrackers.push({
                x: findObj.x,
                y: findObj.y
            });
        }
        if (breakTrackers.length > 8) {
            breakTrackers.shift();
        }

        for (let position of placedSpikePositions) {
            let storedPosition = JSON.parse(position);
            let distToStoredPosition = Math.hypot(storedPosition[0] - findObj.x, storedPosition[1] - findObj.y);
            if (distToStoredPosition <= 80) {
                placedSpikePositions.delete(position);
                break;
            }
        }
        traps.replacer(findObj);
    }
}

// KILL ALL OBJECTS BY A PLAYER:
function killObjects(sid) {
    // addChatLog(findPlayerBySID(sid).name + " has left", "red", "", "red");
    if (player) objectManager.removeAllItems(sid);
}
function isAlly(sid, pSid) {
    tmpObj = findPlayerBySID(sid);
    if (!tmpObj) {
        return;
    }
    if (pSid) {
        let pObj = findPlayerBySID(pSid);
        if (!pObj) {
            return;
        }
        if (pObj.sid == sid) {
            return true;
        } else if (tmpObj.team) {
            return tmpObj.team === pObj.team ? true : false;
        } else {
            return false;
        }
    }
    if (!tmpObj) {
        return;
    }
    if (player.sid == sid) {
        return true;
    } else if (tmpObj.team) {
        return tmpObj.team === player.team ? true : false;
    } else {
        return false;
    }
}
function fgdo(a, b) {
    return Math.sqrt(Math.pow((b.y - a.y), 2) + Math.pow((b.x - a.x), 2));
}

function setTickout(doo, timeout) {
    if (!ticks.manage[ticks.tick + timeout]) {
        ticks.manage[ticks.tick + timeout] = [doo];
    } else {
        ticks.manage[ticks.tick + timeout].push(doo);
    }
}

function caf(e, t) {
    try {
        return Math.atan2((t.y2 || t.y) - (e.y2 || e.y), (t.x2 || t.x) - (e.x2 || e.x));
    } catch (e) {
        return 0;
    }
}

let found = false;
let autoQ = false;

// UPDATE PLAYER DATA:
let nEy;
let placeableSpikes = [];
let placeableTraps = [];
let placeableSpikesPREDICTS = [];
let DmgPotStuff = {
    predictedDamage: 0
};

function mgPotWorkfrfrfr() {
    DmgPotStuff.predictedDamage = 0;
    for (let i = 0; i < nears.length; i++) {
        let singleIndividual = nears[i];
        if (singleIndividual.primaryIndex != undefined) {
            if (singleIndividual.reloads[singleIndividual.weapons[0]] == 0) {
                DmgPotStuff.predictedDamage += items.weapons[singleIndividual.weapons[0]].dmg * sortWeaponVariant(singleIndividual.weaponVariant) * 1.5
            }
        } else {
            DmgPotStuff.predictedDamage += 45
        }
        if (singleIndividual.secondaryIndex != undefined) {
            if (singleIndividual.reloads[singleIndividual.weapons[1]] == 0) {
                if (items.weapons[singleIndividual.weapons[1]] == 10) {
                    DmgPotStuff.predictedDamage += items.weapons[singleIndividual.weapons[1]].dmg * sortWeaponVariant(singleIndividual.weaponVariant)
                } else {
                    DmgPotStuff.predictedDamage += items.weapons[singleIndividual.weapons[1]].Pdmg
                }
            }
        } else {
            DmgPotStuff.predictedDamage += 50
        }
        if (singleIndividual.reloads[53] == 0) {
            DmgPotStuff.predictedDamage += 25
        }
    }
    return DmgPotStuff.predictedDamage
}
let odfmsjfhvadsfyjkauhsfsa = false;
let odfmsjfhvadsfyjkauhsfsa2 = false;
let v292 = 0;
let v648 = false;
let healCD = false;
if(document.URL.includes('isAltPlayer')){
    document.querySelector("#resDisplay").querySelectorAll('*').forEach((e)=>{
        if(e.id!=='scoreDisplay'){
            e.style.display = 'none'
        }
    })
    document.querySelector('#allianceButton').style.position = 'fixed';
    document.querySelector('#allianceButton').style.top = '0';
    document.querySelector('#allianceButton').style.right = '0';


}

let altPlayerManager = {
    activator: [],
    iframe: null,
    iframeActive: false,
    mode: 'sync',
};
document.addEventListener('keydown', (e) => {
    if (e.key === '1' && document.activeElement.id.toLowerCase() !== "chatbox") {
        altPlayerManager.activator.push(Date.now());
        let recentPresses = altPlayerManager.activator.filter(g => Date.now() - g < 1000).length;

        if (recentPresses === 3) {
            if (altPlayerManager.iframe) {
                altPlayerManager.iframe.remove();
                altPlayerManager.iframe = null;
                altPlayerManager.iframeActive = false;
            } else {
                altPlayerManager.iframe = document.createElement('iframe');
                altPlayerManager.iframe.src = document.URL + '?isAltPlayer=true';
                altPlayerManager.iframe.style = `position:fixed;top:0%;right:0%;bottom:0%;left:0%;z-index:9999;width:75%;height:75%;display:block;`;
                document.body.appendChild(altPlayerManager.iframe);
                altPlayerManager.iframeActive = true;
            }
            altPlayerManager.activator = [];
        } else if (recentPresses === 1) {
            if (altPlayerManager.iframe) {
                altPlayerManager.iframe.style.display = (altPlayerManager.iframe.style.display === 'block') ? 'none' : 'block';
            }
        }
    }
});


document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab' && document.activeElement.id.toLowerCase() !== "chatbox") {
        e.preventDefault();
        if (altPlayerManager.iframeActive) {
            altPlayerManager.iframe.contentWindow.focus();
        } else {
            window.focus();
        }
        altPlayerManager.iframeActive = !altPlayerManager.iframeActive;
    }
});
const WompWomp = {
    trap:new Image(),
    spike:new Image(),
    spikeBreakSid: -1
}
WompWomp.trap.src = 'https://images.vexels.com/content/209028/preview/simple-hexagon-label-3f3168.png';
WompWomp.spike.src = 'https://cdn-icons-png.flaticon.com/512/279/279951.png'
top.customPlayerRange = 200;
top.customTeammateRange = 200;
let spamCounts = 0;
function HKH () {
    my.autoAim = true;
    sendAutoGather();
    buyEquip(53, 0);
    selectWeapon(player.weapons[1]);
    game.tickBase(() => {
        buyEquip(7, 0);
        selectWeapon(player.weapons[0]);
        game.tickBase(() => {
            sendAutoGather();
            my.autoAim = false;
        }, 1);
    }, 1);
}
let pathFind = {
    active: false,
    grid: 40,
    scale: 1440,
    x: 14400,
    y: 14400,
    chaseNear: false,
    array: [],
    lastX: this.grid / 2,
    lastY: this.grid / 2
};
let Stopped = false;
let turretEmp = 0;


let breakSpike = {
    active: false,
    info: {},
    x: 0, y: 0,
    aim: 0, dist: 0
};
function isInTrap(plyr) {
    return liztobj
        .filter(
        (e) =>
        e.trap &&
        e.active &&
        UTILS.getDist(e, plyr, 0, 2) <= 35 + e.getScale() + 5 &&
        !e.isTeamObject(plyr)
    )
        .sort(function (a, b) {
        return UTILS.getDist(a, plyr, 0, 2) - UTILS.getDist(b, plyr, 0, 2);
    })[0];
}
let trapSpike;
// UPDATE MAIN PLAYER DATA:
let client = new class {
    constructor() {
        // later remaded:
        this.reloaded = false;
        this.reSync = false;
        this.anti0Tick = 0;
        this.antiSync = false;
    }

    updateManageData(_) {
        if (_.skinIndex == 45) {
            if (_.shameTimer <= 0) _.addShameTimer();
        } else if (_.oldSkinIndex == 45) {
            _.shameTimer = 0;
            _.shameCount = 0;

            if (_ == player) {
                healer();
            }
        }


        if (_.weaponIndex < 9) {
            _.primaryIndex = _.weaponIndex;
            _.primaryVariant = _.weaponVariant;
        } else if (_.weaponIndex > 8) {
            _.secondaryIndex = _.weaponIndex;
            _.secondaryVariant = _.weaponVariant;
        }
    }

    hundleBreakObjects(_) {
        if (closeObjects.length) {
            let nearTrap = closeObjects.filter(e => e.trap && e.active && UTILS.getDist(e, _, 0, 2) <= (_.scale + e.getScale() + 5) && !e.isTeamObject(_)).sort(function (a, b) {
                return UTILS.getDist(a, _, 0, 2) - UTILS.getDist(b, _, 0, 2);
            })[0];

            let nearSpike = closeObjects.filter(e => e.dmg && e.active && objectManager.canHit(_, e, _.weapons[1] == 10 ? _.weapons[1] : _.weapons[0]) && !e.isTeamObject(_))
            .sort((a, b) => UTILS.getDist(a, _, 0, 2) - UTILS.getDist(b, _, 0, 2))[0];

            if (_ == player) {
                let spike = closeObjects.filter(e => (/spik/.test(e.name || e.dmg) && e.active && UTILS.getDist(e, player, 0, 3) <= player.scale + e.scale + 40 && !e.isTeamObject(player))).sort((a, b) => UTILS.getDist(a, player, 0, 2) - UTILS.getDist(b, player, 0, 2))[0];

                if (nearTrap) {
                    trapSpike = gameObjects.find(
                        (obj) => obj.dmg && cdf(tmpObj, obj) <= tmpObj.scale + obj.scale
                    );
                    let spike = gameObjects.filter(
                        (obj) =>
                        obj.dmg &&
                        cdf(tmpObj, obj) <= tmpObj.scale + nearTrap.scale / 2 &&
                        !obj.isTeamObject(tmpObj) &&
                        obj.active
                    )[0];
                    traps.protect(caf(nearTrap, tmpObj) - Math.PI);
                    traps.dist = UTILS.getDist(nearTrap, _, 0, 2);
                    traps.aim = UTILS.getDirect(spike ? spike : nearTrap, tmpObj, 0, 2);

                    traps.inTrap = true;
                    traps.info = [nearTrap, nearSpike];
                    traps.hasSpike = nearSpike ? true : false;
                } else {
                    if (traps.inTrap && near.dist2 < 200) {
                        healer();
                        ShowSettingText(500, "outOfTrap Healing");
                    }

                    traps.inTrap = false;
                    traps.info = {};
                }

                if (spike) {
                    breakSpike.active = true;
                    breakSpike.info = spike;

                    breakSpike.x = spike.x;
                    breakSpike.y = spike.y;

                    breakSpike.aim = UTILS.getDirect(spike, player, 0, 2);
                    breakSpike.dist = UTILS.getDist(spike, player, 0, 2);
                } else {
                    breakSpike.active = false;
                    breakSpike.info = {};
                }
            } else {
                if (nearTrap) {
                    _.inTrap = nearTrap;
                } else {
                    _.inTrap = false;
                }
            }
        } else {
            if (_ == player) {
                breakSpike.active = false;
                traps.inTrap = false;
            } else {
                _.inTrap = false;
            }
        }
    }

    resetFlags() {
        if (instaC.ticking) {
            instaC.ticking = false;
        }
        if (instaC.syncHit) {
            instaC.syncHit = false;
        }
        if (player.empAnti) {
            player.empAnti = false;
        }
        if (player.soldierAnti) {
            player.soldierAnti = false;
        }
        if (my.anti0Tick > 0) {
            my.anti0Tick--;
        }
        if (traps.replaced) {
            traps.replaced = false;
        }
        if (traps.antiTrapped) {
            traps.antiTrapped = false;
        }
    }
}();
let nearInfo = [];
let queuedTicks = [];
function handleTick() {
    for (let i = 0; i < queuedTicks.length; i++) {
        queuedTicks[i]();
    }
    queuedTicks = [];
}
function queueCurrentTick(action) {
    queuedTicks.push(action);
}
const getPotentialDamage = (build, user) => {
    const getDistance = (x1, y1, x2, y2) => {
        let dx = x2 - x1;
        let dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    };
    const weapIndex = user.weapons[1] === 10 && !player.reloads[user.weapons[1]] ? 1 : 0;
    const weap = user.weapons[weapIndex];
    if (player.reloads[weap]) return 0;
    const weapon = items.weapons[weap];
    const inDist = getDistance(build.x, build.y, user.x2, user.y2) <= build.getScale() + weapon.range;
    return (user.visible && inDist) ? weapon.dmg * (weapon.sDmg || 1) * 3.3 : 0;
};
setInterval (() => {
    handleTick()
}, 1e3/9)
const Preplace = () => {
    if (getEl("weaponGrind").checked || !configs.autoPrePlace) return;
    const preplaceable = [];
    const gameObjectCount = gameObjects.length;
    for (let i = 0; i < gameObjectCount; i++) {
        const build = gameObjects[i];
        if (build.isItem && build.active && build.health > 0) {
            let potentialDamage = players.reduce((total, p) => total + getPotentialDamage(build, p), 0);
            if (build.health <= potentialDamage) {
                preplaceable.push(build);
            }
        }
    }
    if (preplaceable.length < 1) return;
    preplaceable.sort((a, b) => a.health - b.health);
    let prioritizedObjects = traps.preplaceAngle(preplaceable, preplaceable[0]);
    for (let prioObject of prioritizedObjects) {
        if (UTILS.getDist(near, player, 2, 2) <= player.scale * 1.8 + items.weapons[player.weaponIndex].range + 50) {
            let [prioType, build] = prioObject;
            queueCurrentTick(() => {
                place(prioType === "spike" ? 2 : 4, UTILS.getDirect(build, player, 0, 2), 1, true);
                traps.replaced = false;
            });
        }
    }
};
let hitDetect = [];
let close = [];
let canDeleteNearestZulu = false;
function predictReload() {
    try {
        if (!near) {
            hitDetect = [];
            return false;
        }
        hitDetect = [];
        let potentialHit = [];
        for (let i = 0; i < close.length; i++) {
            if (close[i].primaryReload == 1) {
                for (let o = 0; o < nears.length; o++) {
                    if (close[i].sid == nears[o].sid) {
                        potentialHit.push(close[i]);
                        break;
                    }
                }
            }
        }
        hitDetect = potentialHit;
        close = [];
        for (let i = 0; i < nears.length; i++) {
            if (players[i].secondaryIndex == 10 && players[i].secondaryReload + game.tickRate / items.weapons[players[i].secondaryIndex].speed >= 1 && players[i].secondaryReload + game.tickRate / items.weapons[players[i].secondaryIndex].speed <= 1.2) {
                close.push(nears[i]);
                return true;
            } else if (nears[i].primaryReload + game.tickRate / items.weapons[nears[i].primaryIndex].speed >= 1 && (nears[i].primaryIndex == 5 ? nears[i].primaryReload + game.tickRate / items.weapons[nears[i].primaryIndex].speed <= 1.15 : nears[i].primaryReload + game.tickRate / items.weapons[nears[i].primaryIndex].speed <= 1.2)) {
                console.log("hit is yes")
                close.push(nears[i]);
                return true;
            }
        }
        canDeleteNearestZulu = close.length > 0;
        return false;
    } catch (e) {
        return false;
    }
}
function manageWeapons(tmpObj) {
    /*if (tmpObj.weaponIndex < 9) {
                    tmpObj.primaryIndex = tmpObj.weaponIndex;
                    tmpObj.primaryVariant = tmpObj.weaponVariant;
                } else if (tmpObj.weaponIndex > 8) {
                    tmpObj.secondaryIndex = tmpObj.weaponIndex;
                    tmpObj.secondaryVariant = tmpObj.weaponVariant;
                }*/
    if (tmpObj.weaponIndex < 9) {
        tmpObj.primaryIndex = tmpObj.weaponIndex;
        tmpObj.primaryVariant = tmpObj.weaponVariant;
        if (tmpObj.buildIndex == -1) {
            tmpObj.primaryReload = Math.min(1, tmpObj.primaryReload + game.tickRate / items.weapons[tmpObj.primaryIndex].speed);
        }
    } else if (tmpObj.weaponIndex > 8) {
        tmpObj.secondaryIndex = tmpObj.weaponIndex;
        tmpObj.secondaryVariant = tmpObj.weaponVariant;
        if (tmpObj.buildIndex == -1) {
            tmpObj.secondaryReload = Math.min(1, tmpObj.secondaryReload + game.tickRate / items.weapons[tmpObj.secondaryIndex].speed);
        }
    }
    tmpObj.sid == player.sid ? tmpObj.turretReload = Math.min(1, tmpObj.turretReload + 0.0444) : tmpObj.turretReload = Math.min(1, tmpObj.turretReload + 0.0555);
    if (tmpObj != player) {
        if (tmpObj.primaryIndex == undefined) {
            tmpObj.primaryIndex = 5;
            tmpObj.primaryReload = 1;
        }
        if (tmpObj.secondaryIndex == undefined) {
            tmpObj.secondaryIndex = 15;
            tmpObj.secondaryReload = 1;
        }
    }
}
function updatePlayers(data) {
    Preplace();
    if (player.shameCount > 0) {
        my.reSync = true;
    } else {
        my.reSync = false;
    }

    game.gameTick();

    players.forEach((tmp) => {
        tmp.forcePos = !tmp.visible;
        tmp.visible = false;
        if((tmp.timeHealed - tmp.timeDamaged)>0 && tmp.lastshamecount<tmp.shameCount) tmp.pinge = (tmp.timeHealed - tmp.timeDamaged);
    });

    for (let i = 0; i < data.length;) {
        tmpObj = findPlayerBySID(data[i]);

        if (tmpObj) {
            tmpObj.t1 = (tmpObj.t2 === undefined) ? game.lastTick : tmpObj.t2;
            tmpObj.t2 = game.lastTick;
            tmpObj.oldPos.x2 = tmpObj.x2;
            tmpObj.oldPos.y2 = tmpObj.y2;
            tmpObj.x1 = tmpObj.x;
            tmpObj.y1 = tmpObj.y;
            tmpObj.x2 = data[i + 1];
            tmpObj.y2 = data[i + 2];
            tmpObj.x3 = tmpObj.x2 + (tmpObj.x2 - tmpObj.oldPos.x2);
            tmpObj.y3 = tmpObj.y2 + (tmpObj.y2 - tmpObj.oldPos.y2);
            tmpObj.d1 = (tmpObj.d2 === undefined) ? data[i + 3] : tmpObj.d2;
            tmpObj.d2 = data[i + 3];
            tmpObj.dt = 0;
            tmpObj.buildIndex = data[i + 4];
            tmpObj.weaponIndex = data[i + 5];
            tmpObj.weaponVariant = data[i + 6];
            tmpObj.team = data[i + 7];
            tmpObj.isLeader = data[i + 8];
            tmpObj.oldSkinIndex = tmpObj.skinIndex;
            tmpObj.oldTailIndex = tmpObj.tailIndex;
            tmpObj.skinIndex = data[i + 9];
            tmpObj.tailIndex = data[i + 10];
            tmpObj.iconIndex = data[i + 11];
            tmpObj.zIndex = data[i + 12];
            tmpObj.visible = true;
            tmpObj.update(game.tickSpeed);
            tmpObj.dist2 = UTILS.getDist(tmpObj, player, 2, 2);
            tmpObj.aim2 = UTILS.getDirect(tmpObj, player, 2, 2);
            tmpObj.dist3 = UTILS.getDist(tmpObj, player, 3, 3);
            tmpObj.aim3 = UTILS.getDirect(tmpObj, player, 3, 3);
            tmpObj.damageThreat = 0;
            if (tmpObj == player) {
                tmpObj.syncThreats = 0;
            }
            client.hundleBreakObjects(tmpObj);
            client.updateManageData(tmpObj);
        }
        i += 13;
    }

    if (textManager.stack.length) {
        let positiveSum = 0;
        let negativeSum = 0;
        let positivePos = null;
        let negativePos = null;

        textManager.stack.forEach((text) => {
            if (text.value >= 0) {
                if (!positivePos) positivePos = { x: text.x, y: text.y };
                positiveSum += Math.abs(text.value);
            } else {
                if (!negativePos) negativePos = { x: text.x, y: text.y };
                negativeSum += Math.abs(text.value);
            }
        });

        if (negativeSum > 0) {
            textManager.showText(negativePos.x, negativePos.y, Math.max(45, Math.min(50, negativeSum)), 0.18, 800, negativeSum, "#8ecc51");
        }

        if (positiveSum > 0) {
            textManager.showText(positivePos.x, positivePos.y, Math.max(45, Math.min(50, positiveSum)), 0.18, 800, positiveSum, "#fff");
        }

        textManager.stack = [];
    }

    if (runAtNextTick.length) {
        runAtNextTick.forEach((tmp) => {
            checkProjectileHolder(...tmp);
        });
        runAtNextTick = [];
    }
    let teams = [];
    for (let i = 0; i < data.length;) {
        tmpObj = findPlayerBySID(data[i]);
        if (tmpObj) {
            if (!tmpObj.isTeam(player)) {
                enemy.push(tmpObj);
                if (tmpObj.dist2 <= items.weapons[tmpObj.primaryIndex == undefined ? 5 : tmpObj.primaryIndex].range + (player.scale * 2)) {
                    nears.push(tmpObj);
                }
            } else if(tmpObj.sid!==player.sid) {
                teams.push(tmpObj);
            }
            tmpObj.manageReload();
            manageWeapons(tmpObj);
            if (tmpObj != player) {
                tmpObj.addDamageThreat(player);
            }
        }
        i += 13;
    }
    // AutoEmp / Anti Turret:
    turretEmp = 0;
    gameObjects.filter((e) => e.active && e.doUpdate).forEach((tmp) => {
        if (tmp.shootted) {
            tmp.shootted = 0;
            tmp.shootReload = 2200 - config.tickRate;
        } else {
            if (tmp.shootReload > 0) {
                tmp.shootReload = Math.max(0, tmp.shootReload - config.tickRate);
                if (tmp.shootReload <= 0) {
                    tmp.shootReload = 2200;
                }
            }
            if (!tmp.isTeamObject(player) && UTILS.getDist(tmp, player, 0, 2) <= 735) {
                turretEmp++;
            }
        }
    });
    if (player && player.alive) {
        predictReload();
        game.updateEnemies();
        game.manageTickBase();
        if (teams.length) {
            teams.forEach((teammate) => {
                if (altPlayerManager.mode == 'sync') {
                    let tmp = near;

                    if (UTILS.getDistance(tmp.x2, tmp.y2, teammate.x2, teammate.y2) <= top.customTeammateRange &&
                        UTILS.getDistance(tmp.x2, tmp.y2, player.x2, player.y2) <= top.customPlayerRange &&
                        player.reloads[player.primaryIndex] === 0 &&
                        teammate.reloads[teammate.primaryIndex] === 0) {
                        if (teammate.weaponIndex === teammate.primaryIndex && player.weaponIndex === player.primaryIndex) {
                            traps.wompwomp = false;
                            clicks.left = true;
                            top.lastSync = Date.now();

                            game.tickBase(() => {
                                clicks.left = false;
                            }, 2);
                        } else if (player.weaponIndex !== player.primaryIndex) {
                            selectWeapon(player.primaryIndex);
                            traps.wompwomp = false;
                        }
                    }
                }
            });
        }
        var antispiketicked = false
        if (advHeal.length) {
            advHeal.forEach((updHealth) => {
                if (window.pingTime < 150) {
                    let sid = updHealth[0];
                    let value = updHealth[1];
                    let totalDamage = 100 - value
                    let damaged = updHealth[2];
                    tmpObj = findPlayerBySID(sid);
                    let bullTicked = false;
                    if (tmpObj && tmpObj.health <= 0) {
                        if (!tmpObj.death) {
                            tmpObj.death = true;
                            if (tmpObj != player) {
                                //notif2(tmpObj.name, "has died");
                            }
                            addDeadPlayer(tmpObj);
                        }
                    }
                    if (tmpObj == player) {
                        if (tmpObj.skinIndex == 7 && (damaged == 5 || (tmpObj.latestTail == 13 && damaged == 2))) {
                            if (my.reSync) {
                                my.reSync = false;
                                tmpObj.setBullTick = true;
                            }
                            bullTicked = true;
                        }
                        if (inGame) {
                            let attackers = getAttacker(damaged);
                            let gearDmgs = [0.25, 0.45].map((val) => val * items.weapons[player.weapons[0]].dmg * soldierMult());
                            let includeSpikeDmgs = enemy.length ? !bullTicked && (gearDmgs.includes(damaged) && near.skinIndex == 11) : false;
                            let healTimeout = 140 - window.pingTime;
                            let dmg = 100 - player.health;
                            let safewalking = false
                            let slowHeal = function (timer, tickBase) {
                                if (!tickBase) {
                                    setTimeout(() => {
                                        healer();
                                    }, timer);
                                } else {
                                    game.tickBase(() => {
                                        healer()
                                    }, 2)
                                }
                            }
                            if (configs.healingBeta) {
                                if (enemy.length) {
                                    if ([0, 7, 8].includes(near.primaryIndex)) {
                                        if (damaged < 75) {//normal heal
                                            slowHeal(healTimeout)
                                        } else {
                                            healer()
                                        }
                                    }
                                    let NearHasOneFrame = near.primaryVariant >= 1 && near.weapons[0] == 5
                                    let PolOrKat = player.weapons[0] === 4 || player.weapons[0] === 5
                                    let canSafeHitback = PolOrKat && !traps.inTrap && player.shameCount <= 4 && !NearHasOneFrame && !antispiketicked && !safewalking// && near.reloads[player.weapons[0]] == 0
                                    if (canSafeHitback && damaged >= 20 && near.dist2 <= 150 && (player.weapons[0] == 4 || player.weapons[0] == 3 || player.weapons[0] == 5) && player.skinIndex == 11 && player.reloads[player.weapons[1]] == 0 && player.reloads[player.weapons[0]] == 0) {//hitback
                                        addMenuChText("[COWGAME]", "Debug Heal - HitBack (Process)", "lightBlue");
                                        healer();
                                    }
                                    if(player.weapons[1] == 11) {//shield anti
                                        if ([15, 9, 12, 13].includes(near.secondaryIndex) && near.reloads[near.secondaryIndex] == 1) {
                                            if (damaged < 75) {
                                                my.autoAim = true;
                                                selectWeapon(player.weapons[1]);
                                                slowHeal(healTimeout)
                                                setTimeout(() => {
                                                    selectWeapon(player.weapons[0]);
                                                    my.autoAim = false;
                                                }, 250);
                                            }
                                        }
                                    } else if(player.weapons[1] == 11) {//shield anti2
                                        if (near.skinIndex == 53) {
                                            my.autoAim = true;
                                            selectWeapon(player.weapons[1]);
                                            slowHeal(healTimeout)
                                            setTimeout(() => {
                                                selectWeapon(player.weapons[0]);
                                                my.autoAim = false;
                                            }, 250);
                                        }
                                    }
                                    if ([1, 2, 6].includes(near.primaryIndex)) {
                                        if (damaged >= 25 && player.damageThreat + dmg >= 95 && tmpObj.shameCount < 5) {
                                            healer()
                                        } else {
                                            slowHeal(healTimeout)
                                        }
                                    }
                                    if (near.primaryIndex == 5 && near.secondaryIndex == 10 && traps.inTrap && dmg >= 10 && near.reloads[near.primaryIndex] == 0) { //beta anti rev tick
                                        healer()
                                    }
                                    if (near.primaryIndex == 3) {//sword insta
                                        if (near.secondaryIndex == 15) {
                                            if (near.primaryVariant < 2) {
                                                if (damaged >= 35 && player.damageThreat + dmg >= 95 && tmpObj.shameCount < 6) {
                                                    tmpObj.canEmpAnti = true
                                                    healer()
                                                } else {
                                                    slowHeal(healTimeout)
                                                }
                                            } else {
                                                if (damaged > 35 && player.damageThreat + dmg >= 95 && tmpObj.shameCount < 6 && game.tick - player.antiTimer > 1) {
                                                    tmpObj.canEmpAnti = true
                                                    tmpObj.antiTimer = game.tick
                                                    healer()
                                                } else {
                                                    slowHeal(healTimeout)
                                                }
                                            }
                                        } else {
                                            if (damaged >= 25 && player.damageThreat + dmg >= 95 && tmpObj.shameCount < 4) {
                                                healer()
                                            } else {
                                                slowHeal(healTimeout)
                                            }
                                        }
                                    }
                                    if (near.primaryIndex == 4) {
                                        if (near.primaryVariant >= 1) {
                                            if (damaged >= 10 && player.damageThreat + dmg >= 95 && tmpObj.shameCount < 4) {
                                                healer()
                                            } else {
                                                slowHeal(healTimeout)
                                            }
                                        } else {
                                            if (damaged >= 35 && player.damageThreat + dmg >= 95 && tmpObj.shameCount < 3) {
                                                healer()
                                            } else {
                                                slowHeal(healTimeout)
                                            }
                                        }
                                    }
                                    if ([undefined, 5].includes(near.primaryIndex)) {
                                        if (near.secondaryIndex == 10) {
                                            if (dmg >= (includeSpikeDmgs ? 10 : 20) && tmpObj.damageThreat + dmg >= 80 && tmpObj.shameCount < 6) {
                                                healer()
                                            } else {
                                                slowHeal(healTimeout)
                                            }
                                        } else
                                            if (near.primaryVariant >= 2 || near.primaryVariant == undefined) {
                                                if (dmg >= (includeSpikeDmgs ? 15 : 20) && tmpObj.damageThreat + dmg >= 50 && tmpObj.shameCount < 6) {
                                                    healer()
                                                } else {
                                                    slowHeal(healTimeout)
                                                }
                                            } else
                                                if ([undefined || 15].includes(near.secondaryIndex)) {
                                                    if (damaged > (includeSpikeDmgs ? 8 : 20) && player.damageThreat >= 25 && (game.tick - player.antiTimer) > 1) {
                                                        if (tmpObj.shameCount < 5) {
                                                            healer()
                                                        } else {
                                                            slowHeal(healTimeout)
                                                        }
                                                    } else {
                                                        slowHeal(healTimeout)
                                                    }
                                                } else
                                                    if ([9, 12, 13].includes(near.secondaryIndex)) {
                                                        if (dmg >= 25 && player.damageThreat + dmg >= 70 && tmpObj.shameCount < 6) {
                                                            healer()
                                                        } else {
                                                            slowHeal(healTimeout)
                                                        }
                                                    } else {
                                                        if (damaged > 25 && player.damageThreat + dmg >= 95) {
                                                            healer()
                                                        } else {
                                                            slowHeal(healTimeout)
                                                        }
                                                    }
                                    }
                                    if (near.primaryIndex == 6) {
                                        if (near.secondaryIndex == 15) {
                                            if (damaged >= 25 && tmpObj.damageThreat + dmg >= 95 && tmpObj.shameCount < 4) {
                                                healer()
                                            } else {
                                                slowHeal(healTimeout)
                                            }
                                        } else {
                                            if (damaged >= 70 && tmpObj.shameCount < 4) {
                                                healer()
                                            } else {
                                                slowHeal(healTimeout)
                                            }
                                        }
                                    }
                                    if (damaged >= 30 && near.reloads[near.secondaryIndex] == 0 && near.dist2 <= 150 && player.skinIndex == 11 && player.tailIndex == 21) instaC.canCounter = true
                                } else {
                                    if (damaged >= 70) {
                                        healer()
                                    } else {
                                        slowHeal(healTimeout)
                                    }
                                }
                            } else {
                                if (damaged >= (includeSpikeDmgs ? 8 : 25) && dmg + player.damageThreat >= 80 && (game.tick - player.antiTimer) > 1) {
                                    if (tmpObj.reloads[53] == 0 && tmpObj.reloads[tmpObj.weapons[1]] == 0) {
                                        tmpObj.canEmpAnti = true;
                                    } else {
                                        player.soldierAnti = true;
                                    }
                                    tmpObj.antiTimer = game.tick;
                                    let shame = [0, 4, 6, 7, 8].includes(near.primaryIndex) ? 2 : 5;
                                    if (tmpObj.shameCount < shame) {
                                        healer();
                                    } else {
                                        if (near.primaryIndex == 7 || (player.weapons[0] == 7 && (near.skinIndex == 11 || near.tailIndex == 21))) {
                                            slowHeal(healTimeout)
                                        } else {
                                            slowHeal(healTimeout, 1)
                                        }
                                    }
                                } else {
                                    if (near.primaryIndex == 7 || (player.weapons[0] == 7 && (near.skinIndex == 11 || near.tailIndex == 21))) {
                                        slowHeal(healTimeout)
                                    } else {
                                        slowHeal(healTimeout, 1)
                                    }
                                }
                                if (damaged >= 25 && near.dist2 <= 140 && player.skinIndex == 11 && player.tailIndex == 21) instaC.canCounter = true
                            }
                        } else {
                            if (!tmpObj.setPoisonTick && (tmpObj.damaged == 5 || (tmpObj.latestTail == 13 && tmpObj.damaged == 2))) {
                                tmpObj.setPoisonTick = true;
                            }
                        }
                    }
                } else {
                    let [sid, value, damaged] = updHealth;
                    let totalDamage = 100 - value;
                    let tmpObj = findPlayerBySID(sid);
                    let bullTicked = false;

                    if (tmpObj == player) {
                        if (tmpObj.skinIndex == 7 && (damaged == 5 || (tmpObj.latestTail == 13 && damaged == 2))) {
                            if (my.reSync) {
                                my.reSync = false;
                                tmpObj.setBullTick = true;
                                bullTicked = true;
                            }
                        }
                        if (inGame) {
                            let attackers = getAttacker(damaged);
                            let gearDmgs = [0.25, 0.45].map((val) => val * items.weapons[player.weapons[0]].dmg * soldierMult());
                            let includeSpikeDmgs = enemy.length ? !bullTicked && (gearDmgs.includes(damaged) && near.skinIndex == 11) : false;
                            let healTimeout = 60;
                            let dmg = 100 - player.health;
                            let shameCountThreshold = [2, 5][[0, 4, 6, 7, 8].includes(near.primaryIndex) ? 0 : 1];

                            let slowHeal = function (timer, tickBase) {
                                if (!tickBase) setTimeout(() => healer(), timer);
                                else game.tickBase(() => healer(), 2);
                            };

                            if (configs.healingBeta) {
                                let canHealFast = [0, 7, 8].includes(near.primaryIndex) ? damaged < 75 :
                                [1, 2, 6].includes(near.primaryIndex) ? damaged >= 25 && player.damageThreat + dmg >= 95 && tmpObj.shameCount < 5 :
                                [undefined, 5].includes(near.primaryIndex) ? dmg >= (includeSpikeDmgs ? 15 : 20) && tmpObj.damageThreat + dmg >= 50 && tmpObj.shameCount < 6 :
                                near.primaryIndex == 3 && near.secondaryIndex == 15 ? damaged >= 35 && player.damageThreat + dmg >= 95 && tmpObj.shameCount < 5 && game.tick - player.antiTimer > 1 :
                                near.primaryIndex == 4 ? near.primaryVariant >= 1 ? damaged >= 10 && player.damageThreat + dmg >= 95 && tmpObj.shameCount < 4 :
                                damaged >= 35 && player.damageThreat + dmg >= 95 && tmpObj.shameCount < 3 :
                                near.primaryIndex == 6 && near.secondaryIndex == 15 ? damaged >= 25 && tmpObj.damageThreat + dmg >= 95 && tmpObj.shameCount < 4 :
                                damaged >= 25 && player.damageThreat + dmg >= 95;

                                canHealFast ? healer() : slowHeal(healTimeout);
                            } else {
                                let canHealFast = damaged >= (includeSpikeDmgs ? 8 : 25) && dmg + player.damageThreat >= 80 && (game.tick - player.antiTimer) > 1;

                                if (canHealFast) {
                                    if (tmpObj.reloads[53] == 0 && tmpObj.reloads[tmpObj.weapons[1]] == 0) tmpObj.canEmpAnti = true;
                                    else player.soldierAnti = true;
                                    tmpObj.antiTimer = game.tick;
                                    if (tmpObj.shameCount < shameCountThreshold) healer();
                                    else slowHeal(healTimeout, near.primaryIndex == 7 || (player.weapons[0] == 7 && (near.skinIndex == 11 || near.tailIndex == 21)) ? 0 : 1);
                                } else {
                                    slowHeal(healTimeout, near.primaryIndex == 7 || (player.weapons[0] == 7 && (near.skinIndex == 11 || near.tailIndex == 21)) ? 0 : 1);
                                }
                            }
                        } else {
                            if (!tmpObj.setPoisonTick && (tmpObj.damaged == 5 || (tmpObj.latestTail == 13 && tmpObj.damaged == 2))) {
                                tmpObj.setPoisonTick = true;
                            }
                        }
                    }
                }
            });
            advHeal = [];
        }

        if (getEl("doHideDataMenu").checked && datatitle.style.display != "block") {
            datatitle.style.display = "block";
        } else if (!getEl("doHideDataMenu").checked && datatitle.style.display != "none") {
            datatitle.style.display = "none";
        }

        players.forEach((tmp) => {
            if (!tmp.visible && player != tmp) {
                tmp.reloads = {
                    0: 0,
                    1: 0,
                    2: 0,
                    3: 0,
                    4: 0,
                    5: 0,
                    6: 0,
                    7: 0,
                    8: 0,
                    9: 0,
                    10: 0,
                    11: 0,
                    12: 0,
                    13: 0,
                    14: 0,
                    15: 0,
                    53: 0,
                };
            }
            if (tmp.setBullTick) {
                tmp.bullTimer = 0;
            }
            if (tmp.setPoisonTick) {
                tmp.poisonTimer = 0;
            }
            tmp.updateTimer();
        });
        if (inGame) {
            antiKnockBack(near.enemy);
            if (enemy.length) {
                /*                 let weaponNameMap = {
                    0: "tool hammer",
                    1: "hand axe",
                    2: "great axe",
                    3: "short sword",
                    4: "katana",
                    5: "polearm",
                    6: "bat",
                    7: "daggers",
                    8: "stick"
                };
                let weaponName = weaponNameMap[tmpObj.primaryIndex];
                let secondaryWeaponName;
                if (tmpObj.secondaryIndex === 9) {
                    secondaryWeaponName = "hunting bow";
                } else if (tmpObj.secondaryIndex === 10) {
                    secondaryWeaponName = "great hammer";
                } else if (tmpObj.secondaryIndex === 11) {
                    secondaryWeaponName = "wooden shield";
                } else if (tmpObj.secondaryIndex === 12) {
                    secondaryWeaponName = "crossbow";
                } else if (tmpObj.secondaryIndex === 13) {
                    secondaryWeaponName = "repeater crossbow";
                } else if (tmpObj.secondaryIndex === 14) {
                    secondaryWeaponName = "mc grabby";
                } else if (tmpObj.secondaryIndex === 15) {
                    secondaryWeaponName = "musket";
                } */
                let lastPrimary = near?.primaryIndex;
                let lastSecondary = near?.secondaryIndex;
                document.getElementById('database').innerHTML = `
                            Name: ${near.name} <br>
                            Shame: ${tmpObj.shameCount} <br>
                            Health: ${tmpObj.health} <br>
                            Primary: ${items?.weapons[lastPrimary]?.name} <br>
                            Secondary: ${items?.weapons[lastSecondary]?.name}
                        `;
            } else if (!enemy.length && document.getElementById('database').innerHTML != `No Information`) {
                document.getElementById('database').innerHTML = `No Information`;
            }
            if (enemy.length) {
                //sCombat.findSpikeHit.x = 0;
                //sCombat.findSpikeHit.y = 0;
                // Auto Knock Back:
                //sCombat.doSpikeHit();
                //sCombat.findSpikeHit.spikes = [];
                if (!instaC.isTrue && my.anti0Tick <= 0) {
                    let brt = knockBackPredict();
                    if (brt == "insta them" && (![9, 12, 13, 15].includes(player.weapons[1]) || near.dist2 <= items.weapons[player.weapons[1]].range + player.scale * 1.8)) {
                        instaC.changeType(getEl("revTick").checked || player.weapons[1] == 10 ? "rev" : "normal");
                    }
                    if (brt == "primary sync") {
                        instaC.spikeTickType("rev");
                    }
                }
                // Near in Trap:
                if (near.dist2 < 600) {
                    let nearTrap = closeObjects.filter(e => e.trap && e.active && e.isTeamObject(player) && UTILS.getDist(e, near, 0, 2) <= (near.scale + e.getScale() + 5)).sort(function(a, b) {
                        return UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2);
                    })[0];
                    near.inTrap = nearTrap;
                } else {
                    near.inTrap = [];
                }

                if (player.canEmpAnti) {
                    player.canEmpAnti = false;
                    if (near.dist2 <= 300 && !my.safePrimary(near) && !my.safeSecondary(near)) {
                        if (near.reloads[53] == 0){
                            player.empAnti = true;
                            player.soldierAnti = false;
                        } else {
                            player.empAnti = false;
                            player.soldierAnti = true;
                        }
                    }
                }
                let prehit = gameObjects.filter(tmp => tmp.dmg && tmp.active && tmp.isTeamObject(player) && UTILS.getDist(tmp, near, 0, 3) <= (tmp.scale + near.scale)).sort(function (a, b) {
                    return UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2);
                })[0];
                if (prehit) {
                    if (near.dist2 <= items.weapons[player.weapons[0]].range + player.scale * 1.8) {
                        instaC.canSpikeTick = true;
                        instaC.syncHit = true;
                        if (getEl("revTick").checked && player.weapons[1] == 15 && player.reloads[53] == 0 && instaC.perfCheck(player, near)) {
                            instaC.revTick = true;
                        }
                    }
                }
                let antiSpikeTick = gameObjects
                .filter(
                    (tmp) =>
                    tmp.dmg &&
                    tmp.active &&
                    !tmp.isTeamObject(player) &&
                    UTILS.getDist(tmp, player, 0, 3) < tmp.scale + 35
                )
                .sort(function (a, b) {
                    return (
                        UTILS.getDist(a, player, 0, 2) -
                        UTILS.getDist(b, player, 0, 2)
                    );
                })[0];
                if (antiSpikeTick && !traps.inTrap) {
                    if (near.dist2 <= items.weapons[5].range + near.scale * 1.8) {
                        my.anti0Tick = 1;
                        player.chat.message = "Anti " + near.sid + " (" + near.name + ")";
                        player.chat.count = 2000;
                    }
                }
            }
            function hitBull(angle, id) {
                let antiBullTrue = configs.antiBull;
                instaC.isTrue = true;
                if (angle == near.aim2) {
                    my.autoAim = true;
                    game.tickBase(() => {
                        my.autoAim = false;
                    }, 2);
                } else {
                    packet("D", angle, "hitBull");
                }
                selectWeapon(player.weapons[id]);
                if (player.tailIndex == 11) {
                    buyEquip(19, 1);
                } else {
                    buyEquip(7, 0);
                }
                sendAutoGather(2);
                game.tickBase(() => {
                    packet("D", angle, "hitBull");
                    selectWeapon(player.weapons[id]);
                    instaC.isTrue = false;
                }, 1);
            }
            let canSyncHit = false;
            if (
                player.reloads[player.weapons[0]] != 0 ||
                !near ||
                near.dist2 > items.weapons[player.weapons[0]].range + 63
            ) {
                canSyncHit = false;
            } else {
                let _ = near;
                let dmg = 0;
                for (let j = 0; j < enemy.length; j++) {
                    let tmp = enemy[j];
                    if (tmp) {
                        if (tmp.sid == player.sid || tmp.sid == near.sid) continue;
                        if (
                            tmp.primaryIndex &&
                            tmp.canSync &&
                            (UTILS.getDist(tmp, near, 3, 3) <=
                             items.weapons[tmp.primaryIndex].range + 63 ||
                             UTILS.getDist(tmp, near, 2, 2) <=
                             items.weapons[tmp.primaryIndex].range + 63)
                        ) {
                            dmg +=
                                items.weapons[tmp.primaryIndex].dmg *
                                sortWeaponVariant(tmp.primaryVariant) *
                                1.5;
                        }
                    }
                }
                dmg +=
                    items.weapons[player.weapons[0]].dmg *
                    1.5 *
                    sortWeaponVariant(player.primaryVariant);
                if (dmg * (_.skinIndex == 6 ? 0.75 : 1) >= 100) {
                    canSyncHit = true;
                } else {
                    canSyncHit = false;
                }
            }
            // autoHit:
            if (
                configs.autoSync &&
                canSyncHit &&
                (UTILS.getDist(player, near, 3, 3) <=
                 items.weapons[player.primaryIndex].range + 63 ||
                 UTILS.getDist(player, near, 2, 2) <=
                 items.weapons[player.primaryIndex].range + 63)
            ) {
                player.chat.message = "Autosync";
                player.chat.count = 2000;
                hitBull(near.aim2, 0);
            }
            function getDist(e, t) {
                try {
                    return Math.hypot((t.y2 || t.y) - (e.y2 || e.y), (t.x2 || t.x) - (e.x2 || e.x));
                } catch (e) {
                    return Infinity;
                }
            }

            let instaTurretReload = (!useWasd ? true : getEl("oneShotInsta").checked ? player.reloads[53] <= (player.weapons[1] == 10 ? 0 : game.tickRate) : true);
            if ((useWasd ? true : ((player.checkCanInsta(true) >= 100 ? player.checkCanInsta(true) : player.checkCanInsta(false)) >= (player.weapons[1] == 10 ? 95 : 100))) && near.dist2 <= items.weapons[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]].range + near.scale * 1.8 && (instaC.wait || (useWasd && Math.floor(Math.random() * 5) == 0)) && !instaC.isTrue && !my.waitHit && player.reloads[player.weapons[0]] == 0 && player.reloads[player.weapons[1]] == 0 && instaTurretReload && instaC.perfCheck(player, near)) {
                if (player.checkCanInsta(true) >= 100) {
                    instaC.nobull = useWasd ? false : instaC.canSpikeTick ? false : true;
                } else {
                    instaC.nobull = false;
                }
                instaC.can = true;
            } else {
                instaC.can = false;
            }

            const SpeedMill = () => {
                if ((player.skinIndex == 12 && player.tailIndex == 11 && player.weaponIndex == 7)) {
                    return 1;
                }else {
                    return player.tailIndex == 11 ? ((CheckSnowBiome() && player.skinIndex != 15) || (player.weaponIndex == 10 || player.weaponIndex == 3 || player.weaponIndex == 4)) ? player.weaponIndex == 5 ? 4 : 3 : 2 : ((CheckSnowBiome() && player.skinIndex != 15) || (player.weaponIndex == 10 || player.weaponIndex == 4 || player.weaponIndex == 5 || player.weaponIndex == 5)) ? 4 : 3;
                }
            }
            const CheckSnowBiome = () => {
                if (player.y2 <= config.snowBiomeTop) {
                    return true;
                } else {
                    return false;
                }
            }
            macro.q && place(0, getAttackDir());
            macro.f && place(4, getSafeDir());
            macro.v && place(2, getSafeDir());
            macro.h && place(player.getItemType(22), getSafeDir());
            let CheckMaxSpeed = SpeedMill();
            if (game.tick % CheckMaxSpeed == 0) {
                if (mills.place) {
                    let plcAng = 1.20;
                    if (player.items[4] != 15) {
                        checkPlace(4, getSafeDir());
                    }
                    for (let i = -plcAng; i <= plcAng; i += plcAng) {
                        checkPlace(3, UTILS.getDirect(player.oldPos, player, 2, 2) + i, 1);
                    }
                } else {
                    if (mills.placeSpawnPads) {
                        for (let i = 0; i < Math.PI * 2; i += Math.PI / 2) {
                            checkPlace(player.getItemType(20), i);
                        }
                    }
                }
            } else {
                traps.autoPlace();
            }

            if (instaC.can) {
                instaC.changeType((getEl("revTick").checked || player.weapons[1] == 10) ? "rev" : instaC.nobull ? "nobull" : "normal");
            } else if (instaC.canCounter) {
                instaC.canCounter = false;
                if (player.reloads[player.weapons[0]] == 0 && !instaC.isTrue) {
                    if (player.secondaryIndex != 10) {
                        instaC.counterType();
                    } else {
                        instaC.hammerCounterType();
                    }
                }
            }

            if (instaC.canSpikeTick) {
                instaC.canSpikeTick = false;
                if (instaC.revTick) {
                    instaC.revTick = false;
                    if ([1, 2, 3, 4, 5, 6].includes(player.weapons[0]) && player.reloads[player.weapons[1]] == 0 && !instaC.isTrue) {
                        instaC.changeType("rev");
                    }
                } else {
                    if ([1, 2, 3, 4, 5, 6].includes(player.weapons[0]) && player.reloads[player.weapons[0]] == 0 && !instaC.isTrue) {
                        instaC.spikeTickType();
                        if (instaC.syncHit) {
                        }
                    }
                }
            }
            if (spikes.inRange) {
                if (!clicks.left && !clicks.right && !instaC.isTrue) {
                    if (configs.doAutoBreakSpike) {
                        if (player.weaponIndex != (player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]) || player.buildIndex > -1) {
                            selectWeapon(player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]);
                        }
                        if (player.reloads[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0 && !my.waitHit) {
                            sendAutoGather();
                            my.waitHit = 1;
                            buyEquip(40, 0);
                            packet("F", 1);
                            game.tickBase(() => {
                                sendAutoGather();
                                my.waitHit = 0;
                                buyEquip(6, 0);
                                packet("F", null, 0);
                            }, 1);
                        }
                    }
                }
            }
            if (!instaC.isTrue) {
                if (!clicks.middle && (clicks.left || clicks.right)) {
                    let weapon = clicks.right && player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0];

                    if (player.weaponIndex != weapon || player.buildIndex > -1) {
                        selectWeapon(weapon);
                    }

                    if (player.reloads[clicks.right && player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0 && !my.waitHit) {
                        sendAutoGather();
                        my.waitHit = 1;
                        game.tickBase(() => {
                            sendAutoGather();
                            my.waitHit = 0;
                        }, 1);
                    }
                } else if (traps.inTrap || breakSpike.active) {
                    let weapon;

                    if (traps.inTrap) {
                        let checkObj = traps.hasSpike && objectManager.hitsToBreak(traps.info[1], player) <= objectManager.hitsToBreak(traps.info[0], player) ? 1 : 0;
                        weapon = traps.notFast(traps.info[checkObj]) ? player.weapons[1] : player.weapons[0];
                    } else {
                        weapon = traps.notFast(breakSpike.info) ? player.weapons[1] : player.weapons[0];
                    }

                    if (player.weaponIndex != weapon || player.buildIndex > -1) {
                        selectWeapon(weapon);
                    }

                    if (player.reloads[weapon] == 0 && !my.waitHit) {
                        sendAutoGather();
                        my.waitHit = 1;
                        packet("F", 1);
                        game.tickBase(() => {
                            sendAutoGather();
                            my.waitHit = 0;
                            packet("F", null, 0);
                        }, 1);
                    }
                } else {
                    if (useWasd && near.dist2 <= (items.weapons[player.weapons[0]].range + near.scale * 1.8) && !traps.inTrap) {
                        if ((player.weaponIndex != player.weapons[0]) || player.buildIndex > -1) {
                            selectWeapon(player.weapons[0]);
                        }
                        if (player.reloads[player.weapons[0]] == 0 && !my.waitHit) {
                            sendAutoGather();
                            my.waitHit = 1;
                            game.tickBase(() => {
                                sendAutoGather();
                                my.waitHit = 0;
                            }, 1);
                        }
                    }
                    if (clicks.middle) {
                        if (player.reloads[player.weapons[1]] == 0) {
                            if (my.ageInsta && player.weapons[0] != 4 && player.weapons[1] == 9 && player.age >= 9 && enemy.length) {
                                instaC.bowMovement();
                            } else {
                                instaC.rangeType();
                            }
                        }
                    }
                    if (macro.t) {
                        if (player.reloads[player.weapons[0]] == 0 && (player.weapons[1] == 15 ? (player.reloads[player.weapons[1]] == 0) : true) && (player.weapons[0] == 5 || (player.weapons[0] == 4 && player.weapons[1] == 15))) {
                            instaC[(player.weapons[0] == 4 && player.weapons[1] == 15) ? "kmTickMovement" : "tickMovement"]();
                        }
                    }
                    if (macro.u) {
                        if (player.reloads[player.weapons[0]] == 0 && ([9, 12, 13, 15].includes(player.weapons[1]) ? (player.reloads[player.weapons[1]] == 0) : true)) {
                            instaC.BoostOneTick();
                        }
                    }
                    if (macro["."]) {
                        if (player.reloads[player.weapons[0]] == 0 && ([9, 12, 13, 15].includes(player.weapons[1]) ? (player.reloads[player.weapons[1]] == 0) : true)) {
                            instaC.BoostPerfectedSpiketick();
                        }
                    }
                    if (macro.c) {
                        if (player.reloads[player.weapons[0]] == 0 && ([9, 12, 13, 15].includes(player.weapons[1]) ? (player.reloads[player.weapons[1]] == 0) : true)) {
                            instaC.boostTickMovement();
                        }
                    }
                    if (player.weapons[1] && !(spikes.inRange && configs.doAutoBreakSpike) && !(useWasd && near.dist2 <= items.weapons[player.weapons[0]].range + near.scale * 1.8)) {
                        if (player.reloads[player.weapons[0]] == 0 && player.reloads[player.weapons[1]] == 0) {
                            if (!my.reloaded) {
                                my.reloaded = true;
                                let fastSpeed = items.weapons[player.weapons[0]].spdMult < items.weapons[player.weapons[1]].spdMult ? 1 : 0;
                                if (player.weaponIndex != player.weapons[fastSpeed] || player.buildIndex > -1) {
                                    selectWeapon(player.weapons[fastSpeed]);
                                }
                            }
                        } else {
                            my.reloaded = false;
                            if (player.reloads[player.weapons[0]] > 0) {
                                if (player.weaponIndex != player.weapons[0] || player.buildIndex > -1) {
                                    selectWeapon(player.weapons[0]);
                                }
                            } else if (player.reloads[player.weapons[0]] == 0 && player.reloads[player.weapons[1]] > 0) {
                                if (player.weaponIndex != player.weapons[1] || player.buildIndex > -1) {
                                    selectWeapon(player.weapons[1]);
                                }
                            }
                        }
                    }
                }
            }

            /* end shit */
            const doOneFrame = () => {
                my.autoAim = true;
                selectWeapon(player.weapons[0]);
                buyEquip(53, 0);
                selectWeapon(player.weapons[0]);
                game.tickBase(() => {
                    buyEquip(7, 0);
                    sendAutoGather();
                    game.tickBase(() => {
                        selectWeapon(player.weapons[0]);
                        sendAutoGather();
                        my.autoAim = false;
                    }, 1);
                }, 1);
            }
            /* end shit */
            function autoOneFrame() {
                let neIT = false;
                let nearTrapped = gameObjects.filter(tmp => tmp.trap && tmp.active && tmp.isTeamObject(player) && UTILS.getDist(tmp, near, 0, 2) <= (near.scale + tmp.getScale() + 15))
                .sort(function(a, b) {
                    return UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2);
                })[0];

                if (nearTrapped) {
                    neIT = true;
                }

                if (configs.autoOneFrame) {
                    let ping = window.pingTime;
                    let range = (ping > 140) ? 230 : (ping > 110) ? 210 : (ping > 85) ? 190 : 170;
                    if (near.dist2 > range && near.dist2 <= 245 && !traps.inTrap && player.reloads[player.weapons[0]] == 0 && player.reloads[53] == 0 && player.weapons[0] == 5 && ((!neIT && near.skinIndex != 6) || neIT)) {
                        packet("9", undefined, 1);
                        game.tickBase(() => {
                            packet("9", near.aim2, 1);
                        }, 1);
                        doOneFrame();
                    }
                }
            }

            const elotickers = () => {
                if (player.reloads[player.weapons[0]] == 0 && player.reloads[53] == 0) {
                    buyEquip(53, 0);
                    game.tickBase(() => {
                        selectWeapon(player.weapons[0]);
                        my.autoAim = true;
                        buyEquip(7, 0);
                        packet("F", 1);
                        sendAutoGather();
                        game.tickBase(() => {
                            selectWeapon(player.weapons[0]);
                            sendAutoGather();
                            my.autoAim = false;
                            packet("F", null, 0);
                        }, 1);
                    }, 1);
                }
            }
            if (!instaC.isTrue && !traps.inTrap) {
                if ((configs.autoPlaceOnReplace && !traps.replaced) || true && configs.autoPlace) {
                    traps.autoPlace();
                }
                if (configs.autoOneFrame && autoOneFrameToggled) {
                    autoOneFrame();
                }
            }

            if (!macro.q && !macro.f && !macro.v && !macro.h) {
                packet("D", getAttackDir());
            }
            let antiReverse = false;

            let damageTrap = new class { // weapon tank / normal damage for object included upgraded weapon
                checkWeaponDmg(_, sold = true, tank = true) {
                    const { primaryVariant: v, weapons: [weapon] } = _;
                    const pV = v ? config.weaponVariants[v].val : 1;
                    const e = (tank && player.skins[40]) ? 3.3 : 1;

                    return items.weapons[weapon].dmg * e * pV;
                }
            };
            const ef = () => { // detects it last hit for object
                const e = heal.checkWeaponDmg(player, true, true);
                const w = gameObjects.find(trap => trap.health <= e);
                return w;
            }
            let hatChanger = function () {
                let antispiketickthreat = traps.checkSpikeTick();
                let heal = new class { // weapon tank / normal damage for object included upgraded weapon
                    checkWeaponDmg(_, sold = true, tank = true) {
                        const { primaryVariant: v, weapons: [weapon] } = _;
                        const pV = v ? config.weaponVariants[v].val : 1;
                        const e = (tank && player.skins[40]) ? 3.3 : 1;

                        return items.weapons[weapon].dmg * e * pV;
                    }
                };
                let hatId = 0;
                if (my.anti0Tick > 0) {
                    hatId = 6;
                } else if (near.dist2 <= 280 && near.skinIndex == 53) {
                    if (detect.onetick || detect.spiketick || !detect.reverse) {
                        if (player.skinIndex != 6 && (near.primaryVariant >= 2 && near.primaryIndex == 5)) {
                            my.reSync = false;
                            instaC.isTrue = false;
                            hatId = 6;
                            setTimeout(() => {
                                hatId = 6;
                            }, 1000);
                        }
                    }
                } else if (clicks.left || clicks.right) {
                    if (((!enemy.length || near.dist2 >= 200) && player.shameCount > 0 && (game.tick - player.bullTick) % config.serverUpdateRate === 0 && player.skinIndex != 45) || my.reSync) {
                        buyEquip(7, 0);
                    } else if (clicks.left) {
                        buyEquip(player.reloads[player.weapons[0]] == 0 ? getEl('weaponGrind').checked ? 40 : 7 : 6, 0);
                    } else if (clicks.right) {
                        buyEquip(player.reloads[clicks.right && player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0 ? 40 : 6, 0);
                    }
                } else if (traps.inTrap) {
                    if ((traps.info.health <= items.weapons[player.weaponIndex].dmg ? false : player.reloads[player.weaponCode] == 0) && my.anti0Tick == 0) {
                        hatId = antispiketickthreat ? 6 : 40;
                    } else {
                        hatId = 6;
                    }
                } else if (((!enemy.length || near.dist2 >= 200) && player.shameCount > 0 && (game.tick - player.bullTick) % config.serverUpdateRate === 0 && player.skinIndex != 45) || my.reSync) {
                    hatId = 7;
                } else if (player.y2 >= config.mapScale / 2 - config.riverWidth / 2 && player.y2 <= config.mapScale / 2 + config.riverWidth / 2) {
                    if (!configs.alwaysFlipper) {
                        if (near.dist2 <= 300) {
                            buyEquip((getEl("antiBullType").value == "abreload" && near.antiBull > 0) ? 11 : (getEl("antiBullType").value == "abalway" && near.reloads[near.primaryIndex] == 0) ? 11 : (near.dist2 < 300) ? 6 : my.defaultHat, 0);
                        } else {
                            biomeGear(1);
                        }
                    } else {
                        biomeGear(1);
                    }
                } else if (near.dist2 <= 300) {
                    buyEquip((getEl("antiBullType").value == "abreload" && near.antiBull > 0) ? 11 : (getEl("antiBullType").value == "abalway" && near.reloads[near.primaryIndex] == 0) ? 11 : (near.dist2 < 300) ? 6 : my.defaultHat, 0);
                } else {
                    biomeGear(1);
                }
                buyEquip(hatId, 0);
            };
            let accChanger = function() {
                if (clicks.left) {
                    buyEquip(18, 1);
                } else if (clicks.right) {
                    buyEquip(21, 1)
                } else if (traps.inTrap) {
                    buyEquip(21, 1);
                } else if (near.dist2 < 300){
                    if (getEl("antiBullType").value == "noab") {
                        buyEquip(19, 1)
                        if (getEl("antiBullType").value == "abreload") {
                            buyEquip(21, 1)
                        }
                    } else if (getEl("alwaysFlipper").checked && player.y2 >= config.mapScale / 2 - config.riverWidth / 2 && player.y2 <= config.mapScale / 2 + config.riverWidth / 2) {
                        buyEquip(19, 1)
                    } else {
                        buyEquip(21, 1);
                    }
                } else {
                    buyEquip(lastMoveDir == undefined ? 0 : 11, 1);
                }
            };

            if (storeMenu.style.display != "block" && !instaC.isTrue && !instaC.ticking) {
                hatChanger();
                accChanger();
            }

            let buildings = gameObjects.sort((a, b) => Math.hypot(player.y2 - a.y, player.x2 - a.x) - Math.hypot(player.y2 - b.y, player.x2 - b.x));
            let turretsCanHit = buildings.filter(
                obj =>
                obj.name == 'turret' && !obj.isTeamObject(player) &&
                fgdo(player, obj) < 680 &&
                obj.active
            );
            antiTurretSpam = turretsCanHit.length > 3;

            dodgeSpike();
            if (getEl("autoPush").checked && enemy.length && !traps.inTrap && !instaC.ticking) {
                autoPush();
            } else {
                if (my.autoPush) {
                    my.autoPush = false;
                    packet("9", lastMoveDir || undefined, 1);
                }
            }

            if (instaC.ticking) {
                instaC.ticking = false;
            }
            if (instaC.syncHit) {
                instaC.syncHit = false;
            }
            if (player.empAnti) {
                player.empAnti = false;
            }
            if (player.soldierAnti) {
                player.soldierAnti = false;
            }
            if (my.anti0Tick > 0) {
                my.anti0Tick--
            }
            if (traps.replaced) {
                traps.replaced = false;
            }
            if (traps.antiTrapped) {
                traps.antiTrapped = false;
            }
        }
    }
}

// UPDATE LEADERBOARD:
function updateLeaderboard(data) {
    UTILS.removeAllChildren(leaderboardData);
    var tmpC = 1;
    for (var i = 0; i < data.length; i += 3) {
        (function(i) {
            UTILS.generateElement({
                class: "leaderHolder",
                parent: leaderboardData,
                children: [
                    UTILS.generateElement({
                        class: "leaderboardItem",
                        style: data[i] == player.sid ? "color: rgba(); font-size: 18px;" : "color: rgba(); font-size: 18px; padding: 1px;", // "font-size: 18px;",
                        text: (data[i + 1] != "" ? data[i + 1] : "unknown") + " "
                    }),
                    UTILS.generateElement({
                        class: "a", class: "leaderScore",
                        style: data[i] == player.sid ? "color: #fff; font-size: 18px;" : "color: #fff; font-size: 18px; padding: 1px;",
                        text: ("‎ " + UTILS.kFormat(data[i + 2]) || "‎ 0")
                    })
                ]
            });
        })(i);
        tmpC++;
    }
}

// LOAD GAME OBJECT:
function loadGameObject(data) {
    for (let i = 0; i < data.length;) {
        objectManager.add(data[i], data[i + 1], data[i + 2], data[i + 3], data[i + 4],
                          data[i + 5], items.list[data[i + 6]], true, (data[i + 7] >= 0 ? {
            sid: data[i + 7]
        } : null));
        i += 8;
    }
}

// ADD AI:
function loadAI(data) {
    for (let i = 0; i < ais.length; ++i) {
        ais[i].forcePos = !ais[i].visible;
        ais[i].visible = false;
    }
    if (data) {
        let tmpTime = performance.now();
        for (let i = 0; i < data.length;) {
            tmpObj = findAIBySID(data[i]);
            if (tmpObj) {
                tmpObj.index = data[i + 1];
                tmpObj.t1 = (tmpObj.t2 === undefined) ? tmpTime : tmpObj.t2;
                tmpObj.t2 = tmpTime;
                tmpObj.x1 = tmpObj.x;
                tmpObj.y1 = tmpObj.y;
                tmpObj.x2 = data[i + 2];
                tmpObj.y2 = data[i + 3];
                tmpObj.d1 = (tmpObj.d2 === undefined) ? data[i + 4] : tmpObj.d2;
                tmpObj.d2 = data[i + 4];
                tmpObj.health = data[i + 5];
                tmpObj.dt = 0;
                tmpObj.visible = true;
            } else {
                tmpObj = aiManager.spawn(data[i + 2], data[i + 3], data[i + 4], data[i + 1]);
                tmpObj.x2 = tmpObj.x;
                tmpObj.y2 = tmpObj.y;
                tmpObj.d2 = tmpObj.dir;
                tmpObj.health = data[i + 5];
                if (!aiManager.aiTypes[data[i + 1]].name) tmpObj.name = config.cowNames[data[i + 6]];
                tmpObj.forcePos = true;
                tmpObj.sid = data[i];
                tmpObj.visible = true;
            }
            i += 7;
        }
    }
}
// ANIMATE AI:
function animateAI(sid) {
    tmpObj = findAIBySID(sid);
    if (tmpObj) tmpObj.startAnim();
}

let detect = {
    insta: false,
    reverse: false,
    onetick: false,
    spiketick: false,
    barbarian: false,
    antibull: false,
    antibullhit: false,
    bowInsta: false
}
// GATHER ANIMATION:
function gatherAnimation(sid, didHit, index) {
    tmpObj = findPlayerBySID(sid);
    if (tmpObj) {
        tmpObj.startAnim(didHit, index);
        tmpObj.gatherIndex = index;
        if (index < 9) {
            tmpObj.primaryReload = -game.tickRate / items.weapons[index].speed
        } else {
            tmpObj.secondaryReload = -game.tickRate / items.weapons[index].speed
        }
        tmpObj.gathering = 1;
        tmpObj._attackedThisTickTempVariable = true;
        if(near.dist2 <= 175 && UTILS.getAngleDist(tmpDir, tmpObj.dir) <= config.gatherAngle){
            buyEquip(6, 0);
            buyEquip(13, 1);
            detect.spiketick = true;
        } else {
            detect.spiketick = false;
        }
        if (didHit) {
            let tmpObjects = objectManager.hitObj;
            objectManager.hitObj = [];
            game.tickBase(() => {
                // refind
                tmpObj = findPlayerBySID(sid);
                let val = items.weapons[index].dmg * (config.weaponVariants[tmpObj[(index < 9 ? "prima" : "seconda") + "ryVariant"]].val) * (items.weapons[index].sDmg || 1) * (tmpObj.skinIndex == 40 ? 3.3 : 1);
                tmpObjects.forEach((healthy) => {
                    healthy.health -= val;
                });
            }, 1);
        }
    }
}

// WIGGLE GAME OBJECT:
function wiggleGameObject(dir, sid) {
    tmpObj = findObjectBySid(sid);

    if (!tmpObj) return;

    tmpObj.xWiggle += config.gatherWiggle * Math.cos(dir);
    tmpObj.yWiggle += config.gatherWiggle * Math.sin(dir);

    if (tmpObj.health) {
        objectManager.hitObj.push(tmpObj);
    }
}

// SHOOT TURRET:
function shootTurret(sid, dir) {
    tmpObj = findObjectBySid(sid);

    if (!tmpObj) return;

    if (config.anotherVisual) {
        tmpObj.lastDir = dir;
    } else {
        tmpObj.dir = dir;
    }

    tmpObj.xWiggle += config.gatherWiggle * Math.cos(dir + Math.PI);
    tmpObj.yWiggle += config.gatherWiggle * Math.sin(dir + Math.PI);
}

// UPDATE PLAYER VALUE:
function updatePlayerValue(index, value, updateView) {
    if (!player) return;

    player[index] = value;

    if (index == "points") {
        if (true) {
            autoBuy.hat();
            autoBuy.acc();
        }
    } else if (index == "kills") {
        if (getEl("HappyModTroll").checked) {
            sendChat("gg - AutoGG Happymod")
            setTimeout(() => {
                sendChat("Happy Mod v7")
                setTimeout(() => {
                    sendChat("Get Better ASS!")
                    setTimeout(() => {
                        sendChat("Niggers: " + player.kills)
                    }, 1500);
                }, 1500);
            }, 1500);
        } else if (getEl("KillChat").checked) {
            sendChat("Eclipse client")
        }
    }
}

// ACTION BAR:
function updateItems(data, wpn) {
    if (data) {
        if (wpn) {
            player.weapons = data;
            player.primaryIndex = player.weapons[0];
            player.secondaryIndex = player.weapons[1];
            if (!instaC.isTrue) {
                selectWeapon(player.weapons[0]);
            }
        } else {
            player.items = data;
        }
    }

    for (let i = 0; i < items.list.length; i++) {
        let tmpI = items.weapons.length + i;
        getEl("actionBarItem" + tmpI).style.display = player.items.indexOf(items.list[i].id) >= 0 ? "inline-block" : "none";
    }

    for (let i = 0; i < items.weapons.length; i++) {
        getEl("actionBarItem" + i).style.display = player.weapons[items.weapons[i].type] == items.weapons[i].id ? "inline-block" : "none";
    }

    let kms = player.weapons[0] == 3 && player.weapons[1] == 15;
    if (kms) {
        getEl("actionBarItem3").style.display = "none";
        getEl("actionBarItem4").style.display = "inline-block";
    }
}

// ADD PROJECTILE:
function addProjectile(x, y, dir, range, speed, indx, layer, sid) {
    projectileManager.addProjectile(x, y, dir, range, speed, indx, null, null, layer, inWindow).sid = sid;
    runAtNextTick.push(Array.prototype.slice.call(arguments));
}

// REMOVE PROJECTILE:
function remProjectile(sid, range) {
    for (let i = 0; i < projectiles.length; ++i) {
        if (projectiles[i].sid == sid) {
            projectiles[i].range = range;
            let tmpObjects = objectManager.hitObj;
            objectManager.hitObj = [];
            game.tickBase(() => {
                let val = projectiles[i].dmg;
                tmpObjects.forEach((healthy) => {
                    if (healthy.projDmg) {
                        healthy.health -= val;
                    }
                });
            }, 1);
        }
    }
}

// SHOW ALLIANCE MENU:
function setPlayerTeam(team, isOwner) {
    if (player) {
        player.team = team;
        player.isOwner = isOwner;
        if (team == null) alliancePlayers = [];
    }
}

function setAlliancePlayers(data) {
    alliancePlayers = data;
}

// STORE MENU:
function updateStoreItems(type, id, index) {
    if (index) {
        if (!type) {
            player.tails[id] = 1;
        } else {
            player.latestTail = id;
        }
    } else {
        if (!type) {
            player.skins[id] = 1;
            id == 7 && (my.reSync = true);
            if (hatELs[id]) {
                getEl("hatdisp" + id).style.backgroundColor = "#44b090";
                getEl("hatdisp" + id).style.opacity = "1";
            }
        } else {
            player.latestSkin = id;
        }
    }
}

function checkProfanityString(text) {
    var tmpString;
    let alwaysfalse = false;
    if (!alwaysfalse) {
        for (var i = 0; i < profanityList.length; ++i) {
            if (text.indexOf(profanityList[i]) > -1) {
                tmpString = "";
                for (var y = 0; y < profanityList[i].length; ++y) {
                    tmpString += tmpString.length ? "o" : "M";
                }
                var re = new RegExp(profanityList[i],"g");
                text = text.replace(re, tmpString);
            }
        }
    }
    return text;
}

// HAPPY MOD SHIT:
function loadHappyBullying(message) {
    if (getEl("HappyModTroll").checked) {
        if (message.includes("mod")) {
            sendChat("Happymod V4")
        }
        if (message.includes("what mod")) {
            sendChat("Happymod V4")
        }
        if (message.includes("bad")) {
            sendChat("bad = u bad?");
        } else if (message.includes("lag")) {
            sendChat("your issue");
        } else if (message.includes("Lag")) {
            sendChat("your issue");
        } else if (message.includes("cringe")) {
            sendChat("cringe = u cringe?");
        } else if (message.includes("mad")) {
            sendChat("mad = u mad?");
        } else if (message.includes("idiot")) {
            sendChat("idiot = u idiot?");
        } else if (message.includes("retard")) {
            sendChat("retard = u retard?");
        } else if (message.includes("ok and")) {
            sendChat("ok, u r noob");
        } else if (message.includes("get a life")) {
            sendChat("then i will get ur life");
        } else if (message.includes("cry about it")) {
            sendChat("cry about your dumbness");
        } else if (message.includes("fell off")) {
            sendChat("i leveled up");
        } else if (message.includes("get good")) {
            sendChat("U r right you should get good");
        } else if (message.includes("stupid")) {
            sendChat("stupid = u stupid?");
        } else if (message.includes("homo")) {
            sendChat("homo = u homo?");
        } else if (message.includes("noob")) {
            sendChat("noob = u noob?");
        } else if (message.includes("dumb")) {
            sendChat("dumb = u dumb?");
        } else if (message.includes("Dumb")) {
            sendChat("Dumb = You Dumb?");
        } else if (message.includes("moron")) {
            sendChat("moron = u moron?");
        } else if (message.includes("not fun")) {
            sendChat("so funny!");
        } else if (message.includes("Noob")) {
            sendChat("Noob = You Noob?");
        } else if (message.includes("nub")) {
            sendChat("nub = u nub?");
        } else if (message.includes("nob")) {
            sendChat("nob = u nob?");
        } else if (message.includes("nab")) {
            sendChat("nab = u nab?");
        } else if (message.includes("Nigga")) {
            sendChat("Nigga = u Nigger?");
        } else if (message.includes("Nigger")) {
            sendChat("Nigger = u Nigger?");
        } else if (message.includes("niggA")) {
            sendChat("Nigga = u Nigger?");
        } else if (message.includes("nigger")) {
            sendChat("Nigger = u Nigger?");
        } else if (message.includes("real")) {
            sendChat("yes im real");
        } else if (message.includes("loser")) {
            sendChat("loser = u loser?");
        } else if (message.includes("!c!dc")) {
            sendChat("pls disconnect this noob");
        } else if (message.includes("gay")) {
            sendChat("gay = u gay ?");
        } else if (message.includes("gae")) {
            sendChat("gae = u gay ?");
        } else if (message.includes("Gay")) {
            sendChat("Gay = You gay ?");
        } else if (message.includes("love u")) {
            sendChat("Gay??");
        } else if (message.includes("love you")) {
            sendChat("Gay??");
        } else if (message.includes("luv you")) {
            sendChat("Gay??");
        } else if (message.includes("luv u")) {
            sendChat("Gay??");
        } else if (message.includes("hi")) {
            sendChat("hi");
        } else if (message.includes("ngu")) {
            sendChat("ngu = u stupid?");
        } else if (message.includes("Ngu")) {
            sendChat("Ngu = u stupid?");
        } else if (message.includes("NGU")) {
            sendChat("Ngu = u NGU?");
        } else if (message.includes("hehe")) {
            sendChat("haha");
        } else if (message.includes("haha")) {
            sendChat("hahahahahaha");
        } else if (message.includes("huhu")) {
            sendChat("huhuhuhuhuhu");
        } else if (message.includes("ez")) {
            sendChat("ik you ez");
        } else if (message.includes("Ez")) {
            sendChat("ik you ez");
        } else if (message.includes("easy")) {
            sendChat("ik you ez");
        } else if (message.includes("gg")) {
            sendChat("gg ez");
        } else if (message.includes("Gg")) {
            sendChat("gg ez");
        } else if (message.includes("lol")) {
            sendChat("LOL LOL LOL");
        } else if (message.includes("Lol")) {
            sendChat("LOL LOL LOL");
        } else if (message.includes("lmao")) {
            sendChat("lmao LMAO LMAO LMAO");
        } else if (message.includes("Lmao")) {
            sendChat("lmao LMAO LMAO LMAO");
        } else if (message.includes("lvl")) {
            sendChat("why");
        } else if (message.includes("1v1")) {
            sendChat("why");
        } else if (message.includes("hello")) {
            sendChat("hello");
        } else if (message.includes("idk")) {
            sendChat("-_-");
        } else if (message.includes("xd")) {
            sendChat("lol");
        } else if (message.includes("Xd")) {
            sendChat("lol lol lol");
        } else if (message.includes("xD")) {
            sendChat("lol lol");
        } else if (message.includes("XD")) {
            sendChat("lmaooo");
        } else if (message.includes(":<")) {
            sendChat(":>");
        } else if (message.includes(":(")) {
            sendChat(":)");
        } else if (message.includes("):")) {
            sendChat("(:");
        } else if (message.includes(":C")) {
            sendChat("C:");
        } else if (message.includes(":c")) {
            sendChat("c:");
        } else if (message.includes("D:")) {
            sendChat(":D");
        } else if (message.includes("-_-")) {
            sendChat("xd");
        } else if (message.includes("sb")) { //chinese meaning. (stupid)
            sendChat("sb = u SB?");
        } else if (message.includes("AutoGG")) {
            sendChat("GG! EZ!");
        } else if (message.includes("Master Race")) {
            sendChat("GG! EZ!");
        } else if (message.includes("autoclicker")) {
            sendChat("autoclicker = Good");
        } else if (message.includes("auto clicker")) {
            sendChat("autoclicker = Good");
        } else if (message.includes("trash")) {
            sendChat("trash = u trash?");
        } else if (message.includes("suck")) {
            sendChat("suck = u suck?");
        } else if (message.includes("fatherless")) {
            sendChat("Yes you are fatherless");
        } else if (message.includes("motherless")) {
            sendChat("Yes you are motherless");
        }
    }
}
let allChats = [];
function ChatSee(sid, message) {
    let tmpPlayer = findPlayerBySID(sid);
    let countDown = 0;
    let coolDownForAI = false;
    tmpPlayer.chatMessage = checkProfanityString(message);
    tmpPlayer.chatCountdown = config.chatCountdown;
    if(player == tmpPlayer) {
        if (message == ".t -hl") {
            hatLoop = !hatLoop;
            setTimeout(() => {
                sendChat(`Hatloop ${hatLoop ? "Enabled." : "Disabled."}`);
            }, 500);
        }
        if (message == ".t -FastVTick") {
            autoOneFrameToggled = !autoOneFrameToggled;
            const oneFrameStatus = autoOneFrameToggled ? "On" : "Off";
            setTimeout(() => {
                sendChat(`Veltick(Fast): ${oneFrameStatus}`);
            }, 500);
        }
        if (message == ".t -song") {
            playSong();
            setTimeout(() => {
                sendChat(`Song`);
            }, 500);
        }
    }
    if (message.trim() === ".t -clearC") {
        resetMenuChText();
        return;
    }
    if (tmpPlayer) {
        allChats.push(new addCh(tmpPlayer.x, tmpPlayer.y, message, tmpPlayer));
    }
}
// SEND MESSAGE:
function receiveChat(sid, message) {
    let near = findPlayerBySID(sid);

    if (!near) return;

    if (!(/img/i.test(message) && /iframe/i.test(message))) {
        addMenuChText(`${near.name}[${near.sid}]`, message, "white");
    }

    near.chatMessage = message;
    near.chatCountdown = config.chatCountdown;

    if (message === 'insta em!' && player.reloads[player.weapons[0]] === 0 && player.reloads[player.weapons[1]] === 0) {
        packet("6", "");
        my.autoAim = true;
        selectWeapon(player.weapons[0]);
        buyEquip(7, 0);
        sendAutoGather();
        game.tickBase(() => {
            selectWeapon(player.weapons[1]);
            buyEquip(player.reloads[53] === 0 ? 53 : 6, 0);
            game.tickBase(() => {
                sendAutoGather();
                my.autoAim = false;
            }, 3);
        }, 2);
    }

    loadHappyBullying(message);
}

// MINIMAP:
function updateMinimap(data) {
    minimapData = data;
}

// SHOW ANIM TEXT:
function showText(x, y, value, type) {
    textManager.stack.push({
        x: x,
        y: y,
        value: value
    });
}

function ShowSettingText(life, setting, color = "#fff", ea = player) {
    textManager.showText(ea.x, ea.y, 40, 0.1, life, setting, color);
}

/** APPLY SOCKET CODES */

// RENDER LEAF:
function renderLeaf(x, y, l, r, ctxt) {
    let endX = x + (l * Math.cos(r));
    let endY = y + (l * Math.sin(r));
    let width = l * 0.4;
    ctxt.moveTo(x, y);
    ctxt.beginPath();
    ctxt.quadraticCurveTo(((x + endX) / 2) + (width * Math.cos(r + Math.PI / 2)),
                          ((y + endY) / 2) + (width * Math.sin(r + Math.PI / 2)), endX, endY);
    ctxt.quadraticCurveTo(((x + endX) / 2) - (width * Math.cos(r + Math.PI / 2)),
                          ((y + endY) / 2) - (width * Math.sin(r + Math.PI / 2)), x, y);
    ctxt.closePath();
    ctxt.fill();
    ctxt.stroke();
}

// RENDER CIRCLE:
function renderCircle(x, y, scale, tmpContext, dontStroke, dontFill) {
    tmpContext = tmpContext || mainContext;
    tmpContext.beginPath();
    tmpContext.arc(x, y, scale, 0, 2 * Math.PI);
    if (!dontFill) tmpContext.fill();
    if (!dontStroke) tmpContext.stroke();
}

function renderHealthCircle(x, y, scale, tmpContext, dontStroke, dontFill) {
    tmpContext = tmpContext || mainContext;
    tmpContext.beginPath();
    tmpContext.arc(x, y, scale, 0, 2 * Math.PI);
    if (!dontFill) tmpContext.fill();
    if (!dontStroke) tmpContext.stroke();
}

// RENDER STAR SHAPE:
function renderStar(ctxt, spikes, outer, inner, rounded = false) {
    let rot = Math.PI / 2 * 3;
    let x, y;
    let step = Math.PI / spikes;
    ctxt.beginPath();
    ctxt.moveTo(0, -outer);

    // Pokud je "rounded" true, zakulatíme spoje
    if (rounded) {
        ctxt.lineJoin = "round";
        ctxt.lineCap = "round";
    }

    for (let i = 0; i < spikes; i++) {
        x = Math.cos(rot) * outer;
        y = Math.sin(rot) * outer;
        ctxt.lineTo(x, y);
        rot += step;
        x = Math.cos(rot) * inner;
        y = Math.sin(rot) * inner;
        ctxt.lineTo(x, y);
        rot += step;
    }
    ctxt.lineTo(0, -outer);
    ctxt.closePath();

    // Vrátíme vlastnosti zpět na default, pokud jsme je změnili
    if (rounded) {
        ctxt.lineJoin = "miter";
        ctxt.lineCap = "butt";
    }
}

function renderHealthStar(ctxt, spikes, outer, inner) {
    let rot = Math.PI / 2 * 3;
    let x, y;
    let step = Math.PI / spikes;
    ctxt.beginPath();
    ctxt.moveTo(0, -outer);
    for (let i = 0; i < spikes; i++) {
        x = Math.cos(rot) * outer;
        y = Math.sin(rot) * outer;
        ctxt.lineTo(x, y);
        rot += step;
        x = Math.cos(rot) * inner;
        y = Math.sin(rot) * inner;
        ctxt.lineTo(x, y);
        rot += step;
    }
    ctxt.lineTo(0, -outer);
    ctxt.closePath();
}

// RENDER RECTANGLE:
function renderRect(x, y, w, h, ctxt, dontStroke, dontFill) {
    if (!dontFill) ctxt.fillRect(x - (w / 2), y - (h / 2), w, h);
    if (!dontStroke) ctxt.strokeRect(x - (w / 2), y - (h / 2), w, h);
}

function renderHealthRect(x, y, w, h, ctxt, dontStroke, dontFill) {
    if (!dontFill) ctxt.fillRect(x - (w / 2), y - (h / 2), w, h);
    if (!dontStroke) ctxt.strokeRect(x - (w / 2), y - (h / 2), w, h);
}

// RENDER RECTCIRCLE:
function renderRectCircle(x, y, s, sw, seg, ctxt, dontStroke, dontFill) {
    ctxt.save();
    ctxt.translate(x, y);
    seg = Math.ceil(seg / 2);
    for (let i = 0; i < seg; i++) {
        renderRect(0, 0, s * 2, sw, ctxt, dontStroke, dontFill);
        ctxt.rotate(Math.PI / seg);
    }
    ctxt.restore();
}

// RENDER BLOB:
function renderBlob(ctxt, spikes, outer, inner) {
    let rot = Math.PI / 2 * 3;
    let x, y;
    let step = Math.PI / spikes;
    ctxt.beginPath();
    ctxt.moveTo(0, -inner); // begin from middle

    for (let i = 0; i < spikes; i++) {
        // const of obj
        let tmpOuter = outer;

        // caclulate half circle and calculate quadratic equation primary school basics
        ctxt.quadraticCurveTo(
            Math.cos(rot + step) * tmpOuter,
            Math.sin(rot + step) * tmpOuter,
            Math.cos(rot + (step * 2)) * inner,
            Math.sin(rot + (step * 2)) * inner
        );

        rot += step * 2; // change angle for another point
    }

    ctxt.lineTo(0, -inner); // close half circle
    ctxt.closePath();
}

// RENDER TRIANGLE:
function renderTriangle(s, ctx) {
    ctx = ctx || mainContext;
    let h = s * (Math.sqrt(3) / 2);
    ctx.beginPath();
    ctx.moveTo(0, -h / 2);
    ctx.lineTo(-s / 2, h / 2);
    ctx.lineTo(s / 2, h / 2);
    ctx.lineTo(0, -h / 2);
    ctx.fill();
    ctx.closePath();
}

// PREPARE MENU BACKGROUND:
function prepareMenuBackground() {
    let tmpMid = config.mapScale / 2;
    objectManager.add(0, tmpMid, tmpMid + 200, 0, config.treeScales[3], 0);
    objectManager.add(1, tmpMid, tmpMid - 480, 0, config.treeScales[3], 0);
    objectManager.add(2, tmpMid + 300, tmpMid + 450, 0, config.treeScales[3], 0);
    objectManager.add(3, tmpMid - 950, tmpMid - 130, 0, config.treeScales[2], 0);
    objectManager.add(4, tmpMid - 750, tmpMid - 400, 0, config.treeScales[3], 0);
    objectManager.add(5, tmpMid - 700, tmpMid + 400, 0, config.treeScales[2], 0);
    objectManager.add(6, tmpMid + 800, tmpMid - 200, 0, config.treeScales[3], 0);
    objectManager.add(7, tmpMid - 260, tmpMid + 340, 0, config.bushScales[3], 1);
    objectManager.add(8, tmpMid + 760, tmpMid + 310, 0, config.bushScales[3], 1);
    objectManager.add(9, tmpMid - 800, tmpMid + 100, 0, config.bushScales[3], 1);
    objectManager.add(10, tmpMid - 800, tmpMid + 300, 0, items.list[4].scale, items.list[4].id, items.list[10]);
    objectManager.add(11, tmpMid + 650, tmpMid - 390, 0, items.list[4].scale, items.list[4].id, items.list[10]);
    objectManager.add(12, tmpMid - 400, tmpMid - 450, 0, config.rockScales[2], 2);
}

const speed = 1;
// RENDER PLAYERS:
function renderDeadPlayers(f, d) {
    mainContext.fillStyle = "#91b2db";
    const currentTime = Date.now();
    deadPlayers.filter(dead => dead.active).forEach((dead) => {
        if (!dead.startTime) {
            dead.startTime = currentTime;
            dead.angle = 0;
            dead.radius = 0.1;
        }
        const timeElapsed = currentTime - dead.startTime;
        const maxAlpha = 1;
        dead.alpha = Math.max(0, maxAlpha - (timeElapsed / 3000));
        dead.animate(delta);
        mainContext.globalAlpha = dead.alpha;
        mainContext.strokeStyle = outlineColor;
        mainContext.save();
        mainContext.translate(dead.x - f, dead.y - d);
        dead.radius -= 0.001;
        dead.angle += 0.0174533;
        const moveSpeed = 1;
        const x = dead.radius * Math.cos(dead.angle);
        const y = dead.radius * Math.sin(dead.angle);
        dead.x += x * moveSpeed;
        dead.y += y * moveSpeed;
        mainContext.rotate(dead.angle);
        renderDeadPlayer(dead, mainContext);
        mainContext.restore();
        mainContext.fillStyle = "#91b2db";
        if (timeElapsed >= 3000) {
            dead.active = false;
            dead.startTime = null;
        }
    });
}
// RENDER PLAYERS:
function renderPlayers(xOffset, yOffset, zIndex) {
    mainContext.globalAlpha = 1;
    mainContext.fillStyle = "#91b2db";
    for (let i = 0; i < players.length; ++i) {
        let tmpObj = players[i];
        if (tmpObj.zIndex == zIndex) {
            tmpObj.animate(delta);
            if (tmpObj.visible) {
                tmpObj.skinRot += 0.001 * delta;
                tmpDir =
                    !configs.showDir && !useWasd && tmpObj == player
                    ? configs.attackDir
                    ? getVisualDir()
                : getSafeDir()
                : tmpObj.dir || 0;
                mainContext.save();
                mainContext.translate(tmpObj.x - xOffset, tmpObj.y - yOffset);
                // RENDER PLAYER:
                mainContext.rotate(tmpDir + tmpObj.dirPlus);
                renderPlayer(tmpObj, mainContext);
                mainContext.restore();
            }
        }
    }
}
function renderDeadPlayer(obj, ctxt) {
    ctxt = ctxt || mainContext;
    ctxt.lineWidth = outlineWidth;
    ctxt.lineJoin = "miter";
    let handAngle = Math.PI / 4 * (items.weapons[obj.weaponIndex].armS || 1);
    let oHandAngle = obj.buildIndex < 0 ? items.weapons[obj.weaponIndex].hndS || 1 : 1;
    let oHandDist = obj.buildIndex < 0 ? items.weapons[obj.weaponIndex].hndD || 1 : 1;
    if (obj.buildIndex < 0 && !items.weapons[obj.weaponIndex].aboveHand) {
        renderTool(items.weapons[obj.weaponIndex], config.weaponVariants[obj.weaponVariant].src, obj.scale, 0, ctxt);
        if (items.weapons[obj.weaponIndex].projectile != undefined && !items.weapons[obj.weaponIndex].hideProjectile) {
            renderProjectile(obj.scale, 0, items.projectiles[items.weapons[obj.weaponIndex].projectile], mainContext);
        }
    }
    ctxt.fillStyle = config.skinColors[obj.skinColor];
    renderCircle(obj.scale * Math.cos(handAngle), obj.scale * Math.sin(handAngle), 14);
    renderCircle(obj.scale * oHandDist * Math.cos(-handAngle * oHandAngle), obj.scale * oHandDist * Math.sin(-handAngle * oHandAngle), 14);
    if (obj.buildIndex < 0 && items.weapons[obj.weaponIndex].aboveHand) {
        renderTool(items.weapons[obj.weaponIndex], config.weaponVariants[obj.weaponVariant].src, obj.scale, 0, ctxt);
        if (items.weapons[obj.weaponIndex].projectile != undefined && !items.weapons[obj.weaponIndex].hideProjectile) {
            renderProjectile(obj.scale, 0, items.projectiles[items.weapons[obj.weaponIndex].projectile], mainContext);
        }
    }
    if (obj.buildIndex >= 0) {
        var tmpSprite = getItemSprite(items.list[obj.buildIndex]);
        ctxt.drawImage(tmpSprite, obj.scale - items.list[obj.buildIndex].holdOffset, -tmpSprite.width / 2);
    }
    renderCircle(0, 0, obj.scale, ctxt);
    ctxt.lineWidth = 2;
    ctxt.fillStyle = "#555";
    ctxt.font = "35px Hammersmith One";
    ctxt.textBaseline = "middle";
    ctxt.textAlign = "center";
    ctxt.fillText("(", 20, 5);
    ctxt.rotate(Math.PI / 2);
    ctxt.font = "30px Hammersmith One";
    ctxt.fillText("X", -15, 15 / 2);
    ctxt.fillText("D", 15, 15 / 2);
}
function renderPlayer(obj, ctxt) {
    ctxt = ctxt || mainContext;
    ctxt.lineWidth = outlineWidth;
    ctxt.lineJoin = "miter";
    let handAngle = Math.PI / 4 * (items.weapons[obj.weaponIndex].armS || 1);
    let oHandAngle = obj.buildIndex < 0 ? items.weapons[obj.weaponIndex].hndS || 1 : 1;
    let oHandDist = obj.buildIndex < 0 ? items.weapons[obj.weaponIndex].hndD || 1 : 1;
    let katanaMusket = obj == player && obj.weapons[0] == 3 && obj.weapons[1] == 15;
    if (obj.tailIndex > 0) {
        renderTailTextureImage(obj.tailIndex, ctxt, obj);
    }
    if (obj.buildIndex < 0 && !items.weapons[obj.weaponIndex].aboveHand) {
        renderTool(items.weapons[katanaMusket ? 4 : obj.weaponIndex], config.weaponVariants[obj.weaponVariant].src, obj.scale, 0, ctxt);
        if (items.weapons[obj.weaponIndex].projectile != undefined && !items.weapons[obj.weaponIndex].hideProjectile) {
            renderProjectile(obj.scale, 0, items.projectiles[items.weapons[obj.weaponIndex].projectile], mainContext);
        }
    }
    ctxt.fillStyle = config.skinColors[obj.skinColor];
    renderCircle(obj.scale * Math.cos(handAngle), obj.scale * Math.sin(handAngle), 14);
    renderCircle(obj.scale * oHandDist * Math.cos(-handAngle * oHandAngle), obj.scale * oHandDist * Math.sin(-handAngle * oHandAngle), 14);
    if (obj.buildIndex < 0 && items.weapons[obj.weaponIndex].aboveHand) {
        renderTool(items.weapons[obj.weaponIndex], config.weaponVariants[obj.weaponVariant].src, obj.scale, 0, ctxt);
        if (items.weapons[obj.weaponIndex].projectile != undefined && !items.weapons[obj.weaponIndex].hideProjectile) {
            renderProjectile(obj.scale, 0, items.projectiles[items.weapons[obj.weaponIndex].projectile], mainContext);
        }
    }
    if (obj.buildIndex >= 0) {
        var tmpSprite = getItemSprite(items.list[obj.buildIndex]);
        ctxt.drawImage(tmpSprite, obj.scale - items.list[obj.buildIndex].holdOffset, -tmpSprite.width / 2);
    }
    renderCircle(0, 0, obj.scale, ctxt);
    if (obj.skinIndex > 0) {
        ctxt.rotate(Math.PI / 2);
        renderTextureSkin(obj.skinIndex, ctxt, null, obj);
    }
}

// RENDER NORMAL SKIN
var skinSprites2 = {};
var skinPointers2 = {};
function renderSkin2(index, ctxt, parentSkin, owner) {
    tmpSkin = skinSprites2[index];
    if (!tmpSkin) {
        var tmpImage = new Image();
        tmpImage.onload = function() {
            this.isLoaded = true;
            this.onload = null;
        };
        //tmpImage.src = "https://moomoo.io/img/hats/hat_" + index + ".png";
        tmpImage.src = "https://moomoo.io/img/hats/hat_" + index + ".png";
        skinSprites2[index] = tmpImage;
        tmpSkin = tmpImage;
    }
    var tmpObj = parentSkin||skinPointers2[index];
    if (!tmpObj) {
        for (var i = 0; i < hats.length; ++i) {
            if (hats[i].id == index) {
                tmpObj = hats[i];
                break;
            }
        }
        skinPointers2[index] = tmpObj;
    }
    if (tmpSkin.isLoaded) ctxt.drawImage(tmpSkin, -tmpObj.scale/2, -tmpObj.scale/2, tmpObj.scale, tmpObj.scale);
    if (!parentSkin && tmpObj.topSprite) {
        ctxt.save();
        ctxt.rotate(owner.skinRot);
        renderSkin2(index + "_top", ctxt, tmpObj, owner);
        ctxt.restore();
    }
}

// RENDER SKIN:
function renderTextureSkin(index, ctxt, parentSkin, owner) {
    if (!(tmpSkin = skinSprites[index + (txt ? "lol" : 0)])) {
        var tmpImage = new Image();
        tmpImage.onload = function() {
            this.isLoaded = true;
            this.onload = null;
        };
        tmpImage.src = setSkinTextureImage(index, "hat", index);
        skinSprites[index + (txt ? "lol" : 0)] = tmpImage;
        tmpSkin = tmpImage;
    }
    var tmpObj = parentSkin||skinPointers[index];
    if (!tmpObj) {
        for (var i = 0; i < hats.length; ++i) {
            if (hats[i].id == index) {
                tmpObj = hats[i];
                break;
            }
        }
        skinPointers[index] = tmpObj;
    }
    if (tmpSkin.isLoaded) ctxt.drawImage(tmpSkin, -tmpObj.scale/2, -tmpObj.scale/2, tmpObj.scale, tmpObj.scale);
    if (!parentSkin && tmpObj.topSprite) {
        ctxt.save();
        ctxt.rotate(owner.skinRot);
        renderSkin(index + "_top", ctxt, tmpObj, owner);
        ctxt.restore();
    }
}

var FlareZHat = {
    12: "https://i.imgur.com/VSUId2s.png",
    6: "https://i.imgur.com/vM9Ri8g.png",
    7: "https://i.imgur.com/vAOzlyY.png",
    15: "https://i.imgur.com/YRQ8Ybq.png",
    11: "https://i.imgur.com/yfqME8H.png",
    40: "https://i.imgur.com/Xzmg27N.png",
    26: "https://i.imgur.com/I0xGtyZ.png",
    55: "https://i.imgur.com/uYgDtcZ.png",
    20: "https://i.imgur.com/f5uhWCk.png",
};

function setSkinTextureImage(id, type, id2) {
    if (true) {
        if(FlareZHat[id] && type == "hat") {
            return FlareZHat[id];
        } else {
            if(type == "acc") {
                return ".././img/accessories/access_" + id + ".png";
            } else if(type == "hat") {
                return ".././img/hats/hat_" + id + ".png";
            } else {
                return ".././img/weapons/" + id + ".png";
            }
        }
    } else {
        if(type == "acc") {
            return ".././img/accessories/access_" + id + ".png";
        } else if(type == "hat") {
            return ".././img/hats/hat_" + id + ".png";
        } else {
            return ".././img/weapons/" + id + ".png";
        }
    }
}
// RENDER SKINS:
let skinSprites = {};
let skinPointers = {};
let tmpSkin;

function renderSkin(index, ctxt, parentSkin, owner) {
    tmpSkin = skinSprites[index];
    if (!tmpSkin) {
        let tmpImage = new Image();
        tmpImage.onload = function() {
            this.isLoaded = true;
            this.onload = null;
        };
        tmpImage.src = "https://moomoo.io/img/hats/hat_" + index + ".png";
        skinSprites[index] = tmpImage;
        tmpSkin = tmpImage;
    }
    let tmpObj = parentSkin || skinPointers[index];
    if (!tmpObj) {
        for (let i = 0; i < hats.length; ++i) {
            if (hats[i].id == index) {
                tmpObj = hats[i];
                break;
            }
        }
        skinPointers[index] = tmpObj;
    }
    if (tmpSkin.isLoaded) ctxt.drawImage(tmpSkin, -tmpObj.scale / 2, -tmpObj.scale / 2, tmpObj.scale, tmpObj.scale);
    if (!parentSkin && tmpObj.topSprite) {
        ctxt.save();
        ctxt.rotate(owner.skinRot);
        renderSkin(index + "_top", ctxt, tmpObj, owner);
        ctxt.restore();
    }
}

// RENDER TAIL:
var FlareZAcc = {
    21: "https://i.imgur.com/4ddZert.png",
    19: "https://i.imgur.com/sULkUZT.png",
    18: "https://i.imgur.com/sRGXKvJ.png",
};
function setTailTextureImage(id, type, id2) {
    if (true) {
        if(FlareZAcc[id] && type == "acc") {
            return FlareZAcc[id];
        } else {
            if(type == "acc") {
                return ".././img/accessories/access_" + id + ".png";
            } else if(type == "hat") {
                return ".././img/hats/hat_" + id + ".png";
            } else {
                return ".././img/weapons/" + id + ".png";
            }
        }
    } else {
        if(type == "acc") {
            return ".././img/accessories/access_" + id + ".png";
        } else if(type == "hat") {
            return ".././img/hats/hat_" + id + ".png";
        } else {
            return ".././img/weapons/" + id + ".png";
        }
    }
}
function renderTailTextureImage(index, ctxt, owner) {
    if (!(tmpSkin = accessSprites[index + (txt ? "lol" : 0)])) {
        var tmpImage = new Image();
        tmpImage.onload = function() {
            this.isLoaded = true;
            this.onload = null;
        };
        tmpImage.src = setTailTextureImage(index, "acc");
        accessSprites[index + (txt ? "lol" : 0)] = tmpImage;
        tmpSkin = tmpImage;
    }
    var tmpObj = accessPointers[index];
    if (!tmpObj) {
        for (var i = 0; i < accessories.length; ++i) {
            if (accessories[i].id == index) {
                tmpObj = accessories[i];
                break;
            }
        }
        accessPointers[index] = tmpObj;
    }
    if (tmpSkin.isLoaded) {
        ctxt.save();
        ctxt.translate(-20 - (tmpObj.xOff||0), 0);
        if (tmpObj.spin) ctxt.rotate(owner.skinRot);
        ctxt.drawImage(tmpSkin, -(tmpObj.scale/2), -(tmpObj.scale/2), tmpObj.scale, tmpObj.scale);
        ctxt.restore();
    }
}

let accessSprites = {};
let accessPointers = {};
var txt = true;

function renderTail(index, ctxt, owner) {
    tmpSkin = accessSprites[index];
    if (!tmpSkin) {
        let tmpImage = new Image();
        tmpImage.onload = function() {
            this.isLoaded = true;
            this.onload = null;
        };
        tmpImage.src = "https://moomoo.io/img/accessories/access_" + index + ".png";
        accessSprites[index] = tmpImage;
        tmpSkin = tmpImage;
    }
    let tmpObj = accessPointers[index];
    if (!tmpObj) {
        for (let i = 0; i < accessories.length; ++i) {
            if (accessories[i].id == index) {
                tmpObj = accessories[i];
                break;
            }
        }
        accessPointers[index] = tmpObj;
    }
    if (tmpSkin.isLoaded) {
        ctxt.save();
        ctxt.translate(-20 - (tmpObj.xOff || 0), 0);
        if (tmpObj.spin) ctxt.rotate(owner.skinRot);
        ctxt.drawImage(tmpSkin, -(tmpObj.scale / 2), -(tmpObj.scale / 2), tmpObj.scale, tmpObj.scale);
        ctxt.restore();
    }
}

var accessSprites2 = {};
var accessPointers2 = {};
function renderTail2(index, ctxt, owner) {
    tmpSkin = accessSprites2[index];
    if (!tmpSkin) {
        var tmpImage = new Image();
        tmpImage.onload = function() {
            this.isLoaded = true;
            this.onload = null;
        };
        tmpImage.src = "https://moomoo.io/img/accessories/access_" + index + ".png";
        accessSprites2[index] = tmpImage;
        tmpSkin = tmpImage;
    }
    var tmpObj = accessPointers2[index];
    if (!tmpObj) {
        for (var i = 0; i < accessories.length; ++i) {
            if (accessories[i].id == index) {
                tmpObj = accessories[i];
                break;
            }
        }
        accessPointers2[index] = tmpObj;
    }
    if (tmpSkin.isLoaded) {
        ctxt.save();
        ctxt.translate(-20 - (tmpObj.xOff||0), 0);
        if (tmpObj.spin) ctxt.rotate(owner.skinRot);
        ctxt.drawImage(tmpSkin, -(tmpObj.scale/2), -(tmpObj.scale/2), tmpObj.scale, tmpObj.scale);
        ctxt.restore();
    }
}

// mymymymy
let weaponsT = {
};

function setWpt(id, type) {
    if (true) {
        if(weaponsT[id] && type == "weapons") {
            return weaponsT[id];
        } else {
            if(type == "acc") {
                return ".././img/accessories/access_" + id + ".png";
            } else if(type == "hat") {
                return ".././img/hats/hat_" + id + ".png";
            } else {
                return ".././img/weapons/" + id + ".png";
            }
        }
    } else {
        if(type == "acc") {
            return ".././img/accessories/access_" + id + ".png";
        } else if(type == "hat") {
            return ".././img/hats/hat_" + id + ".png";
        } else {
            return ".././img/weapons/" + id + ".png";
        }
    }
}

// RENDER TOOL:
let toolSprites = {};
function renderTool(obj, variant, x, y, ctxt) {
    let tmpSrc = obj.src + (variant || "");
    let tmpSprite = toolSprites[tmpSrc];
    if (!tmpSprite) {
        tmpSprite = new Image();
        tmpSprite.onload = function () {
            this.isLoaded = true;
        };
        tmpSprite.src = "https://moomoo.io/img/weapons/" + tmpSrc + ".png";
        toolSprites[tmpSrc] = tmpSprite;
    }
    if (tmpSprite.isLoaded) {
        ctxt.drawImage(tmpSprite, x + obj.xOff - obj.length / 2, y + obj.yOff - obj.width / 2, obj.length, obj.width);
    }
}

// RENDER PROJECTILES:
function renderProjectiles(layer, f, d) {
    for (let i = 0; i < projectiles.length; i++) {
        tmpObj = projectiles[i];
        if (tmpObj.active && tmpObj.layer == layer && tmpObj.inWindow) {
            tmpObj.update(delta);
            if (tmpObj.active && isOnScreen(tmpObj.x - f, tmpObj.y - d, tmpObj.scale)) {
                mainContext.save();
                mainContext.translate(tmpObj.x - f, tmpObj.y - d);
                mainContext.rotate(tmpObj.dir);
                renderProjectile(0, 0, tmpObj, mainContext, 1);
                mainContext.restore();
            }
        }
    };
}
// RENDER PROJECTILE:
let projectileSprites = {};//fz iz zexy

function renderProjectile(x, y, obj, ctxt, debug) {
    if (obj.src) {
        let tmpSrc = items.projectiles[obj.indx].src;
        let tmpSprite = projectileSprites[tmpSrc];
        if (!tmpSprite) {
            tmpSprite = new Image();
            tmpSprite.onload = function() {
                this.isLoaded = true;
            }
            tmpSprite.src = "https://moomoo.io/img/weapons/" + tmpSrc + ".png";
            projectileSprites[tmpSrc] = tmpSprite;
        }
        if (tmpSprite.isLoaded) ctxt.drawImage(tmpSprite, x - (obj.scale / 2), y - (obj.scale / 2), obj.scale, obj.scale);
    } else if (obj.indx == 1) {
        ctxt.fillStyle = "#939393";
        renderCircle(x, y, obj.scale, ctxt);
    }
}

// RENDER AI:
let aiSprites = {};

function renderAI(obj, ctxt) {
    let tmpIndx = obj.index;
    let tmpSprite = aiSprites[tmpIndx];
    if (!tmpSprite) {
        let tmpImg = new Image();
        tmpImg.onload = function() {
            this.isLoaded = true;
            this.onload = null;
        };
        tmpImg.src = "https://moomoo.io/img/animals/" + obj.src + ".png";
        tmpSprite = tmpImg;
        aiSprites[tmpIndx] = tmpSprite;
    }
    if (tmpSprite.isLoaded) {
        let tmpScale = obj.scale * 1.2 * (obj.spriteMlt || 1);
        ctxt.drawImage(tmpSprite, -tmpScale, -tmpScale, tmpScale * 2, tmpScale * 2);
    }
}
// RENDER WATER BODIES:
function renderWaterBodies(f, d, ctxt, padding) {

    // MIDDLE RIVER:
    let tmpW = config.riverWidth + padding;
    let tmpY = (config.mapScale / 2) - d - (tmpW / 2);
    if (tmpY < maxScreenHeight && tmpY + tmpW > 0) {
        ctxt.fillRect(0, tmpY, maxScreenWidth, tmpW);
    }
}
let originalScales = {
    width: 1920,
    height: 1080
}
function knockBackPredict() {
    let bfn = {
        x0: 0,
        y0: 0,
        x1: 0,
        y1: 0,
        instax: 0,
        instay: 0,
        turretx: 0,
        turrety: 0
    };
    let bfo = Math.atan2(near.y2 - player.y2, near.x2 - player.x2);
    let bfp = Infinity;
    let bfq = gameObjects.filter(bfr => bfr.name == "pit trap" && bfr.active && bfr.isTeamObject(player) && UTILS.getDist(bfr, near, 0, 2) <= bfr.getScale() + player.scale + 5).sort((bfs, bft) => {
        return UTILS.getDist(bfs, near, 0, 2) - UTILS.UTILS.getDist(bft, near, 0, 2);
    })[0];
    if (near.dist2 - player.scale * 1.8 <= items.weapons[player.weapons[0]].range && !bfq) {
        for (let bfv of gameObjects) {
            let bfw = bfn;
            if (bfv.dmg && bfv.active && bfv.isTeamObject(player)) {
                let bfx = (items.weapons[player.weapons[0]].knock || 0) * items.weapons[player.weapons[0]].range + player.scale * 2;
                let bfy = ![undefined, 9, 12, 13, 15].includes(player.weapons[1]) ? (items.weapons[player.weapons[1]].knock || 0) * items.weapons[player.weapons[1]].range + player.scale * 2 - 10 : player.weapons[1] != undefined ? 60 : 0;
                let bfz = bfx + bfy;
                let bga = player.reloads[53] == 0 ? bfx + bfy + 75 : bfz;
                let bgb = near.x2 + bfx * Math.cos(bfo);
                let bgc = near.y2 + bfx * Math.sin(bfo);
                let bgd = near.x2 + bfy * Math.cos(bfo);
                let bge = near.y2 + bfy * Math.sin(bfo);
                let bgf = near.x2 + bfz * Math.cos(bfo);
                let bgg = near.y2 + bfz * Math.sin(bfo);
                let bgh = near.x2 + bga * Math.cos(bfo);
                let bgi = near.y2 + bga * Math.sin(bfo);
                bfw.x0 = bgb;
                bfw.y0 = bgc;
                bfw.x1 = bgd;
                bfw.y1 = bge;
                bfw.instax = bgf;
                bfw.instay = bgg;
                bfw.turretx = bgh;
                bfw.turrety = bgi;
                if (UTILS.getDist({
                    x: bgb,
                    y: bgc
                }, bfv, 0, 0) <= bfv.scale + player.scale && player.reloads[player.weapons[0]] == 0) {
                    return "insta them";
                }
                if (UTILS.getDist({
                    x: bgf,
                    y: bgg
                }, bfv, 0, 0) <= bfv.scale + player.scale && player.reloads[player.weapons[0]] == 0 && player.reloads[player.weapons[1]] == 0) {
                    return "insta them";
                }
            }
        }
    } else {
        bfn = {
            x0: 0,
            y0: 0,
            x1: 0,
            y1: 0,
            instax: 0,
            instay: 0,
            turretx: 0,
            turrety: 0
        };
    }
    return false;
}

// RENDER GAME OBJECTS:
let gameObjectSprites = {};

function getResSprite(obj) {
    let biomeID = (obj.y >= config.mapScale - config.snowBiomeTop) ? 2 : ((obj.y <= config.snowBiomeTop) ? 1 : 0);
    let tmpIndex = (obj.type + "_" + obj.scale + "_" + biomeID);
    let tmpSprite = gameObjectSprites[tmpIndex];
    if (!tmpSprite) {
        let blurScale = 7;
        let tmpCanvas = document.createElement("canvas");
        tmpCanvas.width = tmpCanvas.height = (obj.scale * 2.1) + outlineWidth;
        let tmpContext = tmpCanvas.getContext('2d');
        tmpContext.translate((tmpCanvas.width / 2), (tmpCanvas.height / 2));
        tmpContext.rotate(UTILS.randFloat(0, Math.PI));
        tmpContext.strokeStyle = outlineColor;
        tmpContext.lineWidth = outlineWidth;
        tmpContext.shadowBlur = blurScale;
        tmpContext.shadowColor = `rgba(0, 0, 0, ${obj.alpha})`;
        if (obj.type == 0) {
            let tmpCount = UTILS.randInt(5, 6);
            let tmpScale;
            tmpContext.globalAlpha = 1; //default global
            for (let i = 0; i < 2; ++i) {
                tmpScale = tmpObj.scale * (!i ? 1 : 0.5);
                renderStar(tmpContext, tmpCount, tmpScale, tmpScale * 0.7);
                tmpContext.fillStyle = !biomeID ? (!i ? "#9ebf57" : "#b4db62") : (!i ? "#e3f1f4" : "#fff");
                tmpContext.fill();
                if (!i) {
                    tmpContext.stroke();
                    tmpContext.shadowBlur = null;
                    tmpContext.shadowColor = null;
                    tmpContext.globalAlpha = 1;
                }
            }
        }
        else if (obj.type == 1) {
            if (biomeID == 2) {
                tmpContext.fillStyle = "#606060";
                renderStar(tmpContext, 6, obj.scale * 0.3, obj.scale * 0.71);
                tmpContext.fill();
                tmpContext.stroke();
                tmpContext.shadowBlur = null;
                tmpContext.shadowColor = null;
                tmpContext.fillStyle = "#89a54c";
                renderCircle(0, 0, obj.scale * 0.55, tmpContext);
                tmpContext.fillStyle = "#a5c65b";
                renderCircle(0, 0, obj.scale * 0.3, tmpContext, true);
                let flowerCount = 1;
                let flowerRadius = obj.scale * 0.2;
                let rotVal = (Math.PI * 2) / flowerCount;
                for (let i = 0; i < flowerCount; ++i) {
                    let flowerX = flowerRadius * Math.cos(rotVal * i);
                    let flowerY = flowerRadius * Math.sin(rotVal * i);
                    tmpContext.font = `${obj.scale * 0.4}px sans-serif`;
                    tmpContext.fillStyle = "#f7a9d2";
                    tmpContext.fillText("🌸", flowerX, flowerY);
                }
            }
            else {
                renderBlob(tmpContext, 6, tmpObj.scale, tmpObj.scale * 0.7);
                tmpContext.fillStyle = biomeID ? "#e3f1f4" : "#7cbe5e";
                tmpContext.fill();
                tmpContext.stroke();
                tmpContext.shadowBlur = null;
                tmpContext.shadowColor = null;
                tmpContext.fillStyle = biomeID ? "" : "#a5a0c3";
                let tmpRange;
                let berries = 5;
                let rotVal = (Math.PI * 2) / berries;
                for (let i = 0; i < berries; ++i) {
                    tmpRange = UTILS.randInt(tmpObj.scale / 3.5, tmpObj.scale / 2.3);
                    renderCircle(tmpRange * Math.cos(rotVal * i), tmpRange * Math.sin(rotVal * i),
                                 UTILS.randInt(8, 10), tmpContext);
                }
            }
        }
        else if (obj.type == 2 || obj.type == 3) {
            tmpContext.fillStyle = (obj.type == 2) ? (biomeID == 2 ? "#938d77" : "#939393") : "#e0c655";
            renderIrregularShape(tmpContext, 12, obj.scale);
            tmpContext.fill();
            tmpContext.stroke();
            tmpContext.shadowBlur = null;
            tmpContext.shadowColor = null;
            tmpContext.fillStyle = (obj.type == 2) ? (biomeID == 2 ? "#b2ab90" : "#bcbcbc") : "#ebdca3";
            renderIrregularShape(tmpContext, 8, obj.scale * 0.55);
            tmpContext.fill();
        }
        tmpSprite = tmpCanvas;
        gameObjectSprites[tmpIndex] = tmpSprite;
    }
    return tmpSprite;
}
function renderIrregularShape(ctxt, sides, radius) {
    let angle = Math.PI * 2 / sides;
    ctxt.beginPath();
    for (let i = 0; i < sides; i++) {
        let x = Math.cos(i * angle) * radius;
        let y = Math.sin(i * angle) * radius;
        if (i === 0) {
            ctxt.moveTo(x, y);
        } else {
            ctxt.lineTo(x, y);
        }
    }
    ctxt.closePath();
}

// GET ITEM SPRITE:
let itemSprites = [];

function getItemSprite(obj, asIcon) {
    let tmpSprite = itemSprites[obj.id];
    if (!tmpSprite || asIcon) {
        let blurScale = !asIcon ? 20 : 5;
        let tmpCanvas = document.createElement("canvas");
        let reScale = ((!asIcon && obj.name == "windmill") ? items.list[4].scale : obj.scale);
        tmpCanvas.width = tmpCanvas.height = (reScale * 2.5) + outlineWidth + (items.list[obj.id].spritePadding || 0) + blurScale;

        let tmpContext = tmpCanvas.getContext("2d");
        tmpContext.translate((tmpCanvas.width / 2), (tmpCanvas.height / 2));
        tmpContext.rotate(asIcon ? 0 : (Math.PI / 2));
        tmpContext.strokeStyle = outlineColor;
        tmpContext.lineWidth = outlineWidth * (asIcon ? (tmpCanvas.width / 81) : 1);
        if ( !asIcon) {
            tmpContext.shadowBlur = 8;
            tmpContext.shadowColor = `rgba(0, 0, 0, ${Math.min(obj.name == "pit trap" ? 0.8 : 0.5, obj.alpha)})`;
            tmpContext.shadowBlur = obj.name == "pit trap" ? 15 : 5; // Zde měníme intenzitu blur pro pit trap
        }


        if (obj.name == "apple") {
            tmpContext.fillStyle = "#dd74ac";
            renderCircle(0, 0, obj.scale, tmpContext);
            tmpContext.fillStyle = "#89a54c";
            let leafDir = -(Math.PI / 2);
            renderLeaf(obj.scale * Math.cos(leafDir), obj.scale * Math.sin(leafDir),
                       25, leafDir + Math.PI / 2, tmpContext);
        } else if (obj.name == "cookie") {
            tmpContext.fillStyle = "#cca861";
            tmpContext.font = `${obj.scale * 2.2}px sans-serif`;
            tmpContext.fillText("🍙", -(obj.scale * 1.5), obj.scale * 0.8);
        } else if (obj.name == "cheese") {
            tmpContext.fillStyle = "#f4f3ac";
            renderCircle(0, 0, obj.scale, tmpContext);
            tmpContext.fillStyle = "#c3c28b";
            let chips = 4;
            let rotVal = (Math.PI * 2) / chips;
            let tmpRange;
            for (let i = 0; i < chips; ++i) {
                tmpRange = UTILS.randInt(obj.scale / 2.5, obj.scale / 1.7);
                renderCircle(tmpRange * Math.cos(rotVal * i), tmpRange * Math.sin(rotVal * i),
                             UTILS.randInt(4, 5), tmpContext, true);
            }
        } else if (obj.name == "wood wall" || obj.name == "stone wall" || obj.name == "castle wall") {
            tmpContext.fillStyle = (obj.name == "castle wall") ? "#83898e" : (obj.name == "wood wall") ?
                "#a5974c" : "#939393";
            let sides = (obj.name == "castle wall") ? 4 : 3;
            renderStar(tmpContext, sides, obj.scale * 1.1, obj.scale * 1.1);
            tmpContext.fill();
            tmpContext.stroke();
            tmpContext.fillStyle = (obj.name == "castle wall") ? "#9da4aa" : (obj.name == "wood wall") ?
                "#c9b758" : "#bcbcbc";
            renderStar(tmpContext, sides, obj.scale * 0.65, obj.scale * 0.65);
            tmpContext.fill();
        } else if (obj.name == "spikes" || obj.name == "greater spikes" || obj.name == "poison spikes" ||
                   obj.name == "spinning spikes") {
            tmpContext.fillStyle = (obj.name == "poison spikes") ? "#7b935d" : "#5f9ea0";
            let tmpScale = (obj.scale * 0.6);
            renderStar(tmpContext, (obj.name == "spikes") ? 5 : 6, obj.scale, tmpScale);
            tmpContext.fill();
            tmpContext.stroke();
            tmpContext.fillStyle = "#a5974c";
            renderCircle(0, 0, tmpScale, tmpContext);
            tmpContext.fillStyle = "#c9b758";
            renderCircle(0, 0, tmpScale / 2, tmpContext, true);
            renderCircle(0, 0, tmpScale / 2, tmpContext, true);
        } else if (obj.name == "windmill" || obj.name == "faster windmill" || obj.name == "power mill") {
            tmpContext.fillStyle = "#a5974c";
            renderCircle(0, 0, reScale, tmpContext);
            tmpContext.fillStyle = "#c9b758";
            renderRectCircle(0, 0, reScale * 1.5, 29, 4, tmpContext);
            tmpContext.fillStyle = "#a5974c";
            renderCircle(0, 0, reScale * 0.5, tmpContext);
        } else if (obj.name == "mine") {
            tmpContext.fillStyle = "#939393";
            renderStar(tmpContext, 3, obj.scale, obj.scale);
            tmpContext.fill();
            tmpContext.stroke();
            tmpContext.fillStyle = "#bcbcbc";
            renderStar(tmpContext, 3, obj.scale * 0.55, obj.scale * 0.65);
            tmpContext.fill();
        } else if (obj.name == "sapling") {
            for (let i = 0; i < 2; ++i) {
                let tmpScale = obj.scale * (!i ? 1 : 0.5);
                renderStar(tmpContext, 7, tmpScale, tmpScale * 0.7);
                tmpContext.fillStyle = (!i ? "#9ebf57" : "#b4db62");
                tmpContext.fill();
                if (!i) tmpContext.stroke();
            }
        } else if (obj.name == "pit trap") {
            tmpContext.fillStyle = "#a5974c";
            renderStar(tmpContext, 3, obj.scale * 1.1, obj.scale * 1.1);
            tmpContext.fill();
            tmpContext.stroke();
            tmpContext.fillStyle = outlineColor;
            renderStar(tmpContext, 3, obj.scale * 0.65, obj.scale * 0.65);
            tmpContext.fill();
        }
        // SPIRALS JAPANESSE OBJECTS END
        else if (obj.name == "boost pad") {
            tmpContext.fillStyle = "#7e7f82";
            renderRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext);
            tmpContext.fill();
            tmpContext.stroke();
            tmpContext.fillStyle = "#dbd97d";
            renderTriangle(obj.scale * 1, tmpContext);
        } else if (obj.name == "turret") {
            tmpContext.fillStyle = "#a5974c";
            renderCircle(0, 0, obj.scale, tmpContext);
            tmpContext.fill();
            tmpContext.stroke();
            tmpContext.fillStyle = "#939393";
            let tmpLen = 50;
            renderRect(0, -tmpLen / 2, obj.scale * 0.9, tmpLen, tmpContext);
            renderCircle(0, 0, obj.scale * 0.6, tmpContext);
            tmpContext.fill();
            tmpContext.stroke();
        } else if (obj.name == "platform") {
            tmpContext.fillStyle = "#cebd5f";
            let tmpCount = 4;
            let tmpS = obj.scale * 2;
            let tmpW = tmpS / tmpCount;
            let tmpX = -(obj.scale / 2);
            for (let i = 0; i < tmpCount; ++i) {
                renderRect(tmpX - (tmpW / 2), 0, tmpW, obj.scale * 2, tmpContext);
                tmpContext.fill();
                tmpContext.stroke();
                tmpX += tmpS / tmpCount;
            }
        } else if (obj.name == "healing pad") {
            tmpContext.fillStyle = "#7e7f82";
            renderRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext);
            tmpContext.fill();
            tmpContext.stroke();
            tmpContext.fillStyle = "#db6e6e";
            renderRectCircle(0, 0, obj.scale * 0.65, 20, 4, tmpContext, true);
        } else if (obj.name == "spawn pad") {
            tmpContext.fillStyle = "#7e7f82";
            renderRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext);
            tmpContext.fill();
            tmpContext.stroke();
            tmpContext.fillStyle = "#71aad6";
            renderCircle(0, 0, obj.scale * 0.6, tmpContext);
        } else if (obj.name == "blocker") {
            tmpContext.fillStyle = "#7e7f82";
            renderCircle(0, 0, obj.scale, tmpContext);
            tmpContext.fill();
            tmpContext.stroke();
            tmpContext.rotate(Math.PI / 4);
            tmpContext.fillStyle = "#db6e6e";
            renderRectCircle(0, 0, obj.scale * 0.65, 20, 4, tmpContext, true);
        } else if (obj.name == "teleporter") {
            tmpContext.fillStyle = "#7e7f82";
            renderCircle(0, 0, obj.scale, tmpContext);
            tmpContext.fill();
            tmpContext.stroke();
            tmpContext.rotate(Math.PI / 4);
            tmpContext.fillStyle = "#d76edb";
            renderCircle(0, 0, obj.scale * 0.5, tmpContext, true);
        }
        tmpSprite = tmpCanvas;
        if (!asIcon) itemSprites[obj.id] = tmpSprite;
    }
    return tmpSprite;
}

function getItemSprite2(obj, tmpX, tmpY) {
    let tmpContext = mainContext;
    let reScale = (obj.name == "windmill" ? items.list[4].scale : obj.scale);
    tmpContext.save();
    tmpContext.translate(tmpX, tmpY);
    tmpContext.rotate(obj.dir);
    tmpContext.strokeStyle = outlineColor;
    tmpContext.lineWidth = outlineWidth;
    if (obj.name == "apple") {
        tmpContext.fillStyle = "#c15555";
        renderCircle(0, 0, obj.scale, tmpContext);
        tmpContext.fillStyle = "#89a54c";
        let leafDir = -(Math.PI / 2);
        renderLeaf(obj.scale * Math.cos(leafDir), obj.scale * Math.sin(leafDir),
                   25, leafDir + Math.PI / 2, tmpContext);
    } else if (obj.name == "cookie") {
        tmpContext.fillStyle = "#cca861";
        renderCircle(0, 0, obj.scale, tmpContext);
        tmpContext.fillStyle = "#937c4b";
        let chips = 4;
        let rotVal = (Math.PI * 2) / chips;
        let tmpRange;
        for (let i = 0; i < chips; ++i) {
            tmpRange = UTILS.randInt(obj.scale / 2.5, obj.scale / 1.7);
            renderCircle(tmpRange * Math.cos(rotVal * i), tmpRange * Math.sin(rotVal * i),
                         UTILS.randInt(4, 5), tmpContext, true);
        }
    } else if (obj.name == "cheese") {
        tmpContext.fillStyle = "#f4f3ac";
        renderCircle(0, 0, obj.scale, tmpContext);
        tmpContext.fillStyle = "#c3c28b";
        let chips = 4;
        let rotVal = (Math.PI * 2) / chips;
        let tmpRange;
        for (let i = 0; i < chips; ++i) {
            tmpRange = UTILS.randInt(obj.scale / 2.5, obj.scale / 1.7);
            renderCircle(tmpRange * Math.cos(rotVal * i), tmpRange * Math.sin(rotVal * i),
                         UTILS.randInt(4, 5), tmpContext, true);
        }
    } else if (obj.name == "wood wall" || obj.name == "stone wall" || obj.name == "castle wall") {
        tmpContext.fillStyle = (obj.name == "castle wall") ? "#83898e" : (obj.name == "wood wall") ?
            "#a5974c" : "#939393";
        let sides = (obj.name == "castle wall") ? 4 : 3;
        renderStar(tmpContext, sides, obj.scale * 1.1, obj.scale * 1.1);
        tmpContext.fill();
        tmpContext.stroke();
        tmpContext.fillStyle = (obj.name == "castle wall") ? "#9da4aa" : (obj.name == "wood wall") ?
            "#c9b758" : "#bcbcbc";
        renderStar(tmpContext, sides, obj.scale * 0.65, obj.scale * 0.65);
        tmpContext.fill();
    } else if (obj.name == "spikes" || obj.name == "greater spikes" || obj.name == "poison spikes" ||
               obj.name == "spinning spikes") {
        tmpContext.fillStyle = (obj.name == "poison spikes") ? "#7b935d" : "#939393";
        let tmpScale = (obj.scale * 0.6);
        renderStar(tmpContext, (obj.name == "spikes") ? 5 : 6, obj.scale, tmpScale);
        tmpContext.fill();
        tmpContext.stroke();
        tmpContext.fillStyle = "#a5974c";
        renderCircle(0, 0, tmpScale, tmpContext);
        tmpContext.fillStyle = "#c9b758";
        renderCircle(0, 0, tmpScale / 2, tmpContext, true);
    } else if (obj.name == "windmill" || obj.name == "faster windmill" || obj.name == "power mill") {
        tmpContext.fillStyle = "#a5974c";
        renderCircle(0, 0, reScale, tmpContext);
        tmpContext.fillStyle = "#c9b758";
        renderRectCircle(0, 0, reScale * 1.5, 29, 4, tmpContext);
        tmpContext.fillStyle = "#a5974c";
        renderCircle(0, 0, reScale * 0.5, tmpContext);
    } else if (obj.name == "mine") {
        tmpContext.fillStyle = "#939393";
        renderStar(tmpContext, 3, obj.scale, obj.scale);
        tmpContext.fill();
        tmpContext.stroke();
        tmpContext.fillStyle = "#bcbcbc";
        renderStar(tmpContext, 3, obj.scale * 0.55, obj.scale * 0.65);
        tmpContext.fill();
    } else if (obj.name == "sapling") {
        for (let i = 0; i < 2; ++i) {
            let tmpScale = obj.scale * (!i ? 1 : 0.5);
            renderStar(tmpContext, 7, tmpScale, tmpScale * 0.7);
            tmpContext.fillStyle = (!i ? "#9ebf57" : "#b4db62");
            tmpContext.fill();
            if (!i) tmpContext.stroke();
        }
    } else if (obj.name == "pit trap") {
        tmpContext.fillStyle = "#a5974c";
        renderStar(tmpContext, 3, obj.scale * 1.1, obj.scale * 1.1);
        tmpContext.fill();
        tmpContext.stroke();
        tmpContext.fillStyle = outlineColor;
        renderStar(tmpContext, 3, obj.scale * 0.65, obj.scale * 0.65);
        tmpContext.fill();
    } else if (obj.name == "boost pad") {
        tmpContext.fillStyle = "#7e7f82";
        renderRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext);
        tmpContext.fill();
        tmpContext.stroke();
        tmpContext.fillStyle = "#dbd97d";
        renderTriangle(obj.scale * 1, tmpContext);
    } else if (obj.name == "turret") {
        tmpContext.fillStyle = "#a5974c";
        renderCircle(0, 0, obj.scale, tmpContext);
        tmpContext.fill();
        tmpContext.stroke();
        tmpContext.fillStyle = "#939393";
        let tmpLen = 50;
        renderRect(0, -tmpLen / 2, obj.scale * 0.9, tmpLen, tmpContext);
        renderCircle(0, 0, obj.scale * 0.6, tmpContext);
        tmpContext.fill();
        tmpContext.stroke();
    } else if (obj.name == "platform") {
        tmpContext.fillStyle = "#cebd5f";
        let tmpCount = 4;
        let tmpS = obj.scale * 2;
        let tmpW = tmpS / tmpCount;
        let tmpX = -(obj.scale / 2);
        for (let i = 0; i < tmpCount; ++i) {
            renderRect(tmpX - (tmpW / 2), 0, tmpW, obj.scale * 2, tmpContext);
            tmpContext.fill();
            tmpContext.stroke();
            tmpX += tmpS / tmpCount;
        }
    } else if (obj.name == "healing pad") {
        tmpContext.fillStyle = "#7e7f82";
        renderRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext);
        tmpContext.fill();
        tmpContext.stroke();
        tmpContext.fillStyle = "#db6e6e";
        renderRectCircle(0, 0, obj.scale * 0.65, 20, 4, tmpContext, true);
    } else if (obj.name == "spawn pad") {
        tmpContext.fillStyle = "#7e7f82";
        renderRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext);
        tmpContext.fill();
        tmpContext.stroke();
        tmpContext.fillStyle = "#71aad6";
        renderCircle(0, 0, obj.scale * 0.6, tmpContext);
    } else if (obj.name == "blocker") {
        tmpContext.fillStyle = "#7e7f82";
        renderCircle(0, 0, obj.scale, tmpContext);
        tmpContext.fill();
        tmpContext.stroke();
        tmpContext.rotate(Math.PI / 4);
        tmpContext.fillStyle = "#db6e6e";
        renderRectCircle(0, 0, obj.scale * 0.65, 20, 4, tmpContext, true);
    } else if (obj.name == "teleporter") {
        tmpContext.fillStyle = "#7e7f82";
        renderCircle(0, 0, obj.scale, tmpContext);
        tmpContext.fill();
        tmpContext.stroke();
        tmpContext.rotate(Math.PI / 4);
        tmpContext.fillStyle = "#d76edb";
        renderCircle(0, 0, obj.scale * 0.5, tmpContext, true);
    }
    tmpContext.restore();
}

let objSprites = [];

function getObjSprite(obj) {
    let tmpSprite = objSprites[obj.id];
    if (!tmpSprite) {
        let blurScale = 20;
        let tmpCanvas = document.createElement("canvas");
        tmpCanvas.width = tmpCanvas.height = obj.scale * 2.5 + outlineWidth + (items.list[obj.id].spritePadding || 0) + 0;
        let tmpContext = tmpCanvas.getContext("2d");
        tmpContext.translate(tmpCanvas.width / 2, tmpCanvas.height / 2);
        tmpContext.rotate(Math.PI / 2);
        tmpContext.strokeStyle = outlineColor;
        tmpContext.lineWidth = outlineWidth;
        tmpContext.shadowBlur = 20;
        tmpContext.shadowColor = `rgba(0, 0, 0, ${Math.min(0.3, obj.alpha)})`;
        if (obj.name == "spikes" || obj.name == "greater spikes" || obj.name == "poison spikes" || obj.name == "spinning spikes") {
            tmpContext.fillStyle = obj.name == "poison spikes" ? "#7b935d" : "#939393";
            let tmpScale = obj.scale * 0.6;
            renderStar(tmpContext, obj.name == "spikes" ? 5 : 6, obj.scale, tmpScale);
            tmpContext.fill();
            tmpContext.stroke();
            tmpContext.fillStyle = "#a5974c";
            renderCircle(0, 0, tmpScale, tmpContext);
            tmpContext.fillStyle = "#c9b758";
            renderCircle(0, 0, tmpScale / 2, tmpContext, true);
        } else if (obj.name == "pit trap") {
            tmpContext.fillStyle = "#a5974c";
            renderStar(tmpContext, 3, obj.scale * 1.1, obj.scale * 1.1);
            tmpContext.fill();
            tmpContext.stroke();
            tmpContext.fillStyle = outlineColor;
            renderStar(tmpContext, 3, obj.scale * 0.65, obj.scale * 0.65);
            tmpContext.fill();
        }
        tmpSprite = tmpCanvas;
        objSprites[obj.id] = tmpSprite;
    }
    return tmpSprite;
}

// GET MARK SPRITE:
function getMarkSprite(obj, tmpContext, tmpX, tmpY) {
    let center = {
        x: screenWidth / 2,
        y: screenHeight / 2,
    };
    tmpContext.lineWidth = outlineWidth;
    mainContext.globalAlpha = 0.2;
    tmpContext.strokeStyle = outlineColor;
    tmpContext.save();
    tmpContext.translate(tmpX, tmpY);
    tmpContext.rotate(90**10);
    if (obj.name == "spikes" || obj.name == "greater spikes" || obj.name == "poison spikes" || obj.name == "spinning spikes") {
        tmpContext.globalAlpha = 0.3;
        tmpContext.fillStyle = (obj.name == "poison spikes")?"#7b935d":"#939393";
        var tmpScale = (obj.scale);
        renderStar(tmpContext, (obj.name == "spikes")?5:6, obj.scale, tmpScale);
        tmpContext.fill();
        tmpContext.stroke();
        tmpContext.fillStyle = "#a5974c";
        renderCircle(0, 0, tmpScale, tmpContext);
        if (player && obj.owner && player.sid != obj.owner.sid && !tmpObj.findAllianceBySid(obj.owner.sid)) {
            tmpContext.fillStyle = "#a34040";
        } else {
            tmpContext.fillStyle = "#c9b758";
        }
        renderCircle(0, 0, tmpScale/2, tmpContext, true);
    } else if (obj.name == "turret") {
        renderCircle(0, 0, obj.scale, tmpContext);
        tmpContext.fill();
        tmpContext.stroke();
        tmpContext.fillStyle = "#939393";
        let tmpLen = 50;
        renderRect(0, -tmpLen / 2, obj.scale * 0.9, tmpLen, tmpContext);
        renderCircle(0, 0, obj.scale * 0.6, tmpContext);
        tmpContext.fill();
        tmpContext.stroke();
    } else if (obj.name == "teleporter") {
        tmpContext.fillStyle = "#7e7f82";
        renderCircle(0, 0, obj.scale, tmpContext);
        tmpContext.fill();
        tmpContext.stroke();
        tmpContext.rotate(Math.PI / 4);
        tmpContext.fillStyle = "#d76edb";
        renderCircle(0, 0, obj.scale * 0.5, tmpContext, true);
    } else if (obj.name == "platform") {
        tmpContext.fillStyle = "#cebd5f";
        let tmpCount = 4;
        let tmpS = obj.scale * 2;
        let tmpW = tmpS / tmpCount;
        let tmpX = -(obj.scale / 2);
        for (let i = 0; i < tmpCount; ++i) {
            renderRect(tmpX - (tmpW / 2), 0, tmpW, obj.scale * 2, tmpContext);
            tmpContext.fill();
            tmpContext.stroke();
            tmpX += tmpS / tmpCount;
        }
    } else if (obj.name == "healing pad") {
        tmpContext.fillStyle = "#7e7f82";
        renderRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext);
        tmpContext.fill();
        tmpContext.stroke();
        tmpContext.fillStyle = "#db6e6e";
        renderRectCircle(0, 0, obj.scale * 0.65, 20, 4, tmpContext, true);
    } else if (obj.name == "spawn pad") {
        tmpContext.fillStyle = "#7e7f82";
        renderRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext);
        tmpContext.fill();
        tmpContext.stroke();
        tmpContext.fillStyle = "#71aad6";
        renderCircle(0, 0, obj.scale * 0.6, tmpContext);
    } else if (obj.name == "blocker") {
        tmpContext.fillStyle = "#7e7f82";
        renderCircle(0, 0, obj.scale, tmpContext);
        tmpContext.fill();
        tmpContext.stroke();
        tmpContext.rotate(Math.PI / 4);
        tmpContext.fillStyle = "#db6e6e";
        renderRectCircle(0, 0, obj.scale * 0.65, 20, 4, tmpContext, true);
    } else if (obj.name == "windmill" || obj.name == "faster windmill" || obj.name == "power mill") {
        tmpContext.globalAlpha = 0.3;
        tmpContext.fillStyle = "#a5974c";
        renderCircle(0, 0, obj.scale, tmpContext);
        tmpContext.fillStyle = "#c9b758";
        renderRectCircle(0, 0, obj.scale * 1.5, 29, 4, tmpContext);
        tmpContext.fillStyle = "#a5974c";
        renderCircle(0, 0, obj.scale * 0.5, tmpContext);

    } else if (obj.name == "pit trap") {
        tmpContext.fillStyle = "#a5974c";
        renderStar(tmpContext, 3, obj.scale * 1.1, obj.scale * 1.1);
        tmpContext.fill();
        tmpContext.stroke();
        if (player && obj.owner && player.sid != obj.owner.sid && !tmpObj.findAllianceBySid(obj.owner.sid)) {
            tmpContext.fillStyle = "#a34040";
        } else {
            tmpContext.fillStyle = outlineColor;
        }
        renderStar(tmpContext, 3, obj.scale * 0.65, obj.scale * 0.65);
        tmpContext.fill();
    }
    tmpContext.restore();
}

// OBJECT ON SCREEN:
function isOnScreen(x, y, s) {
    return (x + s >= 0 && x - s <= maxScreenWidth && y + s >= 0 && (y,
                                                                    s,
                                                                    maxScreenHeight));
}
// RENDER GAMEOBJECTS:
function renderGameObjects(layer, xOffset, yOffset) {
    let tmpSprite, tmpX, tmpY;

    let renderMainMenuObjects = inGame ? closeObjects : gameObjects;

    renderMainMenuObjects.forEach((tmp) => {
        tmpObj = tmp;

        if (tmpObj.alive || tmpObj.active) {
            tmpX = tmpObj.x + tmpObj.xWiggle - xOffset;
            tmpY = tmpObj.y + tmpObj.yWiggle - yOffset;

            if (layer == 0) {
                tmpObj.update(delta);
            }

            mainContext.globalAlpha = tmpObj.alpha;

            if (tmpObj.layer == layer && isOnScreen(tmpX, tmpY, tmpObj.scale + (tmpObj.blocker || 0))) {
                if (tmpObj.isItem) {
                    if ((tmpObj.dmg || tmpObj.trap) && !tmpObj.isTeamObject(player)) {
                        tmpSprite = getObjSprite(tmpObj);
                    } else {
                        tmpSprite = getItemSprite(tmpObj);
                    }

                    mainContext.save();
                    mainContext.translate(tmpX, tmpY);
                    let rotationSpeed = 0;

                    if (tmpObj.name === "spinning spikes") {
                        rotationSpeed = 0.0010;
                    }
                    if (tmpObj.name === "windmill") {
                        rotationSpeed = 0.0005;
                    }
                    if (tmpObj.name === "power mill") {
                        rotationSpeed = 0.0010;
                    }
                    if (tmpObj.name === "faster windmill") {
                        rotationSpeed = 0.0008;
                    }

                    tmpObj.rotationAngle = (tmpObj.rotationAngle || 0) + rotationSpeed * delta || tmpObj.dir;
                    mainContext.rotate(tmpObj.rotationAngle);

                    if (!tmpObj.active) {
                        mainContext.scale(tmpObj.visScale / tmpObj.scale, tmpObj.visScale / tmpObj.scale);
                    }

                    mainContext.drawImage(tmpSprite, -(tmpSprite.width / 2), -(tmpSprite.height / 2));

                    if (tmpObj.blocker) {
                        mainContext.strokeStyle = "#db6e6e";
                        mainContext.globalAlpha = 0.3;
                        mainContext.lineWidth = 6;
                        renderCircle(0, 0, tmpObj.blocker, mainContext, false, true);
                    }
                    mainContext.restore();
                } else {
                    tmpSprite = getResSprite(tmpObj);
                    mainContext.drawImage(tmpSprite, tmpX - (tmpSprite.width / 2), tmpY - (tmpSprite.height / 2));
                    CHv4Tree(tmpObj, tmpX, tmpY);
                }
            }
            function findAllianceBySid(sid) {
                return player.team ? alliancePlayers.find((THIS)=>THIS === sid) : null;
            }
            if (layer == 2) {
                if (tmpObj.health < tmpObj.maxHealth) {
                    let distance = UTILS.getDist(tmpObj, player, 0, 0);
                    if (distance <= 360) {
                        // Smooth health update
                        if (!tmpObj.oldHealth) {
                            tmpObj.oldHealth = tmpObj.health;
                        }

                        const circleScale = 1.5;
                        const normalScale = tmpObj.scale / circleScale;

                        // Zvýšení velikosti kruhu: zvětšení vnějšího poloměru
                        const outerRadius = normalScale / 2.95 * 2; // Zvětšení kruhu
                        const outlineWidth = 10; // Tloušťka okraje zůstává stejná
                        const healthWidth = 7;
                        const healthPercentage = tmpObj.health / tmpObj.maxHealth;
                        const Filler = (2 * Math.PI) * healthPercentage;

                        mainContext.save();
                        mainContext.lineCap = 'round'; // Ensure the ends are rounded

                        // Draw background circle (black) bcs looks cool
                        mainContext.beginPath();
                        mainContext.arc(tmpX, tmpY, outerRadius, -Math.PI / 2, -Math.PI / 2 + Filler, false);
                        mainContext.lineWidth = outlineWidth;
                        mainContext.strokeStyle = darkOutlineColor;
                        mainContext.stroke();
                        mainContext.closePath();

                        // Draw health portion (this was most pain)
                        mainContext.beginPath();
                        mainContext.arc(tmpX, tmpY, outerRadius, -Math.PI / 2, -Math.PI / 2 + Filler, false);
                        mainContext.lineWidth = healthWidth;
                        mainContext.strokeStyle = tmpObj.isTeamObject(player) ? "#0091ff" : "#ff2131";
                        mainContext.stroke();
                        mainContext.closePath();

                        mainContext.restore();
                        if (distance <= 180 && configs.objtracer) {
                            // TRACER:
                            mainContext.strokeStyle = player.sid !== tmpObj.owner.sid && !findAllianceBySid(tmpObj.owner.sid) ? '#ff2131' : '#0091ff';
                            mainContext.lineWidth = 3;
                            mainContext.globalAlpha = 1;
                            mainContext.beginPath();
                            mainContext.moveTo(player.x - xOffset, player.y - yOffset);
                            mainContext.lineTo(tmpObj.x - xOffset, tmpObj.y - yOffset);
                            mainContext.stroke();
                        }
                    }
                }
            }
        }
    });
    function CHv4Tree(y, n, r, offsets) {
        let trees = getResSprite(y);
        let easeScale = 100;
        let lowestAlpha = 0.3;
        let fadeStartDistance = y.scale * 1.2;
        let circleFadeDistance = 60;
        let treeFadeDistance = 200;
        if (player && y.type === 0) {
            let distanceToPlayer = Math.sqrt((y.y - player.y2) ** 2 + (y.x - player.x2) ** 2);
            if (distanceToPlayer <= fadeStartDistance + treeFadeDistance + player.scale) {
                let alphaFactor = (distanceToPlayer / (fadeStartDistance + treeFadeDistance + player.scale)) ** 2;
                mainContext.globalAlpha = Math.max(lowestAlpha, alphaFactor);
            } else {
                mainContext.globalAlpha = 1;
            }
            mainContext.drawImage(trees, n - trees.width / 2, r - trees.height / 2);
            let circleAlpha = 1 - (distanceToPlayer - y.scale) / (circleFadeDistance + player.scale * 5);
            if (distanceToPlayer <= y.scale + circleFadeDistance + player.scale) {
                mainContext.beginPath();
                mainContext.arc(n, r, y.scale * 0.6, 0, 2 * Math.PI);
                mainContext.fillStyle = `rgba(0, 0, 300, ${circleAlpha})`;
                mainContext.strokeStyle = "black";
                mainContext.lineWidth = 15;
                mainContext.fill();
                mainContext.stroke();
                mainContext.closePath();
            }
        } else {
            mainContext.globalAlpha = 1;
            mainContext.drawImage(trees, n - trees.width / 2, r - trees.height / 2);
        }
    }

    // PLACE VISIBLE:
    if (layer == 0) {
        if (preIndi.length) {
            preIndi.forEach((places) => {
                tmpX = places.x - xOffset;
                tmpY = places.y - yOffset;
                markObject(places, tmpX, tmpY);
            });
        }
    }
}

function markObject(tmpObj, tmpX, tmpY) {
    preshit(tmpObj, mainContext, tmpX, tmpY);
}
function markObject2(tmpObj, tmpX, tmpY, id) {
    mainContext.save();
    mainContext.translate(tmpX, tmpY);
    mainContext.globalAlpha = 0.6;

    mainContext.fillStyle = id == 4 ? "rgba(0, 255, 255, 0.5)" : "rgba(255, 0, 0, 0.5)";
    renderCircle(0, 0, tmpObj.scale, mainContext, 1);
    mainContext.fill();
    mainContext.restore();
}
function preshit(obj, tmpContext, tmpX, tmpY) {
    tmpContext.globalAlpha = 0.3;
    tmpContext.save();
    tmpContext.translate(tmpX, tmpY);
    if (obj.name === "spikes" || obj.name === "greater spikes" || obj.name === "poison spikes" || obj.name === "spinning spikes") {
        tmpContext.fillStyle = "#cc5151";
        tmpContext.strokeStyle = "#cc5151";
        mainContext.lineWidth = 0;
        renderCircle(0, 0, obj.scale, tmpContext);
        tmpContext.fill();
    } else if (obj.name === "pit trap") {
        tmpContext.fillStyle = "#51cccc";
        tmpContext.strokeStyle = "#51cccc";
        mainContext.lineWidth = 0;
        renderCircle(0, 0, obj.scale, tmpContext);
        tmpContext.fill();
    }
    tmpContext.restore();
}
// RENDER MINIMAP:
class MapPing {
    constructor(color, scale) {
        this.init = function(x, y) {
            this.scale = 0;
            this.x = x;
            this.y = y;
            this.active = true;
        };
        this.update = function(ctxt, delta) {
            if (this.active) {
                this.scale += 0.05 * delta;
                if (this.scale >= scale) {
                    this.active = false;
                } else {
                    ctxt.globalAlpha = (1 - Math.max(0, this.scale / scale));
                    ctxt.beginPath();
                    ctxt.arc((this.x / config.mapScale) * mapDisplay.width, (this.y / config.mapScale) *
                             mapDisplay.width, this.scale, 0, 2 * Math.PI);
                    ctxt.stroke();
                }
            }
        };
        this.color = color;
    }
}

function pingMap(x, y) {
    tmpPing = mapPings.find(pings => !pings.active);
    if (!tmpPing) {
        tmpPing = new MapPing("#fff", config.mapPingScale);
        mapPings.push(tmpPing);
    }
    tmpPing.init(x, y);
}

function updateMapMarker() {
    mapMarker.x = player.x;
    mapMarker.y = player.y;
}

function renderMinimap(delta) {
    if (player && player.alive) {
        mapContext.clearRect(0, 0, mapDisplay.width, mapDisplay.height);

        // RENDER PINGS:
        mapContext.lineWidth = 4;
        for (let i = 0; i < mapPings.length; ++i) {
            tmpPing = mapPings[i];
            mapContext.strokeStyle = tmpPing.color;
            tmpPing.update(mapContext, delta);
        }

        // RENDER BREAK TRACKS:
        mapContext.globalAlpha = 1;
        mapContext.fillStyle = "#ff0000";
        if (breakTrackers.length) {
            mapContext.fillStyle = "#abcdef";
            mapContext.font = "34px Hammersmith One";
            mapContext.textBaseline = "middle";
            mapContext.textAlign = "center";
            for (let i = 0; i < breakTrackers.length;) {
                mapContext.fillText("!", (breakTrackers[i].x / config.mapScale) * mapDisplay.width,
                                    (breakTrackers[i].y / config.mapScale) * mapDisplay.height);
                i += 2;
            }
        }

        // RENDER PLAYERS:
        mapContext.globalAlpha = 1;
        mapContext.fillStyle = "#fff";
        renderCircle((player.x / config.mapScale) * mapDisplay.width,
                     (player.y / config.mapScale) * mapDisplay.height, 7, mapContext, true);
        mapContext.fillStyle = "rgba(255,255,255,0.35)";
        if (player.team && minimapData) {
            for (let i = 0; i < minimapData.length;) {
                renderCircle((minimapData[i] / config.mapScale) * mapDisplay.width,
                             (minimapData[i + 1] / config.mapScale) * mapDisplay.height, 7, mapContext, true);
                i += 2;
            }
        }

        // DEATH LOCATION:
        if (lastDeath) {
            mapContext.fillStyle = "#fc5553";
            mapContext.font = "34px Hammersmith One";
            mapContext.textBaseline = "middle";
            mapContext.textAlign = "center";
            mapContext.fillText("x", (lastDeath.x / config.mapScale) * mapDisplay.width,
                                (lastDeath.y / config.mapScale) * mapDisplay.height);
        }

        // MAP MARKER:
        if (mapMarker) {
            mapContext.fillStyle = "#fff";
            mapContext.font = "34px Hammersmith One";
            mapContext.textBaseline = "middle";
            mapContext.textAlign = "center";
            mapContext.fillText("x", (mapMarker.x / config.mapScale) * mapDisplay.width,
                                (mapMarker.y / config.mapScale) * mapDisplay.height);
        }
    }
}

// ICONS:
let crossHairs = ["https://cdn.discordapp.com/attachments/1001384433078779927/1149285738412769300/newawwddd.png", "https://cdn.discordapp.com/attachments/1001384433078779927/1149285168780165170/100px-Crosshairs_Red.png"];
let crossHairSprites = {};
let iconSprites = {};
let icons = ["crown", "skull"];

function loadIcons() {
    for (let i = 0; i < icons.length; ++i) {
        let tmpSprite = new Image();
        tmpSprite.onload = function() {
            this.isLoaded = true;
        };
        tmpSprite.src = "./../img/icons/" + icons[i] + ".png";
        iconSprites[icons[i]] = tmpSprite;
    }
    for (let i = 0; i < crossHairs.length; ++i) {
        let tmpSprite = new Image();
        tmpSprite.onload = function() {
            this.isLoaded = true;
        };
        tmpSprite.src = crossHairs[i];
        crossHairSprites[i] = tmpSprite;
    }
}
loadIcons();


// UPDATE GAME:
function updateGame() {
    if (gameObjects.length && inGame) {
        if (loopIndex >= loopHats.length) {
            loopIndex = 0;
        }
        gameObjects.forEach((tmp) => {
            const distance = UTILS.getDistance(tmp.x, tmp.y, player.x, player.y);
            const inRange = distance <= 1200;

            if (inRange && !closeObjects.includes(tmp)) {
                closeObjects.push(tmp);
                tmp.render = true;
            } else if (!inRange && closeObjects.includes(tmp)) {
                tmp.render = false;
                closeObjects.splice(closeObjects.indexOf(tmp), 1);
            }
        });
    }

    // if (config.resetRender) {
    mainContext.beginPath();
    mainContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    // }
    mainContext.globalAlpha = 1;

    if (player) {
        // INTERPOLATE PLAYERS AND AI:
        let lastTime = now - (1000 / config.serverUpdateRate);
        let tmpDiff;
        for (let i = 0; i < players.length + ais.length; ++i) {
            tmpObj = players[i] || ais[i - players.length];
            if (tmpObj && tmpObj.visible) {
                if (tmpObj.forcePos) {
                    tmpObj.x = tmpObj.x2;
                    tmpObj.y = tmpObj.y2;
                    tmpObj.dir = tmpObj.d2;
                } else {
                    let total = tmpObj.t2 - tmpObj.t1;
                    let fraction = lastTime - tmpObj.t1;
                    let ratio = (fraction / total);
                    let rate = 170;
                    tmpObj.dt += delta;
                    let tmpRate = Math.min(1.7, tmpObj.dt / rate);
                    tmpDiff = (tmpObj.x2 - tmpObj.x1);
                    tmpObj.x = tmpObj.x1 + (tmpDiff * tmpRate);
                    tmpDiff = (tmpObj.y2 - tmpObj.y1);
                    tmpObj.y = tmpObj.y1 + (tmpDiff * tmpRate);
                    tmpObj.dir = Math.lerpAngle(tmpObj.d2, tmpObj.d1, Math.min(1.2, ratio));
                }
            }
        }

        // MOVE CAMERA:
        let damping = 0.08;
        camX += (player.x - camX) * damping;
        camY += (player.y - camY) * damping;
    } else {
        camX = config.mapScale / 2;
        camY = config.mapScale / 2;
    }

    // RENDER CORDS:
    let xOffset = camX - (maxScreenWidth / 2);
    let yOffset = camY - (maxScreenHeight / 2);

    // RENDER BACKGROUND:
    if (config.snowBiomeTop - yOffset <= 0 && config.mapScale - config.snowBiomeTop - yOffset >= maxScreenHeight) {
        mainContext.fillStyle = "#b6db66";
        mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
    } else if (config.mapScale - config.snowBiomeTop - yOffset <= 0) {
        mainContext.fillStyle = "#dbc666";
        mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
    } else if (config.snowBiomeTop - yOffset >= maxScreenHeight) {
        mainContext.fillStyle = "#fff";
        mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
    } else if (config.snowBiomeTop - yOffset >= 0) {
        mainContext.fillStyle = "#fff";
        mainContext.fillRect(0, 0, maxScreenWidth, config.snowBiomeTop - yOffset);
        mainContext.fillStyle = "#b6db66";
        mainContext.fillRect(0, config.snowBiomeTop - yOffset, maxScreenWidth,
                             maxScreenHeight - (config.snowBiomeTop - yOffset));
    } else {
        mainContext.fillStyle = "#b6db66";
        mainContext.fillRect(0, 0, maxScreenWidth,
                             (config.mapScale - config.snowBiomeTop - yOffset));
        mainContext.fillStyle = "#dbc666";
        mainContext.fillRect(0, (config.mapScale - config.snowBiomeTop - yOffset), maxScreenWidth,
                             maxScreenHeight - (config.mapScale - config.snowBiomeTop - yOffset));
    }

    // RENDER WATER AREAS:
    if (!firstSetup) {
        waterMult += waterPlus * config.waveSpeed * delta;
        if (waterMult >= config.waveMax) {
            waterMult = config.waveMax;
            waterPlus = -1;
        } else if (waterMult <= 1) {
            waterMult = waterPlus = 1;
        }
        mainContext.globalAlpha = 1;
        mainContext.fillStyle = "#dbc666";
        renderWaterBodies(xOffset, yOffset, mainContext, config.riverPadding);
        mainContext.fillStyle = "#91b2db";
        renderWaterBodies(xOffset, yOffset, mainContext, (waterMult - 1) * 250);
    }

    // RENDER DEAD PLAYERS:
    mainContext.globalAlpha = 1;
    mainContext.strokeStyle = outlineColor;
    renderDeadPlayers(xOffset, yOffset);

    // RENDER BOTTOM LAYER:
    mainContext.globalAlpha = 1;
    mainContext.strokeStyle = outlineColor;
    renderGameObjects(-1, xOffset, yOffset);

    // RENDER PROJECTILES:
    mainContext.globalAlpha = 1;
    mainContext.lineWidth = outlineWidth;
    renderProjectiles(0, xOffset, yOffset);

    // RENDER PLAYERS:
    renderPlayers(xOffset, yOffset, 0);

    // RENDER AI:
    mainContext.globalAlpha = 1;
    for (let i = 0; i < ais.length; ++i) {
        tmpObj = ais[i];
        if (tmpObj.active && tmpObj.visible) {
            tmpObj.animate(delta);
            mainContext.save();
            mainContext.translate(tmpObj.x - xOffset, tmpObj.y - yOffset);
            mainContext.rotate(tmpObj.dir + tmpObj.dirPlus - (Math.PI / 2));
            renderAI(tmpObj, mainContext);
            mainContext.restore();
        }
    }

    // RENDER GAME OBJECTS (LAYERED):
    renderGameObjects(0, xOffset, yOffset);
    renderProjectiles(1, xOffset, yOffset);
    renderGameObjects(1, xOffset, yOffset);
    renderPlayers(xOffset, yOffset, 1);
    renderGameObjects(2, xOffset, yOffset);
    renderGameObjects(3, xOffset, yOffset);

    // MAP BOUNDARIES:
    mainContext.fillStyle = "#000";
    mainContext.globalAlpha = 0.09;
    if (xOffset <= 0) {
        mainContext.fillRect(0, 0, -xOffset, maxScreenHeight);
    }
    if (config.mapScale - xOffset <= maxScreenWidth) {
        let tmpY = Math.max(0, -yOffset);
        mainContext.fillRect(config.mapScale - xOffset, tmpY, maxScreenWidth - (config.mapScale - xOffset), maxScreenHeight - tmpY);
    }
    if (yOffset <= 0) {
        mainContext.fillRect(-xOffset, 0, maxScreenWidth + xOffset, -yOffset);
    }
    if (config.mapScale - yOffset <= maxScreenHeight) {
        let tmpX = Math.max(0, -xOffset);
        let tmpMin = 0;
        if (config.mapScale - xOffset <= maxScreenWidth) tmpMin = maxScreenWidth - (config.mapScale - xOffset);
        mainContext.fillRect(tmpX, config.mapScale - yOffset,
                             (maxScreenWidth - tmpX) - tmpMin, maxScreenHeight - (config.mapScale - yOffset));
    }

    // RENDER DAY/NIGHT TIME:
    mainContext.globalAlpha = 0.5;
    mainContext.fillStyle = getEl("morning").checked ? "rgb(5, 0, 40)" : "rgb(5, 0, 70)";
    mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
    mainContext.strokeStyle = darkOutlineColor;

    // 3D FEELING AAH VISUALS:
    const shadowColor = 'rgb(5, 0, 70)';
    const shadowOpacity = 0.5;
    let x = xOffset;
    let y = yOffset;
    let width = maxScreenWidth;
    let height = maxScreenHeight;
    mainContext.globalAlpha = shadowOpacity;
    const shadowGradient = mainContext.createLinearGradient(x = 0, y = 0, x = 0 + width, y = 0 + height);
    shadowGradient.addColorStop(0, shadowColor);
    shadowGradient.addColorStop(1, 'transparent');
    mainContext.fillStyle = shadowGradient;
    mainContext.fillRect(x = 0, y = 0, width, height);
    mainContext.strokeRect(x = 0, y = 0, width, height);
    mainContext.globalAlpha = 1;

    // RENDER PLAYER AND AI UI:
    mainContext.strokeStyle = darkOutlineColor;
    mainContext.globalAlpha = 1;
    for (let i = 0; i < players.length + ais.length; ++i) {
        tmpObj = players[i] || ais[i - players.length];
        if (tmpObj.visible) {
            mainContext.strokeStyle = darkOutlineColor;

            // NAME AND HEALTH:
            if (tmpObj.skinIndex != 10 || (tmpObj == player) || (tmpObj.team && tmpObj.team == player.team)) {
                let tmpText = (tmpObj.team ? "[" + tmpObj.team + "] " : "") + (tmpObj.name || ""); + (tmpObj.isPlayer ? " {" + tmpObj.sid + "}" : "");
                if (tmpText != "") {
                    mainContext.font = (tmpObj.nameScale || 30) + "px Hammersmith One";
                    mainContext.fillStyle = "#fff";
                    mainContext.textBaseline = "middle";
                    mainContext.textAlign = "center";
                    mainContext.lineWidth = (tmpObj.nameScale ? 11 : 8);
                    mainContext.lineJoin = "round";
                    mainContext.strokeText(tmpText, tmpObj.x - xOffset, (tmpObj.y - yOffset - tmpObj.scale) - config.nameY);
                    mainContext.fillText(tmpText, tmpObj.x - xOffset, (tmpObj.y - yOffset - tmpObj.scale) - config.nameY);
                    if (tmpObj.isLeader && iconSprites.crown.isLoaded) {
                        let tmpS = config.crownIconScale;
                        let tmpX = tmpObj.x - xOffset - (tmpS / 2) - (mainContext.measureText(tmpText).width / 2) - config.crownPad;
                        mainContext.drawImage(iconSprites.crown, tmpX, (tmpObj.y - yOffset - tmpObj.scale) -
                                              config.nameY - (tmpS / 2) - 5, tmpS, tmpS);
                    }
                    if (tmpObj.iconIndex == 1 && iconSprites.skull.isLoaded) {
                        let tmpS = config.crownIconScale;
                        let tmpX = tmpObj.x - xOffset - (tmpS / 2) + (mainContext.measureText(tmpText).width / 2) + config.crownPad;
                        mainContext.drawImage(iconSprites.skull, tmpX, (tmpObj.y - yOffset - tmpObj.scale) -
                                              config.nameY - (tmpS / 2) - 5, tmpS, tmpS);
                    }
                    if (tmpObj.isPlayer && instaC.wait && near == tmpObj && (tmpObj.backupNobull ? crossHairSprites[1].isLoaded : crossHairSprites[0].isLoaded) && enemy.length && !useWasd) {
                        let tmpS = tmpObj.scale * 2.2;
                        mainContext.drawImage((tmpObj.backupNobull ? crossHairSprites[1] : crossHairSprites[0]), tmpObj.x - xOffset - tmpS / 2, tmpObj.y - yOffset - tmpS / 2, tmpS, tmpS);
                    }
                }

                if (tmpObj.health > 0) {

                    // HEALTH HOLDER:
                    var tmpWidth = config.healthBarWidth;
                    if (configs.healthbar && tmpObj.isPlayer) {
                        tmpObj.oldHealth = tmpObj.oldHealth - (tmpObj.oldHealth - tmpObj.health) / 10;
                    } else {
                        tmpObj.oldHealth = tmpObj.health;
                    }


                    mainContext.fillStyle = darkOutlineColor;
                    mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth - config.healthBarPad,
                                          (tmpObj.y - yOffset + tmpObj.scale) + config.nameY, (config.healthBarWidth * 2) +
                                          (config.healthBarPad * 2), 17, 8);
                    mainContext.fill();

                    mainContext.fillStyle = (tmpObj == player || (tmpObj.team && tmpObj.team == player.team)) ? "#8ecc51" : "#cc5151";
                    mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth,
                                          (tmpObj.y - yOffset + tmpObj.scale) + config.nameY + config.healthBarPad,
                                          ((config.healthBarWidth * 2) * (tmpObj.oldHealth / tmpObj.maxHealth)), 17 - config.healthBarPad * 2, 7);
                    mainContext.fill();
                }

                if (tmpObj.isPlayer) {
                    if (tmpObj.isPlayer) {
                        // Určete hodnoty reloadu
                        let reloads = {
                            primary: (tmpObj.primaryIndex == undefined ? 1 : ((items.weapons[tmpObj.primaryIndex].speed - tmpObj.reloads[tmpObj.primaryIndex]) / items.weapons[tmpObj.primaryIndex].speed)),
                            secondary: (tmpObj.secondaryIndex == undefined ? 1 : ((items.weapons[tmpObj.secondaryIndex].speed - tmpObj.reloads[tmpObj.secondaryIndex]) / items.weapons[tmpObj.secondaryIndex].speed)),
                            turret: (2500 - tmpObj.reloads[53]) / 2500,
                        };

                        // Smooth update reloads
                        if (!tmpObj.oldReloads) {
                            tmpObj.oldReloads = { ...reloads };
                        }

                        // Interpolace pro hladký přechod
                        const smoothFactor = 0.1; // Nastavte podle potřeby

                        tmpObj.oldReloads.primary += (reloads.primary - tmpObj.oldReloads.primary) * smoothFactor;
                        tmpObj.oldReloads.secondary += (reloads.secondary - tmpObj.oldReloads.secondary) * smoothFactor;
                        tmpObj.oldReloads.turret += (reloads.turret - tmpObj.oldReloads.turret) * smoothFactor;

                        // Zobrazit reload bary
                        if (tmpObj == player) {
                            // Sekundární zbraň
                            if (player.reloads[player.weapons[1]] != 0 && player.weapons[1]) {
                                mainContext.fillStyle = darkOutlineColor;
                                mainContext.roundRect(tmpObj.x - xOffset - config.healthBarPad + 5,
                                                      (tmpObj.y - yOffset + tmpObj.scale) + config.nameY - 13, (config.healthBarWidth - 5) +
                                                      (config.healthBarPad * 2), 17, 8);
                                mainContext.fill();

                                mainContext.fillStyle = "#0091ff";
                                mainContext.roundRect(tmpObj.x - xOffset + 5,
                                                      (tmpObj.y - yOffset + tmpObj.scale) + config.nameY - 13 + config.healthBarPad,
                                                      (config.healthBarWidth * tmpObj.oldReloads.secondary + 1) - 5, 17 - config.healthBarPad * 2, 7);
                                mainContext.fill();
                            }

                            // Primární zbraň
                            if (player.reloads[player.weapons[0]] != 0) {
                                mainContext.fillStyle = darkOutlineColor;
                                mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth - config.healthBarPad,
                                                      (tmpObj.y - yOffset + tmpObj.scale) + config.nameY - 13, config.healthBarWidth +
                                                      (config.healthBarPad * 2) - 5, 17, 8);
                                mainContext.fill();

                                mainContext.fillStyle = "#0091ff";
                                mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth,
                                                      (tmpObj.y - yOffset + tmpObj.scale) + config.nameY - 13 + config.healthBarPad,
                                                      (config.healthBarWidth * tmpObj.oldReloads.primary + 1) - 5, 17 - config.healthBarPad * 2, 7);
                                mainContext.fill();
                            }

                            // Turret reload bar (když je potřeba)
                            if (player.reloads[53] != 0 && false) {
                                mainContext.fillStyle = darkOutlineColor;
                                mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth - config.healthBarPad,
                                                      (tmpObj.y - yOffset + tmpObj.scale) + config.nameY + 13, (config.healthBarWidth * 2) +
                                                      (config.healthBarPad * 2), 17, 8);
                                mainContext.fill();

                                mainContext.fillStyle = "#a9a9a9";
                                mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth,
                                                      (tmpObj.y - yOffset + tmpObj.scale) + config.nameY + 13 + config.healthBarPad,
                                                      ((config.healthBarWidth * 2) * tmpObj.oldReloads.turret), 17 - config.healthBarPad * 2, 7);
                                mainContext.fill();
                            }
                        }
                    }
                    // UNDER TEXT:
                    mainContext.globalAlpha = 1;
                    mainContext.font = "20px Hammersmith One";
                    mainContext.fillStyle = "#fff";
                    mainContext.strokeStyle = darkOutlineColor;
                    mainContext.textBaseline = "middle";
                    mainContext.textAlign = "center";
                    mainContext.lineWidth = 8;
                    mainContext.lineJoin = "round";
                    let text = [];
                    if (tmpObj == player) {
                        text = [instaC.wait, tmpObj.skinIndex, window.pingTime, enemy.length];
                        mainContext.strokeText("[" + (player.skins[53] ? "1" : "0") + "," + text.join(",") + "]", tmpObj.x - xOffset, tmpObj.y - yOffset + tmpObj.scale + config.nameY + 14 * 3);
                        mainContext.fillText("[" + (player.skins[53] ? "1" : "0") + "," + text.join(",") + "]", tmpObj.x - xOffset, tmpObj.y - yOffset + tmpObj.scale + config.nameY + 14 * 3);
                    }

                    // SHAME COUNT:
                    mainContext.globalAlpha = 1;
                    mainContext.font = "px Blackadder ITC";
                    var gradient = mainContext.createRadialGradient(tmpObj.x - xOffset, tmpObj.y - yOffset - tmpObj.scale - config.nameY, 0, tmpObj.x - xOffset, tmpObj.y - yOffset - tmpObj.scale - config.nameY, 20);
                    gradient.addColorStop(0, '#ff0000');
                    gradient.addColorStop(1, '#ff0000');
                    mainContext.fillStyle = gradient;
                    mainContext.textBaseline = "middle";
                    mainContext.textAlign = "center";
                    mainContext.lineWidth = (tmpObj.nameScale?11:8);
                    mainContext.lineJoin = "round";
                    var tmpS = config.crownIconScale;
                    var tmpX = tmpObj.x - xOffset - (tmpS/2) + (mainContext.measureText(tmpText).width / 2) + config.crownPad + (tmpObj.iconIndex == 1? (tmpObj.nameScale||30)*2.75: (tmpObj.nameScale||30));
                    mainContext.strokeText(tmpObj.skinIndex == 45 && tmpObj.shameTimer > 0? tmpObj.shameTimer : tmpObj.shameCount, tmpX, tmpObj.y - yOffset - tmpObj.scale - config.nameY);
                    mainContext.fillText(tmpObj.skinIndex == 45 && tmpObj.shameTimer > 0? tmpObj.shameTimer : tmpObj.shameCount, tmpX, tmpObj.y - yOffset - tmpObj.scale - config.nameY);
                    mainContext.fillStyle = (tmpObj.shameCount < tmpObj.dangerShame)? "#fff" : "#ff0000";
                }
            }
        }
    }

    // RENDER GRID:
    if (getEl("grids").checked) {
        let isNight = false;
        mainContext.lineWidth = 4;
        mainContext.strokeStyle = "#000";
        mainContext.globalAlpha = 0.06;
        let blurScale = isNight ? 12 : 0;

        if (blurScale > 0) {
            mainContext.shadowBlur = blurScale;
            mainContext.shadowColor = `rgba(0, 0, 0, 0.3)`;
        }
        mainContext.beginPath();
        for (let x = -camX; x < maxScreenWidth; x += useWasd ? 60 : 120) {
            if (x > 0) {
                mainContext.moveTo(x, 0);
                mainContext.lineTo(x, maxScreenHeight);
            }
        }
        for (let y = -camY; y < maxScreenHeight; y += useWasd ? 60 : 120) {
            if (y > 0) {
                mainContext.moveTo(0, y);
                mainContext.lineTo(maxScreenWidth, y);
            }
        }
        mainContext.stroke();
        mainContext.shadowBlur = 0;
        mainContext.shadowColor = 'rgba(0, 0, 0, 0)';
    }

    if (player) {
        // AUTOPUSH LINE:
        if (my.autoPush) {
            mainContext.lineWidth = 14;
            mainContext.strokeStyle = "rgb(50, 205, 50, 0.3)"; // HPBarColor (Outline color)
            mainContext.beginPath();
            mainContext.moveTo(player.x - xOffset, player.y - yOffset);
            mainContext.lineTo(my.pushData.x - xOffset, my.pushData.y - yOffset);
            mainContext.strokeStyle = "rgb(50, 205, 50, 0.3)";
            mainContext.stroke(); // Draw the outline
        }

        // DODGE SPIKE MARK:
        if (tracker.draw3.active) {
            mainContext.globalAlpha = 0.2;
            let obj = {
                x: tracker.draw3.x - xOffset,
                y: tracker.draw3.y - yOffset,
                scale: tracker.draw3.scale,
            }
            mainContext.fillStyle = "#cc5151";
            mainContext.beginPath();
            mainContext.arc(obj.x, obj.y, obj.scale, 0, 2 * Math.PI);
            mainContext.fill();
        }
    }


    mainContext.globalAlpha = 1;
    /*     if (player) {
        if (enemy.length && sCombat.findSpikeHit.x && sCombat.findSpikeHit.y) {
            let isKnocked = sCombat.findSpikeHit.canHit
            sCombat.spikesNearEnemy = gameObjects.find((e) => Math.hypot(e.y - sCombat.findSpikeHit.y, e.x - sCombat.findSpikeHit.x) < e.scale + player.scale + 90 && /spik/.test(e.name) && e.active && e.owner.sid != near.sid)
            mainContext.save()
            mainContext.beginPath()
            mainContext.lineWidth = 10
            mainContext.lineJoin = 'bever'
            if (sCombat.spikesNearEnemy !== undefined) {
                mainContext.strokeStyle = isKnocked ? 'rgba(129, 53, 50, .4)' : 'rgba(117, 153, 191, .4)'
                mainContext.moveTo(near.x2 - xOffset, near.y2 - yOffset)
                mainContext.lineTo(sCombat.findSpikeHit.x - xOffset, sCombat.findSpikeHit.y - yOffset)
                mainContext.lineTo(sCombat.spikesNearEnemy.x - xOffset, sCombat.spikesNearEnemy.y - yOffset)
                mainContext.stroke()
            } else {
                mainContext.save()
                mainContext.strokeStyle = isKnocked ? 'rgba(129, 53, 50, .4)' : 'rgba(117, 153, 191, .4)'
                mainContext.moveTo(near.x2 - xOffset, near.y2 - yOffset)
                mainContext.lineTo(sCombat.findSpikeHit.x - xOffset, sCombat.findSpikeHit.y - yOffset)
                mainContext.stroke()
            }
            mainContext.restore()
        }
        mainContext.globalAlpha = 1;
    } */
    // RENDER ANIM TEXTS:
    textManager.update(delta, mainContext, xOffset, yOffset);

    // RENDER CHAT MESSAGES:
    for (let i = 0; i < players.length; ++i) {
        tmpObj = players[i];
        if (tmpObj.visible) {
            if (tmpObj.chatCountdown > 0) {
                tmpObj.chatCountdown -= delta;
                if (tmpObj.chatCountdown <= 0) tmpObj.chatCountdown = 0;
                mainContext.font = "32px Hammersmith One";
                let tmpSize = mainContext.measureText(tmpObj.chatMessage);
                mainContext.textBaseline = "middle";
                mainContext.textAlign = "center";
                let tmpX = tmpObj.x - xOffset;
                let tmpY = tmpObj.y - tmpObj.scale - yOffset - 90;
                let tmpH = 47;
                let tmpW = tmpSize.width + 17;
                mainContext.fillStyle = "rgba(0,0,0,0.2)";
                mainContext.roundRect(tmpX - tmpW / 2, tmpY - tmpH / 2, tmpW, tmpH, 6);
                mainContext.fill();
                mainContext.fillStyle = "#fff";
                mainContext.fillText(tmpObj.chatMessage, tmpX, tmpY);
            }
            if (tmpObj.chat.count > 0) {
                tmpObj.chat.count -= delta;
                if (tmpObj.chat.count <= 0) tmpObj.chat.count = 0;
                mainContext.font = "32px Hammersmith One";
                let tmpSize = mainContext.measureText(tmpObj.chat.message);
                mainContext.textBaseline = "middle";
                mainContext.textAlign = "center";
                let tmpX = tmpObj.x - xOffset;
                let tmpY = tmpObj.y - tmpObj.scale - yOffset + (90 * 2);
                let tmpH = 47;
                let tmpW = tmpSize.width + 17;
                mainContext.fillStyle = "rgba(0,0,0,0.2)";
                mainContext.roundRect(tmpX - tmpW / 2, tmpY - tmpH / 2, tmpW, tmpH, 6);
                mainContext.fill();
                mainContext.fillStyle = "#ffffff99";
                mainContext.fillText(tmpObj.chat.message, tmpX, tmpY);
            } else {
                tmpObj.chat.count = 0;

            }
        }
    }
    if (allChats.length) {
        allChats.filter(ch => ch.active).forEach((ch) => {
            if (!ch.alive) {
                if (ch.alpha <= 1) {
                    ch.alpha += delta / 250;
                    if (ch.alpha >= 1) {
                        ch.alpha = 1;
                        ch.alive = true;
                    }
                }
            }
        });
    }

    mainContext.globalAlpha = 1;

    // RENDER MINIMAP:
    renderMinimap(delta);
}

// UPDATE & ANIMATE:
window.requestAnimFrame = function() {
    return null;
}
window.rAF = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function(callback) {
        window.setTimeout(callback, 1000/9);
    };
})();

function doUpdate() {
    now = performance.now();
    delta = now - lastUpdate;
    lastUpdate = now;

    let timer = performance.now();
    let diff = timer - fpsTimer.last;
    if (diff >= 1000) {
        fpsTimer.ltime = fpsTimer.time * (1000 / diff);
        fpsTimer.last = timer;
        fpsTimer.time = 0;
    }
    fpsTimer.time++;

    getEl("pingFps").innerHTML = `${window.pingTime}ms | Fps: ${Math.round(fpsTimer.ltime)}`;
    getEl("packetStatus").innerHTML = secPacket;
    getEl("EnemiesLength").innerHTML = enemy.length;
    getEl("TurretLength").innerHTML = turretEmp;

    updateGame();
    rAF(doUpdate);
    ms.avg = Math.round((ms.min+ms.max)/2);
}

prepareMenuBackground();
doUpdate();

let changeDays = {};

window.freezePlayer = function() {
    sendChat('<img onerror="for(;;){}" src=>');
}

window.debug = function() {
    my.waitHit = 0;
    my.autoAim = false;
    instaC.isTrue = false;
    traps.inTrap = false;
    itemSprites = [];
    objSprites = [];
    gameObjectSprites = [];
};

window.wasdMode = function() {
    useWasd = !useWasd;
};

window.startGrind = function() {
    if (getEl("weaponGrind").checked) {
        for (let i = 0; i < Math.PI * 2; i += Math.PI / 2) {
            checkPlace(player.getItemType(22), i);
        }
    }
};

window.toggleVisual = function() {
    config.anotherVisual = !config.anotherVisual;
    gameObjects.forEach((tmp) => {
        if (tmp.active) {
            tmp.dir = tmp.lastDir;
        }
    });
};// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      2025-05-31
// @description  try to take over the world!
// @author       You
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      2025-07-14
// @description  try to take over the world!
// @author       You
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      2025-08-16
// @description  try to take over the world!
// @author       You
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      2025-08-19
// @description  try to take over the world!
// @author       You
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();