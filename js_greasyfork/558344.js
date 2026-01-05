// ==UserScript==
// @name         Fshare Craw – Quét Subfolder
// @namespace    https://greasyfork.org/vi/users/1546023-dark-tina
// @version      3.0
// @description  Quét toàn bộ subfolder Fshare (subfolder các cấp, không lấy link file), hiển thị panel điều khiển + trạng thái.
// @match        https://www.fshare.vn/folder/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558344/Fshare%20Craw%20%E2%80%93%20Qu%C3%A9t%20Subfolder.user.js
// @updateURL https://update.greasyfork.org/scripts/558344/Fshare%20Craw%20%E2%80%93%20Qu%C3%A9t%20Subfolder.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let origin = location.origin;
    let visited = new Set();
    let folderLinks = new Set();
    let isRunning = false;

    let statusTextEl = null;
    let countTextEl = null;
    let startBtn = null;
    let resetBtn = null;

    function updateStatus(message, count) {
        if (statusTextEl) statusTextEl.textContent = message;
        if (typeof count === 'number' && countTextEl) {
            countTextEl.textContent = 'Đã quét: ' + count + ' folder';
        }
    }

    function createPanel() {
        const panel = document.createElement('div');
        panel.style.position = 'fixed';
        panel.style.bottom = '10px';
        panel.style.right = '10px';
        panel.style.zIndex = '999999';
        panel.style.background = 'rgba(0, 0, 0, 0.75)';
        panel.style.color = '#fff';
        panel.style.padding = '8px 10px';
        panel.style.borderRadius = '6px';
        panel.style.fontSize = '12px';
        panel.style.fontFamily = 'sans-serif';
        panel.style.minWidth = '220px';
        panel.style.boxShadow = '0 0 6px rgba(0,0,0,0.5)';

        const title = document.createElement('div');
        title.textContent = 'Fshare Recursive Scanner';
        title.style.fontWeight = 'bold';
        title.style.marginBottom = '4px';

        statusTextEl = document.createElement('div');
        statusTextEl.textContent = 'Trạng thái: Đã sẵn sàng';
        statusTextEl.style.marginBottom = '2px';

        countTextEl = document.createElement('div');
        countTextEl.textContent = 'Đã quét: 0 folder';
        countTextEl.style.marginBottom = '6px';

        const btnRow = document.createElement('div');

        startBtn = document.createElement('button');
        startBtn.textContent = 'Bắt đầu quét';
        startBtn.style.fontSize = '11px';
        startBtn.style.marginRight = '4px';
        startBtn.style.cursor = 'pointer';

        resetBtn = document.createElement('button');
        resetBtn.textContent = 'Reset';
        resetBtn.style.fontSize = '11px';
        resetBtn.style.cursor = 'pointer';

        [startBtn, resetBtn].forEach(btn => {
            btn.style.border = 'none';
            btn.style.borderRadius = '4px';
            btn.style.padding = '3px 6px';
        });

        startBtn.onclick = () => {
            if (isRunning) return;
            startScan().catch(err => {
                console.error(err);
                updateStatus('Lỗi khi quét (xem console).', folderLinks.size);
                isRunning = false;
                startBtn.disabled = false;
            });
        };

        resetBtn.onclick = () => {
            if (isRunning) {
                alert('Đang quét, đợi xong rồi hãy reset.');
                return;
            }
            visited = new Set();
            folderLinks = new Set();
            updateStatus('Đã reset. Sẵn sàng quét lại.', 0);
        };

        btnRow.appendChild(startBtn);
        btnRow.appendChild(resetBtn);

        panel.appendChild(title);
        panel.appendChild(statusTextEl);
        panel.appendChild(countTextEl);
        panel.appendChild(btnRow);

        document.body.appendChild(panel);
    }

    async function startScan() {
        const m = location.pathname.match(/\/folder\/([^/?#]+)/);
        if (!m) {
            alert('Không nhận ra mã folder trong URL!');
            return;
        }

        // Mỗi lần bấm "Bắt đầu quét" là reset state
        visited = new Set();
        folderLinks = new Set();

        const rootCode = m[1];
        isRunning = true;
        if (startBtn) startBtn.disabled = true;

        updateStatus('Đang quét, vui lòng đợi...', 0);

        await walkFolder(rootCode);

        isRunning = false;
        if (startBtn) startBtn.disabled = false;

        if (!folderLinks.size) {
            updateStatus('Không tìm được subfolder nào.', 0);
            alert('Không tìm được subfolder nào.\nCó thể folder rỗng hoặc API đổi cấu trúc / không đủ quyền.');
            return;
        }

        updateStatus('Hoàn tất. Tổng: ' + folderLinks.size + ' folder.', folderLinks.size);

        // Tự tải file txt
        const text = Array.from(folderLinks).join('\n');
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'fshare_folders.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        alert('✅ Đã xuất ' + folderLinks.size + ' link FOLDER vào fshare_folders.txt');
    }

    async function walkFolder(code) {
        if (!code || visited.has(code) || !isRunning) return;
        visited.add(code);

        const apiUrl = origin +
            '/api/v3/files/folder?linkcode=' +
            encodeURIComponent(code) +
            '&sort=type%2Cname';

        updateStatus('Đang quét folder code: ' + code, folderLinks.size);

        let res;
        try {
            res = await fetch(apiUrl, { credentials: 'include' });
        } catch (e) {
            console.warn('Fetch lỗi cho code', code, e);
            return;
        }

        if (!res.ok) {
            console.warn('API lỗi cho code', code, res.status);
            return;
        }

        const data = await res.json();
        const rawItems = data.items || data.children || data.data;
        if (!Array.isArray(rawItems)) {
            console.log('Code', code, 'không có items → bỏ qua');
            return;
        }

        // Đây là folder hợp lệ → lưu lại
        const thisFolderUrl = origin + '/folder/' + code;
        folderLinks.add(thisFolderUrl);
        updateStatus('Đang quét folder code: ' + code, folderLinks.size);

        for (const item of rawItems) {
            if (!isRunning) return;

            const childCode =
                item.linkcode || item.link_code || item.code;
            if (!childCode) continue;

            // Đệ quy xuống: API sẽ tự cho biết đó là folder/file,
            // nhưng vì mình chỉ quan tâm folder nên chỉ quét khi nó có items.
            await walkFolder(childCode);
        }
    }

    window.addEventListener('load', () => {
        createPanel();
        updateStatus('Đã sẵn sàng. Bấm "Bắt đầu quét".', 0);
    });
})();
