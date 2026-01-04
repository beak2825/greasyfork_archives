// ==UserScript==
// @name         STV1
// @namespace    http://tampermonkey.net/
// @version      0.1
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
// @downloadURL https://update.greasyfork.org/scripts/557459/STV1.user.js
// @updateURL https://update.greasyfork.org/scripts/557459/STV1.meta.js
// ==/UserScript==
(function () {
    'use strict';

    let count = 0;
    let waitTime = 0;
    let cType = 0;

    function postRequest(url, params) {
        return new Promise((resolve, reject) => {
            const http = new XMLHttpRequest();
            http.open('POST', url, true);
            http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            http.onreadystatechange = () => {
                if (http.readyState === 4) {
                    if (http.status === 200) {
                        resolve(http.responseText);
                    } else {
                        reject(http.statusText);
                    }
                }
            };
            http.send(params);
        });
    }

    async function collectFn() {
        let itemInfo = { name:"", info:"", level:"", error:"", message:"", type:3 };
        try {
            const response = await postRequest('/index.php', "ngmar=collect&ajax=collect");
            itemInfo = JSON.parse(response);

            const cInfo = window.g("cInfo");
            const cName = window.g("cName");
            const cLevel = window.g("cLevel");

            if (cInfo && cName && cLevel) {
                cInfo.innerHTML = itemInfo.info;
                cName.innerHTML = itemInfo.name;
                cLevel.innerHTML = itemInfo.level;
            }

            itemInfo.message = `Tên: <b style="color:red">${itemInfo.name}</b><br/>Cấp: ${itemInfo.level}<br/>Thông tin: ${itemInfo.info}`;
            cType = itemInfo.type;

            if (cType === 3 || cType === 4) {
                cInfo.contentEditable = true;
                cInfo.style.border = "1px solid black";
                cName.contentEditable = true;
                cName.style.border = "1px solid black";
                window.g("addInfo").innerHTML = "Bạn vừa đạt được công pháp/vũ kỹ, hãy đặt tên và nội dung nào.<br>";
            }
        } catch (err) {
            console.error(err);
            itemInfo.error = err;
        }
        return itemInfo;
    }

    async function submitFn() {
        try {
            let params = "ajax=fcollect&c=137";
            if (cType === 3 || cType === 4) {
                const nname = window.g("cName").innerText;
                if (nname.length > 80) {
                    alert("Tên công pháp/vũ kỹ quá dài.");
                    return "Tên quá dài";
                }
                params += "&newname=" + encodeURIComponent(nname) +
                          "&newinfo=" + encodeURIComponent(window.g("cInfo").innerText);
            }

            const response = await postRequest('/index.php', params);
            const x = JSON.parse(response);

            if (x.code === 1) {
                window.ui.notif("Thành công");
            } else {
                if (x.err.includes("không nhặt được gì")) {
                    window.ui.alert("Thật đáng tiếc, kỳ ngộ đã không cánh mà bay, có duyên gặp lại ah.");
                } else {
                    window.ui.alert(x.err);
                }
            }
            return "Nhặt bảo thành công";
        } catch (err) {
            console.error("Nhặt bảo thất bại", err);
            return "Nhặt bảo thất bại";
        }
    }

    function randomFn(min = 1000, max = 10000) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function randomTimeoutFn(time, action) {
        const delay = time || randomFn();
        console.log("STVAuto delay start in", delay, "ms");
        setTimeout(() => {
            action();
            console.log("STVAuto delay end in", delay, "ms");
        }, delay);
    }

    function sleep(time = randomFn(500, 3000)) {
        console.log("STVAuto sleep in", time, "ms");
        return new Promise(resolve => setTimeout(resolve, time));
    }

    setInterval(() => {
        const div = document.getElementById('content-container');
        if (div) {
            div.style.margin = "0px";
            div.style.maxWidth = "100%";
            div.style.padding = "0px";
        }

        const btn = document.querySelector('.contentbox .btn.btn-info[id]');
        if (count === 0) {
            waitTime = randomFn();
        }

        if (btn) {
            count++;
            window.ui.notif(`Phát hiện bảo vật (${count}) - Chờ trong ${waitTime} ms sẽ tự động nhặt vật phẩm`);
            console.log("STVAuto: Phát hiện bảo vật...", count);

            if (count === 1) {
                randomTimeoutFn(waitTime, async () => {
                    const item = await collectFn();
                    console.log("STVAuto: ------------------------");
                    console.log(`%c${item.name}, Level: ${item.level}, ${item.info}`, "color:red;font-size:16px;font-weight:bold;");

                    await sleep();
                    const result = await submitFn();

                    let showTime = 10;
                    const notiCountHandle = setInterval(() => {
                        showTime--;
                        window.ui.notif(`Nhặt thành công(${showTime})<br/>${item.message}<br/>Sử dụng ngay <b><a href="/user/0/" target="_blank">tại đây</a></b>`);
                        if (showTime <= 1) clearInterval(notiCountHandle);
                    }, 1000);

                    console.log("STVAuto:", result, item.name);
                    console.log("STVAuto: ------------------------");

                    window.jQuery('.contentbox .btn.btn-info[id]').css({
                        'font-size': '270px',
                        'filter': 'none'
                    });
                    btn.remove();
                });
            }
        } else {
            count = 0;
        }
    }, 1000);

})();
