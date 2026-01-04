// ==UserScript==
// @name           Facebook & Instagram - Chặn "Đã xem" Story
// @name:en        Facebook & Instagram - Block "Seen" Story
// @namespace      http://tampermonkey.net/
// @version        2025.08.15
// @description    Chặn "Đã xem" story (Facebook, Instagram). Có menu để bật/tắt.
// @description:en Blocks "Seen" for stories (Facebook, Instagram). With a toggle menu.
// @author         King1x32
// @match          https://*.facebook.com/*
// @match          https://*.messenger.com/*
// @match          https://*.instagram.com/*
// @grant          unsafeWindow
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_registerMenuCommand
// @run-at         document-start
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/547714/Facebook%20%20Instagram%20-%20Ch%E1%BA%B7n%20%22%C4%90%C3%A3%20xem%22%20Story.user.js
// @updateURL https://update.greasyfork.org/scripts/547714/Facebook%20%20Instagram%20-%20Ch%E1%BA%B7n%20%22%C4%90%C3%A3%20xem%22%20Story.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- PHẦN 1: CẤU HÌNH VÀ LƯU/TẢI TRẠNG THÁI ---

    // Đối tượng để lưu trữ tất cả các cài đặt
    let config = {};

    // Hàm tải cấu hình từ bộ nhớ của userscript
    function loadConfig() {
        config = {
            // Mặc định bật tất cả khi người dùng cài lần đầu
            blockFbStorySeen: GM_getValue('blockFbStorySeen', true),
            blockInstaStorySeen: GM_getValue('blockInstaStorySeen', true),
        };
    }

    // Hàm lưu một cài đặt cụ thể
    function saveConfig(key, value) {
        GM_setValue(key, value);
        loadConfig(); // Tải lại cấu hình sau khi lưu
    }

    // Tải cấu hình ngay khi script bắt đầu
    loadConfig();

    // --- PHẦN 2: ĐĂNG KÝ MENU CÀI ĐẶT ---

    // Hàm tạo các nút trong menu của Violentmonkey/Tampermonkey
    function registerMenuCommands() {
        const toggle = (key, name) => {
            const currentState = config[key];
            const stateIcon = currentState ? '✅' : '❌';
            GM_registerMenuCommand(`${stateIcon} ${name}`, () => {
                saveConfig(key, !currentState);
                alert(`Đã ${!currentState ? 'bật' : 'tắt'} tính năng "${name}".\nVui lòng tải lại trang để áp dụng thay đổi.`);
                location.reload();
            });
        };

        toggle('blockFbStorySeen', 'Chặn "Đã xem" Story Facebook');
        toggle('blockInstaStorySeen', 'Chặn "Đã xem" Story Instagram');
    }

    registerMenuCommands();


    // --- PHẦN 3: LOGIC CHẶN (ÁP DỤNG CẤU HÌNH) ---

    // --- AJAX-HOOK (Dành cho Story Facebook & Instagram) ---
    const hook = function(configs = []) {
        const unsubFn = [];
        for (const { fn, arr } of configs) {
            if (typeof fn !== "function" || !Array.isArray(arr)) continue;
            const id = Math.random().toString(36).slice(2);
            arr.push({ fn, id });
            unsubFn.push(() => {
                const index = arr.findIndex((e) => e.id === id);
                if (index !== -1) arr.splice(index, 1);
            });
        }
        return () => {
            unsubFn.forEach((fn) => fn?.());
        };
    }

    const onBeforeOpenXHRFn = [];
    const onBeforeSendXHRFn = [];
    const onAfterSendXHRFn = [];
    let readyXhr = false;

    function initXhr() {
        const orig = unsafeWindow.XMLHttpRequest;
        unsafeWindow.XMLHttpRequest = new Proxy(orig, {
            construct(target, args) {
                const instance = new target(...args);
                let p;

                const open = instance.open;
                instance.open = async function(method, url, async, user, password) {
                    p = { method, url, async, user, password };
                    for (const { fn } of onBeforeOpenXHRFn) {
                        try {
                            const res = await fn?.(p);
                            if (res) p = res;
                            if (res === null) return;
                        } catch (e) {
                            console.error("Userscript Error in onBeforeOpenXHR:", e);
                        }
                    }
                    return open.apply(this, [p.method, p.url, p.async, p.user, p.password]);
                };

                const send = instance.send;
                instance.send = async function(dataSend) {
                    for (const { fn } of onBeforeSendXHRFn) {
                        try {
                            const res = await fn?.(p, dataSend);
                            if (res !== undefined) dataSend = res;
                            if (dataSend === null) return;
                        } catch (e) {
                            console.error("Userscript Error in onBeforeSendXHR:", e);
                        }
                    }

                    instance.addEventListener("load", function() {
                        for (const { fn } of onAfterSendXHRFn)
                            try {
                                fn?.(p, dataSend, instance.response);
                            } catch (e) {
                                console.error("Userscript Error in onAfterSendXHR:", e);
                            }
                    });

                    return send.apply(this, arguments);
                };
                return instance;
            },
        });
    }

    const hookXHR = function({ onBeforeOpen, onBeforeSend, onAfterSend } = {}) {
        if (!readyXhr) {
            initXhr();
            readyXhr = true;
        }
        return hook([
            { fn: onBeforeOpen, arr: onBeforeOpenXHRFn },
            { fn: onBeforeSend, arr: onBeforeSendXHRFn },
            { fn: onAfterSend, arr: onAfterSendXHRFn },
        ]);
    }

    try {
        // Kích hoạt chặn cho Story Facebook và Instagram
        hookXHR({
            onBeforeSend: (p, dataSend) => {
                if (p.method !== "POST") return dataSend;
                const payloadString = dataSend?.toString?.();
                if (!payloadString) return dataSend;

                // Logic cho Facebook Story
                if (config.blockFbStorySeen && payloadString.includes("storiesUpdateSeenStateMutation")) {
                    console.log("ĐÃ CHẶN YÊU CẦU 'ĐÃ XEM' STORY FACEBOOK (theo cài đặt).");
                    return null;
                }

                // Logic cho Instagram Story
                if (config.blockInstaStorySeen && (payloadString.includes("viewSeenAt") || payloadString.includes("SeenMutation"))) {
                    console.log("ĐÃ CHẶN YÊU CẦU 'ĐÃ XEM' STORY INSTAGRAM (theo cài đặt).");
                    return null;
                }

                return dataSend;
            },
        });

    } catch (error) {
        console.error("Userscript đã gặp lỗi:", error);
    }

})();
