// ==UserScript==
// @name         Kick Embed Volume & Speed Controls, Latency Display
// @match        https://player.kick.com/*
// @grant        none
// @version      1.62
// @author       Phil
// @description  Adds volume, speed, latency controls + refined UI layout
// @license      MIT
// @namespace yuniDev.kickembedcontrols
// @downloadURL https://update.greasyfork.org/scripts/561791/Kick%20Embed%20Volume%20%20Speed%20Controls%2C%20Latency%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/561791/Kick%20Embed%20Volume%20%20Speed%20Controls%2C%20Latency%20Display.meta.js
// ==/UserScript==

/* ---------------- Utilities ---------------- */

function waitForElement(selector) {
    return new Promise(resolve => {
        const el = document.querySelector(selector);
        if (el) return resolve(el);

        const obs = new MutationObserver(() => {
            const found = document.querySelector(selector);
            if (found) {
                obs.disconnect();
                resolve(found);
            }
        });

        obs.observe(document.body, { childList: true, subtree: true });
    });
}

function waitForHls(video) {
    return new Promise(resolve => {
        const check = () => {
            const hls = video.hls || video._hls || video.__hls;
            if (hls && hls.levels?.length) resolve(hls);
            else setTimeout(check, 300);
        };
        check();
    });
}

function addTooltip(el, text) {
    el.addEventListener("mouseenter", () => {
        const tip = document.createElement("div");
        tip.textContent = text;
        tip.style.cssText = `
            position: fixed;
            background: #fff;
            color: #000;
            padding: 5px 8px;
            font-size: 12px;
            border-radius: 4px;
            z-index: 9999;
            pointer-events: none;
            font-family: Inter, sans-serif;
        `;
        document.body.appendChild(tip);

        const r = el.getBoundingClientRect();
        tip.style.left = `${r.left + r.width / 2 - tip.offsetWidth / 2}px`;
        tip.style.top = `${r.top - tip.offsetHeight - 8}px`;

        el._tip = tip;
    });

    el.addEventListener("mouseleave", () => {
        el._tip?.remove();
        el._tip = null;
    });
}

/* ---------------- Dropdown ---------------- */

let openMenu = null;

function createDropdown(btn, options, onSelect, defaultValue) {
    const menu = document.createElement("div");
    menu.style.cssText = `
        position: fixed;
        background: #1a1a1a;
        border: 1px solid #333;
        border-radius: 4px;
        min-width: 120px;
        z-index: 9999;
        display: none;
        font-family: Inter, sans-serif;
    `;

    const rows = new Map();

    options.forEach(opt => {
        const row = document.createElement("div");
        row.style.cssText = `
            padding: 8px 14px 8px 30px;
            color: white;
            font-size: 13px;
            cursor: pointer;
            position: relative;
        `;
        row.textContent = opt;

        const dot = document.createElement("span");
        dot.style.cssText = `
            position: absolute;
            left: 12px;
            top: 50%;
            transform: translateY(-50%);
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #53fc18;
            box-shadow: 0 0 6px #53fc18;
            opacity: ${opt === defaultValue ? 1 : 0};
        `;

        row.appendChild(dot);

        row.onmouseenter = () => row.style.background = "#333";
        row.onmouseleave = () => row.style.background = "transparent";

        row.onclick = () => {
            rows.forEach(v => v.dot.style.opacity = 0);
            dot.style.opacity = 1;
            onSelect(opt);
            closeMenu();
        };

        rows.set(opt, { row, dot });
        menu.appendChild(row);
    });

    document.body.appendChild(menu);

    function open() {
        if (openMenu && openMenu !== menu) {
            openMenu.style.display = "none";
        }

        menu.style.visibility = "hidden";
        menu.style.display = "block";
        const h = menu.offsetHeight;
        menu.style.display = "none";
        menu.style.visibility = "visible";

        const r = btn.getBoundingClientRect();
        menu.style.left = `${r.left + r.width / 2 - menu.offsetWidth / 2}px`;
        menu.style.top = `${Math.max(8, r.top - h - 8)}px`;
        menu.style.display = "block";

        openMenu = menu;
    }

    function closeMenu() {
        menu.style.display = "none";
        if (openMenu === menu) openMenu = null;
    }

    btn.onclick = e => {
        e.stopPropagation();
        if (menu.style.display === "block") closeMenu();
        else open();
    };

    document.addEventListener("click", () => closeMenu());

    return rows;
}

/* ---------------- Controls ---------------- */

function rightControls(toolbar) {
    return toolbar.lastElementChild || toolbar;
}

/* ---- Speed ---- */

