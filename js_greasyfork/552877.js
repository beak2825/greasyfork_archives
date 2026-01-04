// ==UserScript==
// @name         图片/视频上传助手（智能命名版）
// @namespace    https://example.com/
// @version      1.2
// @description  根据标签内容智能命名文件，支持图片/视频上传到指定 API，含悬浮、菜单、剪贴板上传功能
// @author       云空陆
// @license MIT
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @connect      your.domain
// @downloadURL https://update.greasyfork.org/scripts/552877/%E5%9B%BE%E7%89%87%E8%A7%86%E9%A2%91%E4%B8%8A%E4%BC%A0%E5%8A%A9%E6%89%8B%EF%BC%88%E6%99%BA%E8%83%BD%E5%91%BD%E5%90%8D%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/552877/%E5%9B%BE%E7%89%87%E8%A7%86%E9%A2%91%E4%B8%8A%E4%BC%A0%E5%8A%A9%E6%89%8B%EF%BC%88%E6%99%BA%E8%83%BD%E5%91%BD%E5%90%8D%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

      /*********** 配置区域 ***********/
    const UPLOAD_API = "";  // 上传 API直接填写api地址
    const AUTH_CODE = "";           // 上传认证码或者apitoken（可为空）
    const SERVER_COMPRESS = "false";     // true/false/空（空使用默认 true）
    const UPLOAD_CHANNEL = "";      // telegram/cfr2/s3/空（空使用默认 telegram）
    const AUTO_RETRY = "";          // true/false/空（空使用默认 true）
    const UPLOAD_NAME_TYPE = "";    // default/index/origin/short/空（空使用默认 default）
    const RETURN_FORMAT = "";       // default/full/空（空使用默认 default）
    const UPLOAD_FOLDER = "";       // 相对目录，空使用默认
    /********************************/

    let currentFile = null;

    const uploadBtn = document.createElement("div");
    uploadBtn.innerText = "📤";
    Object.assign(uploadBtn.style, {
        position: "fixed",
        padding: "6px 10px",
        background: "#f13535ff",
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

    let hideUploadTimer = null;

    function getFileSrc(el) {
        return el.getAttribute('data-original') || el.getAttribute('data-src') || el.src || '';
    }

    // 获取节点中可读标题作为文件名
    function getReadableName(el) {
        const nameAttr = el.getAttribute("alt") ||
            el.getAttribute("title") ||
            el.getAttribute("aria-label") ||
            el.getAttribute("data-name") ||
            el.getAttribute("data-title") || "";
        if (nameAttr && nameAttr.trim()) return sanitizeFilename(nameAttr.trim());
        return "";
    }

    // 清理非法文件名字符
    function sanitizeFilename(name) {
        return name.replace(/[\\/:*?"<>|]/g, "_").slice(0, 50);
    }

    // 根据 MIME 类型或 URL 自动获取扩展名
    function guessExtension(mime, url = "") {
        if (mime) {
            if (mime.startsWith("image/")) return mime.split("/")[1];
            if (mime.startsWith("video/")) return mime.split("/")[1];
        }
        const m = url.match(/\.(jpg|jpeg|png|webp|gif|mp4|mov|avi|mkv|webm|svg|bmp|heic|heif)(\?|#|$)/i);
        if (m) return m[1].toLowerCase();
        return "dat";
    }

    // ===== 鼠标悬浮显示按钮 =====
    document.addEventListener("mouseover", (e) => {
        let el = e.target;
        if ((el.tagName === "IMG" || el.tagName === "VIDEO") && getFileSrc(el)) {
            currentFile = el;
            const rect = el.getBoundingClientRect();
            uploadBtn.style.left = `${rect.right - 160}px`;
            uploadBtn.style.top = `${rect.top + 10}px`;
            uploadBtn.style.display = "block";
            uploadBtn.style.opacity = "1";
            clearTimeout(hideUploadTimer);
        }
    });

    document.addEventListener("mouseout", (e) => {
        if (!uploadBtn.contains(e.relatedTarget) && (!currentFile || !currentFile.contains(e.relatedTarget))) {
            clearTimeout(hideUploadTimer);
            hideUploadTimer = setTimeout(() => {
                uploadBtn.style.opacity = "0";
                setTimeout(() => { uploadBtn.style.display = "none"; }, 300);
            }, 500);
        }
    });

    uploadBtn.addEventListener("mouseenter", () => clearTimeout(hideUploadTimer));

    // ===== 上传核心逻辑 =====
    async function uploadFileByUrl(fileUrl, index = 1, total = 1, el = null) {
        if (!fileUrl) { showTip("❌ 未找到文件链接", true); return; }

        showTip(`📤 上传中（${index}/${total}）\n${fileUrl}`, false);

        try {
            const resp = await fetch(fileUrl);
            const blob = await resp.blob();

            // 智能生成文件名
            let baseName = el ? getReadableName(el) : "";
            const ext = guessExtension(blob.type, fileUrl);
            if (!baseName) {
                const fromUrl = decodeURIComponent(fileUrl.split("/").pop().split("?")[0]);
                baseName = sanitizeFilename(fromUrl.replace(/\.[a-z0-9]+$/i, "")) || `file_${Date.now()}`;
            }
            const filename = `${baseName}.${ext}`;

            const formData = new FormData();
            formData.append("file", blob, filename);

            const queryParams = new URLSearchParams();
            if (AUTH_CODE) queryParams.append("authCode", AUTH_CODE);
            if (SERVER_COMPRESS) queryParams.append("serverCompress", SERVER_COMPRESS);
            if (UPLOAD_CHANNEL) queryParams.append("uploadChannel", UPLOAD_CHANNEL);
            if (AUTO_RETRY) queryParams.append("autoRetry", AUTO_RETRY);
            if (UPLOAD_NAME_TYPE) queryParams.append("uploadNameType", UPLOAD_NAME_TYPE);
            if (RETURN_FORMAT) queryParams.append("returnFormat", RETURN_FORMAT);
            if (UPLOAD_FOLDER) queryParams.append("uploadFolder", UPLOAD_FOLDER);

            GM_xmlhttpRequest({
                method: "POST",
                url: `${UPLOAD_API}?${queryParams.toString()}`,
                data: formData,
                responseType: "json",
                onload: function (res) {
                    let result;
                    try { result = res.response || JSON.parse(res.responseText); }
                    catch (e) { showTip("❌ 上传响应解析失败", true); return; }

                    if (Array.isArray(result) && result[0]?.src) {
                        const fullUrl = `${UPLOAD_API.replace(/\/upload$/, "")}${result[0].src}`;
                        showTip(`✅ 上传成功（${index}/${total}）\n${filename}\n链接: ${fullUrl}`, true, fullUrl);
                        console.log("上传成功：", fullUrl);
                    } else {
                        showTip(`❌ 上传失败（${index}/${total}）: 未返回有效链接`, true);
                        console.error(result);
                    }
                },
                onerror: function () { showTip("❌ 网络请求失败", true); }
            });
        } catch (err) {
            console.error(err);
            showTip("❌ 文件加载或处理失败", true);
        }
    }

    uploadBtn.addEventListener("click", async () => {
        if (!currentFile) return;
        const url = getFileSrc(currentFile);
        await uploadFileByUrl(url, 1, 1, currentFile);
    });

    // ===== 提示框 =====
    let tipDiv = null, autoCloseTimer = null;
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
                    color: "#fff",
                    background: "#f13535ff",
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
                color: "#fff",
                background: "#f13535ff",
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

    // ===== 菜单上传 =====
    GM_registerMenuCommand("📥 手动输入链接上传", async () => {
        const input = prompt("请输入文件链接（可输入多个链接，用换行或逗号分隔）:");
        if (!input) return;
        const urls = input.split(/\n|,|;|\s+/).map(u => u.trim()).filter(Boolean);
        const total = urls.length;
        for (let i = 0; i < total; i++) {
            await uploadFileByUrl(urls[i], i + 1, total);
            await new Promise(r => setTimeout(r, 1200));
        }
        showTip(`✅ 全部上传完成，共 ${total} 个文件`, true);
    });

    // ===== 剪贴板上传按钮 =====
    const clipBtn = document.createElement("div");
    clipBtn.innerText = "📋剪贴图床";
    Object.assign(clipBtn.style, {
        position: "fixed",
        right: localStorage.getItem("clipBtn_right") || "20px",
        bottom: localStorage.getItem("clipBtn_bottom") || "80px",
        background: "#f13535ff",
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
    document.body.appendChild(clipBtn);

    // ===== 拖拽逻辑 =====
    let isDragging = false, offsetX = 0, offsetY = 0;
    clipBtn.addEventListener("mousedown", (e) => {
        isDragging = true;
        offsetX = e.clientX - clipBtn.getBoundingClientRect().left;
        offsetY = e.clientY - clipBtn.getBoundingClientRect().top;
        clipBtn.style.transition = "none";
        e.preventDefault();
    });
    document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        let left = e.clientX - offsetX;
        let top = e.clientY - offsetY;
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
            localStorage.setItem("clipBtn_left", clipBtn.style.left);
            localStorage.setItem("clipBtn_top", clipBtn.style.top);
        }
    });

    // ===== 剪贴板上传逻辑 =====
    clipBtn.addEventListener("click", async () => {
        if (isDragging) return;
        try {
            const items = await navigator.clipboard.read();
            for (const item of items) {
                for (const type of item.types) {
                    if (type.startsWith("image/") || type.startsWith("video/")) {
                        const blob = await item.getType(type);
                        const blobUrl = URL.createObjectURL(blob);
                        showTip("📋 检测到文件，正在上传...", false);
                        await uploadFileByUrl(blobUrl);
                        return;
                    }
                }
            }
            const text = await navigator.clipboard.readText();
            if (/^https?:\/\/[^\s]+/i.test(text.trim())) {
                showTip("📋 检测到文件链接，正在上传...", false);
                await uploadFileByUrl(text.trim());
            } else {
                showTip("⚠️ 剪贴板中未检测到文件或链接", true);
            }
        } catch (err) {
            console.error(err);
            showTip("❌ 无法访问剪贴板，请检查浏览器权限", true);
        }
    });

})();
