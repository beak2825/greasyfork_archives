// ==UserScript==
// @name         [Bcat] Affiliate Info Data Interceptor
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  Có auto-scroll để tự động lấy data mới
// @author       You
// @match        https://banhang.shopee.vn/portal/web-seller-affiliate/kol_marketplace
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/562354/%5BBcat%5D%20Affiliate%20Info%20Data%20Interceptor.user.js
// @updateURL https://update.greasyfork.org/scripts/562354/%5BBcat%5D%20Affiliate%20Info%20Data%20Interceptor.meta.js
// ==/UserScript==

(function () {
    "use strict";
    console.log("[MAIN SCRIPT] ===== BẮT ĐẦU SCRIPT =====");

    // ================== CẤU HÌNH ==================
    const DESTINATION_URL = "https://addlivetag.com/api/input-affiliate-info.php";

    // ================== TRẠNG THÁI TOÀN CỤC ==================
    let isSending = false;
    let autoScrollEnabled = false;

    // ================== THÊM CSS GHI ĐỀ ==================
    function injectCustomStyles() {
        const style = document.createElement("style");
        style.type = "text/css";
        style.innerHTML = `
            head {display: block !important;}
            #affiliate-interceptor-status {
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
            }
        `;
        (document.head || document.documentElement).appendChild(style);
        console.log("[MAIN SCRIPT] ✓ Đã chèn CSS");
    }
    injectCustomStyles();

    // ================== GIAO DIỆN NGƯỜI DÙNG (UI) ==================
    let statusDisplay, stepDisplay, autoScrollBtn;

    function createStatusUI() {
        if (document.getElementById("affiliate-interceptor-status")) return;
        const container = document.createElement("div");
        container.id = "affiliate-interceptor-status";
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

        // Nút Auto Scroll
        autoScrollBtn = document.createElement("button");
        autoScrollBtn.textContent = "🔄 Auto Scroll: OFF";
        autoScrollBtn.style.marginTop = "10px";
        autoScrollBtn.style.padding = "5px 10px";
        autoScrollBtn.style.backgroundColor = "#fff";
        autoScrollBtn.style.color = "#ee4d2d";
        autoScrollBtn.style.border = "none";
        autoScrollBtn.style.borderRadius = "3px";
        autoScrollBtn.style.cursor = "pointer";
        autoScrollBtn.style.fontSize = "12px";
        autoScrollBtn.style.fontWeight = "bold";
        autoScrollBtn.style.width = "100%";

        autoScrollBtn.addEventListener("click", function() {
            autoScrollEnabled = !autoScrollEnabled;
            autoScrollBtn.textContent = autoScrollEnabled ? "🔄 Auto Scroll: ON" : "🔄 Auto Scroll: OFF";
            autoScrollBtn.style.backgroundColor = autoScrollEnabled ? "#4caf50" : "#fff";
            autoScrollBtn.style.color = autoScrollEnabled ? "#fff" : "#ee4d2d";
            console.log("[MAIN SCRIPT] Auto Scroll:", autoScrollEnabled ? "BẬT" : "TẮT");
        });

        container.appendChild(stepDisplay);
        container.appendChild(autoScrollBtn);
        (document.head || document.documentElement).appendChild(container);
        console.log("[MAIN SCRIPT] ✓ Đã tạo UI");
    }

    function updateStatus(step, message, isError = false) {
        if (statusDisplay && stepDisplay) {
            statusDisplay.textContent = message;
            if (step !== null) {
                stepDisplay.textContent = `[Bước ${step}/4] ${message}`;
            } else {
                stepDisplay.textContent = message;
            }
            const container = document.getElementById("affiliate-interceptor-status");
            if (container) {
                container.style.backgroundColor = isError ? "#d32f2f" : "#ee4d2d";
            }
        }
        console.log(`[MAIN SCRIPT] ${message}`);
    }

    // ================== LOGIC AUTO SCROLL ==================

    function scrollToBottom() {
        console.log("[MAIN SCRIPT] 📜 Đang cuộn xuống cuối trang...");
        updateStatus(1, "📜 Đang cuộn xuống để load thêm data...");

        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth'
        });

        // Đợi 2 giây để trang load thêm data
        setTimeout(() => {
            console.log("[MAIN SCRIPT] ✓ Đã cuộn xong, chờ load data mới...");
            updateStatus(1, "Đã sẵn sàng. Đang chờ tải affiliate...");
        }, 2000);
    }

    // ================== LOGIC GỬI DỮ LIỆU ==================

    function sendDataToServer(data) {
        if (isSending) {
            console.log("[MAIN SCRIPT] ⚠ Đang gửi, bỏ qua yêu cầu trùng lặp.");
            return;
        }
        isSending = true;

        const resetSendingFlag = () => {
            isSending = false;
            console.log("[MAIN SCRIPT] ✓ Đã reset cờ gửi");
        };

        updateStatus(3, "Đã lấy dữ liệu. Đang gửi đến server...");
        console.log("[MAIN SCRIPT] Data to send:", data);

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
                        console.log("✓ Kết quả từ server:", response.responseText);
                        updateStatus(4, "✅ Gửi danh sách affiliate thành công!");

                        // Auto scroll nếu được bật
                        if (autoScrollEnabled) {
                            setTimeout(() => {
                                scrollToBottom();
                            }, 1500); // Đợi 1.5 giây sau khi gửi thành công
                        }
                    } else {
                        console.error(`✗ Lỗi server: ${response.status} ${response.statusText}`);
                        updateStatus(null, `❌ Gửi thất bại: Lỗi server ${response.status}`, true);
                    }
                    resetSendingFlag();
                },
                onerror: function (response) {
                    console.error("✗ Lỗi khi gửi dữ liệu (Lỗi mạng):", response);
                    updateStatus(null, "❌ Gửi thất bại: Lỗi mạng.", true);
                    resetSendingFlag();
                },
            });
        } catch (e) {
            console.error("[MAIN SCRIPT] ✗ Lỗi nghiêm trọng khi gửi:", e);
            updateStatus(null, `❌ Lỗi script: ${e.message}`, true);
            resetSendingFlag();
        }
    }

    // ================== LẮNG NGHE TIN NHẮN ==================

    window.addEventListener("message", function (event) {
        if (event.data.type && event.data.type === "AFFILIATE_DATA_FROM_PAGE") {
            console.log("[MAIN SCRIPT] >>> ✓ Nhận được AFFILIATE_DATA_FROM_PAGE!");
            sendDataToServer(event.data.payload);
        }
        if (event.data.type && event.data.type === "INTERCEPTOR_STATUS") {
            updateStatus(event.data.step, event.data.payload);
        }
    });
    console.log("[MAIN SCRIPT] ✓ Đã thiết lập lắng nghe postMessage");

    // ================== MÃ TIÊM VÀO TRANG ==================

    const scriptContent = `
        (function() {
            'use strict';
            console.log('[INJECTED] ===== BẮT ĐẦU HOOK =====');

            // Pattern để match URL
            const TARGET_PATTERNS = [
                'affiliateplatform/creator/list',
                '/api/v3/affiliateplatform/creator/list'
            ];

            // Hàm check URL có match không
            function isTargetURL(url) {
                return TARGET_PATTERNS.some(pattern => url.includes(pattern));
            }

            // ============ HOOK FETCH API ============
            const originalFetch = window.fetch;
            window.fetch = function(...args) {
                const [resource, config] = args;
                const url = resource.toString();

                if (isTargetURL(url)) {
                    console.log('[INJECTED] 🎯 BINGO! Bắt được FETCH request!');
                    console.log('[INJECTED] URL:', url);
                    console.log('[INJECTED] Method:', config?.method || 'GET');

                    window.postMessage({
                        type: 'INTERCEPTOR_STATUS',
                        step: 2,
                        payload: 'Đã chặn được request API affiliate (Fetch).'
                    }, '*');

                    const promise = originalFetch.apply(this, args);

                    promise.then(response => {
                        console.log('[INJECTED] ✓ Response nhận được, status:', response.status);
                        const clonedResponse = response.clone();

                        clonedResponse.json()
                            .then(data => {
                                console.log('[INJECTED] ✓ Đã parse JSON thành công!');
                                console.log('[INJECTED] Data:', data);

                                window.postMessage({
                                    type: 'AFFILIATE_DATA_FROM_PAGE',
                                    payload: data
                                }, '*');
                                console.log('[INJECTED] ✓ Đã gửi data qua postMessage!');
                            })
                            .catch(err => {
                                console.error('[INJECTED] ✗ Lỗi parse JSON:', err);
                            });
                    }).catch(err => {
                        console.error('[INJECTED] ✗ Lỗi fetch:', err);
                    });

                    return promise;
                }

                return originalFetch.apply(this, args);
            };

            // ============ HOOK XMLHttpRequest ============
            const originalXHROpen = XMLHttpRequest.prototype.open;
            const originalXHRSend = XMLHttpRequest.prototype.send;

            XMLHttpRequest.prototype.open = function(method, url, ...rest) {
                this._method = method;
                this._url = url;
                this._isTargetRequest = isTargetURL(url);

                if (this._isTargetRequest) {
                    console.log('[INJECTED] 🎯 BINGO! Bắt được XHR request!');
                    console.log('[INJECTED] URL:', url);
                    console.log('[INJECTED] Method:', method);

                    window.postMessage({
                        type: 'INTERCEPTOR_STATUS',
                        step: 2,
                        payload: 'Đã chặn được request API affiliate (XHR).'
                    }, '*');
                }

                return originalXHROpen.apply(this, [method, url, ...rest]);
            };

            XMLHttpRequest.prototype.send = function(body) {
                if (this._isTargetRequest) {
                    console.log('[INJECTED] 📤 XHR send được gọi, đang setup listener...');

                    const self = this;
                    const originalOnReadyStateChange = this.onreadystatechange;

                    this.onreadystatechange = function() {
                        if (this.readyState === 4 && this.status === 200) {
                            console.log('[INJECTED] ✓ XHR completed, readyState:', this.readyState);
                            try {
                                const data = JSON.parse(this.responseText);
                                console.log('[INJECTED] ✓ XHR Data parsed:', data);

                                console.log('[INJECTED] 📨 Attempting to send postMessage...');
                                window.postMessage({
                                    type: 'AFFILIATE_DATA_FROM_PAGE',
                                    payload: data
                                }, '*');
                                console.log('[INJECTED] ✓ PostMessage sent!');
                            } catch (err) {
                                console.error('[INJECTED] ✗ Lỗi parse XHR response:', err);
                            }
                        }

                        if (originalOnReadyStateChange) {
                            originalOnReadyStateChange.apply(this, arguments);
                        }
                    };
                }

                return originalXHRSend.apply(this, arguments);
            };

            console.log('[INJECTED] ✓ Đã hook cả Fetch và XHR!');
            console.log('[INJECTED] ✓ Đang chờ request chứa:', TARGET_PATTERNS);
        })();
    `;

    const script = document.createElement("script");
    script.textContent = scriptContent;
    script.type = "text/javascript";
    (document.head || document.documentElement).appendChild(script);
    console.log("[MAIN SCRIPT] ✓ Mã chặn đã được tiêm");

    // ================== KHỞI TẠO ==================
    function init() {
        createStatusUI();
        updateStatus(1, "Đã sẵn sàng. Đang chờ tải affiliate...");
        console.log("[MAIN SCRIPT] ✓ Khởi tạo hoàn tất");
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

    console.log("[MAIN SCRIPT] ===== SCRIPT ĐÃ THIẾT LẬP XONG =====");
})();
