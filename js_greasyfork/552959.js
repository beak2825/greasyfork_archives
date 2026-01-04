// ==UserScript==
// @name         Yojijukugo Daily
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Show a different yojijukugo every 24 hours with meanings in Japanese, Portuguese, and English on WaniKani!!
// @author       joaogadelhajp
// @match        https://www.wanikani.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552959/Yojijukugo%20Daily.user.js
// @updateURL https://update.greasyfork.org/scripts/552959/Yojijukugo%20Daily.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const yojijukugoList = [
        {
            word: "一石二鳥",
            reading: "いっせきにちょう",
            jp: "一つの行動で二つの利益を得ること。",
            pt: "Matar dois coelhos com uma cajadada só.",
            en: "Kill two birds with one stone."
        },
        {
            word: "以心伝心",
            reading: "いしんでんしん",
            jp: "言葉を使わずに心が通じ合うこと。",
            pt: "Compreensão mútua sem palavras, telepatia.",
            en: "Tacit understanding, telepathy."
        },
        {
            word: "起死回生",
            reading: "きしかいせい",
            jp: "絶望的な状態から立ち直ること。",
            pt: "Ressurgir das cinzas, reviravolta.",
            en: "Revival from the brink of death, comeback."
        },
        {
            word: "温故知新",
            reading: "おんこちしん",
            jp: "古いことを学び新しい知識を得ること。",
            pt: "Aprender com o passado para entender o presente.",
            en: "Learn new things by studying the past."
        },
        {
            word: "十人十色",
            reading: "じゅうにんといろ",
            jp: "人それぞれ好みや考えが違うこと。",
            pt: "Cada pessoa é diferente.",
            en: "To each their own; everyone is different."
        },
        {
            word: "四苦八苦",
            reading: "しくはっく",
            jp: "非常に苦労すること。",
            pt: "Passar por grandes dificuldades.",
            en: "Struggle desperately."
        },
        {
            word: "自業自得",
            reading: "じごうじとく",
            jp: "自分の行いの結果を自分が受けること。",
            pt: "Você colhe o que planta.",
            en: "You reap what you sow."
        },
        {
            word: "一喜一憂",
            reading: "いっきいちゆう",
            jp: "状況に応じて喜んだり悲しんだりすること。",
            pt: "Altos e baixos emocionais.",
            en: "Swinging between joy and despair."
        },
        {
            word: "右往左往",
            reading: "うおうさおう",
            jp: "混乱してあちこち動くこと。",
            pt: "Andar de um lado para o outro, confusão.",
            en: "Run around in confusion."
        },
        {
            word: "一期一会",
            reading: "いちごいちえ",
            jp: "一生に一度の出会いを大切にすること。",
            pt: "Cada encontro é único e precioso.",
            en: "Treasure every encounter, for it will never recur."
        },
        // ... (adicione até 50 como quiser)
    ];

    function getTodayIndex() {
        const now = new Date();
        const daysSinceEpoch = Math.floor(now.getTime() / (1000 * 60 * 60 * 24));
        return daysSinceEpoch % yojijukugoList.length;
    }

    function createYojiPopup(entry) {
        const popup = document.createElement('div');
        popup.id = "yojijukugo-popup";
        popup.style.position = 'fixed';
        popup.style.bottom = '20px';
        popup.style.right = '20px';
        popup.style.background = 'rgba(0,0,0,0.85)';
        popup.style.color = 'white';
        popup.style.padding = '14px 16px';
        popup.style.borderRadius = '10px';
        popup.style.fontSize = '14px';
        popup.style.zIndex = '9999';
        popup.style.maxWidth = '320px';
        popup.style.lineHeight = '1.6';
        popup.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
        popup.style.fontFamily = 'system-ui, sans-serif';

        popup.innerHTML = `
            <div style="font-size:18px; font-weight:bold; margin-bottom:6px;">📘 Yojijukugo Daily</div>
            <div style="font-size:20px;">${entry.word}</div>
            <div style="color:#ccc; margin-bottom:8px;">(${entry.reading})</div>
            <div><strong>🇯🇵 JP:</strong> ${entry.jp}</div>
            <div><strong>🇵🇹 PT:</strong> ${entry.pt}</div>
            <div><strong>🇺🇸 EN:</strong> ${entry.en}</div>
        `;

        document.body.appendChild(popup);
    }

    // --- Execução principal ---
    const todayYoji = yojijukugoList[getTodayIndex()];
    createYojiPopup(todayYoji);

})();