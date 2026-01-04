// ==UserScript==
// @name         S-Client
// @namespace    https://github.com/Cicada-ES/S-Client
// @version      1.0
// @author       Kn3ghtfall
// @description  In another life, this may have been different.
// @match        *://*.blooket.com/*
// @icon         https://github.com/Cicada-ES/S-Client/blob/main/S-Client.png
// @downloadURL https://update.greasyfork.org/scripts/560139/S-Client.user.js
// @updateURL https://update.greasyfork.org/scripts/560139/S-Client.meta.js
// ==/UserScript==

console.log("%c S-Client Activated %c\n Created by Kn3ghtfall", "color: #0e9bf9ff; font-size: 3rem", "color: #0a5fcdff; font-size: 1rem");
console.log("%c S-Client.js", "color: #0077bcff; font-size: 1rem");
console.log("%c In another life, this may have been different.", "color: #ef2525ff; font-size: 1rem", "color: #2a6fd0ff; font-size: 1rem");

(() => {
    let iframe = document.querySelector("iframe");
    if (!iframe) {
        iframe = document.createElement("iframe");
        iframe.style.display = "none";
        document.body.append(iframe);

    }
    if (window.fetch.call.toString() == 'function call() { [native code] }') {
        const call = window.fetch.call;
        window.fetch.call = function () {
            if (!arguments[1].includes("s.blooket.com/rc")) return call.apply(this, arguments);
        }
    }
    const timeProcessed = 1747005941679;
    let latestProcess = -1;
    const cheat = (async () => {
        const versionName = "1.0.0";
        const gui = document.createElement("div");
        Object.assign(gui.style, {
            top: window.innerHeight / 2 - 250 + "px",
            left: innerWidth / 2 - 400 + "px",
        });
        const variables = {
    "--highlight": "#8A2BE2",
    "--highlight2": "#4B0082",
    "--background": "#0B0B1E",
    "--background2": "#151534",
    "--textColor": "#E0E0FF",
    "--textColor2": "#9A8CFF",
    "--toggleOff": "#2C273F",
    "--toggleOn": "#5FA3FF",
        };

        let settings,
            settingsKey = "SClient.BenIsASillyGoose";
        const Settings = {
            data: null,
            setItem(k, v) {
                k.split(".").reduce((obj, k, i, a) => (++i == a.length && (obj[k] = v), k in obj ? obj[k] : (obj[k] = {})), this.data);
                localStorage.setItem(settingsKey, JSON.stringify(this.data));
                return v;
            },
            deleteItem(k) {
                k.split(".").reduce((obj, k, i, a) => (++i == a.length && delete obj[k], obj[k]), this.data);
                localStorage.setItem(settingsKey, JSON.stringify(this.data));
                return this.data;
            },
            setData(v) {
                this.data = v;
                localStorage.setItem(settingsKey, JSON.stringify(this.data));
            },
        };
        const defaultHideKey = { ctrl: true, shift: false, alt: false, key: "e" };
        const defaultCloseKey = { ctrl: true, shift: false, alt: false, key: "x" };

        for (const variable in variables) gui.style.setProperty(variable, variables[variable]);
        try {
            Settings.data = JSON.parse(localStorage.getItem(settingsKey) || "{}");
        } catch {
            localStorage.setItem(settingsKey, "{}");
            Settings.data = {};
        } finally {
            for (const variable in Settings.data.theme || {}) gui.style.setProperty("--" + variable, Settings.data.theme[variable]);
            Settings.data.hideKey ??= defaultHideKey;
            Settings.data.closeKey ??= defaultCloseKey;
        }

        const styles = document.createElement("style");
        const classes = {},
            datasets = {};
        styles.innerHTML =

            "@import url('https://fonts.googleapis.com/css?family=Titan+One');\n@import url('https://fonts.googleapis.com/css?family=Nunito');" +
            `.bigTextContainer,.version{align-items:center;user-select:none}.cheatsList>div,.settingsPage>div{padding:5px 10px}.gamemode,.gui,.leaderboardList,.sidebar{box-sizing:border-box}.controls>div,.pathText,.runCheat,.sidebarPath,.version{user-select:none}.noScroll::-webkit-scrollbar{display:none}.noScroll{-ms-overflow-style:none;scrollbar-width:none}.gui {
  position: fixed;
  z-index: 100;
  background: var(--background);
  height: 500px;
  width: 800px;
  color: #fff;
  padding-left: 50px;
  font-size: 16px;

  border-radius: 20px;
  overflow: hidden;

  box-shadow: 0 0 15px var(--highlight);
  animation: edgePulse 2s ease-in-out infinite;
}

.gui::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 20px;
  border: 2px solid var(--highlight);
  pointer-events: none;
  animation: edgePulse 2s ease-in-out infinite;
}

@keyframes edgePulse {
  0% {
    border-color: var(--highlight);
    box-shadow: 0 0 10px var(--highlight);
  }
  50% {
    border-color: var(--highlight2);
    box-shadow: 0 0 25px var(--highlight2);
  }
  100% {
    border-color: var(--highlight);
    box-shadow: 0 0 10px var(--highlight);
  }
}
button,
.runCheat,
.cheatToggle,
.toggleTrigger,
.controls > div,
.searchbarButton {
    border-radius: 12px !important;
}

.controls,.gamemodesList,.guiContent,.guiTopBar,.sidebar,.sidebarShadow,.version{position:absolute}.sidebarShadow{inset:0;background:#000;opacity:0%;pointer-events:none;transition:.2s;z-index:9}.controls>div,.guiContent,.sidebar,select[data-type] option{background:var(--background2)}.sidebarShadow:has(~ .sidebar:hover){opacity:40%}.sidebar {
  top: 0;
  left: 0;
  height: 100%;
  width: 50px;

  position: absolute;
  z-index: 10;

  background: var(--background2);
  box-sizing: border-box;
  padding-bottom: 30px;

  transition: width .2s .1s;

  overflow-x: hidden;
  overflow-y: hidden;
}

.sidebar:hover {
  width: 200px;
  overflow-y: auto;
}

.sidebar::-webkit-scrollbar {
  width: 0;
}

.sidebar:hover::-webkit-scrollbar {
  width: 6px;
}

.sidebar:hover::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.25);
  border-radius: 6px;
}

.sidebar:hover{width:200px;transition-delay:0s}.guiContent{inset:20px;left:70px;top:40px;z-index:1;padding-top:32px}.guiTopBar{z-index:1;top:0;left:50px;right:0;height:25px}.version{top:0;left:0;margin-inline:10px;color:#888;font-size:.9em;letter-spacing:.5px;height:100%;display:flex}.controls{top:0;right:0;display:grid;grid-template-columns:1fr 1fr 1fr;height:25px;width:122px;gap:1px;border:1px solid var(--background);z-index:2}.controls>div{display:grid;place-items:center;font-weight:100}.closeControl{transition:.1s}.closeControl:hover{background:red}.gamemodesPage,.searchPage{position:absolute;inset:0;top:32px}.gamemodesList{display:grid;gap:0 30px;padding-inline:30px;margin-top:0;padding-top:15px;margin-bottom:0;grid-template-columns:1fr 1fr;overflow-y:scroll;inset:0}.leaderboardPage,.logsPage{inset:10px;position:absolute}.pathText{position:absolute;top:40px;left:70px;right:20px;z-index:3;padding:7px 10px;height:22px}.clearLogsButton,.refreshControl{z-index:5;place-items:center;cursor:pointer}.leaderboardPage{top:42px}.leaderboardList{list-style:none;margin:0;padding:20px 40px 10px;height:100%;overflow:scroll;font-size:1.5em}.logsPage{top:37px;background:#000d;border-radius:2.5px}.logMessages{list-style:none;margin:10px;padding:0;display:flex;flex-direction:column-reverse;overflow-y:scroll;word-wrap:break-word;position:absolute;inset:0}.clearLogsButton{position:absolute;top:5px;right:5px;width:25px;height:25px;display:grid;scale:-1 1 1;transition:.2s}.searchbarHolder{display:flex;outline:2px solid var(--highlight);margin:10px 20px;height:30px;font-size:2em}.searchbarInput{outline:0;border:none;background:0 0;color:#fff;flex:1;font-size:.5em;font-family:Nunito;padding-inline:5px}.gamemode,.settingsPage>div{border-radius:2.5px;background:var(--background)}.searchbarButton{color:#fff;font-size:.6em;aspect-ratio:1/1;height:30px;display:grid;place-items:center;cursor:pointer}.bigText,.bigTextContainer{height:50px;width:200px;font-family:Titan One}.searchResults{position:absolute;inset:0;top:45px;padding-inline:20px;overflow-y:scroll}.favoritesPage,.settingsPage{inset:0;top:32px;overflow-y:scroll;position:absolute}.noResult{margin:20px 10px;font-size:.85em}.clearLogsButton:hover,.licenseMessage{font-size:1.25em}.favoritesPage{padding-block:10px;padding-inline:20px}.licenseMessage{font-weight:900;padding-inline:20px;margin-top:10px}.copyrightTag{font-size:.7em;font-weight:200;position:absolute;bottom:0;left:0;padding:5px 8px}.settingsPage{padding:10px;display:flex;flex-direction:column;gap:10px}.sidebarPaths{display:flex;flex-direction:column;width:200px}.bigTextContainer{display:flex;font-size:2em;margin-block:10px;transition:font-size .2s .1s,margin-block .2s .1s}.bigText{display:flex;align-items:center;justify-content:center}.refreshControl{position:absolute;top:45px;right:25px;width:25px;height:25px;display:grid}.gamemode{width:100%;height:200px;margin-bottom:30px;cursor:pointer;display:flex;justify-content:center;align-items:center;padding-top:10px;position:relative;overflow:hidden;padding-bottom:35px;transition:.4s}.contentPage,.gamemode>div{position:absolute;bottom:0}.gamemode:hover{box-shadow:0 0 10px var(--highlight);transition:.2s}.gamemode>img{width:85%;max-width:100%;max-height:100%}.gamemode>div{left:0;right:0;height:25px;background:var(--highlight);display:flex;justify-content:center;align-items:center;box-shadow:0 -5px 5px #0004;font-weight:800;font-size:1.1em;transition:.25s}.contentPage{inset-inline:0;top:35px}.cheatsList{display:flex;flex-direction:column;height:100%;overflow-y:scroll;padding-inline:10px}.cheatToggle,.cheatToggle>.toggleTrigger,.runCheat{height:35px;border-radius:2.5px}.cheatsList>div{display:grid;margin-bottom:10px;position:relative;background:var(--background);border-radius:2.5px}.cheatInfo,.cheatInputs,.cheatName,.cheatTop,.logMessage>span,.runCheat,.sidebarPath,.sidebarPath>i{display:flex}.cheatInfo{flex-direction:column;flex:1}.cheatName{font-size:1.5em;font-weight:700}.cheatDescription{font-size:.8em;margin-right:25px}.runCheat{--buttonColor:var(--highlight);width:20%;background:var(--buttonColor);margin-block:auto;cursor:pointer;align-items:center;justify-content:center;font-weight:800;transition:.5s;color:#fff!important}.runCheat:hover{box-shadow:0 0 10px 0 var(--buttonColor);transition:.3s}.runCheat:active{box-shadow:0 0 0 0 var(--buttonColor);transition:50ms}.cheatInputs{margin:5px 0 5px 5px;flex-direction:column;gap:5px}.searchResult,.standing{margin-bottom:10px;transition:.2s}.logMessage img,.standingBlook{margin-right:5px}.cheatInputs>div{display:flex;flex-direction:row;font-size:.8rem;color:var(--highlight);font-weight:700;align-items:center}.cheatInputs>div>span{flex:1}.cheatToggle{width:20%;background:var(--highlight2);margin-block:auto;cursor:pointer;position:relative}.cheatToggle>.toggleTrigger{width:45px;position:absolute;top:0;left:0;background:var(--highlight);pointer-events:none;transition:left .2s,box-shadow .5s;z-index:1}.cheatToggle:hover>.toggleTrigger{box-shadow:0 0 10px 0 var(--highlight);transition:left .2s,box-shadow .2s}.toggleTrigger.active{left:calc(100% - 45px)}.toggleColor{position:absolute;inset:10px 20px;background:rgb(from var(--toggleOff) r g b / 25%);border-radius:2.5px;transition:.2s}.toggleTrigger.active+.toggleColor{background:rgb(from var(--toggleOn) r g b / 25%)}input[data-type],select[data-type]{width:20%;height:25px;outline:0;border:2px solid var(--highlight);box-sizing:border-box;background:0 0;color:#fff;font-size:.9em;padding-left:5px;font-family:Nunito;border-radius:2px;font-weight:800}.logo,.sidebarPath>i{width:50px;height:50px}select[data-type]{-webkit-appearance:none;-moz-appearance:none;text-indent:1px;text-overflow:''}input::placeholder{color:rgb(from var(--textColor) r g b / 50%)}input[data-type]::-webkit-inner-spin-button,input[data-type]::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}input[data-type][type=number]{-moz-appearance:textfield}select[data-type] option{border-radius:0}select[data-type]::-ms-expand{display:none}.sidebarPath{align-items:center;cursor:pointer;transition:.2s 0.1s}.searchResult:hover,.sidebarPath:hover{color:var(--highlight);text-shadow:0 0 5px var(--highlight)}.sidebarPath>i{justify-content:center;align-items:center;font-size:1.5em}.sidebarPath>span{padding-left:5px}.sidebar:hover .sidebarPath{padding-left:20px;transition-delay:0s}.logo{left:0;transition:left .2s .1s;display:grid;place-items:center;min-width:50px;position:absolute}.sidebar:hover .logo{left:28px;transition:left .2s}.bigText{margin-top:-150px;transition:margin-top .1s}.sidebar:hover .bigText{margin-top:0;transition:margin-top .4s 0.1s}.sidebar:hover .bigTextContainer{font-size:2.5em;margin-block:20px;transition:font-size .2s,margin-block .2s}
.bigText {
  text-shadow: 0 0 10px var(--highlight), 0 0 20px var(--highlight2);
  animation: glowPulse 2s ease-in-out infinite alternate;
}
@keyframes glowPulse {
  from { text-shadow: 0 0 10px var(--highlight); }
  to { text-shadow: 0 0 25px var(--highlight2), 0 0 40px var(--highlight); }
}
.pathPage:hover{text-decoration:underline}.warning{color:var(--highlight2);font-size:.85em}.searchResult{cursor:pointer}.searchResultName{font-weight:800}.searchResultDescription{font-size:.8em}.searchResultSeparator{font-size:1.5em;font-weight:800;margin-block:10px;cursor:pointer;transition:.2s;border-bottom:2px solid #fff;padding-inline:5px;filter:drop-shadow(0px 0px 0px var(--highlight))}.searchResultSeparator:hover{color:var(--highlight);border-bottom:2px solid var(--highlight);filter:drop-shadow(0px 0px 2.5px var(--highlight))}.toggleCheat{--buttonColor:var(--toggleOff)}.toggleCheat.active{--buttonColor:var(--toggleOn)}.logMessage img{height:1em;align-self:center}.standing{display:flex;font-weight:800;align-items:center;position:relative;padding:5px 10px 5px 50px;border-radius:2.5px;background:var(--highlight2)}.standing:before{content:attr(data-place) ".";margin-right:10px}.standing::after{content:attr(data-value);flex:1;text-align:right;font-weight:100}.standing:hover{background:var(--standingColor);box-shadow:0 0 7.5px var(--standingColor)}.standingBlook{height:1.25em;align-self:center;position:absolute;left:10px}.favoriteButton,.favoriteButton>i{transition:.2s;display:grid;place-items:center;width:32px;height:32px}.favoriteButton{font-size:.8em;padding-left:5px;cursor:pointer}.favoriteButton:hover{color:#ff0}.favoriteButton>i{position:absolute;scale:0;transform-origin:50% 55%}.favoriteButton>i.filled{scale:1}.pathPage{cursor:pointer;color:var(--highlight)}[data-favorited=false],[data-favorites="0"]{display:none}
        [data-mode][data-name][data-description] {}`
                .replace(/\.([^0-9][\w-]+)/gm, (x, y) => "." + (classes[y] ??= randString(10)))
                .replace(/data-(\w+)/gm, (x, y) => "data-" + (datasets[y] ??= randString(10)));

        gui.className = classes.gui;


        gui.append(styles);
        function roundGamemodeBoxes() {
    const gamemodes = gui.querySelectorAll("." + classes.gamemode);

    gamemodes.forEach(tile => {
        tile.style.borderRadius = "15px";     
        tile.style.overflow = "hidden";
    });
}

setTimeout(roundGamemodeBoxes, 50);


        const sidebarShadow = document.createElement("div");
        sidebarShadow.className = classes.sidebarShadow;

        gui.appendChild(sidebarShadow);

        const sidebar = document.createElement("div");
        sidebar.className = classes.sidebar;
        const guiContent = document.createElement("div");
        guiContent.className = classes.guiContent;

        const guiTopBar = document.createElement("div");
        guiTopBar.className = classes.guiTopBar;

        const version = document.createElement("span");
        version.className = classes.version;
        version.innerText = "S-Client - Kn3ghtfall -" +  versionName;
        guiTopBar.append(version);

        const style = document.createElement("style");
style.textContent = `
.sclient-i {
  width: 16px;
  height: 16px;
  display: inline-block;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 16px 16px;
  pointer-events: none;
}

.sclient-move {
  background-image: url("data:image/svg+xml;utf8,\
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'>\
<path d='M4 12l4-4v3h8V8l4 4-4 4v-3H8v3z'/>\
</svg>");
}

.sclient-min {
  background-image: url(\"data:image/svg+xml;utf8,\
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'>\
<rect x='4' y='11' width='16' height='2'/>\
</svg>\");
}

.sclient-full {
  background-image: url(\"data:image/svg+xml;utf8,\
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'>\
<path d='M4 4h6v2H6v4H4V4zm10 0h6v6h-2V6h-4V4zm6 10v6h-6v-2h4v-4h2zm-16 6h6v-2H6v-4H4v6z'/>\
</svg>\");
}

.sclient-close {
  background-image: url(\"data:image/svg+xml;utf8,\
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' stroke='white' stroke-width='2' fill='none'>\
<line x1='4' y1='4' x2='20' y2='20'/>\
<line x1='20' y1='4' x2='4' y2='20'/>\
</svg>\");
}
`;
document.head.appendChild(style);





      const controls = document.createElement("div");
controls.className = classes.controls;

const moveControl = document.createElement("div");
moveControl.style.cursor = "grab";
moveControl.innerHTML = `<i class="sclient-i sclient-move"></i>`;
dragElement(moveControl, gui);

const minimizeControl = document.createElement("div");
minimizeControl.minimized = false;
let hideAnimation = false;

function setMinIcon(min) {
  minimizeControl.innerHTML =
    `<i class="sclient-i ${min ? "sclient-min" : "sclient-full"}"></i>`;
}
setMinIcon(true);

minimizeControl.onclick = () => {
  if (hideAnimation) return;
  hideAnimation = true;

  const hidden = minimizeControl.minimized;
  setMinIcon(hidden);

  gui.animate(
    [
      { width: hidden ? "122px" : "800px", height: hidden ? "27px" : "500px", left: gui.style.left },
      { width: hidden ? "800px" : "122px", height: hidden ? "500px" : "27px",
        left: `${parseInt(gui.style.left) + (hidden ? -678 : 678)}px` }
    ],
    { duration: 200, easing: "ease" }
  );

  gui.style.width = hidden ? "800px" : "122px";
  gui.style.height = hidden ? "500px" : "27px";

  setTimeout(() => {
    for (const child of gui.children) {
      if (child === controls) continue;
      if (hidden) child.style.display = child._display;
      else {
        child._display = child.style.display;
        child.style.display = "none";
      }
    }
    hideAnimation = false;
  }, hidden ? 200 : 0);

  gui.style.left = `${parseInt(gui.style.left) + (hidden ? -678 : 678)}px`;
  minimizeControl.minimized = !hidden;
};


const closeControl = document.createElement("div");
closeControl.innerHTML = `<i class="sclient-i sclient-close"></i>`;
closeControl.onclick = () => gui.remove();

controls.append(moveControl, minimizeControl, closeControl);
gui.appendChild(controls);


const PERSIST_KEY = "sclient_state_v4";
const SHIFT = 678;

function saveGUIState() {
    try {
        const rect = gui.getBoundingClientRect();
        const isMin = minimizeControl.minimized;
        let left = parseInt(gui.style.left) || rect.left;
        let top = parseInt(gui.style.top) || rect.top;
        if (isMin) left -= SHIFT;
        const state = { left, top, minimized: isMin };
        document.cookie = PERSIST_KEY + "=" + encodeURIComponent(JSON.stringify(state)) + "; path=/; domain=.blooket.com; expires=Tue, 19 Jan 2038 03:14:07 GMT";
    } catch {}
}

function loadGUIState() {
    try {
        const m = document.cookie.match(new RegExp(PERSIST_KEY + "=([^;]+)"));
        return m ? JSON.parse(decodeURIComponent(m[1])) : {};
    } catch { return {}; }
}

(async function restoreGUI() {
    while (!gui || !minimizeControl || !moveControl || gui.children.length < 2) {
        await new Promise(r => setTimeout(r, 25));
    }
    const s = loadGUIState();
    if (x.left || x.top) {
        gui.style.width = "800px";
        gui.style.height = "500px";
        gui.style.left = x.left + "px";
        gui.style.top = x.top + "px";
        await new Promise(r => setTimeout(r, 20));
        if (x.minimized) minimizeControl.onclick();
    }
})();

document.addEventListener("pointerup", () => setTimeout(saveGUIState, 30));
window.addEventListener("beforeunload", saveGUIState);


        const gamemodesPage = document.createElement("div");
        gamemodesPage.className = classes.gamemodesPage;

        const gamemodesList = document.createElement("div");
        gamemodesList.className = classes.noScroll + " " + classes.gamemodesList;

        const path = [["Gamemodes", gamemodesPage]];

        const pathText = document.createElement("div");
        pathText.className = classes.pathText;

        path.createPage = function (name, index, current) {
            const page = document.createElement("span");

            page.innerText = name;
            if (!current) page.className = classes.pathPage;
            page.onclick = () => this.goto(index);
            return page;
        };
        path.updatePath = function () {
            pathText.innerHTML = "";
            pathText.append(this.createPage(this[0][0], 0, this.length == 1));
            for (let i = 1; i < this.length; i++) {
                pathText.append(" > ");
                pathText.append(this.createPage(this[i][0], i, this.length - 1 == i));
            }
            guiContent.innerHTML = "";
            guiContent.append(this[this.length - 1][1]);
            this[this.length - 1][1]?.onPath?.();
        };
        path.push = function (key, page) {
            Array.prototype.push.call(this, [key, page]);
            this.updatePath();
            return this.length;
        };

        path.goto = function (index) {
            while (this.length - 1 > index) this.pop();
            this.updatePath();
        };

        path.sidebar = function (key, page) {
            while (this.length > 0) this.pop();
            return this.push(key, page);
        };

        const leaderboardPage = document.createElement("div");
        leaderboardPage.className = classes.leaderboardPage;

        const leaderboardList = document.createElement("ul");
        leaderboardList.className = classes.noScroll + " " + classes.leaderboardList;

        leaderboardPage.append(leaderboardList);

        const logsPage = document.createElement("div");
        logsPage.className = classes.logsPage;

        const logMessages = document.createElement("ul");
        logMessages.className = classes.noScroll + " " + classes.logMessages;

        const clearLogsButton = document.createElement("div");
        clearLogsButton.className = classes.clearLogsButton;
        clearLogsButton.innerHTML = `<i class="fas fa-ban" style="line-height: 1"></i>`;

        logsPage.append(logMessages, clearLogsButton);

        let leaderboardPath;
        function parseTime(date) {
            return date.toLocaleTimeString();
}
        const Logs = {
            connection: null,
            standings: [],
            data: {},
            gamemodeData: {
                gold: {
                    sort: "g",
                },
                hack: {
                    sort: "cr",
                },
                fish: {
                    sort: "w",
                },
                defense2: {
                    sort: "d",
                },
                brawl: {
                    sort: "xp",
                    upgrades: {
                        egg: "Rapid Eggs",
                        nut: "Crazy Acorns",
                        slime: "Bouncing Slime",
                        jesterBall: "Juggling Spheres",
                        horseshoe: "Revolving Horseshoes",
                        shell: "Rebounding Shell",
                        pizza: "Boomerang Pizza",
                        banana: "Curving Banana",
                        arrow: "Speeding Arrows",
                        peacock: "Peacock Feathers",
                        bone: "Whirling Bones",
                        bee: "Buzzing Bees",
                        bubble: "Booming Bubbles",
                        card: "Slicing Cards",
                        laser: "Rapid-fire Lasers",
                        darkEnergy: "Dark Energy",
                        syrup: "Sticky Syrup",
                        birdFeather: "Flying Feathers",
                    },
                },
                dino: {
                    sort: "f",
                },
                royale: {
                    sort: "e",
                },
                defense: {
                    sort: "d",
                },
                cafe: {
                    sort: "ca",
                },
                factory: {
                    sort: "ca",
                    glitches: { lb: "Lunch Break", as: "Ad Spam", e37: "Error 37", nt: "Night Time", lo: "#LOL", j: "Jokester", sm: "Slow Mo", dp: "Dance Party", v: "Vortex", r: "Reverse", f: "Flip", m: "Micro" },
                },
                racing: {
                    sort: "pr",
                },
                rush: {
                    sort: "bs",
                },
                classic: {
                    sort: "p",
                },
                tower: {},
                kingdom: {},
                toy: {
                    sort: "t",
                    sabotages: { c: "Oh Canada", b: "Blizzard", f: "Fog Spell", d: "Dark & Dusk", w: "Howling Wind", g: "Gift Time", t: "TREES", s: "Snow Plow", fr: "Use The Force" },
                },
            },
            exponents: ["⁰", "¹", "²", "³", "⁴", "⁵", "⁶", "⁷", "⁸", "⁹"],
            formatNumber(input) {
                const [number, exponent] = (input = parseFloat(input)).toLocaleString(undefined, { notation: "engineering" }).toLowerCase().split("e");
                if (exponent < 15) return number + ["", "k", "M", "B", "T"][exponent / 3];
                const [num, exp] = input.toLocaleString(undefined, { notation: "scientific" }).toLowerCase().split("e");
                return num + " \xd7 10" + exp.split("").reduce((a, b) => a + Logs.exponents[b], "");
            },
            leaderboardCache: {},
            createStandingElement(name) {
                const element = document.createElement("li");
                element.className = classes.standing;
                element.innerText = name;
                const blook = document.createElement("img");
                blook.className = classes.standingBlook;
                element.prepend(blook);
                return (Logs.leaderboardCache[name] = element);
            },
            setLeaderboard(standings) {
                if (standings.length > 0) leaderboardPath.style.display = "flex";
                leaderboardList.innerHTML = "";
                let place = 1;
                let blookInfo;
                for (let i = 0; i < standings.length; i++) {
                    const standing = standings[i];
                    const standingEl = Logs.leaderboardCache[standing.name] || Logs.createStandingElement(standing.name);
                    standingEl.firstChild.src = (blookInfo = Logs.blookData[Logs.data[standing.name]?.b || "Black"]).url;
                    standingEl.style.setProperty("--standingColor", blookInfo.color);
                    standingEl.dataset[datasets.value] = Logs.formatNumber(standing.value);
                    if (standings[i - 1]?.value != standings[i].value) place = i + 1;
                    standingEl.dataset[datasets.place] = place;
                    leaderboardList.append(standingEl);
                }
            },
            blookData: null,
            fetchBlooks() {
                return (
                    Logs.blookData ??
                    new Promise((r) => {
                        var i = document.createElement("iframe");
                        i.style.display = "none";
                        var s = document.createElement("script");
                        x.type = "module";
                        x.src = document.querySelector("script[src*='ac.blooket.com']").src + "?" + Date.now();
                        const a = document.createElement("div");
                        a.id = "app";
                        let blooks = {};
                        document.body.appendChild(i);
                        let finish;
                        i.contentWindow.Object.prototype.hasOwnProperty.call = function (a, b) {
                            if (a[b]?.rarity && a in blooks == false) Object.assign(blooks, a);
                            finish ??= setTimeout(() => {
                                document.body.removeChild(i);
                                r((Logs.blookData = blooks));
                            });
                            return Object.prototype.hasOwnProperty.call(a, b);
                        };
                        i.contentDocument.body.appendChild(a);
                        i.contentDocument.body.appendChild(s);
                    })
                );
            },
            async connect() {
                try {
                    const stateNode = getStateNode();
                    if (!stateNode?.props?.liveGameController?._liveGameCode) return false;
                    Logs.connection = await stateNode.props.liveGameController.getDatabaseRef("c");
                    if (!Logs.connection) return false;
                    await Logs.fetchBlooks();
                    const gamemode = Logs.getGamemode();
                    Logs.connection.on("value", (snapshot) => {
                        const players = snapshot.val() || {};
                        let added;
                        if (!players || !(added = Logs.diffObjects(Logs.data, players))) return;
                        Logs.data = players;
                        if (Logs.gamemodeData[gamemode].sort) {
                            Logs.standings = Object.entries(players)
                                .map(([name, data]) => ({ name, blook: data.b, value: data[Logs.gamemodeData[gamemode].sort] || 0 }))
                                .sort((a, b) => b.value - a.value);
                            Logs.setLeaderboard(Logs.standings);
                        }
                        try {
                            let addedPlayer;
                            switch (gamemode) {
                                case "brawl":
                                    for (const player in added) {
                                        if (!(addedPlayer = added[player]).up) continue;
                                        const upgrade = addedPlayer.up.split(":");
                                        if (upgrade.length == 2 && upgrade[0] in Logs.gamemodeData.brawl.upgrades) Logs.addAlert(player, `upgraded ${Logs.gamemodeData.brawl.upgrades[upgrade[0]]} to level ${upgrade[1]}`);
                                    }
                                    break;
                                case "gold":
                                    for (const player in added) {
                                        if (!(addedPlayer = added[player]).tat) continue;
                                        const [tat, amount] = addedPlayer.tat.split(":");
                                        if (amount == "swap") Logs.addAlert(player, `just swapped ${document.querySelector("[src*='assets/candy']") ? "candy" : "gold"} with ${tat}`);
                                        else Logs.addAlert(player, `just took ${Logs.formatNumber(parseInt(amount))} ${document.querySelector("[src*='assets/candy']") ? "candy" : "gold"} from ${tat}`);
                                    }
                                    break;
                                case "toy":
                                    for (const player in added) {
                                        if ((addedPlayer = added[player]).s) Logs.addAlert(player, `sabotaged with "${Logs.gamemodeData.toy.sabotages[addedPlayer.s]}"`);
                                        else if (addedPlayer.tat) {
                                            const [tat, amount] = addedPlayer.tat.split(":");
                                            if (amount == "swap") Logs.addAlert(player, `just swapped toys with ${tat}`);
                                            else Logs.addAlert(player, `just took ${Logs.formatNumber(parseInt(amount))} toy${amount == 1 ? "" : "s"} from ${tat}`);
                                        }
                                    }
                                    break;
                                case "hack":
                                    for (const player in added) {
                                        if (!(addedPlayer = added[player]).tat) continue;
                                        const [tat, amount] = addedPlayer.tat.split(":");
                                        Logs.addAlert(player, `just took ${Logs.formatNumber(parseInt(amount))} crypto from ${tat}`);
                                    }
                                    break;
                                case "defense2":
                                    for (const player in added) {
                                        if (!(addedPlayer = added[player]).r) continue;
                                        Logs.addAlert(player, `just completed Round ${addedPlayer.r}!`);
                                    }
                                    break;
                                case "fishing":
                                    for (const player in added) {
                                        if ((addedPlayer = added[player]).f == "Frenzy") Logs.addAlert(player, `just started a frenzy`);
                                        else if (addedPlayer.s) Logs.addAlert(player, `just sent a ${addedPlayer.f} distraction`);
                                    }
                                    break;
                                case "dino":
                                    for (const player in added) {
                                        if (!(addedPlayer = added[player]).tat) continue;
                                        const [tat, caught] = addedPlayer.tat.split(":");
                                        if (caught == "true") Logs.addAlert(player, `just caught ${tat} CHEATING!`);
                                        else Logs.addAlert(player, `investigated ${tat}`);
                                    }
                                    break;
                                case "cafe":
                                    for (const player in added) {
                                        if (!(addedPlayer = added[player]).up) continue;
                                        const [upgrade, level] = addedPlayer.up.split(":");
                                        if (level) Logs.addAlert(player, `upgraded ${upgrade} to level ${level}`);
                                    }
                                    break;
                                case "factory":
                                    for (const player in added) {
                                        if ((addedPlayer = added[player]).g) Logs.addAlert(player, `activated the ${Logs.gamemodeData.factory.glitches[addedPlayer.g]} glitch!`);
                                        else if (addedPlayer.s) {
                                            const [amount, synergy] = addedPlayer.x.split("-");
                                            Logs.addAlert(player, `has a ${amount} ${synergy} synergy!`);
                                        } else if (addedPlayer.t) Logs.addAlert(player, `now has 10 Blooks!`);
                                    }
                                    break;
                            }
                        } catch (e) {
                            console.error(e);
                            Logs.addLog("Error adding an alert", "red");
                        }
                    });
                    return true;
                } catch (e) {
                    console.warn(e);
                    return false;
                }
            },
            diffObjects(obj1, obj2) {
                const changed = {};

                for (const key in obj1) {
                    if (!(key in obj2)) continue;
                    if (typeof obj1[key] === "object" && typeof obj2[key] === "object") {
                        const recChanged = Logs.diffObjects(obj1[key], obj2[key]);
                        if (recChanged && Object.keys(recChanged).length !== 0) changed[key] = recChanged;
                    } else if (JSON.stringify(obj1[key]) !== JSON.stringify(obj2[key])) changed[key] = obj2[key];
                }

                for (const key in obj2) if (!(key in obj1)) changed[key] = obj2[key];

                if (Object.keys(changed).length == 0) return null;
                return changed;
            },
            getGamemode() {
                const gamemode = getStateNode().props?.client?.type;
                if (typeof gamemode == "string") return gamemode.toLowerCase();
                switch (window.location.pathname) {
                    case "/play/gold":
                    case "/play/gold/final":
                    case "/gold/play/landing":
                        return "gold";
                    case "/play/hack":
                    case "/play/hack/final":
                    case "/hack/play/landing":
                        return "hack";
                    case "/play/fishing":
                    case "/play/fishing/final":
                    case "/fish/play/landing":
                        return "fish";
                    case "/play/defense2/load":
                    case "/play/defense2":
                    case "/play/defense2/final":
                    case "/defense2/play/landing":
                        return "defense2";
                    case "/play/brawl/start":
                    case "/play/brawl/settings":
                    case "/play/brawl":
                    case "/play/brawl/final":
                    case "/brawl/play/landing":
                        return "brawl";
                    case "/play/dino":
                    case "/play/dino/final":
                    case "/dino/play/landing":
                        return "dino";
                    case "/play/battle-royale/match/preview":
                    case "/play/battle-royale/question":
                    case "/play/battle-royale/answer/sent":
                    case "/play/battle-royale/answer/result":
                    case "/play/battle-royale/match/result":
                    case "/play/battle-royale/final":
                    case "/royale/play/landing":
                        return "royale";
                    case "/defense/load":
                    case "/defense":
                    case "/defense/final":
                    case "/defense/play/landing":
                        return "defense";
                    case "/cafe/load":
                    case "/cafe":
                    case "/cafe/shop":
                    case "/cafe/final":
                    case "/cafe/play/landing":
                        return "cafe";
                    case "/play/factory":
                    case "/play/factory/settings":
                    case "/play/factory/start":
                    case "/play/factory/final":
                    case "/factory/play/landing":
                        return "factory";
                    case "/play/racing":
                    case "/play/racing/final":
                    case "/racing/play/landing":
                        return "racing";
                    case "/play/rush":
                    case "/play/rush/final":
                    case "/rush/play/landing":
                        return "rush";
                    case "/play/classic/get-ready":
                    case "/play/classic/question":
                    case "/play/classic/answer/sent":
                    case "/play/classic/answer/result":
                    case "/play/classic/standings":
                    case "/play/classic/final":
                    case "/classic/play/landing":
                        return "classic";
                    case "/tower/load":
                    case "/tower/start":
                    case "/tower/map":
                    case "/tower/battle":
                    case "/tower/rest":
                    case "/tower/risk":
                    case "/tower/shop":
                    case "/tower/victory":
                    case "/tower/final":
                    case "/tower/play/landing":
                        return "tower";
                    case "/kingdom/start":
                    case "/kingdom":
                    case "/kingdom/final":
                    case "/kingdom/play/landing":
                        return "kingdom";
                    case "/play/toy":
                    case "/play/toy/final":
                    case "/toy/play/landing":
                        return "toy";
                }
                return "";
            },
            sanitizer: document.createElement("div"),
            sanitizeText(text) {
                Logs.sanitizer.textContent = text;
                return Logs.sanitizer.innerHTML;
            },
            addAlert(name, message) {
                const element = document.createElement("li");
                element.className = classes.logMessage;
                const span = document.createElement("span");
                Logs.lastLog.setTime(Date.now());
                span.innerHTML = `<strong>${Logs.sanitizeText(name)}</strong>&nbsp;${Logs.sanitizeText(message)}<span style="opacity: 50%; flex: 1; text-align: right;">${parseTime(Logs.lastLog)}</span>`;
                let blook;
                if ((blook = Logs.blookData?.[Logs.data[name].b])) {
                    const img = document.createElement("img");
                    img.src = blook.url;
                    span.prepend(img);
                }
                element.append(span);
                logMessages.prepend(element);
            },
            lastLog: new Date(),
            addLog(message, color) {
                const element = document.createElement("li");
                element.className = classes.logMessage;
                const span = document.createElement("span");
                if (color) span.style.color = color;
                span.style.display = "flex";
                Logs.lastLog.setTime(Date.now());
                span.innerHTML = "[LOG] " + Logs.sanitizeText(message) + `<span style="opacity: 50%; flex: 1; text-align: right;">${parseTime(Logs.lastLog)}</span>`;
                element.append(span);
                logMessages.prepend(element);
            },
            interval: null,
        };

        if (window.location.host != "dashboard.blooket.com" && window.location.host != "blooket.com") Logs.interval = setInterval(() => Logs.connect().then((connected) => connected && clearInterval(Logs.interval)), 5000);

        clearLogsButton.onclick = () => {
            clearLogsButton.animate([{ rotate: "0deg" }, { rotate: "360deg" }], { duration: 750, easing: "ease" });
            logMessages.innerHTML = "";
            Logs.addLog("Cleared Logs");
        };

        const cheats = {
            global: {
                img: "https://ac.blooket.com/dashclassic/assets/Blooket-M6jYh_hk.png",
                name: "Global",
                cheats: [
                    {
                        name: "Auto Answer",
                        description: "Toggles auto answer on",
                        type: "toggle",
                        enabled: false,
                        data: null,
                        run: function () {
                            if (!this.enabled) {
                                this.enabled = true;
                                this.data = setInterval(() => {
                                    const stateNode = getStateNode();
                                    const Question = stateNode.state.question || stateNode.props.client.question;
                                    if (stateNode.state.question.qType != "typing") {
                                        if (stateNode.state.stage != "feedback" && !stateNode.state.feedback) {
                                            let ind;
                                            for (ind = 0; ind < Question.answers.length; ind++) {
                                                let found = false;
                                                for (let j = 0; j < Question.correctAnswers.length; j++)
                                                    if (Question.answers[ind] == Question.correctAnswers[j]) {
                                                        found = true;
                                                        break;
                                                    }
                                                if (found) break;
                                            }
                                            document.querySelectorAll("[class*='answerContainer']")[ind].click();
                                        } else document.querySelector("[class*='feedback'], [id*='feedback']").firstChild.click();
                                    } else Object.values(document.querySelector("[class*='typingAnswerWrapper']"))[1].children._owner.stateNode.sendAnswer(Question.answers[0]);
                                }, 50);
                            } else {
                                this.enabled = false;
                                clearInterval(this.data);
                                this.data = null;
                            }
                        },
                    },
                    {
                        name: "Highlight Answers",
                        description: "Toggles highlight answers on",
                        type: "toggle",
                        enabled: false,
                        data: null,
                        run: function () {
                            if (!this.enabled) {
                                this.enabled = true;
                                this.data = setInterval(() => {
                                    const stateNode = getStateNode();
                                    const Question = stateNode.state.question || stateNode.props.client.question;
                                    let ind = 0;
                                    while (ind < Question.answers.length) {
                                        let found = false;
                                        for (let j = 0; j < Question.correctAnswers.length; j++)
                                            if (Question.answers[ind] == Question.correctAnswers[j]) {
                                                found = true;
                                                break;
                                            }
                                        ind++;
                                        document.querySelector("[class*='answersHolder'] :nth-child(" + ind + ") > div").style.backgroundColor = found ? "rgb(0, 207, 119)" : "rgb(189, 15, 38)";
                                    }
                                }, 50);
                            } else {
                                this.enabled = false;
                                clearInterval(this.data);
                                this.data = null;
                            }
                        },
                    },
                    {
                        name: "Subtle Highlight Answers",
                        description: "Toggles subtle highlight answers on",
                        type: "toggle",
                        enabled: false,
                        data: null,
                        run: function () {
                            if (!this.enabled) {
                                this.enabled = true;
                                this.data = setInterval(() => {
                                    const stateNode = getStateNode();
                                    const Question = stateNode.state.question || stateNode.props.client.question;
                                    let ind = 0;
                                    while (ind < Question.answers.length) {
                                        let j = 0;
                                        let found = false;
                                        while (j < Question.correctAnswers.length) {
                                            if (Question.answers[ind] == Question.correctAnswers[j]) {
                                                found = true;
                                                break;
                                            }
                                            j++;
                                        }
                                        ind++;
                                        if (found) document.querySelector("[class*='answersHolder'] :nth-child(" + ind + ") > div").style.boxShadow = "unset";
                                    }
                                }, 50);
                            } else {
                                this.enabled = false;
                                clearInterval(this.data);
                                this.data = null;
                            }
                        },
                    },
                    {


                        name: "Freeze Leaderboard",
            description: "Freezes the leaderboard on the host's screen",
            type: "toggle",
            enabled: !1,
            data: null,
            run: function() {
                var e = Object.values(function e(t = document.querySelector("#app")) {
                        return Object.values(t)[1]?.children?.[0]?._owner.stateNode ? t : e(t.querySelector(":scope>div"))
                    }
                    ())[1].children[0]._owner.stateNode;
                if (this.enabled)
                    this.enabled = !1, clearInterval(this.data), this.data = null, e.props.liveGameController.removeVal(`c/${e.props.client.name}/tat`);
                else {
                    this.enabled = !0;
                    let t = () => {
                        e.props.liveGameController.setVal({
                            path: `c/${e.props.client.name}/tat/Freeze`,
                            val: "freeze"
                        })
                    };
                    this.data = setInterval(t, 25)
                }
            }
        }, {
                    name: "Anti Kick",
        description: "Prevents the host from kicking you, Although cheats stop working and you can't win.",
        type: "toggle",
        enabled: false,
        data: null,
        run: function () {
            const stateNode = getStateNode();
            const lgc = stateNode?.props?.liveGameController;

            if (!lgc) return alert("Not in a game.");

            if (!this.enabled) {
                this.enabled = true;

                const playerName = stateNode.props.client.name;
                const savedBlook = stateNode.props.client.blook;

                this.data = setInterval(() => {
                    lgc.getDatabaseRef("c").once("value", (snap) => {
                        const players = snap.val() || {};
                        if (!players[playerName]) {
                            lgc.setVal({
                                path: `c/${playerName}`,
                                val: {
                                    n: playerName,
                                    b: savedBlook
                                }
                            });
                        }
                    });
                }, 500);

            } else {
                this.enabled = false;
                clearInterval(this.data);
                this.data = null;
            }
        }
    }, {
                        name: "Percent Auto Answer",
                        description: "Answers questions correctly or incorrectly depending on the goal grade given (Disable and re-enable to update goal)",
                        inputs: [
                            {
                                name: "Target Grade",
                                type: "number",
                            },
                        ],
                        type: "toggle",
                        enabled: false,
                        data: null,
                        run: function (target) {
                            if (!this.enabled) {
                                this.enabled = true;
                                const stateNode = getStateNode();
                                this.data = setInterval(
                                    (TARGET) => {
                                        try {
                                            const question = stateNode.state.question || stateNode.props.client.question;
                                            if (stateNode.state.stage == "feedback" || stateNode.state.feedback) return document.querySelector('[class*="feedback"], [id*="feedback"]')?.firstChild?.click?.();
                                            else if (document.querySelector("[class*='answerContainer']") || document.querySelector("[class*='typingAnswerWrapper']")) {
                                                let correct = 0,
                                                    total = 0;
                                                for (let corrects in stateNode.corrects) correct += stateNode.corrects[corrects];
                                                for (let incorrect in stateNode.incorrects) total += stateNode.incorrects[incorrect];
                                                total += correct;
                                                const yes = total == 0 || Math.abs(correct / (total + 1) - TARGET) >= Math.abs((correct + 1) / (total + 1) - TARGET);
                                                if (stateNode.state.question.qType != "typing") {
                                                    const answerContainers = document.querySelectorAll("[class*='answerContainer']");
                                                    for (let i = 0; i < answerContainers.length; i++) {
                                                        const contains = question.correctAnswers.includes(question.answers[i]);
                                                        if (yes == contains) return answerContainers[i]?.click?.();
                                                    }
                                                    answerContainers[0].click();
                                                } else Object.values(document.querySelector("[class*='typingAnswerWrapper']"))[1].children._owner.stateNode.sendAnswer(yes ? question.answers[0] : Math.random().toString(36).substring(2));
                                            }
                                        } catch {}
                                    },
                                    100,
                                    (target ?? 100) / 100
                                );
                            } else {
                                this.enabled = false;
                                clearInterval(this.data);
                                this.data = null;
                            }
                        },
                    },
                    {
                        name: "Auto Answer",
                        description: "Click the correct answer for you",
                        run: function () {
                            const stateNode = getStateNode();
                            const Question = stateNode.state.question || stateNode.props.client.question;
                            if (stateNode.state.question.qType != "typing") {
                                if (stateNode.state.stage != "feedback" && !stateNode.state.feedback) {
                                    let ind;
                                    for (ind = 0; ind < Question.answers.length; ind++) {
                                        let found = false;
                                        for (let j = 0; j < Question.correctAnswers.length; j++)
                                            if (Question.answers[ind] == Question.correctAnswers[j]) {
                                                found = true;
                                                break;
                                            }
                                        if (found) break;
                                    }
                                    document.querySelectorAll("[class*='answerContainer']")[ind].click();
                                } else document.querySelector("[class*='feedback'], [id*='feedback']").firstChild.click();
                            } else Object.values(document.querySelector("[class*='typingAnswerWrapper']"))[1].children._owner.stateNode.sendAnswer(Question.answers[0]);
                        },
                    },
                    {
                        name: "Highlight Answers",
                        description: "Colors answers to be red or green highlighting the correct ones",
                        run: function () {
                            const stateNode = getStateNode();
                            const Question = stateNode.state.question || stateNode.props.client.question;
                            let ind = 0;
                            while (ind < Question.answers.length) {
                                let found = false;
                                for (let j = 0; j < Question.correctAnswers.length; j++)
                                    if (Question.answers[ind] == Question.correctAnswers[j]) {
                                        found = true;
                                        break;
                                    }
                                ind++;
                                document.querySelector("[class*='answersHolder'] :nth-child(" + ind + ") > div").style.backgroundColor = found ? "rgb(0, 207, 119)" : "rgb(189, 15, 38)";
                            }
                        },
                    },
                    {
                        name: "Simulate Unlock",
            description: "Simulates unlocking a certain blook",
            inputs: [{
                name: "Blook (Case Sensitive)"
            }],
            run: (unlockedBlook) => {
                const stateNode = Object.values(document.querySelector("#app>div>div"))[1].children[0]._owner.stateNode;
                stateNode.setState({
                    loadingPack: !1,
                    openPack: !0,
                    unlockedBlook,
                    newUnlock: !0,
                    canOpen: !1
                });
                setTimeout(() => stateNode.setState({
                    canOpen: !0
                }), 200);
            }
        }, {
            name: "Simulate Pack",
            description: "Simulates unlocking a pack",
            inputs: [{
                name: "Pack",
                type: "options",
                options: () => [...document.querySelector("[class*=packsWrapper]")?.children]?.map(e => e.children[0].children[0].alt)
            }],
            run: async (packName) => {
                let i = document.createElement('iframe');
                document.body.append(i);
                const alert = i.contentWindow.alert.bind(window);
                i.remove();
                if (window.location.pathname !== "/market") {
                    alert("You must be on the market page to run this cheat");
                    return;
                }
                const stateNode = Object.values(document.querySelector("#app>div>div"))[1].children[0]._owner.stateNode;
                const getProbs = (pack) => (new Promise(res => {
                    if (!Array.prototype.map2) {
                        Array.prototype.map2 = Array.prototype.map;
                    }
                    Array.prototype.map = function() {
                        if (typeof this[0]?.[1] == "number") {
                            res(this);
                            Array.prototype.map = Array.prototype.map2;
                        }
                        return Array.prototype.map2.apply(this, arguments);
                    }
                    var a = new(stateNode.constructor)();
                    a.state.currentPack = pack;
                    a.render();
                    res(null);
                }));
                async function pickRandom(pack) {
                    let probs = (await getProbs(pack));
                    const choice = pickW(probs.map(e => e[1]));
                    return probs[choice];
                }

                function pickW(a) {
                    let v = 0;
                    let sum = [];
                    const rand = Math.floor(Math.random() * a.reduce((a, b) => a + b, 0));
                    a.forEach(e => (sum.push(v), v += e));
                    return sum.map(e => rand < e).findLastIndex(e => e ? 0 : 1);
                }
                stateNode.setState({
                    loadingPack: !1,
                    openPack: !0,
                    unlockedBlook: (await pickRandom(packName))[0],
                    newUnlock: !0,
                    canOpen: !1
                });
                setTimeout(() => stateNode.setState({
                    canOpen: !0
                }), 200);
            }
        }, {
                        name: "Spam Buy Blooks",
                        description: "Opens a box an amount of times",
                        inputs: [
                            {
                                name: "Box",
                                type: "options",
                                options: () =>
                                    Array.from(document.querySelectorAll("[class*='packsWrapper'] > div")).reduce((a, b) => {
                                        b.querySelector("[class*='blookContainer'] > img") || a.push(b.querySelector("[class*='packImgContainer'] > img").alt);
                                        return a;
                                    }, []),
                            },
                            {
                                name: "Amount",
                                type: "number",
                            },
                            {
                                name: "Show Unlocks",
                                type: "options",
                                options: [
                                    {
                                        name: "Show Unlocks",
                                        value: true,
                                    },
                                    {
                                        name: "Don't Show Unlocks",
                                        value: false,
                                    },
                                ],
                            },
                        ],
                        run: async function (box, amountToOpen, alertBlooks) {
                            if (window.location.pathname.startsWith("/market")) {
                                const stateNode = getStateNode();
                                const prices = Array.prototype.reduce.call(
                                    document.querySelectorAll("[class*='packsWrapper'] > div"),
                                    (a, b) => {
                                        b.querySelector("[class*='blookContainer'] > img") || (a[b.querySelector("[class*='packImgContainer'] > img").alt] = parseInt(b.querySelector("[class*='packBottom']").textContent));
                                        return a;
                                    },
                                    {}
                                );
                                box = box
                                    .split(" ")
                                    .map((str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase())
                                    .join(" ");
                                const cost = prices[box];
                                if (!cost) return alert("I couldn't find that box");

                                const canOpen = Math.floor(stateNode.state.tokens / cost);
                                if (canOpen <= 0) return alert("You do not have enough tokens");
                                const amount = Math.min(canOpen, amountToOpen || 0);

                                const blooks = {},
                                    now = Date.now();

                                for (let i = 0; i < amount; i++) {
                                    await stateNode.buyPack(true, box);

                                    blooks[stateNode.state.unlockedBlook] ||= 0;
                                    blooks[stateNode.state.unlockedBlook]++;

                                    stateNode.startOpening();
                                    clearTimeout(stateNode.openTimeout);
                                    const rarity = stateNode.state.purchasedBlookRarity;

                                    stateNode.setState({ canOpen: true, currentPack: "", opening: alertBlooks, doneOpening: alertBlooks, openPack: alertBlooks });
                                    clearTimeout(stateNode.canOpenTimeout);
                                    if (rarity == "Chroma") break;
                                }
                                await new Promise((r) => setTimeout(r));
                                alert(
                                    `(${Date.now() - now}ms) Results:\n${Object.entries(blooks)
                                        .map(([blook, amount]) => `    ${blook} ${amount}`)
                                        .join(`\n`)}`
                                );
                            } else alert("This can only be ran in the Market page.");
                        },
                    },
                    {

                        name: "Bypass Filter",
            description: "Bypasses the name filter",
            inputs: [{
                name: "Text",
                type: "text",
            }],
            run: function(e) {
                var t,
                    a,
                    o;
                let r;
                a = function e(t) {
                        for (var a = t.split(""), o = "", r = 0; r < a.length; r++)
                            o += "\xad" + a[r];
                        return o
                    }
                    (t = e),
                    r = document.createElement("iframe"),
                    document.body.appendChild(r),
                    window.alert = r.contentWindow.alert.bind(r.contentWindow),
                    (o = document.createElement("textarea")).value = a,
                    o.style.position = "fixed",
                    o.style.top = 0,
                    o.style.left = 0,
                    o.style.opacity = 0,
                    document.body.appendChild(o),
                    o.select(),
                    document.execCommand("copy"),
                    alert("Bypassed text copied to clipboard"),
                    r.remove(),
                    document.body.removeChild(o)
            }
        }, {
            name: "Use any Banner",
            description: "Unlocked all banners",
            inputs: [{
                name: "Banner",
                type: "options",
                options: Object.entries({
                    Starter: "starter",
                    Fire: "fire",
                    "Tech Chip": "techChip",
                    Shamrocks: "shamrocks",
                    "Orange Ice Pop": "orangeIcePop",
                    Slime: "slime",
                    Sushi: "sushi",
                    "Falling Blocks": "fallingBlocks",
                    Racetrack: "racetrack",
                    "Football Field": "footballField",
                    "Ice Cream Sandwich": "iceCreamSandwich",
                    Leaves: "leaves",
                    "Music Class": "musicClass",
                    "Science Class": "scienceClass",
                    "Art Class": "artClass",
                    Clockwork: "clockwork",
                    "Hockey Rink": "hockeyRink",
                    "Outer Space": "outerSpace",
                    "Soccer Field": "soccerField",
                    Ice: "ice",
                    "Toaster Pastry": "toasterPastry",
                    "Fish Tank": "fishTank",
                    Theater: "theater",
                    Farm: "farm",
                    Spooky: "spooky",
                    "Spooky Cat": "spookyCat",
                    "Spooky Window": "spookyWindow",
                    Frankenstein: "frankenstein",
                    Ghosts: "ghosts",
                    Mummy: "mummy",
                    Spiders: "spiders",
                    Coffin: "coffin",
                    Pumpkins: "pumpkins",
                    "Christmas Tree": "christmasTree",
                    Chalkboard: "chalkboard",
                    Balloons: "balloons",
                    Skateboard: "skateboard",
                    Sunset: "sunset",
                    Tiger: "tiger",
                    "Pirate Map": "pirateMap",
                    Pencil: "pencil",
                    "Road Sign": "roadSign",
                    "Corn Dog": "cornDog",
                    Leaf: "leaf",
                    "Chili Pepper": "chiliPepper",
                    "Love Letter": "loveLetter",
                    Gifts: "gifts",
                    "Winter Train": "winterTrain",
                    "Winter Drive": "winterDrive",
                    Workbench: "workbench",
                    Harvest: "harvest",
                    Chocolate: "chocolate",
                    "Fall Picnic": "fallPicnic",
                    Bookshelf: "bookshelf",
                    "Easter Pattern": "easterPattern",
                    Carrot: "carrot",
                    "Easter Field": "easterField",
                    Garden: "garden",
                    Bakery: "bakery",
                    "Gummy Worm": "gummyWorm",
                    "Basketball Court": "basketballCourt",
                    "Flying Kite": "flyingKite",
                    "Hot Dog": "hotDog",
                    "Japanese Garden": "japaneseGarden",
                    Sandwich: "sandwich",
                    Ruler: "ruler",
                    "Ball Pit": "ballPit",
                    "Xylophone": "xylophone",
                    "Holiday Lights": "holidayLights",
                    "Ice Cream Truck": "iceCreamTruck",
                    "Holiday Gift Wrap": "holidayGiftWrap",
                    "Winter Sweater": "winterSweater",
                    "Holiday Ornaments": "holidayOrnaments",
                    Watermelon: "watermelon",
                    Baguette: "baguette",
                    Rollerblades: "rollerblades",
                    Surfboard: "surfboard",
                    Cookout: "cookout",
                    Comic: "comic",
                    Crayon: "crayon",
                    Lightning: "lightning",
                    Baseball: "baseball",
                    "Shamrock Coins": "shamrockCoins",
                    "End Of The Rainbow": "endRainbow",
                    "Easter Field": "easterField",
                    Marker: "marker",
                    Pizza: "pizza",
                    Leaf: "leaf",
                    "Alphabet Soup": "alphabetSoup"
                }).map(([e, t]) => ({
                    name: e,
                    value: t
                }))
            }],
            run: function(e) {
                var t = document.createElement("iframe");

                function a() {
                    return Object.values(document.querySelector("#app>div>div"))[1].children[0]._owner
                }
                document.head.appendChild(t),
                    window.alert = t.contentWindow.alert.bind(window),
                    window.prompt = t.contentWindow.prompt.bind(window),
                    t.remove(),
                    a().stateNode.props.liveGameController.setVal({
                        path: "c/" + a().stateNode.props.client.name + "/bg",
                        val: e
                    })
            }
        }, {
                        name: "Change Blook Ingame",
                        description: "Changes your blook",
                        inputs: [
                            {
                                name: "Blook (case sensitive)",
                                type: "string",
                            },
                        ],
                        run: function (blook) {
                            let { props } = getStateNode();
                            props.liveGameController.setVal({ path: `c/${props.client.name}/b`, val: (props.client.blook = blook) });
                        },
                    },
                    {
                        name: "Pin Guesser",
description: "Brute forces combinations for existing pins. Only works if CSP is disabled, you need to spam a lot to find a working pin.",
run: function() {
    if (!window.location.href.includes("play.blooket.com")) alert("This cheat only works on play.blooket.com, opening a new tab."), window.open("https://play.blooket.com/");
    {
        var e = 0,
            t = 0,
            a = document.querySelector("div[class*='titleText']");

        function o() {
            return Object.values(function e(t = document.querySelector("body>div")) {
                return Object.values(t)[1]?.children?.[0]?._owner.stateNode ? t : e(t.querySelector(":scope>div"))
            }())[1].children[0]._owner.stateNode
        }

        !function r() {
            let i = Math.floor(9e6 * Math.random()) + 1e6;
            fetch(`https://fb.blooket.com/c/firebase/id?id=${i}`, {
                method: "GET",
                credentials: "include"
            }).then(e => e.json()).then(n => {
                if (n.success === true) {
                    console.log("Game found:", i);
                    a.innerHTML = "Game Found";
                    o().setState({
                        client: {
                            hostId: i.toString()
                        }
                    });
                } else {
                    console.log("No game found for:", i);
                    o().setState({
                        client: {
                            hostId: i.toString()
                        }
                    });
                    e++;
                    a.innerHTML = "Guesses: " + e;
                    if (++t > 15) {
                        setTimeout(r, 1e3);
                        t = 0;
                    } else {
                        r();
                    }
                }
            }).catch(e => {
                console.error("Error fetching game ID:", e);
            });
        }()
    }
}

                    },{
                        name: "Free Player Slots",
            description: "Allows more players to join if the game is full",
            run: async () => {
                let i = document.createElement('iframe');
                document.body.append(i);
                const alert = i.contentWindow.alert.bind(window);
                i.remove();
                const stateNode = Object.values(document.querySelector('#app>div>div'))[1].children[0]._owner.stateNode;
                const players = await stateNode.props.liveGameController.getDatabaseVal("c");
                let freed = 0;
                if (!stateNode.state.blockedUsers) {
                    stateNode.state.blockedUsers = [];
                }
                async function wait(time) {
                    return new Promise(e => {
                        setTimeout(e, time);
                    });
                }
                async function blockUser(name) {
                    if (stateNode.state.blockedUsers.includes(name)) {
                        return;
                    }
                    const res = await fetch("https://fb.blooket.com/c/firebase/block", {
                        headers: {
                            "Content-Type": "application/json"
                        },
                        method: "POST",
                        body: JSON.stringify({
                            g: stateNode.props.host.id,
                            u: name
                        }),
                        credentials: "include"
                    });
                    if (res.status !== 200) {
                        return;
                    }
                    stateNode.state.blockedUsers.push(name);
                    freed++;
                    if (freed % parseInt("15") == 0) {
                        await wait(600);
                    }
                    C.alerts?.[0].addLog("Freed user: " + name);
                }
                for (let i in players) {
                    await blockUser(i);
                }
                alert(`Freed slots: ${freed}`);
            }
        }, {

                        name: "Get Daily Rewards",
                        description: "Gets max daily tokens and xp",
                        run: async function () {
                            if (!window.location.href.includes("play.blooket.com")) alert("This cheat only works on play.blooket.com, opening a new tab."), window.open("https://play.blooket.com/");
                            else {
                                const gameId = [
                                    "60101da869e8c70013913b59",
                                    "625db660c6842334835cb4c6",
                                    "60268f8861bd520016eae038",
                                    "611e6c804abdf900668699e3",
                                    "60ba5ff6077eb600221b7145",
                                    "642467af9b704783215c1f1b",
                                    "605bd360e35779001bf57c5e",
                                    "6234cc7add097ff1c9cff3bd",
                                    "600b1491d42a140004d5215a",
                                    "5db75fa3f1fa190017b61c0c",
                                    "5fac96fe2ca0da00042b018f",
                                    "600b14d8d42a140004d52165",
                                    "5f88953cdb209e00046522c7",
                                    "600b153ad42a140004d52172",
                                    "5fe260e72a505b00040e2a11",
                                    "5fe3d085a529560004cd3076",
                                    "5f5fc017aee59500041a1456",
                                    "608b0a5863c4f2001eed43f4",
                                    "5fad491512c8620004918ace",
                                    "5fc91a9b4ea2e200046bd49a",
                                    "5c5d06a7deebc70017245da7",
                                    "5ff767051b68750004a6fd21",
                                    "5fdcacc85d465a0004b021b9",
                                    "5fb7eea20bd44300045ba495",
                                ][Math.floor(Math.random() * 24)];
                                const rand = (l, h) => Math.floor(Math.random() * (h - l + 1)) + l;
                                const { t } = await fetch("https://play.blooket.com/api/playersessions/solo", {
                                    body: JSON.stringify({ gameMode: "Factory", questionSetId: gameId }),
                                    method: "POST",
                                    credentials: "include",
                                })
                                    .then((x) => x.json())
                                    .catch(() => alert("There was an error creating a solo game."));
                                await fetch("https://play.blooket.com/api/playersessions/landings", {
                                    body: JSON.stringify({ t }),
                                    method: "POST",
                                    credentials: "include",
                                }).catch(() => alert("There was an error when landing."));
                                await fetch("https://play.blooket.com/api/playersessions/questions?t=" + t, { credentials: "include" });
                                await fetch("https://play.blooket.com/api/gamequestionsets?gameId=" + gameId, { credentials: "include" });
                                await fetch("https://play.blooket.com/api/users/factorystats", {
                                    body: JSON.stringify({ t, place: 1, cash: rand(10000000, 100000000), playersDefeated: 0, correctAnswers: rand(500, 2000), upgrades: rand(250, 750), blookUsed: "Chick", nameUsed: "You", mode: "Time-Solo" }),
                                    method: "PUT",
                                    credentials: "include",
                                }).catch(() => alert("There was an error when spoofing stats."));
                                await fetch("https://play.blooket.com/api/users/add-rewards", {
                                    body: JSON.stringify({ t, addedTokens: 500, addedXp: 300 }),
                                    method: "PUT",
                                    credentials: "include",
                                })
                                    .then((x) => x.json())
                                    .then(({ dailyReward }) => alert(`Added max tokens and xp, and got ${dailyReward} daily wheel tokens!`))
                                    .catch(() => alert("There was an error when adding rewards."));
                            }
                        },
                    },
                    {
                        name: "Blooket Bot",
            description: "Opens Blooket Bot",
            run: function() {
                function getGameCode() {
                    const appDiv = document.querySelector('#app>div>div');
                    if (appDiv) {
                        const reactComponent = Object.values(appDiv)[1]?.children[0]?._owner;
                        return reactComponent?.stateNode?.props?.client?.hostId || null;
                    }
                    return null;
                }

                const gameCode = getGameCode();
                const url = gameCode ? "https://blooketbot.schoolcheats.net/" + gameCode : "https://blooketbot.schoolcheats.net/";
                window.open(url, "_blank", "width=500,height=500,resizable=yes,scrollbars=yes,status=yes");
            }
        }, {
            name: "Blooket Stream Finder",
            description: "Opens Stream Finder",
            run: function() {
                function getGameCode() {
                    const appDiv = document.querySelector('#app>div>div');
                    if (appDiv) {
                        const reactComponent = Object.values(appDiv)[1]?.children[0]?._owner;
                        return reactComponent?.stateNode?.props?.client?.hostId || null;
                    }
                    return null;
                }

                const gameCode = getGameCode();
                const url = gameCode ? "https://0alter0.github.io/blooketstreamfinderV2/" + gameCode : "https://0alter0.github.io/blooketstreamfinderV2/";
                window.open(url, "_blank", "width=500,height=500,resizable=yes,scrollbars=yes,status=yes");
            }
        }, {
               name: "Crash Game",
            description: "Crashes the host's game",
            run: function() {
                var e = Object.values(function e(t = document.querySelector("#app")) {
                        return Object.values(t)[1]?.children?.[0]?._owner.stateNode ? t : e(t.querySelector(":scope>div"))
                    }
                    ())[1].children[0]._owner.stateNode;
                e.props.liveGameController.setVal({
                    path: `c/${e.props.client.name}/b/toString`,
                    val: "Crashed"
                })
            }
        }, {

                        name: "Use Any Blook",
                        description: "Allows you to play as any blook",
                        run: function () {
                            const lobby = window.location.pathname.startsWith("/play/lobby"),
                                dashboard = !lobby && window.location.pathname.startsWith("/blooks");
                            if (dashboard) {
                                let key = "SClient",
                                    propCall = Object.prototype.hasOwnProperty.call;
                                let webpack = webpackChunk_N_E.push([
                                    [key],
                                    { [key]: () => {} },
                                    function (func) {
                                        Object.prototype.hasOwnProperty.call = function () {
                                            Object.defineProperty(arguments[0], key, { set: () => {}, configurable: true });
                                            return (Object.prototype.hasOwnProperty.call = propCall).apply(this, arguments);
                                        };
                                        return func;
                                    },
                                ]);
                                const blookData = webpack(4927).nK;
                                const blooksHook = Object.values(document.querySelector("[class*=BlooksWrapper_content]"))[0].return.memoizedState.next;
                                const showBlooks = blooksHook.memoizedState;
                                const seen = {},
                                    userBlooks = [],
                                    prices = {
                                        Uncommon: 5,
                                        Rare: 20,
                                        Epic: 75,
                                        Legendary: 200,
                                        Chroma: 300,
                                        Unique: 350,
                                        Mystical: 1000,
                                    };
                                for (const data of blooksHook.next.memoizedState) {
                                    userBlooks.push(data);
                                    seen[data.blook] = true;
                                }
                                for (const blook in blookData) {
                                    if (blookData[blook].rarity != "Common" && !seen[blook])
                                        userBlooks.push({
                                            blook,
                                            quantity: 1,
                                            sellPrice: prices[blookData[blook].rarity],
                                        });
                                }
                                blooksHook.next.queue.dispatch(userBlooks);
                                blooksHook.queue.dispatch(!showBlooks);
                                setTimeout(() => blooksHook.queue.dispatch(showBlooks), 1);
                            } else if (lobby) getStateNode().setState({ unlocks: { includes: () => !0 } });
                            else alert("This only works in lobbies or the dashboard blooks page.");

                        },
                    },
                    {
                        name: "Every Answer Correct",
                        description: "Sets every answer to be correct",
                        run: function () {
                            const stateNode = getStateNode();
                            for (let i = 0; i < stateNode.freeQuestions.length; i++) {
                                stateNode.freeQuestions[i].correctAnswers = stateNode.freeQuestions[i].answers;
                                stateNode.questions[i].correctAnswers = stateNode.questions[i].answers;
                                stateNode.props.client.questions[i].correctAnswers = stateNode.questions[i].answers;
                            }
                            try {
                                stateNode.forceUpdate();
                            } catch {}
                        },
                    },
                    {
                        name: "Remove all Taken Blooks",
            description: "Removes all taken blooks, allowing you to use any taken blook. Only works in lobby.",
            run: function() {
                const stateNode = Object.values(document.querySelector("#app>div>div"))[1].children[0]._owner.stateNode;
                stateNode.setState({
                    takenBlooks: {
                        includes: e => !1
                    }
                });
                stateNode.setState = function(a, b) {
                    if (a?.takenBlooks) {
                        return;
                    }
                    stateNode.updater.enqueueSetState(stateNode, a, b, "setState");
                }
            }
        }, {


    name: "Kick All Players HOST ONLY",
    description: "Kicks all players from your game.",
    run: function() {
        (async function() {
            const app = document.querySelector('#app>div>div');
            if (!app) return;

            const sn = Object.values(app)[1]?.children?.[0]?._owner?.stateNode;
            if (!sn || !sn.props?.liveGameController) return;

            const controller = sn.props.liveGameController;

            const db = await controller.getDatabaseVal("");
            if (!db || !db.c) return;

            controller.setVal({
                path: "bu",
                val: Object.keys(db.c).reduce(
                    (acc, id) => (acc[id] = 1, acc),
                    db.bu ? db.bu : {}
                )
            });

            controller.setVal({
                path: "c",
                val: {}
            });
        })();
    }
},{


            name: "Enable Mobile Hosting",
            description: "Makes it so that you can host on mobile",
            run: function() {
                (function() {
                    var metaViewport = document.querySelector('meta[name="viewport"]');
                    if (metaViewport) {
                        metaViewport.parentNode.removeChild(metaViewport);
                    }
                    var newMetaViewport = document.createElement('meta');
                    newMetaViewport.name = 'viewport';
                    newMetaViewport.content = 'width=1280, initial-scale=1';
                    document.head.appendChild(newMetaViewport);
                })();
            }
        }, {

            name: "Remove Host Time Limit",
            description: "Removes the host time limit",
            run: function() {
                (() => {
                    const sn = Object.values(document.querySelector('#app>div>div'))[1].children[0]._owner.stateNode;
                    sn.onAmountUpdate = function(t) {
                        let settings = sn.state.settings;
                        settings.amount = parseInt(t.target.value);
                        sn.setState({
                            settings
                        });
                    }
                })();
            }
        }, {

            name: "Freeze Timer",
            description: "Makes the host timer stop ingame",
            run: function() {
                (() => {
                    const {
                        stateNode
                    } = Object.values(document.querySelector("#app>div>div"))[1].children[0]._owner;
                    clearInterval(stateNode.timerInterval);
                    stateNode.timerInterval = setInterval(function() {
                        stateNode?.getClients?.(!1);
                    }, 4000);
                })();
            }
        }, {

                        name: "Subtle Highlight Answers",
                        description: "Removes the shadow from correct answers",
                        run: function () {
                            const stateNode = getStateNode();
                            const Question = stateNode.state.question || stateNode.props.client.question;
                            let ind = 0;
                            while (ind < Question.answers.length) {
                                let j = 0;
                                let found = false;
                                while (j < Question.correctAnswers.length) {
                                    if (Question.answers[ind] == Question.correctAnswers[j]) {
                                        found = true;
                                        break;
                                    }
                                    j++;
                                }
                                ind++;
                                if (found) document.querySelector("[class*='answersHolder'] :nth-child(" + ind + ") > div").style.boxShadow = "unset";
                            }
                        },
                    },
                    {
                        name: "Remove Random Name",
                        description: "Allows you to put a custom name",
                        run: function () {
                            getStateNode().setState({ isRandom: false, client: { name: "" } });
                            document.querySelector('[class*="nameInput"]')?.focus?.();
                        },
                    },
                    {
                        name: "Host Any Gamemode",
            description: "Change the selected gamemode on the host settings page",
            inputs: [{
                name: "Gamemode",
                type: "options",
                options: ["Racing", "Classic", "Factory", "Cafe", "Defense2", "Defense", "Royale", "Gold", "Candy", "Brawl", "Hack", "Fish", "Dino", "Toy", "Rush"]
            }],
            run: function(e) {
                let t = document.createElement("iframe");
                if (document.body.append(t), window.alert = t.contentWindow.alert.bind(window), window.prompt = t.contentWindow.prompt.bind(window), t.remove(), "/host/settings" != location.pathname)
                    return alert("Run this script on the host settings page");
                let {
                    stateNode: a
                } = Object.values(function e(t = document.querySelector("body>div")) {
                        return Object.values(t)[1]?.children?.[0]?._owner.stateNode ? t : e(t.querySelector(":scope>div"))
                    }
                    ())[1].children[0]._owner;
                a.setState({
                    settings: {
                        type: e
                    }
                })
            }
        }, {
                        name: "Sell Duplicate Blooks",
                        description: "Sell all duplicate blooks leaving you with 1 each",
                        run: async function () {
                            if (window.location.pathname.startsWith("/blooks")) {
                                if (confirm(`Are you sure you want to sell your dupes? (Legendaries and rarer will not be sold)`)) {
                                    let stateNode = getStateNode();
                                    let now = Date.now(),
                                        results = "";
                                    for (const blook in stateNode.state.blookData)
                                    if (stateNode.state.blookData[blook] > 1) {
                                            stateNode.setState({ blook, numToSell: stateNode.state.blookData[blook] - 1 });
                                            if (!["Uncommon", "Rare", "Epic"].includes(document.querySelector("[class*='highlightedRarity']").innerText.trim())) continue;
                                            results += `    ${blook} ${stateNode.state.blookData[blook] - 1}\n`;
                                            await stateNode.sellBlook({ preventDefault: () => {} }, true);
                                        }
                                    alert(`(${Date.now() - now}ms) Results:\n${results.trim()}`);
                                }
                            } else alert("This can only be ran in the Blooks page.");
                        },
                    },
                ],
            },
extras: {
  img: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDI0MCAyNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBvbHlnb24gZmlsbD0iI2ZkZDAyOSIgcG9pbnRzPSIxMjAsMTggMTUxLDk0IDI0MCw5NCAxNjgsMTQ4IDE5NSwyMzAgMTIwLDE4MyA0NSwyMzAgNzIsMTQ4IDAsOTQgODksOTQiLz48L3N2Zz4=",

  name: "Extras",
  cheats: [
    {
       name: "Remove CSP and Bypass CORS",
            description: "Removes Content Security Policy and bypasses Cross-Origin Resource Sharing restrictions on the page.",
            type: "toggle",
            run: function() {
                function REMOVE_CSP() {
                    const metaTags = document.getElementsByTagName("meta");
                    for (let i = metaTags.length - 1; i >= 0; i--) {
                        if (metaTags[i].getAttribute("http-equiv") === "Content-Security-Policy" ||
                            metaTags[i].getAttribute("http-equiv") === "S-Content-Security-Policy" ||
                            metaTags[i].getAttribute("http-equiv") === "S-WebKit-CSP") {
                            metaTags[i].parentNode.removeChild(metaTags[i]);
                        }
                    }

                    if (window.XMLHttpRequest) {
                        const originalOpen = XMLHttpRequest.prototype.open;
                        XMLHttpRequest.prototype.open = function(method, url) {
                            this.setRequestHeader("Content-Security-Policy", ""); 
                            this.setRequestHeader("S-Content-Security-Policy", "");
                            return originalOpen.apply(this, arguments);
                        };
                    }
                }

                function BYPASS_CORS() {
                    if (window.XMLHttpRequest) {
                        const originalOpen = XMLHttpRequest.prototype.open;
                        XMLHttpRequest.prototype.open = function(method, url) {
                            this.setRequestHeader("Access-Control-Allow-Origin", "*");
                            this.setRequestHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
                            this.setRequestHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, S-Requested-With");
                            return originalOpen.apply(this, arguments);
                        };

                        const originalFetch = window.fetch;
                        window.fetch = function(url, options = {}) {
                            options.headers = options.headers || {};
                            options.headers["Access-Control-Allow-Origin"] = "*";
                            options.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS";
                            options.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, S-Requested-With";
                            return originalFetch(url, options);
                        };
                    }
                }

                function DISABLE_WEB_SECURITY() {
                    Object.defineProperty(window, "localStorage", { get: function() { return window.localStorage; }, configurable: true });
                    Object.defineProperty(window, "sessionStorage", { get: function() { return window.sessionStorage; }, configurable: true });
                }

                REMOVE_CSP();
                BYPASS_CORS();
                DISABLE_WEB_SECURITY();
            }
        }, {

        name: "Toggle Invert Colors",
      description: "Toggle between inverting and restoring colors on the page",
      run: function () {
        const html = document.documentElement;
        html.style.filter = html.style.filter === "invert(1)" ? "" : "invert(1)";
        const elems = document.querySelectorAll("a, img, video");
        for (let i = 0; i < elems.length; i++) {
          const el = elems[i];
          if ((el.nodeName === "A" && (el.style.background !== "" || el.style.backgroundImage !== "")) || el.nodeName !== "A") {
            el.style.filter = el.style.filter === "invert(1)" ? "" : "invert(1)";
          }
        }
      },
    },
    {
      name: "Toggle Dark Mode",
            description: "Toggles Dark Mode",
            run: function() {
                var e = document.createElement("iframe");
                document.body.append(e),
                    window.alert = e.contentWindow.alert.bind(window),
                    e.remove(),
                    ! function e() {
                        let t = document.querySelectorAll("#nightify");
                        if (t.length)
                            t[0].parentNode.removeChild(t[0]);
                        else {
                            var a = document.getElementsByTagName("head")[0],
                                o = document.createElement("style");
                            o.setAttribute("type", "text/css"),
                                o.setAttribute("id", "nightify"),
                                o.appendChild(document.createTextNode(`html{-webkit-filter:invert(100%) hue-rotate(180deg) contrast(70%) !important; background: #222;} .line-content {background-color: #333;} html img{-webkit-filter:invert(100%) hue-rotate(0deg) contrast(100%) !important;}`)),
                                a.appendChild(o)
                        }
                    }
                    ()
            }
        }, {
            name: "3D Page",
            description: "Makes the page 3D",
            run: function() {
                var e = {
                    menu: document.createElement("div"),
                    limit: document.createElement("input"),
                    gap: document.createElement("input"),
                    sag: document.createElement("input"),
                    fov: document.createElement("input"),
                    flo: document.createElement("input"),
                    off: document.createElement("input"),
                    non: document.createElement("input"),
                    end: document.createElement("input"),
                    tgl: document.createElement("input"),
                    cssStatic: document.createElement("style"),
                    cssDynamic: document.createElement("style"),
                    orientation: {
                        yaw: 0,
                        pitch: 0,
                        roll: 0
                    },
                    mouseMove: function(t) {
                        e.orientation.yaw = -(180 * Math.cos(Math.PI * t.clientX / innerWidth)) * e.limit.value,
                            e.orientation.pitch = 180 * Math.cos(Math.PI * t.clientY / innerHeight) * e.limit.value,
                            e.updateBody()
                    },
                    gyroMove: function(t) {
                        innerWidth > innerHeight ? (e.orientation.yaw = -(t.alpha + t.beta), e.orientation.pitch = t.gamma - 90 * Math.sign(90 - Math.abs(t.beta))) : (e.orientation.yaw = -(t.alpha + t.gamma), e.orientation.pitch = t.beta - 90),
                            e.updateBody()
                    },
                    updateOrigin: function(e) {
                        document.body.style.transformOrigin = innerWidth / 2 + pageXOffset + "px " + (innerHeight / 2 + pageYOffset) + "px"
                    },
                    updateBody: function() {
                        document.body.style.transform = "perspective(" + Math.pow(2, e.fov.value) + "px) translateZ(-" + e.gap.value + "px) rotateX(" + e.orientation.pitch + "deg) rotateY(" + e.orientation.yaw + "deg)"
                    },
                    updateCSS: function() {
                        if (e.non.checked)
                            e.cssDynamic.innerHTML = "";
                        else if (e.off.checked)
                            e.cssDynamic.innerHTML = "* { transform-style: preserve-3d; }";
                        else {
                            for (var t = 0; document.querySelector("body" + " > *".repeat(t)); t++);
                            var a = e.gap.value / t,
                                o = -Math.PI * e.sag.value / t;
                            e.cssDynamic.innerHTML = ` * { transform: translateZ(${a}px) rotateX(${o}rad); transform-style: preserve-3d; transition: transform 1s; outline: 1px solid rgba(0, 0, 0, 0.0625); ${e.flo.checked ? "overflow: visible !important;" : ""} } *:hover { transform: translateZ(${2 * a}px) rotateX(${2 * o}rad); ${e.flo.checked ? "" : "overflow: visible;"} } `
                        }
                    },
                    toggle: function() {
                        "active" == e.menu.className ? e.menu.removeAttribute("class") : e.menu.className = "active"
                    },
                    quit: function() {
                        window.removeEventListener("deviceorientation", e.gyroMove),
                            window.removeEventListener("mousemove", e.mouseMove),
                            window.removeEventListener("scroll", e.updateOrigin),
                            window.addEventListener("resize", e.updateOrigin),
                            e.menu.remove(),
                            e.cssStatic.remove(),
                            e.cssDynamic.remove(),
                            document.body.removeAttribute("style")
                    },
                    newRange: function(t, a, o, r, i, n, s) {
                        e.menu.appendChild(t),
                            t.type = "range",
                            t.min = o,
                            t.max = i,
                            t.step = r,
                            t.value = n,
                            t.addEventListener("input", s),
                            e.menu.appendChild(document.createElement("span")).innerHTML = a,
                            e.menu.appendChild(document.createElement("br"))
                    },
                    newCheckbox: function(t, a, o) {
                        e.menu.appendChild(t),
                            t.type = "checkbox",
                            t.addEventListener("click", o),
                            e.menu.appendChild(document.createElement("span")).innerHTML = a,
                            e.menu.appendChild(document.createElement("br"))
                    },
                    newButton: function(t, a, o) {
                        e.menu.appendChild(t),
                            t.type = "button",
                            t.value = a,
                            t.addEventListener("click", o)
                    },
                    init: function() {
                        document.body.parentNode.appendChild(e.menu).id = "tri-menu",
                            e.newRange(e.limit, "limit", 0, .03125, 1, .125, e.updateBody),
                            e.newRange(e.gap, "gap / distance", 0, 32, 512, 128, function() {
                                e.updateCSS(),
                                    e.updateBody()
                            }),
                            e.newRange(e.sag, "sag", -.25, .03125, .25, 0, e.updateCSS),
                            e.newRange(e.fov, "field of view", 7, 1, 13, 10, e.updateBody),
                            e.newCheckbox(e.flo, "force overflow", e.updateCSS),
                            e.flo.setAttribute("checked", ""),
                            e.newCheckbox(e.off, "flatten layers", e.updateCSS),
                            e.newCheckbox(e.non, "flatten everything", e.updateCSS),
                            e.newButton(e.end, "Quit", e.quit),
                            e.newButton(e.tgl, "≡", e.toggle),
                            e.tgl.id = "tri-toggle",
                            e.menu.appendChild(e.cssStatic).innerHTML = " html, body { transition-property: none; height: 100%25; width: 100%25; } html, html:hover, #tri-menu, #tri-menu > *, #tri-menu > *:hover { transform: none; outline: none; overflow: auto !important; float: none; } #tri-menu { position: fixed; top: 0; left: 0; background: rgba(0, 0, 0, 0.5); color: white; border: 1px solid rgba(255, 255, 255, 0.5);; border-radius: 0 0 16px 0; padding: 8px; transform: translate(-100%25, -100%25) translate(32px, 32px); } #tri-menu.active { transform: none; } #tri-toggle { position: absolute; bottom: 0; right: 0; height: 32px; width: 32px; background: transparent; color: white; border: none; cursor: pointer; } #tri-menu.active > #tri-toggle { background: white; color: black; border-radius: 8px 0 0 0; }",
                            e.menu.appendChild(e.cssDynamic),
                            e.updateCSS(),
                            window.addEventListener("deviceorientation", e.gyroMove),
                            window.addEventListener("mousemove", e.mouseMove),
                            window.addEventListener("scroll", e.updateOrigin),
                            window.addEventListener("resize", e.updateOrigin),
                            window.scrollBy(0, 1)
                    }
                };
                e.init()
            }
        }, {

            name: "Auto Clicker",
            description: "Automatically clicks for you. Press S to toggle.",
            inputs: [{
                name: "Click Delay",
                type: "number"
            }],
            run: function(inputs) {
                clicker: {
                    "use strict";

                    let clickInterval = null;
                    let clickingEnabled = true;

                    const {
                        Number,
                        self
                    } = window;
                    const milliseconds = Number.parseInt(inputs, 10);

                    if (false === Number.isSafeInteger(milliseconds)) {
                        self.alert("Input was not an integer");
                        break clicker;
                    }

                    let clientX = 0,
                        clientY = 0;
                    const {
                        document
                    } = self;

                    function startClicking() {
                        clickInterval = self.setInterval(() => {
                            document.elementFromPoint(clientX, clientY)?.click?.();
                        }, milliseconds);
                    }

                    function stopClicking() {
                        self.clearInterval(clickInterval);
                        clickInterval = null;
                    }

                    startClicking();

                    document.addEventListener("mousemove", event => {
                        ({
                            clientX,
                            clientY
                        } = event);
                    }, {
                        passive: true
                    });

                    self.addEventListener("keydown", event => {
                        if (event.key === "s") {
                            if (clickingEnabled) {
                                stopClicking();
                            } else {
                                startClicking();
                            }
                            clickingEnabled = !clickingEnabled;
                        }
                    });
                }
            }
        }, {
            name: "Tab Cloaker",
            description: "Changes the tab image and name",
            inputs: [{
                name: "Icon URL",
                type: "text",
            }, {
                name: "Tab Title",
                type: "text",
            }],
            run: function(e, t) {
                var a = document.querySelector("link[rel*='icon']") || document.createElement("link");
                a.type = "image/s-icon",
                    a.rel = "shortcut icon",
                    a.href = e || "https://www.blooket.com/favicon.ico",
                    document.getElementsByTagName("head")[0].appendChild(a),
                    document.title = t || "Blooket"
                 }
        }, {

  name: "Grayscale Mode",
  description: "Turns the page grayscale",
  run: function () {
    const html = document.documentElement;
    html.style.filter =
      html.style.filter === "grayscale(1)" ? "" : "grayscale(1)";
  }
},

{
  name: "Sepia Mode",
  description: "Applies a sepia filter",
  run: function () {
    const html = document.documentElement;
    html.style.filter =
      html.style.filter === "sepia(1)" ? "" : "sepia(1)";
  }
},

{
  name: "High Contrast",
  description: "Boosts contrast for readability",
  run: function () {
    const html = document.documentElement;
    html.style.filter =
      html.style.filter === "contrast(1.5)" ? "" : "contrast(1.5)";
  }
},

{
  name: "Soft Blur",
  description: "Applies subtle blur",
  run: function () {
    const html = document.documentElement;
    html.style.filter =
      html.style.filter.includes("blur") ? "" : "blur(3px)";
  }
},

{
  name: "Pastel Theme",
  description: "Soft pastel color palette",
  run: function () {
    if (document.getElementById("pastel-ui")) {
      document.getElementById("pastel-ui").remove();
      return;
    }
    const style = document.createElement("style");
    style.id = "pastel-ui";
    style.innerHTML = `* { filter: saturate(0.8) brightness(1.05); }`;
    document.head.appendChild(style);
  }
},

{
  name: "Rainbow Hue Cycle",
  description: "Smooth color cycling",
  run: function () {
    if (window._rainbow) {
      clearInterval(window._rainbow);
      window._rainbow = null;
      document.documentElement.style.filter = "";
      return;
    }
    let i = 0;
    window._rainbow = setInterval(() => {
      document.documentElement.style.filter = `hue-rotate(${i++}deg)`;
      if (i > 360) i = 0;
    }, 40);
  }
},

{
  name: "Rounded UI",
  description: "Extra rounded corners",
  run: function () {
    if (document.getElementById("rounded-ui")) {
      document.getElementById("rounded-ui").remove();
      return;
    }
    const style = document.createElement("style");
    style.id = "rounded-ui";
    style.innerHTML = `* { border-radius: 16px !important; }`;
    document.head.appendChild(style);
  }
},

{
  name: "Outline UI",
  description: "Outlines UI elements",
  run: function () {
    if (document.getElementById("outline-ui")) {
      document.getElementById("outline-ui").remove();
      return;
    }
    const style = document.createElement("style");
    style.id = "outline-ui";
    style.innerHTML = `* { outline: 1px solid rgba(255,255,255,0.12); }`;
    document.head.appendChild(style);
  }
},

{
  name: "Flat UI",
  description: "Removes shadows for a flat look",
  run: function () {
    if (document.getElementById("flat-ui")) {
      document.getElementById("flat-ui").remove();
      return;
    }
    const style = document.createElement("style");
    style.id = "flat-ui";
    style.innerHTML = `* { box-shadow: none !important; text-shadow: none !important; }`;
    document.head.appendChild(style);
  }
},

{
  name: "Wobbly UI",
  description: "UI gently wobbles",
  run: function () {
    if (document.getElementById("wobbly-ui")) {
      document.getElementById("wobbly-ui").remove();
      return;
    }
    const style = document.createElement("style");
    style.id = "wobbly-ui";
    style.innerHTML = `
      * { animation: wobble 2s infinite alternate; }
      @keyframes wobble { 0% { transform: rotate(-1deg); } 100% { transform: rotate(1deg); } }
    `;
    document.head.appendChild(style);
  }
},

{
  name: "Floating UI",
  description: "UI gently floats up and down",
  run: function () {
    if (document.getElementById("float-ui")) {
      document.getElementById("float-ui").remove();
      return;
    }
    const style = document.createElement("style");
    style.id = "float-ui";
    style.innerHTML = `
      * { animation: floaty 3s ease-in-out infinite; }
      @keyframes floaty { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-5px);} }
    `;
    document.head.appendChild(style);
  }
},

{
  name: "Tiny UI",
  description: "Slightly shrinks UI",
  run: function () {
    const html = document.documentElement;
    html.style.zoom = html.style.zoom === "0.9" ? "" : "0.9";
  }
},

{
  name: "Mirror Page",
  description: "Flips page horizontally",
  run: function () {
    const html = document.documentElement;
    html.style.transform = html.style.transform === "scaleX(-1)" ? "" : "scaleX(-1)";
  }
},

{

  name: "Outline Elements (Black)",
  description: "Toggles black outlines on all page elements",
  run: function () {
    if (document.getElementById("outline-elements-black")) {
      document.getElementById("outline-elements-black").remove();
      return;
    }

    const style = document.createElement("style");
    style.id = "outline-elements-black";
    style.innerHTML = `
      * {
        outline: 1px solid black !important;
        outline-offset: -1px !important;
      }
    `;
    document.head.appendChild(style);
  }
},{


  name: "Outline Elements (Red)",
  description: "Toggles red outlines on all page elements",
  run: function () {
    if (document.getElementById("outline-elements-red")) {
      document.getElementById("outline-elements-red").remove();
      return;
    }

    const style = document.createElement("style");
    style.id = "outline-elements-red";
    style.innerHTML = `
      * {
        outline: 1px solid red !important;
        outline-offset: -1px !important;
      }
    `;
    document.head.appendChild(style);
  }
},{



  name: "Light Screen Shake",
  description: "Subtle screen shake",
  run: function () {
    document.body.animate(
      [ { transform: "translate(0,0)" }, { transform: "translate(-2px,1px)" }, { transform: "translate(2px,-1px)" }, { transform: "translate(0,0)" } ],
      { duration: 200 }
    );
  }
},

{
  name: "Jello UI",
  description: "UI elements wobble like jello",
  run: function () {
    if (document.getElementById("jello-ui")) {
      document.getElementById("jello-ui").remove();
      return;
    }
    const style = document.createElement("style");
    style.id = "jello-ui";
    style.innerHTML = `
      * { animation: jello 1s infinite; }
      @keyframes jello {
        0%,100%{transform:scale3d(1,1,1);}
        25%{transform:scale3d(1.05,0.95,1);}
        50%{transform:scale3d(0.95,1.05,1);}
        75%{transform:scale3d(1.02,0.98,1);}
      }
    `;
    document.head.appendChild(style);
  }
},


{
  name: "Rotate Page",
  description: "Rotates the entire page slowly",
  run: function () {
    const html = document.documentElement;
    html.style.transition = "transform 0.5s";
    html.style.transform = html.style.transform === "rotate(180deg)" ? "" : "rotate(180deg)";
  }
},

{
  name: "Scale Up Page",
  description: "Slightly zooms in page",
  run: function () {
    const html = document.documentElement;
    html.style.transform = html.style.transform === "scale(1.1)" ? "" : "scale(1.1)";
  }
},

{
  name: "Spin Slowly",
  description: "Page spins continuously",
  run: function () {
    if (window._spin) {
      clearInterval(window._spin);
      window._spin = null;
      document.documentElement.style.transform = "";
      return;
    }
    let deg = 0;
    window._spin = setInterval(() => {
      deg += 1;
      document.documentElement.style.transform = `rotate(${deg}deg)`;
    }, 50);
  }
},

{
  name: "Flip Vertically",
  description: "Flips page upside down",
  run: function () {
    const html = document.documentElement;
    html.style.transform = html.style.transform === "scaleY(-1)" ? "" : "scaleY(-1)";
  }
},


{
  name: "Shake UI",
  description: "UI elements shake slightly",
  run: function () {
    if (document.getElementById("shake-ui")) {
      document.getElementById("shake-ui").remove();
      return;
    }
    const style = document.createElement("style");
    style.id = "shake-ui";
    style.innerHTML = `
      * { animation: shake 0.2s infinite alternate; }
      @keyframes shake { 0%{transform:translate(0,0);} 50%{transform:translate(2px,-2px);} 100%{transform:translate(0,0);} }
    `;
    document.head.appendChild(style);
  }
},

{
  name: "Flip Horizontally Random",
  description: "UI flips left and right repeatedly",
  run: function () {
    if (window._flipH) {
      clearInterval(window._flipH);
      window._flipH = null;
      document.documentElement.style.transform = "";
      return;
    }
    let flip = 1;
    window._flipH = setInterval(() => {
      document.documentElement.style.transform = `scaleX(${flip})`;
      flip *= -1;
    }, 500);
  }
},

{
  name: "Glow UI Pulse",
  description: "UI elements glow and pulse gently",
  run: function () {
    if (document.getElementById("pulse-ui")) {
      document.getElementById("pulse-ui").remove();
      return;
    }
    const style = document.createElement("style");
    style.id = "pulse-ui";
    style.innerHTML = `
      * { animation: pulse 2s infinite; }
      @keyframes pulse { 0%,100%{box-shadow:none;} 50%{box-shadow:0 0 10px rgba(0,255,255,0.5);} }
    `;
    document.head.appendChild(style);
  }
},

{
  name: "UI Zoom Pulse",
  description: "UI elements pulse bigger and smaller",
  run: function () {
    if (document.getElementById("zoom-pulse-ui")) {
      document.getElementById("zoom-pulse-ui").remove();
      return;
    }
    const style = document.createElement("style");
    style.id = "zoom-pulse-ui";
    style.innerHTML = `
      * { animation: zoomPulse 2s infinite; }
      @keyframes zoomPulse { 0%,100%{transform:scale(1);} 50%{transform:scale(1.05);} }
    `;
    document.head.appendChild(style);
  }
},

{

  name: "Flip Random UI",
  description: "UI elements flip randomly. This will break GUI, you will need to reload.",
  run: function () {
    if (window._flipUI) {
      clearInterval(window._flipUI);
      window._flipUI = null;
      document.querySelectorAll("*").forEach(el=>el.style.transform="");
      return;
    }
    window._flipUI = setInterval(() => {
      document.querySelectorAll("*").forEach(el=>{
        if(Math.random()<0.05) el.style.transform = `rotate(${Math.random()*360}deg)`;
      });
    }, 200);
  }
},



{
  name: "Tilted Page",
  description: "Page tilts left and right slowly",
  run: function () {
    if (window._tiltPage) {
      clearInterval(window._tiltPage);
      window._tiltPage = null;
      document.documentElement.style.transform="";
      return;
    }
    let deg = -3;
    let dir = 1;
    window._tiltPage = setInterval(()=>{
      document.documentElement.style.transform = `rotate(${deg}deg)`;
      deg += dir;
      if(deg>3||deg<-3) dir*=-1;
    },50);
  }
},







{
  name: "Page Flip Slowly",
  description: "Page rotates slowly 360 degrees",
  run: function () {
    if (window._pageFlip) {
      clearInterval(window._pageFlip);
      window._pageFlip = null;
      document.documentElement.style.transform="";
      return;
    }
    let deg = 0;
    window._pageFlip = setInterval(()=>{
      deg+=1;
      document.documentElement.style.transform=`rotate(${deg}deg)`;
      if(deg>=360) deg=0;
    },50);
  }
},{

  name: "Cursor: Crosshair",
  description: "Changes mouse cursor to crosshair",
  run: function () {
    document.body.style.cursor = document.body.style.cursor ? "" : "crosshair";
  }
},
{
  name: "Cursor: Pointer",
  description: "Changes mouse cursor to pointer",
  run: function () {
    document.body.style.cursor = document.body.style.cursor ? "" : "pointer";
  }
},
{
  name: "Cursor: Grab",
  description: "Changes mouse cursor to grab",
  run: function () {
    document.body.style.cursor = document.body.style.cursor ? "" : "grab";
  }
},
{
  name: "Cursor: Move",
  description: "Changes mouse cursor to move",
  run: function () {
    document.body.style.cursor = document.body.style.cursor ? "" : "move";
  }
},
{
  name: "Cursor: Wait",
  description: "Changes mouse cursor to wait",
  run: function () {
    document.body.style.cursor = document.body.style.cursor ? "" : "wait";
  }
},
{
  name: "Cursor: Help",
  description: "Changes mouse cursor to help",
  run: function () {
    document.body.style.cursor = document.body.style.cursor ? "" : "help";
  }
},
{
  name: "Cursor: Text",
  description: "Changes mouse cursor to text (I-beam)",
  run: function () {
    document.body.style.cursor = document.body.style.cursor ? "" : "text";
  }
},
{
  name: "Cursor: Progress",
  description: "Changes mouse cursor to progress",
  run: function () {
    document.body.style.cursor = document.body.style.cursor ? "" : "progress";
  }
},
{
  name: "Cursor: Not-allowed",
  description: "Changes mouse cursor to not-allowed",
  run: function () {
    document.body.style.cursor = document.body.style.cursor ? "" : "not-allowed";
  }
},
{
  name: "Cursor: Alias",
  description: "Changes mouse cursor to alias",
  run: function () {
    document.body.style.cursor = document.body.style.cursor ? "" : "alias";
  }
},{

  name: "Extra Bold Text",
  description: "Extremely bold text",
  run: function () {
    if (document.getElementById("extra-bold-text")) {
      document.getElementById("extra-bold-text").remove();
      return;
    }
    const style = document.createElement("style");
    style.id = "extra-bold-text";
    style.innerHTML = `* { font-weight: 900 !important; }`;
    document.head.appendChild(style);
  }
},

{
  name: "Slightly Bigger Text For GUI",
  description: "Slightly increases text size for readability",
  run: function () {
    if (document.getElementById("slightly-bigger-text")) {
      document.getElementById("slightly-bigger-text").remove();
      return;
    }
    const style = document.createElement("style");
    style.id = "slightly-bigger-text";
    style.innerHTML = `* { font-size: 1.05em !important; }`;
    document.head.appendChild(style);
  }
},

{
  name: "Outline Text",
  description: "Adds strong outline to text for visibility",
  run: function () {
    if (document.getElementById("outline-text")) {
      document.getElementById("outline-text").remove();
      return;
    }
    const style = document.createElement("style");
    style.id = "outline-text";
    style.innerHTML = `
      * {
        text-shadow:
          -1px -1px 0 #000,
          1px -1px 0 #000,
          -1px 1px 0 #000,
          1px 1px 0 #000;
      }
    `;
    document.head.appendChild(style);
  }
},

{
  name: "Shadowed Text",
  description: "Adds prominent shadow behind text for depth",
  run: function () {
    if (document.getElementById("shadow-text")) {
      document.getElementById("shadow-text").remove();
      return;
    }
    const style = document.createElement("style");
    style.id = "shadow-text";
    style.innerHTML = `
      * {
        text-shadow: 2px 2px 4px rgba(0,0,0,0.7);
      }
    `;
    document.head.appendChild(style);
  }
},

{
  name: "Rainbow Text",
  description: "Text cycles through rainbow colors",
  run: function () {
    if (window._rainbowText) {
      clearInterval(window._rainbowText);
      window._rainbowText = null;
      document.querySelectorAll("*").forEach(el => el.style.color = "");
      return;
    }
    let hue = 0;
    window._rainbowText = setInterval(() => {
      document.querySelectorAll("*").forEach(el => el.style.color = `hsl(${hue},90%,55%)`);
      hue += 3; if (hue > 360) hue = 0;
    }, 100);
  }
},{

  name: "Reset Visuals",
  description: "Resets all visual changes",
  run: function () {
    document.documentElement.style.filter="";
    document.documentElement.style.transform="";
    document.documentElement.style.zoom="";
    document.body.style.cursor="";
    clearInterval(window._rainbow);
    window._rainbow=null;
    document.querySelectorAll("style[id]").forEach(s=>x.remove());
    document.removeEventListener("mousemove",window._cursorCircle);
    document.removeEventListener("mousemove",window._cursorTrailFn);
    document.removeEventListener("mousemove",window._cursorSparkleFn);
    document.removeEventListener("mousemove",window._cursorRainbowFn);
    document.removeEventListener("mousemove",window._cursorGlowFn);
  }
},{








      name: "Toggle Small Font",
      description: "Switch GUI font-size between normal and slightly smaller.",
      run: function () {
        if (typeof gui !== "undefined") {
          const current = gui.style.fontSize || getComputedStyle(gui).fontSize;
          if (current === "13px") gui.style.fontSize = "";
          else gui.style.fontSize = "13px";
        } else {
          console.warn("GUI element not found for Toggle Small Font");
        }
      },
    },
  ],
},
            gold: {
                img: new Date().getMonth() == 9 ? "https://media.blooket.com/image/upload/v1663212881/Media/logos/Candy_Quest_Logo.png" : "https://media.blooket.com/image/upload/v1663212881/Media/logos/Gold_Quest_Logo_Resized.png",
                name: "Gold Quest",
                cheats: [
                    {
                        name: "Always Triple",
                        description: "Always get triple gold",
                        type: "toggle",
                        enabled: false,
                        data: { type: "multiply", val: 3, text: "Triple Gold", blook: "Unicorn" },
                        run: function () {
                            let stateNode = getStateNode();
                            stateNode._choosePrize ||= stateNode.choosePrize;
                            if (!this.enabled) {
                                this.enabled = true;
                                stateNode.choosePrize = (i) => {
                                    stateNode.state.choices[i] = this.data;
                                    stateNode._choosePrize(i);
                                };
                            } else {
                                this.enabled = false;
                                if (stateNode._choosePrize) stateNode.choosePrize = stateNode._choosePrize;
                            }
                        },
                    },
                    {
                        name: "Always Quintuple",
            description: "Always get quintuple gold",
            type: "toggle",
            enabled: !1,
            data: null,
            run: function() {
                let e = Object.values(document.querySelector("body div[id] > div > div"))[1].children[0]._owner.stateNode;
                e._choosePrize ||= e.choosePrize,
                    this.enabled ? (this.enabled = !1, clearInterval(this.data), this.data = null, e.choosePrize = e._choosePrize || e.choosePrize) : (this.enabled = !0, this.data = setInterval(() => {
                        e.choosePrize = function(t) {
                            e.state.choices[t] = {
                                    type: "multiply",
                                    val: 5,
                                    text: "Quintuple Gold",
                                    blook: "Ice Elemental"
                                },
                                e._choosePrize(t)
                        }
                    }, 50))
            }
        }, {

                        name: "Auto Choose",
                        description: "Automatically picks the option that would give you the most gold",
                        type: "toggle",
                        enabled: false,
                        data: null,
                        run: function () {
                            if (!this.enabled) {
                                this.enabled = true;
                                this.data = setInterval(async () => {
                                    let stateNode = getStateNode();
                                    if (stateNode.state.stage == "prize") {
                                        stateNode.props.liveGameController.getDatabaseVal("c", (players) => {
                                            try {
                                                if (players == null) return;
                                                players = Object.entries(players);
                                                let most = 0,
                                                    max = 0,
                                                    index = -1;
                                                for (let i = 0; i < players.length; i++) if (players[i][0] != stateNode.props.client.name && players[i][1] > most) most = players[i][1];
                                                for (let i = 0; i < stateNode.state.choices.length; i++) {
                                                    const choice = stateNode.state.choices[i];
                                                    let value = stateNode.state.gold;
                                                    if (choice.type == "gold") value = stateNode.state.gold + choice.val || stateNode.state.gold;
                                                    else if (choice.type == "multiply" || choice.type == "divide") value = Math.round(stateNode.state.gold * choice.val) || stateNode.state.gold;
                                                    else if (choice.type == "swap") value = most || stateNode.state.gold;
                                                    else if (choice.type == "take") value = stateNode.state.gold + most * choice.val || stateNode.state.gold;
                                                    if ((value || 0) <= max) continue;
                                                    max = value;
                                                    index = i + 1;
                                                }
                                                document.querySelector("div[class*='choice" + index + "']")?.click();
                                            } catch {}
                                        });
                                    }
                                }, 50);
                            } else {
                                this.enabled = false;
                                clearInterval(this.data);
                                this.data = null;
                            }
                        },
                    },
                    {
                        name: "Chest ESP",
                        description: "Shows what each chest will give you",
                        type: "toggle",
                        enabled: false,
                        data: null,
                        run: function () {
                            if (!this.enabled) {
                                this.enabled = true;
                                this.data = setInterval(() => {
                                    getStateNode().state.choices.forEach(({ text }, index) => {
                                        let chest = document.querySelector(`div[class*='choice${index + 1}']`);
                                        if (!chest || chest.querySelector("div")) return;
                                        let choice = document.createElement("div");
                                        choice.style.color = "white";
                                        choice.style.fontFamily = "Eczar";
                                        choice.style.fontSize = "2em";
                                        choice.style.display = "flex";
                                        choice.style.justifyContent = "center";
                                        choice.style.transform = "translateY(200px)";
                                        choice.innerText = text;
                                        chest.append(choice);
                                    });
                                }, 50);
                            } else {
                                this.enabled = false;
                                clearInterval(this.data);
                                this.data = null;
                            }
                        },
                    },
                    {
                        name: "Remove Bad Choices",
                        description: "Removes the chance of getting Lose 25%, Lose 50%, and Nothing",
                        run: function () {
                            let iterator = Array.prototype[Symbol.iterator];
                            Array.prototype[Symbol.iterator] = function* values() {
                                if (this[0]?.type == "gold") {
                                    Array.prototype[Symbol.iterator] = iterator;
                                    console.log(this);
                                    for (let i = 0; i < this.length; i++) if (this[i].type == "divide" || this[i].type == "nothing") this.splice(i--, 1);
                                }
                                yield* iterator.apply(this);
                            };

                            getStateNode().constructor.prototype.answerNext.call({ nextReady: true, here: true, state: { correct: true }, setState() {} });
                        },
                    },
                    {
                        name: "Flood Alert Box",
            description: "Makes the alert box filled with text",
            inputs: [{
                name: "Text",
                type: "text"
            }],
            run: function(userInput) {
                function getReactOwner() {
                    return Object.values(document.querySelector('#app>div>div'))[1].children[0]._owner;
                }

                function repeatText(text, times) {
                    return new Array(times).fill(text).join(" ");
                }

                function setValForPlayer() {
                    getReactOwner().stateNode.props.liveGameController.getDatabaseVal("c/").then(data => {
                        if (data != null) {

                            const playerName = Object.keys(data)[0];

                            if (userInput) {

                                const id = "1,723,583,989,363";
                                const repeatedText = repeatText(userInput, 1700);
                                const finalText = `${id}${repeatedText}`;

                                setv(['tat', `${playerName}:${finalText}`]);
                            } else {
                                console.log("No text entered. Operation cancelled.");
                            }
                        } else {
                            console.log("Player not found");
                        }
                    });
                }

                function setv(args) {
                    getReactOwner().stateNode.props.liveGameController.setVal({
                        path: "c/" + getReactOwner().stateNode.props.client.name + "/" + args[0],
                        val: args.slice(1, args.length).join(" ")
                    });
                }

                setValForPlayer();
            }
        }, {
                        name: "Reset Players Gold",
                        description: "Sets a player's gold to 0",
                        inputs: [
                            {
                                name: "Player",
                                type: "options",
                                options: () => {
                                    let stateNode = getStateNode();
                                    return stateNode.props.liveGameController._liveApp ? new Promise((res) => stateNode.props.liveGameController.getDatabaseVal("c", (players) => players && res(Object.keys(players)))) : [];
                                },
                            },
                        ],
                        run: function (target) {
                            let stateNode = getStateNode();
                            stateNode.props.liveGameController.setVal({
                                path: "c/" + stateNode.props.client.name + "/tat",
                                val: target + ":swap:0",
                            });
                        },
                    },
                    {
                        name: "Set Gold",
                        description: "Sets amount of gold",
                        inputs: [
                            {
                                name: "Gold",
                                type: "number",
                            },
                        ],
                        run: function (gold) {
                            let stateNode = getStateNode();
                            stateNode.setState({ gold, gold2: gold });
                            stateNode.props.liveGameController.setVal({
                                path: "c/" + stateNode.props.client.name + "/g",
                                val: gold,
                            });
                        },
                    },
                    {

                        name: "Set Player's Gold",
                        description: "Sets another player's gold",
                        inputs: [
                            {
                                name: "Player",
                                type: "options",
                                options: () => {
                                    let stateNode = getStateNode();
                                    return stateNode.props.liveGameController._liveApp ? new Promise((res) => stateNode.props.liveGameController.getDatabaseVal("c", (players) => players && res(Object.keys(players)))) : [];
                                },
                            },
                            {
                                name: "Gold",
                                type: "number",
                            },
                        ],
                        run: function (player, gold) {
                            let stateNode = getStateNode();
                            stateNode.props.liveGameController.setVal({
                                path: "c/" + stateNode.props.client.name + "/tat",
                                val: player + ":swap:" + gold
                            });
                        }
                    },
                    {
                        name: "Reset All Players' Gold",
            description: "Set's everyone else's gold to 0",
            run: function() {
                var e = document.createElement("iframe");
                document.body.append(e),
                    window.alert = e.contentWindow.alert.bind(window),
                    e.remove();
                let {
                    props: t,
                    state: a
                } = Object.values(document.querySelector("body div[id] > div > div"))[1].children[0]._owner.stateNode,
                    o = 0;
                t.liveGameController.getDatabaseVal("c", async e => {
                    if (e)
                        for (let r of Object.keys(e))
                            t.liveGameController.setVal({
                                path: "c/".concat(t.client.name),
                                val: {
                                    b: t.client.blook,
                                    g: a.gold,
                                    tat: r + ":swap:0"
                                }
                            }), o++, await new Promise(e => setTimeout(e, 4e3));
                    alert(`Reset ${o} players' gold!`)
                })
            }
        }, {

            name: "Toggle Spooky Theme",
            description: "Toggles the spooky theme for Gold Quest",
            run: function() {
                (() => {
                    const sn = Object.values(document.querySelector('#app>div>div'))[1].children[0]._owner.stateNode;
                    sn.season = sn.season ? 0 : 1;
                    sn.render();
                })();
            }
        }, {
            name: "Send Ad Text",
            description: "Sends a load of text to another player (This will override your blook!)",
            inputs: [{
                name: "Player",
                type: "options",
                options() {
                    let {
                        stateNode: e
                    } = Object.values(function e(t = document.querySelector("body>div")) {
                            return Object.values(t)[1]?.children?.[0]?._owner.stateNode ? t : e(t.querySelector(":scope>div"));
                        }
                        ())[1].children[0]._owner;
                    return new Promise(t => e.props.liveGameController._liveApp ? e.props.liveGameController.getDatabaseVal("c", e => e && t(Object.keys(e))) : t([]));
                }
            }, {
                name: "Text"
            }],
            run: async function(player, e) {
                let {
                    props: t2
                } = Object.values(function e(t = document.querySelector("body>div")) {
                        return Object.values(t)[1]?.children?.[0]?._owner.stateNode ? t : e(t.querySelector(":scope>div"));
                    }
                    ())[1].children[0]._owner.stateNode;

                let repeatedText = `Dog:${Array(500).fill(e).join(' ')}`;
                t2.client.blook = repeatedText;
                t2.liveGameController.setVal({
                    path: `c/${t2.client.name}/b`,
                    val: repeatedText
                });
                t2.liveGameController.setVal({
                    path: `c/${t2.client.name}/tat`,
                    val: `${player}:196`
                });
            }
        }, {

    name: "Crash Host (Gold)",
    description: "Crashes the Host's Game for Gold Quest",
    inputs: [],
    run: async function () {
        function getOwner(t = document.querySelector("body>div")) {
            return Object.values(t)[1]?.children?.[0]?._owner?.stateNode ?
                t :
                getOwner(t.querySelector(":scope>div"));
        }

        let { stateNode } = Object.values(getOwner())[1].children[0]._owner;

        function setv(args) {
            stateNode.props.liveGameController.setVal({
                path: "c/" + stateNode.props.client.name + "/" + args[0],
                val: args.slice(1).join(" ")
            });
        }

        setv(["g/t", "t"]);
    }
}, {
                        name: "Swap Gold",
                        description: "Swaps gold with someone",
                        inputs: [
                            {
                                name: "Player",
                                type: "options",
                                options: () => {
                                    let stateNode = getStateNode();
                                    return stateNode.props.liveGameController._liveApp ? new Promise((res) => stateNode.props.liveGameController.getDatabaseVal("c", (players) => players && res(Object.keys(players)))) : [];
                                },
                            },
                        ],
                        run: function (player) {
                            let stateNode = getStateNode();
                            stateNode.props.liveGameController.getDatabaseVal("c", (players) => {
                                if (!players || players[player] == null) return;
                                const gold = players[player].g || 0;
                                stateNode.props.liveGameController.setVal({
                                    path: "c/" + stateNode.props.client.name,
                                    val: {
                                        b: stateNode.props.client.blook,
                                        tat: player + ":swap:" + (stateNode.state.gold || 0),
                                        g: gold,
                                    },
                                });
                                stateNode.setState({ gold, gold2: gold });
                            });
                        },
                    },
                ],
            },
            hack: {
                img: "https://media.blooket.com/image/upload/v1663212882/Media/logos/Crypto_Hack_Logo_Resized.png",
                name: "Crypto Hack",
                cheats: [
                    {
                        name: "Choice ESP",
                        description: "Shows what each choice will give you",
                        type: "toggle",
                        enabled: false,
                        data: null,
                        run: function () {
                            if (!this.enabled) {
                                this.enabled = true;
                                this.data = setInterval(() => {
                                    let chest = document.querySelector("[class*=feedbackContainer]");
                                    if (chest.children.length <= 4) {
                                        let choice = document.createElement("div");
                                        choice.style.color = "white";
                                        choice.style.fontFamily = "Inconsolata,Helvetica,monospace,sans-serif";
                                        choice.style.fontSize = "2em";
                                        choice.style.display = "flex";
                                        choice.style.justifyContent = "center";
                                        choice.style.marginTop = "675px";
                                        choice.innerText = getStateNode().state.choices[0].text;
                                        chest.append(choice);
                                    }
                                }, 50);
                            } else {
                                this.enabled = false;
                                clearInterval(this.data);
                                this.data = null;
                            }
                        },
                    },
                    {

                        name: "Password ESP",
                        description: "Highlights the correct password",
                        type: "toggle",
                        enabled: false,
                        data: null,
                        run: function () {
                            if (!this.enabled) {
                                this.enabled = true;
                                this.data = setInterval(() => {
                                    let { state } = getStateNode();
                                    if (state.stage == "hack")
                                        for (const button of document.querySelector("div[class*=buttonContainer]").children) {
                                            if (button.innerText == state.correctPassword) continue;
                                            button.style.outlineColor = "rgba(255, 64, 64, 0.8)";
                                            button.style.backgroundColor = "rgba(255, 64, 64, 0.8)";
                                            button.style.textShadow = "0 0 1px #f33";
                                        }
                                }, 50);
                            } else {
                                this.enabled = false;
                                clearInterval(this.data);
                                this.data = null;
                            }
                        },
                    },
                    {
                        name: "Set Host Screen Green",
            description: "Makes the whole screen filled with text",
            type: "toggle",
            enabled: !1,
            data: null,
            run: function() {
                var a = Object.values(function e(t = document.querySelector("#app")) {
                        return Object.values(t)[1]?.children?.[0]?._owner.stateNode ? t : e(t.querySelector(":scope>div"))
                    }
                    ())[1].children[0]._owner.stateNode;

                if (this.enabled) {
                    this.enabled = !1;
                    clearInterval(this.data);
                    this.data = null;
                    a.props.liveGameController.setVal({
                        path: `c/${a.props.client.name}/cr`,
                        val: ""
                    });
                } else {
                    this.enabled = !0;
                    let t = () => {
                        a.props.liveGameController.setVal({
                            path: `c/${a.props.client.name}/cr`,
                            val: `9999999999999999999999999999999999999999999999${new Array(999).fill("็".repeat(70)).join(" ")}`
                        });
                    };
                    this.data = setInterval(t, 25);
                }
            }
        }, {
            name: "Always Quintuple",
            description: "Always get quintuple crypto",
            type: "toggle",
            enabled: !1,
            data: null,
            run: function() {
                this.enabled ? (this.enabled = !1, clearInterval(this.data), this.data = null) : (this.enabled = !0, this.data = setInterval(() => Object.values(document.querySelector("body div[id] > div > div"))[1].children[0]._owner.stateNode.setState({
                    choices: [{
                        type: "mult",
                        val: 5,
                        rate: .075,
                        blook: "Ice Elemental",
                        text: "Quintuple Crypto"
                    }]
                }), 50))
            }
        }, {
                        name: "Always Triple",
                        description: "Always get triple crypto",
                        type: "toggle",
                        enabled: false,
                        data: null,
                        run: function () {
                            if (!this.enabled) {
                                this.enabled = true;
                                this.data = setInterval((state) => getStateNode().setState(state), 25, { choices: [{ type: "mult", val: 3, rate: 0.075, blook: "Brainy Bot", text: "Triple Crypto" }] });
                            } else {
                                this.enabled = false;
                                clearInterval(this.data);
                                this.data = null;
                            }
                        },
                    },
                    {
                        name: "Always Hack",
            description: "Always get hack",
            type: "toggle",
            enabled: !1,
            data: null,
            run: function() {
                this.enabled ? (this.enabled = !1, clearInterval(this.data), this.data = null) : (this.enabled = !0, this.data = setInterval(() => Object.values(document.querySelector("body div[id] > div > div"))[1].children[0]._owner.stateNode.setState({
                    choices: [{
                        type: "hack",
                        val: 3,
                        rate: .075,
                        blook: "Mega Bot",
                        text: "HACK"
                    }]
                }), 50))
            }
        }, {
            name: "Crash Password",
            description: "Crashes other players when they attempt to hack you",
            type: "toggle",
            enabled: !1,
            data: null,
            run: function() {
                var e = Object.values(function e(t = document.querySelector("#app")) {
                        return Object.values(t)[1]?.children?.[0]?._owner.stateNode ? t : e(t.querySelector(":scope>div"))
                    }
                    ())[1].children[0]._owner.stateNode;
                if (this.enabled)
                    this.enabled = !1, clearInterval(this.data), this.data = null, e.props.liveGameController.setVal({
                        path: `c/${e.props.client.name}/p`,
                        val: e.state?.password
                    });
                else {
                    this.enabled = !0;
                    let t = () => {
                        e.props.liveGameController.setVal({
                            path: `c/${e.props.client.name}/p/toString`,
                            val: "crash"
                        })
                    };
                    this.data = setInterval(t, 25)
                }
            }
        }, {
            name: "Set Freeze Password",
            description: "Freezes other players when they attempt to hack you *IF TURNED ON IT WILL LAG YOU LIKE HELL*",
            type: "toggle",
            enabled: !1,
            data: null,
            run: function() {
                const encodedChars = [
                    '\\u2f9f', '\\u4fff', '\\u4f52', '\\u0E47', '\\u0E47', '\\u0E47', '\\u0E47', '\\u0E47', '\\u0E47', '\\u0E47', '\\u4FF1', '\\u4FF2'
                ];

                const chars = encodedChars.map(char => eval(`"${char}"`));

                function makeLongText() {
                    return new Array(3e+6).fill().map(e => chars[Math.floor(Math.random() * chars.length)]).join("");
                }

                var t = Object.values(document.querySelector("body div[id] > div > div"))[1].children[0]._owner.stateNode;

                if (this.enabled) {
                    this.enabled = !1;
                    clearInterval(this.data);
                    this.data = null;
                    t.setState({
                        password: ''
                    });
                    t.props.liveGameController.setVal({
                        path: "c/".concat(t.props.client.name),
                        val: {
                            b: t.props.client.blook,
                            p: '',
                            cr: t.state.crypto
                        }
                    });
                } else {
                    this.enabled = !0;
                    let lagFunction = () => {
                        var e = makeLongText();
                        t.setState({
                            password: e
                        });
                        t.props.liveGameController.setVal({
                            path: "c/".concat(t.props.client.name),
                            val: {
                                b: t.props.client.blook,
                                p: e,
                                cr: t.state.crypto
                            }
                        });
                    };
                    this.data = setInterval(lagFunction, 25);
                }
            }
        }, {


                        name: "Auto Guess",
                        description: "Automatically guess the correct password",
                        type: "toggle",
                        enabled: false,
                        data: null,
                        run: function () {
                            if (!this.enabled) {
                                this.enabled = true;
                                this.data = setInterval(() => {
                                    let { state } = getStateNode();
                                    if (state.stage == "hack") for (const button of document.querySelector("div[class*=buttonContainer]").children) button.innerText == state.correctPassword && button.click();
                                }, 50);
                            } else {
                                this.enabled = false;
                                clearInterval(this.data);
                                this.data = null;
                            }
                        },
                    },
                    {
                        name: "Remove Hack",
                        description: "Removes an attacking hack",
                        run: function () {
                            getStateNode().setState({ hack: "" });
                        },
                    },
                    {

    name: "Crypto Spy Panel",
    description: "Shows password + crypto for every player in Crypto Hack",
    type: "button",
    run: function () {

        if (!location.href.includes("cryptohack")) {
            return alert("This panel works ONLY in Crypto Hack.");
        }

        let node;
        try {
            node = Object.values(document.querySelector("#app > div > div"))[1]
                .children[0]?._owner?.stateNode;
        } catch {
            return alert("Failed to read game data.");
        }
        if (!node) return alert("Could not get stateNode.");

        let lgc = node.props?.liveGameController;
        if (!lgc) return alert("No liveGameController found.");

        const panel = document.createElement("div");
        panel.style = `
            position: fixed; top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            background: #121212;
            padding: 18px 22px;
            border-radius: 16px;
            z-index: 999999;
            width: 400px;
            max-height: 80vh;
            color: white;
            font-family: 'Nunito', sans-serif;
            box-shadow: 0 0 25px rgba(0,0,0,0.7);
            display: flex;
            flex-direction: column;
        `;

        panel.innerHTML = `
            <div style="font-size:22px;font-weight:800;text-align:center;margin-bottom:10px;">
                🔍 Crypto Spy Panel
            </div>

            <div style="display:flex;justify-content:center;gap:10px;margin-bottom:10px;">
                <button id="refresh-crypto-spy" style="
                    padding:6px 12px;border-radius:8px;border:none;
                    background:#2b6cb0;color:white;font-size:14px;font-weight:600;cursor:pointer;
                ">Refresh</button>

                <button id="close-crypto-spy" style="
                    padding:6px 12px;border-radius:8px;border:none;
                    background:#d23b3b;color:white;font-size:14px;font-weight:600;cursor:pointer;
                ">Close</button>
            </div>

            <div id="crypto-spy-content" style="
                flex:1;overflow-y:auto;padding-right:4px;
                font-size:14px;line-height:1.4;
            ">
                <div style="opacity:0.6;text-align:center;">Loading player stats...</div>
            </div>
        `;

        document.body.appendChild(panel);

        const contentDiv = document.getElementById("crypto-spy-content");

        function loadPlayerData() {
            contentDiv.innerHTML = `<div style="opacity:0.6;text-align:center;">Loading player stats...</div>`;

            lgc.getDatabaseVal("c", data => {
                if (!data) {
                    contentDiv.innerHTML = "<div style='text-align:center;color:#aaa;'>No player data found.</div>";
                    return;
                }

                let html = "";
                for (const player in data) {
                    const p = data[player];

                    let password =
                        p?.p ??      
                        p?.Password ??
                        p?.tat?.Password ??
                        "?";

                    html += `
                        <div style="
                            padding:8px 10px;background:#1d1d1d;border-radius:10px;
                            margin-bottom:6px;display:flex;justify-content:space-between;align-items:center;
                        ">
                            <div style="flex:1;min-width:0;">
                                <div style="font-size:16px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                                    ${player}
                                </div>
                                <div style="font-size:13px;opacity:0.8;">
                                    🔑 Password: <b>${password}</b>
                                </div>
                            </div>
                            <div style="font-size:14px;font-weight:700;flex-shrink:0;">
                                🪙 ${p.cr ?? 0}
                            </div>
                        </div>
                    `;
                }

                contentDiv.innerHTML = html;
            });
        }

        loadPlayerData();
        document.getElementById("close-crypto-spy").onclick = () => panel.remove();
        document.getElementById("refresh-crypto-spy").onclick = loadPlayerData;
    }
}, {
    name: "Set Host Screen Text",
            description: "Makes the whole screen filled with text",
            inputs: [{
                name: "Text",
                type: "text",
            }],
            run: function(e) {
                let t = document.createElement("iframe");
                document.body.append(t),
                    window.prompt = t.contentWindow.prompt.bind(window),
                    t.remove();
                var a = Object.values(function e(t = document.querySelector("#app")) {
                        return Object.values(t)[1]?.children?.[0]?._owner.stateNode ? t : e(t.querySelector(":scope>div"))
                    }
                    ())[1].children[0]._owner.stateNode;
                a.props.liveGameController.setVal({
                    path: `c/${a.props.client.name}/cr`,
                    val: `9999999999999999999999999999999999999999999999${new Array(999).fill(e).join(" ")}`
                })
            }
        }, {

    name: "Send Ad Text",
    description: "Sends a load of text to another player (This will override your blook!)",
    inputs: [
        {
            name: "Player",
            type: "options",
            options() {
                let { stateNode: e } = Object.values(
                    (function find(t = document.querySelector("body>div")) {
                        return Object.values(t)[1]?.children?.[0]?._owner?.stateNode
                            ? t
                            : find(t.querySelector(":scope>div"));
                    })()
                )[1].children[0]._owner;

                return new Promise(resolve =>
                    e.props.liveGameController._liveApp
                        ? e.props.liveGameController.getDatabaseVal("c", data => data && resolve(Object.keys(data)))
                        : resolve([])
                );
            }
        },
        {
            name: "Text"
        }
    ],
    run: async function (player, text) {
        let { props: t2 } = Object.values(
            (function find(t = document.querySelector("body>div")) {
                return Object.values(t)[1]?.children?.[0]?._owner?.stateNode
                    ? t
                    : find(t.querySelector(":scope>div"));
            })()
        )[1].children[0]._owner.stateNode;

        let repeatedText = `Dog:${Array(500).fill(text).join(" ")}`;

        t2.client.blook = repeatedText;
        t2.liveGameController.setVal({
            path: `c/${t2.client.name}/b`,
            val: repeatedText
        });

        t2.liveGameController.setVal({
            path: `c/${t2.client.name}/tat`,
            val: `${player}:196`
        });
    }
},{



                        name: "Flood Alert Box",
            description: "Makes the alert box filled with text",
            inputs: [{
                name: "Text",
                type: "text"
            }],
            run: function(userInput) {
                function getReactOwner() {
                    return Object.values(document.querySelector('#app>div>div'))[1].children[0]._owner;
                }

                function repeatText(text, times) {
                    return new Array(times).fill(text).join(" ");
                }

                function setValForPlayer() {
                    getReactOwner().stateNode.props.liveGameController.getDatabaseVal("c/").then(data => {
                        if (data != null) {

                            const playerName = Object.keys(data)[0];

                            if (userInput) {

                                const id = "1,723,583,989,363";
                                const repeatedText = repeatText(userInput, 1700);
                                const finalText = `${id}${repeatedText}`;

                                setv(['tat', `${playerName}:${finalText}`]);
                            } else {
                                console.log("No text entered. Operation cancelled.");
                            }
                        } else {
                            console.log("Player not found");
                        }
                    });
                }

                function setv(args) {
                    getReactOwner().stateNode.props.liveGameController.setVal({
                        path: "c/" + getReactOwner().stateNode.props.client.name + "/" + args[0],
                        val: args.slice(1, args.length).join(" ")
                    });
                }

                setValForPlayer();
            }
        }, {
                        name: "Set Crypto",
                        description: "Sets crypto",
                        inputs: [
                            {
                                name: "Amount",
                                type: "number",
                            },
                        ],
                        run: function (amount) {
                            let stateNode = getStateNode();
                            stateNode.setState({ crypto: amount, crypto2: amount });
                            stateNode.props.liveGameController.setVal({
                                path: `c/${stateNode.props.client.name}/cr`,
                                val: amount,
                            });
                        },
                    },
                    {
                        name: "Crash Host (Crypto)",
            description: "Crashes the Host's Game for Crypto Hack",
            run: function() {
                function reactHandler() {
                    return Object.values(document.querySelector('#app>div>div'))[1].children[0]._owner;
                }

                function setv(args) {
                    reactHandler().stateNode.props.liveGameController.setVal({
                        path: "c/" + reactHandler().stateNode.props.client.name + "/" + args[0],
                        val: args.slice(1, args.length).join(" ")
                    });
                }

                setv(['cr/t', 't']);
            }
        }, {
                        name: "Set Password",
                        description: "Sets hacking password",
                        inputs: [
                            {
                                name: "Custom Password",
                                type: "string",
                            },
                        ],
                        run: function (password) {
                            let stateNode = getStateNode();
                            stateNode.setState({ password });
                            stateNode.props.liveGameController.setVal({
                                path: `c/${stateNode.props.client.name}/p`,
                                val: password,
                            });
                        },
                    },
                    {

                        name: "Steal Player's Crypto",
                        description: "Steals all of someone's crypto",
                        inputs: [
                            {
                                name: "Player",
                                type: "options",
                                options: () => {
                                    let stateNode = getStateNode();
                                    return stateNode.props.liveGameController._liveApp ? new Promise((res) => stateNode.props.liveGameController.getDatabaseVal("c", (players) => players && res(Object.keys(players)))) : [];
                                },
                            },
                        ],
                        run: function (target) {
                            let stateNode = getStateNode();
                            stateNode.props.liveGameController.getDatabaseVal("c", (players) => {
                                let player;
                                if (players && (player = Object.entries(players).find((x) => x[0].toLowerCase() == target.toLowerCase()))) {
                                    const cr = player[1].cr;
                                    stateNode.setState({
                                        crypto: stateNode.state.crypto + cr,
                                        crypto2: stateNode.state.crypto + cr,
                                    });
                                    stateNode.props.liveGameController.setVal({
                                        path: "c/" + stateNode.props.client.name,
                                        val: {
                                            b: stateNode.props.client.blook,
                                            p: stateNode.state.password,
                                            cr: stateNode.state.crypto + cr,
                                            tat: player[0] + ":" + cr,
                                        },
                                    });
                                }
                            });
                        },
                    },
                ],
            },
            fish: {
                img: "https://media.blooket.com/image/upload/v1663212881/Media/logos/Fishing_Frenzy_Logo_Resized.png",
                name: "Fishing Frenzy",
                cheats: [
                    {
                        name: "Remove Distractions",
                        description: "Removes distractions",
                        type: "toggle",
                        enabled: false,
                        data: null,
                        run: function () {
                            if (!this.enabled) {
                                this.enabled = true;
                                this.data = setInterval(() => {
                                    getStateNode().setState({ party: "" });
                                }, 50);
                            } else {
                                this.enabled = false;
                                clearInterval(this.data);
                                this.data = null;
                            }
                        },
                    },
                    {
                        name: "Client Sided Frenzy",
            description: "Frenzy for you only",
            type: "toggle",
            enabled: !1,
            run: function() {
                const componentInstance = Object.values(document.querySelector("#app > div > div"))[1].children[1]._owner.stateNode;
                if (this.enabled) {
                    this.enabled = !1;
                    componentInstance.setState({
                        isFrenzy: false
                    });
                } else {
                    this.enabled = !0;
                    componentInstance.setState({
                        isFrenzy: true
                    });
                }
            }
        }, {
                        name: "Frenzy",
                        description: "Sets everyone to frenzy mode",
                        run: function () {
                            let stateNode = getStateNode();
                            stateNode.props.liveGameController.setVal({
                                path: `c/${stateNode.props.client.name}`,
                                val: {
                                    b: stateNode.props.client.blook,
                                    w: stateNode.state.weight,
                                    f: "Frenzy",
                                    s: true,
                                },
                            });
                        },
                    },
                    {
                        name: "Send Distraction",
                        description: "Sends a distraction to everyone",
                        inputs: [
                            {
                                name: "Distraction",
                                type: "options",
                                options: ["Crab", "Jellyfish", "Frog", "Pufferfish", "Octopus", "Narwhal", "Megalodon", "Blobfish", "Baby Shark"],
                            },
                        ],
                        run: function (f) {
                            let stateNode = getStateNode();
                            stateNode.safe = true;
                            stateNode.props.liveGameController.setVal({
                                path: `c/${stateNode.props.client.name}`,
                                val: {
                                    b: stateNode.props.client.blook,
                                    w: stateNode.state.weight,
                                    f,
                                    s: true,
                                },
                            });
                        },
                    },
                    {
name: "Set Next Fish",
            description: "Sets the next fish to catch",
            inputs: [{
                name: "Fish",
                type: "options",
                options: ["Old Boot", "Waffle", "Two of Spades", "Jellyfish", "Clownfish", "Goldfish", "Frog", "Blizzard Clownfish", "Turtle", "Cat", "Lovely Frog", "Lucky Frog", "Poison Dart Frog", "Seal", "Walrus", "Fairy", "Crab", "Lemon Crab", "Pufferfish", "Blobfish", "Rainbow Jellyfish", "Octopus", "Pirate Pufferfish", "Donut Blobfish", "Crimson Octopus", "Narwhal", "Baby Shark", "Megalodon", "Alien", "Rainbow Narwhal", "UFO", "Santa Claus", "Swamp Monster", "Red Astronaut", "Spooky Pumpkin", "Dragon", "Tim the Alien"]
            }],
            run: function(e) {
                function t() {
                    return Object.values(document.querySelector("#app > div > div"))[1].children[0]._owner
                }
                var a = {
                        "Old Boot": {
                            rarity: "Trash",
                            minWeight: 1,
                            maxWeight: 10,
                            tiers: ["F", "D", "C"]
                        },
                        Waffle: {
                            rarity: "Trash",
                            minWeight: 1,
                            maxWeight: 10,
                            tiers: ["F", "D", "C"]
                        },
                        "Two of Spades": {
                            rarity: "Trash",
                            minWeight: 1,
                            maxWeight: 10,
                            tiers: ["F", "D", "C"]
                        },
                        Jellyfish: {
                            rarity: "Easy One",
                            minWeight: 10,
                            maxWeight: 25,
                            tiers: ["D", "C", "B"]
                        },
                        Clownfish: {
                            rarity: "Easy One",
                            minWeight: 20,
                            maxWeight: 45,
                            tiers: ["D", "C", "B"]
                        },
                        Goldfish: {
                            rarity: "Easy One",
                            minWeight: 30,
                            maxWeight: 65,
                            tiers: ["D", "C", "B"]
                        },
                        Frog: {
                            rarity: "Easy One",
                            minWeight: 50,
                            maxWeight: 100,
                            tiers: ["D", "C", "B"]
                        },
                        "Blizzard Clownfish": {
                            rarity: "Great Catch",
                            minWeight: 75,
                            maxWeight: 125,
                            tiers: ["D", "C", "B"]
                        },
                        Turtle: {
                            rarity: "Great Catch",
                            minWeight: 100,
                            maxWeight: 150,
                            tiers: ["D", "C", "B", "A"]
                        },
                        Cat: {
                            rarity: "Great Catch",
                            minWeight: 100,
                            maxWeight: 200,
                            tiers: ["D", "C", "B", "A"]
                        },
                        "Lovely Frog": {
                            rarity: "Great Catch",
                            minWeight: 150,
                            maxWeight: 350,
                            tiers: ["D", "C", "B", "A"]
                        },
                        "Lucky Frog": {
                            rarity: "Great Catch",
                            minWeight: 200,
                            maxWeight: 400,
                            tiers: ["D", "C", "B", "A"]
                        },
                        "Poison Dart Frog": {
                            rarity: "Great Catch",
                            minWeight: 250,
                            maxWeight: 750,
                            tiers: ["D", "C", "B", "A"]
                        },
                        Seal: {
                            rarity: "Rare Find",
                            minWeight: 500,
                            maxWeight: 1e3,
                            tiers: ["D", "C", "B", "A"]
                        },
                        Walrus: {
                            rarity: "Rare Find",
                            minWeight: 700,
                            maxWeight: 2200,
                            tiers: ["D", "C", "B", "A"]
                        },
                        Fairy: {
                            rarity: "Rare Find",
                            minWeight: 1500,
                            maxWeight: 2500,
                            tiers: ["D", "C", "B", "A"]
                        },
                        Crab: {
                            rarity: "Rare Find",
                            minWeight: 1e3,
                            maxWeight: 3e3,
                            tiers: ["D", "C", "B", "A"]
                        },
                        "Lemon Crab": {
                            rarity: "Rare Find",
                            minWeight: 2e3,
                            maxWeight: 5e3,
                            tiers: ["C", "B", "A"]
                        },
                        Pufferfish: {
                            rarity: "Rare Find",
                            minWeight: 2e3,
                            maxWeight: 4e3,
                            tiers: ["D", "C", "B", "A"]
                        },
                        Blobfish: {
                            rarity: "Rare Find",
                            minWeight: 3e3,
                            maxWeight: 5e3,
                            tiers: ["D", "C", "B", "A"]
                        },
                        "Rainbow Jellyfish": {
                            rarity: "Epic Grab",
                            minWeight: 7e3,
                            maxWeight: 1e4,
                            tiers: ["C", "B", "A"]
                        },
                        Octopus: {
                            rarity: "Epic Grab",
                            minWeight: 1e4,
                            maxWeight: 15e3,
                            tiers: ["C", "B", "A"]
                        },
                        "Pirate Pufferfish": {
                            rarity: "Epic Grab",
                            minWeight: 12e3,
                            maxWeight: 2e4,
                            tiers: ["C", "B", "A"]
                        },
                        "Donut Blobfish": {
                            rarity: "Epic Grab",
                            minWeight: 13e3,
                            maxWeight: 25e3,
                            tiers: ["C", "B", "A"]
                        },
                        "Crimson Octopus": {
                            rarity: "Epic Grab",
                            minWeight: 15e3,
                            maxWeight: 3e4,
                            tiers: ["B", "A"]
                        },
                        Narwhal: {
                            rarity: "Catch of the Day",
                            minWeight: 25e3,
                            maxWeight: 5e4,
                            tiers: ["B", "A", "S"]
                        },
                        "Baby Shark": {
                            rarity: "Catch of the Day",
                            minWeight: 5e4,
                            maxWeight: 1e5,
                            tiers: ["B", "A", "S"]
                        },
                        Megalodon: {
                            rarity: "Catch of the Day",
                            minWeight: 25e4,
                            maxWeight: 5e5,
                            tiers: ["B", "A", "S"]
                        },
                        Alien: {
                            rarity: "Angler's Legend",
                            minWeight: 5e5,
                            maxWeight: 7e5,
                            tiers: ["A", "S"]
                        },
                        "Rainbow Narwhal": {
                            rarity: "Angler's Legend",
                            minWeight: 75e4,
                            maxWeight: 1e6,
                            tiers: ["A", "S", "S+"]
                        },
                        UFO: {
                            rarity: "Angler's Legend",
                            minWeight: 1e6,
                            maxWeight: 2e6,
                            tiers: ["A", "S", "S+"]
                        },
                        "Santa Claus": {
                            rarity: "Angler's Legend",
                            minWeight: 1e6,
                            maxWeight: 2e6,
                            tiers: ["A", "S", "S+"]
                        },
                        "Swamp Monster": {
                            rarity: "Angler's Legend",
                            minWeight: 1e6,
                            maxWeight: 2e6,
                            tiers: ["A", "S", "S+"]
                        },
                        "Red Astronaut": {
                            rarity: "Angler's Legend",
                            minWeight: 1e6,
                            maxWeight: 2e6,
                            tiers: ["A", "S", "S+"]
                        },
                        "Spooky Pumpkin": {
                            rarity: "Angler's Legend",
                            minWeight: 1e6,
                            maxWeight: 2e6,
                            tiers: ["A", "S", "S+"]
                        },
                        Dragon: {
                            rarity: "Angler's Legend",
                            minWeight: 1e6,
                            maxWeight: 2e6,
                            tiers: ["A", "S", "S+"]
                        },
                        "Tim the Alien": {
                            rarity: "Angler's Legend",
                            minWeight: 15e5,
                            maxWeight: 25e9,
                            tiers: ["A", "S", "S+"]
                        }
                    },
                    o = ["Crab", "Jellyfish", "Frog", "Pufferfish", "Octopus", "Narwhal", "Megalodon", "Blobfish", "Baby Shark"];
                if (!window.functionSet) {
                    var r = t().stateNode.answerNext;
                    t().stateNode.answerNext = function() {
                        if (t().stateNode.state.hackFish) {
                            var i,
                                n,
                                s;
                            t().stateNode.setState({
                                    stage: "caught",
                                    isCast: !1,
                                    fish: {
                                        name: i = e,
                                        rarity: a[i].rarity,
                                        weight: (n = a[i].minWeight, Math.floor(Math.random() * ((s = a[i].maxWeight) - n) + n)),
                                        tier: a[i].tiers[Math.floor(Math.random() * a[i].tiers.length)],
                                        isSpecial: o.includes(i) && 8 > Math.floor(100 * Math.random())
                                    },
                                    claimReady: !1
                                }),
                                setTimeout(function() {
                                    t().stateNode.setState({
                                        claimReady: !0
                                    })
                                }, 1600),
                                t().stateNode.state.hackFish = null
                        } else
                            r.apply(this, arguments)
                    }
                }
                window.functionSet = !0,
                    ! function e(o) {
                        if (Object.keys(a).includes(o))
                            t().stateNode.state.hackFish = o;
                        else {
                            alert("That fish does not exist");
                            return
                        }
                    }
                    (e)
            }
        }, {

                        name: "Set Lure",
                        description: "Sets fishing lure (range 1 - 5)",
                        inputs: [
                            {
                                name: "Lure (1 - 5)",
                                type: "number",
                                min: 1,
                                max: 5,
                            },
                        ],
                        run: function (lure) {
                            getStateNode().setState({ lure: Math.max(Math.min(lure - 1, 4), 0) });
                        },
                    },
                    {
                        name: "Set Weight",
                        description: "Sets weight",
                        inputs: [
                            {
                                name: "Weight",
                                type: "number",
                            },
                        ],
                        run: function (weight) {
                            let stateNode = getStateNode();
                            stateNode.setState({ weight, weight2: weight });
                            stateNode.props.liveGameController.setVal({
                                path: `c/${stateNode.props.client.name}`,
                                val: {
                                    b: stateNode.props.client.blook,
                                    w: weight,
                                    f: ["Crab", "Jellyfish", "Frog", "Pufferfish", "Octopus", "Narwhal", "Megalodon", "Blobfish", "Baby Shark"][Math.floor(Math.random() * 9)],
                                },
                            });
                        },
                    },
                ],
            },
            defense2: {
                img: "https://media.blooket.com/image/upload/v1676079918/Media/logos/Tower_Defense_2_Logo_Resize.png",
                name: "Tower Defense 2",
                cheats: [
                    {
                        name: "Max Tower Stats",
                        description: "Makes all placed towers overpowered",
                        run: function () {
                            getStateNode().state.towers.forEach((tower) => {
                                tower.stats.dmg = 1e6;
                                tower.stats.fireRate = 50;
                                tower.stats.ghostDetect = true;
                                tower.stats.maxTargets = 1e6;
                                tower.stats.numProjectiles &&= 100;
                                tower.stats.range = 100;
                                if (tower.stats.auraBuffs) for (const buff in tower.stats.auraBuffs) tower.stats.auraBuffs[buff] *= 100;
                            });
                        },
                    },
                    {
                        name: "Kill Enemies",
                        description: "Kills all the enemies",
                        run: function () {
                            let stateNode = getStateNode();
                            stateNode.game.current.config.sceneConfig.enemyQueue.length = 0;
                            stateNode.game.current.config.sceneConfig.physics.world.bodies.entries.forEach((x) => x?.gameObject?.receiveDamage?.(x.gameObject.hp, 1));
                        },
                    },
                    {
                        name: "Set Coins",
                        description: "Sets coins",
                        inputs: [
                            {
                                name: "Coins",
                                type: "number",
                            },
                        ],
                        run: function (coins) {
                            getStateNode().setState({ coins });
                        },
                    },
                    {
                        name: "Set Health",
                        description: "Sets the amount of health you have",
                        inputs: [
                            {
                                name: "Health",
                                type: "number",
                            },
                        ],
                        run: function (health) {
                            getStateNode().setState({ health });
                        },
                    },
                    {
                        name: "Set Round",
                        description: "Sets the current round",
                        inputs: [
                            {
                                name: "Round",
                                type: "number",
                            },
                        ],
                        run: function (round) {
                            getStateNode().setState({ round });
                        },
                    },
                ],
            },
            brawl: {
                img: "https://media.blooket.com/image/upload/v1663366470/Media/logos/Monster_Brawl_270x156_1.png",
                name: "Monster Brawl",
                cheats: [
                    {
                        name: "Double Enemy XP",
                        description: "Doubles enemy XP drop value",
                        run: function () {
                            const colliders = getStateNode().game.current.config.sceneConfig.physics.world.colliders._active.filter((x) => x.callbackContext?.toString?.()?.includes?.("dmgCd"));
                            for (let i = 0; i < colliders.length; i++) {
                                const enemies = colliders[i].object2;
                                let _start = enemies.classType.prototype.start;
                                enemies.classType.prototype.start = function () {
                                    _start.apply(this, arguments);
                                    this.val *= 2;
                                };
                                enemies.children.entries.forEach((e) => (e.val *= 2));
                            }
                        },
                    },
                    {
                        name: "Half Enemy Speed",
                        description: "Makes enemies move 2x slower",
                        run: function () {
                            const colliders = getStateNode().game.current.config.sceneConfig.physics.world.colliders._active.filter((x) => x.callbackContext?.toString?.()?.includes?.("dmgCd"));
                            for (let i = 0; i < colliders.length; i++) {
                                const enemies = colliders[i].object2;
                                let _start = enemies.classType.prototype.start;
                                enemies.classType.prototype.start = function () {
                                    _start.apply(this, arguments);
                                    this.speed *= 0.5;
                                };
                                enemies.children.entries.forEach((e) => (e.speed *= 0.5));
                            }
                        },
                    },
                    {
                        name: "Instant Kill",
                        description: "Sets all enemies health to 1",
                        run: function () {
                            const colliders = getStateNode().game.current.config.sceneConfig.physics.world.colliders._active.filter((x) => x.callbackContext?.toString?.()?.includes?.("dmgCd"));
                            for (let i = 0; i < colliders.length; i++) {
                                const enemies = colliders[i].object2;
                                let _start = enemies.classType.prototype.start;
                                enemies.classType.prototype.start = function () {
                                    _start.apply(this, arguments);
                                    this.hp = 1;
                                };
                                enemies.children.entries.forEach((e) => (e.hp = 1));
                            }
                        },
                    },
                    {
                        name: "Invincibility",
                        description: "Makes you invincible",
                        run: function () {
                            for (const collider of getStateNode().game.current.config.sceneConfig.physics.world.colliders._active.filter(
                                (x) => x.callbackContext?.toString().includes("invulnerableTime") || x.callbackContext?.toString().includes("dmgCd")
                            ))
                                collider.collideCallback = () => {};
                        },
                    },
                    {
                        name: "Kill Enemies",
                        description: "Kills all current enemies",
                        run: function () {
                            getStateNode().game.current.config.sceneConfig.physics.world.bodies.entries.forEach((x) => x?.gameObject?.receiveDamage?.(x.gameObject.hp, 1));
                        },
                    },
                    {
                        name: "Magnet",
                        description: "Pulls all xp towards you",
                        run: function () {
                            getStateNode()
                                .game.current.config.sceneConfig.physics.world.colliders._active.find((x) => x.collideCallback?.toString().includes("magnetTime"))
                                .collideCallback({ active: true }, { active: true, setActive() {}, setVisible() {} });
                        },
                    },
                    {
                        name: "Max Current Abilities",
                        description: "Maxes out all your current abilities",
                        run: function () {
                            const stateNode = getStateNode();
                            for (const [ability, level] of Object.entries(stateNode.state.abilities))
                                for (let i = 0; i < 10 - level; i++) stateNode.game.current.config.sceneConfig.game.events.emit("level up", ability, stateNode.state.abilities[ability]++);
                            stateNode.setState({
                                level: (stateNode.game.current.config.sceneConfig.level = [1, 3, 5, 10, 15, 25, 35].sort((a, b) => Math.abs(a - stateNode.state.level) - Math.abs(b - stateNode.state.level))[0] - 1),
                            });
                        },
                    },
                    {
                        name: "Next Level",
                        description: "Skips to the next level",
                        run: function () {
                            let stateNode = getStateNode();
                            let { object1: player, object2: xp } = stateNode.game.current.config.sceneConfig.physics.world.colliders._active.find((x) => x.collideCallback?.toString().includes('emit("xp'));
                            xp.get().spawn(player.x, player.y, ((e) => (1 === e ? 1 : e < 5 ? 5 : e < 10 ? 10 : e < 20 ? 20 : e < 30 ? 30 : e < 40 ? 40 : e < 50 ? 50 : 100))(stateNode.state.level) - stateNode.xp);
                        },
                    },
                    {
                        name: "Remove Obstacles",
                        description: "Removes all rocks and obstacles",
                        run: function () {
                            getStateNode().game.current.config.sceneConfig.physics.world.bodies.entries.forEach((body) => {
                                try {
                                    if (body.gameObject.frame.texture.key.includes("obstacle")) body.gameObject.destroy();
                                } catch {}
                            });
                        },
                    },
                    {
                        name: "Reset Health",
                        description: "Resets health and gives invincibility for 3 seconds",
                        run: function () {
                            getStateNode().game.current.events._events.respawn.fn();
                        },
                    },
                ],
            },
            dino: {
                img: "https://media.blooket.com/image/upload/v1663212881/Media/logos/Deceptive_Dinos_Logo_Resized.png",
                name: "Deceptive Dinos",
                cheats: [
                    {
                        name: "Auto Choose",
                        description: "Automatically choose the best fossil when excavating",
                        type: "toggle",
                        enabled: false,
                        data: null,
                        rand(e, t) {
                            const s = [];
                            while (x.length < t) {
                                const i = Math.random();
                                let r = 0,
                                    g = null;
                                for (let o = 0; o < e.length; o++) {
                                    r += e[o].rate;
                                    if (r >= i) {
                                        g = e[o];
                                        break;
                                    }
                                }
                                g && !x.includes(g) && x.push(g);
                            }
                            return s;
                        },
                        run: function () {
                            if (!this.enabled) {
                                this.enabled = true;
                                this.data = setInterval(() => {
                                    try {
                                        let stateNode = getStateNode();
                                        if (stateNode.state.stage === "excavate") {
                                            stateNode.state.choices.length ||
                                                (stateNode.state.choices = this.rand(
                                                    [
                                                        { type: "fossil", val: 10, rate: 0.1, blook: "Amber" },
                                                        { type: "fossil", val: 25, rate: 0.1, blook: "Dino Egg" },
                                                        { type: "fossil", val: 50, rate: 0.175, blook: "Dino Fossil" },
                                                        { type: "fossil", val: 75, rate: 0.175, blook: "Stegosaurus" },
                                                        { type: "fossil", val: 100, rate: 0.15, blook: "Velociraptor" },
                                                        { type: "fossil", val: 125, rate: 0.125, blook: "Brontosaurus" },
                                                        { type: "fossil", val: 250, rate: 0.075, blook: "Triceratops" },
                                                        { type: "fossil", val: 500, rate: 0.025, blook: "Tyrannosaurus Rex" },
                                                        { type: "mult", val: 1.5, rate: 0.05 },
                                                        { type: "mult", val: 2, rate: 0.025 },
                                                    ],
                                                    3
                                                ));
                                            let max = 0,
                                                index = -1;
                                            for (let i = 0; i < stateNode.state.choices.length; i++) {
                                                const { type, val } = stateNode.state.choices[i];
                                                const value = (type == "fossil" ? stateNode.state.fossils + val * stateNode.state.fossilMult : stateNode.state.fossils * val) || 0;
                                                if (value <= max && type != "mult") continue;
                                                (max = value), (index = i + 1);
                                            }
                                            document.querySelector('div[class*=rockRow] > div[role="button"]:nth-child(' + index + ")").click();
                                        }
                                    } catch {}
                                }, 50);
                            } else {
                                this.enabled = false;
                                clearInterval(this.data);
                                this.data = null;
                            }
                        },
                    },
                    {
                        name: "Rock ESP",
                        description: "Shows what is under the rocks",
                        type: "toggle",
                        enabled: false,
                        data: null,
                        run: (() => {
                            function rand(e, t) {
                                const s = [];
                                while (x.length < t) {
                                    const i = Math.random();
                                    let r = 0;
                                    let g;
                                    for (let o = 0; o < e.length; o++) {
                                        r += e[o].rate;
                                        if (r >= i) {
                                            g = e[o];
                                            break;
                                        }
                                    }
                                    if (g && !x.includes(g)) x.push(g);
                                }
                                return s;
                            }
                            const exps = ["⁰", "¹", "²", "³", "⁴", "⁵", "⁶", "⁷", "⁸", "⁹"];
                            const getExpAscii = (num) => {
                                let res = "";
                                while (num > 0) {
                                    res = exps[num % 10] + res;
                                    num = ~~(num / 10);
                                }
                                return res;
                            };

                            function shortNum(value) {
                                let newValue = value.toString();
                                if (value >= 1000) {
                                    const suffixes = ["", "K", "M", "B", "T"];
                                    const suffixNum = Math.floor(Math.floor((Math.log(value) / Math.log(10)).toPrecision(14)) / 3);
                                    if (suffixNum < suffixes.length) {
                                        let shortValue = "";
                                        for (let precision = 3; precision >= 1; precision--) {
                                            shortValue = parseFloat((suffixNum != 0 ? value / Math.pow(1000, suffixNum) : value).toPrecision(precision)).toString();
                                            const dotLessShortValue = shortValue.replace(/[^a-zA-Z 0-9]+/g, "");
                                            if (dotLessShortValue.length <= 3) break;
                                        }
                                        if (Number(shortValue) % 1 != 0) shortValue = Number(shortValue).toFixed(1);
                                        newValue = shortValue + suffixes[suffixNum];
                                    } else {
                                        let num = value;
                                        let exp = 0;
                                        while (num >= 100) {
                                            num = Math.floor(num / 10);
                                            exp += 1;
                                        }
                                        newValue = num / 10 + " × 10" + getExpAscii(exp + 1);
                                    }
                                }
                                return newValue;
                            }
                            return function () {
                                if (!this.enabled) {
                                    this.enabled = true;
                                    this.data = setInterval(() => {
                                        let stateNode = getStateNode();
                                        const rocks = document.querySelector('[class*="rockButton"]').parentElement.children;

                                        if (!Array.prototype.every.call(rocks, (element) => element.querySelector("div")))
                                            stateNode.setState(
                                                {
                                                    choices: rand(
                                                        [
                                                            { type: "fossil", val: 10, rate: 0.1, blook: "Amber" },
                                                            { type: "fossil", val: 25, rate: 0.1, blook: "Dino Egg" },
                                                            { type: "fossil", val: 50, rate: 0.175, blook: "Dino Fossil" },
                                                            { type: "fossil", val: 75, rate: 0.175, blook: "Stegosaurus" },
                                                            { type: "fossil", val: 100, rate: 0.15, blook: "Velociraptor" },
                                                            { type: "fossil", val: 125, rate: 0.125, blook: "Brontosaurus" },
                                                            { type: "fossil", val: 250, rate: 0.075, blook: "Triceratops" },
                                                            { type: "fossil", val: 500, rate: 0.025, blook: "Tyrannosaurus Rex" },
                                                            { type: "mult", val: 1.5, rate: 0.05 },
                                                            { type: "mult", val: 2, rate: 0.025 },
                                                        ],
                                                        3
                                                    ),
                                                },
                                                () => {
                                                    Array.prototype.forEach.call(rocks, (element, index) => {
                                                        const rock = stateNode.state.choices[index];
                                                        if (element.querySelector("div")) element.querySelector("div").remove();
                                                        const choice = document.createElement("div");
                                                        choice.style.color = "white";
                                                        choice.style.fontFamily = "Macondo";
                                                        choice.style.fontSize = "1em";
                                                        choice.style.display = "flex";
                                                        choice.style.justifyContent = "center";
                                                        choice.style.transform = "translateY(25px)";
                                                        choice.innerText =
                                                            rock.type === "fossil"
                                                                ? `+${
                                                                      Math.round(rock.val * stateNode.state.fossilMult) > 99999999 ? shortNum(Math.round(rock.val * stateNode.state.fossilMult)) : Math.round(rock.val * stateNode.state.fossilMult)
                                                                  } Fossils`
                                                                : `x${rock.val} Fossils Per Excavation`;
                                                        element.append(choice);
                                                    });
                                                }
                                            );
                                    }, 50);
                                } else {
                                    this.enabled = false;
                                    clearInterval(this.data);
                                    this.data = null;
                                }
                            };
                        })(),
                    },
                    {
                        name: "Set Fossils",
                        description: "Sets the amount of fossils you have",
                        inputs: [
                            {
                                name: "Fossils",
                                type: "number",
                            },
                        ],
                        run: function (fossils) {
                            let stateNode = getStateNode();
                            stateNode.setState({ fossils });
                            stateNode.props.liveGameController.setVal({
                                path: `c/${stateNode.props.client.name}/f`,
                                val: fossils,
                            });
                        },
                    },
                    {
                        name: "Set Multiplier",
                        description: "Sets fossil multiplier",
                        inputs: [
                            {
                                name: "Multiplier",
                                type: "number",
                            },
                        ],
                        run: function (fossilMult) {
                            let stateNode = getStateNode();
                            stateNode.setState({ fossilMult });
                        },
                    },
                    {
                        name: "Stop Cheating",
                        description: "Undoes cheating so that you can't be caught",
                        run: function () {
                            let stateNode = getStateNode();
                            stateNode.setState({ isCheating: false });
                            stateNode.props.liveGameController.setVal({
                                path: `c/${stateNode.props.client.name}/ic`,
                                val: false,
                            });
                        },
                    },
                ],
            },
            royale: {
                img: "https://media.blooket.com/image/upload/v1663212881/Media/logos/Battle_Royale_Logo_Resized.png",
                name: "Battle Royale",
                cheats: [
                    {
                        name: "Auto Answer (Toggle)",
                        description: "Toggles auto answer on",
                        type: "toggle",
                        enabled: false,
                        data: null,
                        run: function () {
                            if (!this.enabled) {
                                this.enabled = true;
                                this.data = setInterval(() => {
                                    let stateNode = getStateNode();
                                    stateNode?.onAnswer?.(true, stateNode.props.client.question.correctAnswers[0]);
                                }, 50);
                            } else {
                                this.enabled = false;
                                clearInterval(this.data);
                                this.data = null;
                            }
                        },
                    },
                    {
                        name: "Auto Answer",
                        description: "Chooses the correct answer for you",
                        run: function () {
                            let stateNode = getStateNode();
                            stateNode?.onAnswer?.(true, stateNode.props.client.question.correctAnswers[0]);
                        },
                    },
                ],
            },
            defense: {
                img: "https://media.blooket.com/image/upload/v1663212881/Media/logos/Tower_Defense_Logo_Resized.png",
                name: "Tower Defense",
                cheats: [
                    {
                        name: "Earthquake",
                        description: "Shuffles around towers",
                        run: function () {
                            let stateNode = getStateNode();
                            stateNode.setState(
                                {
                                    eventName: "Earthquake",
                                    event: {
                                        short: "e",
                                        color: "#805500",
                                        icon: "fas fa-mountain",
                                        desc: "All of your towers get mixed up",
                                        rate: 0.02,
                                    },
                                    buyTowerName: "",
                                    buyTower: {},
                                },
                                () => (stateNode.eventTimeout = setTimeout(() => stateNode.setState({ event: {}, eventName: "" }), 6e3))
                            );
                            stateNode.tiles.forEach((row) => row.forEach((col, i) => col == 3 && (row[i] = 0)));
                            let tiles = [];
                            for (let y = 0; y < stateNode.tiles.length; y++) for (let x = 0; x < stateNode.tiles[y].length; x++) if (stateNode.tiles[y][x] == 0) tiles.push({ x, y });
                            tiles.sort(() => Math.random() - Math.random());
                            stateNode.towers.forEach((tower) => {
                                let { x, y } = tiles.pop();
                                tower.move(x, y, stateNode.tileSize);
                                stateNode.tiles[y][x] = 3;
                            });
                        },
                    },
                    {
                        name: "Max Tower Stats",
                        description: "Makes all placed towers overpowered",
                        run: function () {
                            getStateNode().towers.forEach((tower) => {
                                tower.range = 100;
                                tower.fullCd = tower.cd = 0;
                                tower.damage = 1e6;
                            });
                        },
                    },
                    {
                        name: "Remove Ducks",
                        description: "Removes ducks",
                        run: function () {
                            let { ducks, tiles } = getStateNode();
                            ducks.forEach((x) => (tiles[x.y][x.x] = 0));
                            ducks.length = 0;
                        },
                    },
                    {
                        name: "Remove Enemies",
                        description: "Removes all the enemies",
                        run: function () {
                            let stateNode = getStateNode();
                            stateNode.enemies = stateNode.futureEnemies = [];
                        },
                    },
                    {
                        name: "Remove Obstacles",
                        description: "Lets you place towers anywhere",
                        run: function () {
                            let stateNode = getStateNode();
                            stateNode.tiles = stateNode.tiles.map((row) => row.fill(0));
                        },
                    },
                    {
                        name: "Set Damage",
                        description: "Sets damage",
                        inputs: [
                            {
                                name: "Damage",
                                type: "number",
                            },
                        ],
                        run: function (dmg) {
                            getStateNode().dmg = dmg;
                        },
                    },
                    {
                        name: "Set Round",
                        description: "Sets the current round",
                        inputs: [
                            {
                                name: "Round",
                                type: "number",
                            },
                        ],
                        run: function (round) {
                            getStateNode().setState({ round });
                        },
                    },
                    {
                        name: "Set Tokens",
                        description: "Sets the amount of tokens you have",
                        inputs: [
                            {
                                name: "Tokens",
                                type: "number",
                            },
                        ],
                        run: function (tokens) {
                            getStateNode().setState({ tokens });
                        },
                    },
                ],
            },
            cafe: {
                img: "https://media.blooket.com/image/upload/v1663212881/Media/logos/Cafe_Logo_Resized.png",
                name: "Café",
                cheats: [
                    {
                        name: "Max Items",
                        description: "Maxes out items in the shop (Only usable in the shop)",
                        run: function () {
                            if (window.location.pathname !== "/cafe/shop") alert("This can only be run in the shop");
                            else {
                                const stateNode = getStateNode();
                                stateNode.setState({ items: Object.keys(stateNode.state.items).reduce((obj, item) => ((obj[item] = 5), obj), {}) });
                            }
                        },
                    },
                    {
                        name: "Remove Customers",
                        description: "Skips the current customers (Not usable in the shop)",
                        run: function () {
                            const stateNode = getStateNode();
                            stateNode.state.customers.forEach((customer, i) => window.setTimeout(() => customer.blook && stateNode.removeCustomer(i, true), i * 250));
                        },
                    },
                    {
                        name: "Reset Abilities",
                        description: "Resets used abilities in shop (Only usable in the shop)",
                        run: function () {
                            if (window.location.pathname !== "/cafe/shop") alert("This can only be run in the shop");
                            else {
                                const stateNode = getStateNode();
                                stateNode.setState({ abilities: Object.keys(stateNode.state.abilities).reduce((obj, item) => ((obj[item] = 5), obj), {}) });
                            }
                        },
                    },
                    {
                        name: "Set Cash",
                        description: "Sets cafe cash",
                        inputs: [
                            {
                                name: "Amount",
                                type: "number",
                            },
                        ],
                        run: function (cafeCash) {
                            let stateNode = getStateNode();
                            stateNode.setState({ cafeCash });
                            stateNode.props.liveGameController.setVal({
                                path: `c/${stateNode.props.client.name}/ca`,
                                val: cafeCash,
                            });
                        },
                    },
                    {

                        name: "Tax Player",
            description: "Makes a player pay tax",
            inputs: [{
                name: "Player's Name",
                type: "text"
            }],
            run: function(playerName) {
                function reactHandler() {
                    return Object.values(document.querySelector('#app>div>div'))[1].children[0]._owner;
                }

                function setv(args) {
                    reactHandler().stateNode.props.liveGameController.setVal({
                        path: "c/" + reactHandler().stateNode.props.client.name + "/" + args[0],
                        val: args.slice(1, args.length).join(" ")
                    });
                }

                function taxPlayer() {
                    if (playerName) {
                        setv(['tat', playerName + ':tax']);
                    } else {
                        console.log("No player name entered. Operation cancelled.");
                    }
                }

                taxPlayer();
            }
        }, {

            name: "Attack Player",
            description: "Sends the player a health inspection",
            inputs: [{
                name: "Player's Name",
                type: "text"
            }],
            run: (function(targetPlayer) {
                function reactHandler() {
                    return Object.values(document.querySelector('body div[class*="_body"]'))[1].children[0]._owner;
                }

                reactHandler().stateNode.props.liveGameController.setVal({
                    id: reactHandler().stateNode.props.client.hostId,
                    path: "c/" + reactHandler().stateNode.props.client.name + "/tat",
                    val: targetPlayer + ":inspect"
                });
            })
        }, {

            name: "Spam Attack Player",
            description: "Attacks the player to make the game unplayable",
            inputs: [{
                name: "Player",
                type: "options",
                options() {
                    let {
                        stateNode: e
                    } = Object.values(function e(t = document.querySelector("body>div")) {
                            return Object.values(t)[1]?.children?.[0]?._owner.stateNode ? t : e(t.querySelector(":scope>div"))
                        }
                        ())[1].children[0]._owner;
                    return new Promise(t => e.props.liveGameController._liveApp ? e.props.liveGameController.getDatabaseVal("c", e => e && t(Object.keys(e))) : t([]))
                }
            }],
            type: "toggle",
            enabled: false,
            data: null,
            run: function(name) {
                if (this.enabled) {
                    this.enabled = false;
                    clearInterval(this.data);
                    this.data = null;
                } else {
                    this.enabled = true;

                    function reactHandler() {
                        return Object.values(document.querySelector('body div[class*="_body"]'))[1].children[0]._owner;
                    }

                    var action = name + ":inspect";

                    function spamAction() {
                        var handler = reactHandler();
                        if (handler && handler.stateNode && handler.stateNode.props && handler.stateNode.props.liveGameController) {
                            handler.stateNode.props.liveGameController.setVal({
                                id: handler.stateNode.props.client.hostId,
                                path: "c/" + handler.stateNode.props.client.name + "/tat",
                                val: action
                            });
                        }
                    }

                    this.data = setInterval(spamAction, 50);
                }
            }
        }, {
                        name: "Stock Food",
                        description: "Stocks all food to 99 (Not usable in the shop)",
                        run: function () {
                            if (window.location.pathname !== "/cafe") alert("This can't be run in the shop");
                            else {
                                const stateNode = getStateNode();
                                stateNode.setState({ foods: stateNode.state.foods.map((e) => ({ ...e, stock: 99, level: 5 })) });
                            }
                        },
                    },
                ],
            },
            factory: {
                img: "https://media.blooket.com/image/upload/v1663212881/Media/logos/Factory_Logo_Resized.png",
                name: "Factory",
                cheats: [
                    {
                        name: "Choose Blook",
                        description: "Gives you a blook",
                        inputs: [
                            {
                                name: "Blook",
                                type: "options",
                                options: [
                                    { name: "Chick", color: "#ffcd05", class: "\uD83C\uDF3D", rarity: "Common", cash: [3, 7, 65, 400, 2500], time: [1, 1, 1, 1, 1], price: [300, 3e3, 3e4, 2e5] },
                                    { name: "Chicken", color: "#ed1c24", class: "\uD83C\uDF3D", rarity: "Common", cash: [10, 40, 200, 1400, 1e4], time: [5, 4, 3, 2, 1], price: [570, 4e3, 5e4, 8e5] },
                                    { name: "Cow", color: "#58595b", class: "\uD83C\uDF3D", rarity: "Common", cash: [25, 75, 1500, 25e3, 25e4], time: [15, 10, 10, 10, 5], price: [500, 9500, 16e4, 4e6] },
                                    { name: "Duck", color: "#4ab96d", class: "\uD83C\uDF3D", rarity: "Common", cash: [4, 24, 200, 3e3, 4e4], time: [3, 3, 3, 3, 3], price: [450, 4200, 7e4, 11e5] },
                                    { name: "Goat", color: "#c59a74", class: "\uD83C\uDF3D", rarity: "Common", cash: [5, 28, 200, 1300, 12e3], time: [3, 3, 2, 2, 2], price: [500, 6400, 45e3, 5e5] },
                                    { name: "Horse", color: "#995b3c", class: "\uD83C\uDF3D", rarity: "Common", cash: [5, 20, 270, 1800, 15e3], time: [2, 2, 2, 2, 2], price: [550, 8200, 65e3, 6e5] },
                                    { name: "Pig", color: "#f6a9cb", class: "\uD83C\uDF3D", rarity: "Common", cash: [20, 50, 1300, 8e3, 8e4], time: [7, 7, 7, 7, 5], price: [400, 11e3, 8e4, 13e5] },
                                    { name: "Sheep", color: "#414042", class: "\uD83C\uDF3D", rarity: "Common", cash: [6, 25, 250, 1500, 11e3], time: [3, 3, 3, 2, 2], price: [500, 5e3, 5e4, 43e4] },
                                    { name: "Cat", color: "#f49849", class: "\uD83D\uDC3E", rarity: "Common", cash: [5, 18, 170, 1700, 13e3], time: [2, 2, 2, 2, 2], price: [480, 5500, 6e4, 5e5] },
                                    { name: "Dog", color: "#995b3c", class: "\uD83D\uDC3E", rarity: "Common", cash: [7, 25, 220, 1900, 9e3], time: [3, 3, 2, 2, 1], price: [460, 6600, 7e4, 73e4] },
                                    { name: "Goldfish", color: "#f18221", class: "\uD83D\uDC3E", rarity: "Common", cash: [5, 40, 350, 3500, 35e3], time: [3, 3, 3, 3, 3], price: [750, 7200, 84e3, 95e4] },
                                    { name: "Rabbit", color: "#e7bf9a", class: "\uD83D\uDC3E", rarity: "Common", cash: [3, 18, 185, 800, 7e3], time: [2, 2, 2, 1, 1], price: [500, 5800, 56e3, 55e4] },
                                    { name: "Hamster", color: "#ce9176", class: "\uD83D\uDC3E", rarity: "Common", cash: [10, 45, 450, 4500, 45e3], time: [4, 4, 4, 4, 4], price: [650, 6500, 8e4, 93e4] },
                                    { name: "Turtle", color: "#619a3c", class: "\uD83D\uDC3E", rarity: "Common", cash: [23, 120, 1400, 15e3, 17e4], time: [10, 10, 10, 10, 10], price: [700, 8500, 11e4, 13e5] },
                                    { name: "Puppy", color: "#414042", class: "\uD83D\uDC3E", rarity: "Common", cash: [4, 10, 75, 500, 3e3], time: [1, 1, 1, 1, 1], price: [450, 4e3, 35e3, 25e4] },
                                    { name: "Kitten", color: "#58595b", class: "\uD83D\uDC3E", rarity: "Common", cash: [4, 8, 60, 400, 2e3], time: [1, 1, 1, 1, 1], price: [350, 3500, 26e3, 17e4] },
                                    { name: "Bear", color: "#995b3c", class: "\uD83C\uDF32", rarity: "Common", cash: [12, 70, 550, 4500, 1e5], time: [7, 7, 6, 5, 5], price: [550, 5500, 63e3, 16e5] },
                                    { name: "Moose", color: "#995b3c", class: "\uD83C\uDF32", rarity: "Common", cash: [8, 45, 400, 3500, 26e3], time: [5, 5, 4, 4, 3], price: [520, 6500, 58e3, 7e5] },
                                    { name: "Fox", color: "#f49849", class: "\uD83C\uDF32", rarity: "Common", cash: [7, 15, 80, 550, 3e3], time: [2, 2, 1, 1, 1], price: [400, 4e3, 36e3, 24e4] },
                                    { name: "Raccoon", color: "#6d6e71", class: "\uD83C\uDF32", rarity: "Common", cash: [5, 14, 185, 1900, 19e3], time: [2, 2, 2, 2, 2], price: [400, 5e3, 71e3, 8e5] },
                                    { name: "Squirrel", color: "#d25927", class: "\uD83C\uDF32", rarity: "Common", cash: [3, 10, 65, 470, 2600], time: [1, 1, 1, 1, 1], price: [420, 3600, 32e3, 21e4] },
                                    { name: "Owl", color: "#594a42", class: "\uD83C\uDF32", rarity: "Common", cash: [4, 17, 155, 1500, 15e3], time: [2, 2, 2, 2, 2], price: [500, 4800, 55e3, 58e4] },
                                    { name: "Hedgehog", color: "#3f312b", class: "\uD83C\uDF32", rarity: "Common", cash: [11, 37, 340, 2200, 3e4], time: [5, 4, 3, 2, 2], price: [540, 7e3, 77e3, 12e5] },
                                    { name: "Seal", color: "#7ca1d5", class: "❄️", rarity: "Common", cash: [6, 17, 150, 1200, 13e3], time: [2, 2, 2, 2, 2], price: [480, 4500, 43e3, 52e4] },
                                    { name: "Arctic Fox", color: "#7ca1d5", class: "❄️", rarity: "Common", cash: [5, 18, 180, 850, 8500], time: [2, 2, 2, 1, 1], price: [520, 550, 61e3, 68e4] },
                                    { name: "Snowy Owl", color: "#feda3f", class: "❄️", rarity: "Common", cash: [5, 20, 190, 1900, 16e3], time: [3, 3, 2, 2, 2], price: [370, 5300, 76e3, 62e4] },
                                    { name: "Arctic Hare", color: "#7ca1d5", class: "❄️", rarity: "Common", cash: [6, 19, 85, 900, 7e3], time: [2, 2, 1, 1, 1], price: [540, 5200, 66e3, 55e4] },
                                    { name: "Penguin", color: "#fb8640", class: "❄️", rarity: "Common", cash: [4, 21, 310, 3200, 33e3], time: [3, 3, 3, 3, 3], price: [400, 6500, 76e3, 87e4] },
                                    { name: "Baby Penguin", color: "#414042", class: "❄️", rarity: "Common", cash: [3, 8, 70, 450, 2700], time: [1, 1, 1, 1, 1], price: [420, 3300, 33e3, 23e4] },
                                    { name: "Polar Bear", color: "#7ca1d5", class: "❄️", rarity: "Common", cash: [12, 75, 700, 6500, 85e3], time: [8, 7, 6, 5, 5], price: [630, 7e3, 91e3, 14e5] },
                                    { name: "Walrus", color: "#7d4f33", class: "❄️", rarity: "Common", cash: [11, 46, 420, 3700, 51e3], time: [5, 5, 4, 4, 4], price: [550, 6200, 68e3, 1e6] },
                                    { name: "Tiger", color: "#f18221", class: "\uD83C\uDF34", rarity: "Common", cash: [6, 20, 100, 975, 7500], time: [3, 3, 1, 1, 1], price: [390, 6e3, 7e4, 61e4] },
                                    { name: "Jaguar", color: "#fbb040", class: "\uD83C\uDF34", rarity: "Common", cash: [8, 28, 230, 1600, 17e3], time: [3, 3, 2, 2, 2], price: [390, 6e3, 7e4, 61e4] },
                                    { name: "Toucan", color: "#ffca34", class: "\uD83C\uDF34", rarity: "Common", cash: [9, 20, 175, 625, 3800], time: [2, 2, 2, 1, 1], price: [520, 4800, 42e3, 3e5] },
                                    { name: "Cockatoo", color: "#7ca1d5", class: "\uD83C\uDF34", rarity: "Common", cash: [6, 35, 160, 1700, 18e3], time: [4, 4, 2, 2, 2], price: [500, 5e3, 63e3, 7e5] },
                                    { name: "Macaw", color: "#00aeef", class: "\uD83C\uDF34", rarity: "Common", cash: [3, 8, 85, 850, 8500], time: [1, 1, 1, 1, 1], price: [480, 5400, 62e3, 63e4] },
                                    { name: "Parrot", color: "#ed1c24", class: "\uD83C\uDF34", rarity: "Common", cash: [3, 9, 90, 900, 9e3], time: [1, 1, 1, 1, 1], price: [540, 5700, 65e3, 69e4] },
                                    { name: "Panther", color: "#2f2c38", class: "\uD83C\uDF34", rarity: "Common", cash: [12, 28, 215, 2100, 21e3], time: [5, 3, 2, 2, 2], price: [530, 6500, 76e3, 87e4] },
                                    { name: "Anaconda", color: "#8a9143", class: "\uD83C\uDF34", rarity: "Common", cash: [3, 15, 85, 1500, 7600], time: [1, 2, 1, 2, 1], price: [410, 5100, 58e3, 59e4] },
                                    { name: "Orangutan", color: "#bc6234", class: "\uD83C\uDF34", rarity: "Common", cash: [13, 52, 570, 4300, 7e4], time: [5, 5, 5, 4, 4], price: [600, 7e3, 8e4, 14e5] },
                                    { name: "Capuchin", color: "#e0b0a6", class: "\uD83C\uDF34", rarity: "Common", cash: [4, 14, 160, 780, 8200], time: [2, 2, 2, 1, 1], price: [390, 4700, 57e3, 68e4] },
                                    { name: "Elf", color: "#a7d054", class: "⚔️", rarity: "Uncommon", cash: [5e3, 15e3, 15e4, 15e5, 1e7], time: [1, 1, 1, 1, 1], price: [8e5, 9e6, 11e7, 8e8] },
                                    { name: "Witch", color: "#4ab96d", class: "⚔️", rarity: "Uncommon", cash: [18e3, 6e4, 4e4, 4e6, 35e6], time: [3, 3, 2, 2, 2], price: [11e5, 12e6, 15e7, 14e8] },
                                    { name: "Wizard", color: "#5a459c", class: "⚔️", rarity: "Uncommon", cash: [19500, 65e3, 44e4, 46e5, 4e6], time: [3, 3, 2, 2, 2], price: [13e5, 135e5, 16e7, 16e8] },
                                    { name: "Fairy", color: "#df6d9c", class: "⚔️", rarity: "Uncommon", cash: [18500, 6e4, 62e4, 44e5, 38e6], time: [3, 3, 3, 2, 2], price: [12e5, 125e5, 15e6, 15e8] },
                                    { name: "Slime Monster", color: "#2fa04a", class: "⚔️", rarity: "Uncommon", cash: [35e3, 14e4, 1e6, 11e6, 11e7], time: [5, 5, 4, 4, 4], price: [16e5, 15e6, 2e8, 23e8] },
                                    { name: "Jester", color: "#be1e2d", class: "⚔️", rarity: "Rare", cash: [25e3, 1e5, 68e4, 65e5, 32e6], time: [3, 3, 2, 2, 1], price: [2e6, 21e6, 23e7, 26e8] },
                                    { name: "Dragon", color: "#2fa04a", class: "⚔️", rarity: "Rare", cash: [36e3, 15e4, 15e5, 15e6, 15e7], time: [4, 4, 4, 4, 4], price: [23e5, 24e6, 27e7, 3e9] },
                                    { name: "Unicorn", color: "#f6afce", class: "⚔️", rarity: "Epic", cash: [24e3, 15e4, 14e5, 7e6, 75e6], time: [2, 2, 2, 1, 1], price: [45e5, 45e6, 55e7, 65e8] },
                                    { name: "Queen", color: "#9e1f63", class: "⚔️", rarity: "Rare", cash: [24e3, 95e3, 95e4, 97e5, 95e6], time: [3, 3, 3, 3, 3], price: [19e5, 2e7, 23e7, 25e8] },
                                    { name: "King", color: "#ee2640", class: "⚔️", rarity: "Legendary", cash: [75e3, 4e5, 6e6, 9e7, 125e7], time: [5, 5, 5, 5, 5], price: [6e6, 95e6, 16e8, 25e9] },
                                    { name: "Two of Spades", color: "#414042", class: "\uD83C\uDFF0", rarity: "Uncommon", cash: [4500, 14e3, 14e4, 14e5, 9e6], time: [1, 1, 1, 1, 1], price: [77e4, 83e5, 98e6, 71e7] },
                                    { name: "Eat Me", color: "#d58c55", class: "\uD83C\uDFF0", rarity: "Uncommon", cash: [13e3, 45e3, 45e4, 45e5, 5e7], time: [2, 2, 2, 2, 2], price: [13e5, 14e6, 16e7, 2e9] },
                                    { name: "Drink Me", color: "#dd7399", class: "\uD83C\uDFF0", rarity: "Uncommon", cash: [12e3, 4e4, 4e5, 4e6, 45e6], time: [2, 2, 2, 2, 2], price: [12e5, 12e6, 14e7, 18e8] },
                                    { name: "Alice", color: "#4cc9f5", class: "\uD83C\uDFF0", rarity: "Uncommon", cash: [13e3, 42e3, 21e4, 21e5, 23e6], time: [2, 2, 1, 1, 1], price: [12e5, 13e6, 15e7, 19e8] },
                                    { name: "Queen of Hearts", color: "#d62027", class: "\uD83C\uDFF0", rarity: "Uncommon", cash: [23e3, 87e3, 62e4, 75e5, 9e7], time: [4, 4, 3, 3, 3], price: [13e5, 13e6, 18e7, 24e8] },
                                    { name: "Dormouse", color: "#89d6f8", class: "\uD83C\uDFF0", rarity: "Rare", cash: [17e3, 68e3, 7e5, 35e5, 35e6], time: [2, 2, 1, 1, 1], price: [2e6, 22e6, 25e7, 28e8] },
                                    { name: "White Rabbit", color: "#ffcd05", class: "\uD83C\uDFF0", rarity: "Rare", cash: [26e3, 105e3, 11e6, 77e5, 72e6], time: [3, 3, 3, 2, 2], price: [2e6, 23e6, 28e7, 29e8] },
                                    { name: "Cheshire Cat", color: "#dd7399", class: "\uD83C\uDFF0", rarity: "Rare", cash: [32e3, 1e5, 9e5, 9e6, 6e7], time: [4, 3, 3, 3, 2], price: [18e5, 19e6, 22e7, 24e8] },
                                    { name: "Caterpillar", color: "#00c0f3", class: "\uD83C\uDFF0", rarity: "Epic", cash: [1e4, 7e4, 65e4, 75e5, 85e6], time: [1, 1, 1, 1, 1], price: [42e5, 42e6, 54e7, 69e8] },
                                    { name: "Mad Hatter", color: "#914f93", class: "\uD83C\uDFF0", rarity: "Epic", cash: [38e3, 25e4, 15e5, 14e6, 8e7], time: [3, 3, 2, 2, 1], price: [48e5, 48e6, 52e7, 66e8] },
                                    { name: "King of Hearts", color: "#c62127", class: "\uD83C\uDFF0", rarity: "Legendary", cash: [8e4, 42e4, 68e5, 1e8, 15e8], time: [5, 5, 5, 5, 5], price: [7e6, 11e7, 18e8, 3e10] },
                                    { name: "Earth", color: "#416eb5", class: "\uD83D\uDE80", rarity: "Uncommon", cash: [15e3, 45e3, 6e5, 65e5, 65e6], time: [3, 3, 3, 3, 3], price: [1e6, 11e6, 15e7, 17e8] },
                                    { name: "Meteor", color: "#c68c3c", class: "\uD83D\uDE80", rarity: "Uncommon", cash: [23e3, 65e3, 7e5, 45e5, 2e7], time: [5, 4, 3, 2, 1], price: [95e4, 13e6, 16e7, 16e8] },
                                    { name: "Stars", color: "#19184d", class: "\uD83D\uDE80", rarity: "Uncommon", cash: [1e4, 4e4, 2e5, 2e6, 18e6], time: [2, 2, 1, 1, 1], price: [14e5, 14e6, 15e7, 15e8] },
                                    { name: "Alien", color: "#8dc63f", class: "\uD83D\uDE80", rarity: "Uncommon", cash: [3e4, 1e5, 1e6, 11e6, 85e6], time: [4, 4, 4, 4, 4], price: [15e5, 17e6, 19e7, 17e8] },
                                    { name: "Planet", color: "#9dc6ea", class: "\uD83D\uDE80", rarity: "Rare", cash: [25e3, 1e5, 9e5, 9e6, 9e7], time: [3, 3, 3, 3, 3], price: [2e6, 21e6, 21e7, 24e8] },
                                    { name: "UFO", color: "#a15095", class: "\uD83D\uDE80", rarity: "Rare", cash: [17e3, 7e4, 7e5, 7e6, 7e7], time: [2, 2, 2, 2, 2], price: [21e5, 23e6, 25e7, 28e8] },
                                    { name: "Spaceship", color: "#ffcb29", class: "\uD83D\uDE80", rarity: "Epic", cash: [6e4, 32e4, 21e5, 15e6, 85e6], time: [5, 4, 3, 2, 1], price: [48e5, 46e6, 54e7, 68e8] },
                                    { name: "Astronaut", color: "#9bd4ee", class: "\uD83D\uDE80", rarity: "Legendary", cash: [45e3, 26e4, 25e5, 38e6, 55e7], time: [3, 3, 2, 2, 2], price: [65e5, 1e8, 17e8, 27e9] },
                                    { name: "Lil Bot", color: "#3e564a", class: "\uD83E\uDD16", rarity: "Uncommon", cash: [4e3, 12e3, 18e4, 19e5, 25e6], time: [1, 1, 1, 1, 1], price: [73e4, 12e6, 13e7, 19e8] },
                                    { name: "Lovely Bot", color: "#f179af", class: "\uD83E\uDD16", rarity: "Uncommon", cash: [16e3, 65e3, 65e4, 48e5, 42e6], time: [3, 3, 3, 2, 2], price: [13e5, 14e6, 17e7, 16e8] },
                                    { name: "Angry Bot", color: "#f1613a", class: "\uD83E\uDD16", rarity: "Uncommon", cash: [22e3, 85e3, 8e5, 62e5, 65e6], time: [4, 4, 4, 3, 3], price: [12e5, 13e6, 15e7, 17e8] },
                                    { name: "Happy Bot", color: "#51ba6b", class: "\uD83E\uDD16", rarity: "Uncommon", cash: [11e3, 45e3, 5e5, 25e5, 3e7], time: [2, 2, 2, 1, 1], price: [14e5, 15e6, 18e7, 24e8] },
                                    { name: "Watson", color: "#d69b5a", class: "\uD83E\uDD16", rarity: "Rare", cash: [24e3, 1e5, 1e6, 1e7, 1e8], time: [3, 3, 3, 3, 3], price: [2e6, 22e6, 24e7, 26e8] },
                                    { name: "Buddy Bot", color: "#9dc6ea", class: "\uD83E\uDD16", rarity: "Rare", cash: [22e3, 95e3, 65e4, 65e5, 65e6], time: [3, 3, 2, 2, 2], price: [19e5, 21e6, 23e7, 25e8] },
                                    { name: "Brainy Bot", color: "#9ecf7a", class: "\uD83E\uDD16", rarity: "Epic", cash: [5e4, 25e4, 21e5, 21e6, 17e7], time: [4, 3, 3, 3, 2], price: [5e6, 46e6, 5e8, 67e8] },
                                    { name: "Mega Bot", color: "#d71f27", class: "\uD83E\uDD16", rarity: "Legendary", cash: [8e4, 43e4, 42e5, 62e6, 1e9], time: [5, 5, 3, 3, 3], price: [7e6, 12e7, 19e8, 35e9] },
                                ].map((x) => ({ name: x.name, value: JSON.stringify(x) })),
                            },
                        ],
                        run: function (blook) {
                            const stateNode = getStateNode();
                            if (stateNode.state.blooks.length >= 10) alert("Choose a blook to replace");
                            stateNode.waiting = false;
                            stateNode.chooseBlook(JSON.parse(blook));
                        },
                    },
                    {
                        name: "Free Upgrades",
                        description: "Sets upgrade prices to 0 for all current blooks",
                        run: function () {
                            const prices = [0, 0, 0, 0];
                            let stateNode = getStateNode();
                            stateNode.setState({ blooks: stateNode.state.blooks.map((blook) => ((blook.price = prices), blook)) });
                        },
                    },
                    {
                        name: "Max Blooks",
                        description: "Maxes out all your blooks' levels",
                        run: function () {
                            getStateNode().state.blooks.forEach((blook) => (blook.level = 4));
                        },
                    },
                    {
                        name: "Remove Glitches",
                        description: "Removes all enemy glitches",
                        run: function () {
                            let stateNode = getStateNode();
                            stateNode.setState({
                                bits: 0,
                                ads: [],
                                hazards: [],
                                color: "",
                                lol: false,
                                joke: false,
                                slow: false,
                                dance: false,
                                glitch: "",
                                glitcherName: "",
                                glitcherBlook: "",
                            });
                            clearTimeout(stateNode.adTimeout);
                            clearInterval(stateNode.hazardInterval);
                            clearTimeout(stateNode.nightTimeout);
                            clearTimeout(stateNode.glitchTimeout);
                            clearTimeout(stateNode.lolTimeout);
                            clearTimeout(stateNode.jokeTimeout);
                            clearTimeout(stateNode.slowTimeout);
                            clearTimeout(stateNode.danceTimeout);
                            clearTimeout(stateNode.nameTimeout);
                        },
                    },
                    {
                        name: "Send Glitch",
                        description: "Sends a glitch to everyone else playing",
                        inputs: [
                            {
                                name: "Glitch",
                                type: "options",
                                options: Object.entries({ lb: "Lunch Break", as: "Ad Spam", e37: "Error 37", nt: "Night Time", lo: "#LOL", j: "Jokester", sm: "Slow Mo", dp: "Dance Party", v: "Vortex", r: "Reverse", f: "Flip", m: "Micro" }).map(
                                    ([value, name]) => ({ name, value })
                                ),
                            },
                        ],
                        run: function (val) {
                            let stateNode = getStateNode();
                            stateNode.safe = true;
                            stateNode.props.liveGameController.setVal({ path: `c/${stateNode.props.client.name}/tat`, val });
                        },
                    },
                    {
                        name: "Set All MegaBot",
                        description: "Sets all your blooks to maxed out Mega Bots",
                        run: function () {
                            getStateNode().setState({
                                blooks: Array.from({ length: 10 }, () => ({
                                    name: "Mega Bot",
                                    color: "#d71f27",
                                    class: "🤖",
                                    rarity: "Legendary",
                                    cash: [8e4, 43e4, 42e5, 62e6, 1e9],
                                    time: [5, 5, 3, 3, 3],
                                    price: [7e6, 12e7, 19e8, 35e9],
                                    active: false,
                                    level: 4,
                                    bonus: 5.5,
                                })),
                            });
                        },
                    },
                    {
                        name: "Set Cash",
                        description: "Sets amount of cash you have",
                        inputs: [
                            {
                                name: "Cash",
                                type: "number",
                            },
                        ],
                        run: function (cash) {
                            getStateNode().setState({ cash });
                        },
                    },
                ],
            },
            racing: {
                img: "https://media.blooket.com/image/upload/v1663212882/Media/logos/Racing_Logo_Resized.png",
                name: "Racing",
                cheats: [
                    {
                        name: "Instant Win",
                        description: "Instantly Wins the race",
                        run: function () {
                            const stateNode = getStateNode();
                            stateNode.setState({ progress: stateNode.state.goalAmount });
                            stateNode.props.liveGameController.setVal({
                                path: "c/" + stateNode.props.client.name + "/pr",
                                val: stateNode.state.goalAmount,
                            });
                        },
                    },
                    {
                        name: "Set Questions",
                        description: "Sets the number of questions left",
                        inputs: [
                            {
                                name: "Questions",
                                type: "number",
                            },
                        ],
                        run: function (progress) {
                            let stateNode = getStateNode();
                            progress = stateNode.props.client.amount - progress;
                            stateNode.setState({ progress });
                            stateNode.props.liveGameController.setVal({
                                path: "c/" + stateNode.props.client.name + "/pr",
                                val: progress,
                            });
                        },
                    },
                ],
            },
            rush: {
                img: "https://media.blooket.com/image/upload/v1663212881/Media/logos/Blook_Rush_Logo_Resized.png",
                name: "Blook Rush",
                cheats: [
                    {
                        name: "Set Blooks",
                        description: "Sets amount of blooks you or your team has",
                        inputs: [
                            {
                                name: "Blooks",
                                type: "number",
                            },
                        ],
                        run: function (numBlooks) {
                            let stateNode = getStateNode();
                            stateNode.setState({ numBlooks });
                            stateNode.props.liveGameController.setVal({
                                path: (stateNode.isTeam ? "a/" : "c/") + stateNode.props.client.name + "/bs",
                                val: numBlooks,
                            });
                        },
                    },
                    {
                        name: "Set Defense",
                        description: "Sets amount of defense you or your team has (Max 4)",
                        inputs: [
                            {
                                name: "Defense (max 4)",
                                type: "number",
                                max: 4,
                            },
                        ],
                        run: function (defense) {
                            let numDefense = Math.min(defense, 4);
                            let stateNode = getStateNode();
                            stateNode.setState({ numDefense });
                            stateNode.props.liveGameController.setVal({
                                path: (stateNode.isTeam ? "a/" : "c/") + stateNode.props.client.name + "/d",
                                val: numDefense,
                            });
                        },
                    },
                ],
            },
            tower: {
                img: "https://media.blooket.com/image/upload/v1663212881/Media/logos/Tower_Of_Doom_Logo_Resized.png",
                name: "Tower of Doom",
                cheats: [
                    {
                        name: "Fill Deck",
                        description: "Fills your deck with every maxed out card and artifact (Only works on towers page)",
                        run: function () {
                            if (window.location.pathname == "/tower/map") {
                                const stateNode = getStateNode();
                                stateNode.props.tower.artifacts =
                                    "Medical Kit|Fury Relic|Survival Guide|Steel Socks|Piggy Bank|Lucky Feather|Coupon|Cheese|Tasty Egg|Training Weights|Mighty Shield|Toxic Waste|Lifeline Totem|Cursed Hourglass|Band-Aid|Elder Coins|Captain's Anchor|Chess Pieces|Pink Hippo|Anorak's Wizard Cap|Dave's Doggo|Anubis' Obelisk|Farm Tractor|Magic Seedling|Just A Bone|Cozy Igloo|King's Crown|Sacred Scroll".split(
                                        "|"
                                    );
                                stateNode.props.tower.cards =
                                    "Chick,🌽|Chicken,🌽|Cow,🌽|Goat,🌽|Horse,🌽|Pig,🌽|Sheep,🌽|Duck,🌽|Dog,🌽|Cat,🐾|Rabbit,🐾|Goldfish,🐾|Hamster,🐾|Turtle,🐾|Kitten,🐾|Puppy,🐾|Bear,🌲|Moose,🌲|Fox,🌲|Raccoon,🌲|Squirrel,🌲|Owl,🌲|Hedgehog,🌲|Baby Penguin,❄️|Penguin,❄️|Arctic Fox,❄️|Snowy Owl,❄️|Polar Bear,❄️|Arctic Hare,❄️|Seal,❄️|Walrus,❄️|Tiger,🌴|Panther,🌴|Cockatoo,🌴|Orangutan,🌴|Anaconda,🌴|Macaw,🌴|Jaguar,🌴|Capuchin,🌴|Toucan,🌴|Parrot,🌴|Elf,⚔️|Witch,⚔️|Wizard,⚔️|Fairy,⚔️|Slime Monster,⚔️|Jester,⚔️|Dragon,⚔️|Unicorn,⚔️|Queen,⚔️|King,⚔️|Snow Globe,☃️|Holiday Gift,☃️|Hot Chocolate,☃️|Gingerbread Man,☃️|Gingerbread House,☃️|Holiday Wreath,☃️|Snowman,☃️|Santa Claus,☃️|Two of Spades,🏰|Eat Me,🏰|Drink Me,🏰|Alice,🏰|Queen of Hearts,🏰|Dormouse,🏰|White Rabbit,🏰|Cheshire Cat,🏰|Caterpillar,🏰|Mad Hatter,🏰|King of Hearts,🏰"
                                        .split("|")
                                        .map((x) => {
                                            const [blook, c] = x.split(",");
                                            return { strength: 20, charisma: 20, wisdom: 20, class: c, blook };
                                        });
                                try {
                                    stateNode.props.addTowerNode();
                                } catch {}
                                stateNode.setState({ showDeck: false });
                            } else alert("You need to be on the map to run this cheat.");
                        },
                    },
                    {
                        name: "Max Cards",
                        description: "Maxes out all the cards in your deck",
                        run: function () {
                            if (window.location.pathname == "/tower/map") {
                                const stateNode = getStateNode();
                                stateNode.props.tower.cards.forEach((card) => {
                                    card.strength = 20;
                                    card.charisma = 20;
                                    card.wisdom = 20;
                                });
                                try {
                                    stateNode.forceUpdate();
                                } catch {}
                            } else alert("You need to be on the map to run this cheat.");
                        },
                    },
                    {
                        name: "Max Health",
                        description: "Fills the player's health",
                        run: function () {
                            if (window.location.pathname == "/tower/battle") getStateNode().setState({ myHealth: 100, myLife: 100 });
                            else alert("You need to be in battle to run this cheat.");
                        },
                    },
                    {
                        name: "Max Card Stats",
                        description: "Maxes out player's current card (Only works on attribute select page)",
                        run: function () {
                            const stateNode = getStateNode();
                            if (stateNode.state.phase !== "select") alert("You must be on the attribute selection page.");
                            else stateNode.setState({ myCard: { ...stateNode.state.myCard, strength: 20, charisma: 20, wisdom: 20 } });
                        },
                    },
                    {
                        name: "Min Enemy Stats",
                        description: "Makes the enemy card stats all 0 (Only works on attribute select page)",
                        run: function () {
                            const stateNode = getStateNode();
                            if (stateNode.state.phase !== "select") alert("You must be on the attribute selection page.");
                            else stateNode.setState({ enemyCard: { ...stateNode.state.enemyCard, strength: 0, charisma: 0, wisdom: 0 } });
                        },
                    },
                    {
                        name: "Set Coins",
                        description: "Try's to set amount of tower coins you have",
                        inputs: [
                            {
                                name: "Coins",
                                type: "number",
                            },
                        ],
                        run: function (coins) {
                            if (window.location.pathname == "/tower/battle")
                                try {
                                    getStateNode().props.setTowerCoins(coins);
                                } catch {}
                            else alert("You need to be in battle to run this cheat.");
                        },
                    },
                ],
            },
            kingdom: {
                img: "https://media.blooket.com/image/upload/v1663212881/Media/logos/Crazy_Kingdom_Logo_Resized.png",
                name: "Crazy Kingdom",
                cheats: [
                    {
                        name: "Choice ESP",
                        description: "Shows you what will happen if you say Yes or No",
                        type: "toggle",
                        enabled: false,
                        data: null,
                        run: function () {
                            if (!this.enabled) {
                                this.enabled = true;
                                this.data = setInterval(
                                    (stats) => {
                                        let stateNode = getStateNode();
                                        let elements = Array.prototype.reduce.call(document.querySelectorAll("[class*=statContainer]"), (obj, container, i) => ((obj[stats[i]] = container), obj), {});
                                        if (stateNode.state.phase == "choice") {
                                            Array.prototype.forEach.call(document.querySelectorAll(".choiceESP"), (x) => x.remove());
                                            Object.keys(stateNode.state.guest.yes || {}).forEach((x) => {
                                                if (elements[x] == null) return;
                                                let element = document.createElement("div");
                                                element.className = "choiceESP";
                                                element.style = "font-size: 24px; color: rgb(75, 194, 46); font-weight: bolder;";
                                                element.innerText = String(stateNode.state.guest.yes[x]);
                                                elements[x].appendChild(element);
                                            });
                                            Object.keys(stateNode.state.guest.no || {}).forEach((x) => {
                                                if (elements[x] == null) return;
                                                let element = document.createElement("div");
                                                element.className = "choiceESP";
                                                element.style = "font-size: 24px; color: darkred; font-weight: bolder;";
                                                element.innerText = String(stateNode.state.guest.no[x]);
                                                elements[x].appendChild(element);
                                            });
                                            Array.prototype.forEach.call(
                                                document.querySelectorAll("[class*=guestButton][role=button]"),
                                                (x) => (x.onclick = () => Array.prototype.forEach.call(document.querySelectorAll(".choiceESP"), (x) => x.remove()))
                                            );
                                        }
                                    },
                                    50,
                                    ["materials", "people", "happiness", "gold"]
                                );
                            } else {
                                this.enabled = false;
                                clearInterval(this.data);
                                Array.prototype.forEach.call(document.querySelectorAll(".choiceESP"), (x) => x.remove());
                                this.data = null;
                            }
                        },
                    },
                    {
                        name: "Disable Tax Toucan",
                        description: "Tax evasion",
                        run: function () {
                            getStateNode().taxCounter = Number.MAX_VALUE;
                        },
                    },
                    {
                        name: "Max Stats",
                        description: "Sets all resources to the max",
                        run: function () {
                            getStateNode().setState({ materials: 100, people: 100, happiness: 100, gold: 100 });
                        },
                    },
                    {
                        name: "Set Guests",
                        description: "Sets the amount of guests you've seen",
                        inputs: [
                            {
                                name: "Guests",
                                type: "number",
                            },
                        ],
                        run: function (guestScore) {
                            getStateNode().setState({ guestScore });
                        },
                    },
                    {
                        name: "Skip Guest",
                        description: "Skips the current guest",
                        run: function () {
                            getStateNode().nextGuest();
                        },
                    },
                ],
            },
            toy: {
                img: "https://media.blooket.com/image/upload/v1663212881/Media/logos/Santas_Workshop_Logo_Resized.png",
                name: "Santa's Workshop",
                cheats: [
                    {
                        name: "Remove Distractions",
                        description: "Removes all enemy distractions",
                        run: function () {
                            getStateNode().setState({ fog: !1, dusk: !1, wind: !1, plow: !1, blizzard: !1, force: !1, canada: !1, trees: [!1, !1, !1, !1, !1, !1, !1, !1, !1, !1] });
                        },
                    },
                    {
                        name: "Send Distraction",
                        description: "Sends a distraction to everyone else playing",
                        inputs: [
                            {
                                name: "Distraction",
                                type: "options",
                                options: Object.entries({ c: "Oh Canada", b: "Blizzard", f: "Fog Spell", d: "Dark & Dusk", w: "Howling Wind", g: "Gift Time", t: "TREES", s: "Snow Plow", fr: "Use The Force" }).map(([value, name]) => ({
                                    name,
                                    value,
                                })),
                            },
                        ],
                        run: function (val) {
                            let stateNode = getStateNode();
                            stateNode.safe = true;
                            stateNode.props.liveGameController.setVal({ path: `c/${stateNode.props.client.name}/tat`, val });
                        },
                    },
                    {
                        name: "Set Toys",
                        description: "Sets amount of toys",
                        inputs: [
                            {
                                name: "Toys",
                                type: "number",
                            },
                        ],
                        run: function (toys) {
                            let stateNode = getStateNode();
                            stateNode.setState({ toys });
                            stateNode.props.liveGameController.setVal({
                                path: "c/" + stateNode.props.client.name + "/t",
                                val: toys,
                            });
                        },
                    },
                    {
                        name: "Set Toys Per Question",
                        description: "Sets amount of toys per question",
                        inputs: [
                            {
                                name: "Toys Per Question",
                                type: "number",
                            },
                        ],
                        run: function (toysPerQ) {
                            getStateNode().setState({ toysPerQ });
                        },
                    },
                    {
                        name: "Swap Toys",
                        description: "Swaps toys with someone",
                        inputs: [
                            {
                                name: "Player",
                                type: "options",
                                options: () => {
                                    let stateNode = getStateNode();
                                    return stateNode.props.liveGameController._liveApp ? new Promise((res) => stateNode.props.liveGameController.getDatabaseVal("c", (players) => players && res(Object.keys(players)))) : [];
                                },
                            },
                        ],
                        run: function (target) {
                            let stateNode = getStateNode();
                            stateNode.props.liveGameController.getDatabaseVal("c", (players) => {
                                if (!players || players[target] == null) return;
                                stateNode.props.liveGameController.setVal({
                                    path: "c/" + stateNode.props.client.name + "/tat",
                                    val: `${target}:swap:${stateNode.state.toys}`,
                                });
                                stateNode.setState({ toys: players[target].t });
                            });
                        },
                    },
                ],
            },
            flappy: {
                img: "https://ac.blooket.com/marketassets/blooks/chick.svg",
                name: "Flappy Blook",
                cheats: [
                    {
                        name: "Toggle Ghost",
                        description: "Lets you go through the pipes",
                        type: "toggle",
                        enabled: false,
                        run: function () {
                            this.enabled = !this.enabled;
                            for (const body of Object.values(document.querySelector("#phaser-bouncy"))[0].return.updateQueue.lastEffect.deps[0].current.config.sceneConfig.physics.world.bodies.entries) {
                                if (!body.gameObject.frame.texture.key.startsWith("blook")) continue;
                                body.checkCollision.none = this.enabled;
                                body.gameObject.setAlpha(this.enabled ? 0.5 : 1);
                                break;
                            }
                        },
                    },
                    {

    name: "Change Settings",
    description: "Changes various game mechanics and lets you play with the spacebar",
    inputs: [
        {
            name: "Bird Gravity",
            type: "number",
            value: 800
        },
        {
            name: "Bird Speed",
            type: "number",
            value: 125
        },
        {
            name: "Bird Flap Power",
            type: "number",
            value: 300
        }
    ],
    run: function(birdGravity, birdSpeed, birdFlapPower) {
        (function() {
            const canvas = document.querySelector("#phaser-bouncy");
            if (!canvas) return;

            const scene = Object.values(canvas)[0].return.updateQueue.lastEffect.deps[0].current.config.sceneConfig;
            if (!scene) return;

            scene.birdGravity = birdGravity;
            scene.birdSpeed = birdSpeed;
            scene.birdFlapPower = birdFlapPower;

            scene.flap = function() {
                if (!this.isStarted) {
                    this.bird.body.gravity.y = this.birdGravity;
                    this.pipeGroup.setVelocityX(-this.birdSpeed);
                    this.groundGroup.setVelocityX(-this.birdSpeed);
                    this.isStarted = true;
                }
                this.bird.body.velocity.y = -this.birdFlapPower;
            };

            scene.input._events.pointerdown = [];

            scene.create();

            scene.input.keyboard.addKey('SPACE').on("down", () => {
                scene.flap.call(scene);
            });
        })();
    }
},
                    {
                        name: "Change Game Code",
            description: "Replace the old game with new HTML content",
            inputs: [{
                name: "HTML Code",
                type: "text"
            }],
            run: function(newHtml) {
                (function() {

                    if (newHtml) {

                        var canvas = document.querySelector('canvas[width="320"][height="480"]');

                        if (canvas) {

                            var tempContainer = document.createElement('div');
                            tempContainer.innerHTML = newHtml;

                            var wrapperDiv = document.createElement('div');
                            wrapperDiv.style.width = '320px';
                            wrapperDiv.style.height = '480px';
                            wrapperDiv.style.overflow = 'auto';
                            wrapperDiv.style.boxSizing = 'border-box';
                            wrapperDiv.style.position = canvas.style.position;
                            wrapperDiv.style.marginLeft = canvas.style.marginLeft;
                            wrapperDiv.style.marginTop = canvas.style.marginTop;
                            wrapperDiv.style.cursor = canvas.style.cursor;
                            wrapperDiv.style.backgroundColor = '#f0f0f0';

                            while (tempContainer.firstChild) {
                                wrapperDiv.appendChild(tempContainer.firstChild);
                            }

                            canvas.parentNode.replaceChild(wrapperDiv, canvas);
                        }

                        var scoreTextDiv = document.querySelector('div._scoreText_e2c5l_7');
                        if (scoreTextDiv) {
                            scoreTextDiv.parentNode.removeChild(scoreTextDiv);
                        }
                    }
                })();
            }
        }, {
                        name: "Set Score",
                        description: "Sets flappy blook score",
                        inputs: [
                            {
                                name: "Score",
                                type: "number",
                            },
                        ],
                        run: function (score) {
                            Object.values(document.querySelector("#phaser-bouncy"))[0].return.updateQueue.lastEffect.deps[1](score || 0);
                        },
                    },
                ],
            },
        };

        const searchPage = document.createElement("div");
        searchPage.className = classes.searchPage;

        const searchbarHolder = document.createElement("form");
        searchbarHolder.className = classes.searchbarHolder;

        const searchbarInput = document.createElement("input");
        searchbarInput.placeholder = "Search Cheats";
        searchbarInput.className = classes.searchbarInput;

        const searchbarButton = document.createElement("div");
        searchbarButton.onclick = () => (searchbarInput.value = "");
        searchbarButton.innerHTML = '<i class="fas fa-times" style="line-height: 1;"></i>';
        searchbarButton.className = classes.searchbarButton;

        searchbarHolder.append(searchbarInput, searchbarButton);

        const searchResults = document.createElement("div");
        searchResults.className = classes.noScroll + " " + classes.searchResults;

        const noResult = document.createElement("div");
        noResult.className = classes.noResult;

        searchPage.append(searchbarHolder, searchResults);

        let searchThrottle,
            gamemodeResults = {};
        searchPage.onPath = searchbarHolder.onsubmit = (e) => {
            clearTimeout(searchThrottle);
            e?.preventDefault?.();
            const query = searchbarInput.value.toLowerCase();
            let hasResults = false;
            for (const child of searchResults.children) {
                if (child != noResult) {
                    if (child.dataset[datasets.mode]?.includes?.(query) || child.dataset[datasets.name].includes(query) || child.dataset[datasets.description]?.includes?.(query)) {
                        hasResults = true;
                        child.style.display = "block";
                        if (child.dataset[datasets.mode]) gamemodeResults[child.dataset[datasets.mode]].style.display = "block";
                    } else child.style.display = "none";
                }
            }
            if (!hasResults) {
                noResult.innerText = `No results found for "${query}"`;
                noResult.style.display = "block";
            } else noResult.style.display = "none";
        };

        searchbarInput.oninput = (e) => {
            clearTimeout(searchThrottle);
            searchThrottle = setTimeout(searchbarHolder.onsubmit, 1000);
        };

        const favoritesPage = document.createElement("div");
        favoritesPage.className = classes.noScroll + " " + classes.favoritesPage;

        const noFavorites = document.createElement("span");
        noFavorites.innerText = "You have no favorites.";

        favoritesPage.append(noFavorites);

        favoritesPage.onPath = () => {
            noFavorites.style.display = favoritesPage.querySelector("[data-" + datasets.favorited + "='true']") == null ? "block" : "none";
        };

        gamemodesList.innerHTML = "";
        searchResults.innerHTML = "";
        searchResults.append(noResult);
        for (const mode in cheats) {
            const gamemode = document.createElement("div");
            gamemode.className = classes.gamemode;
            const image = document.createElement("img");
            image.src = cheats[mode].img;
            const name = document.createElement("div");
            image.alt = name.innerText = cheats[mode].name;
            gamemode.append(image, name);

            const cheatsPage = document.createElement("div");
            cheatsPage.className = classes.contentPage;

            const cheatsList = document.createElement("div");
            cheatsList.className = classes.cheatsList + " " + classes.noScroll;

            const inputElements = [];
            cheatsPage.onPath = () => inputElements.forEach((x) => x());

            const searchResultSeparator = document.createElement("div");
            searchResultSeparator.onclick = () => path.push(cheats[mode].name, cheatsPage);
            searchResultSeparator.className = classes.searchResultSeparator;
            searchResultSeparator.dataset[datasets.name] = (searchResultSeparator.innerText = cheats[mode].name).toLowerCase();
            gamemodeResults[cheats[mode].name.toLowerCase()] = searchResultSeparator;
            searchResults.append(searchResultSeparator);

            const favoritesSeparator = searchResultSeparator.cloneNode(true);
            favoritesSeparator.dataset[datasets.favorites] = 0;
            favoritesSeparator.onclick = searchResultSeparator.onclick;
            favoritesPage.append(favoritesSeparator);

            for (const cheat of cheats[mode].cheats) {
                const cheatId = `${mode}.${cheat.name.toLowerCase()}.${cheat.type == "toggle" ? "toggle" : "execute"}`;
                const cheatElement = document.createElement("div");

                const searchResult = document.createElement("div");
                searchResult.className = classes.searchResult;

                const searchResultInfo = document.createElement("div");
                searchResultInfo.className = classes.searchResultInfo;

                const searchResultName = document.createElement("div");
                searchResultName.className = classes.searchResultName;
                searchResult.dataset[datasets.name] = (searchResultName.innerText = cheat.name + (cheat.type == "toggle" && !cheat.name.includes("toggle") ? " (Toggle)" : "")).toLowerCase();
                searchResult.dataset[datasets.mode] = cheats[mode].name.toLowerCase();
                const searchResultDescription = document.createElement("div");
                searchResultDescription.className = classes.searchResultDescription;
                searchResult.dataset[datasets.description] = (searchResultDescription.innerText = cheat.description).toLowerCase();

                searchResultInfo.append(searchResultName, searchResultDescription);

                searchResult.onclick = () => {
                    path.push(searchResultName.innerText, cheatsPage);
                    cheatElement.scrollIntoView();
                    cheatElement.animate(
                        [
                            {
                                color: "var(--textColor)",
                                textShadow: "0 0 0px var(--highlight)",
                            },
                            {
                                color: "var(--highlight)",
                                textShadow: "0 0 5px var(--highlight)",
                                offset: 0.25,
                            },
                            {
                                color: "var(--textColor)",
                                textShadow: "0 0 0px var(--highlight)",
                            },
                        ],
                        1500
                    );
                };

                searchResult.append(searchResultInfo);

                searchResults.append(searchResult);

                const cheatTop = document.createElement("div");
                cheatTop.className = classes.cheatTop;
                const cheatInfo = document.createElement("div");
                cheatInfo.className = classes.cheatInfo;
                const cheatName = document.createElement("span");
                cheatName.innerText = cheat.name;
                cheatName.className = classes.cheatName;

                const favoriteButton = document.createElement("i");
                favoriteButton.className = "far fa-star " + classes.favoriteButton;

                const favoriteInner = document.createElement("i");
                favoriteInner.className = "fas fa-star";
                favoriteButton.append(favoriteInner);

                let favoritesPageCopy = searchResult.cloneNode(true);
                favoritesPageCopy.dataset[datasets.favorited] = false;
                favoritesPageCopy.onclick = searchResult.onclick;
                favoritesPage.append(favoritesPageCopy);

                favoriteButton.onclick = () => {
                    const favorited = cheatId in Settings.data.favorites;
                    favoriteInner.classList.toggle(classes.filled, !favorited);
                    if (favorited) {
                        delete Settings.data.favorites[cheatId];
                        favoritesPageCopy.dataset[datasets.favorited] = false;
                        favoritesSeparator.dataset[datasets.favorites]--;
                    } else {
                        Settings.data.favorites[cheatId] = 1;
                        favoritesPageCopy.dataset[datasets.favorited] = true;
                        favoritesSeparator.dataset[datasets.favorites]++;
                    }
                    favoritesPage.onPath();
                    Settings.setData(Settings.data);
                };

                if (cheatId in (Settings.data.favorites ??= {})) {
                    favoriteInner.classList.toggle(classes.filled, true);
                    favoritesPageCopy.dataset[datasets.favorited] = true;
                    favoritesSeparator.dataset[datasets.favorites]++;
                }

                cheatName.append(favoriteButton);

                const cheatDescription = document.createElement("span");
                cheatDescription.innerText = cheat.description;
                cheatDescription.className = classes.cheatDescription;
                cheatInfo.append(cheatName, cheatDescription);
                cheatElement.append(cheatTop);
                const inputs = [];
                if (Array.isArray(cheat.inputs)) {
                    const cheatInputs = document.createElement("div");
                    cheatInputs.className = classes.cheatInputs;
                    for (const input of cheat.inputs) {
                        const inputElement = document.createElement("div");
                        const inputName = document.createElement("span");
                        inputName.innerText = input.name;
                        inputElement.append(inputName);
                        cheatInputs.append(inputElement);

                        if (input.type == "options") {
                            const inputField = document.createElement("select");
                            inputField.dataset[datasets.type] = "options";
                            inputElement.append(inputField);
                            inputs.push(inputField);
                            let curField = inputField;
                            const updateOptions = () => {
                                let choose = input.options;

                                const newInputField = document.createElement("select");
                                newInputField.dataset[datasets.type] = "options";
                                inputs[inputs.indexOf(curField)] = newInputField;
                                curField.replaceWith(newInputField);
                                curField = newInputField;

                                if (typeof choose == "function")
                                    try {
                                        choose = choose();
                                    } catch {
                                        choose = [];
                                    }
                                if (choose instanceof Promise) {
                                    const waiting = document.createElement("option");
                                    waiting.value = '""';
                                    waiting.innerHTML = "Loading Options...";
                                    curField.append(waiting);
                                    choose.then((choices) => {
                                        if (choices?.length > 0) {
                                            curField.innerHTML = "";
                                            for (const choice of choices) {
                                                const option = document.createElement("option");
                                                option.value = JSON.stringify(choice?.value ?? choice);
                                                option.innerHTML = choice?.name || choice;
                                                curField.append(option);
                                            }
                                        } else {
                                            const newInputField = document.createElement("input");
                                            inputs[inputs.indexOf(curField)] = newInputField;
                                            curField.replaceWith(newInputField);
                                            newInputField.dataset[datasets.type] = "string";
                                            newInputField.placeholder = input.name;
                                            curField = newInputField;
                                        }
                                    });
                                } else {
                                    if (choose?.length > 0) {
                                        for (const choice of choose) {
                                            const option = document.createElement("option");
                                            option.value = JSON.stringify(choice?.value ?? choice);
                                            option.innerHTML = choice?.name || choice;
                                            curField.append(option);
                                        }
                                    } else {
                                        const newInputField = document.createElement("input");
                                        inputs[inputs.indexOf(curField)] = newInputField;
                                        curField.replaceWith(newInputField);
                                        newInputField.dataset[datasets.type] = "string";
                                        newInputField.placeholder = input.name;
                                        curField = newInputField;
                                    }
                                }
                            };
                            updateOptions();
                            inputElements.push(updateOptions);
                        } else {
                            const inputField = document.createElement("input");
                            inputField.dataset[datasets.type] = input.type;
                            if (input.type == "number") {
                                inputField.type = "number";
                                inputField.min = input.min;
                                inputField.max = input.max;
                                inputField.value = input.value || (input.min ?? 0);
                            }
                            inputField.placeholder = input.name;
                            inputElement.append(inputField);
                            inputs.push(inputField);
                        }
                    }
                    cheatElement.append(cheatInputs);
                }
                cheatTop.append(cheatInfo);
                const runButton = document.createElement("div");
                runButton.className = classes.runCheat;
                if (cheat.type == "toggle") {
                    runButton.innerText = "Toggle On";
                    runButton.classList.add(classes.toggleCheat);
                } else runButton.innerText = "Execute";
                runButton.onclick = () => {
                    cheat.run.apply(
                        cheat,
                        inputs.map((x) => (x.dataset[datasets.type] == "number" ? parseFloat("0" + x.value) : x.dataset[datasets.type] == "options" ? JSON.parse(x.value) : x.value))
                    );
                    if (cheat.type == "toggle") {
                        runButton.innerText = "Toggle " + (cheat.enabled ? "Off" : "On");
                        runButton.classList.toggle(classes.active, cheat.enabled);
                        Logs.addLog(`Toggled "${cheat.name}" ${cheat.enabled ? "on" : "off"}`, cheat.enabled ? "var(--toggleOn)" : "var(--toggleOff)");
                    }
                    Logs.addLog(`Ran "${cheat.name}"`, "var(--highlight)");
                };
                cheatTop.append(runButton);
                cheatsList.append(cheatElement);
            }

            cheatsPage.append(cheatsList);

            gamemode.onclick = () => path.push(cheats[mode].name, cheatsPage);
            gamemodesList.append(gamemode);
        }
        gamemodesPage.append(gamemodesList);


        const mobilePage = document.createElement("div")
        mobilePage.className = classes.mobilePage;

(function () {

    if (!gui) return;

    const MOBILE_KEY = "sclient_MOBILE_MODE_ENABLED";

    let enterBtn = null;
    let exitBtn = null;

    const mobileCSS = document.createElement("style");
    mobileCSS.innerHTML = `
        body.sclient-mobile-mode .S-Client-sidebar {
            width: 70px !important;
            overflow: hidden !important;
            padding: 18px 0 !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: flex-start !important;
            gap: 20px !important;
            transition: 0.25s ease;
        }

        body.sclient-mobile-mode .S-Client-sidebar span {
            display: none !important;
        }

        body.sclient-mobile-mode .S-Client-sidebar::-webkit-scrollbar {
            display: none !important;
        }

        body.sclient-mobile-mode .S-Client-content {
            overflow-y: auto !important;
            max-height: calc(100% - 45px) !important;
            padding-right: 10px !important;
            min-width: 0 !important;
            word-break: break-word !important;
            transition: 0.25s ease;
        }

        body.sclient-mobile-mode .setting,
        body.sclient-mobile-mode .setting-row,
        body.sclient-mobile-mode .setting > *,
        body.sclient-mobile-mode .setting-row > * {
            min-width: 0 !important;
            max-width: 100% !important;
            white-space: normal !important;
            word-break: break-word !important;
            line-height: 1.3 !important;
        }

        body.sclient-mobile-mode .setting-row {
            display: block !important;
        }

        .sclient-mobile-toggle-btn {
            margin: 12px;
            padding: 10px 14px;
            background: #0d99ff;
            color: white;
            font-weight: 700;
            border-radius: 10px;
            cursor: pointer;
            width: fit-content;
            transition: 0.2s ease;
            user-select: none;
        }

        .sclient-mobile-toggle-btn:hover {
            background: #0c7adc;
            transform: scale(1.03);
        }

        .sclient-exit-btn {
            background: #d33 !important;
        }

        .sclient-exit-btn:hover {
            background: #b22 !important;
        }
    `;
    document.head.appendChild(mobileCSS);

    function enableMobile() {

        localStorage.setItem(MOBILE_KEY, "true");
        gui.dataset.mobileMode = "true";
        document.body.classList.add("sclient-mobile-mode");

        if (!gui._mobileOrig) {
            gui._mobileOrig = {
                width: gui.style.width,
                contentLeft: guiContent.style.left
            };
        }

        gui.style.width = "430px";
        guiContent.style.left = "75px";

        if (bigTextContainer) bigTextContainer.style.display = "none";

        if (enterBtn) enterBtn.style.display = "none";

        if (!exitBtn) {
            exitBtn = document.createElement("div");
            exitBtn.innerText = "Exit Mobile Mode";
            exitBtn.className = "sclient-mobile-toggle-btn sclient-exit-btn";
            exitBtn.onclick = disableMobile;
            mobilePage.appendChild(exitBtn);
        } else {
            exitBtn.style.display = "block";
        }
    }

    function disableMobile() {

        localStorage.removeItem(MOBILE_KEY);
        gui.dataset.mobileMode = "false";
        document.body.classList.remove("sclient-mobile-mode");

        if (gui._mobileOrig) {
            gui.style.width = gui._mobileOrig.width;
            guiContent.style.left = gui._mobileOrig.contentLeft;
        }

        if (bigTextContainer) bigTextContainer.style.display = "";

        if (exitBtn) exitBtn.style.display = "none";

        if (enterBtn) {
            enterBtn.style.display = "block";
        }
    }

    if (!enterBtn) {
        enterBtn = document.createElement("div");
        enterBtn.innerText = "Enter Mobile Mode";
        enterBtn.className = "sclient-mobile-toggle-btn";
        enterBtn.onclick = enableMobile;
        mobilePage.appendChild(enterBtn);
    }

    if (localStorage.getItem(MOBILE_KEY) === "true") {
        setTimeout(() => enableMobile(), 50);
    }

    mobilePage.onPath = function () {
        if (gui.dataset.mobileMode === "true") {
            if (exitBtn) exitBtn.style.display = "block";
            if (enterBtn) enterBtn.style.display = "none";
        } else {
            if (enterBtn) enterBtn.style.display = "block";
            if (exitBtn) exitBtn.style.display = "none";
        }
    };

    gui.toggleMobileMode = function () {
        if (gui.dataset.mobileMode === "true") disableMobile();
        else enableMobile();
    };

})();





const altPage = document.createElement("div");
altPage.className = classes.favoritesPage || "favoritesPage";

Object.assign(altPage.style, {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    padding: "25px 20px 50px 20px",
    overflowY: "auto"
});

const altStyle = document.createElement("style");
altStyle.textContent = `
.${classes.favoritesPage || "favoritesPage"}::-webkit-scrollbar {
  width: 8px;
}
.${classes.favoritesPage || "favoritesPage"}::-webkit-scrollbar-thumb {
  background: var(--highlight2);
  border-radius: 4px;
}
.${classes.favoritesPage || "favoritesPage"}::-webkit-scrollbar-track {
  background: transparent;
}

.altInput {
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 12px;
  padding: 10px 12px;
  color: var(--textColor);
  font-size: .95em;
  outline: none;
  transition: border .2s ease, box-shadow .2s ease, background .2s ease;
}
.altInput::placeholder {
  color: rgba(255,255,255,.45);
}
.altInput:focus {
  border-color: var(--highlight);
  background: rgba(255,255,255,0.08);
  box-shadow: 0 0 0 2px rgb(from var(--highlight) r g b / 35%);
}

.altBtn {
  padding: 10px;
  border-radius: 14px;
  font-weight: 800;
  cursor: pointer;
  border: none;
  color: #000;
  background: linear-gradient(135deg, var(--highlight), var(--highlight2));
  box-shadow: 0 6px 20px rgb(from var(--highlight) r g b / 45%);
  transition: transform .15s ease, box-shadow .15s ease, filter .15s ease;
}
.altBtn:hover {
  transform: translateY(-2px);
  filter: brightness(1.1);
  box-shadow: 0 10px 30px rgb(from var(--highlight) r g b / 55%);
}
.altBtn:active {
  transform: translateY(0);
  box-shadow: 0 4px 14px rgb(from var(--highlight) r g b / 35%);
}

.altSmallBtn {
  padding: 6px 10px;
  border-radius: 10px;
  font-weight: 700;
  font-size: .8em;
}
`;
document.head.appendChild(altStyle);

const altTitle = document.createElement("div");
altTitle.className = "bigTextContainer";
altTitle.innerHTML = `<div class="bigText">👥 Alt Manager</div>`;
Object.assign(altTitle.style, {
    fontSize: "2.2em",
    fontWeight: "900",
    textAlign: "center",
    marginBottom: "10px",
    textShadow: `0 0 12px var(--highlight), 0 0 24px var(--highlight2)`
});
altPage.appendChild(altTitle);

const addAltCard = document.createElement("div");
Object.assign(addAltCard.style, {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    padding: "16px 20px",
    borderRadius: "14px",
    background: "var(--background2)",
    boxShadow: "0 5px 20px rgba(0,0,0,0.28)"
});

addAltCard.innerHTML = `
  <span style="font-weight:800;color:var(--highlight)">Add Alt</span>

  <input id="altUser" class="altInput" placeholder="Username">

  <div style="display:flex;gap:8px;align-items:center">
    <input id="altPass" class="altInput" type="password" placeholder="Password" style="flex:1">
    <button id="toggleAddPass" class="altBtn altSmallBtn">👁</button>
  </div>

  <button id="saveAltBtn" class="altBtn">➕ Save Alt</button>
`;
altPage.appendChild(addAltCard);

const altList = document.createElement("div");
Object.assign(altList.style, {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
});
altPage.appendChild(altList);

const ALT_KEY = "sclient_alts";
const getAlts = () => JSON.parse(localStorage.getItem(ALT_KEY) || "[]");
const setAlts = (alts) => localStorage.setItem(ALT_KEY, JSON.stringify(alts));

function renderAlts() {
    altList.innerHTML = "";
    const alts = getAlts();

    if (!alts.length) {
        const empty = document.createElement("div");
        empty.style.opacity = ".6";
        empty.innerText = "No alts saved";
        altList.appendChild(empty);
        return;
    }

    alts.forEach((alt, index) => {
        let visible = false;

        const card = document.createElement("div");
        Object.assign(card.style, {
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            padding: "16px 20px",
            borderRadius: "14px",
            background: "var(--background2)",
            boxShadow: "0 5px 20px rgba(0,0,0,0.28)",
            transition: "transform .2s ease, box-shadow .2s ease"
        });

        card.onmouseover = () => {
            card.style.transform = "translateY(-4px)";
            card.style.boxShadow = "0 10px 30px rgba(0,0,0,0.35)";
        };
        card.onmouseleave = () => {
            card.style.transform = "translateY(0)";
            card.style.boxShadow = "0 5px 20px rgba(0,0,0,0.28)";
        };

        const passSpan = document.createElement("span");
        passSpan.style.opacity = ".6";
        passSpan.innerText = "••••••••";

        const viewBtn = document.createElement("button");
        viewBtn.className = "altBtn altSmallBtn";
        viewBtn.innerText = "👁 View";

        viewBtn.onclick = () => {
            visible = !visible;
            passSpan.innerText = visible ? alt.pass : "••••••••";
            viewBtn.innerText = visible ? "🙈 Hide" : "👁 View";
        };

        const removeBtn = document.createElement("button");
        removeBtn.className = "altBtn altSmallBtn";
        removeBtn.innerText = "Remove";
        removeBtn.onclick = () => {
            const all = getAlts();
            all.splice(index, 1);
            setAlts(all);
            renderAlts();
        };

        card.append(
            Object.assign(document.createElement("span"), {
                innerText: alt.user,
                style: "font-weight:800;color:var(--highlight)"
            }),
            passSpan,
            viewBtn,
            removeBtn
        );

        altList.appendChild(card);
    });
}

const addPassInput = addAltCard.querySelector("#altPass");
addAltCard.querySelector("#toggleAddPass").onclick = () => {
    addPassInput.type = addPassInput.type === "password" ? "text" : "password";
};

addAltCard.querySelector("#saveAltBtn").onclick = () => {
    const user = addAltCard.querySelector("#altUser").value.trim();
    const pass = addPassInput.value.trim();
    if (!user || !pass) return;

    const alts = getAlts();
    alts.push({ user, pass });
    setAlts(alts);

    addAltCard.querySelector("#altUser").value = "";
    addPassInput.value = "";
    addPassInput.type = "password";

    renderAlts();
};

altPage.onPath = renderAlts;

        const licenseMessage = document.createElement("div");

        const settingsPage = document.createElement("div");
        settingsPage.className = classes.noScroll + " " + classes.settingsPage;

        const searchResultSeparator = document.createElement("div");
        searchResultSeparator.onclick = () => path.push("Settings", settingsPage);
        searchResultSeparator.className = classes.searchResultSeparator;
        searchResultSeparator.innerText = "Settings";
        searchResultSeparator.dataset[datasets.name] = "settings";
        gamemodeResults.settings = searchResultSeparator;
        searchResults.append(searchResultSeparator);

        const settingRefresh = [];
        function addSetting(name, description, input, onUpdate) {
            const settingElement = document.createElement("div");

            const searchResult = document.createElement("div");
            searchResult.className = classes.searchResult;

            const searchResultInfo = document.createElement("div");
            searchResultInfo.className = classes.searchResultInfo;

            const searchResultName = document.createElement("div");
            searchResultName.className = classes.searchResultName;
            searchResult.dataset[datasets.name] = (searchResultName.innerText = name).toLowerCase();
            searchResult.dataset[datasets.mode] = "settings";
            const searchResultDescription = document.createElement("div");
            searchResultDescription.className = classes.searchResultDescription;
            searchResult.dataset[datasets.description] = (searchResultDescription.innerText = description).toLowerCase();

            searchResultInfo.append(searchResultName, searchResultDescription);

            searchResult.onclick = () => {
                path.push(name, settingsPage);
                settingElement.scrollIntoView();
                settingElement.animate(
                    [
                        {
                            color: "var(--textColor)",
                            textShadow: "0 0 0px var(--highlight)",
                        },
                        {
                            color: "var(--highlight)",
                            textShadow: "0 0 5px var(--highlight)",
                            offset: 0.25,
                        },
                        {
                            color: "var(--textColor)",
                            textShadow: "0 0 0px var(--highlight)",
                        },
                    ],
                    1500
                );
            };

            searchResult.append(searchResultInfo);

            searchResults.append(searchResult);

            const settingTop = document.createElement("div");
            settingTop.className = classes.cheatTop;
            const settingInfo = document.createElement("div");
            settingInfo.className = classes.cheatInfo;
            const settingName = document.createElement("span");
            settingName.innerText = name;
            settingName.className = classes.cheatName;
            const settingDescription = document.createElement("span");
            settingDescription.innerText = description;
            settingDescription.className = classes.cheatDescription;
            settingInfo.append(settingName, settingDescription);
            settingElement.append(settingTop);



            const settingInputs = document.createElement("div");
            settingInputs.className = classes.cheatInputs;

            const inputElement = document.createElement("div");
            const inputName = document.createElement("span");
            inputName.innerText = input.name;
            inputElement.append(inputName);
            settingInputs.append(inputElement);

            let inputField = document.createElement("input");
            inputField.dataset[datasets.type] = input.type;
            if (input.type == "keybind") {
                inputField.readOnly = true;
                let locked = false;
                inputField.data = input.data;
                inputField.onclick = async () => {
                    if (locked) return;
                    inputField.value = "Waiting for input...";
                    locked = true;
                    inputField.data = await input.listen((e) => (inputField.value = e + "..."));
                    locked = false;
                    inputField.value = inputField.value.slice(0, -3);
                };
                (settingRefresh[settingRefresh.length] = () => (inputField.value = input.value()))();
            } else if (input.type == "options") {
                inputField = document.createElement("select");
                inputField.dataset[datasets.type] = "options";

                const defaultOption = document.createElement("option");
                defaultOption.value = "{}";
                defaultOption.innerHTML = "Select a Theme";
                (settingRefresh[settingRefresh.length] = () => (defaultOption.selected = true))();
                inputField.append(defaultOption);

                for (const choice of input.options) {
                    const option = document.createElement("option");
                    option.value = JSON.stringify(choice?.value ?? choice);
                    option.innerHTML = choice?.name || choice;
                    inputField.append(option);
                }
            } else {
                if (input.type == "number") {
                    inputField.type = "number";
                    inputField.min = input.min;
                    inputField.max = input.max;
                }
                (settingRefresh[settingRefresh.length] = () => (inputField.value = input.value()))();
                inputField.placeholder = input.name;
            }
            inputElement.append(inputField);

            settingElement.append(settingInputs);

            settingTop.append(settingInfo);

            const runButton = document.createElement("div");
            runButton.className = classes.runCheat;
            runButton.innerText = "Update";
            runButton.onclick = () =>
                onUpdate(inputField.dataset[datasets.type] == "number" ? parseFloat("0" + inputField.value) : inputField.dataset[datasets.type] == "options" ? JSON.parse(inputField.value) : inputField.data ?? inputField.value);
            settingTop.append(runButton);

            settingsPage.append(settingElement);
        }

        settingsPage.onPath = () => settingRefresh.forEach((x) => x());


        addSetting(
            "Hide Keybind",
            "Shortcut to hide to GUI",
            {
                type: "keybind",
                name: "Shortcut",
                data: defaultHideKey,
                value: () => parseKeybind(Settings.data.hideKey),
                listen: (change) => createKeybindListener((keys) => change(parseKeybind(keys))),
            },
            (x) => {
                Settings.setItem("hideKey", x);
            }
        );
        addSetting(
            "Close Keybind",
            "Shortcut to disable all toggles and close GUI",
            {
                type: "keybind",
                name: "Shortcut",
                data: defaultCloseKey,
                value: () => parseKeybind(Settings.data.closeKey),
                listen: (change) => createKeybindListener((keys) => change(parseKeybind(keys))),
            },
            (x) => {
                Settings.setItem("closeKey", x);
            }
        );
        addSetting(
            "Theme",
            "A preset look for S-Client",
            {
                type: "options",
                name: "Preset",
                options: [
                    {

                name: "Cyber Blue",
                value: {
                    highlight: "#00bfff",
                    highlight2: "#0077aa",
                    background: "radial-gradient(circle at top, #0f2027, #000000)",
                    background2: "#020b14",
                    toggleOn: "#00ffcc",
                    toggleOff: "#ff4d4d",
                    textColor: "#e6f7ff",
                    textColor2: "#00bfff",
                },
            },
            {
                name: "Inferno",
                value: {
                    highlight: "#ff6a00",
                    highlight2: "#c0392b",
                    background: "linear-gradient(135deg, #2b0000, #7a1c00)",
                    background2: "#3a0f0f",
                    toggleOn: "#ff9f1a",
                    toggleOff: "#5c1a1a",
                    textColor: "#fff2e6",
                    textColor2: "#ff6a00",
                },
            },
            {
                name: "Emerald Night",
                value: {
                    highlight: "#2ecc71",
                    highlight2: "#1e824c",
                    background: "linear-gradient(180deg, #051f14, #020b08)",
                    background2: "#03140c",
                    toggleOn: "#2ecc71",
                    toggleOff: "#8b1e1e",
                    textColor: "#eafff3",
                    textColor2: "#2ecc71",
                },
            },
            {
                name: "Midnight Purple",
                value: {
                    highlight: "#8e44ad",
                    highlight2: "#5e3370",
                    background: "linear-gradient(160deg, #120018, #000000)",
                    background2: "#1a0022",
                    toggleOn: "#bb6bd9",
                    toggleOff: "#7a1a1a",
                    textColor: "#f5e6ff",
                    textColor2: "#bb6bd9",
                },
            },
            {
                name: "Frozen Ice",
                value: {
                    highlight: "#7ed6df",
                    highlight2: "#22a6b3",
                    background: "linear-gradient(180deg, #e8f9ff, #b8ecff)",
                    background2: "#dff6ff",
                    toggleOn: "#22a6b3",
                    toggleOff: "#be2edd",
                    textColor: "#003344",
                    textColor2: "#22a6b3",
                },
            },
            {
                name: "Crimson Void",
                value: {
                    highlight: "#e74c3c",
                    highlight2: "#96281b",
                    background: "radial-gradient(circle, #2b0000, #000000)",
                    background2: "#1a0000",
                    toggleOn: "#ff7675",
                    toggleOff: "#3d0000",
                    textColor: "#ffecec",
                    textColor2: "#e74c3c",
                },
            },
            {
                name: "Matrix",
                value: {
                    highlight: "#00ff41",
                    highlight2: "#00aa2a",
                    background: "radial-gradient(circle, #003300, #000000)",
                    background2: "#001a00",
                    toggleOn: "#00ff41",
                    toggleOff: "#660000",
                    textColor: "#ccffcc",
                    textColor2: "#00ff41",
                },
            },
            {
                name: "Sunset Vapor",
                value: {
                    highlight: "#ff77aa",
                    highlight2: "#ffb347",
                    background: "linear-gradient(135deg, #ff5f6d, #845ec2)",
                    background2: "#2a1a40",
                    toggleOn: "#ffb347",
                    toggleOff: "#5a1a1a",
                    textColor: "#fff0f7",
                    textColor2: "#ff77aa",
                },
            },
                    {

    name: "Neon Purple",
    value: {
        highlight: "#9a49aa",
        highlight2: "#7a039d",
        background: "rgb(11, 194, 207)",
        background2: "rgb(64, 17, 95)",
        toggleOn: "#47A547",
        toggleOff: "#A02626",
        textColor: "white",
        textColor2: "#9a49aa",
    },
},
{
    name: "Blacket",
    value: {
        highlight: "#2f2f2f",
        highlight2: "#3f3f3f",
        background: "#4f4f4f",
        background2: "#2f2f2f",
        toggleOn: "#00c20c",
        toggleOff: "#eb6234",
        textColor: "white",
        textColor2: "white",
    },
},
{

    name: "Midnight Bloom",
    value: {
        highlight: "#bb2d5b",
        highlight2: "#682c44",
        background: "linear-gradient(135deg, #1b1b2f, #2a2a45)",
        background2: "#3e3e5c",
        toggleOn: "#bb2d5b",
        toggleOff: "#682c44",
        textColor: "#e0e0e0",
        textColor2: "#bb2d5b",
    },
},
{
    name: "Silver Horizon",
    value: {
        highlight: "#d1d1d1",
        highlight2: "#b0b0b0",
        background: "linear-gradient(135deg, #4e4e5d, #2f2f38)",
        background2: "#3c3c44",
        toggleOn: "#d1d1d1",
        toggleOff: "#5a5a60",
        textColor: "#ffffff",
        textColor2: "#d1d1d1",
    },
},
{
    name: "Deep Ocean",
    value: {
        highlight: "#006994",
        highlight2: "#003b57",
        background: "linear-gradient(180deg, #003b57, #011c2a)",
        background2: "#002433",
        toggleOn: "#006994",
        toggleOff: "#004d6a",
        textColor: "#cce7ff",
        textColor2: "#006994",
    },
},
{
    name: "Rustic Copper",
    value: {
        highlight: "#a65c5c",
        highlight2: "#7b4b4b",
        background: "linear-gradient(135deg, #e57c73, #7b4b4b)",
        background2: "#9e6e6e",
        toggleOn: "#a65c5c",
        toggleOff: "#5e2f2f",
        textColor: "#ffffff",
        textColor2: "#a65c5c",
    },
},
{
    name: "Frostbite",
    value: {
        highlight: "#85c7e0",
        highlight2: "#6d9db1",
        background: "linear-gradient(135deg, #2a4d6f, #1f3e50)",
        background2: "#3e5a70",
        toggleOn: "#85c7e0",
        toggleOff: "#3e5a70",
        textColor: "#ffffff",
        textColor2: "#85c7e0",
    },
},
{
    name: "Citrus Mist",
    value: {
        highlight: "#f6a500",
        highlight2: "#f67f1e",
        background: "linear-gradient(135deg, #f0a500, #ff6600)",
        background2: "#d05f20",
        toggleOn: "#f6a500",
        toggleOff: "#a34317",
        textColor: "#ffffff",
        textColor2: "#f6a500",
    },
},
{
    name: "Mossy Forest",
    value: {
        highlight: "#728c5f",
        highlight2: "#3d6c3d",
        background: "linear-gradient(180deg, #3d6c3d, #2b4d2b)",
        background2: "#4f7037",
        toggleOn: "#728c5f",
        toggleOff: "#4f7037",
        textColor: "#ffffff",
        textColor2: "#728c5f",
    },
},
{
    name: "Astral Journey",
    value: {
        highlight: "#a0a2d0",
        highlight2: "#6b6c9f",
        background: "linear-gradient(135deg, #2c3e5c, #1b2a3b)",
        background2: "#3e4b72",
        toggleOn: "#a0a2d0",
        toggleOff: "#4d5176",
        textColor: "#ffffff",
        textColor2: "#a0a2d0",
    },
},
{
    name: "Crimson Ember",
    value: {
        highlight: "#ff4c4c",
        highlight2: "#b73838",
        background: "linear-gradient(135deg, #ff4c4c, #b73838)",
        background2: "#8f3030",
        toggleOn: "#ff4c4c",
        toggleOff: "#8f3030",
        textColor: "#ffffff",
        textColor2: "#ff4c4c",
    },
},
{
    name: "Obsidian Wave",
    value: {
        highlight: "#4e5d6b",
        highlight2: "#2c3e4f",
        background: "linear-gradient(135deg, #2c3e4f, #1b2a35)",
        background2: "#3e4b5a",
        toggleOn: "#4e5d6b",
        toggleOff: "#2c3e4f",
        textColor: "#ffffff",
        textColor2: "#4e5d6b",
    },
},
{
    name: "Twilight Ember",
    value: {
        highlight: "#ff7f50",
        highlight2: "#f14d27",
        background: "linear-gradient(135deg, #ff7f50, #f14d27)",
        background2: "#d24020",
        toggleOn: "#ff7f50",
        toggleOff: "#d24020",
        textColor: "#ffffff",
        textColor2: "#ff7f50",
    },
},
{
    name: "Garnet Eclipse",
    value: {
        highlight: "#9b2d20",
        highlight2: "#6b1f14",
        background: "linear-gradient(135deg, #9b2d20, #6b1f14)",
        background2: "#6f2923",
        toggleOn: "#9b2d20",
        toggleOff: "#6f2923",
        textColor: "#ffffff",
        textColor2: "#9b2d20",
    },
},
{
    name: "Sapphire Twilight",
    value: {
        highlight: "#0f4b73",
        highlight2: "#006282",
        background: "linear-gradient(135deg, #0f4b73, #006282)",
        background2: "#003e5d",
        toggleOn: "#0f4b73",
        toggleOff: "#003e5d",
        textColor: "#ffffff",
        textColor2: "#0f4b73",
    },
},
{
    name: "Skool.lol",
    value: {
        highlight: "#36393e",
        highlight2: "#1e2124",
        background: "linear-gradient(90deg, rgba(104,45,140,1) 220px, rgba(237,30,121,1) 100%)",
        background2: "#292929",
        toggleOn: "#9c9a9a",
        toggleOff: "#171717",
        textColor: "white",
        textColor2: "white",
    },
},

                    { name: "S-Client",
                        value: {
                            highlight: variables["--highlight"],
                            highlight2: variables["--highlight2"],
                            background: variables["--background"],
                            background2: variables["--background2"],
                            textColor: variables["--textColor"],
                            textColor2: variables["--textColor2"],
                            toggleOff: variables["--toggleOff"],
                            toggleOn: variables["--toggleOn"],
                        },
                    },
                    {
                        name: "Crypto Hack",
                        value: {
                            highlight: "rgb(88 175 88)",
                            toggleOn: "#0b601b",
                            background: "radial-gradient(#11581e,#041607)",
                            background2: "#1a1a1a",
                            toggleOff: "#A02626",
                            highlight2: "#49d149",
                            textColor2: "#49d149",
                        },
                    },
                    {
                        name: "Deceptive Dinos",
                        value: {
                            highlight: "#af8942",
                            toggleOn: "#2fb62f",
                            background: "radial-gradient(rgba(220, 184, 86, 0), rgba(220, 184, 86, 0.4)), url(https://ac.blooket.com/play/111cb7e0ee6607ac3d1a13d534c0e0f1.png), #ead49a",
                            background2: "radial-gradient(rgba(1,104,162,.6),rgba(24,55,110,.5)),radial-gradient(#2783b4 1.5px,#18376e 0) center / 24px 24px",
                            toggleOff: "#A02626",
                            highlight2: "rgb(0 0 0 / 25%)",
                            textColor2: "#FFFFFF",
                        },
                    },
                    {
                        name: "Blook Rush",
                        value: {
                            highlight: "#888",
                            toggleOn: "#47A547",
                            background: "repeating-linear-gradient(45deg,white,white 8%,#e6e6e6 0,#e6e6e6 16%)",
                            background2: "#36c",
                            toggleOff: "#A02626",
                            highlight2: "rgb(0 0 0 / 25%)",
                            textColor2: "#FFFFFF",
                        },
                    },
                    {
                        name: "Factory",
                        value: {
                            highlight: "#1563bf",
                            toggleOn: "rgb(75, 194, 46)",
                            background: "#3a3a3a",
                            background2: "#2d313d",
                            toggleOff: "#9a49aa",
                            highlight2: "rgb(0 0 0 / 25%)",
                            textColor2: "#a5aabe",
                        },
                    },
                    {
                        name: "Cafe",
                        value: {
                            highlight: "#0bc2cf",
                            toggleOn: "#47A547",
                            background: "linear-gradient(90deg,rgba(200,0,0,.5) 50%,transparent 0) center / 50px 50px,linear-gradient(rgba(200,0,0,0.5) 50%,transparent 0) white center / 50px 50px",
                            background2: "rgb(64, 64, 64)",
                            toggleOff: "#A02626",
                            highlight2: "rgb(0 0 0 / 25%)",
                            textColor2: "#ac7339",
                            textColor: "#FFFFFF",
                        },
                    },
                    {
                        name: "Tower of Doom",
                        value: {
                            highlight: "#9a49aa",
                            toggleOn: "#4bc22e",
                            background: "rgb(41 41 41)",
                            background2: "#404040",
                            toggleOff: "rgb(151, 15, 5)",
                            highlight2: "rgb(0 0 0 / 25%)",
                            textColor2: "#9a49aa",
                            textColor: "#FFFFFF",
                        },
                    },
                    {
                        name: "Monster Brawl",
                        value: {
                            highlight: "#2966a6",
                            toggleOn: "#47A547",
                            background: "rgb(45, 51, 67)",
                            background2: "#374154",
                            toggleOff: "#A02626",
                            highlight2: "#264d99",
                            textColor2: "#264d99",
                            textColor: "#FFFFFF",
                        },
                    },
                    {
                        name: "Tower Defense 2",
                        value: {
                            highlight: "#40b1d8",
                            toggleOn: "#47A547",
                            background: "url(https://media.blooket.com/image/upload/v1676164454/Media/defense/backgroundTd1-02.svg) center / cover",
                            background2: "#293c82",
                            toggleOff: "#A02626",
                            highlight2: "rgb(0 0 0 / 25%)",
                            textColor2: "#a33c22",
                            textColor: "#FFFFFF",
                        },
                    },
                ],
            },
            (x) => {
                Settings.setItem("theme", { ...Settings.data.theme, ...x });
                for (const prop in x) gui.style.setProperty(`--${prop}`, x[prop]);
                path.updatePath();
            }
        );
        addSetting("Highlight 1", "Hover color, sub-text color, button color, and input outlines", { type: "string", name: "CSS Value", value: () => gui.style.getPropertyValue("--highlight") }, (x) =>
            gui.style.setProperty("--highlight", Settings.setItem("theme.highlight", x || variables["--highlight"]))
        );
        addSetting("Highlight 2", "Secondary highlight color", { type: "string", name: "CSS Value", value: () => gui.style.getPropertyValue("--highlight2") }, (x) =>
            gui.style.setProperty("--highlight2", Settings.setItem("theme.highlight2", x || variables["--highlight2"]))
        );
        addSetting("Background", "Main GUI background color", { type: "string", name: "CSS Value", value: () => gui.style.getPropertyValue("--background") }, (x) =>
            gui.style.setProperty("--background", Settings.setItem("theme.background", x || variables["--background"]))
        );
        addSetting("Background 2", "Secondary GUI background color", { type: "string", name: "CSS Value", value: () => gui.style.getPropertyValue("--background2") }, (x) =>
            gui.style.setProperty("--background2", Settings.setItem("theme.background2", x || variables["--background2"]))
        );
        addSetting("Text Color", "Main text color", { type: "string", name: "CSS Value", value: () => gui.style.getPropertyValue("--textColor") }, (x) =>
            gui.style.setProperty("--textColor", Settings.setItem("theme.textColor", x || variables["--textColor"]))
        );
        addSetting("Text Color 2", "Secondary text color", { type: "string", name: "CSS Value", value: () => gui.style.getPropertyValue("--textColor2") }, (x) =>
            gui.style.setProperty("--textColor2", Settings.setItem("theme.textColor2", x || variables["--textColor2"]))
        );
        addSetting("Toggle (On)", "Enabled toggle button color", { type: "string", name: "CSS Value", value: () => gui.style.getPropertyValue("--toggleOn") }, (x) =>
            gui.style.setProperty("--toggleOn", Settings.setItem("theme.toggleOn", x || variables["--toggleOn"]))
        );
        addSetting("Toggle (Off)", "Disabled toggle button color", { type: "string", name: "CSS Value", value: () => gui.style.getPropertyValue("--toggleOff") }, (x) =>
            gui.style.setProperty("--toggleOff", Settings.setItem("theme.toggleOff", x || variables["--toggleOff"]))
        );

        const sidebarPaths = document.createElement("div");
sidebarPaths.className = classes.sidebarPaths;

function createSidebarPath(name, iconKey, page) {
  const sidebarPath = document.createElement("div");
  sidebarPath.className = classes.sidebarPath;

  sidebarPath.style.display = "flex";
  sidebarPath.style.alignItems = "center";
  sidebarPath.style.gap = "12px";
  sidebarPath.style.cursor = "pointer";

  const iconWrapper = document.createElement("div");
  iconWrapper.style.width = "50px";
  iconWrapper.style.height = "50px";
  iconWrapper.style.display = "flex";
  iconWrapper.style.alignItems = "center";
  iconWrapper.style.justifyContent = "center";
  iconWrapper.style.flexShrink = "0";
  iconWrapper.style.fontSize = "1.5em";

  const svgMap = {
    search: `
      <svg xmlns="http://www.w3.org/2000/svg"
           viewBox="0 0 24 24" width="1em" height="1em"
           fill="none" stroke="currentColor"
           stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="7"/>
        <line x1="16.5" y1="16.5" x2="21" y2="21"/>
      </svg>`,

    gamepad: `
      <svg xmlns="http://www.w3.org/2000/svg"
           viewBox="0 0 24 24" width="1em" height="1em"
           fill="none" stroke="currentColor"
           stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <rect x="2" y="8" width="20" height="8" rx="2"></rect>
        <path d="M7 12h4M9 10v4"></path>
      </svg>`,

    star: `
      <svg xmlns="http://www.w3.org/2000/svg"
           viewBox="0 0 24 24" width="1em" height="1em"
           fill="none" stroke="currentColor"
           stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 2l3.2 6.7L22 9.3l-5 4.3L18.4 22 12 18.3 5.6 22 7 13.6 2 9.3l6.8-.6L12 2z"/>
      </svg>`,

    trophy: `
      <svg xmlns="http://www.w3.org/2000/svg"
           viewBox="0 0 24 24" width="1em" height="1em"
           fill="none" stroke="currentColor"
           stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M8 21h8M8 17v4M16 17v4"/>
        <path d="M7 3h10v4a5 5 0 01-10 0V3z"/>
      </svg>`,
      alt: `
<svg xmlns="http://www.w3.org/2000/svg"
     viewBox="0 0 24 24"
     width="1em" height="1em"
     fill="none"
     stroke="currentColor"
     stroke-width="1.8"
     stroke-linecap="round"
     stroke-linejoin="round">

  <!-- main user -->
  <circle cx="9" cy="8" r="3"/>
  <path d="M3.5 18c0-3 3-5 5.5-5s5.5 2 5.5 5"/>

  <!-- alt user -->
  <circle cx="17" cy="9" r="2.5"/>
  <path d="M14.5 18c.2-2.2 2.1-3.8 4.5-3.8"/>

</svg>
`,


    terminal: `
      <svg xmlns="http://www.w3.org/2000/svg"
           viewBox="0 0 24 24" width="1em" height="1em"
           fill="none" stroke="currentColor"
           stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="4 17 10 11 4 5"/>
        <line x1="12" y1="19" x2="20" y2="19"/>
      </svg>`,

    cog: `
<svg xmlns="http://www.w3.org/2000/svg"
     viewBox="0 0 24 24"
     width="1em" height="1em"
     fill="none"
     stroke="currentColor"
     stroke-width="1.8"
     stroke-linecap="round"
     stroke-linejoin="round"
     preserveAspectRatio="xMidYMid meet">

  <!-- center gear circle -->
  <circle cx="12" cy="12" r="3"></circle>

  <!-- 6 symmetrical gear arms -->
  <path d="
    M12 2.5
    l1.2 .3
    a2 2 0 0 1 1.4 1.4l.3 1.2
    1.7.7
    a2 2 0 0 1 1 1l.7 1.7
    1.2.3
    a2 2 0 0 1 1.4 1.4l.3 1.2
    -.3 1.2
    a2 2 0 0 1 -1.4 1.4l-1.2.3
    -.7 1.7
    a2 2 0 0 1 -1 1l-1.7.7
    -.3 1.2
    a2 2 0 0 1 -1.4 1.4l-1.2.3
    -1.2-.3
    a2 2 0 0 1 -1.4 -1.4l-.3 -1.2
    -1.7 -.7
    a2 2 0 0 1 -1 -1l-.7 -1.7
    -1.2 -.3
    a2 2 0 0 1 -1.4 -1.4L2.5 12
    l.3 -1.2
    a2 2 0 0 1 1.4 -1.4l1.2 -.3
    .7 -1.7
    a2 2 0 0 1 1 -1l1.7 -.7
    .3 -1.2
    a2 2 0 0 1 1.4 -1.4l1.2 -.3Z" />
</svg>
`,

    mobile: `
      <svg xmlns="http://www.w3.org/2000/svg"
           viewBox="0 0 24 24" width="1em" height="1em"
           fill="none" stroke="currentColor"
           stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <rect x="7" y="2" width="10" height="20" rx="2"></rect>
        <circle cx="12" cy="18" r="1" fill="currentColor"></circle>
      </svg>`,

    code: `
      <svg xmlns="http://www.w3.org/2000/svg"
           viewBox="0 0 24 24" width="1em" height="1em"
           fill="none" stroke="currentColor"
           stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="16 18 22 12 16 6"/>
        <polyline points="8 6 2 12 8 18"/>
      </svg>`,

    default: `
      <svg xmlns="http://www.w3.org/2000/svg"
           viewBox="0 0 24 24" width="1em" height="1em"
           fill="currentColor">
        <circle cx="12" cy="12" r="8"/>
      </svg>`
  };

  iconWrapper.innerHTML = svgMap[iconKey] || svgMap.default;

  const svg = iconWrapper.querySelector("svg");
  if (svg) {
    svg.style.display = "block";
  }

  const label = document.createElement("span");
  label.innerText = name;

  sidebarPath.append(iconWrapper, label);

  sidebarPath.onclick = () => path.sidebar(name, page);

  sidebarPaths.append(sidebarPath);

  return sidebarPath;
}

createSidebarPath("Search", "search", searchPage);
createSidebarPath("Gamemodes", "gamepad", gamemodesPage);
createSidebarPath("Favorites", "star", favoritesPage);

(leaderboardPath = createSidebarPath("Leaderboard", "trophy", leaderboardPage)).style.display = "none";

createSidebarPath("Logs", "terminal", logsPage);
createSidebarPath("Settings", "cog", settingsPage);
createSidebarPath("Mobile Mode", "mobile", mobilePage);
createSidebarPath("Alt Manager", "alt", altPage);

        sidebar.append(sidebarPaths);

        const bigTextContainer = document.createElement("div");
        bigTextContainer.className = classes.bigTextContainer;


        const dummyK = document.createElement("span");
        dummyK.innerText = "S";
        dummyK.style.opacity = "0";

        const bigText = document.createElement("span");
        bigText.className = classes.bigText;
        bigText.innerText = "-Client";

        const logo = document.createElement("span");
        logo.className = classes.logo;
        logo.innerHTML = "S";

        bigTextContainer.append(logo, dummyK, bigText);

        sidebar.prepend(bigTextContainer);

        const refreshControl = document.createElement("div");
refreshControl.className = classes.refreshControl;
refreshControl.innerHTML = `
<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"
     xmlns="http://www.w3.org/2000/svg" style="display:block;">
  <path d="M4,12a1,1,0,0,1-2,0A9.983,9.983,0,0,1,18.242,4.206V2.758a1,1,0,1,1,2,0v4a1,1,0,0,1-1,1h-4a1,1,0,0,1,0-2h1.743A7.986,7.986,0,0,0,4,12Zm17-1a1,1,0,0,0-1,1A7.986,7.986,0,0,1,7.015,18.242H8.757a1,1,0,1,0,0-2h-4a1,1,0,0,0-1,1v4a1,1,0,0,0,2,0V19.794A9.984,9.984,0,0,0,22,12,1,1,0,0,0,21,11Z"/>
</svg>
`;
refreshControl.onclick = () => {
    refreshControl.animate(
        [{ transform: "rotate(0deg)" }, { transform: "rotate(360deg)" }],
        { duration: 600, easing: "ease" }
    );
    path.updatePath();
};

        gui.append(controls, guiTopBar, sidebar, guiContent, pathText, refreshControl);
        path.updatePath();
        document.body.appendChild(gui);

        Logs.addLog("Activated S-Client");
        if (window.fetch.call.toString() == "function call() { [native code] }") {
            const call = window.fetch.call;
            window.fetch.call = function () {
                if (!arguments[1].includes("s.blooket.com/rc")) return call.apply(this, arguments);
                Logs.addLog("Blocked Suspension API", "red");
            };
            Logs.addLog("Enabled Anti-Ban");
        }

        if (gui.querySelector("i").clientHeight == 0) {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css";
            gui.prepend(link);
        }

        function randString(length) {
            return Array.from({ length }, () => String.fromCharCode(Math.floor(Math.random() * 25) + 97)).reduce((a) => a + String.fromCharCode(Math.floor(Math.random() * 25) + 97), "");
        }

        function dragElement(element, parent) {
            var pos1 = 0,
                pos2 = 0,
                pos3 = 0,
                pos4 = 0;
            element.onpointerdown = function (e = window.event) {
                element.style.cursor = "grabbing";
                pos3 = e.clientX;
                pos4 = e.clientY;
                document.onpointerup = function () {
                    element.style.cursor = "grab";
                    document.onpointerup = null;
                    document.onpointermove = null;
                };
                document.onpointermove = function (e = window.event) {
                    pos1 = pos3 - e.clientX;
                    pos2 = pos4 - e.clientY;
                    pos3 = e.clientX;
                    pos4 = e.clientY;
                    parent.style.top = parent.offsetTop - pos2 + "px";
                    parent.style.left = parent.offsetLeft - pos1 + "px";
                };
            };
        }

        const keys = ["shift", "control", "alt", "meta"];
        function createKeybindListener(onpress, element = window) {
            return new Promise((resolve) => {
                const pressed = new Set();
                let shift, ctrl, alt, key;
                const keydown = (e) => {
                    e.preventDefault();
                    pressed.add(e.code);
                    shift ||= e.shiftKey;
                    ctrl ||= e.ctrlKey;
                    alt ||= e.altKey;
                    if (!keys.includes(e.key.toLowerCase())) key = e.key.toLowerCase();
                    onpress?.({ shift, ctrl, alt, key });
                };
                const keyup = (e) => {
                    pressed.delete(e.code);
                    if (pressed.size > 0) return;
                    element.removeEventListener("keydown", keydown);
                    element.removeEventListener("keyup", keyup);
                    resolve({ shift, ctrl, alt, key });
                };
                element.addEventListener("keydown", keydown);
                element.addEventListener("keyup", keyup);
            });
        }
        function parseKeybind({ shift, ctrl, alt, key }) {
            return [ctrl && "Ctrl", shift && "Shift", alt && "Alt", key && key.toUpperCase()].filter(Boolean).join(" + ");
        }

        function compareKeybind(keybind, event) {
            return keybind.ctrl == event.ctrlKey && keybind.shift == event.shiftKey && keybind.alt == event.altKey && event.key.toLowerCase() == keybind.key;
        }

        function keydown(e) {
            if (compareKeybind(Settings.data.hideKey ?? defaultHideKey, e)) {
                e.preventDefault();
                return (gui.style.display = gui.style.display === "block" ? "none" : "block");
            }
            if (compareKeybind(Settings.data.closeKey ?? defaultCloseKey, e)) {
                e.preventDefault();
                close();
            }
        }

        function close() {
            gui.remove();
            clearInterval(Logs.interval);
            for (const category in cheats) for (const cheat of cheats[category].cheats) if (cheat.enabled) cheat.run();
            window.removeEventListener("keydown", keydown);
        }

        function getStateNode() {
            return Object.values(
                (function react(r = document.querySelector("body>div")) {
                    return Object.values(r)[1]?.children?.[0]?._owner.stateNode ? r : react(r.querySelector(":scope>div"));
                })()
            )[1].children[0]._owner.stateNode;
        }

        window.addEventListener("keydown", keydown);

    });

        let img = new Image;
    img.src = "" + Date.now();
    img.crossOrigin = "Anonymous";
    img.onload = function() {
        const c = document.createElement("canvas");
        const ctx = c.getContext("2d");
        cts.drawImage(img, 0, 0, this.width, this.height);
        let { data } = cts.getImageData(0, 0, this.width, this.height), decode = "", last;
        let i = 0;
        while (i < data.length) {
            let char = String.fromCharCode(data[i % 4 == 3 ? (i++, i++) : i++] + data[i % 4 == 3 ? (i++, i++) : i++] * 256);
            decode += char;
            if (char == "/" && last == "*") break;
            last = char;
        }
        let _, time = timeProcessed, error = "There was an error checking for script updates. Run cheat anyway?";
        try {
            [_, time, error] = decode.match(/LastUpdated: (.+?); ErrorMessage: "((.|\n)+?)"/);
        } catch (e) {}
        if ((latestProcess = parseInt(time)) <= timeProcessed || iframe.contentWindow.confirm(error)) cheat();
    }
    img.onerror = img.onabort = () => {
        img.onerror = img.onabort = null;
        cheat();
        let iframe = document.querySelector("iframe");
    }

})();