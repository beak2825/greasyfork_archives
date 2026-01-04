// ==UserScript==
// @name         微信公众号图片上传助手（带 access_token 缓存 + 菜单上传 + 上传进度显示）
// @namespace    https://example.com/
// @version      1.12
// @description  自动获取 access_token 并缓存，过期后重新请求，图片裁剪+上传功能保持不变 + 菜单手动输入上传 + 进度提示功能
// @author       云空陆
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @connect      api.weixin.qq.com
// @connect      example.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/552878/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E5%9B%BE%E7%89%87%E4%B8%8A%E4%BC%A0%E5%8A%A9%E6%89%8B%EF%BC%88%E5%B8%A6%20access_token%20%E7%BC%93%E5%AD%98%20%2B%20%E8%8F%9C%E5%8D%95%E4%B8%8A%E4%BC%A0%20%2B%20%E4%B8%8A%E4%BC%A0%E8%BF%9B%E5%BA%A6%E6%98%BE%E7%A4%BA%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/552878/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E5%9B%BE%E7%89%87%E4%B8%8A%E4%BC%A0%E5%8A%A9%E6%89%8B%EF%BC%88%E5%B8%A6%20access_token%20%E7%BC%93%E5%AD%98%20%2B%20%E8%8F%9C%E5%8D%95%E4%B8%8A%E4%BC%A0%20%2B%20%E4%B8%8A%E4%BC%A0%E8%BF%9B%E5%BA%A6%E6%98%BE%E7%A4%BA%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const ACCESS_TOKEN_URL = ""; // 获取 access_token 接口
    const UPLOAD_WIDTH = 1080;
    const TOKEN_KEY = "wx_upload_access_token"; // localStorage key
    const TOKEN_EXPIRE_KEY = "wx_upload_access_token_expire"; // token有效期时间戳

    let currentImg = null;

    const uploadBtn = document.createElement("div");
    uploadBtn.innerText = "📤 上传到公众号";
    Object.assign(uploadBtn.style, {
        position: "fixed",
        padding: "6px 10px",
        background: "#07c160",
        color: "#fff",
        borderRadius: "4px",
        fontSize: "12px",
        cursor: "pointer",
        zIndex: "999999",
        display: "none",
        boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
        transition: "opacity 0.2s",
    });
    document.body.appendChild(uploadBtn);

   // 延迟隐藏定时器
    let hideUploadTimer = null;

    // ===== 获取或缓存 access_token =====
    async function getAccessToken() {
        const now = Date.now();
        const cachedToken = localStorage.getItem(TOKEN_KEY);
        const expireTime = parseInt(localStorage.getItem(TOKEN_EXPIRE_KEY) || "0", 10);
        if (cachedToken && now < expireTime) return cachedToken;

        // 请求新的 access_token
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: ACCESS_TOKEN_URL,
                responseType: "json",
                onload: function (res) {
                    let data;
                    try { data = res.response || JSON.parse(res.responseText); }
                    catch (e) { reject("返回JSON解析失败"); return; }

                    // 递归查找 access_token
                    function findToken(obj) {
                        if (typeof obj !== "object" || obj === null) return null;
                        if ("access_token" in obj) return obj.access_token;
                        for (const key in obj) {
                            const result = findToken(obj[key]);
                            if (result) return result;
                        }
                        return null;
                    }

                    const token = findToken(data);
                    const expires_in = data.expires_in || 7200;
                    if (token) {
                        const expire = now + (expires_in - 60) * 1000; // 提前60秒刷新
                        localStorage.setItem(TOKEN_KEY, token);
                        localStorage.setItem(TOKEN_EXPIRE_KEY, expire.toString());
                        resolve(token);
                    } else reject("未获取到 access_token");
                },
                onerror: function () { reject("请求 access_token 失败"); }
            });
        });
    }

    function getImageSrc(img) {
        // 优先级 data-original > data-src > src
        return img.getAttribute('data-original') || img.getAttribute('data-src') || img.src || '';
    }

 // ===== 鼠标事件控制 支持动态添加的图片=====
    document.addEventListener("mouseover", (e) => {
        let img = e.target;
        if (img.tagName === "IMG" && getImageSrc(img)) {
            currentImg = img;
            const rect = img.getBoundingClientRect();
            uploadBtn.style.left = `${rect.right - 130}px`;
            uploadBtn.style.top = `${rect.top  + 10}px`;
            uploadBtn.style.display = "block";
            uploadBtn.style.opacity = "1";
            clearTimeout(hideUploadTimer);
        }
    });

    document.addEventListener("mouseout", (e) => {
        if (!uploadBtn.contains(e.relatedTarget) && (!currentImg || !currentImg.contains(e.relatedTarget))) {
            clearTimeout(hideUploadTimer);
            hideUploadTimer = setTimeout(() => {
                uploadBtn.style.opacity = "0";
                setTimeout(() => { uploadBtn.style.display = "none"; }, 300);
            }, 1000);// 鼠标离开 5秒后隐藏
        }
    });

    uploadBtn.addEventListener("mouseenter", () => clearTimeout(hideUploadTimer));

    // ===== 上传核心逻辑封装 =====
    async function uploadImageByUrl(imageUrl, index = 1, total = 1) {
        if (!imageUrl) { showTip("❌ 未找到图片链接", true); return; }

        let accessToken;
        try { accessToken = await getAccessToken(); }
        catch (err) { showTip(`❌ ${err}`, true); return; }

        const UPLOAD_URL = `https://api.weixin.qq.com/cgi-bin/material/add_material?access_token=${accessToken}&type=image`;
        showTip(`📤 上传中（${index}/${total}）\n${imageUrl}`, false);

        try {
            const resp = await fetch(imageUrl);
            const blob = await resp.blob();

            const img = await new Promise((resolve, reject) => {
                const image = new Image();
                image.crossOrigin = "anonymous";
                image.onload = () => resolve(image);
                image.onerror = reject;
                image.src = URL.createObjectURL(blob);
            });

            // 裁剪底部5% + 3:4比例
            let cropHeight = img.height * 0.95;
            let cropWidth = img.width;
            const ratio = 3 / 4;
            if (cropWidth / cropHeight > ratio) cropWidth = cropHeight * ratio;
            else cropHeight = cropWidth / ratio;

            const sx = (img.width - cropWidth) / 2;
            const sy = 0;
            let dw = cropWidth;
            let dh = cropHeight;

            // 仅小于1080的图片放大到1080
            if (dw < UPLOAD_WIDTH) {
                const scale = UPLOAD_WIDTH / dw;
                dw = UPLOAD_WIDTH;
                dh = dh * scale;
            }

            // dw >= 1080 则保持原裁剪尺寸，不放大
            const canvas = document.createElement("canvas");
            canvas.width = dw;
            canvas.height = dh;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, sx, sy, cropWidth, cropHeight, 0, 0, dw, dh);
            const convertedBlob = await new Promise(resolve => canvas.toBlob(resolve, "image/jpeg", 0.92));

            const boundary = "----WebKitFormBoundary" + Math.random().toString(36).substr(2, 9);
            const bodyChunks = [
                `--${boundary}\r\n`,
                `Content-Disposition: form-data; name="media"; filename="image.jpg"\r\n`,
                `Content-Type: image/jpeg\r\n\r\n`,
                convertedBlob,
                `\r\n--${boundary}--\r\n`
            ];

            GM_xmlhttpRequest({
                method: "POST",
                url: UPLOAD_URL,
                headers: { "Content-Type": `multipart/form-data; boundary=${boundary}` },
                data: new Blob(bodyChunks),
                responseType: "json",
                onload: function (res) {
                    let result;
                    try { result = res.response || JSON.parse(res.responseText); }
                    catch (e) { showTip("❌ 上传响应解析失败", true); return; }

                    if (result.errcode === 40001) {// token失效，清空缓存并重试一次
                        localStorage.removeItem(TOKEN_KEY);
                        localStorage.removeItem(TOKEN_EXPIRE_KEY);
                        showTip("⚠️ token失效，重新获取中...", false);
                        uploadImageByUrl(imageUrl, index, total);
                        return;
                    }

                    if (result.media_id) {
                        const msg = `✅ 上传成功（${index}/${total}）\nurl: ${result.url || '无'}\nmedia_id: ${result.media_id}`;
                        showTip(msg, true, result.url || result.media_id);
                        console.log("上传成功：", result);
                    } else {
                        showTip(`❌ 上传失败（${index}/${total}）: ${result.errmsg}`, true);
                    }
                },
                onerror: function () { showTip("❌ 网络请求失败", true); }
            });
        } catch (err) {
            console.error(err);
            showTip("❌ 图片加载或处理失败", true);
        }
    }

    // ===== 按钮点击事件（保持原逻辑） =====
    uploadBtn.addEventListener("click", async () => {
        if (!currentImg) return;
        const imageUrl = getImageSrc(currentImg);
        uploadImageByUrl(imageUrl);
    });

    // ===== 提示窗口 =====
    let tipDiv = null;
    let autoCloseTimer = null;
    function showTip(msg, showControls = false, copyText = "") {
        if (!tipDiv) {
            tipDiv = document.createElement("div");
            Object.assign(tipDiv.style, {
                position: "fixed", top: "20px", right: "20px",
                background: "rgba(0,0,0,0.55)", color: "#fff",
                padding: "10px 15px", borderRadius: "6px",
                zIndex: "999999", fontSize: "13px",
                whiteSpace: "pre-wrap", wordBreak: "break-word",
                maxWidth: "320px", maxHeight: "250px", overflowY: "auto"
            });
            document.body.appendChild(tipDiv);
        }
        tipDiv.innerHTML = "";
        const textNode = document.createElement("div");
        textNode.innerText = msg;
        tipDiv.appendChild(textNode);

        if (showControls) {
            const btnContainer = document.createElement("div");
            Object.assign(btnContainer.style, { marginTop: "6px", textAlign: "right" });

            if (copyText) {
                const copyBtn = document.createElement("button");
                copyBtn.innerText = "复制链接";
                Object.assign(copyBtn.style, {
                    marginRight: "5px",
                    cursor: "pointer",
                    color: "#fff",           // 文字白色
            background: "#07c160",   // 绿色背景
                    border: "none",
                    borderRadius: "4px",
                    padding: "3px 8px",
                    fontSize: "12px"
                });
                copyBtn.onclick = () => {
                    navigator.clipboard.writeText(copyText).then(() => {
                        copyBtn.innerText = "已复制";
                        setTimeout(() => copyBtn.innerText = "复制链接", 1500);
                    });
                };
                btnContainer.appendChild(copyBtn);
            }

            const closeBtn = document.createElement("button");
            closeBtn.innerText = "关闭";
            Object.assign(closeBtn.style, {
                cursor: "pointer",
               color: "#fff",           // 文字白色
            background: "#07c160",   // 绿色背景
                border: "none",
                borderRadius: "4px",
                padding: "3px 8px",
                fontSize: "12px"
            });
            closeBtn.onclick = () => { tipDiv.style.display = "none"; clearTimeout(autoCloseTimer); };
            btnContainer.appendChild(closeBtn);
            tipDiv.appendChild(btnContainer);
        }

        tipDiv.style.display = "block";
        clearTimeout(autoCloseTimer);
        autoCloseTimer = setTimeout(() => { tipDiv.style.display = "none"; }, 10000);
    }

    // ===== ✅ 新增脚本菜单功能 =====
    GM_registerMenuCommand("📥 手动输入链接上传", async () => {
        const input = prompt("请输入图片链接（可输入多个链接，用换行或逗号分隔）:");
        if (!input) return;
        const urls = input.split(/\n|,|;|\s+/).map(u => u.trim()).filter(Boolean);
        const total = urls.length;
        for (let i = 0; i < total; i++) {
            await uploadImageByUrl(urls[i], i + 1, total);
            await new Promise(r => setTimeout(r, 1200)); // 间隔避免接口限频
        }
        showTip(`✅ 全部上传完成，共 ${total} 张图片`, true);
    });

