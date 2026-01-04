// ==UserScript==
// @name         資安素養闖關-民眾自動答題系統
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自動根據題目內容選答案，順序不同也可自動答題
// @author       issac
// @match        https://isafeevent.moe.edu.tw/exam/do*
// @grant        none
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/551481/%E8%B3%87%E5%AE%89%E7%B4%A0%E9%A4%8A%E9%97%96%E9%97%9C-%E6%B0%91%E7%9C%BE%E8%87%AA%E5%8B%95%E7%AD%94%E9%A1%8C%E7%B3%BB%E7%B5%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/551481/%E8%B3%87%E5%AE%89%E7%B4%A0%E9%A4%8A%E9%97%96%E9%97%9C-%E6%B0%91%E7%9C%BE%E8%87%AA%E5%8B%95%E7%AD%94%E9%A1%8C%E7%B3%BB%E7%B5%B1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const questionBank = {
        "翔翔最近沉迷於手機遊戲": "與翔翔討論並共同訂定使用手機規則，安排合理使用和休息時間。",
        "若遇歹徒入侵裝置竊取資料": "一般大眾的資料價值不高，所以不用太過擔心歹徒會竊取帳號個資。",
        "數位∕網路性別暴力": "將朋友們的私密影像散播到朋友間的網路群組，不會有觸法的問題。",
        "正確的醫療保健常識": "政府官方衛生單位網站。",
        "網路上搜尋資料": "評估資料來源是否具備專業公信力、發布時間是否適切，以及內容是否具備一致性與完整性。",
        "小愛收到表哥訊息": "表哥有難一定要幫忙，趕快去便利商店幫他購買遊戲點數。",
        "生成式AI產出文章": "生成式AI是基於統計而不是專業知識的邏輯判斷，可能會產生誤植或矛盾的內容。",
        "AI作文批改系統": "比較人工批改與AI批改作文在創意表現方面的給分傾向差異。",
        "共同編輯": "使用共同編輯功能，可隨意刪除他人內容。",
        "電腦系統異常緩慢": "是否有不明的應用程式占用CPU或記憶體。",
        "青少年網路交友": "網友若主動示好、給予關心，就可以放心交往並配合對方請求。",
        "當你參與一個國際團隊，共同創作「世界和平日」的宣傳影片時，團員對於是否加入宗教符號意見不同，你應該如何處理？": "引導團隊討論，尋找能包容多元文化的替代設計。",
        "製作短影音": "阿賢使用名人的影像並透過deepfake技術製作搞笑影片，上架於影音平臺。",
        "侵犯著作權": "使用點對點（P2P）軟體下載有版權的電影或音樂。",
        "AI 設計時間旅行博物館": "用AI生成多時代場景與文物，並經人工查證後撰寫故事，解說其美學價值與文化意義。",
        "AI 生成文章種族歧視": "立即修改文章內容，移除歧視訊息並加入更中性的表達。",
        "小愛收到表哥傳來的訊息": "表哥有難一定要幫忙，趕快去便利商店幫他購買遊戲點數。",
        "電腦系統運行忽然變得異常緩慢": "是否有不明的應用程式占用CPU或記憶體。",
        "參與國際團隊，共同創作": "引導團隊討論，尋找能包容多元文化的替代設計。",
        "你用生成式 AI 設計「時間旅行博物館」導覽，介紹各時代美學，下列何者最合適？": "用AI生成多時代場景與文物，並經人工查證後撰寫故事，解說其美學價值與文化意義。",
        "當你發現 AI 生成的文章中存在種族歧視訊息時，你該如何處理？": "立即修改文章內容，移除歧視訊息並加入更中性的表達。"
    };

    function autoAnswer() {
        document.querySelectorAll(".question").forEach(qElem => {
            const questionText = qElem.innerText.trim();

            for (let key in questionBank) {
                if (questionText.includes(key)) {
                    const targetAnswer = questionBank[key];
                    const options = qElem.querySelectorAll(".form-check-label");

                    options.forEach(opt => {
                        if (opt.innerText.trim() === targetAnswer) {
                            const radio = opt.previousElementSibling;
                            if (radio && radio.type === "radio") {
                                radio.click();
                                console.log("[自動答題] " + questionText + " -> " + targetAnswer);
                            }
                        }
                    });
                }
            }
        });
        const submitBtn = document.querySelector(".btnSendExam");
        if (submitBtn) submitBtn.click();
    }


    window.addEventListener('load', () => {
        setInterval(autoAnswer, 1000);
    });
})();
