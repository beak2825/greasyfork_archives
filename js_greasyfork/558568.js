// ==UserScript==
// @name         simpcity 体验优化
// @namespace    http://fxxkads.xxx/
// @license      WTFPL
// @version      0.0.3
// @description  欺骗广告组件，避免 simpcity 论坛及论坛中常用的 saint.to 视频组件出现点击广告弹出。
// @author       underbed
// @match        https://simpcity.cr/*
// @match        https://*.simpcity.cr/*
// @match        https://simpcity.su/*
// @match        https://*.simpcity.su/*
// @match        https://simpcity.is/*
// @match        https://*.simpcity.is/*
// @match        https://simpcity.cz/*
// @match        https://*.simpcity.cz/*
// @match        https://simpcity.hk/*
// @match        https://*.simpcity.hk/*
// @match        https://simpcity.rs/*
// @match        https://*.simpcity.rs/*
// @match        https://simpcity.ax/*
// @match        https://*.simpcity.ax/*
// @match        https://saint2.su/*
// @match        https://*.saint2.su/*
// @match        https://saint2.to/*
// @match        https://*.saint2.to/*
// @match        https://saint2.cr/*
// @match        https://*.saint2.cr/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=simpcity.cr
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/558568/simpcity%20%E4%BD%93%E9%AA%8C%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/558568/simpcity%20%E4%BD%93%E9%AA%8C%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==
 
(function () {
    "use strict";

    ((win) => {
        const __KEY_PREFIX_PPU__ = "__PPU_SESSION";
        const __VALUE_PPU__ = "0|4000000000001|1|4000000000000|1|0|0";
        const __native_sessionStorage = win.sessionStorage;
        win.__native_sessionStorage = __native_sessionStorage; // 保留原生 sessionStorage

        class HijackAdsDataSessionStorage {
            get length() {
                return __native_sessionStorage.length;
            }

            key(index) {
                return __native_sessionStorage.key(index);
            }

            getItem(keyName) {
                return __native_sessionStorage.getItem(keyName);
            }

            setItem(keyName, keyValue) {
                if (keyName.startsWith(__KEY_PREFIX_PPU__)) {
                    keyValue = __VALUE_PPU__;
                    console.log(`[油猴] sessionStorage 设置了: ${keyName} = ${keyValue}`);
                }
                __native_sessionStorage.setItem(keyName, keyValue);
            }

            removeItem(keyName) {
                __native_sessionStorage.removeItem(keyName);
            }

            clear() {
                __native_sessionStorage.clear();
            }
        }

        const hijackAdsDataSessionStorage = new HijackAdsDataSessionStorage();

        Object.defineProperty(win, "sessionStorage", {
            value: hijackAdsDataSessionStorage,
            writable: true,
        });
    })(window);

    if (window.location.href.includes("saint2")) {
        console.log(`[油猴] 页面元素插入方法注入`);
        const originalAppendChild = Node.prototype.appendChild;
        Node.prototype.appendChild = function (childNode) {
            if ("data-cl-overlay" in childNode.attributes) {
                childNode.style.display = "none";
                console.log("将 overlay 修改为不可见", childNode);
            }
            const result = originalAppendChild.call(this, childNode);
            return result;
        };
    }
})();