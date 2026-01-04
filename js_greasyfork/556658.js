// ==UserScript==
// @name         5anm Flash Sale Data Fetcher (With Manual Prompt)
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Tự động lấy dữ liệu flash sale từ 5anm.net và đẩy lên addlivetag.com. Hỗ trợ nhập token thủ công nếu không tìm thấy.
// @author       You
// @match        https://5anm.net/flashsale*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556658/5anm%20Flash%20Sale%20Data%20Fetcher%20%28With%20Manual%20Prompt%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556658/5anm%20Flash%20Sale%20Data%20Fetcher%20%28With%20Manual%20Prompt%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ================== CONFIG ==================
    const MANUAL_CSRF_TOKEN = "";
    // -> Nếu biết sẵn token thì dán vào đây, ví dụ:
    // const MANUAL_CSRF_TOKEN = "237d2f6de46db6f11a09c9206150923ebdf53835d0d715e34270f982bf96e094";

    // Các tham số mặc định cho API flash sale
    const BASE_URL = "https://5anm.net/search_flashsale2025.php";
    const FLASHSALE_PARAMS = "&page=1&limit=100000&sort_by=discount&rating_filter=all&query=&fs=false";

    // URL nhận dữ liệu
    const PUSH_URL = "https://addlivetag.com/cron/flash_sale_items_5anm.php?push=1";

    // Đường dẫn đến trang nơi bạn tin rằng có chứa CSRF token
    const CSRF_TOKEN_SOURCE_URL = "https://5anm.net/flashsale";

    // ================== UTIL ==================
    function getCookie(name) {
        const m = document.cookie.match(new RegExp("(^|; )" + name.replace(/([$?*|{}\]\\/+^])/g, "\\$1") + "=([^;]*)"));
        return m ? decodeURIComponent(m[2]) : null;
    }

    /**
     * Tạo một request đến một trang cụ thể để lấy CSRF token từ HTML trả về.
     * @param {string} pageUrl URL của trang cần lấy token.
     * @returns {Promise<string|null>} Trả về token nếu tìm thấy, ngược lại là null.
     */
    async function fetchCsrfTokenFromPage(pageUrl) {
        try {
            console.log(`[+] Thử lấy CSRF token từ trang: ${pageUrl}`);
            const response = await fetch(pageUrl, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
                    "Accept-Language": "vi,en;q=0.9,vi-VN;q=0.8,en-US;q=0.7",
                    "Cache-Control": "no-cache",
                    "Pragma": "no-cache"
                }
            });

            if (!response.ok) {
                console.error(`[-] Lỗi khi lấy trang ${pageUrl}: ${response.status} ${response.statusText}`);
                return null;
            }

            const htmlText = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlText, 'text/html');
            const meta = doc.querySelector('meta[name="csrf-token"], meta[name="csrf_token"]');
            if (meta && meta.content) {
                console.log("[✅] Tìm thấy CSRF token từ trang được fetch.");
                return meta.content.trim();
            }

            console.warn("[-] Không tìm thấy thẻ meta csrf-token trong trang được fetch.");
            return null;

        } catch (error) {
            console.error("[-] Có lỗi xảy ra trong quá trình fetch CSRF token:", error);
            return null;
        }
    }

    async function detectCsrfToken() {
        // 1. Nếu có token nhập tay trong code
        if (MANUAL_CSRF_TOKEN && MANUAL_CSRF_TOKEN.trim() !== "") {
            console.log("[✅] Sử dụng MANUAL_CSRF_TOKEN.");
            return MANUAL_CSRF_TOKEN.trim();
        }

        // 2. Thử meta[name="csrf-token"] trên trang hiện tại
        const meta = document.querySelector('meta[name="csrf-token"], meta[name="csrf_token"]');
        if (meta && meta.content) {
            console.log("[✅] Tìm thấy CSRF token trong meta tag của trang hiện tại.");
            return meta.content.trim();
        }

        // 3. Thử cookie XSRF-TOKEN (Laravel hay xài)
        const cookieToken = getCookie("XSRF-TOKEN") || getCookie("XSRF_TOKEN");
        if (cookieToken) {
            console.log("[✅] Tìm thấy CSRF token trong cookie.");
            return cookieToken.trim();
        }

        // 4. Nếu các cách trên không được, thử fetch lại trang chính để lấy token
        console.log("[!] Không tìm thấy token ở các cách thông thường. Đang thử cách fetch lại trang...");
        const fetchedToken = await fetchCsrfTokenFromPage(CSRF_TOKEN_SOURCE_URL);
        if (fetchedToken) {
            return fetchedToken;
        }

        // 5. (MỚI) Nếu mọi cách đều thất bại, hiển thị popup để người dùng nhập
        console.warn("[!] Không thể lấy được CSRF token một cách tự động.");
        console.log("[i] Hiển thị popup để người dùng nhập token...");

        const userToken = prompt("Không tìm thấy CSRF token tự động.\nVui lòng nhập thủ công (hoặc nhấn Cancel để dừng):");
        if (userToken && userToken.trim() !== "") {
            console.log("[✅] Người dùng đã nhập CSRF token. Tiếp tục chạy script.");
            return userToken.trim();
        } else {
            console.log("[i] Người dùng đã hủy hoặc để trống. Script sẽ dừng.");
            return null;
        }
    }

    // ================== MAIN FLOW ==================
    (async () => {
        console.log("🚀 Script 5AnM Flash Sale Fetcher đã được kích hoạt.");

        const csrfToken = await detectCsrfToken();

        // Kiểm tra xem có lấy được token không trước khi tiếp tục
        if (!csrfToken) {
            console.error("Dừng script vì không có CSRF token.");
            alert("Script đã dừng vì không có CSRF token.");
            return;
        }

        const commonHeaders = {
            "accept": "*/*",
            "accept-language": "vi,en;q=0.9,vi-VN;q=0.8,en-US;q=0.7",
            "x-requested-with": "XMLHttpRequest",
            "x-csrf-token": csrfToken
        };

        try {
            console.log("\n▶ Bước 1: Lấy danh sách get_times...");
            const metaRes = await fetch(BASE_URL, {
                method: "GET",
                headers: commonHeaders,
                referrer: "https://5anm.net/flashsale?utm_source=zalo&utm_medium=zalo&utm_campaign=zalo",
                mode: "cors",
                credentials: "include"
            });

            if (!metaRes.ok) {
                console.error("Lỗi lấy get_times:", metaRes.status, metaRes.statusText);
                const errorText = await metaRes.text();
                console.error("Chi tiết lỗi từ server:", errorText);
                alert(`Lỗi khi lấy dữ liệu: ${metaRes.status} ${metaRes.statusText}`);
                return;
            }

            const metaData = await metaRes.json();
            console.log("metaData:", metaData);

            const getTimes = metaData.get_times || metaData.data?.get_times || [];
            const defaultGetTime = metaData.default_get_time || metaData.data?.default_get_time || null;

            if (!Array.isArray(getTimes) || getTimes.length === 0) {
                console.warn("Không có get_times trong response, thử dùng default_get_time:", defaultGetTime);
                if (!defaultGetTime) {
                    console.error("Không có default_get_time luôn. Dừng.");
                    alert("Không tìm thấy dữ liệu thời gian flash sale.");
                    return;
                }
                getTimes.push({ start_time: defaultGetTime, real_time: "default_get_time" });
            }

            console.log("Danh sách get_times:", getTimes);

            for (const t of getTimes) {
                const startTime = t.start_time;
                const realTime = t.real_time || "";
                if (!startTime) continue;

                const url = `${BASE_URL}?get_time=${encodeURIComponent(startTime)}${FLASHSALE_PARAMS}`;
                console.log(`\n▶ Bước 2: Lấy flash sale cho get_time=${startTime} (${realTime})`);

                const res = await fetch(url, {
                    method: "GET",
                    headers: commonHeaders,
                    referrer: "https://5anm.net/flashsale?utm_source=zalo&utm_medium=zalo&utm_campaign=zalo",
                    mode: "cors",
                    credentials: "include"
                });

                if (!res.ok) {
                    console.error(`Lỗi khi gọi flashsale get_time=${startTime}:`, res.status, res.statusText);
                    continue;
                }

                const data = await res.json();
                console.log(`✅ Lấy dữ liệu flashsale xong cho get_time=${startTime}, push sang addlivetag...`);

                const body = "json_data=" + encodeURIComponent(JSON.stringify(data));
                const postRes = await fetch(PUSH_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
                    },
                    body
                });

                const text = await postRes.text();
                console.log(`🔄 Kết quả push (get_time=${startTime}):`, text);
            }

            console.log("\n🎉 Hoàn thành xử lý tất cả get_times.");
            alert("Hoàn thành! Dữ liệu đã được đẩy lên addlivetag.com.");

        } catch (err) {
            console.error("Có lỗi trong quá trình chạy script:", err);
            alert(`Đã xảy ra lỗi: ${err.message}`);
        }
    })();
})();