// ==UserScript==
// @name         SoopLive OGQ Quick Panel (임시)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  SoopLive 채팅 입력창 바로 아래에 OGQ 패널 삽입
// @author       enjei520k
// @license      MIT
// @match        https://play.sooplive.co.kr/*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/548283/SoopLive%20OGQ%20Quick%20Panel%20%28%EC%9E%84%EC%8B%9C%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548283/SoopLive%20OGQ%20Quick%20Panel%20%28%EC%9E%84%EC%8B%9C%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1️⃣ 즐겨쓰는 OGQ 목록
    // 저장된 OGQ 불러오기
    let savedOGQ = GM_getValue("myOGQ");
    let myOGQ = savedOGQ ? JSON.parse(savedOGQ) : [
        { name: "화난열새", img: "https://ogq-sticker-global-cdn-z01.sooplive.co.kr/sticker/620e7ce25eab3/16_160.png?ver=1" },
        { name: "기대열새", img: "https://ogq-sticker-global-cdn-z01.sooplive.co.kr/sticker/620e7ce25eab3/7_160.png?ver=1" },
        { name: "따봉열새", img: "https://ogq-sticker-global-cdn-z01.sooplive.co.kr/sticker/620e7ce25eab3/4_160.png?ver=1" },
        { name: "우는열새", img: "https://ogq-sticker-global-cdn-z01.sooplive.co.kr/sticker/620e7ce25eab3/3_160.png?ver=1" },
        { name: "한잔해열새", img: "https://ogq-sticker-global-cdn-z01.sooplive.co.kr/sticker/620e7ce25eab3/21_160.png?ver=1" },
        { name: "하트열새", img: "https://ogq-sticker-global-cdn-z01.sooplive.co.kr/sticker/620e7ce25eab3/9_160.png?ver=1" },
        { name: "육수르미", img: "https://ogq-sticker-global-cdn-z01.sooplive.co.kr/sticker/60f3bd5987d14/8_160.png?ver=1" },
        { name: "외톨이르미", img: "https://ogq-sticker-global-cdn-z01.sooplive.co.kr/sticker/60f3bd5987d14/17_160.png?ver=1" }
    ];

    // 2️⃣ 채팅 입력창(#actionbox)이 로드될 때까지 대기
    function waitForActionBox(callback) {
        const interval = setInterval(() => {
            const actionBox = document.querySelector("#actionbox");
            if (actionBox) {
                clearInterval(interval);
                callback(actionBox);
            }
        }, 500);
    }

    function refreshOGQPanelList(panel)
    {
    // 패널 초기화 (중복 방지)
    panel.innerHTML = "";

    // 혹시 모를 null/undefined 방지
    if (!Array.isArray(myOGQ)) {
        myOGQ = [];
    }

    myOGQ.forEach((emote, index) => {
        if (!emote || !emote.img) return; // 잘못된 항목 무시

        const wrapper = document.createElement("div");
        wrapper.style.position = "relative";
        wrapper.style.display = "inline-block";

        const btn = document.createElement("button");
        btn.style.background = "none";
        btn.style.border = "none";
        btn.style.cursor = "pointer";
        btn.style.padding = "0";

        const img = document.createElement("img");
        img.src = emote.img.toString();   // 안전하게 문자열 변환
        img.alt = emote.name || "OGQ";
        img.style.width = "40px";
        img.style.height = "40px";
        btn.appendChild(img);

        btn.addEventListener("click", () => {
            const output = document.querySelector("#chatting_area .emoticon_output");
            if (!output) return;

            const outputImg = output.querySelector(".btn_output img");
            if (outputImg) {
                outputImg.src = emote.img.toString();
                outputImg.alt = emote.name || "OGQ";
            }

            const ogq_on = document.querySelector("#chatting_area .emoticon_output");
            ogq_on.classList.add("emoti_on", "on");
        });

        // ❌ 삭제 버튼 추가
        const delBtn = document.createElement("span");
        delBtn.textContent = "✖";
        delBtn.style.position = "absolute";
        delBtn.style.top = "-5px";
        delBtn.style.right = "-5px";
        delBtn.style.background = "red";
        delBtn.style.color = "white";
        delBtn.style.fontSize = "12px";
        delBtn.style.borderRadius = "50%";
        delBtn.style.width = "16px";
        delBtn.style.height = "16px";
        delBtn.style.display = "flex";
        delBtn.style.alignItems = "center";
        delBtn.style.justifyContent = "center";
        delBtn.style.cursor = "pointer";

        delBtn.addEventListener("click", (e) => {
            e.stopPropagation(); // OGQ 버튼 클릭 이벤트 막기
            if (index >= 0 && index < myOGQ.length) {
                myOGQ.splice(index, 1); // 해당 항목 삭제
                GM_setValue("myOGQ", JSON.stringify(myOGQ)); // 저장 갱신
                refreshOGQPanelList(panel); // 패널 새로고침
            }
        });

        wrapper.appendChild(btn);
        wrapper.appendChild(delBtn);
        panel.appendChild(wrapper);
    });
    }

    // 3️⃣ 패널 생성
    function createPanel(actionBox) {
        const panel = document.createElement("div");
        panel.id = "QuickPanel";
        panel.style.display = "flex";
        panel.style.gap = "8px";
        panel.style.marginTop = "8px"; // 입력창과 간격
        panel.style.flexWrap = "wrap";  // 버튼 많으면 줄바꿈
        panel.style.marginBottom = "10px";   // 패널 밑 여백 10px

        refreshOGQPanelList(panel);

        // 4️⃣ actionbox 바로 아래에 삽입
        actionBox.insertAdjacentElement("afterend", panel);

        const emoticonOutput = document.querySelector("#chatting_area .emoticon_output");
        if (emoticonOutput) {
            emoticonOutput.style.marginBottom = "58px"; // 아래 여백 확보
            emoticonOutput.style.marginTop = "0px";     // 기존 위 여백 제거
            // 필요하면 position 조정
            // emoticonOutput.style.position = "relative";
            // emoticonOutput.style.top = "-10px";       // 10px 위로 이동

            const btnOutput = emoticonOutput.querySelector(".btn_output");
            if (btnOutput) {
                // 이미 추가된 버튼이 있으면 중복 방지
                if (!emoticonOutput.querySelector(".addQuickSlot")) {
                    const quickBtn = document.createElement("button");
                    quickBtn.type = "button";
                    quickBtn.className = "addQuickSlot";
                    quickBtn.innerHTML = "<span>퀵슬롯에 추가</span>";

                    quickBtn.addEventListener("click",() => {

                        // 퀵슬롯에 추가
                        const outputImg = emoticonOutput.querySelector(".btn_output img");
                        if (outputImg) {
                            const tempName = outputImg.src;
                            const tempURL = outputImg.src;

                            myOGQ.push({ name : tempName, img : tempURL });

                            // 저장
                            GM_setValue("myOGQ", JSON.stringify(myOGQ));
                            refreshOGQPanelList(panel);
                        }
                    });

                    // btn_output 바로 뒤에 삽입
                    btnOutput.insertAdjacentElement("afterend", quickBtn);
                }
            }
        }

        const emoticonContainerBox = document.querySelector("#emoticonContainer");
        if(emoticonContainerBox) {
            emoticonContainerBox.style.marginBottom = "58px";
        }

        console.log("✅ OGQ 패널 생성 완료");
    }

    // 5️⃣ 실행
    waitForActionBox(actionBox => {
        createPanel(actionBox);
    });
})();