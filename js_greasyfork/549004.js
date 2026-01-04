// ==UserScript==
// @name         Tiến cụt - HUSC
// @namespace    http://tampermonkey.net/
// @version      2.10
// @description  Tìm kiếm (sinh viên trong danh sách các lớp học phần, học phần trong CTĐT). Rê chuột để xem nhanh thông báo, tin nhắn....
// @author       TienCut
// @license      MIT
// @match        https://student.husc.edu.vn/Studying/Courses/*
// @match        https://student.husc.edu.vn/News*
// @match        https://student.husc.edu.vn/Message/Inbox*
// @match        https://student.husc.edu.vn/TrainingProgram*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/549004/Ti%E1%BA%BFn%20c%E1%BB%A5t%20-%20HUSC.user.js
// @updateURL https://update.greasyfork.org/scripts/549004/Ti%E1%BA%BFn%20c%E1%BB%A5t%20-%20HUSC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Xác định trang
    const isCourses = /\/Studying\/Courses\//.test(location.pathname);
    const isNews = /\/News/.test(location.pathname);
    const isInbox = /\/Message\/Inbox/.test(location.pathname);
    const isTraining = /\/TrainingProgram/.test(location.pathname);


    // Tạo panel Tiến cụt luôn xuất hiện, liệt kê chức năng theo từng trang
    let panel = document.createElement('div');
    panel.id = 'tiencut-panel';
let panelHTML = `
    <div style="padding:11px 16px 13px 16px; background:#fffbe9; border:1.7px solid #ecd9b6; position:fixed; bottom:18px; right:25px; z-index:10010; box-shadow:0 1px 8px #bbb5; border-radius:11px; min-width:170px; max-width:240px;font-size:14px;">
        <div style="font-weight:bold; font-size:15.7px; text-align:center;">
            Tiến cụt
        </div>
        <hr style="border:0; border-top:1.35px solid #f2c77d; margin:8px 0 10px 0;">
        <div id="tiencut-courses" style="display:${isCourses?'':'none'}">
        <div style="font-size:13px">Tìm nhóm sinh viên:</div>
        <input id="findStudentAllClassGroup" type="text" placeholder="Nhập mã SV hoặc tên..." style="width:98%;padding:3px 5px;font-size:12.8px;margin:5px 0 0 0;border:1px solid #b1d18b;border-radius:4px;">
        <div id="findStudentAllClassGroupResult" style="margin:4px 0 0 0;font-size:13.5px;min-height:22px;"></div>
        </div>
        <div id="tiencut-training" style="display:${isTraining?'':'none'}">
            <div>- Tìm kiếm tên học phần, học kỳ</div>
            <input id="searchMon" type="text" placeholder="Tên học phần..." style="width:97%;padding:2px 4px;font-size:12px;margin:7px 0 5px 0;border:1px solid #b1d18b;border-radius:4px;outline:none;box-sizing:border-box">
            <input id="searchHK" type="text" placeholder="Học kỳ..." style="width:97%;padding:2px 4px;font-size:12px;margin-bottom:5px;border:1px solid #b1d18b;border-radius:4px;outline:none;box-sizing:border-box">
        </div>
        <div id="tiencut-inbox" style="display:${isInbox?'':'none'}">
            <div>- Di chuột vào tiêu đề để xem nhanh nội dung tin nhắn</div>
            <input id="searchInboxSender" type="text" placeholder="Tìm theo tên người gửi..." style="width:97%;padding:2px 4px;font-size:12px;margin:7px 0 5px 0;border:1px solid #b1d18b;border-radius:4px;outline:none;box-sizing:border-box">
        </div>
        <div id="tiencut-news" style="display:${isNews?'':'none'}">
            <div>- Di chuột vào link thông báo để xem nhanh nội dung</div>
        </div>
        <hr style="border:0; border-top:1.15px solid #efb35b; margin:10px 0 7px 0;">
        <div style="text-align:center; font-size:13px;color:#666;">
            Góp ý qua
            <a href="https://www.facebook.com/tiencut2711" target="_blank" style="display:inline-block; vertical-align:middle; margin-left:7px;">
                <img src="https://upload.wikimedia.org/wikipedia/commons/6/6c/Facebook_Logo_2023.png" style="height:19px;width:19px;border-radius:3px;vertical-align:middle;margin-bottom:2px;" alt="fb"/>
            </a>
        </div>
    </div>
`;


    panel.innerHTML = panelHTML;
    document.body.appendChild(panel);

    if (isInbox) {
    function filterInboxRows() {
        let table = document.querySelector('table');
        if(!table) return;
        let ths = Array.from(table.querySelectorAll('thead th, tr:first-child th, tr:first-child td'));
        // Tìm chỉ số cột tên người gửi, thường là cột thứ 2 -> thử tìm "người gửi" hoặc "tên" hoặc cột thứ 1 nếu không có
        let senderIdx = ths.findIndex(th => /gửi|sender|tên/i.test(th.textContent));
        if (senderIdx === -1) senderIdx = 1;  // fallback nếu không tìm ra thì là cột 1
        let key = document.getElementById('searchInboxSender').value.trim().toLowerCase();
        table.querySelectorAll('tbody tr').forEach(tr => {
            let tds = tr.querySelectorAll('td');
            if(!tds[senderIdx]) {
                tr.style.display='';
                return;
            }
            let content = tds[senderIdx].textContent.toLowerCase();
            tr.style.display = (!key || content.includes(key)) ? '' : 'none';
        });
    }
    document.getElementById('searchInboxSender').addEventListener('input', filterInboxRows);
    window.addEventListener('DOMContentLoaded', filterInboxRows);
}


    // Nếu là Training Program: filter tìm kiếm
