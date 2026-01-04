// ==UserScript==
// @name        유튜브 쇼츠의 오버레이 ON/OFF버튼
// @name:en     YouTube Shorts Overlay ON/OFF Button
// @name:zh     YouTube Shorts叠加层开关按钮
// @name:ja     YouTube Shorts オーバーレイON/OFFボタン
// @version     1.0.1
// @description 유튜브 쇼츠의 오버레이 패널을 표시하거나 숨기는 버튼입니다.
// @description:en A button to show or hide the YouTube Shorts overlay.
// @description:zh 用于显示或隐藏YouTube Shorts叠加层的按钮。
// @description:ja YouTube Shortsのオーバーレイを表示または非表示にするボタンです。
// @match       https://www.youtube.com/*
// @match       https://m.youtube.com/*
// @icon        data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHJlY3QgeD0iMiIgeT0iNSIgd2lkdGg9IjIwIiBoZWlnaHQ9IjE0IiByeD0iMyIgZmlsbD0iI0ZGMDAwMCIvPjxwb2x5Z29uIHBvaW50cz0iMTAgOCAxNiAxMiAxMCAxNiIgZmlsbD0iI0ZGRkZGRiIvPjwvc3ZnPg==
// @grant       none

// @namespace https://greasyfork.org/users/1553645
// @downloadURL https://update.greasyfork.org/scripts/560590/%EC%9C%A0%ED%8A%9C%EB%B8%8C%20%EC%87%BC%EC%B8%A0%EC%9D%98%20%EC%98%A4%EB%B2%84%EB%A0%88%EC%9D%B4%20ONOFF%EB%B2%84%ED%8A%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/560590/%EC%9C%A0%ED%8A%9C%EB%B8%8C%20%EC%87%BC%EC%B8%A0%EC%9D%98%20%EC%98%A4%EB%B2%84%EB%A0%88%EC%9D%B4%20ONOFF%EB%B2%84%ED%8A%BC.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const STORAGE_KEY = "metaPanelHidden";

  function setPanelVisibility(hidden) {
    const panel = document.querySelector("#metapanel");
    if (panel) panel.style.display = hidden ? "none" : "";

    // 📱 모바일 환경일 경우 추가로 숨길 요소들
    const mobileActions = document.querySelector(
      ".reel-player-overlay-actions"
    );
    const mobileMeta = document.querySelector(
      ".reel-player-overlay-metadata.enable-shorts-overlay-update"
    );

    if (mobileActions) mobileActions.style.display = hidden ? "none" : "";
    if (mobileMeta) mobileMeta.style.display = hidden ? "none" : "";
  }

  function getPanelHiddenState() {
    return localStorage.getItem(STORAGE_KEY) === "true";
  }

  function setPanelHiddenState(hidden) {
    localStorage.setItem(STORAGE_KEY, hidden ? "true" : "false");
  }

  function getLabelText() {
    const lang = (navigator.language || "").toLowerCase();
    if (lang.startsWith("en")) return "Overlay";
    if (lang.startsWith("zh")) return "叠加层";
    if (lang.startsWith("ja")) return "オーバーレイ";
    return "오버레이";
  }

  function createToggleButtonPC() {
    if (document.querySelector("#metaToggleButton")) return;
    const buttonBar = document.querySelector("#button-bar");
    if (!buttonBar) return;

    const btnWrapper = document.createElement("label");
    btnWrapper.className = "yt-spec-button-shape-with-label";

    const btn = document.createElement("button");
    btn.id = "metaToggleButton";
    btn.className =
      "yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-l yt-spec-button-shape-next--icon-button yt-spec-button-shape-next--enable-backdrop-filter-experiment";
    btn.title = "Toggle overlay";
    btn.style.cursor = "pointer";

    const iconDiv = document.createElement("div");
    iconDiv.className = "yt-spec-button-shape-next__icon";
    Object.assign(iconDiv.style, {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "24px",
      height: "24px",
      fontSize: "16px",
      fontWeight: "bold",
    });

    const hidden = getPanelHiddenState();
    iconDiv.textContent = hidden ? "OFF" : "ON";
    setPanelVisibility(hidden);

    btn.appendChild(iconDiv);
    btnWrapper.appendChild(btn);

    const labelDiv = document.createElement("div");
    labelDiv.className = "yt-spec-button-shape-with-label__label";
    labelDiv.setAttribute("aria-hidden", "false");

    const labelText = document.createElement("span");
    labelText.className =
      "yt-core-attributed-string yt-core-attributed-string--white-space-pre-wrap yt-core-attributed-string--text-alignment-center yt-core-attributed-string--word-wrapping";
    labelText.role = "text";
    labelText.textContent = getLabelText();
    labelDiv.appendChild(labelText);
    btnWrapper.appendChild(labelDiv);

    btn.addEventListener("click", () => {
      const newHidden = !getPanelHiddenState();
      setPanelHiddenState(newHidden);
      setPanelVisibility(newHidden);
      iconDiv.textContent = newHidden ? "OFF" : "ON";
    });

    const injectPoint =
      buttonBar.querySelector("reel-action-bar-view-model") || buttonBar;
    injectPoint.prepend(btnWrapper);
  }

  function createToggleButtonMobile() {
    if (document.querySelector("#metaToggleButtonMobile")) return;

    const actions = document.querySelector(".reel-player-overlay-actions");
    if (!actions) return;

    const btn = document.createElement("button");
    btn.id = "metaToggleButtonMobile";
    btn.textContent = getPanelHiddenState() ? "OFF" : "ON";
    Object.assign(btn.style, {
      backgroundColor: "#ffffff55",
      color: "#000",
      border: "1px solid #ccc",
      borderRadius: "12px",
      padding: "4px 10px",
      fontSize: "13px",
      margin: "4px",
    });

    btn.addEventListener("click", () => {
      const newHidden = !getPanelHiddenState();
      setPanelHiddenState(newHidden);
      setPanelVisibility(newHidden);
      btn.textContent = newHidden ? "OFF" : "ON";
    });

    // actions 앞에 삽입
    actions.parentNode.insertBefore(btn, actions);
    // 초기 상태 반영
    setPanelVisibility(getPanelHiddenState());
  }

  // MutationObserver로 Shorts 로드 감지
  const observer = new MutationObserver(() => {
    if (location.host.startsWith("m.youtube.com")) {
      if (document.querySelector(".reel-player-overlay-actions"))
        createToggleButtonMobile();
    } else {
      if (document.querySelector("ytd-reel-player-overlay-renderer"))
        createToggleButtonPC();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();