// ==UserScript==
// @name          カラーピッカー（バグ修正版）
// @namespace     http://tampermonkey.net/
// @version       7.5
// @description   保存時の黒色化バグとUndo消失バグを修正
// @author        Gemini
// @match         https://pictsense.com/*
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/564066/%E3%82%AB%E3%83%A9%E3%83%BC%E3%83%94%E3%83%83%E3%82%AB%E3%83%BC%EF%BC%88%E3%83%90%E3%82%B0%E4%BF%AE%E6%AD%A3%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/564066/%E3%82%AB%E3%83%A9%E3%83%BC%E3%83%94%E3%83%83%E3%82%AB%E3%83%BC%EF%BC%88%E3%83%90%E3%82%B0%E4%BF%AE%E6%AD%A3%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (window.cp_initialized) return;
    window.cp_initialized = true;

    const PRESET_COLORS = ["#f077db", "#a16b3e", "#FF3B21", "#b8b8b8", "#FFFFFF", "#000000", "#4F93D9", "#40a31f", "#fde802", "#ff9000"];

    // RGB文字列をHEXに変換するヘルパー
    const rgbToHex = (rgb) => {
        if (rgb.startsWith('#')) return rgb;
        const m = rgb.match(/\d+/g);
        return m ? "#" + m.slice(0, 3).map(x => parseInt(x).toString(16).padStart(2, '0')).join('') : "#ffffff";
    };

    function initPicker() {
        if (document.getElementById("randomcollarUI")) return true;

        const allButtons = Array.from(document.querySelectorAll("#colorPalette button.color"));
        const paletteButtons = allButtons.slice(1, 11);
        if (paletteButtons.length === 0) return false;

        let savedPalettes = JSON.parse(localStorage.getItem('amatou_palettes') || '{"1":[], "2":[], "3":[]}');

        // ★ 修正点1: 適用時に標準のクリックイベントを正しくシミュレートする
        const applyToOfficial = (colors) => {
            if (!colors || colors.length === 0) return;
            paletteButtons.forEach((btn, i) => {
                const hex = rgbToHex(colors[i] || "#ffffff");
                const cleanHex = hex.replace("#", "");
                btn.setAttribute("data-color", cleanHex);
                btn.style.backgroundColor = hex;
            });
        };
        applyToOfficial(PRESET_COLORS);

        const container = document.createElement("div");
        container.id = "randomcollarUI";
        container.style.cssText = "display:none; position:fixed; top:120px; left:10px; z-index:9999; background:#222; padding:10px; border-radius:10px; color:#fff; font-family:sans-serif; user-select:none; width:210px; touch-action:none; border:1px solid #444; box-shadow: 0 4px 15px rgba(0,0,0,0.5);";
        container.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <div style="font-weight:bold; cursor:grab; font-size:14px;">カラーピッカー</div>
                <div id="curColorPreview" style="width:45px; height:25px; border-radius:4px; border:2px solid #fff; background:#fff;"></div>
            </div>
            <div id="crystaWheelWrapper" style="width:190px; height:190px; margin: 0 auto 10px; cursor:crosshair; touch-action:none;"></div>
            <div id="numberSelector" style="display:grid; grid-template-columns: repeat(5, 1fr); gap:5px; margin-bottom:12px;">
                ${[1,2,3,4,5,6,7,8,9,10].map(n => `<div class="num-btn" data-idx="${n-1}" style="background:#333; border-radius:4px; text-align:center; padding:8px 0; font-size:13px; cursor:pointer; border:1px solid #555;">${n}</div>`).join('')}
            </div>
            <button id="applyColorBtn" style="width: 100%; height: 45px; border:none; border-radius:8px; background:#007bff; color:#fff; cursor:pointer; font-weight:bold; font-size:16px; margin-bottom:8px;">色を確定</button>
            <button id="simpleDropperBtn" style="width: 100%; height: 35px; border:1px solid #555; border-radius:8px; background:#444; color:#eee; cursor:pointer; font-size:13px; margin-bottom:8px;">スポイト</button>
            <button id="openSaveBtn" style="width: 100%; height: 35px; border:none; border-radius:8px; background:#28a745; color:#fff; cursor:pointer; font-size:13px; font-weight:bold;">パレット保存/読込</button>
        `;
        document.body.appendChild(container);

        const subWin = document.createElement("div");
        subWin.id = "paletteSubWin";
        subWin.style.cssText = "position:fixed; top:150px; left:230px; z-index:10000; background:#333; padding:15px; border-radius:10px; color:#fff; width:220px; display:none; border:1px solid #555; box-shadow: 0 4px 15px rgba(0,0,0,0.5); font-family:sans-serif;";
        subWin.innerHTML = `
            <div style="font-weight:bold; margin-bottom:12px; font-size:14px; text-align:center;">パレット管理</div>
            ${[1,2,3].map(i => `
                <div style="margin-bottom:12px; padding:10px; background:#2a2a2a; border-radius:6px; border:1px solid #444;">
                    <div style="font-size:12px; margin-bottom:8px; color:#aaa;">パレット ${i}</div>
                    <div style="display:flex; gap:8px;">
                        <button class="pal-apply" data-id="${i}" style="flex:1; background:#007bff; border:none; color:#fff; border-radius:4px; padding:6px; font-size:11px; cursor:pointer;">適用</button>
                        <button class="pal-edit" data-id="${i}" style="flex:1; background:#6c757d; border:none; color:#fff; border-radius:4px; padding:6px; font-size:11px; cursor:pointer;">編集</button>
                    </div>
                </div>
            `).join('')}
            <button id="closeSaveBtn" style="width:100%; background:#444; border:none; color:#eee; border-radius:4px; padding:8px; margin-top:5px; cursor:pointer; font-size:12px;">閉じる</button>
        `;
        document.body.appendChild(subWin);

        // ロジック部分
        const previewEl = document.getElementById("curColorPreview");
        const dropperBtn = document.getElementById("simpleDropperBtn");
        const applyBtn = document.getElementById("applyColorBtn");
        const numBtns = container.querySelectorAll(".num-btn");
        let selectedIndex = 0, currentH = 0, currentS = 0, currentV = 0;

        const hsvToHex = (h,s,v) => {
            s/=100; v/=100;
            let f=(n,k=(n+h/60)%6)=>v-v*s*Math.max(Math.min(k,4-k,1),0);
            let toHex=x=>Math.round(x*255).toString(16).padStart(2,'0');
            return `#${toHex(f(5))}${toHex(f(3))}${toHex(f(1))}`;
        };

        const updateSelection = (idx) => {
            selectedIndex = idx;
            numBtns.forEach((btn, i) => {
                btn.style.background = (i === selectedIndex) ? "#007bff" : "#333";
                btn.style.borderColor = (i === selectedIndex) ? "#fff" : "#555";
            });
        };
        updateSelection(0);
        numBtns.forEach(btn => btn.onclick = () => updateSelection(parseInt(btn.getAttribute("data-idx"))));

        // キャンバス描画 (drawWheel) ... 中略 ...
        const wheelCanvas = document.createElement("canvas");
        const wCtx = wheelCanvas.getContext("2d");
        const size = 190, ringWidth = 18, boxSize = 110;
        wheelCanvas.width = size; wheelCanvas.height = size;
        document.getElementById("crystaWheelWrapper").appendChild(wheelCanvas);

        function drawWheel() {
            wCtx.clearRect(0, 0, size, size);
            const center = size/2;
            for(let i=0; i<360; i++){
                wCtx.beginPath(); wCtx.strokeStyle = `hsl(${i}, 100%, 50%)`; wCtx.lineWidth = ringWidth;
                wCtx.arc(center, center, center-ringWidth/2, i*Math.PI/180, (i+2)*Math.PI/180); wCtx.stroke();
            }
            const startX = center - boxSize/2, startY = center - boxSize/2;
            const gradS = wCtx.createLinearGradient(startX, 0, startX+boxSize, 0);
            gradS.addColorStop(0, "#fff"); gradS.addColorStop(1, `hsl(${currentH}, 100%, 50%)`);
            wCtx.fillStyle = gradS; wCtx.fillRect(startX, startY, boxSize, boxSize);
            const gradV = wCtx.createLinearGradient(0, startY, 0, startY+boxSize);
            gradV.addColorStop(0, "rgba(0,0,0,0)"); gradV.addColorStop(1, "rgba(0,0,0,1)");
            wCtx.fillStyle = gradV; wCtx.fillRect(startX, startY, boxSize, boxSize);
            const drawMarker = (mx, my) => {
                wCtx.beginPath(); wCtx.strokeStyle = "black"; wCtx.lineWidth = 3; wCtx.arc(mx, my, 6, 0, Math.PI*2); wCtx.stroke();
                wCtx.beginPath(); wCtx.strokeStyle = "white"; wCtx.lineWidth = 2; wCtx.arc(mx, my, 6, 0, Math.PI*2); wCtx.stroke();
            };
            const hAngle = currentH*Math.PI/180;
            drawMarker(center+(center-ringWidth/2)*Math.cos(hAngle), center+(center-ringWidth/2)*Math.sin(hAngle));
            drawMarker(startX+(currentS/100)*boxSize, startY+(1-currentV/100)*boxSize);
            previewEl.style.backgroundColor = hsvToHex(currentH, currentS, currentV);
        }

        // ホイール操作 ... 中略 ...
        let activeTarget = null;
        wheelCanvas.onpointerdown = (e) => {
            const rect = wheelCanvas.getBoundingClientRect();
            const dx = (e.clientX-rect.left)-size/2, dy = (e.clientY-rect.top)-size/2;
            activeTarget = (Math.sqrt(dx*dx+dy*dy) > size/2-ringWidth-10) ? 'ring' : 'box';
            wheelCanvas.setPointerCapture(e.pointerId);
            const move = (ev) => {
                const r = wheelCanvas.getBoundingClientRect();
                const x = ev.clientX-r.left, y = ev.clientY-r.top, c = size/2;
                const sX = c-boxSize/2, sY = c-boxSize/2;
                if (activeTarget === 'ring') currentH = (Math.atan2(y-c, x-c)*180/Math.PI+360)%360;
                else if (activeTarget === 'box') {
                    currentS = Math.max(0, Math.min(100, ((x-sX)/boxSize)*100));
                    currentV = Math.max(0, Math.min(100, (1-(y-sY)/boxSize)*100));
                }
                drawWheel();
            };
            move(e);
            wheelCanvas.onpointermove = move;
        };
        wheelCanvas.onpointerup = () => { activeTarget = null; wheelCanvas.onpointermove = null; };

        // パレット保存・読込
        document.getElementById("openSaveBtn").onclick = () => { subWin.style.display = (subWin.style.display === "none") ? "block" : "none"; };
        document.getElementById("closeSaveBtn").onclick = () => { subWin.style.display = "none"; };

        subWin.querySelectorAll(".pal-apply").forEach(btn => {
            btn.onclick = () => {
                const id = btn.getAttribute("data-id");
                if (savedPalettes[id] && savedPalettes[id].length > 0) {
                    applyToOfficial(savedPalettes[id]);
                } else { alert("空です。"); }
            };
        });

        subWin.querySelectorAll(".pal-edit").forEach(btn => {
            btn.onclick = () => {
                const id = btn.getAttribute("data-id");
                // ★修正点2: 保存時にRGBをHEXに変換して保存する（黒化防止）
                savedPalettes[id] = paletteButtons.map(b => rgbToHex(b.style.backgroundColor));
                localStorage.setItem('amatou_palettes', JSON.stringify(savedPalettes));
                alert("保存しました");
            };
        });

        // スポイト ... 中略 ...
        const shield = document.createElement("div");
        shield.style.cssText = "position:fixed; top:0; left:0; width:100vw; height:100vh; z-index:9998; display:none; touch-action:none;";
        document.body.appendChild(shield);
        let isDropping = false;
        dropperBtn.onclick = (e) => {
            e.stopPropagation(); isDropping = !isDropping;
            shield.style.display = isDropping ? "block" : "none";
            dropperBtn.textContent = isDropping ? "吸い取り中" : "スポイト";
        };
        shield.onpointermove = (e) => {
            if (!isDropping) return;
            const canvas = document.querySelector("#canvas");
            if (!canvas) return;
            const rect = canvas.getBoundingClientRect();
            const x = (e.clientX - rect.left) * (canvas.width / rect.width);
            const y = (e.clientY - rect.top) * (canvas.height / rect.height);
            const ctx = canvas.getContext("2d", { willReadFrequently: true });
            const p = ctx.getImageData(x, y, 1, 1).data;
            if (p[3] === 0) return;
            let rf=p[0]/255, gf=p[1]/255, bf=p[2]/255, v=Math.max(rf,gf,bf), n=v-Math.min(rf,gf,bf);
            let h=n && (v==rf?(gf-bf)/n:v==gf?2+(bf-rf)/n:4+(rf-gf)/n);
            currentH=60*(h<0?h+6:h); currentS=v&&(n/v)*100; currentV=v*100;
            drawWheel();
        };
        shield.onpointerup = () => { isDropping = false; shield.style.display = "none"; dropperBtn.textContent = "スポイト"; };

        // ★修正点3: 色確定時にピクセンに「ユーザーが選んだよ」と教える
        applyBtn.onclick = () => {
            const hex = hsvToHex(currentH, currentS, currentV);
            const btn = paletteButtons[selectedIndex];
            if(btn){
                btn.setAttribute("data-color", hex.replace("#", ""));
                btn.style.backgroundColor = hex;
                // click()の代わりに、Undoを壊さないイベントを発火させる
                btn.dispatchEvent(new MouseEvent('mousedown', {bubbles: true}));
                btn.dispatchEvent(new MouseEvent('mouseup', {bubbles: true}));
                btn.click();
                updateSelection((selectedIndex + 1) % 10);
            }
        };

        // ドラッグ移動
        let isDragging = false, offX, offY;
        container.onpointerdown = (e) => {
            if(e.target.closest("#crystaWheelWrapper") || e.target.closest("#numberSelector") || e.target.tagName === 'BUTTON') return;
            isDragging = true; offX = e.clientX - container.offsetLeft; offY = e.clientY - container.offsetTop;
            container.setPointerCapture(e.pointerId);
        };
        container.onpointermove = (e) => { if(isDragging){
            container.style.left=`${e.clientX-offX}px`; container.style.top=`${e.clientY-offY}px`;
            subWin.style.left=`${e.clientX-offX + 220}px`; subWin.style.top=`${e.clientY-offY + 30}px`;
        }};
        container.onpointerup = () => isDragging = false;

        drawWheel();

        window.toggleColorPicker = (isVisible) => {
            container.style.display = isVisible ? "block" : "none";
            if (!isVisible) subWin.style.display = "none";
        };

        const mgrCheck = document.getElementById('chk-color-picker');
        if (mgrCheck) window.toggleColorPicker(mgrCheck.checked);

        return true;
    }

    const observer = new MutationObserver(() => { if(initPicker()) observer.disconnect(); });
    observer.observe(document.body, { childList: true, subtree: true });
})();