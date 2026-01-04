// ==UserScript==
// @name         [Bcat] Voucher Wallet Data Interceptor
// @namespace    http://tampermonkey.net/
// @version      1.9.4
// @description  Giữ chèn UI vào head, dùng CSS để ghi đè và thêm cơ chế khóa để tránh gửi trùng lặp.
// @author       You
// @match        https://shopee.vn/user/voucher-wallet*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/556855/%5BBcat%5D%20Voucher%20Wallet%20Data%20Interceptor.user.js
// @updateURL https://update.greasyfork.org/scripts/556855/%5BBcat%5D%20Voucher%20Wallet%20Data%20Interceptor.meta.js
// ==/UserScript==

(function () {
    "use strict";
    console.log("[MAIN SCRIPT] Bắt đầu thiết lập cầu nối postMessage...");

    // ================== CẤU HÌNH ==================
    const DESTINATION_URL = "https://voucher.shopeeanalytics.com/vn/process/inport_voucher.php";

    // ================== TRẠNG THÁI TOÀN CỤC ==================
    let isSending = false; // Cờ để ngăn việc gửi trùng lặp

    // ================== THÊM CSS GHI ĐỀ ==================
    function injectCustomStyles() {
        const style = document.createElement("style");
        style.type = "text/css";
        style.innerHTML = `
            head {display: block !important;}
            #voucher-interceptor-status {
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
            }
        `;
        (document.head || document.documentElement).appendChild(style);
        console.log("[MAIN SCRIPT] Đã chèn CSS tùy chỉnh để ghi đè.");
    }
    injectCustomStyles();

    // ================== GIAO DIỆN NGƯỜI DÙNG (UI) ==================
    let statusDisplay, stepDisplay;

    function createStatusUI() {
        if (document.getElementById("voucher-interceptor-status")) return;
        const container = document.createElement("div");
        container.id = "voucher-interceptor-status";
        container.style.position = "fixed";
        container.style.top = "10px";
        container.style.right = "10px";
        container.style.zIndex = "9999";
        container.style.padding = "10px 15px";
        container.style.backgroundColor = "#ee4d2d";
        container.style.color = "white";
        container.style.borderRadius = "4px";
        container.style.fontSize = "14px";
        container.style.fontFamily = "Arial, sans-serif";
        container.style.boxShadow = "0 2px 10px rgba(0,0,0,0.3)";
        container.style.minWidth = "250px";

        stepDisplay = document.createElement("div");
        stepDisplay.style.fontSize = "12px";
        stepDisplay.style.opacity = "0.8";
        stepDisplay.textContent = "[Bước 0/4] Khởi động...";

        statusDisplay = document.createElement("div");
        statusDisplay.style.marginTop = "5px";
        statusDisplay.textContent = "Script đang khởi động...";

        container.appendChild(stepDisplay);
        // container.appendChild(statusDisplay);
        (document.head || document.documentElement).appendChild(container);
    }

    function updateStatus(step, message, isError = false) {
        if (statusDisplay && stepDisplay) {
            statusDisplay.textContent = message;
            if (step !== null) {
                stepDisplay.textContent = `[Bước ${step}/4] ${message}`;
            } else {
                stepDisplay.textContent = message;
            }
            const container = document.getElementById("voucher-interceptor-status");
            if (container) {
                container.style.backgroundColor = isError ? "#d32f2f" : "#ee4d2d";
            }
        }
        console.log(`[MAIN SCRIPT] ${message}`);
    }

    // ================== LOGIC GỬI DỮ LIỆU (ĐÃ CẬP NHẬT) ==================

    function sendDataToServer(data) {
        // Nếu đang gửi, bỏ qua yêu cầu mới
        if (isSending) {
            console.log("[MAIN SCRIPT] Đang gửi, bỏ qua yêu cầu trùng lặp.");
            return;
        }
        isSending = true; // Đặt cờ là đang gửi

        const resetSendingFlag = () => {
            isSending = false;
            console.log("[MAIN SCRIPT] Đã reset cờ gửi. Sẵn sàng cho yêu cầu mới.");
        };

        updateStatus(3, "Đã lấy dữ liệu. Đang gửi đến server...");
        try {
            const jsonDataString = JSON.stringify(data, null, 2);
            const payload = "text=" + encodeURIComponent(jsonDataString);

            GM_xmlhttpRequest({
                method: "POST",
                url: DESTINATION_URL,
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                data: payload,
                onload: function (response) {
                    if (response.status >= 200 && response.status < 300) {
                        console.log("Kết quả từ server:", response.responseText);
                        updateStatus(null, "✅ Gửi danh sách voucher thành công!");
                    } else {
                        console.error(`Lỗi server: ${response.status} ${response.statusText}`);
                        updateStatus(null, `❌ Gửi thất bại: Lỗi server ${response.status}`, true);
                    }
                    resetSendingFlag(); // Reset cờ khi hoàn thành
                },
                onerror: function (response) {
                    console.error("Lỗi khi gửi dữ liệu (Lỗi mạng):", response);
                    updateStatus(null, "❌ Gửi thất bại: Lỗi mạng.", true);
                    resetSendingFlag(); // Reset cờ khi có lỗi
                },
            });
        } catch (e) {
            console.error("[MAIN SCRIPT] Lỗi nghiêm trọng khi gửi:", e);
            updateStatus(null, `❌ Lỗi script: ${e.message}`, true);
            resetSendingFlag(); // Reset cờ khi có exception
        }
    }

    // ================== LẮNG NGHE TIN NHẮN ==================

    window.addEventListener("message", function (event) {
        if (event.data.type && event.data.type === "VOUCHER_DATA_FROM_PAGE") {
            console.log("[MAIN SCRIPT] >>> Nhận được tin nhắn đúng loại! Gọi sendDataToServer...");
            sendDataToServer(event.data.payload);
        }
        if (event.data.type && event.data.type === "INTERCEPTOR_STATUS") {
            updateStatus(event.data.step, event.data.payload);
        }
    });
    console.log("[MAIN SCRIPT] Đã thiết lập lắng nghe postMessage.");

    // ================== MÃ TIÊM VÀO TRANG ==================

    const scriptContent = `
        (function() {
            'use strict';
            console.log('[INJECTED SCRIPT] Mã tiêm đã sẵn sàng!');
            const TARGET_API_PATTERN = '/api/v2/voucher_wallet/get_user_voucher_list';

            const originalFetch = window.fetch;
            window.fetch = function(...args) {
                const [resource, config] = args;
                const url = resource.toString();

                if (url.includes(TARGET_API_PATTERN)) {
                    console.log('[INJECTED SCRIPT] >>> Bắt được target URL! Gửi qua postMessage...');
                    window.postMessage({
                        type: 'INTERCEPTOR_STATUS',
                        step: 2,
                        payload: 'Đã chặn được request API voucher.'
                    }, '*');

                    const promise = originalFetch.apply(this, args);
                    promise.then(response => {
                        const clonedResponse = response.clone();
                        clonedResponse.json().then(data => {
                            window.postMessage({
                                type: 'VOUCHER_DATA_FROM_PAGE',
                                payload: data
                            }, '*');
                        });
                    });
                }
                return originalFetch.apply(this, args);
            };
        })();
    `;

    const script = document.createElement("script");
    script.textContent = scriptContent;
    script.type = "text/javascript";
    (document.head || document.documentElement).appendChild(script);
    console.log("[MAIN SCRIPT] Mã chặn đã được tiêm vào trang.");

    // ================== KHỞI TẠO ==================
    function init() {
        createStatusUI();
        updateStatus(1, "Đã sẵn sàng. Đang chờ tải voucher...");
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
