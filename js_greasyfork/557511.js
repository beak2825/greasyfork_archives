// ==UserScript==
// @name        Turnitin Auto Submit (Sequential + Limit 3 + Reset Data)
// @namespace    http://tampermonkey.net/
// @version      4.4
// @description  Chọn file -> Chọn Student lần lượt (max 3) -> Có nút Reset về 0
// @author       You
// @match        https://www.turnitin.com/t_submit.asp*
// @match        https://*.turnitin.com/*submit*
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/557511/Turnitin%20Auto%20Submit%20%28Sequential%20%2B%20Limit%203%20%2B%20Reset%20Data%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557511/Turnitin%20Auto%20Submit%20%28Sequential%20%2B%20Limit%203%20%2B%20Reset%20Data%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===================== CSS =====================
    const css = `
        #turnitin-auto-panel { position: fixed; bottom: 20px; right: 20px; z-index: 9999999; font-family: sans-serif; }
        #turnitin-toggle-btn { width: 50px; height: 50px; border-radius: 50%; background: #2980b9; color: white; border: none; font-size: 24px; cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display:none; }

        #turnitin-main-box { display: none; position: absolute; bottom: 0; right: 0; width: 380px; background: white; border-radius: 8px; box-shadow: 0 5px 30px rgba(0,0,0,0.4); overflow: hidden; border: 1px solid #ddd; }
        #turnitin-main-box.active { display: block; }

        .t-header { background: #2980b9; color: white; padding: 12px 15px; font-weight: bold; display: flex; justify-content: space-between; align-items: center; }
        .t-body { padding: 15px; max-height: 500px; overflow-y: auto; }

        .t-btn { width: 100%; padding: 12px; border: none; border-radius: 5px; cursor: pointer; margin-bottom: 8px; font-weight: bold; font-size: 14px; transition: background 0.2s; text-transform: uppercase; color: white; }
        .btn-select { background: #e67e22; box-shadow: 0 3px 0 #d35400; }
        .btn-select:active { box-shadow: none; transform: translateY(3px); }

        .btn-clear { background: #95a5a6; font-size: 12px; padding: 10px; }
        .btn-reset { background: #c0392b; font-size: 12px; padding: 10px; }

        .t-file-list { border: 1px solid #eee; padding: 5px; margin-bottom: 10px; border-radius: 4px; max-height: 150px; overflow-y: auto; background: #f9f9f9; }
        .t-file-item { font-size: 12px; padding: 8px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; }
        .t-current { background-color: #d5f5e3; font-weight:bold; color: #27ae60; border-left: 4px solid #27ae60; }

        .t-log-box { font-size: 11px; background: #34495e; color: #ecf0f1; padding: 8px; border-radius: 4px; height: 120px; overflow-y: auto; font-family: monospace; margin-top:5px; border: 1px solid #2c3e50; }
        .t-status-indicator { text-align:center; font-size: 13px; font-weight: bold; color: #7f8c8d; margin-bottom: 10px; }
        .t-running { color: #e74c3c; animation: blink 1s infinite; }

        .t-row-btn { display: flex; gap: 5px; }

        @keyframes blink { 50% { opacity: 0.5; } }
    `;
    GM_addStyle(css);

    // ===================== DATA =====================
    const firstNames = ['Nguyen', 'Tran', 'Le', 'Pham', 'Hoang', 'Huynh', 'Phan', 'Vu', 'Vo', 'Dang'];
    const lastNames = ['Van A', 'Thi B', 'Minh C', 'Duc D', 'Anh E', 'Tuan F', 'Hung G', 'Linh H'];
    let selectedFiles = [];
    let isProcessing = false;

    // ===================== HELPERS =====================
    function log(msg) {
        const box = document.getElementById('t-log-box');
        if (box) {
            const time = new Date().toLocaleTimeString();
            box.innerHTML += `<div>[${time}] ${msg}</div>`;
            box.scrollTop = box.scrollHeight;
        }
        console.log(`[AutoTurnitin] ${msg}`);
    }

    function setNativeValue(element, value) {
        if (!element) return;
        const prototype = Object.getPrototypeOf(element);
        const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value').set;
        if (prototypeValueSetter) prototypeValueSetter.call(element, value);
        else element.value = value;
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
        element.dispatchEvent(new Event('blur', { bubbles: true }));
    }

    function waitForElement(selector, timeout = 60000) {
        return new Promise((resolve, reject) => {
            const intervalTime = 500;
            let elapsed = 0;
            const check = setInterval(() => {
                const el = document.querySelector(selector);
                if (el && el.offsetParent !== null && !el.disabled) {
                    clearInterval(check);
                    resolve(el);
                }
                elapsed += intervalTime;
                if (elapsed >= timeout) {
                    clearInterval(check);
                    reject(new Error(`Timeout: ${selector}`));
                }
            }, intervalTime);
        });
    }

    function updateStatus(msg, isRunning = false) {
        const el = document.getElementById('t-status-text');
        if (el) {
            el.innerText = msg;
            el.className = `t-status-indicator ${isRunning ? 't-running' : ''}`;
        }
    }

    // ===================== LOGIC USER SELECT (SEQUENTIAL) =====================
    async function selectStudentLogic() {
        const select = document.getElementById('userID');
        if (!select) {
            log('⚠️ Không tìm thấy select box UserID. Bỏ qua chọn student.');
            return false;
        }

        const options = Array.from(select.options).filter(opt => opt.value !== "");

        if (options.length === 0) {
            log('⚠️ Danh sách Student rỗng.');
            return false;
        }

        // --- LOAD DATA ---
        let usageData = JSON.parse(localStorage.getItem('turnitin_student_usage') || '{}');
        let lastIndex = parseInt(localStorage.getItem('turnitin_last_index') || '-1');

        const getEmail = (text) => {
            const match = text.match(/\(([^)]+)\)$/);
            return match ? match[1] : text;
        };

        let foundOption = null;
        let newIndex = -1;

        // --- THUẬT TOÁN TÌM TUẦN TỰ ---
        for (let i = 1; i <= options.length; i++) {
            let currentIndex = (lastIndex + i) % options.length;
            let opt = options[currentIndex];
            let email = getEmail(opt.text);
            let usedCount = usageData[email] || 0;

            if (usedCount < 3) {
                foundOption = opt;
                newIndex = currentIndex;
                break;
            }
        }

        // --- RESET NẾU FULL ---
        if (!foundOption) {
            log('♻️ Tất cả User đã dùng 3 lần. TỰ ĐỘNG RESET VỀ 0!');
            usageData = {};
            localStorage.setItem('turnitin_student_usage', JSON.stringify(usageData));

            localStorage.setItem('turnitin_last_index', '-1');
            newIndex = 0;
            foundOption = options[0];
        }

        // --- ÁP DỤNG ---
        const chosenEmail = getEmail(foundOption.text);
        usageData[chosenEmail] = (usageData[chosenEmail] || 0) + 1;

        localStorage.setItem('turnitin_student_usage', JSON.stringify(usageData));
        localStorage.setItem('turnitin_last_index', newIndex.toString());

        log(`👤 Chọn [${newIndex + 1}/${options.length}]: ${chosenEmail} (Lần ${usageData[chosenEmail]})`);

        setNativeValue(select, foundOption.value);
        await new Promise(r => setTimeout(r, 1500));
        return true;
    }

    // ===================== LOGIC AUTOMATION =====================
    async function step1_FillAndUpload(file) {
        log(`➡️ FILE: ${file.name}`);
        const studentSelected = await selectStudentLogic();

        const inputs = {
            first: document.querySelector('input[name="author_first"]') || document.getElementById('author_first'),
            last: document.querySelector('input[name="author_last"]') || document.getElementById('author_last'),
            title: document.querySelector('input[name="title"]') || document.getElementById('title'),
            file: document.querySelector('input[type="file"]') || document.getElementById('userfile')
        };

        if (!inputs.file) throw new Error("Không tìm thấy ô input file!");

        const shouldFillName = !studentSelected || (inputs.first && !inputs.first.disabled && inputs.first.value === "");

        if (shouldFillName) {
            log('✏️ Điền tên Random...');
            if (inputs.first) setNativeValue(inputs.first, firstNames[Math.floor(Math.random() * firstNames.length)]);
            if (inputs.last) setNativeValue(inputs.last, lastNames[Math.floor(Math.random() * lastNames.length)]);
        } else {
            log('ℹ️ Tên đã được tự động điền theo Student.');
        }

        if (inputs.title) {
            let fileName = file.name;
            if (fileName.lastIndexOf('.') > 0) fileName = fileName.substring(0, fileName.lastIndexOf('.'));
            setNativeValue(inputs.title, fileName);
        }

        const dt = new DataTransfer();
        dt.items.add(file);
        inputs.file.files = dt.files;
        inputs.file.dispatchEvent(new Event('change', { bubbles: true }));

        await new Promise(r => setTimeout(r, 1500));

        const uploadBtn = document.querySelector('#upload-btn') || document.querySelector('.button_upload');
        if (uploadBtn) {
            log('🖱️ Click Upload...');
            uploadBtn.click();
        } else {
            throw new Error("Không tìm thấy nút Upload");
        }
    }

    async function step2_ConfirmAndNext() {
        try {
            log('⏳ Chờ Confirm...');
            const confirmBtn = await waitForElement('#confirm-btn');
            await new Promise(r => setTimeout(r, 1000));
            confirmBtn.click();

            log('⏳ Chờ Submit Next...');
            const nextBtn = await waitForElement('#submit-another-btn');
            await new Promise(r => setTimeout(r, 1000));
            nextBtn.click();

            log('⏳ Chờ reset form...');
            await waitForElement('#userID, #author_first');
            return true;
        } catch (e) { throw e; }
    }

    async function runAutoLoop() {
        if (selectedFiles.length === 0) {
            log('🏁 ĐÃ XONG HẾT!');
            updateStatus('SẴN SÀNG', false);
            isProcessing = false;
            return;
        }

        isProcessing = true;
        updateStatus('⛔ ĐANG CHẠY TỰ ĐỘNG...', true);

        try {
            const currentFile = selectedFiles[0];
            renderFiles();
            await step1_FillAndUpload(currentFile);
            await step2_ConfirmAndNext();
            log('✅ Xong 1 file.');
            selectedFiles.shift();
            setTimeout(runAutoLoop, 2000);
        } catch (err) {
            log(`❌ LỖI: ${err.message}`);
            updateStatus('BỊ DỪNG DO LỖI', false);
            isProcessing = false;
        }
    }

    // ===================== GUI & EVENTS =====================
    function renderFiles() {
        const container = document.getElementById('t-files-container');
        container.innerHTML = '';

        if (selectedFiles.length === 0) {
            container.innerHTML = '<div style="text-align:center; color:#999; padding:10px;">Chưa có file</div>';
            return;
        }

        selectedFiles.forEach((f, i) => {
            const div = document.createElement('div');
            div.className = `t-file-item ${i === 0 && isProcessing ? 't-current' : ''}`;
            div.innerHTML = `
                <span style="overflow:hidden; white-space:nowrap; max-width: 280px;">
                    ${i === 0 && isProcessing ? '🔄 ' : '📄 '}${f.name}
                </span>
                ${!isProcessing ? `<span class="t-remove" data-idx="${i}" style="color:red;cursor:pointer">✕</span>` : ''}
            `;
            container.appendChild(div);
        });

        if (!isProcessing) {
            container.querySelectorAll('.t-remove').forEach(btn => {
                btn.onclick = (e) => {
                    selectedFiles.splice(parseInt(e.target.getAttribute('data-idx')), 1);
                    renderFiles();
                };
            });
        }
    }

    function createGUI() {
        const wrapper = document.createElement('div');
        wrapper.id = 'turnitin-auto-panel';
        wrapper.innerHTML = `
            <div id="turnitin-main-box" class="active">
                <div class="t-header">
                    <span>🤖 Auto v4.4 (Reset Data)</span>
                    <span id="t-minimize" style="cursor:pointer; font-size:20px;">_</span>
                </div>
                <div class="t-body">
                    <div id="t-status-text" class="t-status-indicator">SẴN SÀNG</div>

                    <input type="file" id="hidden-file-picker" multiple style="display:none !important;">

                    <button class="t-btn btn-select" id="btn-trigger-select">
                        📂 CHỌN FILE & TỰ CHẠY
                    </button>

                    <div class="t-file-list" id="t-files-container">
                        <div style="text-align:center; color:#999; padding:10px;">Danh sách trống</div>
                    </div>

                    <div class="t-log-box" id="t-log-box"></div>

                    <div class="t-row-btn">
                        <button class="t-btn btn-clear" id="btn-clear-log" style="width:50%">
                            🧹 XÓA LOG VIEW
                        </button>
                        <button class="t-btn btn-reset" id="btn-reset-data" style="width:50%">
                            ♻️ RESET DATA (Về 0)
                        </button>
                    </div>
                </div>
            </div>
            <button id="turnitin-toggle-btn" title="Mở lại">🤖</button>
        `;

        document.body.appendChild(wrapper);

        // UI Logic
        const box = document.getElementById('turnitin-main-box');
        const toggleBtn = document.getElementById('turnitin-toggle-btn');
        document.getElementById('t-minimize').onclick = () => { box.classList.remove('active'); toggleBtn.style.display = 'block'; };
        toggleBtn.onclick = () => { box.classList.add('active'); toggleBtn.style.display = 'none'; };

        // File Selection
        const hiddenInput = document.getElementById('hidden-file-picker');
        const triggerBtn = document.getElementById('btn-trigger-select');
        triggerBtn.onclick = () => hiddenInput.click();

        hiddenInput.onchange = (e) => {
            const newFiles = Array.from(e.target.files);
            if (newFiles.length > 0) {
                selectedFiles = selectedFiles.concat(newFiles);
                renderFiles();
                hiddenInput.value = '';
                if (!isProcessing) {
                    log('🚀 Kích hoạt chạy tự động...');
                    runAutoLoop();
                }
            }
        };

        // === NÚT XÓA LOG VIEW ===
        document.getElementById('btn-clear-log').onclick = () => {
            document.getElementById('t-log-box').innerHTML = '<div>[LOG] Đã xóa màn hình log.</div>';
            console.clear();
        };

        // === NÚT RESET DATA (QUAN TRỌNG) ===
        document.getElementById('btn-reset-data').onclick = () => {
            if(confirm("Bạn có chắc muốn Reset bộ đếm về 0?\n(Lần chạy tới sẽ bắt đầu lại từ User đầu tiên)")) {
                localStorage.removeItem('turnitin_student_usage');
                localStorage.removeItem('turnitin_last_index');

                // Clear luôn màn hình cho sạch
                document.getElementById('t-log-box').innerHTML = '<div>[RESET] Đã xóa dữ liệu lưu trữ.</div>';
                document.getElementById('t-log-box').innerHTML += '<div>[INFO] Lần chạy tới sẽ bắt đầu từ User đầu tiên.</div>';
                console.log('[AutoTurnitin] DATA RESET SUCCESSFUL.');
            }
        };
    }

    if (document.readyState === 'complete') {
        createGUI();
    } else {
        window.addEventListener('load', createGUI);
    }

})();