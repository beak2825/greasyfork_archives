// ==UserScript==
// @name         Mouse gui visualizer
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Visual mouse model that highlights buttons
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555194/Mouse%20gui%20visualizer.user.js
// @updateURL https://update.greasyfork.org/scripts/555194/Mouse%20gui%20visualizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
    #mouse-gui {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 90px;
        height: 150px;
        background: linear-gradient(180deg, #f5f5f5 0%, #dcdcdc 100%);
        border-radius: 45px;
        box-shadow: 0 3px 10px rgba(0,0,0,0.2);
        z-index: 999999;
        pointer-events: none;
        user-select: none;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        padding-top: 10px;
    }

    .mouse-section {
        width: 100%;
        height: 70px;
        display: flex;
        justify-content: space-between;
        padding: 0 10px;
        position: relative;
    }

    .mouse-button {
        flex: 1;
        height: 100%;
        margin: 0 2px;
        border-radius: 45px 45px 0 0;
        background: linear-gradient(180deg, #efefef, #cfcfcf);
        transition: background 0.1s, box-shadow 0.1s;
    }

    .mouse-button.active {
        background: linear-gradient(180deg, #66baff, #4fa7ff);
        box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    }

    .mouse-wheel {
        position: absolute;
        top: 22px;
        left: 50%;
        transform: translateX(-50%);
        width: 12px;
        height: 30px;
        background: #777;
        border-radius: 6px;
        box-shadow: inset 0 0 2px rgba(0,0,0,0.4);
        transition: background 0.1s, box-shadow 0.1s;
    }

    .mouse-wheel.active {
        background: #4fa7ff;
        box-shadow: 0 0 6px rgba(79,167,255,0.8);
    }

    .mouse-body {
        width: 70%;
        height: 50px;
        background: linear-gradient(180deg, #eaeaea, #c9c9c9);
        border-radius: 0 0 40px 40px;
        margin-top: -5px;
    }
    `;
    document.head.appendChild(style);

    const gui = document.createElement('div');
    gui.id = 'mouse-gui';
    gui.innerHTML = `
        <div class="mouse-section">
            <div id="left-btn" class="mouse-button"></div>
            <div id="right-btn" class="mouse-button"></div>
            <div id="wheel" class="mouse-wheel"></div>
        </div>
        <div class="mouse-body"></div>
    `;
    document.body.appendChild(gui);

    const left = document.getElementById('left-btn');
    const right = document.getElementById('right-btn');
    const wheel = document.getElementById('wheel');

    // Mouse button press/release
    document.addEventListener('mousedown', e => {
        switch (e.button) {
            case 0: left.classList.add('active'); break;
            case 1: wheel.classList.add('active'); break;
            case 2: right.classList.add('active'); break;
        }
    });
    document.addEventListener('mouseup', e => {
        switch (e.button) {
            case 0: left.classList.remove('active'); break;
            case 1: wheel.classList.remove('active'); break;
            case 2: right.classList.remove('active'); break;
        }
    });

    // Wheel scroll glow
    let scrollTimeout;
    document.addEventListener('wheel', () => {
        wheel.classList.add('active');
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => wheel.classList.remove('active'), 150);
    });
})();
