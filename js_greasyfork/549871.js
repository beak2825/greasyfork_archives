// ==UserScript==
// @name         Drawaria Text Overlay by 𝘣𝘢𝘳𝘴𝘪𝘬 𝘴𝘯𝘰𝘴𝘦𝘳
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Текст на экране, эффекты и виртуальная клавиатура в Drawaria.online 
// @author       𝘣𝘢𝘳𝘴𝘪𝘬 𝘴𝘯𝘰𝘴𝘦𝘳
// @match        https://drawaria.online/*
// @grant        none
// @license      𝘣𝘢𝘳𝘴𝘪𝘬
// @downloadURL https://update.greasyfork.org/scripts/549871/Drawaria%20Text%20Overlay%20by%20%F0%9D%98%A3%F0%9D%98%A2%F0%9D%98%B3%F0%9D%98%B4%F0%9D%98%AA%F0%9D%98%AC%20%F0%9D%98%B4%F0%9D%98%AF%F0%9D%98%B0%F0%9D%98%B4%F0%9D%98%A6%F0%9D%98%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/549871/Drawaria%20Text%20Overlay%20by%20%F0%9D%98%A3%F0%9D%98%A2%F0%9D%98%B3%F0%9D%98%B4%F0%9D%98%AA%F0%9D%98%AC%20%F0%9D%98%B4%F0%9D%98%AF%F0%9D%98%B0%F0%9D%98%B4%F0%9D%98%A6%F0%9D%98%B3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ================= ОВЕРЛЕЙ =================
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "50%";
    overlay.style.left = "50%";
    overlay.style.transform = "translate(-50%, -50%)";
    overlay.style.background = "rgba(0,0,0,0.6)";
    overlay.style.color = "#fff";
    overlay.style.fontSize = "32px";
    overlay.style.padding = "20px";
    overlay.style.borderRadius = "12px";
    overlay.style.zIndex = "999999";
    overlay.style.pointerEvents = "none";
    overlay.style.whiteSpace = "pre-wrap";
    overlay.style.display = "none";
    overlay.style.transition = "all 0.3s ease";
    document.body.appendChild(overlay);

    // ================= МЕНЮ =================
    const menu = document.createElement("div");
    menu.style.position = "fixed";
    menu.style.bottom = "20px";
    menu.style.right = "20px";
    menu.style.background = "rgba(34,34,34,0.8)";
    menu.style.color = "#fff";
    menu.style.padding = "10px";
    menu.style.border = "2px solid #555";
    menu.style.borderRadius = "8px";
    menu.style.zIndex = "1000000";
    menu.style.fontSize = "14px";
    menu.style.fontFamily = "monospace";
    menu.style.maxWidth = "240px";
    menu.style.backdropFilter = "blur(6px)"; // матовое стекло

    menu.innerHTML = `
        <div style="margin-bottom:6px; font-weight:bold; cursor:move;">Overlay Menu</div>
        <textarea id="overlayInput" style="width:220px; height:60px; resize:none;"></textarea><br>
        
        Цвет: <input id="overlayColor" type="text" value="#ffffff" style="width:80px"><br>
        Размер: <input id="overlaySize" type="number" value="32" min="8" max="200" style="width:60px">px<br>
        Прозрачность: <input id="overlayAlpha" type="range" min="0" max="100" value="100"><br>
        Позиция: 
        <select id="overlayPos">
            <option value="center">Центр</option>
            <option value="top">Верх</option>
            <option value="bottom">Низ</option>
        </select><br>
        Эффект: 
        <select id="overlayEffect">
            <option value="none">Нет</option>
            <option value="blink">Мигание</option>
            <option value="rainbow">Радуга (символы)</option>
            <option value="rainbow-gradient">Радуга (градиент)</option>
            <option value="glitch">Глитч</option>
            <option value="typing">Печать</option>
            <option value="shake">Вибрация</option>
            <option value="fade">Плавное появление</option>
        </select><br><br>

        <button id="showOverlay">Показать</button>
        <button id="hideOverlay">Скрыть</button>
        <button id="toggleKeyboard">Клава</button>
    `;
    document.body.appendChild(menu);

    const input = menu.querySelector("#overlayInput");
    const colorInput = menu.querySelector("#overlayColor");
    const sizeInput = menu.querySelector("#overlaySize");
    const alphaInput = menu.querySelector("#overlayAlpha");
    const posInput = menu.querySelector("#overlayPos");
    const effectInput = menu.querySelector("#overlayEffect");

    input.addEventListener("keydown", (e) => { if (e.code === "Space") e.stopPropagation(); });

    function applySettings() {
        overlay.style.color = colorInput.value || "#fff";
        overlay.style.fontSize = sizeInput.value + "px";
        overlay.style.opacity = alphaInput.value / 100;
        overlay.className = "";
        if (effectInput.value !== "none") overlay.classList.add("effect-" + effectInput.value);

        if (posInput.value === "top") {
            overlay.style.top = "10%"; overlay.style.bottom = ""; overlay.style.transform = "translateX(-50%)";
        } else if (posInput.value === "bottom") {
            overlay.style.top = ""; overlay.style.bottom = "10%"; overlay.style.transform = "translateX(-50%)";
        } else {
            overlay.style.top = "50%"; overlay.style.bottom = ""; overlay.style.transform = "translate(-50%, -50%)";
        }
    }

    menu.querySelector("#showOverlay").onclick = () => { overlay.innerText = input.value; applySettings(); overlay.style.display = "block"; };
    menu.querySelector("#hideOverlay").onclick = () => overlay.style.display = "none";

    // ================= СТИЛИ ЭФФЕКТОВ =================
    const style = document.createElement("style");
    style.textContent = `
    .effect-blink { animation: blink 1s infinite; }
    @keyframes blink { 50% {opacity:0;} }

    .effect-rainbow { animation: rainbow 2s infinite linear; }
    @keyframes rainbow { from {filter:hue-rotate(0deg);} to {filter:hue-rotate(360deg);} }

    .effect-rainbow-gradient {
        background: linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet);
        -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        animation: rainbow 4s linear infinite;
    }

    .effect-glitch { animation: glitch 0.5s infinite; position: relative; }
    @keyframes glitch { 0%,100%{left:0;} 20%{left:2px;} 40%{left:-2px;} 60%{left:1px;} 80%{left:-1px;} }

    .effect-typing { overflow:hidden; border-right:2px solid white; white-space:nowrap; animation: typing 4s steps(30,end) infinite alternate; }
    @keyframes typing { from {width:0;} to {width:100%;} }

    .effect-shake { animation: shake 0.3s infinite; }
    @keyframes shake { 0%,100%{ transform:translate(-50%,-50%) translateX(0);} 25%{ transform:translate(-50%,-50%) translateX(-3px);} 50%{ transform:translate(-50%,-50%) translateX(3px);} 75%{ transform:translate(-50%,-50%) translateX(-3px);} }

    .effect-fade { animation: fadein 1.5s forwards; }
    @keyframes fadein { from{opacity:0;} to{opacity:1;} }

    .key {
        display:inline-block; width:40px; height:40px; margin:2px;
        text-align:center; line-height:40px;
        border:1px solid #555; border-radius:4px;
        background:#333; color:#aaa; font-size:14px;
        font-family: monospace; user-select:none;
        transition: all 0.2s ease;
    }
    .key.active { background:#0f0; color:#000; font-weight:bold; transform: scale(1.1); box-shadow:0 0 10px #0f0; }
    .keyboard-row { display:flex; justify-content:center; }
    `;
    document.head.appendChild(style);

    // ================= КЛАВИАТУРА =================
    const keyboardContainer = document.createElement("div");
    keyboardContainer.style.position = "fixed";
    keyboardContainer.style.bottom = "80px";
    keyboardContainer.style.right = "20px";
    keyboardContainer.style.background = "rgba(17,17,17,0.9)";
    keyboardContainer.style.padding = "10px";
    keyboardContainer.style.border = "2px solid #555";
    keyboardContainer.style.borderRadius = "8px";
    keyboardContainer.style.zIndex = "1000000";
    keyboardContainer.style.display = "none";
    keyboardContainer.style.backdropFilter = "blur(6px)";
    document.body.appendChild(keyboardContainer);

    const layout = [
        "Ё 1 2 3 4 5 6 7 8 9 0 - = Backspace",
        "Tab Й Ц У К Е Н Г Ш Щ З Х Ъ \\",
        "Caps Ф Ы В А П Р О Л Д Ж Э Enter",
        "Shift Я Ч С М И Т Ь Б Ю . Shift",
        "Ctrl Alt Space Alt Ctrl"
    ];
    const keyElems = {};
    layout.forEach(row => {
        const div = document.createElement("div");
        div.className = "keyboard-row";
        row.split(" ").forEach(k => {
            const el = document.createElement("div");
            el.className = "key";
            if (k === "Backspace") { el.textContent = "←"; el.style.width = "80px"; }
            else if (k === "Enter") { el.textContent = "Enter"; el.style.width = "80px"; }
            else if (k === "Space") { el.textContent = ""; el.style.width = "240px"; }
            else if (k === "Shift" || k === "Ctrl" || k === "Alt" || k === "Caps" || k === "Tab") {
                el.textContent = k;
                el.style.width = (k === "Shift") ? "100px" : "70px";
            } else { el.textContent = k; }
            keyElems[k.toUpperCase()] = el;
            div.appendChild(el);
        });
        keyboardContainer.appendChild(div);
    });

    const activeKeys = new Set();
    document.addEventListener("keydown", (e) => {
        const k = e.key.toUpperCase();
        if (keyElems[k]) { activeKeys.add(k); keyElems[k].classList.add("active"); }
        if (e.code === "Space" && keyElems["SPACE"]) { activeKeys.add("SPACE"); keyElems["SPACE"].classList.add("active"); }
    });
    document.addEventListener("keyup", (e) => {
        const k = e.key.toUpperCase();
        if (keyElems[k]) { activeKeys.delete(k); keyElems[k].classList.remove("active"); }
        if (e.code === "Space" && keyElems["SPACE"]) { activeKeys.delete("SPACE"); keyElems["SPACE"].classList.remove("active"); }
    });
    window.addEventListener("blur", () => { activeKeys.forEach(k => { if (keyElems[k]) keyElems[k].classList.remove("active"); }); activeKeys.clear(); });

    menu.querySelector("#toggleKeyboard").onclick = () => {
        keyboardContainer.style.display = (keyboardContainer.style.display === "none") ? "block" : "none";
    };

    // ================= ПЕРЕТАСКИВАНИЕ (меню и клавы) =================
    function makeDraggable(el) {
        let isDrag = false, offsetX=0, offsetY=0;
        el.addEventListener("mousedown", (e) => {
            if (["TEXTAREA","INPUT","BUTTON","SELECT"].includes(e.target.tagName)) return;
            isDrag = true; offsetX = e.clientX - el.getBoundingClientRect().left; offsetY = e.clientY - el.getBoundingClientRect().top;
        });
        document.addEventListener("mousemove", (e) => { if (!isDrag) return; el.style.left = (e.clientX-offsetX)+"px"; el.style.top = (e.clientY-offsetY)+"px"; el.style.right="auto"; el.style.bottom="auto"; });
        document.addEventListener("mouseup", () => isDrag = false);
    }
    makeDraggable(menu);
    makeDraggable(keyboardContainer);
})();
