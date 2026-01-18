// ==UserScript==
// @name         强智查成绩
// @version      v1.2.3
// @description  强制查强智教务课程成绩(平时+期末)
// @author       Ekmope
// @match        *://*.edu.cn/*
// @grant        none
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAANgSURBVDhPdZNPbFp1AMc/Px4PHjwKtBAGlG5l/be2abvETOs0XWIWTZ0x/klNM6/Gi95msmhi4sXEiyc9GA+emnjWxOzmNp11NUK3tbV1/QP0D6y0wIP3Ho8y4HmacQe/588n+Vy+gv/ZtW/uz4R0t9U3ovgf7Gnh0XhzceXer+bRdt65sPBl8Qknntbg7t2N5PpO5ZPtQv296edGyOc1wgHJbtoevIptG5r++tU3Jn96wktP63Dx8rsfLi7tfvTH0gH3Uhn7l5/XyeQ0cTriFH39Ee6vld4cnn47++fNhRX+W3D92vXPBpJJtaX0puokPj7UxORqah0XTXsoGWcrt4fX4xHzVy+wtqJbRk28/Pmn5++IL96fC3QrBLal5O8XnpmMh0KnOGx20yFA+kGRjmnar74wylIqw+3VbTFwNsxAf5CyZRudZmpC0h3RH3fqyteGHe5y+Ptxdsm45A5apUZfrAtD10WPqyLioY6wGjLFikkmV2GoT3VZ5eqU5I6MfYBHToydn6Ercg6X4kMWXmqaQnG/RDzeg9Gs0HErOLsDIHnxutvsFSrYOEtOxdttSu4QZ04PUzgqE/RFsIAuv0Q8GmEqIVN3TGLWqtg5C8PdwNWj4nYFeXSU1x2KdFKfGp/A7/Mwce4MwinQhQuzdYJWKpIpWJS0Bqoio1ePqQE303vk83VUV68lBaPJ1xpmZcLriyIrAVq2jFOS8WBQrbWIhyP8lSmQXs3i6YlSKMvoRo3VhykW73yfdlx5a94YGX+eK69cZPfgb5ydKoZeZb/cotFRiSYiVBohdgpBTtoCn3yEOMlR17ZQAjHDEQsOW4X9Bj/c+I2AGuLRkcl6epNiNs/a8hqH+W3mpx2YtorRkqnUPYRiAyTPTlIrW6bj2+++qu2XCqQ2dDSjDbTo9PaSzpSJ9vmQ29Djl4n1G1idFo9PBDubh8RO9eGWqUuBQNezdb14+XGzzXH5gIqlkUhEEJ0G77z0IolQA6/HzcryQwrONk1LwzzOsb9fxNB3bgjCp2NuhzquhkbxqU56Ygkxc+kSe3mIh1TGemWRr5qUiyU2CmVKuzkR8dfZyjao6RurYm5uTlpe1p0MDjE4NPvvqbY2NxmcnWV2CNKHB6IfuJXNQhay2Sz9wG1utf4B4ySDt2sn0mgAAAAASUVORK5CYII=
// @namespace https://greasyfork.org/users/1561324
// @downloadURL https://update.greasyfork.org/scripts/562981/%E5%BC%BA%E6%99%BA%E6%9F%A5%E6%88%90%E7%BB%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/562981/%E5%BC%BA%E6%99%BA%E6%9F%A5%E6%88%90%E7%BB%A9.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const modifyResponse = xhr => {
        try {
            const data = JSON.parse(xhr.responseText);
            if (data) data.isXsckpscj = true;

            Object.defineProperties(xhr, {
                responseText: { get: () => JSON.stringify(data) },
                response: { get: () => data }
            });
        } catch (_) {}
    };

    const OriginalXHR = window.XMLHttpRequest;

    window.XMLHttpRequest = function () {
        const xhr = new OriginalXHR();
        const originalOpen = xhr.open;

        xhr.open = function (method, url) {
            if (url.includes('/jsxsd/kscj/cjcx_list')) {
                const originalSend = xhr.send;

                xhr.send = function (body) {
                    const originalOnload = xhr.onload;
                    xhr.onload = e => {
                        modifyResponse(xhr);
                        originalOnload?.call(this, e);
                    };

                    const originalOnReadyStateChange = xhr.onreadystatechange;
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState === 4) modifyResponse(xhr);
                        originalOnReadyStateChange?.apply(this, arguments);
                    };

                    originalSend.call(this, body);
                };
            }

            originalOpen.apply(this, arguments);
        };

        return xhr;
    };
})();