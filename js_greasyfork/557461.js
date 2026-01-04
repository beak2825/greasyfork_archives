// ==UserScript==
// @name         SangTacViet Full Reading Page, Auto Collect Items & Nghe Sach Plus
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Thiết lập đọc full màn hình, tự động nhặt bảo và hiện nút "Nghe sách" ở nguồn Faloo, dịch, sáng tác...
// @author       @Mr.J
// @match        *://*sangtacviet.pro/truyen/*
// @match        *://*sangtacviet.xyz/truyen/*
// @match        *://*sangtacviet.com/truyen/*
// @match        *://*sangtacviet.me/truyen/*
// @match        *://*sangtacviet.vip/truyen/*
// @match        *://*sangtacviet.app/truyen/*
// @match        *://*14.225.254.182/truyen/*
// @match        *://*103.82.20.93/truyen/*
// @icon         http://14.225.254.182/favicon.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557461/SangTacViet%20Full%20Reading%20Page%2C%20Auto%20Collect%20Items%20%20Nghe%20Sach%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/557461/SangTacViet%20Full%20Reading%20Page%2C%20Auto%20Collect%20Items%20%20Nghe%20Sach%20Plus.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // =========================
    // Auto Collect Logic
    // =========================
    let count = 0, waitTime = 0, cType = 0;

    const collectFn = () => new Promise((resolve) => {
        let itemInfo = { name: "", info: "", level: "", error: "", message: "", type: 3 };
        try {
            const http = new XMLHttpRequest();
            http.open('POST', '/index.php', true);
            http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            http.onreadystatechange = () => {
                if (http.readyState === 4 && http.status === 200) {
                    try {
                        itemInfo = JSON.parse(http.responseText);
                        window.g("cInfo").innerHTML = itemInfo.info;
                        window.g("cName").innerHTML = itemInfo.name;
                        window.g("cLevel").innerHTML = itemInfo.level;
                        itemInfo.message = `Tên: <b style="color:red">${itemInfo.name}</b><br/>Cấp: ${itemInfo.level}<br/>Thông tin: ${itemInfo.info}`;
                        cType = itemInfo.type;
                        if (cType === 3 || cType === 4) {
                            ["cInfo", "cName"].forEach(id => {
                                window.g(id).contentEditable = true;
                                window.g(id).style.border = "1px solid black";
                            });
                            window.g("addInfo").innerHTML = "Bạn vừa đạt được công pháp/vũ kỹ, hãy đặt tên và nội dung nào.<br>";
                        }
                        resolve(itemInfo);
                    } catch (f) {
                        alert(http.responseText);
                        itemInfo.error = http.responseText;
                        resolve(itemInfo);
                    }
                }
            };
            http.send("ngmar=collect&ajax=collect");
        } catch (err) {
            console.error(err);
            itemInfo.error = err;
            resolve(itemInfo);
        }
    });

    const submitFn = () => new Promise((resolve) => {
        try {
            let params = "ajax=fcollect&c=137";
            if (cType === 3 || cType === 4) {
                const nname = window.g("cName").innerText;
                if (nname.length > 80) return alert("Tên công pháp/vũ kỹ quá dài.");
                params += "&newname=" + encodeURI(nname) + "&newinfo=" + encodeURI(window.g("cInfo").innerText);
            }
            const http = new XMLHttpRequest();
            http.open('POST', '/index.php', true);
            http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            http.onreadystatechange = () => {
                if (http.readyState === 4 && http.status === 200) {
                    try {
                        const x = JSON.parse(http.responseText);
                        if (x.code === 1) {
                            window.ui.notif("Thành công");
                        } else {
                            window.ui.alert(x.err.includes("không nhặt được gì")
                                ? "Thật đáng tiếc, kỳ ngộ đã không cánh mà bay, có duyên gặp lại ah."
                                : x.err);
                        }
                        resolve("Nhặt bảo thành công");
                    } catch {
                        console.error("Nhặt bảo thất bại(ex2)");
                        resolve(http.responseText);
                    }
                }
            };
            http.send(params);
        } catch (err) {
            console.error(err);
            resolve("Nhặt bảo thất bại(ex1)");
        }
    });

    const randomFn = (min = 1000, max = 10000) =>
        Math.floor(Math.random() * (max - min + 1)) + min;

    const sleep = (time = randomFn(500, 3000)) =>
        new Promise(resolve => setTimeout(resolve, time));

    setInterval(() => {
        const div = document.getElementById('content-container');
        if (div) {
            div.style.margin = "0";
            div.style.maxWidth = "100%";
            div.style.padding = "0";
        }

        const btn = document.querySelector('.contentbox .btn.btn-info[id]');
        if (count === 0) waitTime = randomFn();

        if (btn) {
            count++;
            window.ui.notif(`Phát hiện bảo vật (${count}) - Chờ trong ${waitTime} ms sẽ tự động nhặt vật phẩm`);
            if (count === 1) {
                setTimeout(() => {
                    collectFn().then(async (item) => {
                        console.log("STVAuto: Tìm thấy " + item.name);
                        console.log(`%c${item.name}, Level: ${item.level}, ${item.info}`, "color:red;font-size:16px;font-weight:bold;");

                        await sleep();
                        await submitFn().then((res) => {
                            let showTime = 10;
                            const notiCountHandle = setInterval(() => {
                                showTime--;
                                window.ui.notif(`Nhặt thành công(${showTime})<br/>${item.message}<br/>Sử dụng ngay <b><a href="/user/0/" target="_blank">tại đây<a></b>`);
                                if (showTime <= 1) clearInterval(notiCountHandle);
                            }, 1000);
                            console.log("STVAuto:", res, item.name);
                        });
                    });
                    window.jQuery('.contentbox .btn.btn-info[id]').css({ 'font-size': '270px', 'filter': 'none' });
                    btn.remove();
                }, waitTime);
            }
        } else {
            count = 0;
        }
    }, 1000);

    // =========================
    // UI Fix: Hiển thị nút đọc sách
    // =========================
    function editLine() {
        const btn = document.querySelector('#configBox .bg-dark button[onclick="speaker.readBook()"]');
        if (btn) btn.style.display = "";
    }
    editLine();

})();