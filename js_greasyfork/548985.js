// ==UserScript==
// @name         Tiến cụt - HUFLIS: NNKC
// @namespace    http://tampermonkey.net/
// @version      5.2
// @description  HUFLIS: tìm kiếm bảng, dropdown Tiết học, tô đỏ dòng đã ĐK đủ slot
// @author       tiencut (viet script by Tiencut)
// @license      MIT
// @icon         https://flts.huflis.edu.vn/favicon.ico
// @match        https://flts.huflis.edu.vn/Student/ChooseCourse*
// @downloadURL https://update.greasyfork.org/scripts/548985/Ti%E1%BA%BFn%20c%E1%BB%A5t%20-%20HUFLIS%3A%20NNKC.user.js
// @updateURL https://update.greasyfork.org/scripts/548985/Ti%E1%BA%BFn%20c%E1%BB%A5t%20-%20HUFLIS%3A%20NNKC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const MAX_PAGES = 5; // Số trang muốn crawl

    setTimeout(async function() {
        const table = document.querySelector('table.table_data');
        if (!table) return;
        const thead = table.tHead;
        const tbody = table.tBodies[0];
        if (!thead || !tbody) return;

        // Tạo filter row nếu chưa có (đủ 9 cell)
        if (thead.rows.length < 3) {
            const filterRow = thead.insertRow(-1);
            for (let i = 0; i < 9; i++) {
                let cell = document.createElement('td');
                if (i === 1) {
                    let input = document.createElement('input');
                    input.type = "text";
                    input.placeholder = "Tìm Giảng viên";
                    input.style.width = "90%";
                    input.style.marginTop = "4px";
                    cell.appendChild(input);
                }
                if (i === 2) {
                    let input = document.createElement('input');
                    input.type = "text";
                    input.placeholder = "Tìm Thứ";
                    input.style.width = "90%";
                    input.style.marginTop = "4px";
                    cell.appendChild(input);
                }
                if (i === 3) {
                    let input = document.createElement('input');
                    input.type = "text";
                    input.placeholder = "Tìm Phòng";
                    input.style.width = "90%";
                    input.style.marginTop = "4px";
                    cell.appendChild(input);
                }
                if (i === 4) {
                    let input = document.createElement('input');
                    input.type = "text";
                    input.placeholder = "Tìm Tiết học";
                    input.style.width = "90%";
                    input.style.marginTop = "4px";
                    input.setAttribute("autocomplete","off");
                    input.id = "autocomplete-tiet-hoc";
                    cell.appendChild(input);
                    let suggestDiv = document.createElement('div');
                    suggestDiv.style.position = "relative";
                    suggestDiv.id = "suggest-container-tiet-hoc";
                    cell.appendChild(suggestDiv);
                }
                filterRow.appendChild(cell);
            }
        }
        const filterRow = thead.rows[2];
        const inpGv = filterRow.cells[1].querySelector('input');
        const inpThu = filterRow.cells[2].querySelector('input');
        const inpPhong = filterRow.cells[3].querySelector('input');
        const inpTiet = filterRow.cells[4].querySelector('input');
        const suggestDiv = filterRow.cells[4].querySelector('div');
        const inputs = [inpGv, inpThu, inpPhong, inpTiet];
        const colIdx = [1, 2, 3, 4];

        // Crawl dữ liệu nhiều page
        let allRows = [];
        async function fetchPages() {
            let links = [];
            let base = location.origin + location.pathname + '?page=';
            for(let i = 1; i <= MAX_PAGES; i++)
                links.push(base + i);
            let reqs = links.map(link =>
                fetch(link, {credentials: "include"})
                    .then(r=>r.text())
                    .then(html=>{
                        let parser = new DOMParser();
                        let doc = parser.parseFromString(html,"text/html");
                        let tb = doc.querySelector('table.table_data');
                        if(!tb) return [];
                        let body = tb.tBodies[0];
                        if (!body) return [];
                        return Array.from(body.rows).map(tr=>{
                            let d = Array.from(tr.cells).map(t=>t.innerText.trim());
                            d._html = tr.outerHTML;
                            return d;
                        });
                    })
            );
            let results = await Promise.all(reqs);
            allRows = [].concat(...results);
        }
        await fetchPages();

        // Tìm các giá trị unique của Tiết học (cột 4)
        let tietHocArr = Array.from(new Set(allRows.map(row => row[4]).filter(s=>s)));
        tietHocArr.sort((a,b)=>a.localeCompare(b,'vi'));

        // Hàm render với dòng full slot sẽ tô đỏ
        function renderFiltered() {
            let filters = inputs.map(inp=>inp && inp.value.trim().toLowerCase() || "");
            let filteredRows = allRows.filter(rowArr=>{
                for (let k=0; k<colIdx.length; k++) {
                    let kw = filters[k];
                    if (kw && !rowArr[colIdx[k]].toLowerCase().includes(kw)) return false;
                }
                return true;
            });
            tbody.innerHTML = filteredRows.map(row => {
                // Tối đa ở cột 6, Đã ĐK ở cột 7 (index tính từ 0)
                let daDK = parseInt(row[7]);
                let toiDa = parseInt(row[6]);
                let isFull = !isNaN(daDK) && !isNaN(toiDa) && daDK >= toiDa;
                let html = row._html;
                if(isFull) {
                    html = html.replace(/^<tr/, '<tr style="background-color: #ffeaea;color:#b80000;font-weight:bold;" title="Lớp đã đầy slot!"');
                }
                return html;
            }).join('');
        }

        // Suggestion handler cho input Tiết học (dropdown)
        function showSuggestionsTietHoc(val) {
            suggestDiv.innerHTML = "";
            if (!val && tietHocArr.length === 0) return;
            let filtered = tietHocArr.filter(item => item.toLowerCase().includes(val.toLowerCase()));
            if(filtered.length === 0) return;
            let list = document.createElement('div');
            list.style.position = "absolute";
            list.style.background = "#fff";
            list.style.border = "1px solid #aaa";
            list.style.zIndex = 1000;
            list.style.width = inpTiet.offsetWidth + "px";
            filtered.forEach(item => {
                let o = document.createElement('div');
                o.textContent = item;
                o.style.padding = "4px 8px";
                o.style.cursor = "pointer";
                o.onmousedown = function(e){
                    e.preventDefault();
                    inpTiet.value = item;
                    renderFiltered();
                    suggestDiv.innerHTML = "";
                };
                list.appendChild(o);
            });
            suggestDiv.appendChild(list);
        }

        // Sự kiện cho input Tiết học
        inpTiet.addEventListener('focus', function(){
            showSuggestionsTietHoc(this.value);
        });
        inpTiet.addEventListener('input', function(){
            showSuggestionsTietHoc(this.value);
            renderFiltered();
        });
        inpTiet.addEventListener('blur',function(){
            setTimeout(() => {suggestDiv.innerHTML = "";},150);
        });

        // 3 input còn lại
        [inpGv, inpThu, inpPhong].forEach(inp => inp.addEventListener('input', renderFiltered));

        // Lọc lần đầu
        renderFiltered();

    }, 1);
})();
