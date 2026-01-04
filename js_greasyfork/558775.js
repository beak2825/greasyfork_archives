// ==UserScript==
// @name         Tiktok revanced
// @name:pt-br   Pulador de anúncios do tiktok
// @namespace    http://tampermonkey.net/
// @version      28-12-2025
// @description:pt-br   Scrolla os anúncios do tiktok automaticamente e adiciona um botão que coloca velocidade 2x
// @description         Auto AD Skip tiktok + 2x speed button
// @author       Potly
// @match        https://www.tiktok.com/*
// @icon         https://www.tiktok.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558775/Tiktok%20revanced.user.js
// @updateURL https://update.greasyfork.org/scripts/558775/Tiktok%20revanced.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const TOGGLE_KEY = "autoAdSkip_enabled";
    let enabled = localStorage.getItem(TOGGLE_KEY);
    if (enabled === null) enabled = "true";
    enabled = enabled === "true";

    function saveState() {
        localStorage.setItem(TOGGLE_KEY, enabled ? "true" : "false");
    }

    // ---------------------------
    // BOTÃO TOGGLE
    // ---------------------------
    function createToggle() {
        const wrapper = document.createElement("div");
        wrapper.style.position = "fixed";
        wrapper.style.top = "30px";
        wrapper.style.left = "170px";
        wrapper.style.zIndex = "999999";
        wrapper.style.display = "flex";
        wrapper.style.alignItems = "center";
        wrapper.style.gap = "10px";
        wrapper.style.userSelect = "none";

        // texto
        const label = document.createElement("span");
        label.textContent = "Auto AD Skip";
        label.style.fontSize = "18px";
        label.style.fontFamily = "Arial, sans-serif";
        label.style.fontWeight = "600";
        label.style.color = "#ffffff";
        wrapper.appendChild(label);

        // container do toggle
        const toggle = document.createElement("div");
        toggle.style.width = "50px";
        toggle.style.height = "26px";
        toggle.style.borderRadius = "50px";
        toggle.style.background = enabled ? "#4caf50" : "#ccc";
        toggle.style.position = "relative";
        toggle.style.cursor = "pointer";
        toggle.style.transition = "0.25s";
        toggle.style.boxShadow = "0 0 5px rgba(0,0,0,0.2)";

        // bolinha
        const knob = document.createElement("div");
        knob.style.width = "22px";
        knob.style.height = "22px";
        knob.style.background = "#fff";
        knob.style.borderRadius = "50%";
        knob.style.position = "absolute";
        knob.style.top = "2px";
        knob.style.left = enabled ? "26px" : "2px";
        knob.style.transition = "0.25s";
        knob.style.boxShadow = "0 2px 5px rgba(0,0,0,0.3)";

        toggle.appendChild(knob);
        wrapper.appendChild(toggle);
        document.body.appendChild(wrapper);

        toggle.onclick = () => {
            enabled = !enabled;
            saveState();

            // animação on e off
            toggle.style.background = enabled ? "#4caf50" : "#ccc";
            knob.style.left = enabled ? "26px" : "2px";
        };
    }

    if (document.readyState !== "loading") createToggle();
    else document.addEventListener("DOMContentLoaded", createToggle);

    // ---------------------------
    // Detecta se é ad
    // ---------------------------

    const selector = "div.css-3fgk4e-7937d88b--DivItemTagsContainer.e1d0egbk0 > div";
    const clickButtonSelector = "#main-content-homepage_hot > aside > div > div:nth-child(2) > button";

    const adKeywords = [
        "anúncio", "anuncio", "patrocinado", "patrocinada",
        "publicidade", "publi", "sponsored", "ad", "promo"
    ];

    const processed = new WeakSet();

    function isAd(el) {
        const text = (el.innerText || "").toLowerCase();
        return adKeywords.some(k => text.includes(k));
    }
 // acho q ter um delayzinho entre cada clique é bom, pq um pc ruim pode bugar

    let lastClick = 0;
function clickButton() {
    if (!enabled) return;
    const now = Date.now();
    if (now - lastClick < 500) return; // evita spam
    lastClick = now;
    const btn = document.querySelector(clickButtonSelector);
    if (btn) btn.click();

    }

    function handleNewAds() {
        document.querySelectorAll(selector).forEach(el => {
            if (processed.has(el)) return;
            if (!isAd(el)) return;

            processed.add(el);

            const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting && enabled) {
            clickButton();
            io.disconnect(); // para evitar vazamento de memoria
        }
    });
}, { threshold: 0.01 });


            io.observe(el);
        });
    }


