// ==UserScript==
// @name         数字暗号版
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  自动识别验证码并填充“数字暗号”输入框
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/549025/%E6%95%B0%E5%AD%97%E6%9A%97%E5%8F%B7%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/549025/%E6%95%B0%E5%AD%97%E6%9A%97%E5%8F%B7%E7%89%88.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const ocrApi = "http://101.126.130.186:5001/predict";

    // 延迟函数
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 找验证码图片
    function findCaptchaElement() {
        return document.querySelector(".login-code img");
    }

    // 找输入框
    function findInputBox() {
        return document.querySelector("input[placeholder='数字暗号']");
    }

    // OCR识别并填充
    function recognizeFromImg(imgElement) {
        if (!imgElement) return;

        let imgBase64 = "";
        if (imgElement.src.startsWith("data:image")) {
            imgBase64 = imgElement.src.split(",")[1];
        } else {
            console.warn("当前图片不是base64格式");
            return;
        }

        GM_xmlhttpRequest({
            method: "POST",
            url: ocrApi,
            headers: { "Content-Type": "application/json" },
            data: JSON.stringify({ image: imgBase64 }),
            onload: function (resp) {
                try {
                    const result = JSON.parse(resp.responseText);
                    console.log("OCR返回:", result);

                    if (result.success && result.data) {
                        let inputBox = findInputBox();
                        if (inputBox) {
                            inputBox.value = result.data;
                            inputBox.dispatchEvent(new Event("input", { bubbles: true }));
                            console.log("验证码已填充:", result.data);
                        } else {
                            console.warn("未找到输入框");
                        }
                    } else {
                        console.warn("识别失败:", result.msg);
                    }
                } catch (e) {
                    console.error("解析OCR结果失败:", e);
                }
            },
            onerror: function (err) {
                console.error("OCR请求出错:", err);
            }
        });
    }

    // 主逻辑：等待验证码图片出现
    async function run() {
        for (let i = 0; i < 20; i++) {
            const captchaImg = findCaptchaElement();
            if (captchaImg) {
                console.log("找到验证码图片，开始识别...");
                recognizeFromImg(captchaImg);

                // 监听图片src变化（刷新验证码时自动识别）
                const observer = new MutationObserver(() => {
                    console.log("验证码刷新，重新识别...");
                    recognizeFromImg(captchaImg);
                });
                observer.observe(captchaImg, { attributes: true, attributeFilter: ["src"] });
                return;
            }
            await sleep(500);
        }
        console.warn("超时：未找到验证码图片");
    }

    window.addEventListener("load", run);
})();
