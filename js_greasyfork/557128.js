// ==UserScript==
// @name         STV2
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Thiết lập đọc full màn hình, tự động nhặt bảo trên sangtacviet
// @author       @Johnny
// @match        *://*sangtacviet.pro/truyen/*
// @match        *://*sangtacviet.xyz/truyen/*
// @match        *://*sangtacviet.com/truyen/*
// @match        *://*sangtacviet.me/truyen/*
// @match        *://*sangtacviet.vip/truyen/*
// @match        *://*sangtacviet.app/truyen/*
// @match        *://*14.225.254.182/truyen/*
// @icon         http://14.225.254.182/favicon.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557128/STV2.user.js
// @updateURL https://update.greasyfork.org/scripts/557128/STV2.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let count = 0, waitTime = 0, cType = 0;

    const collectFn = () => new Promise(resolve => {
        let itemInfo = { name: "", info: "", level: "", error: "", message: "", type: 3 };
        try {
            const http = new XMLHttpRequest();
            http.open('POST', '/index.php', true);
            http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            http.onreadystatechange = () => {
                if (http.readyState === 4 && http.status === 200) {
                    try {
                        itemInfo = JSON.parse(http.responseText);
                        ["cInfo", "cName", "cLevel"].forEach(id => window.g(id).innerHTML = itemInfo[id.replace("c", "").toLowerCase()]);
                        itemInfo.message = `Tên: <b style="color:red">${itemInfo.name}</b><br/>Cấp: ${itemInfo.level}<br/>Thông tin: ${itemInfo.info}`;
                        cType = itemInfo.type;
                        if ([3, 4].includes(cType)) {
                            ["cInfo", "cName"].forEach(id => {
                                window.g(id).contentEditable = true;
                                window.g(id).style.border = "1px solid black";
                            });
                            window.g("addInfo").innerHTML = "Bạn vừa đạt được công pháp/vũ kỹ, hãy đặt tên và nội dung nào.<br>";
                        }
                    } catch (err) {
                        alert(http.responseText);
                        itemInfo.error = http.responseText;
                    }
                    resolve(itemInfo);
                }
            };
            http.send("ngmar=collect&ajax=collect");
        } catch (err) {
            console.error(err);
            itemInfo.error = err;
            resolve(itemInfo);
        }
    });

    const submitFn = () => new Promise(resolve => {
        try {
            let params = "ajax=fcollect&c=137";
            if ([3, 4].includes(cType)) {
                const nname = window.g("cName").innerText;
                if (nname.length > 80) return alert("Tên công pháp/vũ kỹ quá dài.");
                params += `&newname=${encodeURIComponent(nname)}&newinfo=${encodeURIComponent(window.g("cInfo").innerText)}`;
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

    const randomFn = (min = 1000, max = 5000) =>
        Math.floor(Math.random() * (max - min + 1)) + min;

    const randomTimeoutFn = (time = randomFn(), action) => {
        console.log("STVAuto delay start in", time, "ms");
        setTimeout(() => {
            action();
            console.log("STVAuto delay end in", time, "ms");
        }, time);
    };

    const sleep = (time = randomFn(500, 3000)) =>
        new Promise(resolve => setTimeout(resolve, time));

    setInterval(() => {
        const div = document.getElementById('content-container');
        if (div) Object.assign(div.style, { margin: "0", maxWidth: "100%", padding: "0" });

        const btn = document.querySelector('.contentbox .btn.btn-info[id]');
        if (count === 0) waitTime = randomFn();

        if (btn) {
            count++;
            window.ui.notif(`Phát hiện bảo vật (${count}) - Chờ trong ${waitTime} ms sẽ tự động nhặt vật phẩm`);
            console.log("STVAuto: Phát hiện bảo vật...", count);

            if (count === 1) {
                randomTimeoutFn(waitTime, () => {
                    collectFn().then(async item => {
                        console.log("STVAuto: ------------------------");
                        console.log("STVAuto: Tìm thấy", item.name);
                        console.log(`%c${item.name}, Level: ${item.level}, ${item.info}`, "color:red;font-size:16px;font-weight:bold;");

                        await sleep();
                        await submitFn().then(msg => {
                            let showTime = 10;
                            const notiCountHandle = setInterval(() => {
                                showTime--;
                                window.ui.notif(`Nhặt thành công(${showTime})<br/>${item.message}<br/>Sử dụng ngay <b><a href="/user/0/" target="_blank">tại đây</a></b>`);
                                if (showTime <= 1) clearInterval(notiCountHandle);
                            }, 1000);
                            console.log("STVAuto:", msg, item.name);
                        });
                        console.log("STVAuto: ------------------------");
                    });
                    window.jQuery(btn).css({ fontSize: '270px', filter: 'none' });
                    btn.remove();
                });
            }
        } else {
            count = 0;
        }

        const bodyBg = document.getElementById('full');
        const contentBg = document.querySelector('#content-container .contentbox');
        if (bodyBg) bodyBg.style.backgroundColor = "rgba(0,0,0,1)";
        if (contentBg) contentBg.style.backgroundColor = "rgba(0,0,0,1)";
    }, 1000);

    localStorage.setItem('backgroundcolor', 'rgb(0,0,1)');
})();
