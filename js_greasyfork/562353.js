// ==UserScript==
// @name         [Bcat] Affiliate Detail Auto Crawler
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  Tự động crawl affiliate detail với auto-next feature
// @author       You
// @match        https://banhang.shopee.vn/portal/web-seller-affiliate/kol_marketplace/detail?affiliate_id=*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/562353/%5BBcat%5D%20Affiliate%20Detail%20Auto%20Crawler.user.js
// @updateURL https://update.greasyfork.org/scripts/562353/%5BBcat%5D%20Affiliate%20Detail%20Auto%20Crawler.meta.js
// ==/UserScript==

(function () {
    "use strict";
    console.log("[AUTO CRAWLER] ===== BẮT ĐẦU SCRIPT =====");

    // ================== CẤU HÌNH ==================
    const SAVE_URL = "https://addlivetag.com/api/input-affiliate-detail.php";
    const GET_NEXT_URL = "https://addlivetag.com/api/get-affiliate-detail.php";

    // ================== TRẠNG THÁI TOÀN CỤC ==================
    let isSending = false;
    let autoCrawlEnabled = true; // Mặc định BẬT
    let currentAffiliateId = null;
    let isProcessingNext = false;

    // Lấy affiliate_id từ URL
    function getCurrentAffiliateId() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('affiliate_id');
    }

    currentAffiliateId = getCurrentAffiliateId();
    console.log("[AUTO CRAWLER] Current affiliate_id:", currentAffiliateId);

    // ================== THÊM CSS GHI ĐỀ ==================
    function injectCustomStyles() {
        const style = document.createElement("style");
        style.type = "text/css";
        style.innerHTML = `
            head {display: block !important;}
            #affiliate-detail-status {
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
            }
        `;
        (document.head || document.documentElement).appendChild(style);
        console.log("[AUTO CRAWLER] ✓ Đã chèn CSS");
    }
    injectCustomStyles();

    // ================== GIAO DIỆN NGƯỜI DÙNG (UI) ==================
    let stepDisplay, statusDisplay, autoCrawlBtn, statsDisplay;

    function createStatusUI() {
        if (document.getElementById("affiliate-detail-status")) return;
        const container = document.createElement("div");
        container.id = "affiliate-detail-status";
        container.style.position = "fixed";
        container.style.bottom = "10px";
        container.style.right = "10px";
        container.style.zIndex = "9999";
        container.style.padding = "15px";
        container.style.backgroundColor = "#1976d2";
        container.style.color = "white";
        container.style.borderRadius = "6px";
        container.style.fontSize = "14px";
        container.style.fontFamily = "Arial, sans-serif";
        container.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";
        container.style.minWidth = "280px";

        // Title
        const title = document.createElement("div");
        title.textContent = "🤖 Auto Detail Crawler";
        title.style.fontWeight = "bold";
        title.style.marginBottom = "10px";
        title.style.fontSize = "16px";

        stepDisplay = document.createElement("div");
        stepDisplay.style.fontSize = "12px";
        stepDisplay.style.opacity = "0.9";
        stepDisplay.style.marginBottom = "5px";
        stepDisplay.textContent = "Đang chờ...";

        statusDisplay = document.createElement("div");
        statusDisplay.style.fontSize = "11px";
        statusDisplay.style.opacity = "0.7";
        statusDisplay.style.marginBottom = "10px";
        statusDisplay.textContent = `ID: ${currentAffiliateId}`;

        // Stats display
        statsDisplay = document.createElement("div");
        statsDisplay.style.fontSize = "11px";
        statsDisplay.style.opacity = "0.8";
        statsDisplay.style.marginBottom = "10px";
        statsDisplay.style.padding = "5px";
        statsDisplay.style.backgroundColor = "rgba(255,255,255,0.1)";
        statsDisplay.style.borderRadius = "3px";
        statsDisplay.textContent = "Pending: ...";

        // Auto Crawl Button
        autoCrawlBtn = document.createElement("button");
        autoCrawlBtn.textContent = "🤖 Auto Crawl: ON";
        autoCrawlBtn.style.width = "100%";
        autoCrawlBtn.style.padding = "8px";
        autoCrawlBtn.style.backgroundColor = "#4caf50";
        autoCrawlBtn.style.color = "white";
        autoCrawlBtn.style.border = "none";
        autoCrawlBtn.style.borderRadius = "4px";
        autoCrawlBtn.style.cursor = "pointer";
        autoCrawlBtn.style.fontSize = "13px";
        autoCrawlBtn.style.fontWeight = "bold";
        autoCrawlBtn.style.transition = "all 0.3s";

        autoCrawlBtn.addEventListener("click", function() {
            autoCrawlEnabled = !autoCrawlEnabled;
            autoCrawlBtn.textContent = autoCrawlEnabled ? "🤖 Auto Crawl: ON" : "🤖 Auto Crawl: OFF";
            autoCrawlBtn.style.backgroundColor = autoCrawlEnabled ? "#4caf50" : "#f44336";
            console.log("[AUTO CRAWLER] Auto Crawl:", autoCrawlEnabled ? "BẬT" : "TẮT");

            if (!autoCrawlEnabled) {
                updateStatus("⏸ Auto Crawl đã tắt");
            }
        });

        container.appendChild(title);
        container.appendChild(stepDisplay);
        container.appendChild(statusDisplay);
        container.appendChild(statsDisplay);
        container.appendChild(autoCrawlBtn);

        (document.head || document.documentElement).appendChild(container);
        console.log("[AUTO CRAWLER] ✓ Đã tạo UI");
    }

    function updateStatus(message, isError = false) {
        if (stepDisplay) {
            stepDisplay.textContent = message;
            const container = document.getElementById("affiliate-detail-status");
            if (container) {
                container.style.backgroundColor = isError ? "#d32f2f" : "#1976d2";
            }
        }
        console.log(`[AUTO CRAWLER] ${message}`);
    }

    function updateStats(pending, hasMore) {
        if (statsDisplay) {
            statsDisplay.textContent = `Còn lại: ${pending} KOLs${hasMore ? ' (có tiếp...)' : ''}`;
        }
    }

    // ================== LOGIC LẤY AFFILIATE_ID TIẾP THEO ==================

    function getNextAffiliateId() {
        if (isProcessingNext) {
            console.log("[AUTO CRAWLER] Đang xử lý next, bỏ qua...");
            return;
        }

        if (!autoCrawlEnabled) {
            console.log("[AUTO CRAWLER] Auto Crawl đã tắt, không lấy next");
            updateStatus("⏸ Auto Crawl đã tắt");
            return;
        }

        isProcessingNext = true;
        updateStatus("🔍 Đang tìm KOL tiếp theo...");

        GM_xmlhttpRequest({
            method: "GET",
            url: GET_NEXT_URL + "?_=" + Date.now(), // Cache buster
            onload: function (response) {
                try {
                    const data = JSON.parse(response.responseText);
                    console.log("[AUTO CRAWLER] Next response:", data);

                    if (data.code === 0 && data.data.affiliate_id) {
                        const nextId = data.data.affiliate_id;
                        const pending = data.data.total_pending;
                        const hasMore = data.data.has_more;

                        updateStats(pending, hasMore);
                        updateStatus(`✅ Tìm thấy: ${nextId}`);

                        console.log(`[AUTO CRAWLER] Next ID: ${nextId}, Pending: ${pending}`);

                        // Đợi 2 giây rồi chuyển trang
                        setTimeout(() => {
                            updateStatus(`🔄 Đang chuyển sang ${nextId}...`);
                            const newUrl = `https://banhang.shopee.vn/portal/web-seller-affiliate/kol_marketplace/detail?affiliate_id=${nextId}`;
                            window.location.href = newUrl;
                        }, 2000);
                    } else {
                        updateStatus("✅ Đã crawl xong tất cả!");
                        updateStats(0, false);
                        console.log("[AUTO CRAWLER] Không còn affiliate_id nào cần update");
                        isProcessingNext = false;
                    }
                } catch (e) {
                    console.error("[AUTO CRAWLER] Lỗi parse response:", e);
                    updateStatus("❌ Lỗi khi lấy next ID", true);
                    isProcessingNext = false;
                }
            },
            onerror: function (response) {
                console.error("[AUTO CRAWLER] Lỗi request:", response);
                updateStatus("❌ Lỗi kết nối server", true);
                isProcessingNext = false;
            }
        });
    }

    // ================== LOGIC GỬI DỮ LIỆU ==================

    function sendDataToServer(data) {
        if (isSending) {
            console.log("[AUTO CRAWLER] ⚠ Đang gửi, bỏ qua yêu cầu trùng lặp.");
            return;
        }
        isSending = true;

        const resetSendingFlag = () => {
            isSending = false;
        };

        updateStatus("📤 Đang gửi data lên server...");
        console.log("[AUTO CRAWLER] Data to send:", data);

        try {
            const jsonDataString = JSON.stringify(data, null, 2);
            const payload = "text=" + encodeURIComponent(jsonDataString);

            GM_xmlhttpRequest({
                method: "POST",
                url: SAVE_URL,
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                data: payload,
                onload: function (response) {
                    if (response.status >= 200 && response.status < 300) {
                        console.log("✓ Kết quả từ server:", response.responseText);
                        updateStatus("✅ Đã lưu thành công!");

                        // Sau khi lưu thành công, lấy affiliate_id tiếp theo
                        setTimeout(() => {
                            if (autoCrawlEnabled) {
                                getNextAffiliateId();
                            } else {
                                updateStatus("⏸ Auto Crawl đã tắt");
                            }
                        }, 1500);
                    } else {
                        console.error(`✗ Lỗi server: ${response.status} ${response.statusText}`);
                        updateStatus(`❌ Lỗi ${response.status}`, true);
                    }
                    resetSendingFlag();
                },
                onerror: function (response) {
                    console.error("✗ Lỗi khi gửi dữ liệu:", response);
                    updateStatus("❌ Lỗi mạng", true);
                    resetSendingFlag();
                },
            });
        } catch (e) {
            console.error("[AUTO CRAWLER] ✗ Lỗi nghiêm trọng:", e);
            updateStatus(`❌ ${e.message}`, true);
            resetSendingFlag();
        }
    }

    // ================== LẮNG NGHE TIN NHẮN ==================

    window.addEventListener("message", function (event) {
        if (event.data.type && event.data.type === "AFFILIATE_DETAIL_FROM_PAGE") {
            console.log("[AUTO CRAWLER] >>> ✓ Nhận được AFFILIATE_DETAIL_FROM_PAGE!");
            sendDataToServer(event.data.payload);
        }
        if (event.data.type && event.data.type === "DETAIL_STATUS") {
            updateStatus(event.data.payload);
        }
    });
    console.log("[AUTO CRAWLER] ✓ Đã thiết lập lắng nghe postMessage");

    // ================== MÃ TIÊM VÀO TRANG ==================

    const scriptContent = `
        (function() {
            'use strict';
            console.log('[DETAIL INJECTED] ===== BẮT ĐẦU HOOK =====');

            const TARGET_PATTERNS = [
                'affiliateplatform/creator/detail',
                '/api/v3/affiliateplatform/creator/detail'
            ];

            function isTargetURL(url) {
                return TARGET_PATTERNS.some(pattern => url.includes(pattern));
            }

            // ============ HOOK FETCH API ============
            const originalFetch = window.fetch;
            window.fetch = function(...args) {
                const [resource, config] = args;
                const url = resource.toString();

                if (isTargetURL(url)) {
                    console.log('[DETAIL INJECTED] 🎯 Bắt được Detail API!');

                    window.postMessage({
                        type: 'DETAIL_STATUS',
                        payload: '✓ Đã chặn API detail'
                    }, '*');

                    const promise = originalFetch.apply(this, args);

                    promise.then(response => {
                        console.log('[DETAIL INJECTED] ✓ Response OK');
                        const clonedResponse = response.clone();

                        clonedResponse.json()
                            .then(data => {
                                console.log('[DETAIL INJECTED] ✓ Đã parse JSON!');

                                window.postMessage({
                                    type: 'AFFILIATE_DETAIL_FROM_PAGE',
                                    payload: data
                                }, '*');
                            })
                            .catch(err => {
                                console.error('[DETAIL INJECTED] ✗ Lỗi parse:', err);
                            });
                    }).catch(err => {
                        console.error('[DETAIL INJECTED] ✗ Lỗi fetch:', err);
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
                    console.log('[DETAIL INJECTED] 🎯 Bắt được XHR!');
                    window.postMessage({
                        type: 'DETAIL_STATUS',
                        payload: '✓ Đã chặn API detail (XHR)'
                    }, '*');
                }

                return originalXHROpen.apply(this, [method, url, ...rest]);
            };

            XMLHttpRequest.prototype.send = function(body) {
                if (this._isTargetRequest) {
                    const originalOnReadyStateChange = this.onreadystatechange;

                    this.onreadystatechange = function() {
                        if (this.readyState === 4 && this.status === 200) {
                            try {
                                const data = JSON.parse(this.responseText);
                                console.log('[DETAIL INJECTED] ✓ XHR Data OK');

                                window.postMessage({
                                    type: 'AFFILIATE_DETAIL_FROM_PAGE',
                                    payload: data
                                }, '*');
                            } catch (err) {
                                console.error('[DETAIL INJECTED] ✗ Lỗi parse XHR:', err);
                            }
                        }

                        if (originalOnReadyStateChange) {
                            originalOnReadyStateChange.apply(this, arguments);
                        }
                    };
                }

                return originalXHRSend.apply(this, arguments);
            };

            console.log('[DETAIL INJECTED] ✓ Đã hook APIs!');
        })();
    `;

    const script = document.createElement("script");
    script.textContent = scriptContent;
    script.type = "text/javascript";
    (document.head || document.documentElement).appendChild(script);
    console.log("[AUTO CRAWLER] ✓ Mã chặn đã được tiêm");

    // ================== KHỞI TẠO ==================
    function init() {
        createStatusUI();
        updateStatus("⏳ Đang chờ API load...");

        // Kiểm tra stats ngay khi load trang
        setTimeout(() => {
            GM_xmlhttpRequest({
                method: "GET",
                url: GET_NEXT_URL + "?_=" + Date.now(),
                onload: function (response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.code === 0) {
                            updateStats(data.data.total_pending || 0, data.data.has_more || false);
                        }
                    } catch (e) {
                        console.error("[AUTO CRAWLER] Lỗi lấy stats:", e);
                    }
                }
            });
        }, 1000);

        console.log("[AUTO CRAWLER] ✓ Khởi tạo hoàn tất");
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

    console.log("[AUTO CRAWLER] ===== SCRIPT ĐÃ THIẾT LẬP XONG =====");
})();
