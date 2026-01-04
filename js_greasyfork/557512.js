// ==UserScript==
// @name         Turnitin Auto Download Reports (Optimized)
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Tự động click download Similarity Report và AI Writing Report (Xử lý Shadow DOM & Hỗ trợ IDM)
// @author       You
// @match        https://ev.turnitin.com/app/carta/en_us/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557512/Turnitin%20Auto%20Download%20Reports%20%28Optimized%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557512/Turnitin%20Auto%20Download%20Reports%20%28Optimized%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Cấu hình
    const CONFIG = {
        retryInterval: 500, // Thử tìm lại nút mỗi 0.5s
        maxRetries: 10,     // Thử tối đa 10 lần mỗi thao tác
        delayBetweenDownloads: 3000 // Tăng delay lên 3s để kịp xử lý IDM
    };

    // --- PHẦN MỚI: XỬ LÝ IDM & LINK ---
    let capturedLink = '';

    // Hàm chặn window.open để lấy link S3
    function hookWindowOpen() {
        const originalOpen = window.open;
        window.open = function(url, target, features) {
            // Kiểm tra nếu link là AWS S3 hoặc của Turnitin (thường là file report)
            if (url && typeof url === 'string' && (url.includes('amazonaws.com') || url.includes('turnitin.com') || url.includes('.pdf'))) {
                console.log('[Turnitin DL] Captured URL:', url);
                capturedLink = url;

                // Cập nhật giao diện
                updateStatus('🔗 Đã bắt link! Đang gọi IDM...', 'success');
                showLinkInGUI(url);

                // Kỹ thuật ép IDM bắt link: Tạo thẻ A và click
                // IDM thường bắt sự kiện click thẻ A tốt hơn là window.open
                try {
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = 'Turnitin_Report.pdf'; // Gợi ý tên file
                    link.target = '_self'; // Tránh mở tab mới loạn xạ
                    link.style.display = 'none';
                    document.body.appendChild(link);

                    // Click giả lập
                    link.click();

                    // Dọn dẹp
                    setTimeout(() => {
                        if (document.body.contains(link)) {
                            document.body.removeChild(link);
                        }
                    }, 1000);

                    // Chặn hành động mặc định (tải ngầm) của Turnitin
                    // Nếu muốn trình duyệt vẫn mở tab mới (dự phòng), hãy xóa dòng return null
                    return null;
                } catch (e) {
                    console.error('Lỗi khi giả lập click:', e);
                }
            }
            return originalOpen.apply(window, arguments);
        };
        console.log('[Turnitin DL] Window.open interceptor activated.');
    }

    // --- PHẦN GIAO DIỆN (GUI) ---
    function createGUI() {
        if (document.getElementById('auto-download-gui')) return;

        const container = document.createElement('div');
        container.id = 'auto-download-gui';
        container.style.cssText = `
            position: fixed;
            top: 60px;
            right: 20px;
            z-index: 99999;
            background: rgba(255, 255, 255, 0.98);
            padding: 15px;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.15);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            border: 1px solid #e0e0e0;
            min-width: 220px;
        `;

        const title = document.createElement('div');
        title.innerHTML = '📥 <strong>Turnitin Downloader v1.4</strong>';
        title.style.cssText = `
            color: #333;
            margin-bottom: 12px;
            text-align: center;
            font-size: 14px;
            border-bottom: 1px solid #eee;
            padding-bottom: 8px;
        `;

        // Input ẩn để hiện link khi cần
        const linkInput = document.createElement('input');
        linkInput.id = 'dl-link-display';
        linkInput.type = 'text';
        linkInput.readOnly = true;
        linkInput.placeholder = 'Link sẽ hiện ở đây...';
        linkInput.style.cssText = `
            width: 100%;
            padding: 5px;
            margin-bottom: 8px;
            font-size: 11px;
            border: 1px solid #ddd;
            border-radius: 4px;
            background: #f9f9f9;
            display: none; /* Ẩn mặc định */
        `;
        linkInput.onclick = function() { this.select(); };

        const createBtn = (text, color, onClick) => {
            const btn = document.createElement('button');
            btn.textContent = text;
            btn.style.cssText = `
                background: ${color};
                color: white;
                border: none;
                padding: 8px 15px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 13px;
                font-weight: 500;
                width: 100%;
                margin-bottom: 8px;
                transition: transform 0.1s;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            `;
            btn.onclick = onClick;
            return btn;
        };

        const btnAll = createBtn('🚀 Download All', 'linear-gradient(45deg, #11998e, #38ef7d)', () => downloadReports('all'));
        const btnSim = createBtn('📊 Similarity Only', '#2196F3', () => downloadReports('similarity'));
        const btnAI = createBtn('🤖 AI Report Only', '#9C27B0', () => downloadReports('ai'));

        const status = document.createElement('div');
        status.id = 'download-status';
        status.textContent = 'Ready (IDM Support ON)';
        status.style.cssText = `
            color: #666;
            font-size: 11px;
            margin-top: 5px;
            text-align: center;
            font-style: italic;
        `;

        container.appendChild(title);
        container.appendChild(linkInput); // Thêm input link
        container.appendChild(btnAll);
        container.appendChild(btnSim);
        container.appendChild(btnAI);
        container.appendChild(status);
        document.body.appendChild(container);
    }

    function showLinkInGUI(url) {
        const input = document.getElementById('dl-link-display');
        if (input) {
            input.style.display = 'block';
            input.value = url;
            // Highlight nhẹ để báo hiệu
            input.style.borderColor = '#4CAF50';
        }
    }

    function updateStatus(text, type = 'normal') {
        const status = document.getElementById('download-status');
        if (status) {
            status.textContent = text;
            status.style.color = type === 'error' ? '#f44336' : (type === 'success' ? '#4CAF50' : '#666');
        }
        console.log(`[Turnitin DL] ${text}`);
    }

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // --- PHẦN LOGIC TÌM NÚT & CLICK ---
    async function getDownloadButtons() {
        let attempts = 0;
        while (attempts < CONFIG.maxRetries) {
            const downloadMfe = document.querySelector('tii-sws-download-btn-mfe');
            if (downloadMfe && downloadMfe.shadowRoot) {
                const btns = {
                    similarity: downloadMfe.shadowRoot.querySelector('button[data-px="SimReportDownloadClicked"]'),
                    ai: downloadMfe.shadowRoot.querySelector('button[data-px="AIWritingReportDownload"]')
                };
                if (btns.similarity || btns.ai) return btns;
            }
            attempts++;
            await delay(CONFIG.retryInterval);
        }
        return null;
    }

    async function downloadReports(type) {
        try {
            updateStatus('⏳ Đang tìm file...');
            const buttons = await getDownloadButtons();

            if (!buttons) throw new Error('Không tìm thấy nút download!');

            // Reset input link
            const linkInput = document.getElementById('dl-link-display');
            if(linkInput) linkInput.style.display = 'none';

            if (type === 'all' || type === 'similarity') {
                if (buttons.similarity) {
                    updateStatus('⬇️ Requesting Similarity...');
                    buttons.similarity.click();
                    await delay(CONFIG.delayBetweenDownloads);
                }
            }

            if (type === 'all' || type === 'ai') {
                if (buttons.ai) {
                    updateStatus('⬇️ Requesting AI Report...');
                    buttons.ai.click();
                    await delay(CONFIG.delayBetweenDownloads);
                }
            }

            // Nếu sau 5s mà chưa bắt được link nào
            setTimeout(() => {
                if (!capturedLink) {
                    updateStatus('⚠️ Xong, nhưng chưa bắt được link?', 'error');
                } else {
                    updateStatus('✅ Đã xử lý xong!', 'success');
                }
            }, 4000);

        } catch (error) {
            updateStatus('❌ ' + error.message, 'error');
        }
    }

    // --- KHỞI CHẠY ---
    // Kích hoạt hook ngay lập tức để không bỏ lỡ link
    hookWindowOpen();

    const observer = new MutationObserver((mutations) => {
        if (!document.getElementById('auto-download-gui')) {
            if (window.location.href.includes('/app/carta/en_us/')) {
                createGUI();
            }
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createGUI);
    } else {
        createGUI();
    }

})();