// ===== ✅ 可拖拽剪贴板上传按钮（右下角，记忆位置） =====
const clipBtn = document.createElement("div");
clipBtn.innerText = "📋剪贴上传";
Object.assign(clipBtn.style, {
    position: "fixed",
    right: localStorage.getItem("clipBtn_right") || "20px",
    bottom: localStorage.getItem("clipBtn_bottom") || "20px",
    background: "#07c160",
    color: "#fff",
    padding: "8px 12px",
    borderRadius: "20px",
    fontSize: "13px",
    cursor: "pointer",
    boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
    zIndex: "999999",
    opacity: "0.9",
    userSelect: "none",
});
clipBtn.addEventListener("mouseenter", () => clipBtn.style.opacity = "1");
clipBtn.addEventListener("mouseleave", () => clipBtn.style.opacity = "0.9");
document.body.appendChild(clipBtn);

// ===== 拖拽逻辑 =====
let isDragging = false;
let offsetX = 0, offsetY = 0;

clipBtn.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - clipBtn.getBoundingClientRect().left;
    offsetY = e.clientY - clipBtn.getBoundingClientRect().top;
    clipBtn.style.transition = "none"; // 拖动时取消动画
    e.preventDefault();
});

document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    let left = e.clientX - offsetX;
    let top = e.clientY - offsetY;
    // 限制按钮不超出窗口
    left = Math.max(0, Math.min(window.innerWidth - clipBtn.offsetWidth, left));
    top = Math.max(0, Math.min(window.innerHeight - clipBtn.offsetHeight, top));
    clipBtn.style.left = left + "px";
    clipBtn.style.top = top + "px";
    clipBtn.style.right = "auto";
    clipBtn.style.bottom = "auto";
});