//-----------------------------------------------------------

const SPEED_WHILE_HOLD = 2.0;
    const DEFAULT_SPEED = 1.0;

        const targetContainerSelector =
"section[class*='SectionActionBarContainer']";


//pega o vídeo que está assistindo no momento
function getCurrentVideo() {
        const videos = document.querySelectorAll("video");
        for (const v of videos) {
            const r = v.getBoundingClientRect();
            if (r.width > 0 && r.height > 0) return v;
        }
return null;
    }

function setSpeed(speed) {
        const video = getCurrentVideo();
        if (video) video.playbackRate = speed;
    }

        function createHoldButton(container) {
    if (container.querySelector("#hold-speed-wrapper")) return;

    const wrapper = document.createElement("div");
    wrapper.id = "hold-speed-wrapper";
    wrapper.style.position = "absolute";
    wrapper.style.left = "50%";
    wrapper.style.transform = "translateX(-50%)";
    wrapper.style.bottom = "100%";
    wrapper.style.marginBottom = "12px";
    wrapper.style.display = "flex";
    wrapper.style.flexDirection = "column";
    wrapper.style.alignItems = "center";
    wrapper.style.zIndex = "999999";


// ícone fast-forward (CSS)
const style = document.createElement("style");
style.textContent = `
.ff-icon {
    display: flex;
    gap: -3px;
    margin-left: 3px;
}

.ff-icon span {
    width: 0;
    height: 0;
    border-top: 8px solid transparent;
    border-bottom: 8px solid transparent;
    border-left: 12px solid white;
}
`;
document.head.appendChild(style);


    const btn = document.createElement("div");

    btn.innerHTML = `
  <div class="ff-icon">
    <span></span>
    <span></span>
  </div>
`;

    btn.style.display = "flex";
btn.style.justifyContent = "center";
btn.style.alignItems = "center";

btn.style.width = "48px";
btn.style.height = "48px";
btn.style.borderRadius = "50%";

btn.style.backgroundColor = "rgba(255, 255, 255, 0.12)";
btn.style.cursor = "pointer";

btn.style.transition = "200ms ease-in-out";
btn.style.marginTop = "8px";
btn.style.marginBottom = "6px";

btn.style.fontSize = "0px"; // igual TikTok
btn.style.userSelect = "none";


    const label = document.createElement("div");
    label.innerHTML = "<strong>2.0X</strong>";
    label.style.fontSize = "12px";
    label.style.marginTop = "4px";
    label.style.color = "rgba(255, 255, 255, 0.75)";
    label.style.opacity = "0.9";

// --- HOLD EVENTS ---
btn.addEventListener("mousedown", () => setSpeed(SPEED_WHILE_HOLD));
btn.addEventListener("mouseup", () => setSpeed(DEFAULT_SPEED));
btn.addEventListener("mouseleave", () => setSpeed(DEFAULT_SPEED));
btn.addEventListener("touchstart", () => setSpeed(SPEED_WHILE_HOLD));
btn.addEventListener("touchend", () => setSpeed(DEFAULT_SPEED));
btn.addEventListener("touchcancel", () => setSpeed(DEFAULT_SPEED));

// monta corretamente
wrapper.appendChild(btn);
wrapper.appendChild(label);

container.style.position = "relative";
container.prepend(wrapper);}


    function tryInjectButton() {
    document
        .querySelectorAll("section[class*='SectionActionBarContainer']")
        .forEach(container => {
            createHoldButton(container);
        });
}

//espera aparecer os botão do lado, pq o vídeo carrega antes doos botão e isso pode bugar a extensão se n esperar blablabla
function waitForFirstActionBar() {
    return new Promise(resolve => {
        const check = () => {
            const bar = document.querySelector(
                "section[class*='SectionActionBarContainer']"
            );
            if (bar) {
                resolve();
            } else {
                requestAnimationFrame(check);
            }
        };
        check();
    });
}

    // Observer pra feed infinito
   const mo = new MutationObserver(() => {
    tryInjectButton();
    handleNewAds();
});

mo.observe(document.body, {
    childList: true,
    subtree: true
});

// inicial
waitForFirstActionBar().then(() => {
    tryInjectButton();
    handleNewAds();
});

//evita vazamento de memoria
const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting && enabled) {
            clickButton();
            io.disconnect(); // <- IMPORTANTE
        }
    });
}, { threshold: 0.01 });


})();