if (isTraining) {
    function filterRowsCTDT() {
        let table = document.querySelector('table');
        if(!table) return;
        let ths = Array.from(table.querySelectorAll('thead th, tr:first-child th, tr:first-child td'));
        let monIndex = ths.findIndex(th => th.textContent.replace(/\s+/g, ' ').toLowerCase().includes('tên học phần') || th.textContent.toLowerCase().includes('môn học'));
        let hkIndex = ths.findIndex(th => /học[\s_-]*kỳ|hk|dự kiến/i.test(th.textContent));
        if(monIndex < 0 || hkIndex < 0) return;
        let nameValue = document.getElementById('searchMon').value.trim().toLowerCase();
        let hkValue = document.getElementById('searchHK').value.trim().toLowerCase();
        table.querySelectorAll('tbody tr').forEach(tr => {
            let tds = tr.querySelectorAll('td');
            if(tds.length<=Math.max(monIndex,hkIndex)) {
                tr.style.display='';
                return;
            }
            let match = true;
            if(nameValue && !tds[monIndex].textContent.toLowerCase().includes(nameValue)) match = false;
            if(hkValue && !tds[hkIndex].textContent.toLowerCase().includes(hkValue)) match = false;
            tr.style.display = match ? '' : 'none';
        });
    }
    document.getElementById('searchMon').addEventListener('input', filterRowsCTDT);
    document.getElementById('searchHK').addEventListener('input', filterRowsCTDT);
    window.addEventListener('DOMContentLoaded', filterRowsCTDT);
}


    // PHẦN CHỨC NĂNG TÙY TRANG
    // -- Nếu Courses: thêm checkbox filter lớp đã đầy
    if (isCourses) {
        let label = document.createElement('label');
        label.style = "display:block; margin:10px 0 5px 0;font-size:13.5px;";
        label.innerHTML = `<input type="checkbox" id="hideFullRows" style="vertical-align:middle; margin-right:4px"> Ẩn lớp đã đầy`;
        panel.querySelector('#tiencut-courses').appendChild(label);

        function parseInfo(cell) {
            let html = cell.innerHTML;
            let matches = html.match(/<b>(\d+)<\/b>.*?\/.*?(\d+)\s*$/i);
            if(matches && matches.length === 3){
                return {dk: parseInt(matches[1],10), td: parseInt(matches[2],10)};
            } else {
                let nums = html.replace(/<[^>]*>/g,'').split('/').map(x=>parseInt(x));
                if(nums.length >= 2){
                    return {dk: nums[0], td: nums[nums.length-1]};
                }
            }
            return null;
        }
        function filterRowsByFullbox() {
            let table = document.querySelector('table.table-striped');
            if (!table) return;
            let ths = Array.from(table.querySelectorAll('thead th'));
            let svIndex = ths.findIndex(th => th.textContent.replace(/\s+/g, ' ').toLowerCase().includes('số sv'));
            table.querySelectorAll('tbody tr').forEach(tr => {
                let tds = tr.querySelectorAll('td');
                if(tds.length<=svIndex) {
                    tr.style.display = '';
                    return;
                }
                let info = parseInfo(tds[svIndex]);
                if(document.getElementById('hideFullRows').checked && info && info.dk >= info.td)
                    tr.style.display = 'none';
                else
                    tr.style.display = '';
            });
        }
        document.getElementById('hideFullRows').addEventListener('change', filterRowsByFullbox);
        window.addEventListener('DOMContentLoaded', filterRowsByFullbox);

        // --- Tìm sinh viên nhóm bất kỳ ---
const inputAllGroup = document.getElementById('findStudentAllClassGroup');
const resultDivAllGroup = document.getElementById('findStudentAllClassGroupResult');
let currentRequestId = 0;

if (inputAllGroup) inputAllGroup.addEventListener('input', function() {
    const keyword = inputAllGroup.value.trim().toLowerCase();
    resultDivAllGroup.innerHTML = '';
    if (keyword.length < 2) {
        if (keyword.length === 0) resultDivAllGroup.innerHTML = '';
        else resultDivAllGroup.innerHTML = '<i>Nhập tối thiểu 2 ký tự...</i>';
        return;
    }
    resultDivAllGroup.innerHTML = '<i>Đang kiểm tra các nhóm...</i>';
    const links = Array.from(document.querySelectorAll('a[href^="/Course/Details/"]'));
    if (!links.length) {
        resultDivAllGroup.innerHTML = '<span style="color:#d00">Không tìm thấy danh sách nhóm học phần để tra cứu!</span>';
        return;
    }
    const thisRequestId = ++currentRequestId;
    let pending = links.length;
    let found = [];
    links.forEach(link => {
        GM_xmlhttpRequest({
            method: "GET",
            url: link.href,
            onload: function(resp) {
                if (thisRequestId !== currentRequestId) return;
                let parser = new DOMParser();
                let doc = parser.parseFromString(resp.responseText, 'text/html');
                // ƯU TIÊN lấy groupName là tên lớp/phần nhóm rõ ràng - thường nằm ở phần Thông tin lớp học phần
let groupName = '';
let pTitle = doc.querySelector('.form-control-static');
if (pTitle && /nhóm/i.test(pTitle.textContent)) {
    groupName = pTitle.textContent.trim();
} else {
    // Tìm ở small hoặc legend nếu có
    let small = doc.querySelector('small');
    if(small && /nhóm/i.test(small.textContent)) {
        groupName = small.textContent.trim();
    } else {
        // fallback
        groupName = (doc.querySelector('h2')?.textContent || link.textContent || 'Lớp/Nhóm').replace(/thông tin về lớp học phần/i, '').trim();
    }
}

                let rows = doc.querySelectorAll('#courseStudents table tbody tr');
                rows.forEach(tr => {
                    let tds = tr.querySelectorAll('td');
                    if (!tds.length) return;
                    let msv = tds[1]?.textContent.trim() || '';
                    let hoten = ((tds[2]?.textContent || '') + ' ' + (tds[3]?.textContent || '')).trim();
                    if (
                        msv.toLowerCase().includes(keyword) ||
                        hoten.toLowerCase().includes(keyword)
                    ) {
                        found.push({
                            group: groupName,
                            msv, hoten,
                            href: link.href
                        });
                    }
                });
                pending--;
                if (pending === 0 && thisRequestId === currentRequestId) {
                    if (found.length === 0) {
                        resultDivAllGroup.innerHTML = '<span style="color:#d00">Không tìm thấy sinh viên nào phù hợp.</span>';
                    } else {
                        resultDivAllGroup.innerHTML = found.map(e =>
                            `<div>
                                <b><a href="${e.href}" target="_blank" style="color:#1976D2;text-decoration:underline">${e.group}</a></b>:
                                <span style="color:#116900">${e.hoten}</span>
                                (<span style="color:#991">${e.msv}</span>)
                            </div>`
                        ).join('');
                    }
                }
            },
            onerror: function() {
                pending--;
                if (pending === 0 && thisRequestId === currentRequestId && found.length === 0) {
                    resultDivAllGroup.innerHTML = '<span style="color:#d00">Lỗi tải dữ liệu nhóm.</span>';
                }
            }
        });
    });
});

    }

    // ===== CSS Modal dùng chung =====
    GM_addStyle(`
      #husc-modal {
        position:fixed;top:60px;left:50%;transform:translateX(-50%);
        background:#fff;box-shadow:0 2px 22px #2227;padding:18px 22px 14px 22px;
        z-index:99999;max-width:520px;min-width:180px;max-height:75vh;
        overflow:auto;border-radius:10px;display:none;font-size:15.2px;
        line-height:1.58; transition: opacity 0.15s;
        animation:fade-in 0.13s;
      }
      #husc-modal-close {
        position:absolute;right:17px;top:7px;cursor:pointer;font-weight:bold;color:#e00;font-size:22px;z-index:100000;
      }
      @keyframes fade-in { from {opacity:0;} to {opacity:1;} }
    `);

    // ======= Modal dùng chung cho cả 2 chức năng =======
    let modal = document.createElement('div');
    modal.id = 'husc-modal';
    modal.innerHTML = '<span id="husc-modal-close">&times;</span><div id="husc-modal-content"></div>';
    document.body.appendChild(modal);
    const modalContent = document.getElementById('husc-modal-content');
    let modalHideTimeout = null;
    document.getElementById('husc-modal-close').onclick = function() { modal.style.display='none'; };
    modal.addEventListener('mouseenter', () => { clearTimeout(modalHideTimeout); modal.style.display='block'; });
    modal.addEventListener('mouseleave', () => {
        modalHideTimeout = setTimeout(()=>{ modal.style.display='none'; }, 250);
    });

    // ===== Hover News =====
    if(location.pathname.startsWith('/News')) {
        document.addEventListener('mouseover', function(e){
            let link = e.target.closest('a[href*="/News/Content/"]');
            if(link && !link.dataset.huscPreviewed){
                link.dataset.huscPreviewed = 1;
                link.addEventListener('mouseenter', function(){
                    clearTimeout(modalHideTimeout);
                    modal.style.display='block';
                    modalContent.innerHTML = 'Đang tải nội dung...';
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: link.href,
                        onload: function(resp){
                            let parser = new DOMParser();
                            let doc = parser.parseFromString(resp.responseText, 'text/html');
                            let result = null;
                            let h2 = Array.from(doc.querySelectorAll('h2')).find(el => el.textContent.trim().toUpperCase().includes('THÔNG BÁO'));
                            if(h2) {
                                let next = h2.nextElementSibling;
                                while (next && !(next.classList && next.classList.contains('container-fluid'))) next = next.nextElementSibling;
                                if(next && next.classList.contains('container-fluid')) result = next;
                            }
                            if (!result) result = doc.querySelector('.panel-main-content .hitec-content .row > .col-xs-12');
                            modalContent.innerHTML = result ? result.innerHTML : 'Không tìm thấy nội dung thông báo!';
                        },
                        onerror: function(){ modalContent.innerHTML = 'Lỗi tải trang!'; }
                    });
                });
                link.addEventListener('mouseleave', function(){
                    modalHideTimeout = setTimeout(()=>{ if(!modal.matches(':hover')) modal.style.display='none'; }, 200);
                });
            }
        });
    }

    // ===== Hover Inbox =====
    if(location.pathname.startsWith('/Message/Inbox')) {
        function extractMessageBody(doc) {
            let bodyBlock = doc.querySelector('.panel-main-content .container-fluid:last-of-type')
            || doc.querySelector('.hitec-content .container-fluid:last-of-type')
            || doc.querySelector('.panel-main-content')
            || doc.querySelector('.hitec-content');
            if (!bodyBlock) {
                let divs = doc.querySelectorAll('.container-fluid');
                for (let i=divs.length-1; i>=0; i--) {
                    if(divs[i].querySelector('p')) {
                        bodyBlock = divs[i];
                        break;
                    }
                }
            }
            return bodyBlock ? bodyBlock.innerHTML : '<i>Không đọc được nội dung</i>';
        }
        document.addEventListener('mouseover', function(e){
            let link = e.target.closest('a[href^="/Message/Details/"], a[href^="/Message/View/"]');
            if(link && !link.dataset.huscPreviewed){
                link.dataset.huscPreviewed = 1;
                link.addEventListener('mouseenter', function(){
                    let msgUrl = link.getAttribute('href');
                    if(!msgUrl) return;
                    clearTimeout(modalHideTimeout);
                    modal.style.display = 'block';
                    modalContent.innerHTML = '<i>Đang tải nội dung...</i>';
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: link.href,
                        onload: function(resp){
                            let parser = new DOMParser();
                            let doc = parser.parseFromString(resp.responseText, 'text/html');
                            let content = extractMessageBody(doc);
                            content = content.replace(/<footer[\s\S]*?footer>/gi,'').replace(/<script[\s\S]*?script>/gi,'');
                            modalContent.innerHTML = content.slice(0,1800);
                        },
                        onerror: function(){ modalContent.innerHTML = 'Lỗi tải trang!'; }
                    });
                });
                link.addEventListener('mouseleave', function(){
                    modalHideTimeout = setTimeout(()=>{ if(!modal.matches(':hover')) modal.style.display='none'; }, 180);
                });
            }
        });
    }
})();

