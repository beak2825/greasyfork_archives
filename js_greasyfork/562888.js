// ==UserScript==
// @name         Chặn mở tab mới và hiện modal cấp phép
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Block external links (HTML and JS) and show modal for permission
// @author       Rpyon
// @icon         https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/botim-icon.png
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562888/Ch%E1%BA%B7n%20m%E1%BB%9F%20tab%20m%E1%BB%9Bi%20v%C3%A0%20hi%E1%BB%87n%20modal%20c%E1%BA%A5p%20ph%C3%A9p.user.js
// @updateURL https://update.greasyfork.org/scripts/562888/Ch%E1%BA%B7n%20m%E1%BB%9F%20tab%20m%E1%BB%9Bi%20v%C3%A0%20hi%E1%BB%87n%20modal%20c%E1%BA%A5p%20ph%C3%A9p.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Danh sách các domain bên ngoài được phép mở mà không cần modal
    const allowedExternalDomains = [
        'facebook.com',
    ];

    // Lấy domain gốc của trang hiện tại
    const currentDomain = window.location.hostname;

    // Tạo modal
    const modalConfig = {
        overlayColor: 'rgba(0, 0, 0, 0.75)',
        zIndex: 10000,

        modal: {
            background: '#1e1e1e',
            textColor: '#f5f5f5',
            borderRadius: '10px',
            padding: '24px',
            width: '360px',
            fontSize: '16px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.6)'
        },

        button: {
            fontSize: '15px',
            padding: '10px 18px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer'
        },

        allowButton: {
            background: '#4CAF50',
            color: '#ffffff'
        },

        denyButton: {
            background: '#444',
            color: '#ffffff'
        }
    };
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.inset = '0';
    modal.style.backgroundColor = modalConfig.overlayColor;
    modal.style.display = 'none';
    modal.style.zIndex = modalConfig.zIndex;

    modal.innerHTML = `
    <div style="
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: ${modalConfig.modal.width};
        padding: ${modalConfig.modal.padding};
        background: ${modalConfig.modal.background};
        color: ${modalConfig.modal.textColor};
        border-radius: ${modalConfig.modal.borderRadius};
        text-align: center;
        font-size: ${modalConfig.modal.fontSize};
        box-shadow: ${modalConfig.modal.boxShadow};
    ">
        <p id="modalMessage" style="margin-bottom: 20px;"></p>

        <button id="allowLinkBtn" style="
            font-size: ${modalConfig.button.fontSize};
            padding: ${modalConfig.button.padding};
            border-radius: ${modalConfig.button.borderRadius};
            border: ${modalConfig.button.border};
            cursor: ${modalConfig.button.cursor};
            background: ${modalConfig.allowButton.background};
            color: ${modalConfig.allowButton.color};
            margin-right: 10px;
        ">
            Mở liên kết
        </button>

        <button id="denyLinkBtn" style="
            font-size: ${modalConfig.button.fontSize};
            padding: ${modalConfig.button.padding};
            border-radius: ${modalConfig.button.borderRadius};
            border: ${modalConfig.button.border};
            cursor: ${modalConfig.button.cursor};
            background: ${modalConfig.denyButton.background};
            color: ${modalConfig.denyButton.color};
        ">
            Không mở
        </button>
    </div>
`;

    document.body.appendChild(modal);

    let linkToOpen = null;
    let originalOpen = window.open; // Lưu hàm window.open gốc

    // Hàm xử lý mở liên kết
    const allowLink = () => {
        if (linkToOpen) {
            originalOpen(linkToOpen, '_blank'); // Sử dụng hàm gốc để mở
            linkToOpen = null;
        }
        modal.style.display = 'none';
    };

    // Hàm từ chối mở liên kết
    const denyLink = () => {
        linkToOpen = null;
        modal.style.display = 'none';
    };

    // Gán sự kiện cho các nút
    document.getElementById('allowLinkBtn').addEventListener('click', allowLink);
    document.getElementById('denyLinkBtn').addEventListener('click', denyLink);

    // Ngăn chặn mở tab mới khi click vào liên kết ngoài qua HTML
    document.addEventListener('click', function(event) {
        const anchor = event.target.closest('a');
        if (anchor && anchor.href && anchor.protocol.startsWith('http')) {
            try {
                const linkDomain = new URL(anchor.href).hostname;
                if (linkDomain !== currentDomain && !allowedExternalDomains.includes(linkDomain)) {
                    event.preventDefault();
                    linkToOpen = anchor.href;
                    document.getElementById('modalMessage').innerHTML = `Bạn có muốn mở liên kết:<br> ${anchor.href}?<br>`;
                    modal.style.display = 'block';
                }
            } catch (error) {
                console.log('Invalid URL:', anchor.href); // Xử lý lỗi URL không hợp lệ
            }
        }
    });

    // Xóa thuộc tính `target="_blank"` của các liên kết để tránh mở tab mới ngoài ý muốn
    document.querySelectorAll('a[target="_blank"]').forEach(link => {
        link.removeAttribute('target');
    });

    // Ghi đè window.open để kiểm tra và chặn các liên kết ngoài
    window.open = function(url, target, features) {
        if (target === '_blank') {
            try {
                const linkDomain = new URL(url).hostname;
                if (linkDomain !== currentDomain && !allowedExternalDomains.includes(linkDomain)) {
                    linkToOpen = url;
                    //document.getElementById('modalMessage').innerHTML = `Bạn có muốn mở liên kết:<br> ${url}?<br>`;
                    //modal.style.display = 'block';
                    return null; // Ngăn chặn mở liên kết
                }
            } catch (error) {
                console.log('Invalid URL in window.open:', url); // Xử lý lỗi URL không hợp lệ
            }
        }
        // Nếu không bị chặn, gọi hàm gốc
        return originalOpen.apply(window, arguments);
    };

})();