document.addEventListener("mouseup", () => {
    if (isDragging) {
        isDragging = false;
        clipBtn.style.transition = "opacity 0.2s";
        // 保存位置到 localStorage
        localStorage.setItem("clipBtn_left", clipBtn.style.left);
        localStorage.setItem("clipBtn_top", clipBtn.style.top);
    }
});

// ===== 点击上传逻辑 =====
clipBtn.addEventListener("click", async () => {
    if (isDragging) return; // 拖拽结束不触发点击
    try {
        const items = await navigator.clipboard.read();
        for (const item of items) {
            for (const type of item.types) {
                if (type.startsWith("image/")) {
                    const blob = await item.getType(type);
                    const blobUrl = URL.createObjectURL(blob);
                    showTip("📋 检测到图片，正在上传...", false);
                    await uploadImageByUrl(blobUrl);
                    return;
                }
            }
        }

        const text = await navigator.clipboard.readText();
        if (/^https?:\/\/[^\s]+/i.test(text.trim())) {
            showTip("📋 检测到图片链接，正在上传...", false);
            await uploadImageByUrl(text.trim());
        } else {
            showTip("⚠️ 剪贴板中未检测到图片或图片链接", true);
        }
    } catch (err) {
        console.error(err);
        showTip("❌ 无法访问剪贴板，请检查浏览器权限", true);
    }
});
})();
