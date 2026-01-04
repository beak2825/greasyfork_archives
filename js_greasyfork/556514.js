// ==UserScript==
// @name         Sakura Vendetta Dark Logs FIX
// @match        https://logs.blackrussia.online/*
// @description  Vendetta Sakura Style
// @version      1.2
// @grant        none
// @run-at       document-end
// @license      MIT
// @namespace    https://greasyfork.org/users/1539528
// @downloadURL https://update.greasyfork.org/scripts/556514/Sakura%20Vendetta%20Dark%20Logs%20FIX.user.js
// @updateURL https://update.greasyfork.org/scripts/556514/Sakura%20Vendetta%20Dark%20Logs%20FIX.meta.js
// ==/UserScript==

(function() {

const style = `
body {
    background: #0a0a0f !important;
}


table, tbody, tr, td, th {
    background: rgba(8, 8, 12, 0.92) !important;
    color: #fff !important;
    border-color: #ff6ec7 !important;
    font-weight: 600 !important;
}

thead tr th {
    background: rgba(20,0,30,0.9) !important;
    color: #ff9ee9 !important;
    text-shadow: 0 0 6px #ff42d1;
}

tbody tr {
    transition: 0.25s;
}
tbody tr:hover {
    background: rgba(255,0,150,0.15) !important;
    box-shadow: 0 0 15px #ff4ad8;
}


td:nth-child(3),
td:nth-child(4),
td:nth-child(5) {
    color: #ffffff !important;
    font-weight: 700 !important;
    text-shadow: 0 0 6px #ff8ddc;
}


body, * {
    cursor: url('https://cur.cursors-4u.net/cursors/cur-2/cur115.cur'), auto !important;
}

.sakura-petal {
    position: fixed;
    width: 12px;
    height: 12px;
    background: #ff8cd6;
    border-radius: 50%;
    pointer-events: none;
    animation: fall 6s linear infinite;
    opacity: 0.8;
    z-index: 999999;
}
@keyframes fall {
    0% { transform: translateY(-10vh) translateX(0); }
    100% { transform: translateY(110vh) translateX(40px); }
}

body::before,
body::after {
    content: "";
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 990;
}
body::before {
    left: 0;
    background: radial-gradient(circle at left, rgba(255,0,150,0.25), transparent);
}
body::after {
    right: 0;
    background: radial-gradient(circle at right, rgba(255,0,150,0.25), transparent);
}


header, .header, #header, .navbar, .topbar {
    background: transparent !important;
}

h1, h2, h3, .title, .logo, header span, header b {
    color: #ffb4f5 !important;
    font-weight: 900 !important;
    text-shadow:
        0 0 8px #ff3acb,
        0 0 15px #ff2ab8,
        0 0 25px #ff5bd6;
    letter-spacing: 1px;
}

:contains("YELLOW (04)") {
    font-size: 32px !important;
    color: #ff9de9 !important;
    font-weight: 900 !important;
    text-shadow:
        0 0 10px #ff3acb,
        0 0 20px #ff2ab8,
        0 0 35px #ff5bd6,
        0 0 50px #ff7fe0;
}
`;


const s = document.createElement("style");
s.innerHTML = style;
document.head.appendChild(s);


setInterval(() => {
    const petal = document.createElement("div");
    petal.className = "sakura-petal";
    petal.style.left = Math.random() * 100 + "vw";
    petal.style.animationDuration = 4 + Math.random() * 6 + "s";
    document.body.appendChild(petal);
    setTimeout(()=>petal.remove(), 9000);
}, 220);

})();