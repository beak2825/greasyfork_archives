// ==UserScript==
// @name         X-GUI CLIENT FOR BLOOKET
// @namespace    http://tampermonkey.net/
// @version      6.10x
// @description  NOT PATCHED ANYMORE, THE BEST GUI ON THE WEB! ADVANCED ANTIBAN AND TONS OF FEATURES {CHEAT} {HACK} {CLIENT}
// @author       You
// @run-at       document-end
// @match        *://*.blooket.com/*
// @match        *://blooket.com/*
// @license      APGL-3.0
// @icon         https://media1.giphy.com/media/v1.Y2lkPTZjMDliOTUyNGpzdnl1czBxcm14bGt6OWR5MHVucnIzN3BseGxrNDRrZGpoMGZ1MyZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/pgslAFp1vWALCgFlrC/giphy.gif
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557161/X-GUI%20CLIENT%20FOR%20BLOOKET.user.js
// @updateURL https://update.greasyfork.org/scripts/557161/X-GUI%20CLIENT%20FOR%20BLOOKET.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
 * @license AGPL-3.0
 * Blooket Cheats
 * Copyright (C) 2023-present 05Konz/Xullys
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * Source: https://github.com/Blooket-Council/Blooket-Cheats * EMAIL: 05konz994@gmail.com
 * Source: https://greasyfork.org/en/scripts/553301/versions/new * EMAIL slinkingfox@outlook.com

*/

/* THE UPDATE CHECKER IS ADDED DURING COMMIT PREP, THERE MAY BE REDUNDANT CODE, DO NOT TOUCH */

