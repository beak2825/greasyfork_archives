// ==UserScript==
// @name         Suno Full Macaron UI + Playbar Fix
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Full macaron-style pastel UI for Suno with readable text, animated background, and playbar fix
// @match        https://suno.com/*
// @match        https://www.suno.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/558027/Suno%20Full%20Macaron%20UI%20%2B%20Playbar%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/558027/Suno%20Full%20Macaron%20UI%20%2B%20Playbar%20Fix.meta.js
// ==/UserScript==

GM_addStyle(`
/* --- Force Override Dark Backgrounds --- */
html, body, div, section, main, header, aside, nav {
    background: transparent !important;
    color: #111 !important; /* readable text */
}

/* Remove Suno dark overlays */
div[class*="theme"], div[class*="dark"], div[data-theme="dark"], div[class*="Layout"] {
    background: transparent !important;
}

/* --- Body Background --- */
body {
    position: relative !important;
    overflow-x: hidden !important;
}

/* --- Animated Pastel Gradient Background --- */
body::before {
    content: "";
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: linear-gradient(
        145deg,
        #ffe6f1 0%,
        #eaf2ff 40%,
        #e6fff2 70%,
        #fff8d9 100%
    );
    z-index: -3;
    animation: bgPulse 14s infinite alternate ease-in-out;
}

/* --- Floating Macaron Blobs --- */
body::after {
    content: "";
    position: fixed;
    width: 900px; height: 900px;
    border-radius: 50%;
    background: radial-gradient(circle, #ffd7e0 0%, #ffd7e000 70%);
    top: -200px; left: -200px;
    z-index: -2;
    animation: floatBlob 18s infinite ease-in-out alternate;
}

#macaron-blob2 {
    content: "";
    position: fixed;
    width: 850px; height: 850px;
    border-radius: 50%;
    background: radial-gradient(circle, #d9eaff 0%, #d9eaff00 70%);
    bottom: -250px; right: -200px;
    z-index: -2;
    animation: floatBlob2 22s infinite ease-in-out alternate;
}

@keyframes bgPulse {
    0% { filter: brightness(1) saturate(1); }
    100% { filter: brightness(1.12) saturate(1.25); }
}

@keyframes floatBlob {
    0% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(120px, 80px) scale(1.2); }
    100% { transform: translate(-80px, 40px) scale(0.9); }
}

@keyframes floatBlob2 {
    0% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(-120px, -60px) scale(1.25); }
    100% { transform: translate(80px, -20px) scale(0.85); }
}

/* --- Inject second blob --- */
`);
(function() {
    const blob = document.createElement("div");
    blob.id = "macaron-blob2";
    document.body.appendChild(blob);
})();

GM_addStyle(`
/* --- Glass Cards / Containers --- */
div[class*="card"], div[class*="container"], section, aside, main, header, nav {
    background: rgba(255, 255, 255, 0.75) !important;
    backdrop-filter: blur(14px) !important;
    border-radius: 16px !important;
    box-shadow: 0 8px 22px rgba(0,0,0,0.08) !important;
    color: #111 !important;
}

/* --- Buttons --- */
button {
    background: #dfffea !important;
    border-radius: 14px !important;
    padding: 10px 18px !important;
    border: none !important;
    font-weight: 600 !important;
    transition: all 0.2s ease;
    color: #111 !important;
}

button:hover {
    background: #fff4d7 !important;
    transform: translateY(-2px) !important;
}

/* --- Inputs / Textareas --- */
input, textarea {
    background: #ffd7e0 !important;
    border-radius: 12px !important;
    border: none !important;
    padding: 10px !important;
    box-shadow: inset 0 0 6px rgba(0,0,0,0.06) !important;
    color: #111 !important;
}

/* --- Song Cards / Tracks --- */
div[class*="song"], div[class*="track"] {
    background: #fff4d7 !important;
    border-radius: 18px !important;
    padding: 12px !important;
    box-shadow: 0 4px 18px rgba(0,0,0,0.08) !important;
    color: #111 !important;
}

/* --- Text Everywhere --- */
div, span, p, h1, h2, h3, h4, h5, h6, li, a {
    color: #111 !important; /* readable dark text */
}

/* --- Optional Links --- */
a {
    color: #5a85ff !important;
}

/* --- Playbar Panel Fix --- */
div[class*="flex"][class*="items-center"][class*="justify-between"] {
    background: rgba(255, 244, 215, 0.85) !important; /* pastel yellow glass */
    backdrop-filter: blur(12px) !important;
    border-radius: 14px !important;
}

/* --- Playbar Buttons --- */
div[class*="flex"][class*="items-center"][class*="justify-between"] button {
    background: #dfffea !important; /* pastel green buttons */
    color: #111 !important; /* icons dark */
    border-radius: 50% !important;
    transition: all 0.2s ease !important;
}

div[class*="flex"][class*="items-center"][class*="justify-between"] button:hover {
    background: #ffe6f1 !important; /* pastel pink hover */
    color: #111 !important;
    transform: translateY(-2px) !important;
}

/* --- Playbar Icons (SVG) --- */
div[class*="flex"][class*="items-center"][class*="justify-between"] button svg {
    fill: #111 !important;
}

/* --- Playbar Text / Timestamps --- */
div[class*="flex"][class*="items-center"][class*="justify-between"] span,
div[class*="flex"][class*="items-center"][class*="justify-between"] p,
div[class*="flex"][class*="items-center"][class*="justify-between"] div {
    color: #111 !important;
}

/* --- Progress Bar --- */
input[type="range"] {
    accent-color: #ffd7e0 !important;
}
`);
