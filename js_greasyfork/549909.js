// ==UserScript==
// @name         Tiencut - KiotViet
// @namespace    http://tampermonkey.net/
// @version      4
// @description  Thêm ô nhập tìm kiếm fuzzy dưới tiêu đề "Tên sản phẩm" cho table SPA KiotViet
// @author       You
// @match        https://0867071703.kiotviet.vn/man/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549909/Tiencut%20-%20KiotViet.user.js
// @updateURL https://update.greasyfork.org/scripts/549909/Tiencut%20-%20KiotViet.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Tải Fuse.js nếu cần
    function loadFuseJs(callback) {
        if (window.Fuse) callback();
        else {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/fuse.js/dist/fuse.min.js';
            script.onload = callback;
            document.head.appendChild(script);
        }
    }

    // Chèn input vào div wrapper phía trên bảng
    function insertInputOnWrapper() {
        const wrapper = document.querySelector('.k-grid-content.k-auto-scrollable');
        if (!wrapper) return;

        // Tìm/cấm tạo nhiều input
        if (wrapper.querySelector('#spa-fuzzy-search-input-external')) return;

        // Tạo input filter và style nhỏ gọn
        const input = document.createElement('input');
        input.type = 'text';
        input.id = 'spa-fuzzy-search-input-external';
        input.style = 'width:220px;padding:2px 7px;font-size:1em;margin:5px 8px;';
        input.placeholder = 'Fuzzy lọc tên sản phẩm...';

        // Thêm vào đầu wrapper/table hoặc trước table
        wrapper.prepend(input);

        let fuse, allRowsData, nameColIdx = -1;

        function getTableContext() {
            const table = wrapper.querySelector('table');
            if (!table) return null;
            const tbody = table.querySelector('tbody');
            if (!tbody) return null;
            // Dò lại col index mỗi lần có table mới
            if (nameColIdx === -1) {
                const firstRow = tbody.querySelector('tr');
                if (!firstRow) return null;
                const tds = Array.from(firstRow.children);
                nameColIdx = tds.findIndex(td => td.classList && td.classList.contains('cell-auto'));
            }
            if (nameColIdx === -1) return null;
            return { table, tbody, nameColIdx };
        }
        function getRowsData() {
            const ctx = getTableContext();
            if (!ctx) return [];
            const {tbody, nameColIdx} = ctx;
            return Array.from(tbody.querySelectorAll('tr')).map(tr => {
                const tds = Array.from(tr.children);
                const name = tds[nameColIdx] ? tds[nameColIdx].textContent.trim() : '';
                return {tr, name};
            });
        }
        function updateFuse() {
            allRowsData = getRowsData();
            fuse = new Fuse(allRowsData, { keys: ['name'], threshold: 0.4, ignoreLocation: true });
        }
        // Gắn filter
        input.addEventListener('input', function() {
            updateFuse();
            const keyword = input.value.trim();
            let matchedRows = allRowsData;
            if (keyword) {
                matchedRows = fuse.search(keyword).map(r => r.item);
            }
            allRowsData.forEach(rowObj => {
                rowObj.tr.style.display = matchedRows.includes(rowObj) ? '' : 'none';
            });
        });
        input.addEventListener('keydown', e => {
            if (e.key === "Escape") {
                input.value = "";
                updateFuse();
                allRowsData.forEach(rowObj => { rowObj.tr.style.display = ''; });
            }
        });
    }

    // Observer thay đổi wrapper/table luôn giữ input còn trên UI
    function observeWrapper() {
        const wrapper = document.querySelector('.k-grid-content.k-auto-scrollable');
        if (!wrapper) return;
        loadFuseJs(insertInputOnWrapper);

        new MutationObserver(() => {
            loadFuseJs(insertInputOnWrapper);
        }).observe(wrapper, {childList: true, subtree: true});
    }

    // Đặt observer trên document body, khi có wrapper/table thì observe tiếp wrapper
    new MutationObserver(observeWrapper).observe(document.body, {childList: true, subtree: true});
    // Kiểm tra lần đầu
    observeWrapper();

})();