(() => {
    let iframe = document.querySelector("iframe");
    if (!iframe) {
        iframe = document.createElement("iframe");
        iframe.style.display = "none";
        document.body.append(iframe);

(function() {
  const globalKey = "xgui_welcomeDismissed";
  if (localStorage.getItem(globalKey) === "true") return; // stops popup everywhere if checked

  const popup = document.createElement("div");
  popup.style.cssText = `
    position: fixed;
    inset: 0;
    display: grid;
    place-items: center;
    background: rgba(0,0,0,0.6);
    backdrop-filter: blur(6px);
    z-index: 999999;
    animation: fadeIn 0.3s ease;
  `;

  const box = document.createElement("div");
  box.style.cssText = `
    background: linear-gradient(145deg, #11111A, #1B1B2E);
    color: #E4E4F0;
    padding: 16px 22px;
    width: 340px;
    border-radius: 12px;
    font-family: 'Nunito', sans-serif;
    position: relative;
    box-shadow: 0 4px 20px rgba(0,0,0,0.7);
    animation: slideUp 0.32s ease;
    text-align: center;
  `;

  box.innerHTML = `
    <div style="font-size: 1.45em; font-weight: 700; margin-bottom: 8px;">
      Welcome to shlamians dumbass gui
    </div>
    <div style="font-size: 0.95em; color: #B0A8FF; margin-bottom: 12px; line-height:1.3;">
      The sleekest, most advanced Blooket client — enjoy the experience!
    </div>

    <label style="display:flex;align-items:center;justify-content:center;gap:8px;margin-top:10px;cursor:pointer;font-size:0.9em;user-select:none;">
      <div style="
        position: relative;
        width: 36px;
        height: 18px;
        background: #333;
        border-radius: 9px;
        transition: background 0.3s;
      " id="xgui_switch">
        <div style="
          position: absolute;
          top: 1px;
          left: 1px;
          width: 16px;
          height: 16px;
          background: #ccc;
          border-radius: 50%;
          transition: left 0.3s, background 0.3s;
        " id="xgui_knob"></div>
      </div>
      Don't show again on all Blooket pages 😝
    </label>
  `;

  const switchEl = box.querySelector("#xgui_switch");
  const knob = box.querySelector("#xgui_knob");
  let checked = false;

  switchEl.onclick = () => {
    checked = !checked;
    if (checked) {
      switchEl.style.background = "#7F5AF0";
      knob.style.left = "19px";
      knob.style.background = "#fff";
    } else {
      switchEl.style.background = "#333";
      knob.style.left = "1px";
      knob.style.background = "#ccc";
    }
  };

  const close = document.createElement("div");
  close.textContent = "✕";
  close.style.cssText = `
    position: absolute;
    top: 6px;
    right: 8px;
    font-size: 1.2em;
    cursor: pointer;
    color: #FF6B6B;
    transition: 0.2s;
  `;
  close.onmouseover = () => close.style.color = "#FF3B3B";
  close.onmouseleave = () => close.style.color = "#FF6B6B";

  close.onclick = () => {
    if (checked) {
      localStorage.setItem(globalKey, "true"); // disables popup globally on all pages
    }
    popup.style.animation = "fadeOut 0.25s ease";
    setTimeout(() => popup.remove(), 200);
  };

  box.appendChild(close);
  popup.appendChild(box);
  document.body.appendChild(popup);

  const style = document.createElement("style");
  style.textContent = `
    @keyframes fadeIn { from {opacity:0;} to {opacity:1;} }
    @keyframes fadeOut { from {opacity:1;} to {opacity:0;} }
    @keyframes slideUp { from {transform:translateY(30px);opacity:0;} to {transform:translateY(0);opacity:1;} }
  `;
  document.head.appendChild(style);
})();

    }
    /* By CryptoDude3 */
    if (window.fetch.call.toString() == 'function call() { [native code] }') {
        const call = window.fetch.call;
        window.fetch.call = function () {
            if (!arguments[1].includes("s.blooket.com/rc")) return call.apply(this, arguments);
        }
    }
    const timeProcessed = 1747005941679;
    let latestProcess = -1;
    const cheat = (async () => {
        const versionName = "6.10x";
        const gui = document.createElement("div");
        Object.assign(gui.style, {
            top: window.innerHeight / 2 - 250 + "px",
            left: innerWidth / 2 - 400 + "px",
        });
        const variables = {
    "--highlight": "#8A2BE2",     // Bright purple highlight (like Blooket’s Tower glow)
    "--highlight2": "#4B0082",    // Deep indigo secondary
    "--background": "#0B0B1E",    // Dark bluish background
    "--background2": "#151534",   // Slightly lighter dark layer
    "--textColor": "#E0E0FF",     // Soft light text
    "--textColor2": "#9A8CFF",    // Muted purple text
    "--toggleOff": "#2C273F",   // Deep shadowy indigo — off
    "--toggleOn": "#5FA3FF",    // Muted soft blue — on, pops subtly
        };

        let settings,
            settingsKey = "KGUI.BenIsASillyGoose";
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
            `.bigTextContainer,.version{align-items:center;user-select:none}.cheatsList>div,.settingsPage>div{padding:5px 10px}.gamemode,.gui,.leaderboardList,.sidebar{box-sizing:border-box}.controls>div,.credit,.pathText,.runCheat,.sidebarPath,.version{user-select:none}.noScroll::-webkit-scrollbar{display:none}.noScroll{-ms-overflow-style:none;scrollbar-width:none}.gui {
  position: fixed;
  z-index: 100;
  background: var(--background);
  height: 500px;
  width: 800px;
  color: #fff;
  padding-left: 50px;
  font-size: 16px;

  /* clean corners */
  border-radius: 20px;
  overflow: hidden; /* hides overlapping sidebar edges */

  /* strobing purple edge */
  box-shadow: 0 0 15px var(--highlight);
  animation: edgePulse 2s ease-in-out infinite;
}

/* add a wrapper to keep glow around full rounded border */
.gui::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 20px;
  border: 2px solid var(--highlight);
  pointer-events: none; /* lets you click through it */
  animation: edgePulse 2s ease-in-out infinite;
}

/* animate border glow */
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
.controls,.credit,.gamemodesList,.guiContent,.guiTopBar,.sidebar,.sidebarShadow,.version{position:absolute}.sidebarShadow{inset:0;background:#000;opacity:0%;pointer-events:none;transition:.2s;z-index:9}.controls>div,.guiContent,.sidebar,select[data-type] option{background:var(--background2)}.sidebarShadow:has(~ .sidebar:hover){opacity:40%}.credit{bottom:0;left:0;right:0;height:0;transition:.1s;overflow:hidden;text-align:center}.sidebar{top:0;left:0;height:100%;width:50px;transition:.2s 0.1s;z-index:10;overflow-x:hidden;padding-bottom:30px}.sidebar:hover{width:200px;transition-delay:0s}.sidebar:hover>.credit{height:25px;transition:.4s 0.2s}.guiContent{inset:20px;left:70px;top:40px;z-index:1;padding-top:32px}.guiTopBar{z-index:1;top:0;left:50px;right:0;height:25px}.version{top:0;left:0;margin-inline:10px;color:#888;font-size:.9em;letter-spacing:.5px;height:100%;display:flex}.controls{top:0;right:0;display:grid;grid-template-columns:1fr 1fr 1fr;height:25px;width:122px;gap:1px;border:1px solid var(--background);z-index:2}.controls>div{display:grid;place-items:center;font-weight:100}.closeControl{transition:.1s}.closeControl:hover{background:red}.creditsPage,.gamemodesPage,.searchPage{position:absolute;inset:0;top:32px}.gamemodesList{display:grid;gap:0 30px;padding-inline:30px;margin-top:0;padding-top:15px;margin-bottom:0;grid-template-columns:1fr 1fr;overflow-y:scroll;inset:0}.leaderboardPage,.logsPage{inset:10px;position:absolute}.pathText{position:absolute;top:40px;left:70px;right:20px;z-index:3;padding:7px 10px;height:22px}.clearLogsButton,.refreshControl{z-index:5;place-items:center;cursor:pointer}.leaderboardPage{top:42px}.leaderboardList{list-style:none;margin:0;padding:20px 40px 10px;height:100%;overflow:scroll;font-size:1.5em}.logsPage{top:37px;background:#000d;border-radius:2.5px}.logMessages{list-style:none;margin:10px;padding:0;display:flex;flex-direction:column-reverse;overflow-y:scroll;word-wrap:break-word;position:absolute;inset:0}.clearLogsButton{position:absolute;top:5px;right:5px;width:25px;height:25px;display:grid;scale:-1 1 1;transition:.2s}.searchbarHolder{display:flex;outline:2px solid var(--highlight);margin:10px 20px;height:30px;font-size:2em}.searchbarInput{outline:0;border:none;background:0 0;color:#fff;flex:1;font-size:.5em;font-family:Nunito;padding-inline:5px}.gamemode,.settingsPage>div{border-radius:2.5px;background:var(--background)}.searchbarButton{color:#fff;font-size:.6em;aspect-ratio:1/1;height:30px;display:grid;place-items:center;cursor:pointer}.bigText,.bigTextContainer{height:50px;width:200px;font-family:Titan One}.searchResults{position:absolute;inset:0;top:45px;padding-inline:20px;overflow-y:scroll}.favoritesPage,.settingsPage{inset:0;top:32px;overflow-y:scroll;position:absolute}.noResult{margin:20px 10px;font-size:.85em}.clearLogsButton:hover,.licenseMessage{font-size:1.25em}.favoritesPage{padding-block:10px;padding-inline:20px}.licenseMessage{font-weight:900;padding-inline:20px;margin-top:10px}.copyrightTag{font-size:.7em;font-weight:200;position:absolute;bottom:0;left:0;padding:5px 8px}.codingCredits,.creditLinks,.uploadDates{list-style:none;padding-inline:20px;margin-block:16px}.settingsPage{padding:10px;display:flex;flex-direction:column;gap:10px}.sidebarPaths{display:flex;flex-direction:column;width:200px}.bigTextContainer{display:flex;font-size:2em;margin-block:10px;transition:font-size .2s .1s,margin-block .2s .1s}.bigText{display:flex;align-items:center;justify-content:center}.refreshControl{position:absolute;top:45px;right:25px;width:25px;height:25px;display:grid}.gamemode{width:100%;height:200px;margin-bottom:30px;cursor:pointer;display:flex;justify-content:center;align-items:center;padding-top:10px;position:relative;overflow:hidden;padding-bottom:35px;transition:.4s}.contentPage,.gamemode>div{position:absolute;bottom:0}.gamemode:hover{box-shadow:0 0 10px var(--highlight);transition:.2s}.gamemode>img{width:85%;max-width:100%;max-height:100%}.gamemode>div{left:0;right:0;height:25px;background:var(--highlight);display:flex;justify-content:center;align-items:center;box-shadow:0 -5px 5px #0004;font-weight:800;font-size:1.1em;transition:.25s}.contentPage{inset-inline:0;top:35px}.cheatsList{display:flex;flex-direction:column;height:100%;overflow-y:scroll;padding-inline:10px}.cheatToggle,.cheatToggle>.toggleTrigger,.runCheat{height:35px;border-radius:2.5px}.cheatsList>div{display:grid;margin-bottom:10px;position:relative;background:var(--background);border-radius:2.5px}.cheatInfo,.cheatInputs,.cheatName,.cheatTop,.logMessage>span,.runCheat,.sidebarPath,.sidebarPath>i{display:flex}.cheatInfo{flex-direction:column;flex:1}.cheatName{font-size:1.5em;font-weight:700}.cheatDescription{font-size:.8em;margin-right:25px}.runCheat{--buttonColor:var(--highlight);width:20%;background:var(--buttonColor);margin-block:auto;cursor:pointer;align-items:center;justify-content:center;font-weight:800;transition:.5s;color:#fff!important}.runCheat:hover{box-shadow:0 0 10px 0 var(--buttonColor);transition:.3s}.runCheat:active{box-shadow:0 0 0 0 var(--buttonColor);transition:50ms}.cheatInputs{margin:5px 0 5px 5px;flex-direction:column;gap:5px}.searchResult,.standing{margin-bottom:10px;transition:.2s}.creditsPage>ul>li>strong,.logMessage img,.standingBlook{margin-right:5px}.cheatInputs>div{display:flex;flex-direction:row;font-size:.8rem;color:var(--highlight);font-weight:700;align-items:center}.cheatInputs>div>span{flex:1}.cheatToggle{width:20%;background:var(--highlight2);margin-block:auto;cursor:pointer;position:relative}.cheatToggle>.toggleTrigger{width:45px;position:absolute;top:0;left:0;background:var(--highlight);pointer-events:none;transition:left .2s,box-shadow .5s;z-index:1}.cheatToggle:hover>.toggleTrigger{box-shadow:0 0 10px 0 var(--highlight);transition:left .2s,box-shadow .2s}.toggleTrigger.active{left:calc(100% - 45px)}.toggleColor{position:absolute;inset:10px 20px;background:rgb(from var(--toggleOff) r g b / 25%);border-radius:2.5px;transition:.2s}.toggleTrigger.active+.toggleColor{background:rgb(from var(--toggleOn) r g b / 25%)}input[data-type],select[data-type]{width:20%;height:25px;outline:0;border:2px solid var(--highlight);box-sizing:border-box;background:0 0;color:#fff;font-size:.9em;padding-left:5px;font-family:Nunito;border-radius:2px;font-weight:800}.logo,.sidebarPath>i{width:50px;height:50px}select[data-type]{-webkit-appearance:none;-moz-appearance:none;text-indent:1px;text-overflow:''}input::placeholder{color:rgb(from var(--textColor) r g b / 50%)}input[data-type]::-webkit-inner-spin-button,input[data-type]::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}input[data-type][type=number]{-moz-appearance:textfield}select[data-type] option{border-radius:0}select[data-type]::-ms-expand{display:none}.sidebarPath{align-items:center;cursor:pointer;transition:.2s 0.1s}.searchResult:hover,.sidebarPath:hover{color:var(--highlight);text-shadow:0 0 5px var(--highlight)}.sidebarPath>i{justify-content:center;align-items:center;font-size:1.5em}.sidebarPath>span{padding-left:5px}.sidebar:hover .sidebarPath{padding-left:20px;transition-delay:0s}.logo{left:0;transition:left .2s .1s;display:grid;place-items:center;min-width:50px;position:absolute}.sidebar:hover .logo{left:28px;transition:left .2s}.bigText{margin-top:-150px;transition:margin-top .1s}.sidebar:hover .bigText{margin-top:0;transition:margin-top .4s 0.1s}.sidebar:hover .bigTextContainer{font-size:2.5em;margin-block:20px;transition:font-size .2s,margin-block .2s}/* === Glowing title effect === */
.bigText {
  text-shadow: 0 0 10px var(--highlight), 0 0 20px var(--highlight2);
  animation: glowPulse 2s ease-in-out infinite alternate;
}
@keyframes glowPulse {
  from { text-shadow: 0 0 10px var(--highlight); }
  to { text-shadow: 0 0 25px var(--highlight2), 0 0 40px var(--highlight); }
}
.creditsPage>ul>li>span{color:var(--textColor2);font-weight:800}.creditsPage>ul>li i{margin-inline:2px;line-height:1}.creditsPage a{color:var(--highlight);text-decoration:none}.creditsPage a:hover,.pathPage:hover{text-decoration:underline}.warning{color:var(--highlight2);font-size:.85em}.searchResult{cursor:pointer}.searchResultName{font-weight:800}.searchResultDescription{font-size:.8em}.searchResultSeparator{font-size:1.5em;font-weight:800;margin-block:10px;cursor:pointer;transition:.2s;border-bottom:2px solid #fff;padding-inline:5px;filter:drop-shadow(0px 0px 0px var(--highlight))}.searchResultSeparator:hover{color:var(--highlight);border-bottom:2px solid var(--highlight);filter:drop-shadow(0px 0px 2.5px var(--highlight))}.toggleCheat{--buttonColor:var(--toggleOff)}.toggleCheat.active{--buttonColor:var(--toggleOn)}.logMessage img{height:1em;align-self:center}.standing{display:flex;font-weight:800;align-items:center;position:relative;padding:5px 10px 5px 50px;border-radius:2.5px;background:var(--highlight2)}.standing:before{content:attr(data-place) ".";margin-right:10px}.standing::after{content:attr(data-value);flex:1;text-align:right;font-weight:100}.standing:hover{background:var(--standingColor);box-shadow:0 0 7.5px var(--standingColor)}.standingBlook{height:1.25em;align-self:center;position:absolute;left:10px}.favoriteButton,.favoriteButton>i{transition:.2s;display:grid;place-items:center;width:32px;height:32px}.favoriteButton{font-size:.8em;padding-left:5px;cursor:pointer}.favoriteButton:hover{color:#ff0}.favoriteButton>i{position:absolute;scale:0;transform-origin:50% 55%}.favoriteButton>i.filled{scale:1}.pathPage{cursor:pointer;color:var(--highlight)}[data-favorited=false],[data-favorites="0"]{display:none}
        [data-mode][data-name][data-description] {}`
                .replace(/\.([^0-9][\w-]+)/gm, (x, y) => "." + (classes[y] ??= randString(10)))
                .replace(/data-(\w+)/gm, (x, y) => "data-" + (datasets[y] ??= randString(10)));

        gui.className = classes.gui;

        gui.append(styles);
        const sidebarShadow = document.createElement("div");
        sidebarShadow.className = classes.sidebarShadow;

        gui.appendChild(sidebarShadow);
        const credit = document.createElement("div");
        credit.className = classes.credit;

        credit.innerText = "Created by shlamian";
        const sidebar = document.createElement("div");
        sidebar.className = classes.sidebar;

        sidebar.append(credit);
        const guiContent = document.createElement("div");
        guiContent.className = classes.guiContent;

        const guiTopBar = document.createElement("div");
        guiTopBar.className = classes.guiTopBar;

        const version = document.createElement("span");
        version.className = classes.version;
        version.innerText = "shlamians dumbass gui - " + versionName;
        guiTopBar.append(version);

        const controls = document.createElement("div");
        controls.className = classes.controls;

        const moveControl = document.createElement("div");
        moveControl.style.cursor = "grab";

        moveControl.innerHTML = '<i class="fas fa-arrows-alt-h" style="line-height: 1"></i>';
        const minimizeControl = document.createElement("div");

        minimizeControl.innerHTML = '<i class="fas fa-compress" style="line-height: 1"></i>';
        let hideAnimation = false;
        minimizeControl.onclick = () => {
            if (hideAnimation == (hideAnimation = true)) return;
            const hidden = minimizeControl.minimized;
            if (hidden) {
                minimizeControl.innerHTML = '<i class="fas fa-compress" style="line-height: 1"></i>';
                gui.animate(
                    [
                        {
                            width: "122px",
                            height: "27px",
                            left: gui.style.left,
                        },
                        {
                            width: "800px",
                            height: "500px",
                            left: `${parseInt(gui.style.left) + (hidden ? -678 : 678)}px`,
                        },
                    ],
                    { duration: 200, easing: "ease" }
                );
                gui.style.width = "800px";
                gui.style.height = "500px";
            } else {
                minimizeControl.innerHTML = '<i class="fas fa-expand" style="line-height: 1"></i>';
                gui.animate(
                    [
                        {
                            width: "800px",
                            height: "500px",
                            left: gui.style.left,
                        },
                        {
                            width: "122px",
                            height: "27px",
                            left: `${parseInt(gui.style.left) + (hidden ? -678 : 678)}px`,
                        },
                    ],
                    { duration: 200, easing: "ease" }
                );
                gui.style.width = "122px";
                gui.style.height = "27px";
            }
            setTimeout(
                () => {
                    for (let child of [...gui.children]) {
                        if (child == controls) continue;
                        if (hidden) child.style.display = child.style._display;
                        else {
                            child.style._display = child.style.display;
                            child.style.display = "none";
                        }
                    }
                    hideAnimation = false;
                },
                hidden ? 200 : 0
            );
            gui.style.left = `${parseInt(gui.style.left) + (hidden ? -678 : 678)}px`;
            minimizeControl.minimized = !hidden;
        };
        const closeControl = document.createElement("div");
        closeControl.className = classes.closeControl;
        closeControl.innerHTML = '<i class="fas fa-times" style="line-height: 1"></i>';
        closeControl.onclick = () => gui.remove();
        controls.append(moveControl, minimizeControl, closeControl);
        dragElement(moveControl, gui);

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
                pirate: {
                    sort: "d",
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
                    sabotages: { c: "Oh Canada", b: "Blizzard", f: "Fog Spell", d: "Dark & Dusk", w: "Howling Wind", g: "Gift Time!", t: "TREES", s: "Snow Plow", fr: "Use The Force" },
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
                        s.type = "module";
                        s.src = document.querySelector("script[src*='ac.blooket.com']").src + "?" + Date.now();
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
                                case "pirate":
                                    for (const player in added) {
                                        if (!(addedPlayer = added[player]).tat) continue;
                                        const [tat, amount] = addedPlayer.tat.split(":");
                                        Logs.addAlert(player, `just took ${Logs.formatNumber(parseInt(amount))} doubloons from ${tat}`);
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
                                            const [amount, synergy] = addedPlayer.s.split("-");
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
                    case "/play/pirate":
                    case "/play/pirate/final":
                    case "/pirate/play/landing":
                        return "pirate";
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
                // TURN ON
                this.enabled = true;

                const playerName = stateNode.props.client.name;
                const savedBlook = stateNode.props.client.blook;

                this.data = setInterval(() => {
                    lgc.getDatabaseRef("c").once("value", (snap) => {
                        const players = snap.val() || {};

                        // Host kicked you → your entry removed
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
                // TURN OFF
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
                                if (!cost) return alert("I couldn't find that box!");

                                const canOpen = Math.floor(stateNode.state.tokens / cost);
                                if (canOpen <= 0) return alert("You do not have enough tokens!");
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
                    alert("Bypassed text copied to clipboard!"),
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
                    "Winter Landscape": "winterLandscape",
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

                        name: "Use Any Blook",
                        description: "Allows you to play as any blook",
                        run: function () {
                            const lobby = window.location.pathname.startsWith("/play/lobby"),
                                dashboard = !lobby && window.location.pathname.startsWith("/blooks");
                            if (dashboard) {
                                let key = "konzpack",
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
                options: ["Racing", "Classic", "Factory", "Cafe", "Defense2", "Defense", "Royale", "Gold", "Candy", "Brawl", "Hack", "Pirate", "Fish", "Dino", "Toy", "Rush"]
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
            // === START: extras category to add into the 'cheats' object ===
extras: {
  img: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDI0MCAyNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBvbHlnb24gZmlsbD0iI2ZkZDAyOSIgcG9pbnRzPSIxMjAsMTggMTUxLDk0IDI0MCw5NCAxNjgsMTQ4IDE5NSwyMzAgMTIwLDE4MyA0NSwyMzAgNzIsMTQ4IDAsOTQgODksOTQiLz48L3N2Zz4=",

  name: "Extras",
  cheats: [
    {
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
                a.type = "image/x-icon",
                    a.rel = "shortcut icon",
                    a.href = e || "https://www.blooket.com/favicon.ico",
                    document.getElementsByTagName("head")[0].appendChild(a),
                    document.title = t || "Blooket"
                 }
        }, {

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
// === END: extras category ===

            gold: {
                img: new Date().getMonth() == 9 ? "https://media.blooket.com/image/upload/v1663212881/Media/logos/Candy_Quest_Logo.png" : "https://media.blooket.com/image/upload/v1663212881/Media/logos/Gold_Quest_Logo_Resized.png",
                name: "Gold Quest",
                cheats: [
                    {
                        name: "Always Triple",
                        description: "Always get triple gold",
                        type: "toggle",
                        enabled: false,
                        data: { type: "multiply", val: 3, text: "Triple Gold!", blook: "Unicorn" },
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
                            console.log("Player not found!");
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
                        name: "Get Player's Password",
            description: "Shows the password of any player in an alert box",
            inputs: [{
                name: "Player",
                type: "options",
                options() {
                    let e = Object.values(document.querySelector("body div[id] > div > div"))[1].children[0]._owner.stateNode;
                    return new Promise(t => e.props.liveGameController._liveApp ? e.props.liveGameController.getDatabaseVal("c", e => e && t(Object.keys(e))) : t([]))
                }
            }],
            run: function(player) {
                let i = document.createElement('iframe');
                document.body.append(i);
                const alert = i.contentWindow.alert.bind(window);
                i.remove();
                var t = Object.values(document.querySelector("#app>div>div"))[1].children[0]._owner.stateNode;
                t.props.liveGameController.getDatabaseVal("c", e => {
                    alert(e?.[player]?.p);
                });
            }
        }, {
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
                            console.log("Player not found!");
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
            pirate: {
                img: "https://media.blooket.com/image/upload/v1695317816/Media/logos/PiratesVoyageLogoSmall.png",
                name: "Pirate's Voyage",
                cheats: [
                    {
                        name: "Heist ESP",
                        description: "Shows you what's under each chest during a heist",
                        type: "toggle",
                        enabled: false,
                        data: null,
                        imgs: null,
                        run: function () {
                            if (!this.enabled) {
                                this.enabled = true;
                                this.data = setInterval(() => {
                                    const stateNode = getStateNode();
                                    if (stateNode.state.stage != "heist") return;
                                    if (this.imgs == null) this.imgs = Array.prototype.map.call(Array.prototype.slice.call(document.querySelector("[class*=prizesList]").children, 1, 4), (x) => x.querySelector("img").src);
                                    const esp = Object.values(document.querySelector("[class*=modal]"))[0].return.memoizedState.memoizedState;
                                    for (const e of document.querySelectorAll("[class*=boxContent] > div")) e.remove();
                                    const open = Object.values(document.querySelector("[class*=modal]"))[0].return.memoizedState.next.next.memoizedState;
                                    Array.prototype.forEach.call(document.querySelector("[class*=chestsWrapper]").children, (container, i) => {
                                        const box = container.firstChild.firstChild;
                                        if (open.includes(i)) return (box.style.opacity = "");
                                        box.style.opacity = "0.5";
                                        let d = document.createElement("div");
                                        d.innerHTML = "<img src='" + this.imgs[2 - esp[i]] + "' style='max-width: 75%; max-height: 75%'></img>";
                                        d.className = "chestESP";
                                        d.style.position = "absolute";
                                        d.style.inset = "0";
                                        d.style.display = "grid";
                                        d.style.placeItems = "center";
                                        d.style.pointerEvents = "none";
                                        container.onclick = () => {
                                            d.remove();
                                            box.style.opacity = "";
                                        };
                                        container.firstChild.prepend(d);
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
                        name: "Max Levels",
                        description: "Maxes out all islands and your boat",
                        run: function () {
                            let stateNode = getStateNode();
                            stateNode.setState({ islandLevels: new Array(stateNode.state.islandLevels.length).fill(5) }, stateNode.updateBoatLevel);
                        },
                    },
                    {
                        name: "Set Doubloons",
                        description: "Sets Doubloons",
                        inputs: [
                            {
                                name: "Amount",
                                type: "number",
                            },
                        ],
                        run: function (doubloons) {
                            let stateNode = getStateNode();
                            stateNode.setState({ doubloons });
                            stateNode.props.liveGameController.setVal({
                                path: `c/${stateNode.props.client.name}/d`,
                                val: doubloons,
                            });
                        },
                    },
                    {
                        name: "Start Heist",
                        description: "Starts a heist on someone",
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
                            stateNode.props.liveGameController.getDatabaseVal("c", function (val) {
                                if (val?.[target])
                                    stateNode.setState({
                                        stage: "heist",
                                        heistInfo: { name: target, blook: val[target].b },
                                        prizeAmount: Math.max(1000, val[target].d || 0),
                                    });
                            });
                        },
                    },
                    {
                        name: "Swap Doubloons",
                        description: "Swaps Doubloons with someone",
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
                        run: async function (target) {
                            let stateNode = getStateNode();
                            stateNode.props.liveGameController.getDatabaseVal("c", function (val) {
                                if (!val?.[target]) return;
                                stateNode.props.liveGameController.setVal({
                                    path: `c/${stateNode.props.client.name}`,
                                    val: {
                                        b: stateNode.props.client.blook,
                                        d: val[target].d,
                                        tat: `${target}:${val[target].d - stateNode.state.doubloons}`,
                                    },
                                });
                                stateNode.setState({ doubloons: val[target].d });
                            });
                        },
                    },
                    {
                        name: "Take Doubloons",
                        description: "Takes Doubloons from someone",
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
                        run: async function (target) {
                            let stateNode = getStateNode();
                            stateNode.props.liveGameController.getDatabaseVal("c", function (val) {
                                if (!val?.[target]) return;
                                stateNode.props.liveGameController.setVal({
                                    path: `c/${stateNode.props.client.name}`,
                                    val: {
                                        b: stateNode.props.client.blook,
                                        d: stateNode.state.doubloons + val[target].d,
                                        tat: `${target}:${val[target].d}`,
                                    },
                                });
                                stateNode.setState({ doubloons: stateNode.state.doubloons + val[target].d });
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
                            while (s.length < t) {
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
                                g && !s.includes(g) && s.push(g);
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
                                while (s.length < t) {
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
                                    if (g && !s.includes(g)) s.push(g);
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
                            } else alert("You need to be on the map to run this cheat!");
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
                            } else alert("You need to be on the map to run this cheat!");
                        },
                    },
                    {
                        name: "Max Health",
                        description: "Fills the player's health",
                        run: function () {
                            if (window.location.pathname == "/tower/battle") getStateNode().setState({ myHealth: 100, myLife: 100 });
                            else alert("You need to be in battle to run this cheat!");
                        },
                    },
                    {
                        name: "Max Card Stats",
                        description: "Maxes out player's current card (Only works on attribute select page)",
                        run: function () {
                            const stateNode = getStateNode();
                            if (stateNode.state.phase !== "select") alert("You must be on the attribute selection page!");
                            else stateNode.setState({ myCard: { ...stateNode.state.myCard, strength: 20, charisma: 20, wisdom: 20 } });
                        },
                    },
                    {
                        name: "Min Enemy Stats",
                        description: "Makes the enemy card stats all 0 (Only works on attribute select page)",
                        run: function () {
                            const stateNode = getStateNode();
                            if (stateNode.state.phase !== "select") alert("You must be on the attribute selection page!");
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
                            else alert("You need to be in battle to run this cheat!");
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
                                options: Object.entries({ c: "Oh Canada", b: "Blizzard", f: "Fog Spell", d: "Dark & Dusk", w: "Howling Wind", g: "Gift Time!", t: "TREES", s: "Snow Plow", fr: "Use The Force" }).map(([value, name]) => ({
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

        const creditsPage = document.createElement("div");
        creditsPage.className = classes.creditsPage;

        const mobilePage = document.createElement("div")
        mobilePage.className = classes.mobilePage;
        // ====================== FINAL MOBILE MODE SYSTEM (FULL BLOCK) ===========================
(function () {

    if (!gui) return;

    // ===== Universal storage key so it works on ALL Blooket subdomains =====
    const MOBILE_KEY = "XGUI_MOBILE_MODE_ENABLED";

    let exitBtn = null;

    // ===== Inject Mobile CSS =====
    const mobileCSS = document.createElement("style");
    mobileCSS.innerHTML = `
        /* =================== MOBILE MODE SIDEBAR =================== */

        body.xgui-mobile-mode .X-Gui-sidebar {
            width: 70px !important;
            overflow: hidden !important;

            /* Center icons cleanly */
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 22px !important;

            padding-top: 20px !important;
            padding-bottom: 20px !important;
        }

        body.xgui-mobile-mode .X-Gui-sidebar:hover {
            width: 70px !important;
        }

        body.xgui-mobile-mode .X-Gui-sidebar span {
            display: none !important;
        }

        body.xgui-mobile-mode .X-Gui-sidebar::-webkit-scrollbar {
            display: none !important;
        }

        /* =================== CONTENT AREA =================== */
        body.xgui-mobile-mode .X-Gui-content {
            overflow-y: auto !important;
            max-height: calc(100% - 45px) !important;
            padding-right: 10px !important;
            min-width: 0 !important;
            word-break: break-word !important;
        }

        /* =================== GAMEMODE PAGE TEXT FIX =================== */

        body.xgui-mobile-mode .setting,
        body.xgui-mobile-mode .setting > *,
        body.xgui-mobile-mode .setting-row,
        body.xgui-mobile-mode .setting-row > * {
            min-width: 0 !important;
            max-width: 100% !important;
            white-space: normal !important;
            word-break: break-word !important;
            line-height: 1.25 !important;
        }

        /* Stack multi-column setting rows vertically in mobile */
        body.xgui-mobile-mode .setting {
            display: block !important;
        }
    `;
    document.head.appendChild(mobileCSS);

    // ========================= ENABLE MOBILE MODE =========================
    function enableMobile() {

        // save state across all blooket subdomains
        localStorage.setItem(MOBILE_KEY, "true");

        gui.dataset.mobileMode = "true";
        document.body.classList.add("xgui-mobile-mode");

        // Save original values once
        if (!gui._mobileOrig) {
            gui._mobileOrig = {
                width: gui.style.width,
                contentLeft: guiContent.style.left
            };
        }

        // Perfect mobile width
        gui.style.width = "430px";
        guiContent.style.left = "75px";

        // Hide header
        if (bigTextContainer) bigTextContainer.style.display = "none";

        // Exit button
        if (!exitBtn) {
            exitBtn = document.createElement("div");
            exitBtn.innerText = "Exit Mobile Mode";
            exitBtn.style.cssText = `
                margin: 12px;
                padding: 10px 12px;
                width: fit-content;
                background: #d33;
                color: white;
                font-weight: 700;
                border-radius: 8px;
                cursor: pointer;
            `;
            exitBtn.onclick = disableMobile;
            mobilePage.appendChild(exitBtn);
        } else {
            exitBtn.style.display = "block";
        }
    }

    // ========================= DISABLE MOBILE MODE =========================
    function disableMobile() {

        // remove saved state
        localStorage.removeItem(MOBILE_KEY);

        gui.dataset.mobileMode = "false";
        document.body.classList.remove("xgui-mobile-mode");

        // Restore original UI
        if (gui._mobileOrig) {
            gui.style.width = gui._mobileOrig.width;
            guiContent.style.left = gui._mobileOrig.contentLeft;
        }

        if (bigTextContainer) bigTextContainer.style.display = "";

        if (exitBtn) exitBtn.style.display = "none";
    }

    // ========================= AUTO-LOAD MOBILE MODE =========================
    if (localStorage.getItem(MOBILE_KEY) === "true") {
        setTimeout(() => enableMobile(), 50);
    }

    // ========================= SIDEBAR NAV ACTIVATION =========================
    mobilePage.onPath = function () {
        enableMobile();
    };

    // Optional public toggle
    gui.toggleMobileMode = function () {
        if (gui.dataset.mobileMode === "true") disableMobile();
        else enableMobile();
    };

})();


        const licenseMessage = document.createElement("div");
        licenseMessage.className = classes.licenseMessage;
        licenseMessage.innerHTML = `<i class="fas fa-file-alt" style="line-height: 1;aspect-ratio: 1 / 1;height: 20px;display: inline-grid;place-items: center;"></i> This script is licensed under <a style="color: var(--highlight);" target="_blank" href="https://www.gnu.org/licenses/agpl-3.0.en.html">AGPL-3.0</a>, read more <a style="color: var(--highlight);" target="_blank" href="https://github.com/Blooket-Council/Blooket-Cheats?tab=readme-ov-file#licensing">here</a>.<br>`;

        const copyrightTag = document.createElement("span");
        copyrightTag.className = classes.copyrightTag;

        copyrightTag.innerText = `Copyright © ${new Date().getFullYear()} 05Konz`;

        const codingCredits = document.createElement("ul");
        codingCredits.className = classes.codingCredits;

        codingCredits.append(createCredit("GUI Design + Creation", "05Konz"));
        codingCredits.append(createCredit("Anti-Suspend", "CryptoDude3"));
        codingCredits.append(createCredit("Blooket Cheats", 'gliz <i class="fas fa-long-arrow-alt-right"></i> Minesraft2 <i class="fas fa-long-arrow-alt-right"></i> 05Konz <i class="fas fa-long-arrow-alt-right"></i> XullysFN'));

        const creditLinks = document.createElement("ul");
        creditLinks.className = classes.creditLinks;

        creditLinks.append(createCredit("OG Repo", '<a target="_blank" href="https://github.com/Blooket-Council/Blooket-Cheats">Blooket-Council/Blooket-Cheats</a>'));
        creditLinks.append(createCredit("Gitlab", '<a target="_blank" href="https://gitlab.com/blooket/blooket-cheats">blooket/blooket-cheats</a>'));
        creditLinks.append(createCredit("Greasyfork", '<a target="_blank" href="https://greasyfork.org/en/scripts/553301-x-gui-client-for-blooket">Greasyfork page (Give Me Feedback!)</a>'));

        function parseTime(d) {
            const hour = d.getHours() % 12 == 0 ? 12 : d.getHours() % 12;
            const minutes = d.getMinutes().toString().padStart(2, "0");
            return `${hour}:${minutes} ${d.getHours() >= 12 ? "PM" : "AM"}`;
        }

        function parseDate(d) {
            const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][d.getMonth()];
            return `${month} ${d.getDate()}${getOrdinal(d.getDate())}, ${d.getFullYear()} - ${parseTime(d)}`;
        }

        const uploadDates = document.createElement("ul");
        uploadDates.className = classes.uploadDates;

        try {
            let currentDate = new Date(timeProcessed),
                latestDate = new Date(latestProcess);
            uploadDates.append(createCredit("Current GUI Upload Date", parseDate(currentDate)));
            if (latestProcess != -1) uploadDates.append(createCredit("Latest GUI Upload Date", parseDate(latestDate)));
            if (currentDate < latestDate) {
                const warning = document.createElement("span");
                warning.className = classes.warning;
                warning.innerText = "You are using an outdated version of K-GUI, check out the GitHub / GitLab for a newer version.";
                uploadDates.append(warning);
            }
        } catch {
            const warning = document.createElement("span");
            warning.className = classes.warning;
            warning.innerText = "Unable to check update information.";
            uploadDates.append(warning);
        }

        creditsPage.append(licenseMessage, codingCredits, creditLinks, uploadDates, copyrightTag);

        function getOrdinal(n) {
            if (n % 10 == 1 && n % 100 != 11) return "st";
            if (n % 10 == 2 && n % 100 != 12) return "nd";
            if (n % 10 == 3 && n % 100 != 13) return "rd";
            return "th";
        }

        function createCredit(contribution, html) {
            const listItem = document.createElement("li");
            const contributionText = document.createElement("strong");
            contributionText.innerText = contribution + ":";
            const right = document.createElement("span");
            right.innerHTML = html;
            listItem.append(contributionText, right);
            return listItem;
        }

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
            "A preset look for X-GUI",
            {
                type: "options",
                name: "Preset",
                options: [
                    {
                        name: "X-GUI ORIGINAL",
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
        addSetting("Highlight 2", "Credits page's warning message color", { type: "string", name: "CSS Value", value: () => gui.style.getPropertyValue("--highlight2") }, (x) =>
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
        addSetting("Text Color 2", "Credit page's contributor color", { type: "string", name: "CSS Value", value: () => gui.style.getPropertyValue("--textColor2") }, (x) =>
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

  // Clean and consistent spacing
  sidebarPath.style.display = "flex";
  sidebarPath.style.alignItems = "center";
  sidebarPath.style.gap = "12px";
  sidebarPath.style.cursor = "pointer";

  // Icon wrapper — matches your original 50×50 FA container
  const iconWrapper = document.createElement("div");
  iconWrapper.style.width = "50px";
  iconWrapper.style.height = "50px";
  iconWrapper.style.display = "flex";
  iconWrapper.style.alignItems = "center";
  iconWrapper.style.justifyContent = "center";
  iconWrapper.style.flexShrink = "0";
  iconWrapper.style.fontSize = "1.5em"; // 1.5em scaling matches FA behavior

  // --- CSP-SAFE SVG ICON SET (OUTLINE STYLE) ---
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

    terminal: `
      <svg xmlns="http://www.w3.org/2000/svg"
           viewBox="0 0 24 24" width="1em" height="1em"
           fill="none" stroke="currentColor"
           stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="4 17 10 11 4 5"/>
        <line x1="12" y1="19" x2="20" y2="19"/>
      </svg>`,

    // === NEW PERFECT OUTLINE COG ===
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

  <!-- 6 symmetrical gear arms (perfect hex geometry, zero distortion) -->
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

  // Insert the SVG into the wrapper
  iconWrapper.innerHTML = svgMap[iconKey] || svgMap.default;

  // Clean block rendering inside wrapper
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

// Hidden leaderboard entry stays exactly as you had it
(leaderboardPath = createSidebarPath("Leaderboard", "trophy", leaderboardPage)).style.display = "none";

createSidebarPath("Logs", "terminal", logsPage);
createSidebarPath("Settings", "cog", settingsPage);
createSidebarPath("Mobile Mode", "mobile", mobilePage);
createSidebarPath("Credits", "code", creditsPage);



        sidebar.append(sidebarPaths);

        const bigTextContainer = document.createElement("div");
        bigTextContainer.className = classes.bigTextContainer;


        const dummyK = document.createElement("span");
        dummyK.innerText = "X";
        dummyK.style.opacity = "0";

        const bigText = document.createElement("span");
        bigText.className = classes.bigText;
        bigText.innerText = "-GUI";

        const logo = document.createElement("span");
        logo.className = classes.logo;
        logo.innerHTML = "X";

        bigTextContainer.append(logo, dummyK, bigText);

        sidebar.prepend(bigTextContainer);

        const refreshControl = document.createElement("div");
        refreshControl.innerHTML = `<i class="fas fa-sync" style="line-height: 1"></i>`;
        refreshControl.className = classes.refreshControl;
        refreshControl.onclick = () => {
            refreshControl.animate([{ rotate: "0deg" }, { rotate: "360deg" }], { duration: 1000, easing: "ease" });
            path.updatePath();
        };

        gui.append(controls, guiTopBar, sidebar, guiContent, pathText, refreshControl);
        path.updatePath();
        document.body.appendChild(gui);

        Logs.addLog("Opened X-GUI!");
        /* Anti-Suspend By CryptoDude3 */
        if (window.fetch.call.toString() == "function call() { [native code] }") {
            const call = window.fetch.call;
            window.fetch.call = function () {
                if (!arguments[1].includes("s.blooket.com/rc")) return call.apply(this, arguments);
                Logs.addLog("Blocked Suspension API!", "red");
            };
            Logs.addLog("Enabled Anti-BAN!");
        }

        if (gui.querySelector("i").clientHeight == 0) {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = "https://ka-f.fontawesome.com/releases/v6.5.1/css/pro.min.css";
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
    img.src = "https://cdn.jsdelivr.net/gh/Blooket-Council/Blooket-Cheats@main/autoupdate/timestamps/KGui.png?" + Date.now();
    img.crossOrigin = "Anonymous";
    img.onload = function() {
        const c = document.createElement("canvas");
        const ctx = c.getContext("2d");
        ctx.drawImage(img, 0, 0, this.width, this.height);
        let { data } = ctx.getImageData(0, 0, this.width, this.height), decode = "", last;
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
})();