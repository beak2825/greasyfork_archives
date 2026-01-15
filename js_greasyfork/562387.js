// ==UserScript==
// @name         Snay.io - Red-ish Theme
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      1.0.2
// @description  Applies a red theme to Snay! Will improve soon.
// @author       You
// @match        https://www.snay.io/
// @icon         https://i.imgur.com/JFTQzqd.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562387/Snayio%20-%20Red-ish%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/562387/Snayio%20-%20Red-ish%20Theme.meta.js
// ==/UserScript==

// Animations are faster now
// Icons were changed because of how weird it looked
// box-shadow in #overlays changed to "inset" and gave it a red color. (i hope)
// Mod menu's colors were changed to red.
// Leaderboard was changed a bit too.
// Nameplate, progerss bar above nameplate and server port container is probably red.
// Buttons have red shadows now.
// That should be about it.
// You can leave now.
// Maybe consider using this.
// Thanks :3

(function() {
    'use strict';
    var style = `
#overlays, #connecting {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    min-width: var(--app-width, 100vw);
    min-height: var(--app-height, 100vh);
    padding: env(safe-area-inset-top, 0px) env(safe-area-inset-right, 0px) env(safe-area-inset-bottom, 0px) env(safe-area-inset-left, 0px);
    background-image: url(https://www.crimson.co.nz/assets/crimson-background-Vignette.png);
    -webkit-box-shadow: inset 0px 0px 1vw 1vw rgba(0, 0, 0, 1);
    box-shadow: inset 0px 0px 5vw rgba(0, 0, 0, 1);
    background-size: cover;
    background-position: center;
    z-index: 200;
}
    #profile-btn {
    background-image: url(https://i.imgur.com/HOa9fxw.png);
    width: 70px;
}
    #support-btn {
    width: 70px;
    background-image: url(https://i.imgur.com/LmYww0J.png);
}
    #seasons-btn {
    width: 70px;
    background-image: url(https://i.imgur.com/tBLE0cH.png);
}
    #shop-btn {
    width: 70px;
    background-image: url(https://www.freeiconspng.com/uploads/red-bag-png-28.png);
}
    #leaderboards-btn {
    width: 70px;
    background-image: url(https://cdn3.emoji.gg/emojis/5175-red-crown.png);
}
    #discord-btn {
    width: 65px;
    background-image: url(https://i.imgur.com/ZVO3dK8.png);
}
#title {
    position: absolute;
    width: 60vmin;
    height: 25vmin;
    left: 50vw;
    top: -1vw;
    transform: translateX(-50%);
}
.main-form-bg {
    font-size: 15px;
    padding: 5px;
    border-radius: 10px;
    background: linear-gradient(135deg, rgb(167 3 3 / 58%), rgb(169 0 0 / 62%));
    color: #f4f6fb;
    width: 250px;
    height: 45px;
    margin: 0;
    border: 1px solid rgba(91, 201, 255, 0.35);
    display: flex;
    align-items: center;
    gap: 4px;
}
#gallery-btn {
    border-radius: 100%;
    width: 130px;
    height: 130px;
    margin: 0;
    border: 3px solid rgba(24, 8, 66, 0.877);
    box-shadow: inset 14px -10px 20px rgb(255 0 0);
    z-index: 25;
    background-color: rgba(255, 255, 255, 0.6);
    background-image: url(index.css);
}
#play-btn, #spectate-btn, #settings-btn {
    border-style: solid;
    border-width: 2px;
    box-shadow: -9px 7px 20px rgb(255 0 0);
    border-radius: 20px;
    width: 110px;
    height: 60px;
    margin: 30px 10px 10px 10px;
    z-index: 25;
}
.mod-menu {
    background: #3d0000c7;
    border: .15vw solid #ff0000;
    border-radius: .8vw;
    box-shadow: inset 0 .4vw 1.2vw #ff0000b8;
    margin: 0;
    max-height: 70vh;
    overflow: hidden;
    position: absolute;
    right: 1vw;
    top: 1vw;
    width: 24vw;
    z-index: 80;
}
.mod-menu__card {
    background: #69010182;
    border: .12vw solid #ff0000b3;
    border-radius: .6vw;
    display: flex;
    flex-direction: column;
    gap: .6vw;
    padding: 1vw;
}
.mod-menu__header {
    align-items: center;
    background: #350000eb;
    border-bottom: .12vw solid #ff0000;
    display: flex;
    justify-content: space-between;
    padding: 1vw 1.4vw;
}
.mod-menu__slider-output {
    color: #ff9b9b;
    font-size: 1.2vw;
    height: 1.6vw;
    justify-content: flex-end;
    line-height: 1.2vw;
    margin: 0;
    min-width: 3vw;
    text-align: right;
}
.mod-menu__switch--on .mod-menu__switch-track {
    background: linear-gradient(90deg, #890000d9, #ff0000f2);
    border-color: #ff0303;
}
.mod-menu__switch:not(.mod-menu__switch--on) .mod-menu__switch-track {
    background: #00000014;
    border-color: #ff0000;
}
.mod-menu__card-description {
    color: #f7b9b9;
    font-size: .95vw;
    letter-spacing: .07vw;
    line-height: 1.2vw;
    margin: 0;
    opacity: .9;
    padding: 0;
}
.mod-menu__close {
    background: #4f0000;
    border: .12vw solid #cd3232;
    border-radius: .5vw;
    color: #ed0404;
    cursor: pointer;
    font-size: 1.6vw;
    height: 2.4vw;
    margin-left: .4vw;
    padding: .15vw;
    width: 2.4vw;
}
.mod-menu__slider {
    -webkit-appearance: none;
    appearance: none;
    background: linear-gradient(90deg, #590101, #cf0000);
    border-radius: 1vw;
    flex: 1 1;
    height: .4vw;
    margin: 0;
    outline: none;
    padding: 0;
}
#leaderboard {
    display: flex;
    flex-direction: column;
    gap: 0.2vw;
    padding: 0.3vw 0.7vw 0.6vw;
    width: 19vw;
    height: auto;
    margin: 0;
    overflow: hidden;
    font-family: sans-serif;
    font-weight: bold;
    font-size: 1.45vw;
    line-height: 1.05;
    position: absolute;
    top: 1vw;
    right: 1vw;
    z-index: 1;
    color: #ff0000;
    background: linear-gradient(135deg, rgb(99 4 4 / 90%), rgb(129 0 0 / 90%));
    border-radius: 0.8vw;
    border: 0.12vw solid rgba(255, 255, 255, 0.12);
    box-shadow: inset 0 0.5vw 1.4vw rgb(255 0 0 / 50%);
}
#nick {
    flex: 1;
    font-size: 15px;
    margin: 0;
    padding: 0 42px 0 10px;
    background: linear-gradient(135deg, rgb(157 0 0 / 85%), rgb(83 0 0 / 87%));
    color: #f4f6fb;
    border: 1px solid rgba(91, 201, 255, 0.35);
    transition: border-color 0.18s ease, transform 0.18s ease;
    min-width: 0;
    border-radius: 10px;
}
.fade-in {
    animation: fadeIn cubic-bezier(0, 0, 0, 1.91) 0.5s;
}
.fade-out {
    animation: fadeOut cubic-bezier(0, 0, 0, 1.99) 0.5s;
}
#players-btn {
    width: 65px;
    background-image: url(https://i.imgur.com/Qi5v1ub.png);
}`;
    var elem = document.createElement('style');
    elem.innerText = style;
    document.head.appendChild(elem);
})();