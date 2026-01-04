// ==UserScript==
// @name         163 Max!
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  163max
// @author       Ziyang
// @match        *://music.163.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/560405/163%20Max%21.user.js
// @updateURL https://update.greasyfork.org/scripts/560405/163%20Max%21.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const qualityList = [
        ["standard", "标准"],
        ["exhigh", "极高"],
        ["lossless", "无损"],
        ["hires", "Hi-Res"],
        ["jyeffect", "超音"],
        ["sky", "天空"],
        ["dolby", "杜比"],
        ["jymaster", "母带"]
    ];

    // 弹窗函数
    function showModal(html) {
        const mask = document.createElement("div");
        mask.style = `
            position:fixed;inset:0;
            background:rgba(0,0,0,.4);
            z-index:99998;
        `;

        const box = document.createElement("div");
        box.style = `
            position:fixed;
            top:50%;left:50%;
            transform:translate(-50%,-50%);
            background:#fff;
            padding:16px 18px;
            width:340px;
            font:14px/1.6 sans-serif;
            z-index:99999;
        `;
        box.innerHTML = html;

        mask.onclick = () => {
            mask.remove();
            box.remove();
        };

        document.body.appendChild(mask);
        document.body.appendChild(box);
        return { mask, box };
    }

    // 播放音频函数
    async function playSong(id, name) {
        const modal = showModal(`
            <div style="font-weight:bold;font-size:16px;margin-bottom:6px;">
                ${name}
            </div>
            <div style="margin:8px 0;">
                音质选择：
                <select id="qualitySel" style="width:100%;margin-top:4px;">
                    ${qualityList.map(q => `<option value="${q[0]}" ${q[0]==="jymaster"?"selected":""}>
                        ${q[1]} (${q[0]})
                    </option>`).join("")}
                </select>
            </div>
            <div id="infoBox" style="color:#555;font-size:13px;"></div>
            <div style="text-align:right;margin-top:12px;">
                <button id="playBtn">播放</button>
                <button id="closeBtn">关闭</button>
            </div>
        `);

        modal.box.querySelector("#closeBtn").onclick = () => {
            modal.mask.remove();
            modal.box.remove();
        };

        modal.box.querySelector("#playBtn").onclick = async () => {
            const level = modal.box.querySelector("#qualitySel").value;
            modal.box.querySelector("#infoBox").textContent = "正在获取音频…";

            try {
                const urlRes = await fetch(
                    "https://wyapi-1.toubiec.cn/api/music/url",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ id, level })
                    }
                ).then(r => r.json());

                const d = urlRes?.data?.[0];
                if (!d || !d.url) {
                    modal.box.querySelector("#infoBox").textContent = "该音质不可用";
                    return;
                }

                modal.mask.remove();
                modal.box.remove();

                // 创建播放器
                const box = document.createElement("div");
                box.style = `
                    position:fixed;
                    bottom:10px;
                    right:10px;
                    z-index:99999;
                    padding:10px;
                    background:#fff;
                    border:1px solid #ccc;
                    cursor:default;
                `;

                // 拖拽方块
                const dragHandle = document.createElement("div");
                dragHandle.style = `
                    width:16px;
                    height:16px;
                    background:#666;
                    display:inline-block;
                    margin-right:6px;
                    cursor:move;
                `;
                box.appendChild(dragHandle);

                // 关闭按钮
                const close = document.createElement("button");
                close.textContent = "×";
                close.style = `
                    position:absolute;
                    top:2px;
                    right:6px;
                    border:none;
                    background:none;
                    font-size:16px;
                    cursor:pointer;
                `;
                close.onclick = () => box.remove();
                box.appendChild(close);

                // 音频控件
                const audio = document.createElement("audio");
                audio.src = d.url;
                audio.controls = true;
                audio.autoplay = true;
                audio.style.maxWidth = "300px";
                box.appendChild(audio);

                document.body.appendChild(box);

                // 拖拽逻辑
                dragHandle.onmousedown = function(e) {
                    e.preventDefault();
                    let offsetX = e.clientX - box.offsetLeft;
                    let offsetY = e.clientY - box.offsetTop;

                    function mouseMoveHandler(e) {
                        box.style.left = (e.clientX - offsetX) + "px";
                        box.style.top = (e.clientY - offsetY) + "px";
                        box.style.bottom = "auto";
                        box.style.right = "auto";
                    }

                    function mouseUpHandler() {
                        document.removeEventListener("mousemove", mouseMoveHandler);
                        document.removeEventListener("mouseup", mouseUpHandler);
                    }

                    document.addEventListener("mousemove", mouseMoveHandler);
                    document.addEventListener("mouseup", mouseUpHandler);
                };

            } catch (e) {
                modal.box.querySelector("#infoBox").textContent = "请求失败：" + e;
            }
        };
    }

    // 插入触发按钮
    function attachPlayButtons() {
        const infos = document.querySelectorAll('.m-info');
        infos.forEach(info => {
            if (info.dataset.tampered) return;
            info.dataset.tampered = true;

            const playId = info.querySelector('[data-res-action="play"]')?.dataset.resId;
            const songName = info.querySelector('.f-thide')?.textContent || 'song_' + playId;
            if (!playId) return;

            // 创建自定义按钮
            const btn = document.createElement("button");
            btn.textContent = "163Max";
            btn.style = "margin-left:4px;padding:2px 6px;font-size:12px;cursor:pointer;";
            btn.onclick = () => playSong(playId, songName);

            // 插入到播放按钮后面
            const playBtn = info.querySelector('[data-res-action="play"]');
            if (playBtn) playBtn.parentNode.insertBefore(btn, playBtn.nextSibling);
        });
    }

    attachPlayButtons();

    // 监听异步加载的 .m-info
    const observer = new MutationObserver(attachPlayButtons);
    observer.observe(document.body, { childList: true, subtree: true });

})();