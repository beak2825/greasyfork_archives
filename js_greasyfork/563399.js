// ==UserScript==
// @name         Manchester United × Vendetta — Black Russia Style
// @namespace Vendetta
// @match        https://forum.blackrussia.online/*
// @version      7.0
// @grant        none
// @run-at       document-end
// @license MIT
// @description ManUNTD
// @downloadURL https://update.greasyfork.org/scripts/563399/Manchester%20United%20%C3%97%20Vendetta%20%E2%80%94%20Black%20Russia%20Style.user.js
// @updateURL https://update.greasyfork.org/scripts/563399/Manchester%20United%20%C3%97%20Vendetta%20%E2%80%94%20Black%20Russia%20Style.meta.js
// ==/UserScript==


(function () {

const css = `
body {
    background: #000 url('https://i.imgur.com/JmN0ICw.jpeg') center/cover fixed !important;
    color: #fff !important;
    overflow-x: hidden;
}

body::before {
    content: "";
    position: fixed;
    inset: 0;
    background: radial-gradient(circle at center, rgba(255,0,0,0.15), rgba(0,0,0,0.9));
    backdrop-filter: blur(2px);
    z-index: -2;
}

body::after {
    content: "";
    position: fixed;
    inset: 0;
    background: url('https://i.imgur.com/Sp7oVQO.png') repeat;
    opacity: 0.18;
    mix-blend-mode: screen;
    animation: smoke 18s linear infinite;
    z-index: -1;
}

@keyframes smoke {
    0% { transform: translate(-10px, 0); }
    50% { transform: translate(20px, -20px); }
    100% { transform: translate(-10px, 0); }
}

.light-beam {
    position: fixed;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(255,0,0,0.25), transparent 70%);
    filter: blur(90px);
    animation: moveLights 12s infinite alternate ease-in-out;
    z-index: -1;
}

#light1 { top: -100px; left: -50px; }
#light2 { top: 200px; right: -50px; }

@keyframes moveLights {
    0% { transform: translateY(0); opacity: 0.25; }
    50% { transform: translateY(60px); opacity: 0.45; }
    100% { transform: translateY(0); opacity: 0.25; }
}

.structItem-title a {
    color: #ff2a2a !important;
    font-weight: 600;
    text-shadow: 0 0 4px #ff0000;
}

.structItem-title a:hover {
    color: #ff0000 !important;
}

.block-container,
.block-body,
.message,
.p-body-sidebar,
.structItem-container {
    background: rgba(12, 12, 12, 0.92) !important;
    border: 1px solid rgba(255, 0, 0, 0.25) !important;
    box-shadow:
        inset 0 0 12px rgba(255, 0, 0, 0.25),
        0 0 15px rgba(255, 0, 0, 0.2);
    border-radius: 10px !important;
}

.block-container:hover,
.message:hover,
.structItem:hover {
    border-color: #ff0000 !important;
    box-shadow: 0 0 20px #ff0000 !important;
}

.p-header {
    background: rgba(0,0,0,0.85) !important;
    border-bottom: 2px solid #ff0000 !important;
}

.p-header-logo.p-header-logo--image img {
    content: url('https://upload.wikimedia.org/wikipedia/ru/thumb/7/7a/Manchester_United_FC_crest.svg/500px-Manchester_United_FC_crest.svg.png') !important;
    height: 65px !important;
}

.username {
    color: #ff3b3b !important;
    text-shadow: 0 0 6px #ff0000;
}

.username:hover {
    color: #ff0000 !important;
}

.button {
    background: linear-gradient(90deg, #a00000, #ff0000) !important;
    border: none !important;
    color: #fff !important;
    font-weight: 600;
    text-shadow: 0 0 4px #000;
}

.button:hover {
    box-shadow: 0 0 10px #ff0000;
    filter: brightness(1.2);
}

::-webkit-scrollbar {
    width: 10px;
}

::-webkit-scrollbar-thumb {
    background: #a00000;
    border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
    background: #ff0000;
}
`;

const style = document.createElement("style");
style.textContent = css;
document.head.appendChild(style);

const l1 = document.createElement("div");
l1.id = "light1";
l1.className = "light-beam";

const l2 = document.createElement("div");
l2.id = "light2";
l2.className = "light-beam";

document.body.appendChild(l1);
document.body.appendChild(l2);

})();