(function() {
    // Lắng nghe hover/click vào link đổi học kỳ
    let configLink = document.querySelector('a[title*="thay đổi ngành học"]');
    if (!configLink) return;
    let popupBox = null;
    let popupOverlay = null;
    function closePopup() {
        popupBox && popupBox.remove();
        popupBox = null;
        popupOverlay && popupOverlay.remove();
        popupOverlay = null;
    }
    configLink.addEventListener('click', async function(e) {
        e.preventDefault();
        if (popupBox) { closePopup(); return; }
        // Tạo overlay mờ ngoài (nếu muốn)
        popupOverlay = document.createElement('div');
        popupOverlay.style.position = 'fixed';
        popupOverlay.style.left = 0; popupOverlay.style.top = 0;
        popupOverlay.style.width = '100vw';
        popupOverlay.style.height = '100vh';
        popupOverlay.style.zIndex = 10011;
        popupOverlay.onclick = closePopup;
        document.body.appendChild(popupOverlay);

        // Tạo popup
        popupBox = document.createElement('div');
        popupBox.id = 'popup-chon-hocky';
        popupBox.style = `
            position:fixed;
            top:${configLink.getBoundingClientRect().bottom + window.scrollY + 7}px;
            left:${configLink.getBoundingClientRect().left + window.scrollX}px;
            border:1.8px solid #f2c365;
            background:#fffdfa;
            max-width:480px;
            min-width:310px;
            max-height:380px;
            overflow:auto;
            border-radius:10px;
            box-shadow:0px 3px 24px #bbb7;
            padding:16px 10px 13px 18px;
            z-index:10012;
        `;
        popupBox.innerHTML = '<div style="text-align:center;font-size:15px;font-weight:600;color:#e08a00">ĐANG TẢI...</div>';

        document.body.appendChild(popupBox);

        // Lấy HTML cấu hình học kỳ
        GM_xmlhttpRequest({
            method: "GET",
            url: "/Setting/Change",
            onload: function(resp) {
                let parser = new DOMParser();
                let doc = parser.parseFromString(resp.responseText, 'text/html');
                let content = doc.querySelector('form[action="/Setting/Change"]');
                if (!content) { popupBox.innerHTML = "Không lấy được dữ liệu."; return; }

                // Copy block (bạn có thể làm đẹp thêm nếu muốn)
                popupBox.innerHTML = content.outerHTML;

                let form = popupBox.querySelector('form') || popupBox.querySelector('form[action="/Setting/Change"]');
                if (!form) form = popupBox.querySelector('form');
                // Nếu không có thẻ <form>, tìm lại vùng chứa radio
                // Đảm bảo nút "Tác nghiệp" hoạt động đúng
                let submitButton = popupBox.querySelector('button[type=submit], .btn.btn-primary');
                if (form && submitButton) {
                    submitButton.addEventListener('click', function(ev){
                        ev.preventDefault();
                        let value = popupBox.querySelector('input[name="v"]:checked');
                        if (!value) {
                            alert('Bạn phải chọn một học kỳ trước!');
                            return;
                        }
                        // Gửi request đúng value
                        let data = "v=" + encodeURIComponent(value.value);
                        GM_xmlhttpRequest({
                            method:"POST",
                            url:"/Setting/Change",
                            data: data,
                            headers:{'Content-Type':'application/x-www-form-urlencoded'},
                            onload:function(r){
                                // Thành công → reload trang
                                closePopup();
                                location.reload();
                            },
                            onerror:function(){alert('Lỗi đổi học kỳ!');}
                        });
                    });
                }

                // Auto-close khi click ngoài popup
                setTimeout(()=>{ // để tránh vừa click mở đã auto close!
                    window.addEventListener('mousedown', onOutsideClick);
                },100);
                function onOutsideClick(ev){
                    if (popupBox && !popupBox.contains(ev.target)) {
                        closePopup();
                        window.removeEventListener('mousedown', onOutsideClick);
                    }
                }
            }
        });
    });
})();

