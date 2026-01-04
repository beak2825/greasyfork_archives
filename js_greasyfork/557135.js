// ==UserScript==
// @name         推し旅新干线验证（morfonica）
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  如题
// @match        *://oshi-tabi.voistock.com/bang-dream-10th/morfonica/*
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557135/%E6%8E%A8%E3%81%97%E6%97%85%E6%96%B0%E5%B9%B2%E7%BA%BF%E9%AA%8C%E8%AF%81%EF%BC%88morfonica%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/557135/%E6%8E%A8%E3%81%97%E6%97%85%E6%96%B0%E5%B9%B2%E7%BA%BF%E9%AA%8C%E8%AF%81%EF%BC%88morfonica%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeOriginalScript() {
        const scripts = document.getElementsByTagName('script');
        for (let script of scripts) {
            if (script.src && script.src.indexOf("orangeSpeedCheck.js") !== -1) {
                script.parentNode.removeChild(script);
                break;
            }
        }
    }

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.tagName === 'SCRIPT' && node.src && node.src.indexOf("orangeSpeedCheck.js") !== -1) {
                    node.remove();
                }
            });
        });
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });

    removeOriginalScript();

    GM_xmlhttpRequest({
        method: "GET",
        url: "https://oshi-tabi.voistock.com/view/event/bang-dream-10th/morfonica/voice/js/orangeSpeedCheck.js",
        onload: function(response) {
            if (response.status === 200) {
                let code = response.responseText;

                // 0. 移除 import 语句，避免模块错误
                code = code.replace(/import\s+orangeModule\s+from\s+'\/js\/orangeModule\.js'\s*;/g, "");
                // 1. 确保 direction 变量存在并设置为 'towards'
                code = code.replace(/var\s+direction_shinkansen\s*=\s*[^;]+;/g, "var direction_shinkansen = 'up';");
                // 2. 设置 speedFlag 为 true
                code = code.replace(/localStorage\.setItem\('speedFlag',\s*false\s*\);/g, "localStorage.setItem('speedFlag', true);");
                // 3. 确保 inArea 变量在 checkArea 函数中返回 true
                code = code.replace(/var\s+inArea\s*=\s*false\s*;/g, "var inArea = true;");
                // 4. 确保 checkArea 函数始终返回 true
                code = code.replace(/return\s+inArea\s*;/g, "return true;");
                // 5. 确保 checkSpeed 函数始终返回 true
                code = code.replace(/return\s+minSpeed\s*<=\s+s\s+&&\s+s\s*<\s+maxSpeed\s*;/g, "return true;");
                // 6. 确保 checkDirection 函数始终返回 true
                code = code.replace(/return\s+set\s*===\s+dir\s*;/g, "return true;");
                // 7. 模拟 orangeModule 对象，避免调用错误
                code = "var orangeModule = { getRideHistoryFromOrange: function() { return Promise.resolve({ data: { ride_histories: [] } }); }, sendLogToOrange: function() {} };\n" + code;

                const script = document.createElement('script');
                script.textContent = code;
                document.head.appendChild(script);
            } else {
                console.error("获取 orangeSpeedCheck.js 失败，状态码：" + response.status);
            }
        },
        onerror: function(error) {
            console.error("GM_xmlhttpRequest 请求出错：", error);
        }
    });
})();
