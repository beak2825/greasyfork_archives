// ==UserScript==
// @name         Lấy danh sách tổng chi tiêu Shopee VN
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  Lấy danh sách tổng số tiền mình đã chi tiêu trên Shopee
// @author       Elaina Da Catto
// @include      /^https:\/\/shopee\.[a-z]+\/.*$/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552521/L%E1%BA%A5y%20danh%20s%C3%A1ch%20t%E1%BB%95ng%20chi%20ti%C3%AAu%20Shopee%20VN.user.js
// @updateURL https://update.greasyfork.org/scripts/552521/L%E1%BA%A5y%20danh%20s%C3%A1ch%20t%E1%BB%95ng%20chi%20ti%C3%AAu%20Shopee%20VN.meta.js
// ==/UserScript==

const observeNavbar = () => {
    const observer = new MutationObserver(() => {
        const secondNavbar = document.querySelector(".container.navbar > .navbar__links");
        if (secondNavbar && !document.querySelector(".getOrderListButton")) {
            createGetOrderListButton();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
};

// Hàm lấy danh sách đơn theo list_type
const getOrderList = async (listType, label) => {
    const limit = 20;
    let offset = 0;

    let order = 0;
    let totalPrice = 0;

    try {
        while (true) {
            let res = await fetch(`https://shopee.vn/api/v4/order/get_order_list?limit=${limit}&list_type=${listType}&offset=${offset}`);
            let json = await res.json();

            let data = json?.data;
            if (!data || !data.details_list) break;

            for (let detail of data.details_list) {
                totalPrice += detail.info_card.final_total || 0;
                order++;
            }

            if (data.next_offset === -1) break;
            offset = data.next_offset;
        }

        return `${label}: ${order}\nTổng tiền: ${(totalPrice / 100000).toLocaleString("vi-VN")} VND`;
    }
    catch (err) {
        console.error("Lỗi:", err);
        alert("❌ Đã xảy ra lỗi khi chạy script!");
        return `${label}: Lỗi khi lấy dữ liệu`;
    }
};

const getOrderLists = async () => {
    document.querySelector(".getOrderListButtonLable").textContent = "Đang lấy dữ liệu..."
    alert("⏳ Đang chạy script lấy thông tin đơn hàng, \nvui lòng không tải lại hay chuyển trang...\n\nẤn OK để bắt đầu.");

    const getOrderListButton = document.querySelector(".getOrderListButton")
    getOrderListButton.style.cssText = `
        pointer-events: none;
        cursor: not-allowed;
        margin-right: 10px;
    `

    const [completed, cancelled, waiting, shipping] = await Promise.all([
        getOrderList(3, "Số đơn đã mua thành công"),
        getOrderList(4, "Số đơn đã hủy"),
        getOrderList(8, "Số đơn đang chờ giao"),
        getOrderList(9, "Số đơn đang giao")
    ]);

    alert("✅ Hoàn thành!\n\n" + [completed, cancelled, waiting, shipping].join("\n\n"));

    document.querySelector(".getOrderListButtonLable").textContent = "Lấy tổng tiền toàn bộ dơn hàng"
    getOrderListButton.style.cssText = `
        pointer-events: auto;
        cursor: auto;
        margin-right: 10px;
    `
}

const createGetOrderListButton = () => {
    const secondNavbar = document.querySelector(".container.navbar > .navbar__links")
    const getOrderListButton = document.createElement("li")

    getOrderListButton.setAttribute("class", "navbar__link--notification navbar__link navbar__link--hoverable navbar__link--tappable getOrderListButton")
    getOrderListButton.style.cssText = `
        pointer-events: auto;
        cursor: auto;
        margin-right: 10px;
    `

    getOrderListButton.innerHTML = `
    <div id="sll2-NotificationSummary">
        <div class="stardust-popover" id="stardust-popover1">
            <div role="button" class="stardust-popover__target">
                <a style="color: currentColor; padding: 6px 0; align-items: center; display: flex;">
                    <svg height="16" viewBox="0 0 16 16" width="16" class="shopee-svg-icon icon-help-center">
                        <g fill="none" fill-rule="evenodd" transform="translate(1)">
                            <circle cx="7" cy="8" r="7" stroke="currentColor"></circle>
                            <path fill="currentColor" d="m6.871 3.992c-.814 0-1.452.231-1.914.704-.462.462-.693 1.089-.693 1.892h1.155c0-.484.099-.858.297-1.122.22-.319.583-.473 1.078-.473.396 0 .715.11.935.33.209.22.319.517.319.902 0 .286-.11.55-.308.803l-.187.209c-.682.605-1.1 1.056-1.243 1.364-.154.286-.22.638-.22 1.045v.187h1.177v-.187c0-.264.055-.506.176-.726.099-.198.253-.396.462-.572.517-.451.825-.737.924-.858.275-.352.418-.803.418-1.342 0-.66-.22-1.188-.66-1.573-.44-.396-1.012-.583-1.716-.583zm-.198 6.435c-.22 0-.418.066-.572.22-.154.143-.231.33-.231.561 0 .22.077.407.231.561s.352.231.572.231.418-.077.572-.22c.154-.154.242-.341.242-.572s-.077-.418-.231-.561c-.154-.154-.352-.22-.583-.22z"></path>
                        </g>
                    </svg>
                    <span style="font-size: .8125rem; font-weight: 300; margin-left: .3125rem; text-transform: capitalize;" class="getOrderListButtonLable">Lấy tổng tiền toàn bộ dơn hàng</span>
                </a>
            </div>
        </div>
    </div>
    `

    getOrderListButton.addEventListener("click", async () => { await getOrderLists() })

    secondNavbar.insertBefore(getOrderListButton, secondNavbar.firstChild)
}

// Ctrl + Alt + P
document.addEventListener("keydown", async (e) => {
    if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "p") { await getOrderLists() }
});

window.addEventListener("load", () => {
    observeNavbar()
})