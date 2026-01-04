// ==UserScript==
// @name         Sylith
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Sylith Ultimate Fake Cheat Hub (Visual Only, Safe)
// @match        *://deadshot.io/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/548469/Sylith.user.js
// @updateURL https://update.greasyfork.org/scripts/548469/Sylith.meta.js
// ==/UserScript==

(function(){
    'use strict';

    // ------------------- HUB SETUP -------------------
    const hub = document.createElement("div");
    hub.style.position = "fixed";
    hub.style.top = "120px";
    hub.style.left = "120px";
    hub.style.width = "480px";
    hub.style.background = "linear-gradient(135deg, #0a0a0a, #1f1f1f)";
    hub.style.padding = "14px";
    hub.style.borderRadius = "16px";
    hub.style.boxShadow = "0 0 30px rgba(0,255,255,0.6)";
    hub.style.color = "white";
    hub.style.fontFamily = "'Segoe UI', sans-serif";
    hub.style.zIndex = 99999;
    hub.style.cursor = "default";
    hub.style.userSelect = "none";
    hub.style.transition = "all 0.3s ease";

    // ------------------- HEADER -------------------
    const header = document.createElement("div");
    header.textContent = "Sylith";
    header.style.fontSize = "22px";
    header.style.fontWeight = "bold";
    header.style.marginBottom = "12px";
    header.style.textAlign = "center";
    header.style.textShadow = "0 0 8px cyan";
    header.style.cursor = "move";
    hub.appendChild(header);

    // ------------------- DRAGGING -------------------
    let isDragging = false, offsetX, offsetY;
    header.addEventListener("mousedown", e => {
        isDragging = true;
        offsetX = e.clientX - hub.offsetLeft;
        offsetY = e.clientY - hub.offsetTop;
    });
    document.addEventListener("mouseup", () => isDragging = false);
    document.addEventListener("mousemove", e => {
        if(isDragging){
            hub.style.left = `${e.clientX - offsetX}px`;
            hub.style.top = `${e.clientY - offsetY}px`;
        }
    });

    // ------------------- TABS -------------------
    const tabContainer = document.createElement("div");
    tabContainer.style.display = "flex";
    tabContainer.style.justifyContent = "space-around";
    tabContainer.style.marginBottom = "12px";
    hub.appendChild(tabContainer);

    const tabs = ["Aimbot","Visuals","Misc","Fun","Settings","Advanced","Extra"];
    let currentPage = "Aimbot";

    tabs.forEach(tabName=>{
        const btn = document.createElement("button");
        btn.textContent = tabName;
        btn.style.flex = "1";
        btn.style.margin = "0 3px";
        btn.style.padding = "6px";
        btn.style.border = "none";
        btn.style.borderRadius = "6px";
        btn.style.background = "rgba(0,255,255,0.15)";
        btn.style.color = "white";
        btn.style.cursor = "pointer";
        btn.style.transition = "0.25s";
        btn.onmouseover = () => btn.style.background = "rgba(0,255,255,0.35)";
        btn.onmouseout = () => btn.style.background = "rgba(0,255,255,0.15)";
        btn.addEventListener("click", ()=>{
            currentPage = tabName;
            updatePage();
        });
        tabContainer.appendChild(btn);
    });

    // ------------------- CONTENT -------------------
    const content = document.createElement("div");
    content.style.maxHeight = "360px";
    content.style.overflowY = "auto";
    content.style.paddingRight = "4px";
    content.style.transition = "opacity 0.3s ease";
    hub.appendChild(content);

    // ------------------- SEARCH BAR -------------------
    const searchBar = document.createElement("input");
    searchBar.type = "text";
    searchBar.placeholder = "Search features...";
    searchBar.style.width = "100%";
    searchBar.style.padding = "5px";
    searchBar.style.marginBottom = "6px";
    searchBar.style.borderRadius = "6px";
    searchBar.style.border = "none";
    searchBar.style.background = "rgba(0,255,255,0.05)";
    searchBar.style.color = "white";
    content.appendChild(searchBar);

    // ------------------- FAKE FEATURES -------------------
    const features = {
        "Aimbot":["Enable Aimbot","Silent Aim","FOV Circle","Smooth Aim","Auto Headshot","Triggerbot","Auto Shoot","Bullet Prediction","Target Prioritization","Recoil Control"],
        "Visuals":["ESP","Wallhack","Chams","Glow Players","Custom Crosshair","Name Tags","Distance Indicator","Box ESP","Skeleton ESP","Hitbox Expander","Rainbow ESP","Particle Effects"],
        "Misc":["Speedhack","Bunny Hop","No Recoil","Infinite Ammo","Radar","Teleport","Fake Lag","Ping Spoofer","Instant Reload","Auto Loot","Fake Kill Feed","Auto Spray"],
        "Fun":["Screen Shake","Fake Chat","Confetti","Emotes","Custom Sprays","Explosions","Random Sounds","Rainbow HUD","Fake Notifications","Party Mode"],
        "Settings":["GUI Color","Font Size","Transparency","Animations","Hotkeys","FOV Circle Color","HUD Position","Sound Alerts","Custom Keybinds","Theme Selector","Slider Example","Advanced Options"],
        "Advanced":["Debug Mode","Profiler","Custom Scripts","Anti-Ban Simulation","Fake Console Logs","Memory Viewer","FPS Limiter","Ping Controller","Script Loader","Developer Tools","Network Analyzer"],
        "Extra":["Ultimate ESP","Teleport Anywhere","God Mode","Fast Build","Instant Kill","Infinite XP","Invisible Mode","Fake Server Hops","Fake Achievements","Super Rainbow Mode"]
    };

    const toggles = {};
    const sliders = {};
    const colorPickers = {};

    function updatePage(){
        // Fade out
        content.style.opacity = 0;
        setTimeout(()=>{
            // Clear previous content except search
            content.innerHTML = "";
            content.appendChild(searchBar);

            const filtered = features[currentPage].filter(f=>{
                return f.toLowerCase().includes(searchBar.value.toLowerCase());
            });

            filtered.forEach(name=>{
                const container = document.createElement("div");
                container.style.marginBottom = "6px";

                if(name.toLowerCase().includes("color") || name.toLowerCase().includes("theme")){
                    const input = document.createElement("input");
                    input.type = "color";
                    input.value = "#00ffff";
                    input.style.width = "100%";
                    container.appendChild(document.createTextNode(name));
                    container.appendChild(document.createElement("br"));
                    container.appendChild(input);
                    colorPickers[name] = input;
                } else if(name.toLowerCase().includes("size") || name.toLowerCase().includes("fov") || name.toLowerCase().includes("slider")){
                    const slider = document.createElement("input");
                    slider.type = "range";
                    slider.min = 1;
                    slider.max = 100;
                    slider.value = 50;
                    slider.style.width = "100%";
                    container.appendChild(document.createTextNode(name));
                    container.appendChild(document.createElement("br"));
                    container.appendChild(slider);
                    sliders[name] = slider;
                } else {
                    const btn = document.createElement("button");
                    btn.textContent = `${name}: OFF`;
                    btn.style.width = "100%";
                    btn.style.padding = "6px";
                    btn.style.border = "none";
                    btn.style.borderRadius = "6px";
                    btn.style.background = "rgba(0,255,255,0.1)";
                    btn.style.color = "white";
                    btn.style.cursor = "pointer";
                    btn.style.transition = "0.2s";
                    btn.onmouseover = () => btn.style.background = "rgba(0,255,255,0.3)";
                    btn.onmouseout = () => btn.style.background = "rgba(0,255,255,0.1)";
                    btn.addEventListener("click", ()=>{
                        const isOn = btn.textContent.endsWith("ON");
                        btn.textContent = `${name}: ${isOn ? "OFF" : "ON"}`;
                    });
                    container.appendChild(btn);
                    toggles[name] = btn;
                }
                content.appendChild(container);
            });

            // Fade in
            content.style.opacity = 1;
        },150);
    }

    searchBar.addEventListener("input", updatePage);

    updatePage();

    // ------------------- FOOTER -------------------
    const footer = document.createElement("div");
    footer.textContent = "Made By Caspian";
    footer.style.textAlign = "center";
    footer.style.fontSize = "12px";
    footer.style.marginTop = "8px";
    footer.style.color = "#0ff";
    footer.style.textShadow = "0 0 4px cyan";
    hub.appendChild(footer);

    document.body.appendChild(hub);

    // ------------------- F2 toggle hub -------------------
    document.addEventListener("keydown", e=>{
        if(e.code === "F2") hub.style.display = hub.style.display === "none" ? "block" : "none";
    });

})();