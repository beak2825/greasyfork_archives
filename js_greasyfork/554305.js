// ==UserScript==
// @name         Drawaria Minimalistic
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Вы давно хотели убрать всю рекламу в драварии, сделать красивое меню? И кнопки, этот скрипт поможет вам.
// @author       𝙎𝙞𝙡𝙡𝙮 𝘾𝙖𝙩`
// @match       https://drawaria.online/
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/554305/Drawaria%20Minimalistic.user.js
// @updateURL https://update.greasyfork.org/scripts/554305/Drawaria%20Minimalistic.meta.js
// ==/UserScript==

(function() {
    'use strict';


    const removeSelectors = [
        ".extimages",
        "#gameadsbanner",
        ".sitelogo",
        ".footer",
        "#browserwarning",
        "#yandex_rtb_R-A-669506-1",
        ".row.promlinks"
    ];
    removeSelectors.forEach(sel => document.querySelectorAll(sel).forEach(el => el.remove()));


    let bgDiv = document.createElement("div");
    bgDiv.id = "bgDiv";
    Object.assign(bgDiv.style, {
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        zIndex: "0",
        pointerEvents: "none",
        backgroundSize: "200% 200%",
        transition: "background 0.5s"
    });
    document.body.insertBefore(bgDiv, document.body.firstChild);


    const loginContainer = document.getElementById("login-midcol");
    if (loginContainer) loginContainer.style.background = "transparent";


    const menu = document.createElement("div");
    Object.assign(menu.style, {
        position: "fixed",
        top: "10px",
        left: "10px",
        zIndex: 9999,
        padding: "10px",
        borderRadius: "10px",
        background: "rgba(0,0,0,0.7)",
        color: "white",
        fontFamily: "sans-serif",
        cursor: "move",
        userSelect: "none",
        width: "200px"
    });

    menu.innerHTML =
        `<label>Выбор градиента:</label>
        <select id="gradient-picker" style="margin:5px 0; padding:5px; width:100%;">
            <option value="linear-gradient(135deg, rgb(0,198,255), rgb(0,114,255))">Синий-голубой</option>
            <option value="linear-gradient(135deg, rgb(255,0,128), rgb(255,102,0))">Розовый-оранж</option>
            <option value="linear-gradient(135deg, rgb(0,255,128), rgb(0,128,255))">Зелёный-синий</option>
        </select>

        <label>Тип градиента:</label>
        <select id="gradient-type" style="margin:5px 0; padding:5px; width:100%;">
            <option value="static">Статический</option>
            <option value="animated">Переливающийся</option>
        </select>

        <div style="margin-top:5px;">
            <button id="menu-decrease" style="padding:3px 6px;">-</button>
            <button id="menu-increase" style="padding:3px 6px;">+</button>
        </div>
    `;

    document.body.appendChild(menu);

    const gradientPicker = document.getElementById("gradient-picker");
    const gradientType = document.getElementById("gradient-type");
    const buttons = document.querySelectorAll(".btn");

    function applyGradient() {
        const grad = gradientPicker.value;
        const type = gradientType.value;

        if (type === "animated") {
            bgDiv.style.background = grad;
            bgDiv.style.backgroundSize = "200% 200%";
            bgDiv.style.animation = "gradientAnim 10s ease infinite";
        } else {
            bgDiv.style.background = grad;
            bgDiv.style.animation = "none";
        }

        buttons.forEach(btn => {
            btn.style.background = grad;
            btn.style.color = "white";
            btn.style.fontWeight = "bold";
            btn.style.border = "none";
        });

        gradientPicker.style.background = grad;
        gradientPicker.style.color = "white";
    }

    gradientPicker.addEventListener("change", applyGradient);
    gradientType.addEventListener("change", applyGradient);
    applyGradient();


    document.getElementById("menu-decrease").addEventListener("click", () => menu.style.transform = "scale(0.7)");
    document.getElementById("menu-increase").addEventListener("click", () => menu.style.transform = "scale(1.3)");


    let isDragging = false, offsetX, offsetY;
    menu.addEventListener('mousedown', e => {
        isDragging = true;
        offsetX = e.clientX - menu.offsetLeft;
        offsetY = e.clientY - menu.offsetTop;
    });
    document.addEventListener('mousemove', e => {
        if (isDragging){
            menu.style.left = (e.clientX - offsetX) + "px";
            menu.style.top = (e.clientY - offsetY) + "px";
        }
    });
    document.addEventListener('mouseup', e => { isDragging = false; });


    const styleSheet = document.createElement("style");
    styleSheet.innerHTML =
        `@keyframes gradientAnim {
            0% {background-position:0% 50%;}
            50% {background-position:100% 50%;}
            100% {background-position:0% 50%;}
        }
    `;
    document.head.appendChild(styleSheet);

})();