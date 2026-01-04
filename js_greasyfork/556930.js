// ==UserScript==
// @name         [Bcat] Shopee Flash Sale Auto Interceptor (All-in-One)
// @namespace    http://tampermonkey.net/
// @version      5.3
// @description  Tự động thu thập và gửi dữ liệu từ mọi trang Flash Sale của Shopee. Với bộ đếm và cấu hình dễ dàng.
// @author       You
// @match        https://shopee.vn/flash_sale*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556930/%5BBcat%5D%20Shopee%20Flash%20Sale%20Auto%20Interceptor%20%28All-in-One%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556930/%5BBcat%5D%20Shopee%20Flash%20Sale%20Auto%20Interceptor%20%28All-in-One%29.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // ================== CONFIGURATION ==================
    // Thời gian chờ (tính bằng mili giây) sau khi cuộn trang để chờ dữ liệu mới tải
    const SCROLL_WAIT_TIME = 2000; // 2 giây
    // Thời gian chờ tối thiểu trước khi tải lại trang khi không có dữ liệu mới
    const MIN_PAGE_RELOAD_DELAY = 30000; // 30 giây
    // Thời gian chờ tối đa trước khi tải lại trang
    const MAX_PAGE_RELOAD_DELAY = 600000; // 10 phút
    // Thời gian chờ trước khi thử lại khi xảy ra lỗi
    const ERROR_RETRY_DELAY = 30000; // 30 giây
    // Thời gian chờ ban đầu sau khi trang tải xong để bắt đầu quá trình
    const INITIAL_START_DELAY = 5000; // 5 giây
    // Tốc độ cuộn trang (ms cho mỗi pixel)
    const SCROLL_SPEED = 5; // 10ms cho mỗi pixel
    // Khoảng thời gian giữa các hành vi giả lập người dùng
    const HUMAN_BEHAVIOR_INTERVAL = 60000; // 60 giây

    // ================== API CONFIG ==================
    const TARGET_API_URL = "/api/v4/flash_sale/flash_sale_batch_get_items";
    const PUSH_URL = "https://addlivetag.com/cron/flash_sale_items_shopee.php?push=1";

    // ================== GLOBAL STATE ==================
    let collectedItems = [];
    let itemBriefList = [];
    let currentPromotionId = null;
    let isProcessing = false; // Cờ để ngăn vòng lặp chạy đồng thời
    let statusDisplay;
    let lastScrollPosition = 0;
    let scrollDirection = 1; // 1: xuống, -1: lên
    let humanBehaviorTimer;

    // --- COUNTERS ---
    let runCount = 0;
    let requestCount = 0;
    let totalProductsSent = 0;

    // ================== TIME-BASED RELOAD SCHEDULE ==================
    const SPECIAL_HOURS = [0, 1, 2, 5, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

    function getReloadDelay() {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();

        // Kiểm tra nếu đang trong khung giờ đặc biệt và phút = 0
        if (SPECIAL_HOURS.includes(currentHour) && currentMinute === 0) {
            return 900; // Tải lại ngay lập tức sau 0.9 giây
        }

        // Xác định khoảng thời gian kể từ khung giờ đặc biệt gần nhất
        let closestSpecialHour = SPECIAL_HOURS.filter(h => h <= currentHour).pop();
        if (closestSpecialHour === undefined) {
            closestSpecialHour = SPECIAL_HOURS[SPECIAL_HOURS.length - 1];
        }

        const hoursSinceSpecial = currentHour - closestSpecialHour;

        // Trong vòng 1 tiếng sau khung giờ đặc biệt
        if (hoursSinceSpecial === 0 && currentMinute < 60) {
            return MIN_PAGE_RELOAD_DELAY; // 60 giây
        }

        // Sau 1 tiếng nhưng chưa đến 2 tiếng
        if (hoursSinceSpecial === 1 || (hoursSinceSpecial === 0 && currentMinute >= 60)) {
            return 300000; // 5 phút
        }

        // Sau 2 tiếng
        if (hoursSinceSpecial >= 2) {
            return 600000; // 10 phút
        }

        // Mặc định
        return 300000; // 5 phút
    }

    // ================== HUMAN-LIKE BEHAVIORS ==================
    function simulateHumanBehavior() {
        // Ngẫu nhiên cuộn lên một chút rồi lại cuộn xuống
        if (Math.random() < 0.3) {
            const randomScrollAmount = Math.floor(Math.random() * 300) + 100;
            window.scrollBy(0, -randomScrollAmount);

            setTimeout(() => {
                window.scrollBy(0, randomScrollAmount);
            }, 1000 + Math.random() * 2000);
        }

        // Di chuyển chuột ngẫu nhiên
        if (Math.random() < 0.5) {
            const x = Math.floor(Math.random() * window.innerWidth);
            const y = Math.floor(Math.random() * window.innerHeight);

            const mouseEvent = new MouseEvent('mousemove', {
                clientX: x,
                clientY: y
            });
            document.dispatchEvent(mouseEvent);
        }

        // Ngẫu nhiên hover vào một sản phẩm
        if (Math.random() < 0.4) {
            const productElements = document.querySelectorAll('.flash-sale-item-card, .flash-sale-item');
            if (productElements.length > 0) {
                const randomIndex = Math.floor(Math.random() * productElements.length);
                const element = productElements[randomIndex];

                const hoverEvent = new MouseEvent('mouseover', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                element.dispatchEvent(hoverEvent);

                setTimeout(() => {
                    const leaveEvent = new MouseEvent('mouseout', {
                        bubbles: true,
                        cancelable: true,
                        view: window
                    });
                    element.dispatchEvent(leaveEvent);
                }, 1000 + Math.random() * 2000);
            }
        }
    }

    // ================== SMOOTH SCROLL ==================
    function smoothScrollTo(position, callback) {
        const startPosition = window.pageYOffset;
        const distance = position - startPosition;
        const duration = Math.abs(distance) * SCROLL_SPEED;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);

            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            } else if (callback) {
                callback();
            }
        }

        function easeInOutQuad(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        requestAnimationFrame(animation);
    }

    // ================== UI ==================
    function createUI() {
        statusDisplay = document.createElement("div");
        statusDisplay.style.position = "fixed";
        statusDisplay.style.top = "10px";
        statusDisplay.style.right = "10px";
        statusDisplay.style.zIndex = "9999";
        statusDisplay.style.padding = "10px 15px";
        statusDisplay.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
        statusDisplay.style.color = "#0f0";
        statusDisplay.style.borderRadius = "4px";
        statusDisplay.style.fontSize = "12px";
        statusDisplay.style.fontFamily = "monospace";
        statusDisplay.style.textAlign = "left";
        statusDisplay.style.whiteSpace = "pre-line";
        statusDisplay.style.minWidth = "300px";
        statusDisplay.style.lineHeight = "1.5";
        document.body.appendChild(statusDisplay);
        updateStatusDisplay("Script đã sẵn sàng. Đang chờ dữ liệu...");
    }

    function updateStatusDisplay(message) {
        if (statusDisplay) {
            const nextReloadTime = new Date(Date.now() + getReloadDelay());
            statusDisplay.innerHTML = `
<b>[${new Date().toLocaleTimeString()}] Flash Sale Auto</b>
<hr style="margin: 5px 0; border-color: #0f0;">
Lần chạy: <b>${runCount}</b> | Yêu cầu API: <b>${requestCount}</b>
Đã gửi: <b>${totalProductsSent}</b> sản phẩm
Tải lại trang lúc: <b>${nextReloadTime.toLocaleTimeString()}</b>
<hr style="margin: 5px 0; border-color: #0f0;">
 ${message}
            `;
        }
    }

    // ================== CORE LOGIC ==================

    function getPromotionIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get("promotionId") || urlParams.get("promotionid");
    }

    async function sendDataToServer() {
        if (collectedItems.length === 0) {
            console.log("[Shopee Auto] Không có dữ liệu mới để gửi.");
            return;
        }

        updateStatusDisplay(`Đang gửi ${collectedItems.length} sản phẩm...`);
        const itemsToSend = [...collectedItems];
        collectedItems = [];

        try {
            const finalPayload = {
                error: 0,
                error_msg: null,
                data: {
                    promotionid: currentPromotionId,
                    items: itemsToSend,
                    item_brief_list: itemBriefList,
                    tracker_info: `{\"intercepted_by\":\"userscript_v5.2\",\"item_count\":${itemsToSend.length}}`,
                },
            };

            const response = await fetch(PUSH_URL, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
                body: "json_data=" + encodeURIComponent(JSON.stringify(finalPayload)),
            });

            if (!response.ok) {
                throw new Error(`Lỗi server: ${response.status}`);
            }

            const result = await response.text();
            console.log("🔄 Kết quả từ server:", result);
            totalProductsSent += itemsToSend.length;
            updateStatusDisplay(`✅ Đã gửi thành công ${itemsToSend.length} sản phẩm.`);
        } catch (error) {
            console.error("Lỗi khi gửi dữ liệu:", error);
            updateStatusDisplay(`❌ Lỗi gửi dữ liệu: ${error.message}. Thử lại...`);
            collectedItems.unshift(...itemsToSend);
            throw error;
        }
    }

    function interceptFetch() {
        const originalFetch = window.fetch;
        window.fetch = function (...args) {
            const [resource] = args;
            const promise = originalFetch.apply(this, args);

            if (typeof resource === "string" && resource.includes(TARGET_API_URL)) {
                requestCount++;
                updateStatusDisplay(`Phát hiện yêu cầu API #${requestCount}. Đang thu thập...`);
                promise
                    .then((response) => {
                        const clonedResponse = response.clone();
                        clonedResponse
                            .json()
                            .then((data) => {
                                if (data && data.data && data.data.items && data.data.items.length > 0) {
                                    const lastCollectedItemId = collectedItems.length > 0 ? collectedItems[collectedItems.length - 1].itemid : null;
                                    const firstNewItemId = data.data.items[0].itemid;

                                    if (lastCollectedItemId !== firstNewItemId) {
                                        console.log(`[Shopee Auto] Phát hiện và thu thập ${data.data.items.length} sản phẩm mới.`);
                                        collectedItems.push(...data.data.items);
                                        updateStatusDisplay(`Đã thu thập thêm ${data.data.items.length} sản phẩm. Tổng tạm: ${collectedItems.length}`);
                                    }
                                }
                            })
                            .catch((err) => console.error("[Shopee Auto] Lỗi parse JSON:", err));
                    })
                    .catch((err) => console.error("[Shopee Auto] Lỗi chặn request:", err));
            }

            if (typeof resource === "string" && resource.includes("/api/v4/flash_sale/get_all_itemids")) {
                promise.then((response) => {
                    const clonedResponse = response.clone();
                    clonedResponse
                        .json()
                        .then((data) => {
                            if (data && data.data && data.data.item_brief_list) {
                                itemBriefList = data.data.item_brief_list;
                            }
                        })
                        .catch((err) => console.error("[Shopee Auto] Lỗi parse JSON từ get_all_itemids:", err));
                });
            }

            return promise;
        };
    }

    // ================== MAIN AUTO PROCESS ==================
    async function startAutoProcess() {
        if (isProcessing) {
            console.log("[Shopee Auto] Vòng lặp đang chạy, bỏ qua...");
            return;
        }
        isProcessing = true;

        try {
            // Gửi dữ liệu nếu có
            if (collectedItems.length > 0) {
                await sendDataToServer();
            }

            // Xác định vị trí cuộn tiếp theo
            const documentHeight = document.body.scrollHeight;
            const windowHeight = window.innerHeight;
            const currentPosition = window.pageYOffset;

            // Nếu đã ở cuối trang
            if (currentPosition + windowHeight >= documentHeight - 100) {
                const reloadDelay = getReloadDelay();
                updateStatusDisplay("Đã đến cuối trang. Tải lại trang sau " + reloadDelay / 1000 + " giây...");
                console.log("[Shopee Auto] Không có dữ liệu mới. Sẽ tải lại trang.");

                setTimeout(() => {
                    window.location.reload();
                }, reloadDelay);
                return;
            }

            // Cuộn trang mượt mà
            updateStatusDisplay("Đang cuộn trang để tìm thêm sản phẩm...");
            const nextPosition = Math.min(currentPosition + windowHeight * 0.7, documentHeight - windowHeight);
            smoothScrollTo(nextPosition, async () => {
                // Chờ một chút để trang tải dữ liệu
                await new Promise((resolve) => setTimeout(resolve, SCROLL_WAIT_TIME));

                // Kiểm tra xem có dữ liệu mới không
                if (collectedItems.length > 0) {
                    console.log(`[Shopee Auto] Phát hiện ${collectedItems.length} sản phẩm mới. Tiếp tục xử lý.`);
                    isProcessing = false;
                    startAutoProcess();
                } else {
                    // Tiếp tục cuộn nếu không có dữ liệu mới
                    isProcessing = false;
                    setTimeout(startAutoProcess, 2000 + Math.random() * 3000);
                }
            });

        } catch (error) {
            console.error("[Shopee Auto] Lỗi trong vòng lặp chính:", error);
            updateStatusDisplay("Đã xảy ra lỗi. Thử lại sau " + ERROR_RETRY_DELAY / 1000 + " giây...");
            setTimeout(() => {
                isProcessing = false;
                startAutoProcess();
            }, ERROR_RETRY_DELAY);
        }
    }

    // ================== INITIALIZATION ==================
    function init() {
        // Lấy và tăng số lần chạy từ localStorage
        runCount = parseInt(localStorage.getItem("shopee_interceptor_run_count") || "0") + 1;
        localStorage.setItem("shopee_interceptor_run_count", runCount.toString());

        // Reset các bộ đếm khác cho phiên mới
        requestCount = 0;
        totalProductsSent = 0;

        currentPromotionId = getPromotionIdFromUrl();
        console.log(`[Shopee Auto] Khởi động lần thứ ${runCount}. Promotion ID: ${currentPromotionId || "Tổng hợp"}`);

        setTimeout(() => {
            createUI();
            interceptFetch();

            // Bắt đầu hành vi giả lập người dùng
            humanBehaviorTimer = setInterval(simulateHumanBehavior, HUMAN_BEHAVIOR_INTERVAL);

            // Bắt đầu quá trình chính
            setTimeout(startAutoProcess, INITIAL_START_DELAY);
        }, 500);
    }

    // Dọn dẹp khi trang đóng
    window.addEventListener('beforeunload', () => {
        if (humanBehaviorTimer) {
            clearInterval(humanBehaviorTimer);
        }
    });

    init();
})();