// ==UserScript==
// @name         Auto STV
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Tự động nhặt bảo trên sangtacviet
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
// @downloadURL https://update.greasyfork.org/scripts/557131/Auto%20STV.user.js
// @updateURL https://update.greasyfork.org/scripts/557131/Auto%20STV.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ================== AUTO COLLECT ITEMS ==================
    let waitTime = 0;
    let cType = 0;

    const randomFn = (min = 1000, max = 10000) =>
        Math.floor(Math.random() * (max - min + 1)) + min;

    const sleep = (time = randomFn(500, 3000)) =>
        new Promise((resolve) => setTimeout(resolve, time));

    const collectFn = () => new Promise((resolve) => {
        let itemInfo = { name: "", info: "", level: "", error: "", message: "", type: 3 };
        try {
            const http = new XMLHttpRequest();
            http.open('POST', '/index.php', true);
            http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            http.onreadystatechange = function () {
                if (http.readyState === 4 && http.status === 200) {
                    try {
                        itemInfo = JSON.parse(http.responseText);
                        window.g("cInfo").innerHTML = itemInfo.info;
                        window.g("cName").innerHTML = itemInfo.name;
                        window.g("cLevel").innerHTML = itemInfo.level;
                        itemInfo.message = `Tên: <b style="color:red">${itemInfo.name}</b><br/>Cấp: ${itemInfo.level}<br/>Thông tin: ${itemInfo.info}`;
                        cType = itemInfo.type;
                        resolve(itemInfo);
                    } catch (e) {
                        console.error("Parse error:", e);
                        resolve(itemInfo);
                    }
                }
            };
            http.send("ngmar=collect&ajax=collect");
        } catch (err) {
            console.error(err);
            resolve(itemInfo);
        }
    });

    const submitFn = () => new Promise((resolve) => {
        try {
            let params = "ajax=fcollect&c=137";
            if (cType === 3 || cType === 4) {
                const nname = window.g("cName").innerText;
                if (nname.length > 80) {
                    alert("Tên công pháp/vũ kỹ quá dài.");
                    return;
                }
                params += "&newname=" + encodeURI(nname) + "&newinfo=" + encodeURI(window.g("cInfo").innerText);
            }
            const http = new XMLHttpRequest();
            http.open('POST', '/index.php', true);
            http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            http.onreadystatechange = function () {
                if (http.readyState === 4 && http.status === 200) {
                    try {
                        const x = JSON.parse(http.responseText);
                        if (x.code === 1) {
                            window.ui.notif("Thành công");
                        } else {
                            window.ui.alert(x.err);
                        }
                        resolve("Nhặt bảo thành công");
                    } catch (e) {
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

    // Quan sát sự thay đổi trong content-container
    const targetNode = document.getElementById('content-container');
    if (targetNode) {
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    const btn = document.querySelector('.contentbox .btn.btn-info[id]');
                    if (btn) {
                        waitTime = randomFn();
                        window.ui.notif(`Phát hiện bảo vật - Chờ ${waitTime} ms để tự động nhặt`);
                        setTimeout(() => {
                            collectFn().then(async (item) => {
                                console.log("STVAuto: Tìm thấy " + item.name);
                                await sleep();
                                await submitFn().then(() => {
                                    let showTime = 10;
                                    const notiCountHandle = setInterval(() => {
                                        showTime--;
                                        window.ui.notif(`Nhặt thành công(${showTime})<br/>${item.message}`);
                                        if (showTime <= 1) clearInterval(notiCountHandle);
                                    }, 1000);
                                });
                            });
                            btn.remove();
                        }, waitTime);
                    }
                }
            }
        });
        observer.observe(targetNode, { childList: true, subtree: true });
    }

    // ================== NGHE SÁCH PLUS ==================
    function showSpeakerButton() {
        const btn = document.querySelector('#configBox .bg-dark button[onclick="speaker.readBook()"]');
        if (btn) btn.style.display = "";
    }
    showSpeakerButton();

})();