function createSpeedSelector(video, toolbar) {
    const btn = document.createElement("button");
    btn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
             stroke="white" stroke-width="2.5" stroke-linecap="round">
            <circle cx="12" cy="12" r="9"/>
            <path d="M12 7v6l4 2"/>
        </svg>`;
    btn.style.cssText = "background:none;border:none;padding:8px;cursor:pointer;";
    addTooltip(btn, "Playback Speed");

    createDropdown(
        btn,
        ["0.5x","0.75x","1x","1.25x","1.5x","2x"],
        v => video.playbackRate = parseFloat(v.replace("x","")),
        "1x"
    );

    rightControls(toolbar).prepend(btn);
}

/* ---- Quality ---- */

function createQualitySelector(video, toolbar) {
    const btn = document.createElement("button");

    // Correct white cog icon (from cog.svg)
    btn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
             xmlns="http://www.w3.org/2000/svg"
             stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 15.5a3.5 3.5 0 1 0 0-7a3.5 3.5 0 0 0 0 7z"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83a2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33a1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2a2 2 0 0 1-2-2v-.09a1.65 1.65 0 0 0-1-1.51a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0a2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2a2 2 0 0 1 2-2h.09a1.65 1.65 0 0 0 1.51-1a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83a2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2a2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0a2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2a2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z"/>
        </svg>
    `;

    btn.style.cssText = "background:none;border:none;padding:8px;cursor:pointer;";
    addTooltip(btn, "Quality");

    createDropdown(
        btn,
        ["Auto","1080p","720p","480p","360p","160p"],
        async label => {
            const hls = await waitForHls(video);
            if (label === "Auto") {
                hls.autoLevelEnabled = true;
                hls.currentLevel = -1;
                return;
            }
            const h = parseInt(label);
            const idx = hls.levels.findIndex(l => l.height === h);
            if (idx !== -1) {
                hls.autoLevelEnabled = false;
                hls.currentLevel = idx;
            }
        },
        "Auto"
    );

    rightControls(toolbar).prepend(btn);
}

/* ---- Latency ---- */

function getLatency(video) {
    if (!video || !video.buffered.length) return "0.00s";
    const lat = video.buffered.end(video.buffered.length - 1) - video.currentTime;
    return lat > 0 ? lat.toFixed(2) + "s" : "0.00s";
}

/* ---------------- Main Init ---------------- */

(async () => {
    const video = await waitForElement("video");
    const toolbar = video.previousElementSibling;

    // Hide original mute button if present
    toolbar.querySelectorAll("button").forEach(btn => {
        const label = (btn.getAttribute("aria-label") || "").toLowerCase();
        if (label.includes("mute") || label.includes("volume")) {
            btn.style.display = "none";
        }
    });

    /* ---- Live Playback Auto-Slow ---- */
    video.addEventListener("timeupdate", () => {
        if (video.buffered.length <= 0) return;
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        const isLive = Math.abs(bufferedEnd - video.currentTime) < 1;
        if (isLive && video.playbackRate > 1) video.playbackRate = 1;
    });

    /* ---- Latency Display (PASSIVE) ---- */

    const latContainer = document.createElement("div");
    latContainer.style.cssText = `
        display: flex;
        align-items: center;
        color: white;
        font-size: 13px;
        font-weight: 600;
        margin: 0 10px;
        user-select: none;
        font-family: Inter, sans-serif;
    `;

    const dot = document.createElement("span");
    dot.style.cssText = `
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #53fc18;
        margin-right: 6px;
    `;

    const latText = document.createElement("span");
    latText.textContent = "Latency: --";

    latContainer.appendChild(dot);
    latContainer.appendChild(latText);

    toolbar.insertBefore(latContainer, toolbar.firstChild);

    setInterval(() => {
        latText.textContent = `Latency: ${getLatency(video)}`;
    }, 1000);

    /* ---- Mute Button (RIGHT SIDE) ---- */

    const muteBtn = document.createElement("button");
    muteBtn.style.cssText = "background:none;border:none;padding:8px;cursor:pointer;";
    addTooltip(muteBtn, "Mute");

    function setMuteIcon() {
        if (video.muted || video.volume === 0) {
            muteBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                     stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                    <line x1="23" y1="9" x2="17" y2="15"/>
                    <line x1="17" y1="9" x2="23" y2="15"/>
                </svg>
            `;
        } else {
            muteBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                     stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                    <path d="M15 9a3 3 0 0 1 0 6"/>
                    <path d="M17.5 7a6 6 0 0 1 0 10"/>
                </svg>
            `;
        }
    }

    muteBtn.onclick = () => {
        video.muted = !video.muted;
        if (!video.muted && video.volume === 0) video.volume = 0.5;
        setMuteIcon();
    };

    video.addEventListener("volumechange", setMuteIcon);
    setMuteIcon();

    /* ---- Volume Slider ---- */

    const slider = document.createElement("input");
    slider.type = "range";
    slider.min = "0";
    slider.max = "1";
    slider.step = "0.01";
    slider.value = 1;

    slider.style.cssText = `
        width: 110px;
        height: 6px;
        border-radius: 4px;
        border: 1px solid #222;
        background: #53fc18;
        cursor: pointer;
        accent-color: #53fc18;
    `;

    slider.addEventListener("mouseenter", () => {
        slider.style.background = "#3cbf12";
    });
    slider.addEventListener("mouseleave", () => {
        slider.style.background = "#53fc18";
    });

    slider.addEventListener("input", e => {
        const value = parseFloat(e.target.value);
        video.volume = value;
        video.muted = value === 0;
        setMuteIcon();
    });

    // Add mute + slider to far right
    rightControls(toolbar).appendChild(muteBtn);
    rightControls(toolbar).appendChild(slider);

    /* ---- Speed + Quality ---- */
    createSpeedSelector(video, toolbar);
    createQualitySelector(video, toolbar);
})();