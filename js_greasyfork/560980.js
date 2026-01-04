// ==UserScript==
// @name         SOOP(숲) & CHZZK(치지직) 라이브 대기
// @version      1.1.0
// @description  SOOP(숲) 또는 CHZZK(치지직) 방송 대기 화면에서 시간 표시 및 방송 시작 시 자동 새로고침
// @author       백호
// @match        https://play.sooplive.co.kr/*
// @match        https://chzzk.naver.com/live/*
// @icon         https://res.sooplive.co.kr/favicon.ico
// @grant        none
// @license      MIT
// @namespace    https://greasyfork.org/users/1443830
// @downloadURL https://update.greasyfork.org/scripts/560980/SOOP%28%EC%88%B2%29%20%20CHZZK%28%EC%B9%98%EC%A7%80%EC%A7%81%29%20%EB%9D%BC%EC%9D%B4%EB%B8%8C%20%EB%8C%80%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/560980/SOOP%28%EC%88%B2%29%20%20CHZZK%28%EC%B9%98%EC%A7%80%EC%A7%81%29%20%EB%9D%BC%EC%9D%B4%EB%B8%8C%20%EB%8C%80%EA%B8%B0.meta.js
// ==/UserScript==

(async () => {
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  const formatKoreanTime = () => {
    const now = new Date();
    const weekdays = ["일","월","화","수","목","금","토"];
    const Y = now.getFullYear();
    const M = String(now.getMonth() + 1).padStart(2, "0");
    const D = String(now.getDate()).padStart(2, "0");
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    const ss = String(now.getSeconds()).padStart(2, "0");
    return `${Y}-${M}-${D} (${weekdays[now.getDay()]}) ${hh}:${mm}:${ss}`;
  };

  const soopHandler = async () => {
    const bjid = location.pathname.split("/").at(1);
    if (!bjid) return;

    while (true) {
      try {
        const infoTitle = document.querySelector(`.notBroadingInfoTitle`);
        if (infoTitle) {
          let timerEl = document.getElementById('soop-custom-timer');
          if (!timerEl) {
            infoTitle.innerHTML = `
              <div id="soop-custom-timer" style="font-size:35px; margin-bottom:10px;"></div>
              <div style="font-size:25px;">방송 시작 기다리는 중...</div>
            `;
            timerEl = document.getElementById('soop-custom-timer');
          }
          timerEl.textContent = formatKoreanTime();
        }

        const response = await fetch(
          "https://live.sooplive.co.kr/afreeca/player_live_api.php",
          {
            headers: { "content-type": "application/x-www-form-urlencoded" },
            body: `bid=${bjid}&type=live&player_type=html5`,
            method: "POST",
          }
        ).then(r => r.json());

        const bno = response?.CHANNEL?.BNO;
        const currentBno = location.pathname.split("/").at(-1);

        if (bno && bno !== "0" && bno !== currentBno) {
          location.href = `https://play.sooplive.co.kr/${bjid}/${bno}`;
          break;
        }
      } catch (e) {}
      await sleep(1000);
    }
  };

  const chzzkHandler = () => {
    const findOfflineTitle = () => {
      const xpath = "//strong[contains(text(), '채널이 오프라인 상태입니다') or contains(text(), '방송 시작 기다리는 중...')]";
      return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    };

    setInterval(() => {
      const node = findOfflineTitle();
      
      if (node) {
        if (node.id !== "chzzk-title-checked") {
          node.id = "chzzk-title-checked";
          node.textContent = "방송 시작 기다리는 중...";
          node.style.fontSize = "25px";
          
          const timeNode = document.createElement("div");
          timeNode.id = "chzzk-custom-timer";
          timeNode.style.cssText = "font-size:35px; font-weight:bold; color:white; margin-bottom:10px; text-align:center;";
          node.insertAdjacentElement("beforebegin", timeNode);
        }

        const timeDisplay = document.getElementById('chzzk-custom-timer');
        if (timeDisplay) timeDisplay.textContent = formatKoreanTime();
      } else {
        if (document.getElementById('chzzk-custom-timer')) {
          location.reload();
        }
      }
    }, 1000);
  };

  if (location.hostname.includes("sooplive.co.kr")) {
    soopHandler();
  } else if (location.hostname.includes("chzzk.naver.com")) {
    chzzkHandler();
  }
})();