// ==UserScript==
// @name         萝卜工坊去水印
// @namespace    http://tampermonkey.net/
// @version      2025-11-20
// @description  萝卜工坊去水印！
// @author       You
// @match        https://beautifulcarrot.com/v2/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=beautifulcarrot.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556400/%E8%90%9D%E5%8D%9C%E5%B7%A5%E5%9D%8A%E5%8E%BB%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/556400/%E8%90%9D%E5%8D%9C%E5%B7%A5%E5%9D%8A%E5%8E%BB%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ===== 工具函数 =====
    function makeDraggable(el) {
        let ox = 0, oy = 0, down = false;
        el.style.position = "fixed";
        /*el.style.cursor = "move";
        el.addEventListener("mousedown", e => {
            down = true;
            ox = e.clientX - el.offsetLeft;
            oy = e.clientY - el.offsetTop;
        });
        document.addEventListener("mousemove", e => {
            if (!down) return;
            el.style.left = (e.clientX - ox) + "px";
            el.style.top = (e.clientY - oy) + "px";
        });
        document.addEventListener("mouseup", () => { down = false; });*/
    }

    // ===== 找画布 =====
    function getCanvas() {
        return document.querySelector("#pic_canvas");
    }

    // ===== 曝光处理 =====
    function applyExposure(evValue) {
        const canvas = getCanvas();
        if (!canvas) return;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        // EV 曝光转换：EV=1 大约亮度 *2；EV=-1 大约亮度 *0.5
        const scale = Math.pow(2, evValue);

        for (let i = 0; i < data.length; i += 4) {
            data[i]     = Math.min(data[i]     * scale, 255);
            data[i + 1] = Math.min(data[i + 1] * scale, 255);
            data[i + 2] = Math.min(data[i + 2] * scale, 255);
        }

        ctx.putImageData(imgData, 0, 0);
    }

    // ===== 去水印（亮色提亮） =====
    function removeWatermark() {
        const canvas = getCanvas();
        if (!canvas) return;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        const target = { r: 0xE7, g: 0xE7, b: 0xE7 };
        const tol = 33;

        for (let i = 0; i < data.length; i += 4) {
            let r = data[i], g = data[i+1], b = data[i+2];

            if (Math.abs(r-target.r)<=tol && Math.abs(g-target.g)<=tol && Math.abs(b-target.b)<=tol) {
                data[i]     = Math.min(r + 100, 255);
                data[i + 1] = Math.min(g + 100, 255);
                data[i + 2] = Math.min(b + 100, 255);
            }
        }

        ctx.putImageData(imgData, 0, 0);
    }

    // ===== 下载函数 =====
    function downloadCanvas() {
        const canvas = getCanvas();
        if (!canvas) return;

        const url = canvas.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = url;
        a.download = "canvas.png";
        a.click();
    }

    // ===== 创建按钮 =====
    function createButton(text, left, top, onClick) {
        const btn = document.createElement("div");
        btn.textContent = text;
        btn.style.cssText = `
            padding:6px 14px;
            background:#187bff;
            color:white;
            border-radius:6px;
            z-index:999999;
            user-select:none;
        `;
        btn.style.left = left + "px";
        btn.style.top = top + "px";

        btn.addEventListener("click", e => {
            e.stopPropagation();
            onClick();
        });

        document.body.appendChild(btn);
        makeDraggable(btn);
        return btn;
    }

    // ===== 创建滑条控件 =====
    function createExposureSlider(left, top) {
        const wrap = document.createElement("div");
        wrap.style.cssText = `
            position:fixed;
            left:${left}px;
            top:${top}px;
            padding:6px;
            background:#187bff;
            color:white;
            border-radius:6px;
            z-index:999999;
            user-select:none;
        `;

        wrap.textContent = "曝光：";

        const input = document.createElement("input");
        input.type = "range";
        input.min = -0.5;
        input.max = 0.5;
        input.step = 0.01;
        input.value = 0; // 默认曝光-1
        input.style.verticalAlign = "middle";
        wrap.appendChild(input);

        input.addEventListener("input", () => {
            applyExposure(Number(input.value));
        });

        document.body.appendChild(wrap);
        makeDraggable(wrap);
    }

    // ===== 按钮实例 =====
    createButton("去水印", 200, 20, removeWatermark);
    createButton("下载",   300, 20, downloadCanvas);
    createExposureSlider(400, 20); // 曝光滑条

})();