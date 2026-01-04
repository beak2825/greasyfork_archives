// ==UserScript==
// @name         [Bcat] Shopee Flash Sale Data Interceptor [Manual]
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Nghe lén các request Flash Sale của Shopee và tự động gửi dữ liệu đến data-vultr.addlivetag.com.
// @author       You
// @match        https://shopee.vn/flash_sale*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556746/%5BBcat%5D%20Shopee%20Flash%20Sale%20Data%20Interceptor%20%5BManual%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/556746/%5BBcat%5D%20Shopee%20Flash%20Sale%20Data%20Interceptor%20%5BManual%5D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ================== CONFIG ==================
    const TARGET_API_URL = '/api/v4/flash_sale/flash_sale_batch_get_items';
    const PUSH_URL_OLD = "https://addlivetag.com/cron/flash_sale_items_shopee.php?push=1";
    const PUSH_URL_NEW = "https://data-vultr.addlivetag.com/flash-sale/input.php";

    // ================== GLOBAL STATE ==================
    let collectedItems = [];
    let currentPromotionId = null;
    let itemBriefList = []; // Để lưu trữ item_brief_list từ API đầu tiên

    // ================== UI ==================
    let sendButton, resetButton, statusDisplay;

    function createUI() {
        // Container cho các nút
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '10px';
        container.style.right = '10px';
        container.style.zIndex = '9999';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '5px';

        // Hiển thị trạng thái
        statusDisplay = document.createElement('div');
        statusDisplay.style.padding = '8px 12px';
        statusDisplay.style.backgroundColor = '#333';
        statusDisplay.style.color = '#eee';
        statusDisplay.style.borderRadius = '4px';
        statusDisplay.style.fontSize = '12px';
        statusDisplay.style.fontFamily = 'monospace';
        statusDisplay.style.textAlign = 'right';
        updateStatusDisplay('Đang chờ thu thập dữ liệu...');

        // Nút gửi dữ liệu
        sendButton = document.createElement('button');
        sendButton.textContent = 'Gửi Dữ Liệu Đã Thu Thập';
        sendButton.style.padding = '10px 15px';
        sendButton.style.backgroundColor = '#ee4d2d';
        sendButton.style.color = 'white';
        sendButton.style.border = 'none';
        sendButton.style.borderRadius = '4px';
        sendButton.style.cursor = 'pointer';
        sendButton.style.fontSize = '14px';
        sendButton.style.fontWeight = 'bold';
        sendButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        sendButton.disabled = true; // Ban đầu bị vô hiệu hóa

        // Nút xóa dữ liệu
        resetButton = document.createElement('button');
        resetButton.textContent = 'Xóa Dữ Liệu';
        resetButton.style.padding = '8px 12px';
        resetButton.style.backgroundColor = '#555';
        resetButton.style.color = 'white';
        resetButton.style.border = 'none';
        resetButton.style.borderRadius = '4px';
        resetButton.style.cursor = 'pointer';
        resetButton.style.fontSize = '12px';

        container.appendChild(statusDisplay);
        container.appendChild(sendButton);
        container.appendChild(resetButton);
        document.head.appendChild(container);
        document.head.style.display = 'block';

        // Gắn sự kiện
        sendButton.addEventListener('click', sendDataToServer);
        resetButton.addEventListener('click', resetCollectedData);
    }

    function updateStatusDisplay(message) {
        if (statusDisplay) {
            statusDisplay.textContent = message;
        }
    }

    function updateSendButtonState() {
        if (sendButton) {
            sendButton.disabled = collectedItems.length === 0;
            sendButton.textContent = collectedItems.length > 0
                ? `Gửi Dữ Liệu (${collectedItems.length} sản phẩm)`
                : 'Gửi Dữ Liệu Đã Thu Thập';
        }
    }

    // ================== CORE LOGIC ==================

    function getPromotionIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('promotionId') || urlParams.get('promotionid');
    }

    function resetCollectedData() {
        collectedItems = [];
        itemBriefList = [];
        updateStatusDisplay('Đã xóa dữ liệu. Đang chờ thu thập...');
        updateSendButtonState();
        console.log('[Shopee Interceptor] Dữ liệu đã được đặt lại.');
    }

    async function sendDataToServer() {
        if (collectedItems.length === 0) {
            alert('Không có dữ liệu nào để gửi!');
            return;
        }

        sendButton.disabled = true;
        sendButton.textContent = 'Đang gửi...';
        updateStatusDisplay('Đang đẩy dữ liệu lên 2 server...');

        // Tạo cấu trúc dữ liệu chung
        const finalPayload = {
            error: 0,
            error_msg: null,
            data: {
                promotionid: currentPromotionId,
                items: collectedItems,
                item_brief_list: itemBriefList,
                tracker_info: `{"intercepted_by":"userscript","item_count":${collectedItems.length},"timestamp":${Date.now()}}`
            }
        };

        console.log('[Shopee Interceptor] Đang gửi dữ liệu đến 2 server:', {
            items_count: collectedItems.length,
            promotionId: currentPromotionId
        });

        let successCount = 0;
        let errors = [];

        try {
            // Gửi đến server cũ (addlivetag.com)
            try {
                console.log('[Shopee Interceptor] Đang gửi đến addlivetag.com...');
                const responseOld = await fetch(PUSH_URL_OLD, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
                    },
                    body: "json_data=" + encodeURIComponent(JSON.stringify(finalPayload))
                });

                if (responseOld.ok) {
                    const resultOld = await responseOld.text();
                    console.log('✅ Kết quả từ addlivetag.com:', resultOld);
                    successCount++;
                } else {
                    throw new Error(`${responseOld.status} ${responseOld.statusText}`);
                }
            } catch (errorOld) {
                console.error('❌ Lỗi khi gửi đến addlivetag.com:', errorOld);
                errors.push(`addlivetag.com: ${errorOld.message}`);
            }

            // Gửi đến server mới (data-vultr.addlivetag.com)
            try {
                console.log('[Shopee Interceptor] Đang gửi đến data-vultr.addlivetag.com...');
                const responseNew = await fetch(PUSH_URL_NEW, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(finalPayload)
                });

                if (responseNew.ok) {
                    const resultNew = await responseNew.json();
                    console.log('✅ Kết quả từ data-vultr.addlivetag.com:', resultNew);
                    successCount++;
                } else {
                    const errorText = await responseNew.text();
                    throw new Error(`${responseNew.status} ${responseNew.statusText} - ${errorText}`);
                }
            } catch (errorNew) {
                console.error('❌ Lỗi khi gửi đến data-vultr.addlivetag.com:', errorNew);
                errors.push(`data-vultr.addlivetag.com: ${errorNew.message}`);
            }

            // Hiển thị kết quả
            if (successCount === 2) {
                alert(`✅ Thành công! Đã gửi ${collectedItems.length} sản phẩm đến cả 2 server.`);
                updateStatusDisplay(`✅ Đã gửi ${collectedItems.length} sản phẩm đến 2/2 server`);
            } else if (successCount === 1) {
                alert(`⚠️ Một phần thành công!\nĐã gửi ${collectedItems.length} sản phẩm đến ${successCount}/2 server.\n\nLỗi:\n${errors.join('\n')}`);
                updateStatusDisplay(`⚠️ Đã gửi đến ${successCount}/2 server`);
            } else {
                throw new Error(`Tất cả server đều thất bại:\n${errors.join('\n')}`);
            }

        } catch (error) {
            console.error('❌ Lỗi nghiêm trọng:', error);
            alert(`Gửi dữ liệu thất bại: ${error.message}`);
            updateStatusDisplay('❌ Lỗi khi gửi dữ liệu.');
        } finally {
            // Không xóa dữ liệu sau khi gửi, để người dùng có thể gửi lại nếu cần
            updateSendButtonState();
        }
    }

    function interceptFetch() {
        const originalFetch = window.fetch;
        window.fetch = function(...args) {
            const [resource, config] = args;

            // Bắt đầu request
            const promise = originalFetch.apply(this, args);

            // Chỉ xử lý nếu là API chúng ta quan tâm
            if (typeof resource === 'string' && resource.includes(TARGET_API_URL)) {
                promise.then(response => {
                    // Clone response để có thể đọc nó mà không ảnh hưởng đến trang web
                    const clonedResponse = response.clone();
                    clonedResponse.json().then(data => {
                        if (data && data.data && data.data.items && data.data.items.length > 0) {
                            console.log(`[Shopee Interceptor] Thu thập được ${data.data.items.length} sản phẩm.`);
                            collectedItems.push(...data.data.items);
                            updateStatusDisplay(`Đã thu thập: ${collectedItems.length} sản phẩm`);
                            updateSendButtonState();
                        }
                    }).catch(err => {
                        console.error('[Shopee Interceptor] Lỗi khi parse JSON:', err);
                    });
                }).catch(err => {
                    console.error('[Shopee Interceptor] Lỗi khi chặn request:', err);
                });
            }

            // Quan trọng: cũng cần chặn request get_all_itemids để lấy item_brief_list
            if (typeof resource === 'string' && resource.includes('/api/v4/flash_sale/get_all_itemids')) {
                 promise.then(response => {
                    const clonedResponse = response.clone();
                    clonedResponse.json().then(data => {
                        if (data && data.data && data.data.item_brief_list) {
                            console.log('[Shopee Interceptor] Đã lấy được item_brief_list.');
                            itemBriefList = data.data.item_brief_list;
                        }
                    }).catch(err => {
                        console.error('[Shopee Interceptor] Lỗi khi parse JSON từ get_all_itemids:', err);
                    });
                });
            }

            // Trả về promise gốc để trang web hoạt động bình thường
            return promise;
        };
    }

    // ================== INITIALIZATION ==================
    function init() {
        currentPromotionId = getPromotionIdFromUrl();
        if (!currentPromotionId) {
            console.error('[Shopee Interceptor] Không tìm thấy Promotion ID. Script sẽ không hoạt động.');
            return;
        }

        console.log(`[Shopee Interceptor] Bắt đầu cho Promotion ID: ${currentPromotionId}`);
        resetCollectedData(); // Đặt lại dữ liệu cho phiên mới
        createUI();
        interceptFetch();
    }

    // Chạy script khi trang bắt đầu tải để đảm bảo interceptFetch được thiết lập sớm nhất
    init();

})();
