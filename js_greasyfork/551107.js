// ==UserScript==
// @name         csTimer Helper
// @namespace    https://github.com/Cuber-Feng
// @version      1.1
// @description  some quick operation
// @author       Maple Feng (2017FENG35)
// @match        https://cstimer.net/*
// @license MIT
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/551107/csTimer%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/551107/csTimer%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // ------------------------------------------------------------
    // 1. open the export and import window every times you open csTimer
    let option1 = GM_getValue('autoOpenExport', true);
    GM_registerMenuCommand(
        option1 ? 'open Data Export/Import after loading (enabled)' : 'open Data Export/Import after loading (disabled)',
        () => {
            GM_setValue('autoOpenExport', !option1);
            alert('Change saved');
        }
    );

    if(option1){
        window.addEventListener('load', function() {
            const expBtn = document.querySelector('.mybutton.c2');

            if (expBtn) {
                expBtn.click();
                console.log('open expBtn successfully');

            } else {
                showErrorPopup();
            }
        });
    }
    // ------------------------------------------------------------
    // 2. prevent unload
    let option2 = GM_getValue('preventUnload', true);
    const isReload = performance.navigation.type === 1;
    GM_registerMenuCommand(
        option2 ? 'prevent unload (enabled)' : 'prevent unload (disabled)',
        () => {
            GM_setValue('preventUnload', !option2);
            alert('Change saved');
        }
    );

    if (!isReload && option2) {
        window.addEventListener('beforeunload', function (e) {
            e.preventDefault();
            e.returnValue = '';
        });
    }
    // ------------------------------------------------------------
    // 3. helper function: show unknown error
    function showErrorPopup() {
        const popup = document.createElement('div');
        popup.innerHTML = `
            <div style="
                position:fixed;
                top:20%;
                left:50%;
                transform:translateX(-50%);
                background:#fff;
                padding:20px;
                border:2px solid #444;
                box-shadow:0 0 10px rgba(0,0,0,0.3);
                z-index:9999;
                font-family:sans-serif;
                width:300px;
                text-align:center;
                font-size: 1.2rem;
            ">
                <strong style='font-size: 1.5rem;'>Unknown Error 😢</strong><br><br>
                You can report to me: <br>
                <input type="text" value="https://space.bilibili.com/1035959192"
                       style="width:100%;margin-top:10px;" onclick="this.select()"><br><br>
                <button onclick="this.parentElement.remove(); window.open('https://space.bilibili.com/1035959192','_blank');" style="
                     background-color:#007bff;color:white;border:none;padding:8px 12px;border-radius:4px;cursor:pointer;font-size:14px;">
                     Report</button>
                <button onclick="this.parentElement.remove()" style="
                     background-color:#6c757d;color:white;border:none;padding:8px 12px;border-radius:4px;cursor:pointer;font-size:14px;margin-left:10px;">
                     Ignore</button>
            </div>
        `;
        document.body.appendChild(popup);
    }
    // ------------------------------------------------------------
    // 4. create button container
    const bar = document.createElement('div');
    bar.style.position = 'fixed';
    bar.style.bottom = '5px';
    bar.style.left = '50%';
    bar.style.transform = 'translateX(-50%)';
    bar.style.backdropFilter = 'blur(6px)';
    bar.style.color = '#fff';
    bar.style.padding = '10px 20px';
    bar.style.borderRadius = '8px';
    bar.style.display = 'flex';
    bar.style.justifyContent = 'center';
    bar.style.gap = '10px';
    bar.style.zIndex = '9999';
    //bar.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
    bar.style.fontFamily = 'sans-serif';
    bar.style.maxWidth = '90vw';
    bar.style.flexWrap = 'wrap';
    // ------------------------------------------------------------
    // 5. create button
    function createButton(text, onClick, color = '#007bff') {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.style.background = color;
        btn.style.color = '#fff';
        btn.style.border = 'none';
        btn.style.padding = '8px 12px';
        btn.style.borderRadius = '4px';
        btn.style.cursor = 'pointer';
        btn.style.fontSize = '14px';
        btn.addEventListener('click', onClick);
        return btn;
    }

    // ------------------------------------------------------------
    // 6. helper function: swich timer type, input the timer value
    function switchTimer(value){
        const setBtn = document.querySelector('.mybutton.c1');

        if (setBtn) {
            console.log('open setBtn successfully');
            setBtn.click();
            const optBtn = document.querySelector('.dialog.dialogoption .options td .tab:nth-child(4)');
            if(optBtn){
                optBtn.click();
                const timerTr = document.querySelector('.opttable tbody tr:nth-child(50)');
                timerTr.style.backgroundColor = 'yellow';
                const select = timerTr.querySelector('select[name="input"]');
                select.value = value;
                select.dispatchEvent(new Event('change'));

            }else{
                showErrorPopup();
            }

        } else {
            showErrorPopup();
        }

        const okButton = document.querySelector('input.buttonOK[value="OK"]');
        if (okButton) okButton.click();
    }
    // ------------------------------------------------------------
    // 7. add the quick button for timer switching
    let timer = GM_getValue('timer', true);
    GM_registerMenuCommand(
        timer ? 'timer (enabled)' : 'timer (disabled)',
        () => {
            GM_setValue('timer', !timer);
        }
    );
    let typing = GM_getValue('typing', true);
    GM_registerMenuCommand(
        typing ? 'typing (enabled)' : 'typing (disabled)',
        () => {
            GM_setValue('typing', !typing);
        }
    );
    let bluetooth = GM_getValue('bluetooth', true);
    GM_registerMenuCommand(
        bluetooth ? 'bluetooth timer (enabled)' : 'bluetooth timer (disabled)',
        () => {
            GM_setValue('bluetooth', !bluetooth);
        }
    );
    let stackmat = GM_getValue('stackmat', false);
    GM_registerMenuCommand(
        stackmat ? 'stackmat (enabled)' : 'stackmat (disabled)',
        () => {
            GM_setValue('stackmat', !stackmat);
        }
    );
    let virtual = GM_getValue('virtual', false);
    GM_registerMenuCommand(
        virtual ? 'virtual (enabled)' : 'virtual (disabled)',
        () => {
            GM_setValue('virtual', !virtual);
        }
    );
    let bluetoothCube = GM_getValue('bluetoothCube', false);
    GM_registerMenuCommand(
        bluetoothCube ? 'bluetooth cube (enabled)' : 'bluetooth cube (disabled)',
        () => {
            GM_setValue('bluetoothCube', !bluetoothCube);
        }
    );
    let MoYuTimer = GM_getValue('MoYuTimer', false);
    GM_registerMenuCommand(
        MoYuTimer ? 'MoYuTimer (enabled)' : 'MoYuTimer (disabled)',
        () => {
            GM_setValue('MoYuTimer', !MoYuTimer);
        }
    );
    let qCube = GM_getValue('qCube', false);
    GM_registerMenuCommand(
        qCube ? 'qCube (enabled)' : 'qCube (disabled)',
        () => {
            GM_setValue('qCube', !qCube);
        }
    );
    // ------------------------------------------------------------
    // 8. add the quick button for timer switching
    // Use keyboard timer
    if(timer){
        bar.appendChild(createButton('Timer', () => {
            switchTimer('t');
        }, '#B8001F'));
    }

    // Use manual input
    if(typing){
        bar.appendChild(createButton('Typing', () => {
            switchTimer('i');
        }, '#006A67'));
    }

    // Use bluetooth timer
    if(bluetooth){
        bar.appendChild(createButton('Bluetooth', () => {
            switchTimer('b');
        }, '#384B70'));
    }

    // Use stackmat timer
    if(stackmat){
        bar.appendChild(createButton('Stackmat', () => {
            switchTimer('s');
        }, '#ED3F27'));
    }

    // Use virtual
    if(virtual){
        bar.appendChild(createButton('Virtual', () => {
            switchTimer('v');
        }, '#6B3F69'));
    }

    // Use Bluetooth Cube
    if(bluetoothCube){
        bar.appendChild(createButton('Bluetooth Cube', () => {
            switchTimer('g');
        }, '#954C2E'));
    }

    // Use MoYuTimer
    if(MoYuTimer){
        bar.appendChild(createButton('MoYuTimer', () => {
            switchTimer('m');
        }, '#B33791'));
    }

    // Use qCube
    if(qCube){
        bar.appendChild(createButton('qCube', () => {
            switchTimer('q');
        }, '#17313E'));
    }
    document.body.appendChild(bar);
    // ------------------------------------------------------------
})();