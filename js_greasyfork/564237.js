// ==UserScript==
// @name        Defly.io Mod Menu V1
// @namespace   Violentmonkey Scripts
// @match       https://defly.io/*
// @grant       none
// @version     1.3
// @author      Jadob Lane
// @licence MIT
// @description Mod Menu With Auto Shoot, Auto Build, Skin Changer
// @downloadURL https://update.greasyfork.org/scripts/564237/Deflyio%20Mod%20Menu%20V1.user.js
// @updateURL https://update.greasyfork.org/scripts/564237/Deflyio%20Mod%20Menu%20V1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ---------- Styles ----------
    const style = document.createElement('style');
    style.innerHTML = `
    /* Glassmorphism Mod Menu */
    #modMenu {
        position: fixed;
        top: 60px;
        left: 60px;
        width: 260px;
        background: rgba(20, 20, 30, 0.8);
        backdrop-filter: blur(12px) saturate(180%);
        border-radius: 15px;
        color: #0ff;
        padding: 20px;
        font-family: 'Segoe UI', sans-serif;
        font-size: 14px;
        z-index: 99999;
        cursor: move;
        box-shadow: 0 8px 20px rgba(0, 255, 255, 0.3);
        border: 1px solid rgba(0,255,255,0.3);
    }

    #modMenu h2 {
        margin: 0 0 15px 0;
        font-size: 18px;
        text-align: center;
        text-shadow: 0 0 6px #0ff;
    }

    .button {
        display: block;
        margin: 8px 0;
        padding: 10px;
        background: linear-gradient(135deg, #00ffff, #00cccc);
        border: none;
        border-radius: 8px;
        color: #000;
        cursor: pointer;
        width: 100%;
        font-weight: bold;
        font-size: 14px;
        transition: all 0.2s ease;
        text-shadow: 0 0 2px #000;
    }

    .button:hover {
        background: linear-gradient(135deg, #00cccc, #00ffff);
        transform: scale(1.05);
    }

    #hideBtn {
        position: absolute;
        top: 10px;
        right: 10px;
        background: #ff4444;
        width: 22px;
        height: 22px;
        border-radius: 50%;
        text-align: center;
        line-height: 22px;
        font-weight: bold;
        cursor: pointer;
        color: white;
        box-shadow: 0 0 8px #ff4444;
    }

    #reopenBtn {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(135deg, #00ffff, #00cccc);
        color: #000;
        padding: 12px 18px;
        border-radius: 12px;
        cursor: pointer;
        font-family: 'Segoe UI', sans-serif;
        z-index: 99999;
        font-weight: bold;
        box-shadow: 0 0 15px rgba(0,255,255,0.5);
        display: none;
        transition: transform 0.2s ease;
    }

    #reopenBtn:hover {
        transform: scale(1.1);
    }

    input[type=number] {
        width: 100%;
        padding: 8px;
        border-radius: 6px;
        border: 1px solid #0ff;
        background: rgba(0,0,0,0.3);
        color: #0ff;
        margin-bottom: 8px;
        text-align: center;
        font-weight: bold;
    }
    label {
        font-weight: bold;
        color: #0ff;
        text-shadow: 0 0 3px #000;
    }
    `;
    document.head.appendChild(style);

    // ---------- Menu HTML ----------
    const menu = document.createElement('div');
    menu.id = 'modMenu';
    menu.innerHTML = `
        <div id="hideBtn">X</div>
        <h2>Defly.io Mod Menu</h2>
        <button id="autoShootBtn" class="button">Auto Shoot: OFF</button>
        <button id="autoBuildBtn" class="button">Auto Build: OFF</button>
    `;
    document.body.appendChild(menu);

    // ---------- Reopen Button ----------
    const reopenBtn = document.createElement('div');
    reopenBtn.id = 'reopenBtn';
    reopenBtn.textContent = 'Open Mod Menu';
    document.body.appendChild(reopenBtn);

    // ---------- Hide / Reopen ----------
    document.getElementById('hideBtn').onclick = () => {
        menu.style.display = 'none';
        reopenBtn.style.display = 'block';
    };
    reopenBtn.onclick = () => {
        menu.style.display = 'block';
        reopenBtn.style.display = 'none';
    };

    // ---------- Drag Function ----------
    let isDragging = false;
    let offsetX, offsetY;

    menu.addEventListener('mousedown', (e) => {
        if(e.target.id === 'hideBtn' || e.target.classList.contains('button')) return;
        isDragging = true;
        offsetX = e.clientX - menu.offsetLeft;
        offsetY = e.clientY - menu.offsetTop;
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    document.addEventListener('mousemove', (e) => {
        if(isDragging){
            menu.style.left = (e.clientX - offsetX) + 'px';
            menu.style.top = (e.clientY - offsetY) + 'px';
        }
    });

    // ---------- Auto Shoot / Auto Build ----------
    let autoShoot = false;
    let autoBuild = false;
    let shootInterval, buildInterval;

    function autoClick(button) {
        const elem = document.elementFromPoint(window.innerWidth/2, window.innerHeight/2) || document.body;
        const eventProps = { bubbles: true, cancelable: true, button: button };
        elem.dispatchEvent(new MouseEvent('mousedown', eventProps));
        elem.dispatchEvent(new MouseEvent('mouseup', eventProps));
        elem.dispatchEvent(new MouseEvent('click', eventProps));
    }

    const autoShootBtn = document.getElementById('autoShootBtn');
    const autoBuildBtn = document.getElementById('autoBuildBtn');

    autoShootBtn.onclick = () => {
        autoShoot = !autoShoot;
        autoShootBtn.textContent = `Auto Shoot: ${autoShoot ? 'ON' : 'OFF'}`;
        if(autoShoot){
            shootInterval = setInterval(() => autoClick(0), 100);
        } else {
            clearInterval(shootInterval);
        }
    };

    autoBuildBtn.onclick = () => {
        autoBuild = !autoBuild;
        autoBuildBtn.textContent = `Auto Build: ${autoBuild ? 'ON' : 'OFF'}`;
        if(autoBuild){
            buildInterval = setInterval(() => autoClick(2), 200);
        } else {
            clearInterval(buildInterval);
        }
    };

    document.addEventListener('contextmenu', e => {
        if(autoBuild) e.preventDefault();
    });

    // ---------- Skin Changer ----------
    function createInput(labelText, placeholder, min, max) {
        const container = document.createElement('div');
        container.style.margin = '8px 0';

        const label = document.createElement('label');
        label.textContent = labelText;
        label.style.display = 'block';
        label.style.marginBottom = '4px';

        const input = document.createElement('input');
        input.type = 'number';
        input.placeholder = placeholder;
        if (min !== undefined) input.min = min;
        if (max !== undefined) input.max = max;

        container.appendChild(label);
        container.appendChild(input);
        return {container, input};
    }

    function createButton(text, onClick) {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.className = 'button';
        btn.onclick = onClick;
        return btn;
    }

    const {container: skinCont, input: skinInput} = createInput('Change Character Skin', '1 - 35', 1, 35);
    menu.appendChild(skinCont);
    menu.appendChild(createButton('Apply Skin', () => {
        const val = parseInt(skinInput.value);
        if (isNaN(val) || val < 1 || val > 35) return alert('Invalid skin number');
        localStorage.setItem('playerSkin', val);
        alert('Skin selected! Reload the page to see changes.');
    }));

})();
