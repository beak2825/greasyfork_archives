// ==UserScript==
// @name         숲 멀티뷰 시청자 제거기
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  숲 생방송 시청자 목록을 가져오고 멀티뷰를 제거합니다.
// @author       asdi
// @match        https://play.sooplive.co.kr/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555595/%EC%88%B2%20%EB%A9%80%ED%8B%B0%EB%B7%B0%20%EC%8B%9C%EC%B2%AD%EC%9E%90%20%EC%A0%9C%EA%B1%B0%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/555595/%EC%88%B2%20%EB%A9%80%ED%8B%B0%EB%B7%B0%20%EC%8B%9C%EC%B2%AD%EC%9E%90%20%EC%A0%9C%EA%B1%B0%EA%B8%B0.meta.js
// ==/UserScript==

(function () {
  "use strict";

  /**
   * 1. 상수 (Constants)
   */
  const CONSTANTS = {
    POLL_INTERVAL_MS: 500,
    STABILIZATION_MS: 2500,
    POLL_TIMEOUT_MS: 30000,
    // [개선] 페이지 객체 로딩 대기 시간
    INIT_TIMEOUT_MS: 15000,
    INIT_POLL_MS: 250,
    LS_KEYS: {
      MAP: "userIdMap",
      LIST_PREFIX: "userIdList_",
      UNIQUE_LIST_PREFIX: "uniqueUserIdList_",
      NON_LOGGED_IN_PREFIX: "nonLoggedInCount_",
    },
    GRADE_KEYS: [
      "fan",
      "manager",
      "normal",
      "subscription",
      "supporter",
      "vip",
    ],
  };

  /**
   * 2. DOM 요소 (DOM Elements)
   */
  const dom = {
    popup: null,
    nicknameTableBody: null,
    totalTableBody: null,
    totalResultsDiv: null,
    // [개선] 로딩 상태 관리를 위해 버튼 참조 추가
    getNickNameBtn: null,
  };

  // [개선] '시청자 목록 가져오기' 버튼의 로딩 상태 관리 변수
  let isFetchingNicknames = false;

  /**
   * 3. 유틸리티 함수 (Utility Functions)
   */
  const utils = {
    refineUserId: (userId) => userId.replace(/\(\d+\)$/, ""),

    getUniqueUserIds: (userIdList) => [
      ...new Set(userIdList.map(utils.refineUserId)),
    ],

    getTotalChatListLength: (userListLayer) => {
      try {
        const grades = userListLayer.userListSeparatedByGrade;
        let totalLength = 0;
        for (const key of CONSTANTS.GRADE_KEYS) {
          if (grades[key]) {
            totalLength += Math.max(0, grades[key].length - 1);
          }
        }
        return totalLength;
      } catch (e) {
        console.error("getTotalChatListLength 오류:", e);
        return 0;
      }
    },

    // [개선] 지정한 객체가 로드될 때까지 대기하는 헬퍼 (안정성)
    waitFor: (checkFn, timeoutMs = 10000, intervalMs = 250) => {
      return new Promise((resolve, reject) => {
        let totalTime = 0;
        const interval = setInterval(() => {
          if (checkFn()) {
            clearInterval(interval);
            resolve();
            return;
          }
          totalTime += intervalMs;
          if (totalTime >= timeoutMs) {
            clearInterval(interval);
            reject(new Error(`waitFor timed out after ${timeoutMs / 1000}s`));
          }
        }, intervalMs);
      });
    },

    storage: {
      get: (key) => JSON.parse(localStorage.getItem(key)),
      // [개선] localStorage.setItem이 실패할 경우 (용량 초과 등)를 대비한 try...catch
      set: (key, value) => {
        try {
          localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
          console.error(`LocalStorage 'set' 실패 (Key: ${key}):`, e);
          if (e.name === "QuotaExceededError") {
            alert(
              "LocalStorage 용량이 초과되었습니다. 일부 데이터가 저장되지 않았을 수 있습니다."
            );
          }
        }
      },
      getRaw: (key) => localStorage.getItem(key),
      // [개선] localStorage.setItem (raw) 실패 대비
      setRaw: (key, value) => {
        try {
          localStorage.setItem(key, value);
        } catch (e) {
          console.error(`LocalStorage 'setRaw' 실패 (Key: ${key}):`, e);
          if (e.name === "QuotaExceededError") {
            alert(
              "LocalStorage 용량이 초과되었습니다. 일부 데이터가 저장되지 않았을 수 있습니다."
            );
          }
        }
      },
      remove: (key) => localStorage.removeItem(key),
      clear: () => localStorage.clear(),
      getNicknameKeys: () =>
        Object.keys(localStorage).filter((key) =>
          key.startsWith(CONSTANTS.LS_KEYS.LIST_PREFIX)
        ),
    },
  };

  /**
   * 4. 렌더링 함수 (Render Functions)
   * (변경 없음)
   */

  function renderNicknameRow(data) {
    const row = dom.nicknameTableBody.insertRow();
    row.innerHTML = `
      <td style="text-align: center;">${data.nickname}</td>
      <td style="text-align: right;">${data.viewerNumber.toLocaleString()}</td>
      <td style="text-align: right;">${data.loggedInCount.toLocaleString()}</td>
      <td style="text-align: right;">${data.nonLoggedInCount.toLocaleString()}</td>
      <td style="text-align: right;">${data.loginRatio}%</td>
      <td style="text-align: right;">${data.duplicateViewCount.toLocaleString()}</td>
    `;
  }

  function renderTotalRow(data) {
    const row = dom.totalTableBody.insertRow();
    row.innerHTML = `
      <td style="text-align: center;">${data.nickname}</td>
      <td style="text-align: right;">${data.liveViewerCount.toLocaleString()}</td>
      <td style="text-align: right;">${data.nonLoggedInCount.toLocaleString()}</td>
      <td style="text-align: right;">${data.total.toLocaleString()}</td>
      <td style="text-align: right;">${data.multiViewCount.toLocaleString()}</td>
    `;
  }

  function renderTotalResults(text) {
    dom.totalResultsDiv.textContent = text;
  }

  function renderError(message) {
    dom.nicknameTableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 10px; color: red;">Error: ${message}</td></tr>`;
  }

  /**
   * 5. 핵심 로직 및 이벤트 핸들러 (Core Logic & Event Handlers)
   */

  async function handleGetNickName() {
    // [개선] 중복 클릭 방지
    if (isFetchingNicknames) {
      console.log("이미 시청자 목록을 가져오는 중입니다.");
      return;
    }

    try {
      // [개선] 로딩 상태 시작
      isFetchingNicknames = true;
      dom.getNickNameBtn.disabled = true;
      dom.getNickNameBtn.textContent = "목록 가져오는 중...";

      const nicknameElement = document.querySelector("a#infoNickName");
      if (!nicknameElement) {
        throw new Error("스트리머 닉네임 정보를 찾을 수 없습니다.");
      }
      const nickname = nicknameElement.textContent.trim();

      const viewerText = document.getElementById("nAllViewer").textContent;
      const viewerNumber = parseInt(viewerText.replace(/,/g, ""));
      console.log("시청자:", viewerNumber); // [로그 복구]

      liveView.Chat.chatUserListLayer.reconnect();
      liveView.playerController.sendChUser();

      const userList = liveView.Chat.chatUserListLayer;

      // 2. '데이터 안정화' 폴링 대기
      console.log(
        // [로그 복구]
        "[정보] 시청자 목록 로드 대기 시작... (데이터 안정화 확인 방식)"
      );
      await new Promise((resolve, reject) => {
        let lastLength = -1;
        let silenceTimer = CONSTANTS.STABILIZATION_MS;
        let totalTime = 0;
        const intervalId = setInterval(() => {
          totalTime += CONSTANTS.POLL_INTERVAL_MS;
          if (totalTime >= CONSTANTS.POLL_TIMEOUT_MS) {
            clearInterval(intervalId);
            reject(
              new Error(`시간 초과(${CONSTANTS.POLL_TIMEOUT_MS / 1000}초)`)
            );
            return;
          }

          const currentLength = utils.getTotalChatListLength(userList);

          if (currentLength > lastLength) {
            console.log(
              // [로그 복구]
              `[Polling] 데이터 수신 중... (${
                lastLength === -1 ? 0 : lastLength
              } -> ${currentLength}명)`
            );
            lastLength = currentLength;
            silenceTimer = CONSTANTS.STABILIZATION_MS;
          } else if (currentLength === lastLength && lastLength !== -1) {
            silenceTimer -= CONSTANTS.POLL_INTERVAL_MS;
            console.log(
              // [로그 복구]
              `[Polling] 데이터 안정화 확인 중... (${
                silenceTimer / 1000
              }초 남음)`
            );
          } else {
            console.log(`[Polling] 데이터 수신 대기 중...`); // [로그 복구]
          }

          if (silenceTimer <= 0) {
            clearInterval(intervalId);
            console.log(
              // [로그 복구]
              `[정보] 로딩 완료. 총 ${
                lastLength === -1 ? 0 : lastLength
              }명 확인 (전체 ${totalTime / 1000}초 소요)`
            );
            resolve(true);
          }
        }, CONSTANTS.POLL_INTERVAL_MS);
      });
      // --- 폴링 대기 종료 ---

      // 3. 폴링 완료 후 데이터 처리
      const grades = userList.userListSeparatedByGrade;
      const userIdList = CONSTANTS.GRADE_KEYS.flatMap((key) =>
        (grades[key] || []).slice(1).map((user) => user.id)
      );

      const uniqueUserIdList = utils.getUniqueUserIds(userIdList);
      const loggedInCount = uniqueUserIdList.length;

      const nonLoggedInCount =
        viewerNumber - userIdList.length > 0
          ? viewerNumber - userIdList.length
          : 0;

      const totalCalculated = loggedInCount + nonLoggedInCount;
      const loginRatio =
        totalCalculated > 0
          ? ((loggedInCount / totalCalculated) * 100).toFixed(2)
          : 0;

      const countDuplicateUsers = (userIdList) => {
        const userCountMap = new Map();
        userIdList.forEach((userId) => {
          const baseUserId = userId.replace(/\(\d+\)$/, "");
          userCountMap.set(baseUserId, (userCountMap.get(baseUserId) || 0) + 1);
        });
        const duplicateUsers = [...userCountMap].filter(
          ([_, count]) => count >= 2
        );
        return duplicateUsers.length;
      };

      const duplicateViewCount = userIdList.length - loggedInCount;

      // [콘솔 로그 5개 복구]
      console.log("중복 포함 로그인: ", userIdList.length);
      console.log("중복 제외 로그인: ", loggedInCount);
      console.log("비로그인: ", nonLoggedInCount);
      console.log("중복:", duplicateViewCount);
      console.log("중복중인 인원:", countDuplicateUsers(userIdList));

      // 4. 테이블에 결과 표시
      renderNicknameRow({
        nickname,
        viewerNumber,
        loggedInCount,
        nonLoggedInCount,
        loginRatio,
        duplicateViewCount,
      });

      // 5. ID Map에 저장 (기존 로직)
      const storedUserMap = utils.storage.get(CONSTANTS.LS_KEYS.MAP) || [];
      const refinedUserMap = new Map(storedUserMap);

      userIdList.forEach((userId) => {
        const refinedId = utils.refineUserId(userId);
        if (!refinedUserMap.has(refinedId)) {
          refinedUserMap.set(refinedId, userId);
        } else {
          const existingUserId = refinedUserMap.get(refinedId);
          const existingPriority = existingUserId.match(/\((\d+)\)$/);
          const currentPriority = userId.match(/\(\d+\)$/);

          if (
            !existingPriority ||
            (currentPriority &&
              parseInt(currentPriority[1]) < parseInt(existingPriority[1]))
          ) {
            refinedUserMap.set(refinedId, userId);
          }
        }
      });

      // 6. 로컬스토리지에 저장
      utils.storage.set(CONSTANTS.LS_KEYS.MAP, [...refinedUserMap]);
      utils.storage.set(CONSTANTS.LS_KEYS.LIST_PREFIX + nickname, userIdList);
      utils.storage.set(
        CONSTANTS.LS_KEYS.UNIQUE_LIST_PREFIX + nickname,
        uniqueUserIdList
      );
      utils.storage.setRaw(
        CONSTANTS.LS_KEYS.NON_LOGGED_IN_PREFIX + nickname,
        nonLoggedInCount
      );
    } catch (error) {
      console.error("Error in handleGetNickName:", error);
      renderError(error.message);
    } finally {
      // [개선] 성공/실패 여부와 관계없이 로딩 상태 종료
      isFetchingNicknames = false;
      dom.getNickNameBtn.disabled = false;
      dom.getNickNameBtn.textContent = "시청자 목록 가져오기";
    }
  }

  // "멀티뷰 중복 제거" 버튼 클릭 시 실행
  function handleTotalViewerCount() {
    // (기존 로직 유지)
    try {
      dom.totalTableBody.innerHTML = "";
      const nicknameKeys = utils.storage.getNicknameKeys();

      if (nicknameKeys.length === 0) {
        renderTotalResults("저장된 시청자 목록이 없습니다.");
        return;
      }

      const uniqueViewerLists = [];
      const storedUserMap = utils.storage.get(CONSTANTS.LS_KEYS.MAP);
      const refinedUserMap = new Map(storedUserMap || []);
      const nicknames = [];
      let totalViewerSum = 0;
      let totalLiveNumber = 0;
      let totalNonLoggedInCount = 0;

      nicknameKeys.forEach((key) => {
        const nickname = key.replace(CONSTANTS.LS_KEYS.LIST_PREFIX, "");
        const userIdList = utils.storage.get(key);
        const uniqueUserIdList = utils.storage.get(
          CONSTANTS.LS_KEYS.UNIQUE_LIST_PREFIX + nickname
        );
        const nonLoggedInCount =
          parseInt(
            utils.storage.getRaw(
              CONSTANTS.LS_KEYS.NON_LOGGED_IN_PREFIX + nickname
            )
          ) || 0;

        totalNonLoggedInCount += nonLoggedInCount;
        let liveViewerCount = 0;

        uniqueViewerLists.push(new Set(uniqueUserIdList));
        nicknames.push(nickname);
        totalViewerSum += uniqueUserIdList.length;

        userIdList.forEach((id) => {
          const refinedId = utils.refineUserId(id);
          if (refinedUserMap.get(refinedId) === id) {
            liveViewerCount += 1;
            refinedUserMap.delete(refinedId);
          }
        });

        renderTotalRow({
          nickname,
          liveViewerCount,
          nonLoggedInCount,
          total: liveViewerCount + nonLoggedInCount,
          multiViewCount: uniqueUserIdList.length - liveViewerCount,
        });

        totalLiveNumber += liveViewerCount;
      });

      // 전체 통계 계산 (기존 로직)
      const unionSet = new Set();
      uniqueViewerLists.forEach((set) =>
        set.forEach((viewer) => unionSet.add(viewer))
      );
      const multiViewExcludedCount = unionSet.size;

      const idCounts = {};
      uniqueViewerLists.forEach((set) => {
        set.forEach((viewer) => {
          idCounts[viewer] = (idCounts[viewer] || 0) + 1;
        });
      });

      const multiSetUsers = Object.keys(idCounts).filter(
        (viewer) => idCounts[viewer] > 1
      );
      const multiSetCount = multiSetUsers.length;

      const nicknameList = nicknames.join(", ");
      const now = new Date();
      const formattedDate = `${now.getFullYear()}년 ${
        now.getMonth() + 1
      }월 ${now.getDate()}일 ${
        ["일", "월", "화", "수", "목", "금", "토"][now.getDay()]
      } ${now.getHours()}:${now.getMinutes().toString().padStart(2, "0")}`;

      const resultText = `집계 시각 : ${formattedDate}
${nicknameList} 의 멀티뷰 제외 로그인 시청자 수 : ${multiViewExcludedCount.toLocaleString()}명
( 멀티뷰 포함 : ${totalViewerSum.toLocaleString()}, 멀티뷰로 증가한 시청자수 : ${(
        totalViewerSum - multiViewExcludedCount
      ).toLocaleString()}, 멀티뷰 중인 시청자 수 : ${multiSetCount.toLocaleString()} )`;

      renderTotalResults(resultText);
    } catch (error) {
      console.error("Error in handleTotalViewerCount:", error);
      renderTotalResults(`오류 발생: ${error.message}. (콘솔을 확인하세요)`);
    }
  }

  // "초기화" 버튼 클릭 시 실행
  function handleReset() {
    if (confirm("정말로 모든 데이터를 초기화하시겠습니까?")) {
      utils.storage.clear();
      dom.nicknameTableBody.innerHTML = "";
      dom.totalTableBody.innerHTML = "";
      renderTotalResults("결과가 여기에 표시됩니다.");
    }
  }

  // "닫기" 버튼 클릭 시 실행
  function handleClose() {
    document.body.removeChild(dom.popup);
  }

  // 스크립트 로드 시 저장된 데이터 불러오기
  function loadFromStorage() {
    try {
      const nicknameKeys = utils.storage.getNicknameKeys();

      nicknameKeys.forEach((key) => {
        const nickname = key.replace(CONSTANTS.LS_KEYS.LIST_PREFIX, "");
        const userIdList = utils.storage.get(key);
        const uniqueUserIdList = utils.storage.get(
          CONSTANTS.LS_KEYS.UNIQUE_LIST_PREFIX + nickname
        );
        const nonLoggedInCount =
          parseInt(
            utils.storage.getRaw(
              CONSTANTS.LS_KEYS.NON_LOGGED_IN_PREFIX + nickname
            )
          ) || 0;

        // (사용자 요청) 원본 로직 유지 (시청자 수 추정)
        const viewerNumber = userIdList.length + nonLoggedInCount;

        const loggedInCount = uniqueUserIdList.length;
        const totalCalculated = loggedInCount + nonLoggedInCount;
        const loginRatio =
          totalCalculated > 0
            ? ((loggedInCount / totalCalculated) * 100).toFixed(2)
            : 0;
        const duplicateViewCount = userIdList.length - loggedInCount;

        renderNicknameRow({
          nickname,
          viewerNumber,
          loggedInCount,
          nonLoggedInCount,
          loginRatio,
          duplicateViewCount,
        });
      });
    } catch (error) {
      console.error("Error loading from storage:", error);
      alert(
        "저장된 데이터를 불러오는 데 실패했습니다. 데이터가 손상되었을 수 있습니다. 초기화가 필요할 수 있습니다."
      );
    }
  }

  /**
   * 6. UI 생성 및 초기화 (UI Creation & Initialization)
   */
  function createUI() {
    const popup = document.createElement("div");
    // (UI 코드... 변경 없음)
    popup.style.position = "fixed";
    popup.style.top = "50%";
    popup.style.left = "0";
    popup.style.transform = "translateY(-50%)";
    popup.style.zIndex = "1000";
    popup.style.width = "350px";
    popup.style.padding = "15px";
    popup.style.backgroundColor = "#f8f9fa";
    popup.style.border = "1px solid #ccc";
    popup.style.borderRadius = "8px";
    popup.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
    popup.style.fontSize = "14px";
    popup.style.fontFamily = "Arial, sans-serif";
    popup.style.color = "#333";

    popup.innerHTML = `
      <div id="buttonContainer" style="display: flex; justify-content: space-between; margin-bottom: 10px;">
        <button id="getNickNameBtn" style="padding: 8px 12px; background-color: #007BFF; color: white; border: none; border-radius: 4px; cursor: pointer; flex: 1; margin-right: 5px;">시청자 목록 가져오기</button>
        <button id="totalViewerCountBtn" style="padding: 8px 12px; background-color: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; flex: 1; margin-right: 5px;">멀티뷰 중복 제거</button>
        <button id="resetButtonBtn" style="padding: 8px 12px; background-color: #ffc107; color: #212529; border: none; border-radius: 4px; cursor: pointer; flex: 1; margin-right: 5px;">초기화</button>
        <button id="closePopupBtn" style="padding: 8px 12px; background-color: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">닫기</button>
      </div>
      <div id="nicknameSection">
        <table id="nicknameResultsTable" style="width: 100%; margin-top: 10px; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #e9ecef; text-align: center; font-size: 14px;">
              <th>닉네임</th>
              <th>시청자 수</th>
              <th>로그인</th>
              <th>비로그인</th>
              <th>비율</th>
              <th>중복</th>
            </tr>
          </thead>
          <tbody>
          </tbody>
        </table>
      </div>
      <hr style="margin: 15px 0; border-top: 1px solid #ddd;">
      <div id="totalViewerSection">
        <table id="totalViewerResultsTable" style="width: 100%; margin-top: 10px; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #e9ecef; text-align: center; font-size: 14px;">
              <th>닉네임</th>
              <th>로그인</th>
              <th>비로그인</th>
              <th>합</th>
              <th>멀티뷰</th>
            </tr>
          </thead>
          <tbody>
          </tbody>
        </table>
        <div id="totalViewerResultsDiv" style="margin-top: 10px; padding: 10px; background-color: #d1e7dd; border-radius: 4px; font-size: 12px; white-space: pre-wrap;">결과가 여기에 표시됩니다.</div>
      </div>
    `;

    document.body.appendChild(popup);

    // DOM 참조 저장
    dom.popup = popup;
    dom.nicknameTableBody = document
      .getElementById("nicknameResultsTable")
      .querySelector("tbody");
    dom.totalTableBody = document
      .getElementById("totalViewerResultsTable")
      .querySelector("tbody");
    dom.totalResultsDiv = document.getElementById("totalViewerResultsDiv");
    // [개선] 버튼 참조 저장
    dom.getNickNameBtn = document.getElementById("getNickNameBtn");

    // 이벤트 리스너 연결
    dom.getNickNameBtn.addEventListener("click", handleGetNickName);
    document
      .getElementById("totalViewerCountBtn")
      .addEventListener("click", handleTotalViewerCount);
    document
      .getElementById("resetButtonBtn")
      .addEventListener("click", handleReset);
    document
      .getElementById("closePopupBtn")
      .addEventListener("click", handleClose);
  }

  /**
   * 7. 스크립트 실행
   */
  async function init() {
    try {
      // [개선] 스크립트의 핵심 의존 객체인 liveView.Chat.chatUserListLayer가 로드될 때까지 대기
      await utils.waitFor(
        () =>
          window.liveView &&
          window.liveView.Chat &&
          window.liveView.Chat.chatUserListLayer,
        CONSTANTS.INIT_TIMEOUT_MS,
        CONSTANTS.INIT_POLL_MS
      );

      console.log(
        "숲 멀티뷰 제거기: liveView 객체 확인 완료. UI를 생성합니다."
      );
      createUI();
      loadFromStorage();
    } catch (error) {
      console.error(
        "숲 멀티뷰 제거기: 스크립트 초기화 실패. (liveView 객체 로드 타임아웃)",
        error.message
      );
    }
  }

  // [개선] 페이지의 모든 리소스(스크립트 포함)가 로드된 후 init을 시도 (안정성)
  if (document.readyState === "complete") {
    init();
  } else {
    window.addEventListener("load", init);
  }
})();
