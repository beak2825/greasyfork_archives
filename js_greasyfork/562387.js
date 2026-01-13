// ==UserScript==
// @name         Snay.io - Red-ish Theme
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      1.0.1
// @description  Applies a red theme to the Snay home menu! Will improve soon.
// @author       You
// @match        https://www.snay.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=snay.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562387/Snayio%20-%20Red-ish%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/562387/Snayio%20-%20Red-ish%20Theme.meta.js
// ==/UserScript==

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
    background-image: url(https://cdn4.iconfinder.com/data/icons/interface-essential-2-5/64/User_Avatar_Social_People_Profile-512.png);
    width: 70px;
}
    #support-btn {
    width: 70px;
    background-image: url(https://png.pngtree.com/png-vector/20240205/ourmid/pngtree-the-red-picture-frame-png-image_11657891.png);
}
    #seasons-btn {
    width: 70px;
    background-image: url(https://pngimg.com/uploads/red_star/red_star_PNG4.png);
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
    background-image: url(https://clipground.com/images/red-discord-logo-1.png);
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
    #players-btn {
    width: 65px;
    background-image: url(https://cdn-icons-png.flaticon.com/512/5675/5675521.png);
}`;
    var elem = document.createElement('style');
    elem.innerText = style;
    document.head.appendChild(elem);
})();