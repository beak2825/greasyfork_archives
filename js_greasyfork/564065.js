// ==UserScript==
// @name         甘党専用カラーピッカー さいしゅうばん！
// @namespace    ipad-colorpicker-ultimate-save-load
// @version      8.7
// @description  IPAD対応はGEMINIに全部やってもらった！けど、バグ修正は頑張りました！
// @match        https://pictsense.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/564065/%E7%94%98%E5%85%9A%E5%B0%82%E7%94%A8%E3%82%AB%E3%83%A9%E3%83%BC%E3%83%94%E3%83%83%E3%82%AB%E3%83%BC%20%E3%81%95%E3%81%84%E3%81%97%E3%82%85%E3%81%86%E3%81%B0%E3%82%93%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/564065/%E7%94%98%E5%85%9A%E5%B0%82%E7%94%A8%E3%82%AB%E3%83%A9%E3%83%BC%E3%83%94%E3%83%83%E3%82%AB%E3%83%BC%20%E3%81%95%E3%81%84%E3%81%97%E3%82%85%E3%81%86%E3%81%B0%E3%82%93%EF%BC%81.meta.js
// ==/UserScript==

(function () {
    'use strict';
    if (window.cp_initialized) return;
    window.cp_initialized = true;

    // ★ 初期パレット
    const PRESET_COLORS = ["#f077db", "#a16b3e", "#FF3B21", "#b8b8b8", "#FFFFFF", "#000000", "#4F93D9", "#40a31f", "#fde802", "#ff9000"];

    // ★ 補助：RGB形式をHEX形式(#xxxxxx)に強制変換する（黒化防止の要）
    const rgbToHex = (rgb) => {
        if (!rgb || rgb.startsWith('#')) return rgb || "#ffffff";
        const m = rgb.match(/\d+/g);
        if (!m) return "#ffffff";
        return "#" + m.slice(0, 3).map(x => parseInt(x).toString(16).padStart(2, '0')).join('');
    };

    function initPicker() {
        if (document.getElementById("randomcollarUI")) return true;
        const allButtons = Array.from(document.querySelectorAll("#colorPalette button.color"));
        const paletteButtons = allButtons.slice(1, 11);
        if (paletteButtons.length === 0) return false;

        let savedPalettes = JSON.parse(localStorage.getItem('amatou_palettes') || '{"1":[], "2":[], "3":[]}');

        // パレットを標準UIに適用
        const applyToOfficial = (colors) => {
            if (!colors || colors.length === 0) return;
            paletteButtons.forEach((btn, i) => {
                const hex = rgbToHex(colors[i]);
                btn.setAttribute("data-color", hex.replace("#", ""));
                btn.style.backgroundColor = hex;
            });
        };
        applyToOfficial(PRESET_COLORS);

        /* --- UI構築（シールド、拡大鏡、メインパネル） --- */
        const shield = document.createElement("div");
        shield.style.cssText = "position:fixed; top:0; left:0; width:100vw; height:100vh; z-index:9998; display:none; touch-action:none;";
        document.body.appendChild(shield);

        const magnifier = document.createElement("div");
        magnifier.style.cssText = "position:fixed; width:100px; height:100px; border:3px solid #fff; border-radius:50%; overflow:hidden; z-index:10000; display:none; pointer-events:none; box-shadow:0 0 15px rgba(0,0,0,0.5); background:#000;";
        const magCanvas = document.createElement("canvas");
        magCanvas.width = 100; magCanvas.height = 100;
        magnifier.appendChild(magCanvas);
        document.body.appendChild(magnifier);
        const mCtx = magCanvas.getContext("2d", { willReadFrequently: true });

        const container = document.createElement("div");
        container.id = "randomcollarUI";
        container.style.cssText = "position:fixed; top:120px; left:10px; z-index:9999; background:#222; padding:10px; border-radius:10px; color:#fff; font-family:sans-serif; user-select:none; width:210px; border:1px solid #444; box-shadow: 0 4px 15px rgba(0,0,0,0.5); touch-action:none;";
        container.innerHTML = `
            <div id="dragBar" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <div style="font-weight:bold; font-size:14px;">甘党専用♡ピッカー</div>
                <div id="curPreview" style="width:45px; height:25px; border-radius:4px; border:2px solid #fff; background:#fff;"></div>
            </div>
            <div id="wheelWrapper" style="width:190px; height:190px; margin: 0 auto 10px;">
                <canvas id="wheelCanvas" width="190" height="190"></canvas>
            </div>
            <div id="numGrid" style="display:grid; grid-template-columns: repeat(5, 1fr); gap:5px; margin-bottom:12px;">
                ${[1,2,3,4,5,6,7,8,9,10].map(n => `<div class="num-btn" data-idx="${n-1}" style="background:#333; border-radius:4px; text-align:center; padding:8px 0; font-size:13px; border:1px solid #555;">${n}</div>`).join('')}
            </div>
            <button id="applyBtn" style="width:100%; height:45px; border:none; border-radius:8px; background:#007bff; color:#fff; font-weight:bold; font-size:16px; margin-bottom:8px;">色を確定</button>
            <button id="dropBtn" style="width:100%; height:35px; border:1px solid #555; border-radius:8px; background:#444; color:#eee; font-size:13px; margin-bottom:8px;">スポイト</button>
            <button id="openSaveBtn" style="width: 100%; height: 35px; border:none; border-radius:8px; background:#28a745; color:#fff; font-size:13px; font-weight:bold;">パレット保存/読込</button>
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
                        <button class="pal-apply" data-id="${i}" style="flex:1; background:#007bff; border:none; color:#fff; border-radius:4px; padding:8px; font-size:11px;">適用</button>
                        <button class="pal-edit" data-id="${i}" style="flex:1; background:#6c757d; border:none; color:#fff; border-radius:4px; padding:8px; font-size:11px;">編集保存</button>
                    </div>
                </div>
            `).join('')}
            <button id="closeSaveBtn" style="width:100%; background:#444; border:none; color:#eee; border-radius:4px; padding:8px; cursor:pointer; font-size:12px;">閉じる</button>
        `;
        document.body.appendChild(subWin);

        /* --- ロジック変数 & カラー計算 --- */
        const previewEl = container.querySelector("#curPreview");
        const numBtns = container.querySelectorAll(".num-btn");
        const wheelCanvas = container.querySelector("#wheelCanvas");
        const wCtx = wheelCanvas.getContext("2d");
        const size = 190, ring = 18, box = 110;
        let selectedIndex = 0, currentH = 0, currentS = 100, currentV = 100;

        const hsvToHex = (h, s, v) => {
            s /= 100; v /= 100;
            const f = (n, k = (n + h / 60) % 6) => v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
            const toHex = x => Math.round(x * 255).toString(16).padStart(2, '0');
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
        numBtns.forEach(btn => btn.ontouchstart = (e) => {
            updateSelection(parseInt(btn.getAttribute("data-idx")));
            e.preventDefault();
        });

        function drawWheel() {
            wCtx.clearRect(0, 0, size, size);
            const c = size / 2;
            for (let i = 0; i < 360; i++) {
                wCtx.beginPath(); wCtx.strokeStyle = `hsl(${i},100%,50%)`; wCtx.lineWidth = ring;
                wCtx.arc(c, c, c - ring / 2, i * Math.PI / 180, (i + 1) * Math.PI / 180); wCtx.stroke();
            }
            const sx = c - box / 2, sy = c - box / 2;
            const g1 = wCtx.createLinearGradient(sx, 0, sx + box, 0);
            g1.addColorStop(0, "#fff"); g1.addColorStop(1, `hsl(${currentH},100%,50%)`);
            wCtx.fillStyle = g1; wCtx.fillRect(sx, sy, box, box);
            const g2 = wCtx.createLinearGradient(0, sy, 0, sy + box);
            g2.addColorStop(0, "rgba(0,0,0,0)"); g2.addColorStop(1, "rgba(0,0,0,1)");
            wCtx.fillStyle = g2; wCtx.fillRect(sx, sy, box, box);
            const drawM = (mx, my) => {
                wCtx.beginPath(); wCtx.strokeStyle = "black"; wCtx.lineWidth = 3; wCtx.arc(mx, my, 6, 0, 7); wCtx.stroke();
                wCtx.beginPath(); wCtx.strokeStyle = "white"; wCtx.lineWidth = 2; wCtx.arc(mx, my, 6, 0, 7); wCtx.stroke();
            };
            drawM(c + (c - ring / 2) * Math.cos(currentH * Math.PI / 180), c + (c - ring / 2) * Math.sin(currentH * Math.PI / 180));
            drawM(sx + (currentS / 100) * box, sy + (1 - currentV / 100) * box);
            previewEl.style.backgroundColor = hsvToHex(currentH, currentS, currentV);
        }

        /* --- タッチ操作 --- */
        let activePart = null;
        wheelCanvas.ontouchstart = (e) => {
            const t = e.touches[0]; const r = wheelCanvas.getBoundingClientRect();
            const dx = (t.clientX - r.left) - size / 2, dy = (t.clientY - r.top) - size / 2;
            activePart = (Math.sqrt(dx * dx + dy * dy) > size / 2 - ring - 15) ? 'ring' : 'box';
            handleWheel(e); e.preventDefault();
        };
        wheelCanvas.ontouchmove = (e) => { if (activePart) handleWheel(e); e.preventDefault(); };
        wheelCanvas.ontouchend = () => { activePart = null; };

        function handleWheel(e) {
            const t = e.touches[0]; const r = wheelCanvas.getBoundingClientRect();
            const x = t.clientX - r.left, y = t.clientY - r.top, c = size / 2;
            if (activePart === 'ring') {
                currentH = (Math.atan2(y - c, x - c) * 180 / Math.PI + 360) % 360;
            } else {
                const sx = c - box / 2, sy = c - box / 2;
                currentS = Math.max(0, Math.min(100, (x - sx) / box * 100));
                currentV = Math.max(0, Math.min(100, 100 - (y - sy) / box * 100));
            }
            drawWheel();
        }

        /* --- スポイト --- */
        let dropping = false;
        const dropperBtn = container.querySelector("#dropBtn");
        const toggleDrop = (s) => {
            dropping = s; shield.style.display = s ? "block" : "none";
            magnifier.style.display = s ? "block" : "none";
            dropperBtn.textContent = s ? "吸い取り中" : "スポイト";
            dropperBtn.style.background = s ? "#dc3545" : "#444";
        };
        dropperBtn.ontouchstart = (e) => { toggleDrop(!dropping); e.preventDefault(); };

        shield.ontouchmove = (e) => {
            if (!dropping) return;
            const t = e.touches[0];
            const canvas = document.querySelector("#canvas") || document.querySelector("canvas");
            if (!canvas) return;
            const r = canvas.getBoundingClientRect();
            const x = (t.clientX - r.left) * (canvas.width / r.width), y = (t.clientY - r.top) * (canvas.height / r.height);
            magnifier.style.left = `${t.clientX - 50}px`; magnifier.style.top = `${t.clientY - 120}px`;
            const cCtx = canvas.getContext("2d", { willReadFrequently: true });
            mCtx.clearRect(0, 0, 100, 100); mCtx.drawImage(canvas, x - 5, y - 5, 10, 10, 0, 0, 100, 100);
            mCtx.strokeStyle = "#fff"; mCtx.lineWidth = 2; mCtx.strokeRect(45, 45, 10, 10);
            const p = cCtx.getImageData(x, y, 1, 1).data;
            if (p[3] === 0) return;
            let rf = p[0] / 255, gf = p[1] / 255, bf = p[2] / 255, v = Math.max(rf, gf, bf), n = v - Math.min(rf, gf, bf);
            let h = n && (v == rf ? (gf - bf) / n : v == gf ? 2 + (bf - rf) / n : 4 + (rf - gf) / n);
            currentH = 60 * (h < 0 ? h + 6 : h); currentS = v && (n / v) * 100; currentV = v * 100;
            drawWheel(); e.preventDefault();
        };
        shield.ontouchend = () => { if (dropping) toggleDrop(false); };

        /* --- 保存/読込 --- */
        container.querySelector("#openSaveBtn").ontouchstart = (e) => {
            subWin.style.display = (subWin.style.display === "none") ? "block" : "none";
            e.preventDefault();
        };
        subWin.querySelector("#closeSaveBtn").ontouchstart = (e) => { subWin.style.display = "none"; e.preventDefault(); };

        subWin.querySelectorAll(".pal-apply").forEach(btn => {
            btn.ontouchstart = (e) => {
                const id = btn.getAttribute("data-id");
                if (savedPalettes[id] && savedPalettes[id].length > 0) {
                    applyToOfficial(savedPalettes[id]);
                    subWin.style.display = "none";
                } else alert("このスロットは空です。");
                e.preventDefault();
            };
        });

        subWin.querySelectorAll(".pal-edit").forEach(btn => {
            btn.ontouchstart = (e) => {
                const id = btn.getAttribute("data-id");
                // RGBからHEXに変換してから保存することで、次回読込時の黒化を防ぐ
                savedPalettes[id] = paletteButtons.map(b => rgbToHex(b.style.backgroundColor));
                localStorage.setItem('amatou_palettes', JSON.stringify(savedPalettes));
                alert(`パレット ${id} に保存しました！`);
                e.preventDefault();
            };
        });

        /* --- ★ 確定（iPad用Undo対策） --- */
        container.querySelector("#applyBtn").ontouchstart = (e) => {
            const hex = hsvToHex(currentH, currentS, currentV);
            const btn = paletteButtons[selectedIndex];
            if (btn) {
                // 1. まずデータと見た目をセット
                btn.setAttribute("data-color", hex.replace("#", ""));
                btn.style.backgroundColor = hex;

                // 2. iPadの履歴システムに認識させるためのタッチイベント作成
                const rect = btn.getBoundingClientRect();
                const touchObj = new Touch({
                    identifier: Date.now(),
                    target: btn,
                    clientX: rect.left + rect.width / 2,
                    clientY: rect.top + rect.height / 2,
                    radiusX: 2.5, radiusY: 2.5, rotationAngle: 10, force: 0.5,
                });

                const touchStart = new TouchEvent('touchstart', {
                    cancelable: true, bubbles: true, touches: [touchObj], targetTouches: [touchObj], changedTouches: [touchObj]
                });
                const touchEnd = new TouchEvent('touchend', {
                    cancelable: true, bubbles: true, touches: [], targetTouches: [], changedTouches: [touchObj]
                });

                // 3. 実行：開始 -> 終了 -> クリック の順で発火
                btn.dispatchEvent(touchStart);
                btn.dispatchEvent(touchEnd);
                btn.click();

                updateSelection((selectedIndex + 1) % 10);
            }
            e.preventDefault();
        };

        /* --- ドラッグ --- */
        let ox, oy;
        container.querySelector("#dragBar").ontouchstart = e => {
            ox = e.touches[0].clientX - container.offsetLeft;
            oy = e.touches[0].clientY - container.offsetTop;
            e.preventDefault();
        };
        container.querySelector("#dragBar").ontouchmove = e => {
            const nx = e.touches[0].clientX - ox;
            const ny = e.touches[0].clientY - oy;
            container.style.left = `${nx}px`; container.style.top = `${ny}px`;
            subWin.style.left = `${nx + 220}px`; subWin.style.top = `${ny + 30}px`;
            e.preventDefault();
        };

        drawWheel();
        return true;
    }

    const observer = new MutationObserver(() => { if (initPicker()) observer.disconnect(); });
    observer.observe(document.body, { childList: true, subtree: true });
})();