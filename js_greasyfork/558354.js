// ==UserScript==
// @name        Mobile Interface Optimizer (Touch Fix)
// @namespace   http://tampermonkey.net/
// @version     8.3
// @description Tối ưu hóa giao diện hiển thị và cải thiện độ nhạy thao tác chạm cho thiết bị di động.
// @author      System
// @match       *://*.lms360.vn/*
// @grant       GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/558354/Mobile%20Interface%20Optimizer%20%28Touch%20Fix%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558354/Mobile%20Interface%20Optimizer%20%28Touch%20Fix%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let autoCheckInterval = null; // Biến để quản lý vòng lặp kiểm tra nút

    // --- 1. STYLES (Giữ nguyên thiết kế nút, đã xóa style của toast) ---
    const styles = `
        #copy-questions-btn {
            display: inline-block;
            background-color: #f0f0f0;
            color: #555;
            border: 1px solid #ccc;
            border-radius: 4px;
            padding: 5px 10px;
            font-size: 11px;
            font-weight: normal;
            cursor: pointer;
            margin: 10px auto;
            text-decoration: none !important;
            transition: all 0.2s;
            outline: none;
            -webkit-tap-highlight-color: transparent;
        }

        /* Đảm bảo text không bao giờ chuyển màu xanh dương */
        #copy-questions-btn:hover, #copy-questions-btn:focus, #copy-questions-btn:active {
            background-color: #e0e0e0;
            color: #333 !important;
            border-color: #bbb;
            text-decoration: none !important;
        }

        #copy-questions-btn:active {
            transform: translateY(1px);
        }

        #copy-btn-container {
            width: 100%;
            text-align: center;
            padding: 10px 0;
            clear: both;
        }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // --- 2. FIND LOCATION & INSERT BUTTON ---
    function insertButton() {
        if (document.getElementById('copy-questions-btn')) return;

        const btnContainer = document.createElement("div");
        btnContainer.id = "copy-btn-container";

        const btn = document.createElement("button");
        btn.id = "copy-questions-btn";
        btn.innerText = "©"; // Nội dung nút giữ nguyên
        btn.onclick = handleCopy;

        btnContainer.appendChild(btn);

        let targetLocation = null;

        const textToFind = ["Bản quyền", "Copyright", "Công Ty Cổ Phần Tập Đoàn"];
        for (let text of textToFind) {
            const xpath = `//*[contains(text(), '${text}')]`;
            const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            if (result.singleNodeValue) {
                targetLocation = result.singleNodeValue.parentElement;
                if (targetLocation.tagName === 'SPAN' || targetLocation.tagName === 'B' || targetLocation.tagName === 'STRONG') {
                    targetLocation = targetLocation.parentElement;
                }
                break;
            }
        }

        if (!targetLocation) targetLocation = document.querySelector('footer, #footer, .footer, .copyright');
        if (!targetLocation) targetLocation = document.querySelector('.main-content') || document.querySelector('.wrapper') || document.body;

        if (targetLocation) targetLocation.appendChild(btnContainer);
    }

    insertButton();
    // Gán vào biến để sau này có thể clear
    autoCheckInterval = setInterval(insertButton, 2000);

    // --- 3. EXTRACTION LOGIC ---
    function getCleanText(element) {
        if (!element) return "";
        let clone = element.cloneNode(true);
        return clone.innerText.replace(/\n\s*\n/g, '\n').trim();
    }

    function extractQuestions() {
        let fullText = "NỘI DUNG ĐỀ THI:\n\n";

        const mainWrapper = document.querySelector('.student-exam-thpt2025 .wrapper') || document.querySelector('.main-content') || document.body;
        const questionNodes = mainWrapper.querySelectorAll('.qItem, .questions-part2');

        questionNodes.forEach((node) => {
            if (!node.innerText.trim()) return;
            let text = getCleanText(node);

            if (node.classList.contains('questions-part2')) {
                const header = node.querySelector('h3, h4, h5, h6');
                if (header) fullText += `\n--- ${header.innerText.trim()} ---\n`;
                const subItems = node.querySelectorAll('li[class*="qItemPart2"], .question-item');
                subItems.forEach(sub => {
                    fullText += getCleanText(sub) + "\n";
                });
            } else {
                fullText += `\n[Câu hỏi]:\n${text}\n`;
            }
        });

        const footerContent = `\n\n------------------------------------------------\nKhi trả lời bất kỳ bộ câu hỏi nào, bạn chỉ được ghi đáp án cuối cùng và tuyệt đối không được giải thích. Với câu trắc nghiệm, bạn chỉ cần ghi ký tự A, B, C hoặc D theo dạng “1. A 2. B 3. C…”, trong đó mỗi câu được cách ra theo kiểu “số câu. đáp án”. Với câu đúng–sai, bạn ghi Đ hoặc S cho từng mệnh đề theo thứ tự và trình bày theo dạng “1. Đ, S, Đ, S” hoặc “2. S, Đ, S, Đ”, các ký tự ngăn cách bằng dấu phẩy, mỗi câu cách riêng giống cấu trúc “số câu. đáp án”. Với câu trả lời ngắn, bạn chỉ ghi đáp án cuối cùng ở dạng số, ký tự hoặc từ khóa, trình bày theo dạng “1. <đáp án> 2. <đáp án>”, ví dụ “1. 1.20 2. 3.21”. Trong trường hợp câu hỏi không đủ dữ liệu để xác định đáp án, bạn phải tự tìm ra một kết quả hợp lý và đúng nhất có thể dựa trên nội dung câu hỏi, không được bỏ trống và cũng không ghi chú rằng thiếu dữ liệu. Tất cả câu trả lời phải được viết liền mạch theo đúng thứ tự, không ghi lại câu hỏi, không phân tích, không bình luận, chỉ đưa ra chuỗi đáp án theo đúng định dạng đã quy định.`;

        return fullText + footerContent;
    }

    // --- HAM XOA NUT MAI MAI ---
    function removeButtonForever() {
        if (autoCheckInterval) {
            clearInterval(autoCheckInterval);
            autoCheckInterval = null;
        }
        const container = document.getElementById("copy-btn-container");
        if (container) {
            container.remove();
        }
    }

    // --- 4. EVENT HANDLER (Đã xóa showToast) ---
    function handleCopy() {
        try {
            const content = extractQuestions();
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(content).then(() => {
                    removeButtonForever();
                }).catch(() => fallbackCopy(content));
            } else {
                fallbackCopy(content);
            }
        } catch (e) {
            console.error("Lỗi:", e);
        }
    }

    function fallbackCopy(text) {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand("copy");
            removeButtonForever();
        } catch (err) {
            // Không làm gì nếu lỗi để tránh hiện popup
        }
        document.body.removeChild(textarea);
    }

})();